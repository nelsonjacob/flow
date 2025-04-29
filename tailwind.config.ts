/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        apptheme: {
          light: '#99f6e4',
          DEFAULT: '#14b8a6',
          dark: '#0f766e',
          darker: '#115e59',
        },
        "apptheme-green-flowchart": {
          light: '#6ee7b7', 
          DEFAULT: '#10b981',
          dark: '#047857',
          darker: '#064e3b',
        },
        grays: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
        status: {
          success: '#10b981', // Modern green for checkmarks/success
          error: '#ef4444',   // Modern red for errors/cancellation
          warning: '#f59e0b', // Amber for warnings
          info: '#3b82f6',    // Blue for information 
        },
        ui: {
          DEFAULT: '#ffffff', // White background elements
          secondary: '#f8fafc', // Very light gray background
          border: '#e2e8f0',   // Light gray border
          text: {
            primary: '#111827',  // Very dark gray for primary text
            secondary: '#4b5563', // Medium gray for secondary text
            light: '#ffffff',    // White text on dark backgrounds
          }
        }
      },
      boxShadow: {
        'menu': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
        'node': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        'node-selected': '0 0 0 2px #374151, 0 4px 6px -1px rgba(0, 0, 0, 0.1)'
      }
    },
  },
  plugins: [],
}