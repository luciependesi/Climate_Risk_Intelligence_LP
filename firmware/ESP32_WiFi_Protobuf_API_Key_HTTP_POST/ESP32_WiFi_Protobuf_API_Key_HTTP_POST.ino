//Protobuf + JSON, with NTP, battery, MQ135
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include "pb_encode.h"
#include "sensor_reading.pb.h"

// -----------------------------
// CONFIGURATION
// -----------------------------
const char* ssid = "Oracle";
const char* password = "Joy@2019";

const char* serverUrl = "http://10.0.0.76:8000/device/ingest";  // JSON ingestion endpoint
const char* apiKey = "SECRET123";   // optional header

// -----------------------------
// OPTIONAL: ISO8601 timestamp
// -----------------------------
String iso8601Now() {
  // Replace with NTP if you want real time
  unsigned long ms = millis();
  unsigned long seconds = ms / 1000;
  return "2026-03-29T20:31:00Z";  // placeholder
}

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
  // 2. Encode protobuf (for your internal use)
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
  // 3. SEND JSON TO BACKEND
  // -----------------------------
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;

    Serial.print("Posting to: ");
    Serial.println(serverUrl);

    http.begin(serverUrl);
    http.addHeader("Content-Type", "application/json");
    http.addHeader("api-key", apiKey);

    // Build JSON payload
    StaticJsonDocument<256> doc;
    doc["device_id"] = "ESP32_001";
    doc["timestamp"] = iso8601Now();
    doc["temperature_c"] = msg.temperature_c;
    doc["humidity"] = msg.humidity_pct;
    doc["battery_v"] = 3.78;  // replace with ADC reading if needed
    doc["rssi"] = WiFi.RSSI();

    String payload;
    serializeJson(doc, payload);

    Serial.println("JSON Payload:");
    Serial.println(payload);

    int httpResponseCode = http.POST(payload);

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