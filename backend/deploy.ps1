# PowerShell скрипт для деплоя в Google Cloud Run
# Email: bibi7475000@gmail.com

Write-Host "🚀 Начинаем деплой в Cloud Run..." -ForegroundColor Green

# Получаем PROJECT_ID
$PROJECT_ID = gcloud config get-value project
if (-not $PROJECT_ID) {
    Write-Host "❌ Проект не установлен. Создаём проект..." -ForegroundColor Yellow
    gcloud projects create sip-calculator-backend --name="SIP Calculator Backend"
    gcloud config set project sip-calculator-backend
    $PROJECT_ID = "sip-calculator-backend"
}

Write-Host "📦 PROJECT_ID: $PROJECT_ID" -ForegroundColor Cyan

# Включаем необходимые API
Write-Host "🔧 Включаем необходимые API..." -ForegroundColor Yellow
gcloud services enable cloudbuild.googleapis.com --quiet
gcloud services enable run.googleapis.com --quiet
gcloud services enable containerregistry.googleapis.com --quiet

# Сборка Docker образа
Write-Host "📦 Собираем Docker образ..." -ForegroundColor Yellow
gcloud builds submit --tag "gcr.io/$PROJECT_ID/sip-calculator-backend"

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Ошибка при сборке образа" -ForegroundColor Red
    exit 1
}

# Запрашиваем переменные окружения
Write-Host "`n📝 Настройка переменных окружения:" -ForegroundColor Yellow
$OPENAI_KEY = Read-Host "Введите OPENAI_API_KEY"
$FRONTEND_URL = Read-Host "Введите FRONTEND_URL (или оставьте пустым для localhost)"

if (-not $FRONTEND_URL) {
    $FRONTEND_URL = "http://localhost:5173"
}

# Деплой в Cloud Run
Write-Host "🌐 Деплоим в Cloud Run..." -ForegroundColor Yellow
gcloud run deploy sip-calculator-backend `
  --image "gcr.io/$PROJECT_ID/sip-calculator-backend" `
  --platform managed `
  --region us-central1 `
  --allow-unauthenticated `
  --port 8080 `
  --set-env-vars "OPENAI_API_KEY=$OPENAI_KEY,OPENAI_MODEL=gpt-4o-mini,FRONTEND_URL=$FRONTEND_URL" `
  --memory 512Mi `
  --cpu 1

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✅ Деплой завершён успешно!" -ForegroundColor Green
    Write-Host "🔗 URL сервиса будет показан выше" -ForegroundColor Cyan
} else {
    Write-Host "❌ Ошибка при деплое" -ForegroundColor Red
    exit 1
}

