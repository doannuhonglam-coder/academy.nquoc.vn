/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy:    { DEFAULT: '#1B3A6B', light: '#E8EDF5' },
        blue:    { DEFAULT: '#2E86AB', light: '#EBF3F8' },
        teal:    { DEFAULT: '#00838F', light: '#E0F4F5' },
        gold:    { DEFAULT: '#E07B39', light: '#FDF3EC' },
        green:   { DEFAULT: '#2E7D32', light: '#E8F5E9' },
        red:     { DEFAULT: '#C62828', light: '#FFEBEE' },
        purple:  { DEFAULT: '#6D28D9', light: '#EDE9FE' },
        muted:   '#6B7280',
        border:  '#E5E7EB',
        ink:     '#111827',
      },
      fontFamily: {
        sans: ['Inter', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
