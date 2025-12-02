/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        premium: {
          green: {
            DEFAULT: '#11825D',
            light: '#0F766E',
            lighter: '#DCFCE7',
            dark: '#0D5D47',
          },
          gray: {
            darkest: '#111827',
            dark: '#4B5563',
            medium: '#9CA3AF',
            light: '#E5E7EB',
            lightest: '#F3F4F6',
            bg: '#F9FAFB',
          },
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        'premium': '24px',
        'card': '20px',
        'input': '12px',
      },
      boxShadow: {
        'premium': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 10px 15px -3px rgba(0, 0, 0, 0.08)',
        'premium-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'premium-xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      },
    },
  },
  plugins: [],
};

