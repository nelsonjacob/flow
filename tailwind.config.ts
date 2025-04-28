/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          // Primary Colors
          primary: {
            DEFAULT: '#059669', // Menu bar background (emerald green)
            light: '#10B981',   // Lighter shade for borders/dividers
            dark: '#047857',    // Darker shade for hover states
          },
          // Action Colors
          action: {
            DEFAULT: '#3B82F6', // Primary action buttons (bright blue)
            hover: '#2563EB',   // Hover state for primary actions
            light: '#93C5FD',   // Lighter blue for secondary elements
            lightest: '#DBEAFE', // Very light blue for backgrounds/fills
          },
          // Accent Colors
          accent: {
            DEFAULT: '#F59E0B', // Accent color (amber) for important actions
            hover: '#D97706',   // Hover state for accent
            light: '#FCD34D',   // Light amber for highlights
          },
          // UI Element Colors
          ui: {
            DEFAULT: '#FFFFFF', // White background elements
            secondary: '#F1F5F9', // Light gray background
            border: '#E2E8F0',   // Border color for light elements
            text: {
              primary: '#0F172A',  // Primary text color (dark slate)
              secondary: '#64748B', // Secondary text color (medium slate)
              light: '#FFFFFF',    // Text on dark backgrounds
            }
          },
          // Flowchart Specific Colors
          flowchart: {
            node: {
              default: '#D1FAE5', // Default node background (light green)
              selected: '#DBEAFE', // Selected node background (light blue)
              border: {
                default: '#059669', // Default node border (matching menu)
                selected: '#3B82F6' // Selected node border (blue)
              }
            },
            line: {
              default: '#64748B', // Default connection line
              selected: '#3B82F6', // Selected connection line
              hover: '#0F172A'    // Hover state for connection lines
            }
          }
        },
        // Add custom shadow variations
        boxShadow: {
          'menu': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
          'node': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
          'node-selected': '0 0 0 2px #3B82F6, 0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        },
      },
    },
    plugins: [],
}

