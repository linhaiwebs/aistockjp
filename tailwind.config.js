/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Primary Ocean Blue Theme
        'ocean-50': '#f0f9ff',
        'ocean-100': '#e0f2fe',
        'ocean-200': '#bae6fd',
        'ocean-300': '#7dd3fc',
        'ocean-400': '#38bdf8',
        'ocean-500': '#0ea5e9',
        'ocean-600': '#0284c7',
        'ocean-700': '#0369a1',
        'ocean-800': '#075985',
        'ocean-900': '#0c4a6e',

        // Complementary Coral/Peach Accent
        'coral-50': '#fff7ed',
        'coral-100': '#ffedd5',
        'coral-200': '#fed7aa',
        'coral-300': '#fdba74',
        'coral-400': '#fb923c',
        'coral-500': '#f97316',
        'coral-600': '#ea580c',
        'coral-700': '#c2410c',
        'coral-800': '#9a3412',
        'coral-900': '#7c2d12',

        // Teal Supporting Color
        'teal-50': '#f0fdfa',
        'teal-100': '#ccfbf1',
        'teal-200': '#99f6e4',
        'teal-300': '#5eead4',
        'teal-400': '#2dd4bf',
        'teal-500': '#14b8a6',
        'teal-600': '#0d9488',
        'teal-700': '#0f766e',
        'teal-800': '#115e59',
        'teal-900': '#134e4a',

        // Soft Amber for CTAs
        'amber-50': '#fffbeb',
        'amber-100': '#fef3c7',
        'amber-200': '#fde68a',
        'amber-300': '#fcd34d',
        'amber-400': '#fbbf24',
        'amber-500': '#f59e0b',
        'amber-600': '#d97706',
        'amber-700': '#b45309',
        'amber-800': '#92400e',
        'amber-900': '#78350f',

        // Legacy aliases (for gradual migration)
        'light-blue': '#e0f2fe',
        'pale-blue': '#dbeafe',
      },
      backgroundImage: {
        'ocean-gradient': 'linear-gradient(to bottom, #f0f9ff, #e0f2fe, #bae6fd)',
        'ocean-radial': 'radial-gradient(circle at top, #0ea5e9, transparent)',
        'teal-gradient': 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)',
        'teal-soft': 'linear-gradient(to bottom, #f0fdfa, #ccfbf1)',
        'coral-gradient': 'linear-gradient(135deg, #fb923c 0%, #f97316 100%)',
        'amber-gradient': 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
        'ocean-coral': 'linear-gradient(135deg, #0ea5e9 0%, #38bdf8 50%, #fb923c 100%)',
        'peaceful-sky': 'linear-gradient(to bottom, #ffffff, #f0f9ff, #e0f2fe)',
      },
      boxShadow: {
        'ocean-glow': '0 0 20px rgba(14, 165, 233, 0.4)',
        'ocean-glow-lg': '0 0 40px rgba(14, 165, 233, 0.5)',
        'teal-glow': '0 0 20px rgba(20, 184, 166, 0.4)',
        'teal-glow-lg': '0 0 40px rgba(20, 184, 166, 0.5)',
        'coral-glow': '0 0 20px rgba(251, 146, 60, 0.4)',
        'amber-glow': '0 0 15px rgba(251, 191, 36, 0.5)',
      },
      animation: {
        'pulse-ocean': 'pulse-ocean 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float-rotate': 'float-rotate 4s ease-in-out infinite',
        'fadeIn': 'fadeIn 0.3s ease-in',
        'spin-slow': 'spin 8s linear infinite',
        'spin-medium': 'spin 5s linear infinite',
        'spin-fast': 'spin 3s linear infinite',
        'breathe': 'breathe 3s ease-in-out infinite',
        'shine': 'shine 2.5s ease-in-out infinite',
        'orbit': 'orbit 20s linear infinite',
        'orbit-reverse': 'orbit-reverse 20s linear infinite',
        'float-subtle': 'float-subtle 3s ease-in-out infinite',
      },
      keyframes: {
        'pulse-ocean': {
          '0%, 100%': { opacity: 1, boxShadow: '0 0 20px rgba(14, 165, 233, 0.4)' },
          '50%': { opacity: 0.9, boxShadow: '0 0 40px rgba(14, 165, 233, 0.6)' },
        },
        'float-rotate': {
          '0%, 100%': { transform: 'rotate(0deg) translateY(0)' },
          '50%': { transform: 'rotate(5deg) translateY(-10px)' },
        },
        'fadeIn': {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        'breathe': {
          '0%, 100%': { transform: 'scale(1)', opacity: 1 },
          '50%': { transform: 'scale(1.08)', opacity: 0.95 },
        },
        'shine': {
          '0%': { transform: 'translateX(-100%) translateY(-100%) rotate(30deg)' },
          '50%': { transform: 'translateX(100%) translateY(100%) rotate(30deg)' },
          '100%': { transform: 'translateX(100%) translateY(100%) rotate(30deg)' },
        },
        'orbit': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'orbit-reverse': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(-360deg)' },
        },
        'float-subtle': {
          '0%, 100%': { transform: 'translateY(0px) scale(1)' },
          '50%': { transform: 'translateY(-5px) scale(1.05)' },
        },
      },
      fontFamily: {
        'title': ['HYYaKuHeiW', 'Noto Sans JP', 'sans-serif'],
        'subtitle': ['Adobe Heiti Std', 'Hiragino Sans', 'sans-serif'],
      },
      spacing: {
        '7.5': '30px',
      },
      borderRadius: {
        'modern-xl': '20px',
        'modern-lg': '16px',
        'modern-md': '12px',
      },
    },
  },
  plugins: [],
};
