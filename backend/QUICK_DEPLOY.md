# Быстрый деплой в Cloud Run

## Команды для выполнения (по порядку)

### 1. Вход в Google Cloud
```bash
gcloud auth login bibi7475000@gmail.com
```

### 2. Создание проекта
```bash
gcloud projects create sip-calculator-backend --name="SIP Calculator Backend"
gcloud config set project sip-calculator-backend
```

### 3. Включение API
```bash
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com
```

### 4. Переход в папку backend
```bash
cd backend
```

### 5. Деплой (замените YOUR_OPENAI_KEY и YOUR_FRONTEND_URL)
```bash
export PROJECT_ID=$(gcloud config get-value project)

gcloud builds submit --tag gcr.io/$PROJECT_ID/sip-calculator-backend

gcloud run deploy sip-calculator-backend \
  --image gcr.io/$PROJECT_ID/sip-calculator-backend \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --port 8080 \
  --set-env-vars "OPENAI_API_KEY=YOUR_OPENAI_KEY,OPENAI_MODEL=gpt-4o-mini,FRONTEND_URL=YOUR_FRONTEND_URL" \
  --memory 512Mi \
  --cpu 1
```

### 6. После деплоя
Вы получите URL вида: `https://sip-calculator-backend-xxxxx-uc.a.run.app`

Используйте этот URL в переменной `VITE_API_BASE_URL` на фронтенде.

## Обновление переменных окружения позже

```bash
gcloud run services update sip-calculator-backend \
  --region us-central1 \
  --update-env-vars "OPENAI_API_KEY=новый-ключ,FRONTEND_URL=новый-url"
```

