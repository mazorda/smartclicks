/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Dark mode specific colors
        dark: {
          bg: {
            primary: 'rgb(17, 24, 39)', // gray-900
            secondary: 'rgb(31, 41, 55)', // gray-800
          },
          text: {
            primary: 'rgb(255, 255, 255)', // white
            secondary: 'rgb(156, 163, 175)', // gray-400
            tertiary: 'rgb(107, 114, 128)', // gray-500
          },
          accent: {
            light: 'rgb(167, 139, 250)', // purple-400
            base: 'rgb(124, 58, 237)',   // purple-600
            dark: 'rgb(109, 40, 217)',   // purple-700
          }
        }
      },
      animation: {
        'textGradient': 'textGradient 3s linear infinite',
        'patternFloat': 'patternFloat 20s linear infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'gradient': 'gradient 3s linear infinite',
        'pulse-dot': 'pulse-dot 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'radar-spin': 'radar-spin 2s linear infinite',
        'fade-out': 'fade-out 0.5s ease-out forwards',
        'fade-in': 'fade-in 0.5s ease-in forwards',
      },
      keyframes: {
        textGradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        patternFloat: {
          '0%': { backgroundPosition: '0 0' },
          '100%': { backgroundPosition: '48px 48px' },
        },
        glow: {
          '0%': { opacity: '0.3' },
          '100%': { opacity: '0.7' },
        },
        gradient: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        'pulse-dot': {
          '0%, 100%': {
            transform: 'scale(1)',
            opacity: '1'
          },
          '50%': {
            transform: 'scale(1.5)',
            opacity: '0'
          }
        },
        'radar-spin': {
          '0%': {
            transform: 'rotate(0deg)'
          },
          '100%': {
            transform: 'rotate(360deg)'
          }
        },
        'fade-out': {
          '0%': {
            opacity: '1'
          },
          '100%': {
            opacity: '0'
          }
        },
        'fade-in': {
          '0%': {
            opacity: '0'
          },
          '100%': {
            opacity: '1'
          }
        }
      },
      transitionProperty: {
        'colors': 'color, background-color, border-color, text-decoration-color, fill, stroke',
        'opacity': 'opacity',
        'shadow': 'box-shadow',
        'transform': 'transform',
      },
      transitionTimingFunction: {
        'ease-in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      transitionDuration: {
        '150': '150ms',
        '200': '200ms',
        '300': '300ms',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
