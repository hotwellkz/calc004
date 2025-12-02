import React from 'react';
import { Bot, ChevronDown } from 'lucide-react';

interface AiBannerProps {
  onScrollToChat: () => void;
}

export const AiBanner: React.FC<AiBannerProps> = ({ onScrollToChat }) => {
  return (
    <div 
      onClick={onScrollToChat}
      className="bg-gradient-to-r from-premium-green-lighter via-white to-premium-green-lighter border border-premium-green-light rounded-card p-5 cursor-pointer hover:shadow-premium-lg transition-all duration-200 group hover:-translate-y-0.5"
    >
      <div className="flex items-center gap-4">
        <div className="p-3 bg-premium-green-lighter rounded-xl group-hover:bg-premium-green group-hover:scale-110 transition-all duration-200">
          <Bot className="w-6 h-6 text-premium-green group-hover:text-white transition-colors" />
        </div>
        <div className="flex-1">
          <p className="text-base font-semibold text-premium-gray-darkest leading-relaxed">
            <span className="text-premium-green font-bold">Новый AI-Консультант</span> — рассчитает стоимость за вас! 
            Ответьте на пару вопросов, и AI подготовит расчёт автоматически.
          </p>
        </div>
        <button className="px-4 py-2 border-2 border-premium-green text-premium-green rounded-input font-semibold text-sm hover:bg-premium-green hover:text-white transition-all duration-200 hover:shadow-md whitespace-nowrap">
          Начать с AI-консультанта
        </button>
        <ChevronDown className="w-5 h-5 text-premium-green group-hover:translate-y-1 transition-transform flex-shrink-0" />
      </div>
    </div>
  );
};

