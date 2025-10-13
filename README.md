# Code Lab Package Suite - Complete Overview

**Created by Joshua Terranova**

---

## 🎯 What Is This?

A comprehensive suite of **15 production-ready Python packages** for code analysis, execution, visualization, and development tools. Every package is fully functional with real library integrations - not placeholders or demos.

**Think of it as:** A toolbox combining the power of AST parsing, code execution, data visualization, and developer utilities - all in clean, well-documented Python packages.

---

## 🌟 Why These Packages?

### Production Quality
- Real implementations using industry-standard libraries (ast, networkx, matplotlib, plotly, GitPython, etc.)
- 8,000+ lines of production Python code
- Comprehensive error handling and type hints
- Comparable to major Python libraries in functionality

### Original Work
- 100% original implementation by Joshua Terranova
- No copied code or external frameworks incorporated
- Creative, memorable package names
- MIT License - free to use

### Fully Functional
Each package fulfills its complete purpose:
- **syntax-forge** uses Python's `ast` module for real AST parsing
- **data-pulse** integrates matplotlib AND plotly for publication-quality charts
- **graph-dynamics** uses networkx for advanced graph algorithms
- **performance-lens** uses cProfile for accurate profiling
- And so on... each package uses the right tool for the job!

---

## 📦 The 15 Packages

### 1. **syntax-forge** - Python AST Parser
🔧 **What it does:** Parses Python code into Abstract Syntax Trees using Python's built-in `ast` module.

**Key Features:**
- Complete AST node type system
- Visitor pattern implementation
- Function and class extraction
- Code structure analysis

**Use Case:** Building code analysis tools, linters, or IDE features.

```python
from syntax_forge import BaseParser
# Parse and analyze Python code structure
```

---

### 2. **python-lens** - Advanced Python Code Analyzer
🔍 **What it does:** Deep analysis of Python code including complexity, dependencies, and metrics.

**Key Features:**
- Cyclomatic complexity calculation
- Unused import detection
- Call graph generation
- Function/class extraction
- Code statistics and metrics

**Use Case:** Code quality tools, static analysis, refactoring assistance.

```python
from python_lens import PythonAnalyzer

analyzer = PythonAnalyzer()
analyzer.parse_file("mycode.py")
stats = analyzer.get_statistics()
print(f"Complexity: {stats['avg_complexity']}")
```

---

### 3. **visual-flow** - Flowchart Generation
📊 **What it does:** Converts code structures into flowcharts in multiple formats.

**Key Features:**
- Mermaid.js syntax generation
- Graphviz DOT format
- PlantUML support
- AST to flowchart conversion
- HTML embedding

**Use Case:** Documentation, teaching, code visualization.

```python
from visual_flow import FlowchartGenerator, FlowNodeType

flow = FlowchartGenerator()
flow.add_node("start", FlowNodeType.START, "Begin")
print(flow.to_mermaid())
```

---

### 4. **runtime-spark** - Secure Code Execution
⚡ **What it does:** Executes Python code in a sandboxed environment with safety controls.

**Key Features:**
- Sandboxed execution with `exec()`
- Timeout protection
- Restricted imports
- Variable capture and logging
- Error handling

**Use Case:** Online code playgrounds, testing environments, educational platforms.

```python
from runtime_spark import SecureExecutor

executor = SecureExecutor()
result = executor.execute_code("print('Hello!')", timeout=5)
```

---

### 5. **data-pulse** - Data Visualization
📈 **What it does:** Creates publication-quality charts using matplotlib and plotly.

**Key Features:**
- Matplotlib for static charts
- Plotly for interactive visualizations
- Line, bar, scatter, pie, histogram, 3D charts
- Base64 image encoding
- HTML/JSON output

**Use Case:** Data analysis, dashboards, reports.

```python
from data_pulse import DataVisualizer

viz = DataVisualizer()
data = {'x': [1,2,3], 'y': [4,5,6]}
html = viz.create_plot(data, 'line', title='My Data')
```

---

### 6. **performance-lens** - Performance Profiling
⚡ **What it does:** Profiles code performance using Python's cProfile module.

