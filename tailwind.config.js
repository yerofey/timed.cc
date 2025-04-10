module.exports = {
  purge: ['./index.html', './src/**/*.{css,vue,js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
