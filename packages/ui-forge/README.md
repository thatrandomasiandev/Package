# @code-lab/components

Reusable UI components for Code Lab webviews.

**Author:** Joshua Terranova  
**License:** MIT

## Features

- Button, Card, Tabs, Tooltip, Modal components
- Type-safe component props
- Built-in styling
- No external dependencies (except themes)
- Fully customizable

## Installation

```bash
npm install @code-lab/components
```

## Usage

```typescript
import { Button, Card, Tabs, Modal } from '@code-lab/components';

// Button
const button = new Button();
const html = button.render({
  label: 'Click Me',
  onClick: 'handleClick()',
  variant: 'primary',
  size: 'medium'
});

// Card
const card = new Card();
const cardHtml = card.render({
  title: 'My Card',
  content: 'Card content here',
  elevated: true
});

// Tabs
const tabs = new Tabs();
const tabsHtml = tabs.render({
  tabs: [
    { id: 'tab1', label: 'Tab 1', content: 'Content 1' },
    { id: 'tab2', label: 'Tab 2', content: 'Content 2' }
  ]
});

// Modal
const modal = new Modal();
const modalHtml = modal.render({
  id: 'myModal',
  title: 'Confirmation',
  content: 'Are you sure?',
  actions: [
    { label: 'Cancel', onClick: 'closeModal("myModal")', variant: 'secondary' },
    { label: 'Confirm', onClick: 'confirm()', variant: 'primary' }
  ]
});
```

## License

MIT - Created by Joshua Terranova

