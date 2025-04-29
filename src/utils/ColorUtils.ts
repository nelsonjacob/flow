import tailwindConfig from '../../tailwind.config.ts';

/**
 * Utility class for accessing color values from the Tailwind theme
 */
export class ColorUtils {
  private static colors: Record<string, any> = tailwindConfig.theme.extend.colors;

  /**
   * Get a color hex value by its path
   * @param colorPath - Path to the color (e.g., "apptheme", "apptheme.light", "ui.text.primary")
   * @returns The hex color value or undefined if not found
   */
  public static getColor(colorPath: string): string | undefined {
    const parts = colorPath.split('.');
    let current: any = this.colors;

    for (const part of parts) {
      if (typeof current !== 'object' || current === null) {
        return undefined;
      }

      // Handle 'DEFAULT' keyword in TailwindCSS
      if (part === 'default') {
        current = current['DEFAULT'];
      } else {
        current = current[part];
      }

      if (current === undefined) {
        return undefined;
      }
    }

    return typeof current === 'string' ? current : undefined;
  }

  /**
   * App theme color palette
   */
  public static apptheme = {
    default: this.getColor('apptheme') || '#14b8a6',
    light: this.getColor('apptheme.light') || '#99f6e4',
    dark: this.getColor('apptheme.dark') || '#0f766e',
    darker: this.getColor('apptheme.darker') || '#115e59',
  };

  /**
   * App theme green flowchart color palette
   */
  public static appthemeGreenFlowchart = {
    default: this.getColor('apptheme-green-flowchart') || '#10b981',
    light: this.getColor('apptheme-green-flowchart.light') || '#6ee7b7',
    dark: this.getColor('apptheme-green-flowchart.dark') || '#047857',
    darker: this.getColor('apptheme-green-flowchart.darker') || '#064e3b',
  };

  /**
   * Status color palette
   */
  public static status = {
    success: this.getColor('status.success') || '#10b981',
    error: this.getColor('status.error') || '#ef4444',
    warning: this.getColor('status.warning') || '#f59e0b',
    info: this.getColor('status.info') || '#3b82f6',
  };

  /**
   * UI element colors
   */
  public static ui = {
    default: this.getColor('ui') || '#ffffff',
    secondary: this.getColor('ui.secondary') || '#f8fafc',
    border: this.getColor('ui.border') || '#e2e8f0',
    text: {
      primary: this.getColor('ui.text.primary') || '#111827',
      secondary: this.getColor('ui.text.secondary') || '#4b5563',
      light: this.getColor('ui.text.light') || '#ffffff',
    },
  };

  /**
   * Gray scale colors
   */
  public static grays = {
    50: this.getColor('grays.50') || '#f8fafc',
    100: this.getColor('grays.100') || '#f1f5f9',
    200: this.getColor('grays.200') || '#e2e8f0',
    300: this.getColor('grays.300') || '#cbd5e1',
    400: this.getColor('grays.400') || '#94a3b8',
    500: this.getColor('grays.500') || '#64748b',
    600: this.getColor('grays.600') || '#475569',
    700: this.getColor('grays.700') || '#334155',
    800: this.getColor('grays.800') || '#1e293b',
    900: this.getColor('grays.900') || '#0f172a',
    950: this.getColor('grays.950') || '#020617',
  };

  /**
   * Flowchart-specific colors
   */
  public static flowchart = {
    node: {
      default: this.getColor('apptheme-green-flowchart.light') || '#6ee7b7',
      selected: this.getColor('apptheme-green-flowchart') || '#10b981',
      border: {
        default: this.getColor('grays.300') || '#cbd5e1',
        selected: this.getColor('apptheme-green-flowchart.dark') || '#047857',
      },
    },
    line: {
      default: this.getColor('grays.400') || '#94a3b8',
      selected: this.getColor('grays.600') || '#475569',
      hover: this.getColor('grays.700') || '#334155',
    },
  };
}

export default ColorUtils;