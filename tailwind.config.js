/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './app.vue',
    './error.vue'
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1F2A44',   // Deep Navy Blue
        accent: '#F4C542',    // Rich Gold
        secondary: '#F2F3F6', // Cool Gray
        neutral: '#3E4758',   // Charcoal Gray
        'steel-blue': '#33658A', // Steel Blue (CTA Hover/Link)
        success: '#2D8A4B'    // Fresh Green
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Montserrat', 'sans-serif']
      }
    }
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography')
  ]
}
