#define ARDUINO_USB_CDC_ON_BOOT 1

#include <Arduino.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include <mbedtls/md.h>
#include <time.h>

extern "C" {
  #include "pb.h"
  #include "pb_encode.h"
  #include "sensor.pb.h"
}

// -----------------------------
// WiFi + backend config
// -----------------------------
const char* ssid      = "Oracle";
const char* password  = "Joy@2019";
const char* serverUrl = "http://10.0.0.76:8000/ingest/sensor";

// Device + auth
const uint32_t DEVICE_ID = 1;
const char* apiKey       = "SECRET123";
const char* SECRET_KEY   = "super-secret-key";

// -----------------------------
// Sensor pins
// -----------------------------
#define MQ135_ADC_PIN      1
#define RAIN_ADC_PIN       2
#define WATER_LEVEL_PIN    3
#define BATTERY_ADC_PIN    4

// -----------------------------
// HMAC helper
// -----------------------------
String computeHmac(const uint8_t* data, size_t len) {
  unsigned char hmacResult[32];

  mbedtls_md_context_t ctx;
  mbedtls_md_init(&ctx);
  mbedtls_md_setup(&ctx, mbedtls_md_info_from_type(MBEDTLS_MD_SHA256), 1);
  mbedtls_md_hmac_starts(&ctx, (const unsigned char*)SECRET_KEY, strlen(SECRET_KEY));
  mbedtls_md_hmac_update(&ctx, data, len);
  mbedtls_md_hmac_finish(&ctx, hmacResult);
  mbedtls_md_free(&ctx);

  char hexStr[65];
  for (int i = 0; i < 32; i++) {
    sprintf(hexStr + (i * 2), "%02x", hmacResult[i]);
  }
  hexStr[64] = 0;

  return String(hexStr);
}

// -----------------------------
// REAL SENSOR HELPERS
// -----------------------------
float readAirQualityRaw() { return (float)analogRead(MQ135_ADC_PIN); }
float readRainRaw()       { return (float)analogRead(RAIN_ADC_PIN); }
float readWaterLevelRaw() { return (float)analogRead(WATER_LEVEL_PIN); }

uint32_t readBatteryMv() {
  uint16_t raw = analogRead(BATTERY_ADC_PIN);
  float v = (raw / 4095.0f) * 3.3f * 2.0f;
  return (uint32_t)(v * 1000.0f);
}

// Dummy GPS
double readLatDeg() { return 40.4406; }
double readLonDeg() { return -79.9959; }

// -----------------------------
// ⭐ VIRTUAL BME280 GENERATOR
// -----------------------------
float virtualTemperature() {
  return 15.0 + (float)(esp_random() % 1000) / 100.0;  // 15.00–25.00 °C
}

float virtualHumidity() {
  return 30.0 + (float)(esp_random() % 2000) / 100.0;  // 30–50 %
}

float virtualPressure() {
  return 980.0 + (float)(esp_random() % 5000) / 100.0; // 980–1030 hPa
}

// -----------------------------
// Time / NTP helper
// -----------------------------
void initTime() {
  configTime(0, 0, "pool.ntp.org", "time.nist.gov");

  Serial.print("Syncing time via NTP");
  time_t now = 0;
  int retries = 0;
  while (now < 1700000000 && retries < 30) {
    delay(500);
    Serial.print(".");
    now = time(nullptr);
    retries++;
  }
  Serial.println();

  if (now >= 1700000000) {
    Serial.print("Time synced: ");
    Serial.println(ctime(&now));
  } else {
    Serial.println("⚠️  Time sync failed, timestamps may be wrong.");
  }
}

// -----------------------------
// Setup
// -----------------------------
void setup() {
  delay(2000);
  Serial.begin(115200);
  Serial.setTxTimeoutMs(0);

  Serial.println("ESP32-S3 WiFi + Protobuf + HMAC → FastAPI ingest");

  analogReadResolution(12);

  WiFi.begin(ssid, password);
  Serial.print("Connecting to WiFi");

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("\nWiFi connected!");
  Serial.print("IP Address: ");
  Serial.println(WiFi.localIP());

  initTime();
}

// -----------------------------
// Main loop
// -----------------------------
void loop() {
  // 1. Build protobuf message
  climate_SensorReading msg = climate_SensorReading_init_zero;

  msg.device_id = DEVICE_ID;

  // ⭐ VIRTUAL ENVIRONMENTAL VALUES
  msg.temperature_c    = virtualTemperature();
  msg.humidity_percent = virtualHumidity();
  msg.pressure_hpa     = virtualPressure();

  // REAL SENSORS
  msg.air_quality_raw  = readAirQualityRaw();
  msg.rain_level_raw   = readRainRaw();
  msg.water_level_raw  = readWaterLevelRaw();
  msg.battery_mv       = readBatteryMv();

  // GNSS
  msg.gnss_enabled     = true;
  msg.gnss_fix_valid   = true;
  msg.latitude_deg     = readLatDeg();
  msg.longitude_deg    = readLonDeg();
  msg.altitude_m       = 0.0f;
  msg.hdop             = 1.0f;

  // Timestamp
  time_t now = time(nullptr);
  uint64_t now_ms = (now > 0) ? (uint64_t)now * 1000ULL : (uint64_t)millis();
  msg.timestamp_ms = now_ms;

  // 2. Encode protobuf
  uint8_t buffer[128];
  pb_ostream_t stream = pb_ostream_from_buffer(buffer, sizeof(buffer));

  if (!pb_encode(&stream, &climate_SensorReading_msg, &msg)) {
    Serial.print("❌ Encode error: ");
    Serial.println(PB_GET_ERROR(&stream));
    delay(5000);
    return;
  }

  size_t msg_len = stream.bytes_written;
  Serial.print("Encoded bytes: ");
  Serial.println(msg_len);

  // 3. HMAC
  String signature = computeHmac(buffer, msg_len);
  Serial.print("Signature: ");
  Serial.println(signature);

  // 4. POST
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;

    http.begin(serverUrl);
    http.addHeader("Content-Type", "application/octet-stream");
    http.addHeader("api-key", apiKey);
    http.addHeader("X-Signature", signature);

    int code = http.POST(buffer, msg_len);

    Serial.print("HTTP Response: ");
    Serial.println(code);

    if (code > 0) {
      Serial.println(http.getString());
    }

    http.end();
  } else {
    Serial.println("❌ WiFi disconnected, reconnecting...");
    WiFi.reconnect();
  }

  delay(5000);
}