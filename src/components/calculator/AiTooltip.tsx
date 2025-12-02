import React, { useState, useEffect } from 'react';
import { Bot, X } from 'lucide-react';

interface AiTooltipProps {
  onScrollToChat: () => void;
  onClose: () => void;
}

export const AiTooltip: React.FC<AiTooltipProps> = ({ onScrollToChat, onClose }) => {
  return (
    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full z-50 animate-fade-in mb-3">
      <div className="bg-white border-2 border-premium-green rounded-card shadow-premium-xl p-5 max-w-md mx-auto relative">
        {/* Стрелка вниз */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full">
          <div className="w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-premium-green"></div>
        </div>
        <div className="flex items-start gap-4">
          <div className="p-3 bg-premium-green-lighter rounded-xl flex-shrink-0">
            <Bot className="w-6 h-6 text-premium-green" />
          </div>
          <div className="flex-1">
            <p className="text-base text-premium-gray-darkest mb-4 leading-relaxed font-medium">
              Хотите, AI-консультант рассчитает стоимость полностью автоматически?
            </p>
            <div className="flex gap-3">
              <button
                onClick={onScrollToChat}
                className="flex-1 px-5 py-2.5 bg-premium-green text-white rounded-input hover:bg-premium-green-dark transition-all duration-200 text-sm font-semibold shadow-premium hover:shadow-premium-lg hover:-translate-y-0.5"
              >
                Да, перейти к AI-консультанту
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2.5 text-premium-gray-medium hover:text-premium-gray-darkest hover:bg-premium-gray-lightest rounded-input transition-colors duration-200"
                aria-label="Закрыть"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

