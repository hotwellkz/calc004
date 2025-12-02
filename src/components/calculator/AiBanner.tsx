import React from 'react';
import { Bot, ChevronDown } from 'lucide-react';

interface AiBannerProps {
  onScrollToChat: () => void;
}

export const AiBanner: React.FC<AiBannerProps> = ({ onScrollToChat }) => {
  return (
    <div 
      onClick={onScrollToChat}
      className="bg-gradient-to-r from-premium-green-lighter via-white to-premium-green-lighter border border-premium-green-light rounded-card p-4 sm:p-5 cursor-pointer hover:shadow-premium-lg transition-all duration-200 group hover:-translate-y-0.5 w-full box-border"
    >
      {/* Адаптивный layout: колонка на мобилке, строка на десктопе */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        {/* Левая часть: иконка + текст */}
        <div className="flex items-start gap-3 sm:gap-4 flex-1 min-w-0">
          <div className="p-3 bg-premium-green-lighter rounded-xl group-hover:bg-premium-green group-hover:scale-110 transition-all duration-200 flex-shrink-0">
            <Bot className="w-6 h-6 text-premium-green group-hover:text-white transition-colors" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm sm:text-base font-semibold text-premium-gray-darkest leading-relaxed break-words overflow-wrap-anywhere">
              <span className="text-premium-green font-bold">Новый AI-Консультант</span> — рассчитает стоимость за вас! 
              Ответьте на пару вопросов, и AI подготовит расчёт автоматически.
            </p>
          </div>
        </div>

        {/* Правая часть: кнопка + иконка стрелки */}
        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onScrollToChat();
            }}
            className="flex-1 sm:flex-none px-4 py-2.5 border-2 border-premium-green text-premium-green rounded-input font-semibold text-sm hover:bg-premium-green hover:text-white transition-all duration-200 hover:shadow-md sm:whitespace-nowrap text-center"
          >
            Начать с AI-консультанта
          </button>
          <ChevronDown className="w-5 h-5 text-premium-green group-hover:translate-y-1 transition-transform flex-shrink-0 hidden sm:block" />
        </div>
      </div>
    </div>
  );
};

