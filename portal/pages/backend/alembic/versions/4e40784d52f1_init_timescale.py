#migration file to initiate timescaleDB and  create the iot_stream table wth the necessary policies for composite primary key.
"""init_timescale"""

from alembic import op
import sqlalchemy as sa

revision = "4e40784d52f1"
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # Enable TimescaleDB
    op.execute("CREATE EXTENSION IF NOT EXISTS timescaledb;")

    # Create table
    op.create_table(
        "iot_stream",
        sa.Column("device_id", sa.String, nullable=False),
        sa.Column("timestamp_ms", sa.BigInteger, nullable=False),
        sa.Column("temperature_c", sa.Float),
        sa.Column("humidity_pct", sa.Float),
        sa.Column("pressure_hpa", sa.Float),
        sa.Column("mq135_ppm", sa.Float),
        sa.Column("water_level", sa.Float),
        sa.Column("rain_intensity", sa.Float),
        sa.Column("battery_v", sa.Float),
        sa.Column("latitude", sa.Float),
        sa.Column("longitude", sa.Float),
        sa.PrimaryKeyConstraint("device_id", "timestamp_ms")
    )

    # Convert to hypertable
    op.execute(
        """
        SELECT create_hypertable(
            'iot_stream',
            'timestamp_ms',
            if_not_exists => TRUE
        );
        """
    )

    # Enable compression
    op.execute(
        """
        ALTER TABLE iot_stream SET (
            timescaledb.compress,
            timescaledb.compress_segmentby = 'device_id'
        );
        """
    )

    # Compression policy (7 days in ms)
    op.execute(
        """
        SELECT add_compression_policy(
            'iot_stream',
            compress_after => 604800000
        );
        """
    )


def downgrade():
    op.drop_table("iot_stream")
    op.execute("DROP EXTENSION IF EXISTS timescaledb;")