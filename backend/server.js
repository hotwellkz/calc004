import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import aiCalculatorRouter from './routes/aiCalculator.js';

dotenv.config();

const app = express();
// Cloud Run автоматически устанавливает переменную PORT
const PORT = process.env.PORT || 3001;

// Middleware
// CORS: разрешаем запросы с фронтенда и локального хоста
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173'
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Разрешаем запросы без origin (например, мобильные приложения или Postman)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API routes
app.use('/api', aiCalculatorRouter);

// Error handling
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: 'INTERNAL_SERVER_ERROR',
    message: err.message || 'Произошла ошибка на сервере'
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Backend server running on port ${PORT}`);
  console.log(`📡 OpenAI API Key: ${process.env.OPENAI_API_KEY ? '✅ Set' : '❌ Missing'}`);
  console.log(`🤖 Model: ${process.env.OPENAI_MODEL || 'gpt-4o-mini'}`);
  console.log(`🌐 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
});

