/**
 * Theme System
 * Original implementation by Joshua Terranova
 */

export interface ThemeColors {
  background: string;
  foreground: string;
  primary: string;
  secondary: string;
  accent: string;
  success: string;
  warning: string;
  error: string;
  border: string;
  hover: string;
}

export interface ThemeFonts {
  body: string;
  heading: string;
  code: string;
  sizes: {
    small: string;
    medium: string;
    large: string;
    xlarge: string;
  };
}

export interface ThemeSpacing {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
}

export interface Theme {
  id: string;
  name: string;
  description: string;
  colors: ThemeColors;
  fonts: ThemeFonts;
  spacing: ThemeSpacing;
  borderRadius: number;
  shadows: {
    small: string;
    medium: string;
    large: string;
  };
}

export class ThemeManager {
  private themes: Map<string, Theme> = new Map();
  private activeTheme: string = 'default';
  private listeners: Array<(theme: Theme) => void> = [];

  register(theme: Theme): void {
    this.themes.set(theme.id, theme);
  }

  unregister(id: string): boolean {
    return this.themes.delete(id);
  }

  getTheme(id: string): Theme | undefined {
    return this.themes.get(id);
  }

  setActiveTheme(id: string): boolean {
    const theme = this.themes.get(id);
    if (theme) {
      this.activeTheme = id;
      this.notifyListeners(theme);
      return true;
    }
    return false;
  }

  getActiveTheme(): Theme | undefined {
    return this.themes.get(this.activeTheme);
  }

  getAllThemes(): Theme[] {
    return Array.from(this.themes.values());
  }

  onThemeChange(callback: (theme: Theme) => void): () => void {
    this.listeners.push(callback);
    return () => {
      const index = this.listeners.indexOf(callback);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  private notifyListeners(theme: Theme): void {
    this.listeners.forEach(listener => listener(theme));
  }

  applyTheme(theme: Theme): string {
    return `
      :root {
        --color-background: ${theme.colors.background};
        --color-foreground: ${theme.colors.foreground};
        --color-primary: ${theme.colors.primary};
        --color-secondary: ${theme.colors.secondary};
        --color-accent: ${theme.colors.accent};
        --color-success: ${theme.colors.success};
        --color-warning: ${theme.colors.warning};
        --color-error: ${theme.colors.error};
        --color-border: ${theme.colors.border};
        --color-hover: ${theme.colors.hover};
        
        --font-body: ${theme.fonts.body};
        --font-heading: ${theme.fonts.heading};
        --font-code: ${theme.fonts.code};
        --font-size-small: ${theme.fonts.sizes.small};
        --font-size-medium: ${theme.fonts.sizes.medium};
        --font-size-large: ${theme.fonts.sizes.large};
        --font-size-xlarge: ${theme.fonts.sizes.xlarge};
        
        --spacing-xs: ${theme.spacing.xs}px;
        --spacing-sm: ${theme.spacing.sm}px;
        --spacing-md: ${theme.spacing.md}px;
        --spacing-lg: ${theme.spacing.lg}px;
        --spacing-xl: ${theme.spacing.xl}px;
        
        --border-radius: ${theme.borderRadius}px;
        --shadow-small: ${theme.shadows.small};
        --shadow-medium: ${theme.shadows.medium};
        --shadow-large: ${theme.shadows.large};
      }
    `;
  }
}

