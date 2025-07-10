/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#E91E63',
          dark: '#C2185B',
        },
        secondary: {
          DEFAULT: '#00BCD4',
        },
        success: '#4CAF50',
        warning: '#FF9800',
        error: '#F44336',
        gray: {
          50: '#FAFAFA',
          100: '#F5F5F5',
          900: '#212121',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
} 