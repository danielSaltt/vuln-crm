# Generic VPS Deployment

1. Provision a Linux VPS with Docker and Docker Compose.
2. Clone repository and copy `.env.example` to `.env`.
3. Build and run with `docker compose up --build -d`.
4. Place a reverse proxy in front for TLS termination.
5. Open the required inbound port for the app.
6. Run your test workflow against the public HTTPS URL.
7. Destroy infrastructure after test completion.
