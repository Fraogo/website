import type { Config } from 'tailwindcss'
import tailwindAnimate from 'tailwindcss-animate'

const config: Config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          // ── BRAND BLUE PALETTE ─────────────────────────────────────────
          // These are placeholders. Replace hex values here when the
          // designer provides the final brand colours. One change here
          // updates the entire site.
          blue: {
            DEFAULT: '#1B4AD4',   // Primary brand blue
            deep:    '#0E2A82',   // Dark / hover state
            mid:     '#2A5EE8',   // Gradient lighter end
            pale:    '#EEF2FF',   // Section backgrounds
            50:      '#F5F7FF',
            100:     '#EEF2FF',
            200:     '#C7D4FA',
            300:     '#9FB4F5',
            400:     '#6E8EEF',
            500:     '#4067E8',
            600:     '#2A5EE8',
            700:     '#1B4AD4',
            800:     '#1438A8',
            900:     '#0E2A82',
          },
        },
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
        xl: 'calc(var(--radius) + 4px)',
        '2xl': 'calc(var(--radius) + 8px)',
      },
      boxShadow: {
        soft: '0 2px 8px rgba(0,0,0,0.06)',
        card: '0 4px 16px rgba(0,0,0,0.08)',
        elevated: '0 8px 32px rgba(0,0,0,0.12)',
        glow: '0 0 24px rgba(27,74,212,0.20)',
      },
      backgroundImage: {
        'hero-pattern':  'linear-gradient(135deg, #0E2A82 0%, #1B4AD4 60%, #2A5EE8 100%)',
        'blue-gradient': 'linear-gradient(135deg, #0E2A82 0%, #1B4AD4 100%)',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in-right': {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
        'pulse-slow': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.5s ease-out',
        'slide-in-right': 'slide-in-right 0.4s ease-out',
        'slide-up': 'slide-up 0.6s ease-out',
        'shimmer': 'shimmer 1.5s infinite',
        'pulse-slow': 'pulse-slow 2s ease-in-out infinite',
        'scale-in': 'scale-in 0.3s ease-out',
      },
    },
  },
  plugins: [tailwindAnimate],
}

export default config