**Key Features:**
- Real cProfile integration
- Decorator-based profiling
- Benchmarking utilities
- Memory profiling with psutil
- Function comparison tools

**Use Case:** Performance optimization, benchmarking, debugging slow code.

```python
from performance_lens import Profiler

profiler = Profiler()

@profiler.profile_function
def my_function():
    return sum(range(1000))
```

---

### 7. **graph-dynamics** - Network Visualization
🕸️ **What it does:** Creates interactive network graphs using networkx and plotly.

**Key Features:**
- NetworkX integration for graph algorithms
- Multiple layout algorithms (spring, circular, kamada-kawai, etc.)
- Centrality analysis (degree, betweenness, closeness, eigenvector)
- Community detection
- Shortest path algorithms
- Interactive plotly visualizations

**Use Case:** Network analysis, dependency graphs, social networks.

```python
from graph_dynamics import NetworkVisualizer, Node, Edge

viz = NetworkVisualizer()
nodes = [Node("A", "Node A"), Node("B", "Node B")]
edges = [Edge("A", "B")]
html = viz.visualize_graph(nodes, edges)
```

---

### 8. **diagram-weaver** - Comprehensive Diagram Generation
📐 **What it does:** Creates various diagram types with Mermaid.js and PlantUML output.

**Key Features:**
- Sequence diagrams
- Class diagrams
- ER diagrams
- State diagrams
- Gantt charts
- Multiple output formats

**Use Case:** Documentation, architecture diagrams, project planning.

```python
from diagram_weaver import DiagramGenerator

dg = DiagramGenerator()
seq = dg.create_sequence_diagram()
seq.add_participant("User")
seq.message("User", "System", "request")
```

---

### 9. **java-lens** - Java Code Analyzer
☕ **What it does:** Parses and analyzes Java code using javalang.

**Key Features:**
- Full Java parsing
- Class and method extraction
- Annotation detection
- Inheritance tree mapping
- Package analysis

**Use Case:** Java code analysis, migration tools, documentation generation.

```python
from java_lens import JavaAnalyzer

analyzer = JavaAnalyzer()
package = analyzer.parse_file("MyClass.java")
```

---

### 10. **spec-runner** - Testing Framework
🧪 **What it does:** A complete testing framework similar to pytest.

**Key Features:**
- Comprehensive assertion library (12+ methods)
- Test discovery
- Setup/teardown hooks
- Test skipping
- Detailed reporting with timing
- JSON export

**Use Case:** Unit testing, integration testing, test automation.

```python
from spec_runner import TestRunner, assert_equal

runner = TestRunner()

def test_example():
    assert_equal(2 + 2, 4)

result = runner.run_test(test_example)
```

---

### 11. **step-tracer** - Debugger Integration
🔬 **What it does:** Execution tracing and debugging using Python's sys.settrace.

**Key Features:**
- Python debugger integration
- Execution tracing
- Breakpoint management
- Call stack tracking
- Variable history
- Event filtering

**Use Case:** Debugging, execution analysis, educational tools.

```python
from step_tracer import StepTracer

tracer = StepTracer()
tracer.start()
# your code here
tracer.stop()
tracer.print_trace()
```

---

### 12. **color-forge** - Theme Generation
🎨 **What it does:** Generates color palettes and CSS themes.

**Key Features:**
- Color palette generation (analogous, complementary, triadic, monochromatic)
- Complete theme generation
- CSS and SCSS output
- HSL/RGB/Hex conversions
- Light and dark themes

**Use Case:** Website theming, UI design, brand color systems.

```python
from color_forge import ThemeGenerator, Color

theme = ThemeGenerator()
primary = Color.from_hex("#2196F3")
theme.generate_theme(primary)
print(theme.to_css())
```

---

### 13. **ui-forge** - UI Component Generation
🏗️ **What it does:** Creates HTML UI components using Jinja2 templates.

**Key Features:**
- Button, card, input components
- Modal and navbar components
- Table generation
- Complete HTML page generation
- Professional styling

