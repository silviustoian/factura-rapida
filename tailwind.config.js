module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // asigură-te că Tailwind scanează toate fișierele
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
      },
      colors: {
        primary: {
          DEFAULT: '#4f46e5', // Indigo-600
          dark: '#4338ca',
          light: '#6366f1',
        },
        bg: '#f9fafb',
        card: '#ffffff',
        border: '#e5e7eb',
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.5rem',
      },
      boxShadow: {
        card: '0 4px 10px rgba(0, 0, 0, 0.05)',
      },
    },
  },
  plugins: [],
};
