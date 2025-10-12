# Code Lab Package Reference

**All packages created by Joshua Terranova**

## Complete Package Catalog

### 1. syntax-forge
**Description:** Core parser interfaces and AST utilities for Code Lab. Foundation package providing abstract parser classes, unified AST node types, parser registry, and code metrics extraction.

**Install:**
```bash
pip install -e packages/syntax-forge
```

---

### 2. runtime-spark
**Description:** Language-agnostic code execution runtime with sandboxing. Provides safe code execution, memory and CPU monitoring, timeout protection, and variable tracking.

**Install:**
```bash
pip install -e packages/runtime-spark
```

---

### 3. visual-flow
**Description:** Flow chart and structure tree visualizations. Generates interactive flow charts and structure trees from AST, with customizable layouts and themes.

**Install:**
```bash
pip install -e packages/visual-flow
```

---

### 4. python-lens
**Description:** Python code parser and analyzer. Analyzes Python code structure, extracts functions, classes, and variables, with execution support.

**Install:**
```bash
pip install -e packages/python-lens
```

---

### 5. java-lens
**Description:** Java code parser and analyzer. Parses Java source files, extracts class definitions, methods, and package structures.

**Install:**
```bash
pip install -e packages/java-lens
```

---

### 6. rust-lens
**Description:** Rust code parser and analyzer. Analyzes Rust code structure, extracts functions, structs, and traits.

**Install:**
```bash
pip install -e packages/rust-lens
```

---

### 7. diagram-weaver
**Description:** Weaves code into Mermaid diagrams. Converts code structures to Mermaid.js diagram syntax for sequence diagrams, class diagrams, and flowcharts.

**Install:**
```bash
pip install -e packages/diagram-weaver
```

---

### 8. graph-dynamics
**Description:** Interactive force-directed graph visualizations. Creates dynamic, draggable node graphs using D3.js for call graphs and dependency visualization.

**Install:**
```bash
pip install -e packages/graph-dynamics
```

---

### 9. data-pulse
**Description:** Data visualization and charting library. Enhanced charting with Chart.js and Plotly.js integration for line, bar, pie, and scatter plots.

**Install:**
```bash
pip install -e packages/data-pulse
```

---

### 10. spec-runner
**Description:** Test execution and visualization framework. Simple test runner with assertions, test result visualization, and coverage analysis.

**Install:**
```bash
pip install -e packages/spec-runner
```

---

### 11. performance-lens
**Description:** Performance profiling and benchmarking. Tracks function execution time, memory usage, generates flame graphs, and provides benchmarking utilities.

**Install:**
```bash
pip install -e packages/performance-lens
```

---

### 12. step-tracer
**Description:** Step-by-step execution debugger. Provides breakpoint management, step over/into/out functionality, variable inspection, and call stack tracking.

**Install:**
```bash
pip install -e packages/step-tracer
```

---

### 13. color-forge
**Description:** Customizable theme system. Provides multiple built-in themes (Light, Dark, Ocean, Forest) with CSS variable generation and theme switching.

**Install:**
```bash
pip install -e packages/color-forge
```

---

### 14. ui-forge
**Description:** Reusable UI components library. Provides Button, Card, Tabs, Tooltip, and Modal components for building webview interfaces.

**Install:**
```bash
pip install -e packages/ui-forge
```

---

### 15. notebook-bridge
**Description:** Jupyter notebook integration. Import and export Jupyter notebooks, convert between .ipynb format and Code Lab format.

**Install:**
```bash
pip install -e packages/notebook-bridge
```

---

### 16. version-chronicle
**Description:** Git repository visualization and history. Visualizes commit history, generates git diff reports, and creates commit graphs.

**Install:**
```bash
pip install -e packages/version-chronicle
```

---

### 17. code-mentor
**Description:** AI-powered code assistant. Provides code explanations, optimization suggestions, and interactive Q&A for debugging help.

**Install:**
```bash
pip install -e packages/code-mentor
```

---

### 18. snippet-vault
**Description:** Code snippet management system. Store, search, and organize reusable code snippets with tagging and language filtering.

**Install:**
```bash
pip install -e packages/snippet-vault
```

---

### 19. output-forge
**Description:** Export visualizations to multiple formats. Export to HTML, SVG, PDF, PNG, and JSON formats for sharing and documentation.

**Install:**
```bash
pip install -e packages/output-forge
```

---

### 20. live-sync
**Description:** Real-time collaboration tools. Enables shared coding sessions with live cursor tracking and synchronized editing.

**Install:**
```bash
pip install -e packages/live-sync
```

---

## Quick Install All Packages

```bash
# Install all at once
pip install -r requirements.txt

# Or use the installation script
./install_all.sh  # macOS/Linux
install_all.bat   # Windows
```

## Import Examples

```python
# Core packages
from syntax_forge import BaseParser, parser_registry
from runtime_spark import Executor, Sandbox
from visual_flow import FlowChartGenerator, StructureTreeGenerator

# Language lenses
from python_lens import PythonParser
from java_lens import JavaParser
from rust_lens import RustParser

# Visualization tools
from diagram_weaver import MermaidConverter, MermaidRenderer
from graph_dynamics import D3GraphVisualizer, CallGraphGenerator
from data_pulse import ChartGenerator

# Developer tools
from spec_runner import TestRunner, expect
from performance_lens import Profiler, Benchmark
from step_tracer import Debugger, BreakpointManager

# UI & Themes
from color_forge import ThemeManager, dark_theme, light_theme
from ui_forge import Button, Card, Tabs, Modal

# Integrations
from notebook_bridge import JupyterConverter
from version_chronicle import GitIntegration
from code_mentor import AIAssistant

# Utilities
from snippet_vault import SnippetManager
from output_forge import Exporter
from live_sync import CollaborationManager
```

---

**Created by Joshua Terranova**  
**License:** MIT  
**All code is original work**

