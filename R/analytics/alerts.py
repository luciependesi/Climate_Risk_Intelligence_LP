# This module checks the latest risk assessments and sends alerts if certain conditions are met.
# analytics/alerts.py
import psycopg2
import smtplib  # or any other channel you choose

DSN = "dbname=climate user=postgres password=postgres host=localhost port=5432"

def check_alerts():
  conn = psycopg2.connect(DSN)
  cur = conn.cursor()

  cur.execute("""
    SELECT r.device_id, r.ts_ms, r.risk_level, r.risk_score,
           c.water_level_mm, c.mq135_ppm, c.anomaly_flag,
           f.forecast_mm
    FROM climate_risk_latest r
    JOIN climate_clean c
      ON r.device_id = c.device_id AND r.ts_ms = c.ts_ms
    LEFT JOIN climate_forecast f
      ON r.device_id = f.device_id AND f.step = 1
  """)
  rows = cur.fetchall()

  for row in rows:
    device_id, ts_ms, risk_level, risk_score, water_mm, mq135, anomaly_flag, forecast_mm = row

    triggers = []

    if risk_score is not None and risk_score > 80:
      triggers.append("risk_score>80")

    if anomaly_flag == 1:
      triggers.append("anomaly_flag")

    if forecast_mm is not None and forecast_mm > 200:
      triggers.append("forecast_high")

    if water_mm is not None and water_mm > 150:
      triggers.append("water_high")

    if triggers:
      print(f"[ALERT] device {device_id} triggers: {triggers}")

  cur.close()
  conn.close()

if __name__ == "__main__":
  check_alerts()