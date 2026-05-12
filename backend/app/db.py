# © 2026 Lucie Pendesi. All rights reserved.
# Licensed under the MIT License. See the LICENSE file for details.
# database connection layer for the application
import psycopg2
import os

def get_db_connection():
    return psycopg2.connect(
        dbname=os.getenv("POSTGRES_DB", "climate"),
        user=os.getenv("POSTGRES_USER", "climate"),
        password=os.getenv("POSTGRES_PASSWORD", "climate"),
        host=os.getenv("POSTGRES_HOST", "postgres"),
        port=os.getenv("POSTGRES_PORT", "5432"),
    )