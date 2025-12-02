import React from 'react';
import { ChevronDown } from 'lucide-react';

interface DropdownOption {
  label: string;
  value: string;
}

interface DropdownProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: DropdownOption[];
  placeholder?: string;
}

export const Dropdown: React.FC<DropdownProps> = ({
  label,
  value,
  onChange,
  options,
  placeholder = 'Выберите опцию'
}) => {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-premium-gray-darkest">
        {label}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-4 py-3 border border-premium-gray-light rounded-input focus:ring-2 focus:ring-premium-green focus:border-premium-green outline-none transition-all duration-200 appearance-none bg-white pr-10 text-base text-premium-gray-darkest shadow-sm focus:shadow-premium hover:border-premium-gray-medium"
        >
          <option value="">{placeholder}</option>
          {options.map((option, index) => (
            <option key={index} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-premium-gray-medium pointer-events-none" />
      </div>
    </div>
  );
};

