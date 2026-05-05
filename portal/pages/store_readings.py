async def store_reading(db: AsyncSession, reading: SensorReading):
    db.add(reading)
    await db.commit()
    await db.refresh(reading)

    print("💾 Saved to DB:", reading.id)

    return reading