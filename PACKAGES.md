# Code Lab Packages

**Author:** Joshua Terranova  
**License:** MIT

This monorepo contains all packages for the Code Lab VSCode extension. All code is original work by Joshua Terranova.

## 📦 Core Packages

### @code-lab/parser-core
Foundation package providing abstract parser interfaces, AST node types, and utilities for all language parsers.

**Key Features:**
- Abstract `BaseParser` interface
- Unified AST node types
- Parser registry for managing multiple languages
- AST traversal and visitor pattern
- Code metrics extraction

### @code-lab/execution-engine
Language-agnostic code execution runtime with sandboxing and resource monitoring.

**Key Features:**
- Sandboxed code execution
- Memory and CPU monitoring
- Timeout protection
- Variable tracking
- Multi-language executor registry

### @code-lab/visualizers
Core visualization generators for flowcharts, structure trees, and diagrams.

**Key Features:**
- Flow chart generation from AST
- Structure tree visualization
- Interactive HTML rendering
- Customizable layouts and themes

## 🗣️ Language Support

### @code-lab/python-parser
Python AST parsing and execution support.

### @code-lab/java-parser
Java code parsing and analysis.

### @code-lab/rust-parser
Rust code parsing and structure analysis.

## 🎨 Visualization Extensions

### @code-lab/mermaid
Mermaid.js integration for generating diagrams from code.

### @code-lab/d3-visualizer
D3.js-powered interactive force-directed graphs and visualizations.

### @code-lab/charts
Enhanced charting with Chart.js and Plotly.js integration for data visualization.

## 🛠️ Developer Tools

### @code-lab/testing
Test execution framework with visualization and coverage analysis.

### @code-lab/profiler
Performance profiling with benchmarking, flame graphs, and metrics.

### @code-lab/debugger
Step-by-step execution debugger with breakpoints and call stack tracking.

## 🎨 UI & Theming

### @code-lab/themes
Customizable theme system with built-in presets (Light, Dark, Ocean, Forest).

### @code-lab/components
Reusable UI components (Button, Card, Tabs, Tooltip, Modal) for webviews.

## 🔌 Integrations

### @code-lab/jupyter
Jupyter notebook import/export and format conversion.

### @code-lab/git-integration
Git repository visualization and commit history analysis.

### @code-lab/ai-assistant
AI-powered code assistant for explanations and suggestions.

## 📦 Utilities

### @code-lab/snippets
Code snippet management and smart suggestions.

### @code-lab/export
Export visualizations to various formats (PNG, SVG, PDF, HTML, JSON).

### @code-lab/collaboration
Real-time collaboration with shared sessions and cursor tracking.

## 🏗️ Project Structure

```
packages/
├── code-lab-parser-core/         # Core parser interfaces
├── code-lab-execution-engine/    # Execution runtime
├── code-lab-visualizers/         # Core visualizations
├── code-lab-python-parser/       # Python support
├── code-lab-java-parser/         # Java support
├── code-lab-rust-parser/         # Rust support
├── code-lab-mermaid/             # Mermaid diagrams
├── code-lab-d3-visualizer/       # D3 graphs
├── code-lab-charts/              # Chart generation
├── code-lab-testing/             # Test framework
├── code-lab-profiler/            # Performance profiling
├── code-lab-debugger/            # Debugger
├── code-lab-themes/              # Theme system
├── code-lab-components/          # UI components
├── code-lab-jupyter/             # Jupyter integration
├── code-lab-git-integration/     # Git tools
├── code-lab-ai-assistant/        # AI assistant
├── code-lab-snippets/            # Snippet manager
├── code-lab-export/              # Export utilities
└── code-lab-collaboration/       # Collaboration tools
```

## 🚀 Getting Started

### Install All Dependencies

```bash
npm install
```

### Build All Packages

```bash
npm run build:packages
```

### Watch Mode for Development

```bash
npm run watch:packages
```

## 📝 Development

Each package follows a consistent structure:

```
package-name/
├── src/                 # TypeScript source
│   └── index.ts        # Main entry point
├── dist/               # Compiled JavaScript (generated)
├── package.json        # Package configuration
├── tsconfig.json       # TypeScript configuration
└── README.md           # Package documentation
```

## 📄 License

MIT License - All code is original work by Joshua Terranova.

Copyright (c) 2024 Joshua Terranova

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

