import React, { useState, useEffect, useRef } from 'react';
import { Calculator as CalcIcon, Home, Ruler } from 'lucide-react';
import { CalculatorForm } from '../components/calculator/CalculatorForm';
import { PriceSummary } from '../components/calculator/PriceSummary';
import { CommercialProposal } from '../components/calculator/CommercialProposal';
import { ChatPanel } from '../components/calculator/ChatPanel';
import { AiBanner } from '../components/calculator/AiBanner';
import { AiFloatingButton } from '../components/calculator/AiFloatingButton';
import { AiTooltip } from '../components/calculator/AiTooltip';
import { CalculationResult } from '../types/calculator';

export const Calculator: React.FC = () => {
  const [calculationResult, setCalculationResult] = useState<CalculationResult>({
    fundamentCost: 0,
    kitCost: 0,
    assemblyCost: 0,
    total: 0,
    pricePerSqm: 0
  });
  const [area, setArea] = useState<number>(0);
  const [options, setOptions] = useState({ 
    isVatIncluded: false, 
    isInstallment: false, 
    installmentAmount: 0,
    hideFundamentCost: false,
    hideKitCost: false,
    hideAssemblyCost: false,
    hideDeliveryCost: false
  });
  const [parameters, setParameters] = useState({
    foundation: '',
    floors: '',
    firstFloorType: '',
    secondFloorType: '',
    thirdFloorType: '',
    firstFloorHeight: '',
    secondFloorHeight: '',
    thirdFloorHeight: '',
    firstFloorThickness: '',
    secondFloorThickness: '',
    thirdFloorThickness: '',
    partitionType: '',
    ceiling: '',
    roofType: '',
    houseShape: '',
    additionalWorks: '',
    useCustomWorks: false,
    customWorks: [{ name: '', price: 0 }],
    deliveryCity: '',
  });

  const [isAdvancedMode, setIsAdvancedMode] = useState(() => {
    const saved = localStorage.getItem('calculatorMode');
    return saved === 'advanced';
  });

  const toggleMode = () => {
    const newMode = !isAdvancedMode;
    setIsAdvancedMode(newMode);
    localStorage.setItem('calculatorMode', newMode ? 'advanced' : 'basic');
  };

  const isMobileDevice = () => {
    const userAgent = navigator.userAgent.toLowerCase();
    const mobileKeywords = ['android', 'iphone', 'ipad', 'ipod', 'blackberry', 'windows phone', 'mobile'];
    const isMobileUserAgent = mobileKeywords.some(keyword => userAgent.includes(keyword));
    const isMobileWidth = window.innerWidth <= 768;
    return isMobileUserAgent || isMobileWidth;
  };

  const [isMobile, setIsMobile] = useState(false);
  const [showAiTooltip, setShowAiTooltip] = useState(false);
  const chatPanelRef = useRef<HTMLDivElement>(null);
  const areaInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(isMobileDevice());
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Функция для плавной прокрутки к чату
  const scrollToChat = () => {
    const chatElement = document.getElementById('ai-chat');
    if (chatElement) {
      chatElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Показываем tooltip после ввода площади
  useEffect(() => {
    if (area > 0 && !showAiTooltip) {
      const timer = setTimeout(() => {
        setShowAiTooltip(true);
      }, 800);

      return () => clearTimeout(timer);
    }
  }, [area, showAiTooltip]);

  const handleCalculationChange = (result: CalculationResult, newArea: number) => {
    setCalculationResult(result);
    setArea(newArea);
  };

  const handleOptionsChange = (newOptions: { 
    isVatIncluded: boolean; 
    isInstallment: boolean; 
    installmentAmount: number;
    hideFundamentCost: boolean;
    hideKitCost: boolean;
    hideAssemblyCost: boolean;
    hideDeliveryCost: boolean;
  }) => {
    setOptions(newOptions);
  };

  const handleParametersChange = (newParameters: any) => {
    setParameters(newParameters);
  };

  const applyAdditionalCharges = (baseResult: CalculationResult, options: { isVatIncluded: boolean; isInstallment: boolean; installmentAmount: number }) => {
    let total = baseResult.total;
    
    if (options.isVatIncluded) {
      total += total * 0.16;
    }
    
    if (options.isInstallment) {
      if (options.installmentAmount && options.installmentAmount > 0) {
        total += options.installmentAmount * 0.17;
      } else {
        total += total * 0.17;
      }
    }
    
    return {
      ...baseResult,
      total: Math.round(total)
    };
  };

  const finalResult = applyAdditionalCharges(calculationResult, options);

  return (
    <div className="min-h-screen bg-premium-gray-bg">
      {/* Премиальная центральная карточка */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Шапка калькулятора */}
        <div className="bg-white rounded-premium shadow-premium-lg border border-premium-gray-light mb-8 overflow-hidden">
          <div className="px-6 sm:px-8 lg:px-10 py-6 sm:py-8 border-b border-premium-gray-light">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-premium-green-lighter rounded-xl flex-shrink-0">
                  <CalcIcon className={`${isMobile ? 'w-6 h-6' : 'w-7 h-7'} text-premium-green`} />
                </div>
                <div>
                  <div className="flex items-center gap-3 flex-wrap mb-2">
                    <h1 className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-bold text-premium-gray-darkest leading-tight`}>
                      {isMobile ? 'Калькулятор СИП' : 'Калькулятор стоимости строительства'}
                    </h1>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-premium-green-lighter text-premium-green-dark text-xs font-semibold rounded-full">
                      <span>⚡</span>
                      <span>AI-новинка</span>
                    </span>
                  </div>
                  <p className={`${isMobile ? 'text-sm' : 'text-base'} text-premium-gray-dark leading-relaxed`}>
                    {isMobile ? 'Расчет СИП дома' : 'Расчет стоимости СИП дома в черновую'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Баннер AI-Консультанта */}
          <div className="px-6 sm:px-8 lg:px-10 py-4">
            <AiBanner onScrollToChat={scrollToChat} />
          </div>
        </div>

        {/* Основной контент */}
        <div className={`${isMobile ? 'space-y-6' : 'space-y-8'}`}>
          {!isMobile && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-card p-6 border border-premium-gray-light shadow-premium hover:shadow-premium-lg transition-all duration-200 hover:-translate-y-0.5">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-50 rounded-xl">
                    <Home className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-base font-semibold text-premium-gray-darkest mb-1">Технология</p>
                    <p className="text-sm text-premium-gray-dark">СИП панели</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-card p-6 border border-premium-gray-light shadow-premium hover:shadow-premium-lg transition-all duration-200 hover:-translate-y-0.5">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-premium-green-lighter rounded-xl">
                    <Ruler className="w-6 h-6 text-premium-green" />
                  </div>
                  <div>
                    <p className="text-base font-semibold text-premium-gray-darkest mb-1">Площадь</p>
                    <p className="text-sm text-premium-gray-dark">От 10 до 1500 м²</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-card p-6 border border-premium-gray-light shadow-premium hover:shadow-premium-lg transition-all duration-200 hover:-translate-y-0.5">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-50 rounded-xl">
                    <CalcIcon className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-base font-semibold text-premium-gray-darkest mb-1">Расчет</p>
                    <p className="text-sm text-premium-gray-dark">Точный до тенге</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className={`grid grid-cols-1 xl:grid-cols-3 ${isMobile ? 'gap-6' : 'gap-8'}`}>
            <div className="xl:col-span-2">
              {/* Блок параметров строительства */}
              <div className="bg-white rounded-premium shadow-premium-lg border border-premium-gray-light relative overflow-hidden">
                {showAiTooltip && (
                  <div className="absolute top-0 left-0 right-0 z-50">
                    <AiTooltip 
                      onScrollToChat={() => {
                        scrollToChat();
                        setShowAiTooltip(false);
                      }}
                      onClose={() => setShowAiTooltip(false)}
                    />
                  </div>
                )}
                
                {/* Заголовок секции */}
                <div className={`${isMobile ? 'px-5 py-5' : 'px-8 py-7'} border-b border-premium-gray-light bg-gradient-to-r from-white to-premium-gray-bg`}>
                  <div className="flex items-center justify-between gap-4 mb-4">
                    <div>
                      <h2 className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold text-premium-gray-darkest mb-2 leading-tight`}>
                        {isMobile ? 'Параметры дома' : 'Параметры строительства'}
                      </h2>
                      <p className={`text-premium-gray-dark ${isMobile ? 'text-sm' : 'text-base'} leading-relaxed`}>
                        {isMobile ? 'Выберите характеристики' : 'Выберите характеристики дома для точного расчета стоимости'}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <div className="text-sm text-premium-gray-dark hidden sm:block font-medium">
                        {isAdvancedMode ? '⚙️ Профессиональный' : '🔘 Обычный'}
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={isAdvancedMode}
                          onChange={toggleMode}
                          className="sr-only peer"
                        />
                        <div className="w-12 h-6 bg-premium-gray-light peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-premium-green peer-focus:ring-offset-2 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-premium-gray-light after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-premium-green shadow-sm"></div>
                        <span className="ml-3 text-sm font-medium text-premium-gray-darkest hidden sm:inline">
                          {isAdvancedMode ? 'Проф.' : 'Обычный'}
                        </span>
                      </label>
                    </div>
                  </div>
                  
                  {/* Информационный блок режима */}
                  <div className={`${isMobile ? 'text-sm' : 'text-base'} text-premium-gray-dark bg-premium-gray-lightest p-4 rounded-input border border-premium-gray-light`}>
                    {isAdvancedMode ? (
                      <span>⚙️ <strong className="font-semibold text-premium-gray-darkest">Профессиональный режим:</strong> Доступны все параметры для детальной настройки</span>
                    ) : (
                      <span>🔘 <strong className="font-semibold text-premium-gray-darkest">Обычный режим:</strong> Основные параметры для быстрого расчета</span>
                    )}
                  </div>
                </div>
                
                {/* Форма */}
                <div className={`${isMobile ? 'p-5' : 'p-8'}`}>
                  <CalculatorForm 
                    onCalculationChange={handleCalculationChange} 
                    onOptionsChange={handleOptionsChange}
                    onParametersChange={handleParametersChange}
                    isAdvancedMode={isAdvancedMode}
                  />
                </div>
              </div>

              {/* AI Чат */}
              {!isMobile && (
                <div className="mt-8">
                  <ChatPanel id="ai-chat" />
                </div>
              )}
            </div>

            {/* Блок расчёта стоимости (справа) */}
            <div className="xl:col-span-1">
              <div className={`${isMobile ? '' : 'sticky top-8'}`}>
                <PriceSummary result={finalResult} area={area} options={options} />
                
                {finalResult.total > 0 && !isMobile && (
                  <div className="mt-6 bg-white rounded-card p-6 border border-premium-gray-light shadow-premium">
                    <h4 className="font-semibold text-premium-gray-darkest mb-4 text-lg">ℹ️ Информация</h4>
                    <div className="space-y-3 text-sm text-premium-gray-dark leading-relaxed">
                      <p className="flex items-start gap-2">
                        <span className="text-premium-gray-medium">•</span>
                        <span>Цены указаны в тенге <span className={`font-semibold ${options.isVatIncluded ? 'text-premium-green' : 'text-premium-gray-darkest'}`}>{options.isVatIncluded ? 'С НДС' : 'БЕЗ НДС'}</span></span>
                      </p>
                      <p className="flex items-start gap-2">
                        <span className="text-premium-gray-medium">•</span>
                        <span>Сроки строительства: 30-45 дней</span>
                      </p>
                      <p className="flex items-start gap-2">
                        <span className="text-premium-gray-medium">•</span>
                        <span>Гарантия на дом: 3 года</span>
                      </p>
                      <p className="flex items-start gap-2">
                        <span className="text-premium-gray-medium">•</span>
                        <span>
                          {options.isInstallment ? (
                            options.installmentAmount > 0 
                              ? `Рассрочка применяется к: ${new Intl.NumberFormat('ru-RU').format(options.installmentAmount)} ₸`
                              : 'Оплата возможна в рассрочку (от всей суммы)'
                          ) : 'Без рассрочки'}
                        </span>
                      </p>
                      <p className="flex items-start gap-2">
                        <span className="text-premium-gray-medium">•</span>
                        <span>Включает все материалы и работы</span>
                      </p>
                    </div>
                  </div>
                )}

                {/* AI Чат для мобильных */}
                {isMobile && (
                  <div className="mt-6">
                    <ChatPanel id="ai-chat" />
                  </div>
                )}
              </div>
            </div>
          </div>

        <CommercialProposal
          area={area}
          parameters={parameters}
          result={finalResult}
          options={options}
        />

          {!isMobile && (
            <div className="mt-10 bg-gradient-to-br from-premium-green-lighter to-white border border-premium-green-light rounded-premium p-8 shadow-premium">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-premium-green-lighter rounded-xl flex-shrink-0">
                  <CalcIcon className="w-6 h-6 text-premium-green" />
                </div>
                <div>
                  <h3 className="font-bold text-premium-gray-darkest mb-3 text-xl">
                    Как пользоваться калькулятором
                  </h3>
                  <div className="text-premium-gray-darkest text-base space-y-2 leading-relaxed">
                    <p className="flex items-start gap-2">
                      <span className="font-semibold text-premium-green">1.</span>
                      <span>Введите площадь дома (от 10 до 1500 м²)</span>
                    </p>
                    <p className="flex items-start gap-2">
                      <span className="font-semibold text-premium-green">2.</span>
                      <span>Выберите тип фундамента и количество этажей</span>
                    </p>
                    <p className="flex items-start gap-2">
                      <span className="font-semibold text-premium-green">3.</span>
                      <span>Настройте высоту этажей и тип перегородок</span>
                    </p>
                    <p className="flex items-start gap-2">
                      <span className="font-semibold text-premium-green">4.</span>
                      <span>Выберите тип крыши, потолка и дополнительные работы</span>
                    </p>
                    <p className="flex items-start gap-2">
                      <span className="font-semibold text-premium-green">5.</span>
                      <span>Получите точный расчет с разбивкой по статьям</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Плавающая кнопка AI-Консультанта */}
      <AiFloatingButton onScrollToChat={scrollToChat} />
    </div>
  );
};

