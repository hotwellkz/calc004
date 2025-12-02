import React from 'react';

interface InputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  min?: number;
  max?: number;
  type?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  value,
  onChange,
  placeholder,
  min,
  max,
  type = 'text',
  error
}) => {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-premium-gray-darkest">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        min={min}
        max={max}
        className={`w-full px-4 py-3 border rounded-input focus:ring-2 focus:ring-premium-green focus:border-premium-green outline-none transition-all duration-200 text-base text-premium-gray-darkest placeholder-premium-gray-medium shadow-sm focus:shadow-premium ${
          error ? 'border-red-400 focus:ring-red-400' : 'border-premium-gray-light'
        }`}
      />
      {error && (
        <p className="text-sm text-red-600 font-medium">{error}</p>
      )}
    </div>
  );
};

