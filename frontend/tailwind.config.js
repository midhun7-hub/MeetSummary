/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: "#f97316", // Orange 500
                secondary: "#fb923c", // Orange 400
                dark: "#000000ff", // Zinc 900 (Dark Black)
                darker: "#040404", // Exact background color of logo.png
                surface: "#18181b", // Zinc 900
                grey: "#0d0d0d", // Deeper Zinc (Slightly lighter than pure black)
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
