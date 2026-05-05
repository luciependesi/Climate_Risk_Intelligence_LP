#include <Arduino.h>
#include <pb.h>
#include <pb_encode.h>
#include <pb_decode.h>
#include "sensor_reading.pb.h"

uint8_t buffer[128];

void setup() {
  Serial.begin(115200);
  delay(2000);
}

void loop() {
  // Example: your live sensor values
  float temp = 24.3;
  float hum  = 23.9;
  float pres = 1021.0;

  // Create protobuf message
  SensorReading msg = SensorReading_init_zero;

  // Assign string safely (requires max_size in .proto)
  strncpy(msg.device_id, "ESP32_001", sizeof(msg.device_id));

  msg.timestamp_ms = millis();
  msg.temperature_c = temp;
  msg.humidity_pct = hum;
  msg.pressure_hpa = pres;

  msg.mq135_ppm = 300.0;
  msg.rain_level = 0.0;
  msg.water_level = 12.3;
  msg.is_virtual = true;

  // Encode protobuf
  pb_ostream_t stream = pb_ostream_from_buffer(buffer, sizeof(buffer));

  if (!pb_encode(&stream, SensorReading_fields, &msg)) {
    Serial.print("Encode failed: ");
    Serial.println(PB_GET_ERROR(&stream));
    delay(2000);
    return;
  }

  size_t len = stream.bytes_written;

  Serial.print("Encoded size: ");
  Serial.println(len);

  Serial.print("Bytes: ");
  for (size_t i = 0; i < len; i++) {
    Serial.print(buffer[i], HEX);
    Serial.print(" ");
  }
  Serial.println("\n");

  delay(2000);
}