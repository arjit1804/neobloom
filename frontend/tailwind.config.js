/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Primary colors
        'primary-blue': '#2563eb',
        'primary-light': '#3b82f6',
        'primary-dark': '#1e40af',
        
        // Gray scale
        'gray-50': '#f9fafb',
        'gray-100': '#f3f4f6',
        'gray-200': '#e5e7eb',
        'gray-300': '#d1d5db',
        'gray-400': '#9ca3af',
        'gray-500': '#6b7280',
        'gray-600': '#4b5563',
        'gray-700': '#374151',
        'gray-800': '#1f2937',
        'gray-900': '#111827',
        
        // Accent colors
        'accent-primary': '#2563eb',
        'accent-secondary': '#4b5563',
        'accent-tertiary': '#10b981',
      },
      fontFamily: {
        'sans': ['Inter', 'sans-serif'],
        'mono': ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'blue': '0 0 5px rgba(37, 99, 235, 0.5)',
        'green': '0 0 5px rgba(16, 185, 129, 0.5)',
        'gray': '0 0 5px rgba(75, 85, 99, 0.5)',
      },
      backgroundImage: {
        'light-gradient': 'linear-gradient(to right, #f9fafb, #f3f4f6)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      backdropFilter: {
        'none': 'none',
        'blur': 'blur(20px)',
      },
      borderWidth: {
        '1': '1px',
      },
    },
  },
  plugins: [],
} 