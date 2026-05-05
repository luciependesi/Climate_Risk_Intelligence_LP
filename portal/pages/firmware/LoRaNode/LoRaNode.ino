#include <Arduino.h>
#include <Wire.h>
#include <SPI.h>
#include <LoRa.h>
#include <TinyGPSPlus.h>
#include <Adafruit_BME280.h>

TinyGPSPlus gps;
HardwareSerial GPSSerial(1);
Adafruit_BME280 bme;

typedef struct __attribute__((packed)) {
  uint32_t ts;
  int16_t  temp_c_x10;
  uint16_t hum_x10;
  uint16_t mq135;
  uint16_t water_x100;
  uint16_t rain_x100;
  uint16_t batt_mv;
  int16_t  rssi;
  int32_t  lat_e7;
  int32_t  lon_e7;
} payload_t;

payload_t payload;

// ---- PIN DEFINES (adjust to your board) ----
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
#define LORA_BUSY      12
#define LORA_DIO1      13
#define LORA_BAND      915E6

// ---- Helpers ----

float readMQ135() {
  int raw = analogRead(PIN_MQ135);
  return (float)raw;  // you can calibrate later
}

float readWaterLevel() {
  int raw = analogRead(PIN_WATER);
  return raw / 4095.0f;  // 0–1
}

float readRain() {
  int raw = analogRead(PIN_RAIN);
  return raw / 4095.0f;  // 0–1
}

float readBatteryVoltage() {
  int raw = analogRead(PIN_BATT);
  // adjust divider + ADC calibration
  float v = (raw / 4095.0f) * 3.3f * 2.0f; // example: 2:1 divider
  return v;
}

void readGPS() {
  while (GPSSerial.available()) {
    gps.encode(GPSSerial.read());
  }
}

void setupSensors() {
  Wire.begin(I2C_SDA, I2C_SCL);
  bme.begin(0x76); // or 0x77

  analogReadResolution(12);
}

void setupGPS() {
  GPSSerial.begin(9600, SERIAL_8N1, GPS_RX, GPS_TX);
}

void setupLoRa() {
  SPI.begin(LORA_SCK, LORA_MISO, LORA_MOSI, LORA_CS);
  LoRa.setPins(LORA_CS, LORA_RST, LORA_DIO1);
  if (!LoRa.begin(LORA_BAND)) {
    Serial.println("LoRa init failed");
    while (1) delay(1000);
  }
}

void setup() {
  Serial.begin(115200);
  delay(1000);

  setupSensors();
  setupGPS();
  setupLoRa();

  Serial.println("Node ready");
}

void loop() {
  // 1) Update GPS
  readGPS();

  // 2) Read sensors
  float temp_c = bme.readTemperature();
  float hum = bme.readHumidity();
  float mq = readMQ135();
  float water = readWaterLevel();
  float rain = readRain();
  float batt_v = readBatteryVoltage();

  // 3) Fill payload
  payload.ts = (uint32_t) (millis() / 1000); // or use RTC/epoch if available
  payload.temp_c_x10 = (int16_t)(temp_c * 10.0f);
  payload.hum_x10 = (uint16_t)(hum * 10.0f);
  payload.mq135 = (uint16_t)mq;
  payload.water_x100 = (uint16_t)(water * 100.0f);
  payload.rain_x100 = (uint16_t)(rain * 100.0f);
  payload.batt_mv = (uint16_t)(batt_v * 1000.0f);
  payload.rssi = 0; // you can fill from last RX if you do bidirectional

  if (gps.location.isValid()) {
    payload.lat_e7 = (int32_t)(gps.location.lat() * 1e7);
    payload.lon_e7 = (int32_t)(gps.location.lng() * 1e7);
  } else {
    payload.lat_e7 = 0;
    payload.lon_e7 = 0;
  }

  // 4) Transmit over LoRa
  LoRa.beginPacket();
  LoRa.write((uint8_t*)&payload, sizeof(payload));
  LoRa.endPacket();

  // 5) Debug
  Serial.print("TX temp=");
  Serial.print(temp_c);
  Serial.print(" hum=");
  Serial.print(hum);
  Serial.print(" mq=");
  Serial.print(mq);
  Serial.print(" water=");
  Serial.print(water);
  Serial.print(" rain=");
  Serial.print(rain);
  Serial.print(" batt=");
  Serial.print(batt_v);
  Serial.print(" lat=");
  Serial.print(payload.lat_e7 / 1e7);
  Serial.print(" lon=");
  Serial.println(payload.lon_e7 / 1e7);

  delay(5000);
}