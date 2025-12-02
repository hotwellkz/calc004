import React, { useState, useEffect } from 'react';
import { Bot } from 'lucide-react';

interface AiFloatingButtonProps {
  onScrollToChat: () => void;
}

export const AiFloatingButton: React.FC<AiFloatingButtonProps> = ({ onScrollToChat }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Показываем кнопку после небольшой задержки
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <button
      onClick={onScrollToChat}
      className="fixed bottom-8 right-8 z-50 w-16 h-16 bg-gradient-to-br from-premium-green to-premium-green-dark hover:from-premium-green-dark hover:to-premium-green text-white rounded-full shadow-premium-xl hover:shadow-premium-xl transition-all duration-300 flex items-center justify-center group animate-bounce hover:animate-none hover:-translate-y-1"
      title="AI-Консультант"
      aria-label="Перейти к AI-Консультанту"
    >
      <Bot className="w-7 h-7 group-hover:scale-110 transition-transform" />
      <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full border-2 border-white shadow-md" />
    </button>
  );
};

