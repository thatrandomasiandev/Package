/**
 * Theme Presets
 * Original designs by Joshua Terranova
 */

import { Theme } from './theme';

export const lightTheme: Theme = {
  id: 'light',
  name: 'Light',
  description: 'Clean light theme for daytime coding',
  colors: {
    background: '#ffffff',
    foreground: '#1a1a1a',
    primary: '#0066cc',
    secondary: '#6c757d',
    accent: '#ff6b35',
    success: '#28a745',
    warning: '#ffc107',
    error: '#dc3545',
    border: '#dee2e6',
    hover: '#f8f9fa',
  },
  fonts: {
    body: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    heading: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    code: '"SF Mono", "Monaco", "Inconsolata", "Fira Code", "Droid Sans Mono", monospace',
    sizes: {
      small: '0.875rem',
      medium: '1rem',
      large: '1.25rem',
      xlarge: '1.5rem',
    },
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  borderRadius: 4,
  shadows: {
    small: '0 1px 3px rgba(0, 0, 0, 0.12)',
    medium: '0 4px 6px rgba(0, 0, 0, 0.16)',
    large: '0 10px 20px rgba(0, 0, 0, 0.19)',
  },
};

export const darkTheme: Theme = {
  id: 'dark',
  name: 'Dark',
  description: 'Comfortable dark theme for extended coding sessions',
  colors: {
    background: '#1e1e1e',
    foreground: '#d4d4d4',
    primary: '#4fc3f7',
    secondary: '#9e9e9e',
    accent: '#ff9e40',
    success: '#66bb6a',
    warning: '#ffca28',
    error: '#ef5350',
    border: '#3e3e42',
    hover: '#2d2d30',
  },
  fonts: {
    body: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    heading: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    code: '"SF Mono", "Monaco", "Inconsolata", "Fira Code", "Droid Sans Mono", monospace',
    sizes: {
      small: '0.875rem',
      medium: '1rem',
      large: '1.25rem',
      xlarge: '1.5rem',
    },
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  borderRadius: 4,
  shadows: {
    small: '0 1px 3px rgba(0, 0, 0, 0.5)',
    medium: '0 4px 6px rgba(0, 0, 0, 0.6)',
    large: '0 10px 20px rgba(0, 0, 0, 0.7)',
  },
};

export const oceanTheme: Theme = {
  id: 'ocean',
  name: 'Ocean',
  description: 'Cool ocean-inspired color palette',
  colors: {
    background: '#0d1b2a',
    foreground: '#e0e1dd',
    primary: '#00b4d8',
    secondary: '#778da9',
    accent: '#90e0ef',
    success: '#06ffa5',
    warning: '#ffb703',
    error: '#e63946',
    border: '#1b263b',
    hover: '#15213a',
  },
  fonts: {
    body: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    heading: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    code: '"SF Mono", "Monaco", "Inconsolata", "Fira Code", "Droid Sans Mono", monospace',
    sizes: {
      small: '0.875rem',
      medium: '1rem',
      large: '1.25rem',
      xlarge: '1.5rem',
    },
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  borderRadius: 6,
  shadows: {
    small: '0 1px 3px rgba(0, 180, 216, 0.2)',
    medium: '0 4px 6px rgba(0, 180, 216, 0.3)',
    large: '0 10px 20px rgba(0, 180, 216, 0.4)',
  },
};

export const forestTheme: Theme = {
  id: 'forest',
  name: 'Forest',
  description: 'Nature-inspired green theme',
  colors: {
    background: '#1a2f1a',
    foreground: '#e8f3e8',
    primary: '#52b788',
    secondary: '#74c69d',
    accent: '#95d5b2',
    success: '#40916c',
    warning: '#f4a261',
    error: '#e76f51',
    border: '#2d4a2d',
    hover: '#243d24',
  },
  fonts: {
    body: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    heading: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    code: '"SF Mono", "Monaco", "Inconsolata", "Fira Code", "Droid Sans Mono", monospace',
    sizes: {
      small: '0.875rem',
      medium: '1rem',
      large: '1.25rem',
      xlarge: '1.5rem',
    },
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  borderRadius: 8,
  shadows: {
    small: '0 1px 3px rgba(82, 183, 136, 0.2)',
    medium: '0 4px 6px rgba(82, 183, 136, 0.3)',
    large: '0 10px 20px rgba(82, 183, 136, 0.4)',
  },
};

