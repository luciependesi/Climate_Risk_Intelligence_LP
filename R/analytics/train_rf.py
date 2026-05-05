# this script trains a Random Forest model on the cleaned data and writes predictions to the database
# analytics/train_rf.py
import pandas as pd
import psycopg2
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.impute import SimpleImputer
import numpy as np

DSN = "dbname=climate user=postgres password=postgres host=localhost port=5432"

def load_data():
    conn = psycopg2.connect(DSN)
    df = pd.read_sql("""
        SELECT device_id, ts_ms,
               mq135_ppm, water_level_mm, rain_intensity_x10,
               battery_mv, lat_e7, lon_e7,
               risk_level
        FROM climate_clean
        WHERE risk_level IS NOT NULL
    """, conn)
    conn.close()
    return df

def synthetic_fallback(y):
    classes = y.unique()
    if len(classes) == 1:
        # inject one synthetic opposite class
        y.iloc[0] = "Medium" if classes[0] == "Low" else "Low"
    return y

def train_and_write():
    df = load_data()
    if df.empty:
        return

    y = df["risk_level"].copy()
    y = synthetic_fallback(y)

    X = df[["mq135_ppm", "water_level_mm", "rain_intensity_x10", "battery_mv"]]

    imputer = SimpleImputer(strategy="median")
    X_imp = imputer.fit_transform(X)

    rf = RandomForestClassifier(n_estimators=100, random_state=42)
    rf.fit(X_imp, y)

    # predict latest row per device
    latest = df.sort_values("ts_ms").groupby("device_id").tail(1)
    X_latest = latest[["mq135_ppm", "water_level_mm", "rain_intensity_x10", "battery_mv"]]
    X_latest_imp = imputer.transform(X_latest)

    latest["pred_level"] = rf.predict(X_latest_imp)
    latest["risk_score"] = rf.predict_proba(X_latest_imp).max(axis=1) * 100.0

    conn = psycopg2.connect(DSN)
    cur = conn.cursor()

    for _, row in latest.iterrows():
        cur.execute("""
            INSERT INTO climate_risk (device_id, ts_ms, risk_level, risk_score,
                                      water_level_mm, mq135_ppm, battery_mv)
            VALUES (%s,%s,%s,%s,%s,%s,%s)
        """, (
            int(row.device_id),
            int(row.ts_ms),
            row.pred_level,
            float(row.risk_score),
            int(row.water_level_mm),
            int(row.mq135_ppm),
            int(row.battery_mv),
        ))

        cur.execute("""
            INSERT INTO climate_risk_latest (device_id, ts_ms, risk_level, risk_score,
                                             water_level_mm, mq135_ppm, battery_mv)
            VALUES (%s,%s,%s,%s,%s,%s,%s)
            ON CONFLICT (device_id) DO UPDATE
            SET ts_ms = EXCLUDED.ts_ms,
                risk_level = EXCLUDED.risk_level,
                risk_score = EXCLUDED.risk_score,
                water_level_mm = EXCLUDED.water_level_mm,
                mq135_ppm = EXCLUDED.mq135_ppm,
                battery_mv = EXCLUDED.battery_mv
        """, (
            int(row.device_id),
            int(row.ts_ms),
            row.pred_level,
            float(row.risk_score),
            int(row.water_level_mm),
            int(row.mq135_ppm),
            int(row.battery_mv),
        ))

    conn.commit()
    cur.close()
    conn.close()

if __name__ == "__main__":
    train_and_write()