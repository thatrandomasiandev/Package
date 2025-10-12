# Code Lab - Interactive Code Execution and Visualization

**Created by Joshua Terranova**  
**License:** MIT  
**All code is original work**

Code Lab is a comprehensive suite of tools for code analysis, execution, visualization, and collaboration. All 20 packages are installable via `pip` and feature creative, original naming.

## ✨ Key Features

- 🔍 **Multi-language parsing** - Python, Java, Rust, JavaScript, TypeScript
- ⚡ **Safe code execution** - Sandboxed runtime with resource monitoring
- 📊 **Rich visualizations** - Flow charts, structure trees, interactive graphs
- 🎨 **Beautiful themes** - Multiple built-in themes (Light, Dark, Ocean, Forest)
- 🧪 **Testing framework** - Run and visualize test results
- 📈 **Performance profiling** - Benchmark and optimize code
- 🐛 **Step-by-step debugging** - Breakpoints and call stack tracking
- 🤝 **Real-time collaboration** - Live code sharing
- 📓 **Jupyter integration** - Import/export notebooks
- 🎁 **And much more!**

## 🚀 Quick Start

### Installation

```bash
# Clone or download this repository
cd "Code Lab"

# Run the installation script
./install_all.sh  # macOS/Linux
# OR
install_all.bat   # Windows

# Or use pip directly
pip install -r requirements.txt
```

### Basic Usage

```python
from syntax_forge import parser_registry
from python_lens import PythonParser
from visual_flow import FlowChartGenerator
from runtime_spark import Executor

# Parse Python code
parser = PythonParser()
parser_registry.register('python', parser)
result = parser_registry.parse('def hello(): print("Hi!")', 'python')

# Execute code safely
executor = Executor()
output = executor.execute('print(2 + 2)')

# Generate visualizations
visualizer = FlowChartGenerator()
html = visualizer.generate(result.ast)
```

## 📦 Package Catalog

### Core Packages

| Package | Description | Install |
|---------|-------------|---------|
| **syntax-forge** | Core parser interfaces & AST utilities | `pip install -e packages/syntax-forge` |
| **runtime-spark** | Safe code execution runtime | `pip install -e packages/runtime-spark` |
| **visual-flow** | Flow charts & structure visualizations | `pip install -e packages/visual-flow` |

### Language Lenses 🔍

| Package | Language | Install |
|---------|----------|---------|
| **python-lens** | Python analysis | `pip install -e packages/python-lens` |
| **java-lens** | Java analysis | `pip install -e packages/java-lens` |
| **rust-lens** | Rust analysis | `pip install -e packages/rust-lens` |

### Visualization Tools 📊

| Package | Purpose | Install |
|---------|---------|---------|
| **diagram-weaver** | Weave code into diagrams | `pip install -e packages/diagram-weaver` |
| **graph-dynamics** | Interactive force-directed graphs | `pip install -e packages/graph-dynamics` |
| **data-pulse** | Charts and data visualization | `pip install -e packages/data-pulse` |

### Developer Tools 🛠️

| Package | Purpose | Install |
|---------|---------|---------|
| **spec-runner** | Test execution framework | `pip install -e packages/spec-runner` |
| **performance-lens** | Performance profiling | `pip install -e packages/performance-lens` |
| **step-tracer** | Step-by-step debugger | `pip install -e packages/step-tracer` |

### UI & Themes 🎨

| Package | Purpose | Install |
|---------|---------|---------|
| **color-forge** | Theme system | `pip install -e packages/color-forge` |
| **ui-forge** | Reusable UI components | `pip install -e packages/ui-forge` |

### Integrations 🔌

| Package | Purpose | Install |
|---------|---------|---------|
| **notebook-bridge** | Jupyter notebook integration | `pip install -e packages/notebook-bridge` |
| **version-chronicle** | Git history visualization | `pip install -e packages/version-chronicle` |
| **code-mentor** | AI code assistant | `pip install -e packages/code-mentor` |

### Utilities 🔧

| Package | Purpose | Install |
|---------|---------|---------|
| **snippet-vault** | Code snippet management | `pip install -e packages/snippet-vault` |
| **output-forge** | Export to multiple formats | `pip install -e packages/output-forge` |
| **live-sync** | Real-time collaboration | `pip install -e packages/live-sync` |

## 🎯 Naming Philosophy

All packages follow creative naming themes:

- **"Forge" series** 🔨 - Tools that create/build (syntax-forge, color-forge, ui-forge, output-forge)
- **"Lens" series** 🔍 - Analysis/inspection tools (python-lens, java-lens, rust-lens, performance-lens)
- **Dynamic terms** ⚡ - Interactive tools (graph-dynamics, visual-flow, data-pulse)
- **Action verbs** 🎬 - Utilities (step-tracer, diagram-weaver, spec-runner)
- **Descriptive** 📝 - Integrations (notebook-bridge, version-chronicle, code-mentor, snippet-vault, live-sync)

## 📖 Documentation

- [Quick Start Guide](QUICK_START.md) - Get up and running in minutes
- [Python Installation Guide](PYTHON_INSTALL.md) - Detailed pip install instructions
- [Build Instructions](BUILD_INSTRUCTIONS.md) - For contributors
- [Package Overview](PACKAGES.md) - Complete package documentation

## 🏗️ Project Structure

```
Code Lab/
├── packages/           # All 20 packages
│   ├── syntax-forge/
│   ├── runtime-spark/
│   ├── visual-flow/
│   └── ... (17 more)
├── install_all.sh      # Installation script (Unix)
├── install_all.bat     # Installation script (Windows)
├── requirements.txt    # All package dependencies
└── README.md          # This file
```

## 🎓 Examples

### Parse and Visualize

```python
from syntax_forge import parser_registry
from python_lens import PythonParser
from visual_flow import FlowChartGenerator

code = """
def factorial(n):
    if n <= 1:
        return 1
    return n * factorial(n - 1)
"""

parser = PythonParser()
parser_registry.register('python', parser)
result = parser.parse(code)

visualizer = FlowChartGenerator()
chart_html = visualizer.generate(result.ast)

with open('factorial_flow.html', 'w') as f:
    f.write(chart_html)
```

### Performance Profiling

```python
from performance_lens import Profiler, Benchmark

profiler = Profiler()

with profiler.profile("algorithm"):
    # Your code here
    result = expensive_computation()

stats = profiler.get_stats()
print(f"Total time: {stats.total_time}ms")
print(f"Peak memory: {stats.peak_memory_mb}MB")
```

### Testing

```python
from spec_runner import TestRunner, expect

runner = TestRunner()

runner.test("math works", lambda: expect(2 + 2).to_be(4))
runner.test("strings concat", lambda: expect("hello" + "world").to_be("helloworld"))

results = runner.run()
for result in results:
    status = "✓" if result.passed else "✗"
    print(f"{status} {result.name} ({result.duration}ms)")
```

## 🤝 Contributing

This project is open for contributions! All code must be original work.

1. Fork the repository
2. Create your feature branch
3. Add tests for new functionality
4. Ensure all tests pass
5. Submit a pull request

## 📋 Requirements

- Python 3.8 or higher
- pip 21.0 or higher
- Virtual environment recommended

## 📄 License

MIT License - Copyright (c) 2024 Joshua Terranova

All packages are original work by Joshua Terranova with no third-party implementations beyond standard Python libraries and utilities.

## 🙏 Acknowledgments

Created entirely by Joshua Terranova as an original implementation for interactive code analysis, execution, and visualization.

## 📞 Support

For issues, questions, or contributions, please refer to the documentation in each package's directory.

---

**Built with ❤️ by Joshua Terranova**
