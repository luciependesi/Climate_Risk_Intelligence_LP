#include <Arduino.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include <Wire.h>
#include <SPI.h>
#include <LoRa.h>
#include <TinyGPSPlus.h>
#include <Adafruit_BME280.h>
#include <time.h>

// ---------- WiFi + NTP ----------
const char* WIFI_SSID     = "Oracle";
const char* WIFI_PASSWORD = "Joy@2019";
const char* NTP_SERVER    = "pool.ntp.org";
const long  GMT_OFFSET    = 0;
const int   DAYLIGHT_OFFSET = 0;

// ---------- Backend ----------
const char* BACKEND_URL = "http://your-backend/ingest/iot-reading";

// ---------- GNSS ----------
TinyGPSPlus gps;
HardwareSerial GPSSerial(1);

// ---------- BME280 ----------
Adafruit_BME280 bme;

// ---------- Pin Mapping ----------
#define I2C_SDA        8
#define I2C_SCL        9

#define PIN_MQ135      1
#define PIN_WATER      2
#define PIN_RAIN       3
#define PIN_BATT       4

#define GPS_RX         17
#define GPS_TX         18

#define LORA_SCK       5
#define LORA_MISO      6
#define LORA_MOSI      7
#define LORA_CS        10
#define LORA_RST       11
#define LORA_DIO1      13
#define LORA_BAND      915E6


// ======================================================
//  CALIBRATED MQ135 → PPM
// ======================================================
float MQ135_RL = 10.0;   // kΩ load resistor
float MQ135_R0 = 10.0;   // baseline resistance in clean air (calibrate later)

float mq135_ppm(float raw_adc) {
    float Vadc = (raw_adc / 4095.0f) * 3.3f;
    float Rs = (3.3f - Vadc) * MQ135_RL / Vadc;

    float ratio = Rs / MQ135_R0;
    float ppm = 116.6020682 * pow(ratio, -2.769034857);

    return ppm;
}


// ======================================================
//  MOVING‑AVERAGE SMOOTHING FOR WATER + RAIN
// ======================================================
float water_avg = 0;
float rain_avg = 0;
const float SMOOTHING = 0.2;

float smooth(float previous, float new_value) {
    return (SMOOTHING * new_value) + ((1.0 - SMOOTHING) * previous);
}

float readWaterLevel() {
    int raw = analogRead(PIN_WATER);
    float normalized = raw / 4095.0f;
    water_avg = smooth(water_avg, normalized);
    return water_avg;
}

float readRain() {
    int raw = analogRead(PIN_RAIN);
    float normalized = 1.0f - (raw / 4095.0f); // inverted
    rain_avg = smooth(rain_avg, normalized);
    return rain_avg;
}


// ======================================================
//  GPS FIX QUALITY SCORING
// ======================================================
int gps_fix_quality() {
    if (!gps.location.isValid()) return 0;

    float hdop = gps.hdop.hdop();
    if (hdop == 0 || hdop > 10) return 1;   // poor
    if (hdop > 3) return 2;                 // medium
    return 3;                               // good
}


// ======================================================
//  UPDATED PACKED STRUCT (ADDS PRESSURE + CALIBRATED MQ135)
// ======================================================
typedef struct __attribute__((packed)) {
  uint32_t ts;
  int16_t  temp_c_x10;
  uint16_t hum_x10;
  uint16_t pressure_x10;
  uint16_t mq135_ppm_x10;
  uint16_t water_x100;
  uint16_t rain_x100;
  uint16_t batt_mv;
  int16_t  rssi;
  int32_t  lat_e7;
  int32_t  lon_e7;
} payload_t;

payload_t payload;


// ======================================================
//  HELPERS
// ======================================================
void connectWiFi() {
  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println(" connected");
}

void setupNTP() {
  configTime(GMT_OFFSET, DAYLIGHT_OFFSET, NTP_SERVER);
  Serial.println("Waiting for NTP time...");
  struct tm timeinfo;
  while (!getLocalTime(&timeinfo)) {
    Serial.print(".");
    delay(500);
  }
  Serial.println("\nTime synced");
}

uint32_t getUnixTime() {
  struct tm timeinfo;
  if (getLocalTime(&timeinfo)) {
    return (uint32_t)mktime(&timeinfo);
  }
  return millis() / 1000;
}

