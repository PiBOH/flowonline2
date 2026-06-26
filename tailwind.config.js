/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        flow: {
          main: '#66bb6a', // Green
          input: '#4dd0e1', // Light cyan/blue
          output: '#81c784', // Teal/greenish
          declare: '#fff176', // Soft yellow
          assign: '#fff176', // Soft yellow
          call: '#64b5f6', // Light blue
          if: '#ffb74d', // Orange
          loop: '#e57373', // Red/Coral
          bg: '#f5f5f5',
        }
      },
      fontFamily: {
        sans: ['Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
        mono: ['Consolas', 'Courier New', 'monospace'],
      }
    },
  },
  plugins: [],
}
