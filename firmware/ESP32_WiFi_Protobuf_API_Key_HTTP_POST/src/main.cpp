#include <WiFi.h>
#include <HTTPClient.h>
#include "pb_encode.h"
#include "sensor_reading.pb.h"

// -----------------------------
// CONFIGURATION
// -----------------------------
const char* ssid = "Oracle";
const char* password = "Joy@2019";

const char* serverUrl = "http://10.0.0.76:8000/ingest";
const char* apiKey = "SECRET123";   // from /register

// -----------------------------
// SETUP
// -----------------------------
void setup() {
  Serial.begin(115200);
  delay(1000);

  Serial.println("Connecting to WiFi...");
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("\nWiFi connected!");
  Serial.print("IP Address: ");
  Serial.println(WiFi.localIP());
}

// -----------------------------
// MAIN LOOP
// -----------------------------
void loop() {
  // -----------------------------
  // 1. Build protobuf message
  // -----------------------------
  SensorReading msg = SensorReading_init_zero;

  strcpy(msg.device_id, "ESP32_001");
  msg.temperature_c = 24.3;
  msg.humidity_pct = 23.9;
  msg.pressure_hpa = 1021;
  msg.mq135_ppm = 300;
  msg.water_level = 12.3;
  msg.is_virtual = false;
  msg.timestamp_ms = millis();

  // -----------------------------
  // 2. Encode protobuf
  // -----------------------------
  uint8_t buffer[128];
  pb_ostream_t stream = pb_ostream_from_buffer(buffer, sizeof(buffer));

  if (!pb_encode(&stream, SensorReading_fields, &msg)) {
    Serial.println("❌ Protobuf encoding failed!");
    delay(5000);
    return;
  }

  size_t msg_length = stream.bytes_written;

  Serial.print("Encoded size: ");
  Serial.println(msg_length);

  // -----------------------------
  // 3. Send HTTP POST
  // -----------------------------
  if (WiFi.status() == WL_CONNECTED) {
    Serial.print("ESP32 IP: ");
Serial.println(WiFi.localIP());

    HTTPClient http;
    Serial.print("Posting to: ");
Serial.println(serverUrl);
    http.begin(serverUrl);

    http.addHeader("Content-Type", "application/octet-stream");
    http.addHeader("api-key", apiKey);

    int httpResponseCode = http.POST(buffer, msg_length);

    Serial.print("HTTP Response: ");
    Serial.println(httpResponseCode);

    if (httpResponseCode > 0) {
      Serial.println("Server says:");
      Serial.println(http.getString());
    } else {
      Serial.println("❌ POST failed — will retry next cycle");
    }

    http.end();
  } else {
    Serial.println("❌ WiFi disconnected — retrying...");
    WiFi.reconnect();
  }

  // -----------------------------
  // 4. Wait 5 seconds
  // -----------------------------
  delay(5000);
}