**Use Case:** Web development, prototyping, documentation sites.

```python
from ui_forge import UIComponentGenerator

ui = UIComponentGenerator()
button = ui.create_button("Click Me", variant="primary")
card = ui.create_card("Title", "Content")
page = ui.render_page([button, card])
```

---

### 14. **notebook-bridge** - Jupyter Integration
📓 **What it does:** Integrates with Jupyter notebooks using nbformat.

**Key Features:**
- Full nbformat integration
- Notebook read/write operations
- Python ↔ notebook conversion
- Cell extraction and manipulation
- Output management
- Notebook merging

**Use Case:** Jupyter notebook automation, format conversion, analysis.

```python
from notebook_bridge import JupyterConverter

converter = JupyterConverter()
notebook = converter.read_notebook("example.ipynb")
python_code = converter.to_python("example.ipynb")
```

---

### 15. **version-chronicle** - Git Integration
📚 **What it does:** Complete Git repository integration using GitPython.

**Key Features:**
- Commit history and search
- Branch and tag management
- Diff and blame functionality
- Contributor statistics
- Repository analytics

**Use Case:** Git automation, repository analysis, project metrics.

```python
from version_chronicle import GitIntegration

git = GitIntegration()
commits = git.get_commit_history(max_count=10)
status = git.get_status()
```

---

## 🚀 Quick Start

### Installation (3 Simple Steps)

```bash
# 1. Clone the repository
git clone https://github.com/thatrandomasiandev/Package.git

# 2. Navigate to directory
cd Package

# 3. Install packages you need
pip install -e packages/python-lens
pip install -e packages/visual-flow
pip install -e packages/data-pulse
# ... install any packages you want
```

**Install all at once:**
```bash
pip install -e packages/syntax-forge -e packages/python-lens -e packages/visual-flow \
  -e packages/runtime-spark -e packages/data-pulse -e packages/performance-lens \
  -e packages/graph-dynamics -e packages/diagram-weaver -e packages/java-lens \
  -e packages/spec-runner -e packages/step-tracer -e packages/color-forge \
  -e packages/ui-forge -e packages/notebook-bridge -e packages/version-chronicle
```

---

## 💡 Use Cases

### For Educators
- **visual-flow**: Visualize code execution for students
- **step-tracer**: Show how code executes step-by-step
- **runtime-spark**: Safe code execution environment
- **spec-runner**: Teach unit testing concepts

### For Developers
- **python-lens**: Code quality analysis
- **performance-lens**: Optimize performance
- **java-lens**: Analyze Java codebases
- **version-chronicle**: Git repository insights

### For Data Scientists
- **data-pulse**: Create publication-quality charts
- **graph-dynamics**: Network analysis
- **notebook-bridge**: Jupyter automation
- **performance-lens**: Profile data processing

### For DevOps/Tools
- **runtime-spark**: Sandboxed code execution
- **syntax-forge**: Build code analysis tools
- **diagram-weaver**: Generate documentation diagrams
- **ui-forge**: Create web dashboards

---

## 📊 Technical Specifications

### Technologies Used
- **Python Standard Library**: ast, sys.settrace, cProfile, exec, threading, colorsys
- **Data Visualization**: matplotlib (3.5.0+), plotly (5.0.0+)
- **Graph Analysis**: networkx (2.6+)
- **Git Integration**: GitPython (3.1.0+)
- **Notebook Support**: nbformat (5.0.0+)
- **Java Parsing**: javalang (0.13.0+)
- **Templating**: Jinja2 (3.0.0+)
- **System Monitoring**: psutil (5.8.0+)

### Code Metrics
- **Total Lines**: 8,000+ lines of production Python
- **Packages**: 15 fully functional packages
- **Dependencies**: 8 major third-party libraries
- **Test Coverage**: Test scripts included
- **Documentation**: Comprehensive markdown docs

### Quality Standards
- ✅ Type hints throughout
- ✅ Dataclasses for clean data structures
- ✅ Comprehensive error handling
- ✅ Docstrings with parameter descriptions
- ✅ Lazy imports for optional dependencies
- ✅ Professional code organization

