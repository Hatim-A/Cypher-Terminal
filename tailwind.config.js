/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: [
        './pages/**/*.{ts,tsx}',
        './components/**/*.{ts,tsx}',
        './app/**/*.{ts,tsx}',
    ],
    theme: {
        extend: {
            fontFamily: {
                mono: ['var(--font-mono)', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
                sans: ['var(--font-sans)', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
            },
            colors: {
                // True Monster Zero Ultra Palette
                "dark-bg": "#000000",     // OLED Pitch Black
                "dark-panel": "#000000",  // Force Black
                "dark-border": "#333333", // Stronger contrast border
                "dark-hover": "#222222",  // Hover
                "neon-green": "#5AC2F7",  // Up = Sky Blue (Zero Ultra Accent)
                "accent-purple": "#5AC2F7", // Accents = Sky Blue
                "neon-red": "#8B8F9A",    // Down = Cool Grey (Monochrome Aesthetic)
                "soft-red": "#B4B6B5",    // Lighter Grey
                "text-primary": "#FFFFFF",
                "text-secondary": "#B4B6B5", // Silver Text
                "text-dim": "#666666",
            },
            borderRadius: {
                DEFAULT: "2px",
                sm: "2px",
                md: "3px",
                lg: "4px",
            },
            fontSize: {
                xxs: '0.6rem',
            }
        },
    },
    plugins: [],
}
