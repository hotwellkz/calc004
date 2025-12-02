# Деплой бэкенда в Google Cloud Run

## Предварительные требования

1. Установлен [Google Cloud SDK](https://cloud.google.com/sdk/docs/install)
2. Аккаунт Google Cloud с активированным биллингом
3. Email: bibi7475000@gmail.com

## Шаг 1: Настройка Google Cloud

### 1.1. Вход в аккаунт

```bash
gcloud auth login bibi7475000@gmail.com
```

### 1.2. Создание нового проекта

```bash
gcloud projects create sip-calculator-backend --name="SIP Calculator Backend"
```

### 1.3. Установка проекта по умолчанию

```bash
gcloud config set project sip-calculator-backend
```

### 1.4. Включение необходимых API

```bash
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com
```

## Шаг 2: Настройка переменных окружения

В Cloud Run переменные окружения настраиваются через веб-консоль или команду деплоя.

### Необходимые переменные:
- `OPENAI_API_KEY` - ваш ключ OpenAI API
- `OPENAI_MODEL` - модель (по умолчанию: gpt-4o-mini)
- `FRONTEND_URL` - URL вашего фронтенда (например: https://your-domain.com)

## Шаг 3: Деплой через командную строку

### Вариант 1: Быстрый деплой (рекомендуется)

```bash
cd backend

# Установите PROJECT_ID
export PROJECT_ID=$(gcloud config get-value project)

# Сборка и деплой
gcloud builds submit --tag gcr.io/$PROJECT_ID/sip-calculator-backend

gcloud run deploy sip-calculator-backend \
  --image gcr.io/$PROJECT_ID/sip-calculator-backend \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --port 8080 \
  --set-env-vars "OPENAI_API_KEY=your-key-here,OPENAI_MODEL=gpt-4o-mini,FRONTEND_URL=https://your-frontend-domain.com" \
  --memory 512Mi \
  --cpu 1
```

### Вариант 2: Использование скрипта

1. Отредактируйте `deploy.sh` и укажите ваш PROJECT_ID
2. Сделайте скрипт исполняемым: `chmod +x deploy.sh`
3. Запустите: `./deploy.sh`

## Шаг 4: Настройка переменных окружения через консоль

После деплоя можно обновить переменные через веб-консоль:

1. Перейдите в [Cloud Run Console](https://console.cloud.google.com/run)
2. Выберите сервис `sip-calculator-backend`
3. Нажмите "Edit & Deploy New Revision"
4. В разделе "Variables & Secrets" добавьте:
   - `OPENAI_API_KEY` = ваш ключ
   - `OPENAI_MODEL` = gpt-4o-mini
   - `FRONTEND_URL` = URL вашего фронтенда

## Шаг 5: Получение URL сервиса

После деплоя вы получите URL вида:
```
https://sip-calculator-backend-xxxxx-uc.a.run.app
```

Этот URL нужно использовать в переменной `VITE_API_BASE_URL` на фронтенде.

## Обновление деплоя

Для обновления просто повторите команду деплоя:

```bash
gcloud builds submit --tag gcr.io/$PROJECT_ID/sip-calculator-backend
gcloud run deploy sip-calculator-backend --image gcr.io/$PROJECT_ID/sip-calculator-backend --region us-central1
```

## Проверка работы

```bash
# Health check
curl https://your-service-url.run.app/health

# Должен вернуть: {"status":"ok","timestamp":"..."}
```

## Стоимость

Cloud Run взимает плату только за фактическое использование:
- Первые 2 миллиона запросов в месяц - бесплатно
- $0.40 за миллион запросов после
- Память и CPU оплачиваются по факту использования

## Troubleshooting

### Ошибка: "Permission denied"
```bash
gcloud auth login
gcloud config set project sip-calculator-backend
```

### Ошибка: "API not enabled"
```bash
gcloud services enable cloudbuild.googleapis.com run.googleapis.com
```

### Проверка логов
```bash
gcloud run services logs read sip-calculator-backend --region us-central1
```

