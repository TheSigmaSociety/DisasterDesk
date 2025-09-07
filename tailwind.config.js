/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          blue: '#00f5ff',
          purple: '#8a2be2',
          pink: '#ff1493',
          green: '#39ff14',
          orange: '#ff6600',
          red: '#ff073a',
        },
        dark: {
          bg: '#0a0a0a',
          surface: '#111111',
          card: '#1a1a1a',
        },
        emergency: {
          critical: '#ff073a',
          high: '#ff6600',
          medium: '#ffaa00',
          low: '#39ff14',
        },
      },
      fontFamily: {
        'cyber': ['Orbitron', 'monospace'],
        'space': ['Space Grotesk', 'sans-serif'],
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite alternate',
        'float': 'float 3s ease-in-out infinite',
        'scan-line': 'scan-line 4s linear infinite',
        'emergency-sweep': 'emergency-sweep 3s ease-in-out infinite',
        'dispatch-sweep': 'dispatch-sweep 3s ease-in-out infinite reverse',
      },
      backdropBlur: {
        'xs': '2px',
      },
      boxShadow: {
        'neon': '0 0 20px currentColor, 0 0 40px currentColor, 0 0 80px currentColor',
        'pulse': '0 0 10px currentColor, 0 0 20px currentColor, 0 0 30px currentColor',
        'glow': '0 0 30px currentColor',
      },
      backgroundImage: {
        'cyber-grid': 'linear-gradient(rgba(0, 245, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 245, 255, 0.1) 1px, transparent 1px)',
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      backgroundSize: {
        'cyber': '50px 50px',
      },
    },
  },
  plugins: [],
}
