/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,jsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Emergency Pulse Theme - High Contrast Colors
                danger: '#EF4444',      // Signal Red
                void: '#0A0A0A',        // Deep Black
                warning: '#F97316',     // Safety Orange
                light: '#FAFAFA',       // Electric White
                success: '#10B981',     // Confirm Green
                muted: '#6B7280',       // Gray for secondary text
            },
            fontFamily: {
                display: ['Sora', 'system-ui', 'sans-serif'],
                body: ['Inter', 'system-ui', 'sans-serif'],
            },
            borderRadius: {
                // Sharp geometry (0-2px) - No "safe boring zone"
                none: '0px',
                xs: '1px',
                sm: '2px',
                // Deliberately skip 4-8px
            },
            spacing: {
                // 8-point grid system
                '0': '0px',
                '1': '4px',
                '2': '8px',
                '3': '12px',
                '4': '16px',
                '6': '24px',
                '8': '32px',
                '12': '48px',
                '16': '64px',
                '20': '80px',
                '24': '96px',
            },
            animation: {
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'pulse-fast': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'radar': 'radar 2s ease-out infinite',
            },
            keyframes: {
                radar: {
                    '0%': { transform: 'scale(0.8)', opacity: '1' },
                    '100%': { transform: 'scale(2)', opacity: '0' },
                }
            }
        },
    },
    plugins: [],
}
