# app/core/config.py

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    POSTGRES_USER: str
    POSTGRES_PASSWORD: str
    POSTGRES_DB: str
    POSTGRES_HOST: str = "climate_db"
    POSTGRES_PORT: int = 5432

    @property
    def database_url(self):
        return (
            f"postgresql+asyncpg://{self.POSTGRES_USER}:"
            f"{self.POSTGRES_PASSWORD}@{self.POSTGRES_HOST}:"
            f"{self.POSTGRES_PORT}/{self.POSTGRES_DB}"
        )
    # -----------------------------
    # App settings
    # -----------------------------
    app_name: str = "Climate Risk Backend"
    backend_cors_origins: list[str] = ["http://localhost:5173"]

    # -----------------------------
    # Security
    # -----------------------------
    API_KEY_HEADER: str = "api-key"
    API_KEY: str

    # -----------------------------
    # Computed database URL
    # -----------------------------
    @property
    def database_url(self) -> str:
        return (
            f"postgresql+asyncpg://{self.POSTGRES_USER}:"
            f"{self.POSTGRES_PASSWORD}@{self.POSTGRES_HOST}:"
            f"{self.POSTGRES_PORT}/{self.POSTGRES_DB}"
        )

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


settings = Settings()