float readBatteryVoltage() {
  int raw = analogRead(PIN_BATT);
  float v = (raw / 4095.0f) * 3.3f * 2.0f; // adjust divider
  return v;
}

void readGPS() {
  while (GPSSerial.available()) {
    gps.encode(GPSSerial.read());
  }
}


// ======================================================
//  JSON SENDER
// ======================================================
void sendJSONOverHTTP(const payload_t& p) {
  if (WiFi.status() != WL_CONNECTED) return;

  HTTPClient http;
  http.begin(BACKEND_URL);
  http.addHeader("Content-Type", "application/json");

  String json = "{";
  json += "\"device_id\":\"esp32-lora-node\",";
  json += "\"timestamp_ms\":" + String((uint64_t)p.ts * 1000ULL) + ",";
  json += "\"temperature_c\":" + String(p.temp_c_x10 / 10.0f) + ",";
  json += "\"humidity_pct\":" + String(p.hum_x10 / 10.0f) + ",";
  json += "\"pressure_hpa\":" + String(p.pressure_x10 / 10.0f) + ",";
  json += "\"mq135_ppm\":" + String(p.mq135_ppm_x10 / 10.0f) + ",";
  json += "\"water_level\":" + String(p.water_x100 / 100.0f) + ",";
  json += "\"rain_intensity\":" + String(p.rain_x100 / 100.0f) + ",";
  json += "\"battery_v\":" + String(p.batt_mv / 1000.0f) + ",";
  json += "\"latitude\":" + String(p.lat_e7 / 1e7, 7) + ",";
  json += "\"longitude\":" + String(p.lon_e7 / 1e7, 7) + ",";
  json += "\"is_virtual\":false";
  json += "}";

  int code = http.POST(json);
  Serial.print("HTTP POST -> ");
  Serial.println(code);

  http.end();
}


// ======================================================
//  SETUP
// ======================================================
void setup() {
  Serial.begin(115200);
  delay(1000);

  Wire.begin(I2C_SDA, I2C_SCL);
  bme.begin(0x76);

  analogReadResolution(12);

  GPSSerial.begin(9600, SERIAL_8N1, GPS_RX, GPS_TX);

  SPI.begin(LORA_SCK, LORA_MISO, LORA_MOSI, LORA_CS);
  LoRa.setPins(LORA_CS, LORA_RST, LORA_DIO1);
  LoRa.begin(LORA_BAND);

  connectWiFi();
  setupNTP();

  Serial.println("LoRaNode ready");
}


// ======================================================
//  LOOP  ← THIS IS WHERE THE PAYLOAD FILL GOES
// ======================================================
void loop() {

  // GPS update
  readGPS();

  // Sensor reads
  float temp_c = bme.readTemperature();
  float hum = bme.readHumidity();
  float mq = analogRead(PIN_MQ135);
  float water = readWaterLevel();
  float rain = readRain();
  float batt_v = readBatteryVoltage();

  // ======================================================
  //  FILL PAYLOAD (UPDATED + CALIBRATED)
  // ======================================================
  payload.ts = getUnixTime();
  payload.temp_c_x10 = (int16_t)(temp_c * 10.0f);
  payload.hum_x10 = (uint16_t)(hum * 10.0f);
  payload.pressure_x10 = (uint16_t)((bme.readPressure() / 100.0f) * 10.0f);

  float mq_ppm = mq135_ppm(mq);
  payload.mq135_ppm_x10 = (uint16_t)(mq_ppm * 10.0f);

  payload.water_x100 = (uint16_t)(water * 100.0f);
  payload.rain_x100 = (uint16_t)(rain * 100.0f);
  payload.batt_mv = (uint16_t)(batt_v * 1000.0f);
  payload.rssi = 0;

  if (gps.location.isValid()) {
      payload.lat_e7 = (int32_t)(gps.location.lat() * 1e7);
      payload.lon_e7 = (int32_t)(gps.location.lng() * 1e7);
  } else {
      payload.lat_e7 = 0;
      payload.lon_e7 = 0;
  }

  // LoRa TX
  LoRa.beginPacket();
  LoRa.write((uint8_t*)&payload, sizeof(payload));
  LoRa.endPacket();

  // HTTP JSON
  sendJSONOverHTTP(payload);

  delay(5000);
}