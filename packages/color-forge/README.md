# @code-lab/themes

Customizable themes for Code Lab visualizations.

**Author:** Joshua Terranova  
**License:** MIT

## Features

- Multiple built-in themes (Light, Dark, Ocean, Forest)
- Custom theme creation
- Theme switching with listeners
- CSS variable generation
- Type-safe theme definitions

## Installation

```bash
npm install @code-lab/themes
```

## Usage

```typescript
import { ThemeManager, lightTheme, darkTheme, oceanTheme, forestTheme } from '@code-lab/themes';

const manager = new ThemeManager();

// Register themes
manager.register(lightTheme);
manager.register(darkTheme);
manager.register(oceanTheme);
manager.register(forestTheme);

// Set active theme
manager.setActiveTheme('dark');

// Get CSS variables
const theme = manager.getActiveTheme();
const css = manager.applyTheme(theme);

// Listen for theme changes
const unsubscribe = manager.onThemeChange((theme) => {
  console.log('Theme changed to:', theme.name);
});
```

## Custom Themes

```typescript
import { Theme } from '@code-lab/themes';

const myTheme: Theme = {
  id: 'custom',
  name: 'My Custom Theme',
  description: 'My personalized theme',
  colors: {
    background: '#ffffff',
    foreground: '#000000',
    // ... other colors
  },
  fonts: {
    body: 'Arial, sans-serif',
    heading: 'Georgia, serif',
    code: 'monospace',
    sizes: {
      small: '12px',
      medium: '14px',
      large: '18px',
      xlarge: '24px',
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
    small: '0 1px 2px rgba(0,0,0,0.1)',
    medium: '0 2px 4px rgba(0,0,0,0.1)',
    large: '0 4px 8px rgba(0,0,0,0.1)',
  },
};

manager.register(myTheme);
```

## License

MIT - Created by Joshua Terranova

