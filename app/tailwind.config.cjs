/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--tg-theme-bg-color, rgb(34, 30, 42))',
        secondary: 'var(--tg-theme-secondary-bg-color, rgb(49, 43, 58))',
        primary: 'var(--tg-theme-text-color, rgb(245, 245, 245))',
        hint: 'var(--tg-theme-hint-color, rgb(133, 125, 149))',
        link: 'var(--tg-theme-link-color, rgb(184, 159, 242))',
        button: 'var(--tg-theme-button-color, rgb(145, 123, 189))',
        buttonText: 'var(--tg-theme-button-text-color, rgb(255, 255, 255))',
        vkLogo: '#4C75A3'
      },
      keyframes: {
        expand: {
          "0, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.2)" }
        }
      },
      animation: {
        expand: "expand 300ms ease-in-out"
      }
    }
  },
  plugins: [],
}