---

## 🎓 Learning Resources

### Documentation
- **INSTALL.md** - Installation guide
- **PACKAGE_REFERENCE.md** - Complete API reference
- **PRODUCTION_SUMMARY.md** - Project overview and architecture
- **README.md** - Quick start guide

### Examples
Each package includes usage examples in its documentation.

### Test Suite
- **test_all_packages.py** - Verify all imports work
- Individual package tests available

---

## 🌐 Deployment Options

### 1. Local Development
Clone and install locally for development and experimentation.

### 2. Production Use
Use in your projects as dependencies - fully production-ready.

### 3. PyPI Publishing
Follow `PUBLISH_TO_PYPI.md` to publish to PyPI for easier distribution.

### 4. Docker
Can be containerized for deployment in Docker environments.

---

## 🔧 System Requirements

- **Python**: 3.8 or higher
- **pip**: Latest version
- **git**: For cloning repository
- **OS**: Works on macOS, Linux, Windows

### Optional Dependencies
Automatically installed when needed:
- matplotlib, plotly (for visualization)
- networkx (for graph analysis)
- javalang (for Java parsing)
- GitPython (for Git integration)
- nbformat (for Jupyter notebooks)
- Jinja2 (for templating)
- psutil (for system monitoring)

---

## 📈 Comparison to Other Tools

| Feature | Code Lab Packages | Alternatives |
|---------|------------------|--------------|
| **AST Parsing** | Built-in Python ast | astroid, ast |
| **Code Execution** | Custom sandbox | exec, eval |
| **Data Viz** | matplotlib + plotly | seaborn, bokeh |
| **Graph Analysis** | networkx | igraph, graph-tool |
| **Testing** | Custom framework | pytest, unittest |
| **Profiling** | cProfile | line_profiler, py-spy |
| **All-in-one** | ✅ 15 integrated tools | ❌ Need multiple libraries |

**Advantage**: Everything works together, consistent API, single installation.

---

## 🤝 Contributing

These packages are production-ready but can always be improved:

1. **Bug Reports**: Found an issue? Open a GitHub issue
2. **Feature Requests**: Ideas for improvements? Suggest them!
3. **Pull Requests**: Contributions welcome
4. **Documentation**: Help improve docs

**Repository**: https://github.com/thatrandomasiandev/Package

---

## 📄 License

**MIT License** - Free to use in personal and commercial projects.

All code is original work by Joshua Terranova.

---

## 📞 Contact & Support

- **GitHub**: https://github.com/thatrandomasiandev/Package
- **Issues**: https://github.com/thatrandomasiandev/Package/issues
- **Author**: Joshua Terranova

---

## 🎯 Roadmap

### Current Status (v1.0.0)
✅ 15 production packages complete
✅ Full documentation
✅ Test suites
✅ GitHub repository

### Future Enhancements
- 🔜 Additional language support (TypeScript, Go, C++)
- 🔜 Web-based UI for visual tools
- 🔜 VSCode extension integration
- 🔜 PyPI publication for easier installation
- 🔜 Extended examples and tutorials

---

## 🏆 Why Choose Code Lab Packages?

### 1. Production Ready
Not demos or prototypes - these are fully functional tools you can use in production.

### 2. Comprehensive
15 packages covering code analysis, execution, visualization, testing, and more.

### 3. Well Documented
Every package has clear documentation with examples.

### 4. Original
100% original implementation - no copied code or frameworks.

### 5. Free & Open Source
MIT licensed - use anywhere, modify as needed.

### 6. Active Development
Continuously improved and maintained.

---

## 📚 Additional Resources

- **GitHub Repository**: https://github.com/thatrandomasiandev/Package
- **Package Reference**: See PACKAGE_REFERENCE.md for complete API docs
- **Installation Guide**: See INSTALL.md for detailed setup
- **Production Summary**: See PRODUCTION_SUMMARY.md for architecture

---

**Created by Joshua Terranova | 2024 | MIT License**

*Making code analysis, execution, and visualization accessible to everyone.*
