set -x DATABASE_URL "postgres://postgres:password@127.0.0.1:5432/postgres?sslmode=disable"
set -x REDIS_URL "redis://default:1234@localhost:6379"
set -x PORT "8080"
set -x NEXT_PUBLIC_SIGNAL_URL "ws://localhost:8080/ws/signal"
set -x NEXT_PUBLIC_PROVIDER_URL "ws://localhost:8080/ws/provider"
set -x GOOGLE_APPLICATION_CREDENTIALS ../../google_creds.json
set -x GCS_CREDS_FILE ask-a-teammate
set -x GCS_BUCKET_NAME ask-a-teammate


