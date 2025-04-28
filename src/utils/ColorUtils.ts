import tailwindConfig from '../../tailwind.config.ts';

/**
 * Utility class for accessing color values from the Tailwind theme
 */
export class ColorUtils {
  private static colors: Record<string, any> = tailwindConfig.theme.extend.colors;

  /**
   * Get a color hex value by its path
   * @param colorPath - Path to the color (e.g., "primary", "primary.light", "ui.text.primary")
   * @returns The hex color value or undefined if not found
   */
  public static getColor(colorPath: string): string | undefined {
    const parts = colorPath.split('.');
    let current: ColorValue = this.colors;

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
   * Primary color palette
   */
  public static primary = {
    default: this.getColor('primary') || '#059669',
    light: this.getColor('primary.light') || '#10B981',
    dark: this.getColor('primary.dark') || '#047857',
  };

  /**
   * Action color palette
   */
  public static action = {
    default: this.getColor('action') || '#3B82F6',
    hover: this.getColor('action.hover') || '#2563EB',
    light: this.getColor('action.light') || '#93C5FD',
    lightest: this.getColor('action.lightest') || '#DBEAFE',
  };

  /**
   * Accent color palette
   */
  public static accent = {
    default: this.getColor('accent') || '#F59E0B',
    hover: this.getColor('accent.hover') || '#D97706',
    light: this.getColor('accent.light') || '#FCD34D',
  };

  /**
   * UI element colors
   */
  public static ui = {
    default: this.getColor('ui') || '#FFFFFF',
    secondary: this.getColor('ui.secondary') || '#F1F5F9',
    border: this.getColor('ui.border') || '#E2E8F0',
    text: {
      primary: this.getColor('ui.text.primary') || '#0F172A',
      secondary: this.getColor('ui.text.secondary') || '#64748B',
      light: this.getColor('ui.text.light') || '#FFFFFF',
    },
  };

  /**
   * Flowchart-specific colors
   */
  public static flowchart = {
    node: {
      default: this.getColor('flowchart.node.default') || '#D1FAE5',
      selected: this.getColor('flowchart.node.selected') || '#DBEAFE',
      border: {
        default: this.getColor('flowchart.node.border.default') || '#059669',
        selected: this.getColor('flowchart.node.border.selected') || '#3B82F6',
      },
    },
    line: {
      default: this.getColor('flowchart.line.default') || '#64748B',
      selected: this.getColor('flowchart.line.selected') || '#3B82F6',
      hover: this.getColor('flowchart.line.hover') || '#0F172A',
    },
  };
}

export default ColorUtils; 