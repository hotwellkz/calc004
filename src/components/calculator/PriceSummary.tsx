import React from 'react';
import { CalculationResult } from '../../types/calculator';

interface PriceSummaryProps {
  result: CalculationResult;
  area: number;
  options?: {
    isVatIncluded?: boolean;
    isInstallment?: boolean;
    installmentAmount?: number;
    hideFundamentCost?: boolean;
    hideKitCost?: boolean;
    hideAssemblyCost?: boolean;
    hideDeliveryCost?: boolean;
  };
}

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('ru-RU').format(price);
};

export const PriceSummary: React.FC<PriceSummaryProps> = ({ result, area, options = {} }) => {
  const { fundamentCost, kitCost, assemblyCost, total, pricePerSqm, deliveryCost } = result;
  const { 
    hideFundamentCost = false, 
    hideKitCost = false, 
    hideAssemblyCost = false,
    hideDeliveryCost = false
  } = options;

  if (total === 0) {
    return (
      <div className="bg-premium-gray-bg rounded-premium p-6 sm:p-8 border border-premium-gray-light shadow-premium">
        <h3 className="text-xl font-bold text-premium-gray-darkest mb-3">
          Расчет стоимости
        </h3>
        <p className="text-base text-premium-gray-dark leading-relaxed">
          Введите площадь дома от 10 до 1500 м² для расчета стоимости
        </p>
      </div>
    );
  }

  return (
    <div className="bg-premium-gray-bg rounded-premium p-6 sm:p-8 border border-premium-gray-light shadow-premium-xl backdrop-blur-sm">
      <h3 className="text-xl font-bold text-premium-gray-darkest mb-6">
        Расчет стоимости
      </h3>
      
      {/* Основная информация */}
      <div className="space-y-4 mb-6">
        <div className="flex justify-between items-center py-3 border-b border-premium-gray-light">
          <span className="text-sm text-premium-gray-dark font-medium">Площадь дома</span>
          <span className="text-base font-semibold text-premium-gray-darkest">{area} м²</span>
        </div>
        <div className="flex justify-between items-center py-3 border-b border-premium-gray-light">
          <span className="text-sm text-premium-gray-dark font-medium">Цена за м²</span>
          <span className="text-base font-semibold text-premium-gray-darkest">{formatPrice(pricePerSqm)} ₸</span>
        </div>
      </div>

      {/* Детализация стоимости */}
      <div className="space-y-0 mb-6">
        {!hideFundamentCost && (
          <div className="flex justify-between items-center py-4 border-b border-premium-gray-light hover:bg-premium-gray-lightest transition-colors duration-150 rounded-lg px-2 -mx-2">
            <div className="flex items-center gap-3">
              <span className="text-xl">🧱</span>
              <span className="text-sm text-premium-gray-darkest font-medium">
                <span className="hidden sm:inline">Фундамент (14%)</span>
                <span className="sm:hidden">Фундамент</span>
              </span>
            </div>
            <span className="text-base font-semibold text-premium-gray-darkest">{formatPrice(fundamentCost)} ₸</span>
          </div>
        )}
        {!hideKitCost && (
          <div className="flex justify-between items-center py-4 border-b border-premium-gray-light hover:bg-premium-gray-lightest transition-colors duration-150 rounded-lg px-2 -mx-2">
            <div className="flex items-center gap-3">
              <span className="text-xl">🏠</span>
              <span className="text-sm text-premium-gray-darkest font-medium">
                <span className="hidden sm:inline">Домокомплект (71%)</span>
                <span className="sm:hidden">Домокомпл.</span>
              </span>
            </div>
            <span className="text-base font-semibold text-premium-gray-darkest">{formatPrice(kitCost)} ₸</span>
          </div>
        )}
        {!hideAssemblyCost && (
          <div className="flex justify-between items-center py-4 border-b border-premium-gray-light hover:bg-premium-gray-lightest transition-colors duration-150 rounded-lg px-2 -mx-2">
            <div className="flex items-center gap-3">
              <span className="text-xl">🔧</span>
              <span className="text-sm text-premium-gray-darkest font-medium">
                <span className="hidden sm:inline">Сборка (15%)</span>
                <span className="sm:hidden">Сборка</span>
              </span>
            </div>
            <span className="text-base font-semibold text-premium-gray-darkest">{formatPrice(assemblyCost)} ₸</span>
          </div>
        )}
        {!hideDeliveryCost && deliveryCost && deliveryCost > 0 && (
          <div className="flex justify-between items-center py-4 border-b border-premium-gray-light hover:bg-premium-gray-lightest transition-colors duration-150 rounded-lg px-2 -mx-2">
            <div className="flex items-center gap-3">
              <span className="text-xl">🚚</span>
              <span className="text-sm text-premium-gray-darkest font-medium">Доставка</span>
            </div>
            <span className="text-base font-semibold text-premium-gray-darkest">{formatPrice(deliveryCost)} ₸</span>
          </div>
        )}
      </div>

      {/* Итоговая сумма */}
      <div className="bg-white rounded-card p-6 border-2 border-premium-green shadow-premium-lg">
        <div className="flex justify-between items-center">
          <span className="text-lg font-bold text-premium-gray-darkest">Итого:</span>
          <span className="text-3xl font-bold text-premium-green">
            {formatPrice(total)} ₸
          </span>
        </div>
      </div>
    </div>
  );
};

