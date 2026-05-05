#Alembic Migration (Timescale Hypertable)
from alembic import op
import sqlalchemy as sa

revision = "2026_01_create_iot_readings"
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    op.execute("CREATE EXTENSION IF NOT EXISTS timescaledb")

    op.create_table(
        "iot_readings",
        sa.Column("device_id", sa.String, primary_key=True),
        sa.Column("timestamp_ms", sa.BigInteger, primary_key=True),
        sa.Column("temperature_c", sa.Float),
        sa.Column("humidity", sa.Float),
        sa.Column("pressure_hpa", sa.Float),
        sa.Column("air_quality", sa.Float),
        sa.Column("rain_level", sa.Float),
        sa.Column("water_level", sa.Float),
        sa.Column("battery_voltage", sa.Float),
        sa.Column("latitude", sa.Float),
        sa.Column("longitude", sa.Float),
    )

    op.execute("""
        SELECT create_hypertable(
            'iot_readings',
            'timestamp_ms',
            if_not_exists => TRUE
        );
    """)


def downgrade():
    op.drop_table("iot_readings")