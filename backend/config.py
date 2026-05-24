import os
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List

class Settings(BaseSettings):
    # Server configuration
    HOST: str = "127.0.0.1"
    PORT: int = 8000
    DEBUG: bool = True
    ENVIRONMENT: str = "development"
    
    # CORS setup
    ALLOWED_ORIGINS: str = "*"
    
    # LLM Settings
    OPENAI_API_KEY: str = ""
    GEMINI_API_KEY: str = ""
    
    # DB Connections
    VECTOR_DB_URL: str = "http://localhost:8080"
    VECTOR_DB_API_KEY: str = ""
    DATABASE_URL: str = "postgresql://postgres:postgres@localhost:5432/aiscrumos"
    
    # SaaS Credentials
    GITHUB_WEBHOOK_SECRET: str = ""
    GITHUB_PERSONAL_ACCESS_TOKEN: str = ""
    SLACK_BOT_TOKEN: str = ""
    SLACK_SIGNING_SECRET: str = ""
    
    JIRA_API_URL: str = ""
    JIRA_USER_EMAIL: str = ""
    JIRA_API_TOKEN: str = ""
    
    # Audio Services
    AUDIO_TRANSCRIPTION_KEY: str = ""

    # Load from .env file
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

    @property
    def cors_origins_list(self) -> List[str]:
        if not self.ALLOWED_ORIGINS:
            return ["*"]
        if self.ALLOWED_ORIGINS == "*":
            return ["*"]
        return [origin.strip() for origin in self.ALLOWED_ORIGINS.split(",")]

settings = Settings()
