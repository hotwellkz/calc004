#!/bin/bash

# Скрипт для деплоя в Google Cloud Run

# Установите PROJECT_ID вашего проекта
PROJECT_ID="your-project-id"
SERVICE_NAME="sip-calculator-backend"
REGION="us-central1"

echo "🚀 Начинаем деплой в Cloud Run..."

# Установка проекта
gcloud config set project $PROJECT_ID

# Сборка Docker образа
echo "📦 Собираем Docker образ..."
gcloud builds submit --tag gcr.io/$PROJECT_ID/$SERVICE_NAME

# Деплой в Cloud Run
echo "🌐 Деплоим в Cloud Run..."
gcloud run deploy $SERVICE_NAME \
  --image gcr.io/$PROJECT_ID/$SERVICE_NAME \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated \
  --port 8080 \
  --set-env-vars "FRONTEND_URL=https://your-frontend-domain.com" \
  --memory 512Mi \
  --cpu 1 \
  --min-instances 0 \
  --max-instances 10

echo "✅ Деплой завершён!"
echo "🔗 URL сервиса будет показан выше"

