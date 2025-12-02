import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, Sparkles, Volume2, VolumeX } from 'lucide-react';
import { useSound } from '../../hooks/useSound';

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface ChatPanelProps {
  className?: string;
  id?: string;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

export const ChatPanel: React.FC<ChatPanelProps> = ({ className = '', id = 'ai-chat' }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: 'Здравствуйте! Опишите, пожалуйста, какой дом вы планируете: приблизительная площадь, количество этажей и город строительства.'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(() => {
    // Загружаем настройку из localStorage или используем значение по умолчанию
    const saved = localStorage.getItem('chatSoundEnabled');
    return saved !== null ? saved === 'true' : true;
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Хуки для воспроизведения звуков
  const playSendSound = useSound('/sounds/send.wav', 0.4);
  const playReplySound = useSound('/sounds/reply.wav', 0.5);

  // Сохраняем настройку звука в localStorage при изменении
  useEffect(() => {
    localStorage.setItem('chatSoundEnabled', soundEnabled.toString());
  }, [soundEnabled]);

  // Автопрокрутка к последнему сообщению (только внутри контейнера чата)
  const scrollToBottom = () => {
    if (chatContainerRef.current && messagesEndRef.current) {
      // Скроллим только контейнер чата, а не всю страницу
      // Используем scrollTop для прокрутки контейнера напрямую
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // Анимация появления при скролле
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            // Показываем приветственное сообщение на 3 секунды
            setShowWelcomeMessage(true);
            setTimeout(() => {
              setShowWelcomeMessage(false);
            }, 3000);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (panelRef.current) {
      observer.observe(panelRef.current);
    }

    return () => {
      if (panelRef.current) {
        observer.unobserve(panelRef.current);
      }
    };
  }, []);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: input.trim()
    };

    // Добавляем сообщение пользователя
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    setError(null);
    
    // Воспроизводим звук отправки
    if (soundEnabled) {
      playSendSound();
    }
    
    // Возвращаем фокус в поле ввода после очистки
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);

    try {
      const response = await fetch(`${API_BASE_URL}/api/ai/calculator-chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messages: [...messages, userMessage]
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Ошибка ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      // Логирование для отладки
      console.log('[AI_RESPONSE]', data.content);
      
      // Добавляем ответ ассистента
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.content || 'Извините, не удалось получить ответ.'
      }]);
      
      // Воспроизводим звук ответа AI
      if (soundEnabled) {
        playReplySound();
      }
    } catch (err) {
      console.error('Chat error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Произошла ошибка при отправке сообщения';
      setError(errorMessage);
      
      // Добавляем сообщение об ошибке
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `Извините, произошла ошибка: ${errorMessage}. Пожалуйста, попробуйте ещё раз или используйте обычный калькулятор.`
      }]);
      
      // Воспроизводим звук ответа даже при ошибке (для обратной связи)
      if (soundEnabled) {
        playReplySound();
      }
    } finally {
      setLoading(false);
      // Возвращаем фокус после получения ответа
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // Предотвращаем стандартное поведение формы
      handleSend();
    }
    // Shift+Enter обрабатывается браузером автоматически (новая строка)
  };

  // Правильное форматирование чисел без потери разрядов
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('ru-RU').format(Math.round(value)) + ' ₸';
  };

  const formatMessage = (content: string) => {
    // Улучшенное форматирование: находим числа в тексте и правильно форматируем их
    // Обрабатываем как уже отформатированные числа (с пробелами), так и обычные
    return content.replace(/(\d[\d\s]*\d|\d)(\s*₸)?/g, (match, numStr, currency) => {
      // Убираем все пробелы из числа для парсинга
      const cleanNum = numStr.replace(/\s/g, '');
      const num = parseInt(cleanNum, 10);
      
      // Проверяем, что это валидное число и не слишком маленькое (чтобы не форматировать номера телефонов и т.п.)
      if (isNaN(num) || num < 100) return match;
      
      // Форматируем с пробелами как разделителями тысяч (ru-RU использует пробелы)
      const formatted = new Intl.NumberFormat('ru-RU', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(num);
      
      return formatted + (currency ? ' ₸' : '');
    });
  };

  return (
    <div 
      ref={panelRef}
      id={id}
      className={`bg-premium-gray-bg rounded-premium shadow-premium-xl border border-premium-green-light flex flex-col transition-all duration-500 ${className} ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
      style={{ height: '600px' }}
    >
      {/* Приветственное сообщение при появлении */}
      {showWelcomeMessage && (
        <div className="absolute -top-14 left-1/2 transform -translate-x-1/2 bg-premium-green text-white px-5 py-2.5 rounded-full shadow-premium-lg animate-fade-in z-10 whitespace-nowrap">
          <span className="text-sm font-semibold">Готов рассчитать стоимость! Напишите мне 🙂</span>
        </div>
      )}

      {/* Заголовок чата */}
      <div className="p-6 border-b border-premium-gray-light bg-gradient-to-r from-premium-green-lighter via-white to-premium-green-lighter rounded-t-premium">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-premium-green-lighter rounded-xl">
            <Bot className="w-6 h-6 text-premium-green" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <h3 className="text-lg font-bold text-premium-gray-darkest">AI-Консультант</h3>
              <span className="px-2.5 py-1 bg-premium-green text-white text-xs font-bold rounded-full">
                новинка
              </span>
            </div>
            <p className="text-sm text-premium-gray-dark">Опишите дом, и я рассчитаю стоимость</p>
          </div>
          <Sparkles className="w-5 h-5 text-premium-green animate-pulse flex-shrink-0" />
        </div>
      </div>

      {/* Сообщения */}
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4"
        style={{ 
          maxHeight: 'calc(600px - 140px)',
          overflowY: 'auto',
          scrollBehavior: 'smooth'
        }}
      >
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex gap-3 ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {message.role === 'assistant' && (
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                <Bot className="w-5 h-5 text-emerald-600" />
              </div>
            )}
            
            <div
              className={`max-w-[80%] rounded-input px-5 py-3 shadow-premium ${
                message.role === 'user'
                  ? 'bg-premium-green text-white'
                  : 'bg-white text-premium-gray-darkest border border-premium-gray-light'
              }`}
            >
              <div className="text-base whitespace-pre-wrap leading-relaxed">
                {formatMessage(message.content)}
              </div>
            </div>

            {message.role === 'user' && (
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <User className="w-5 h-5 text-blue-600" />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex gap-3 justify-start">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
              <Bot className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="bg-gray-100 rounded-lg px-4 py-2">
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
                <span className="text-sm text-gray-600">ИИ думает...</span>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Поле ввода */}
      <div className="p-6 border-t border-premium-gray-light bg-white rounded-b-premium">
        <div className="flex gap-3">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Опишите дом, который вы хотите построить..."
            className="flex-1 px-5 py-3 border border-premium-gray-light rounded-input focus:ring-2 focus:ring-premium-green focus:border-premium-green outline-none resize-none text-base text-premium-gray-darkest placeholder-premium-gray-medium shadow-sm focus:shadow-premium transition-all duration-200"
            rows={2}
            disabled={loading}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className="px-6 py-3 bg-premium-green text-white rounded-input hover:bg-premium-green-dark disabled:bg-premium-gray-medium disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2 font-semibold shadow-premium hover:shadow-premium-lg hover:-translate-y-0.5 disabled:hover:translate-y-0"
          >
            <Send className="w-5 h-5" />
            <span className="hidden sm:inline">Отправить</span>
          </button>
        </div>
        <div className="flex items-center justify-between mt-3">
          <p className="text-xs text-premium-gray-medium text-center flex-1">
            Нажмите Enter для отправки, Shift+Enter для новой строки
          </p>
          <label className="flex items-center gap-2 text-xs text-premium-gray-dark cursor-pointer hover:text-premium-gray-darkest transition-colors ml-4">
            <input
              type="checkbox"
              checked={soundEnabled}
              onChange={(e) => setSoundEnabled(e.target.checked)}
              className="w-4 h-4 text-premium-green border-premium-gray-light rounded focus:ring-premium-green cursor-pointer"
            />
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-premium-green" />
            ) : (
              <VolumeX className="w-4 h-4 text-premium-gray-medium" />
            )}
            <span className="hidden sm:inline">Звуки</span>
          </label>
        </div>
      </div>
    </div>
  );
};

