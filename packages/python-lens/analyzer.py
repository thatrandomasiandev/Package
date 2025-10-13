"""
Production Python Code Analyzer
Uses Python's ast module for deep code analysis
Original implementation by Joshua Terranova
"""

import ast
from typing import List, Dict, Optional, Any, Set
from dataclasses import dataclass, field
from collections import defaultdict


@dataclass
class FunctionInfo:
    """Information about a function"""
    name: str
    args: List[str]
    returns: Optional[str]
    docstring: Optional[str]
    line_start: int
    line_end: int
    complexity: int = 0
    calls: List[str] = field(default_factory=list)
    decorators: List[str] = field(default_factory=list)


@dataclass
class ClassInfo:
    """Information about a class"""
    name: str
    bases: List[str]
    methods: List[FunctionInfo]
    docstring: Optional[str]
    line_start: int
    line_end: int
    decorators: List[str] = field(default_factory=list)


@dataclass
class ImportInfo:
    """Information about an import"""
    module: str
    names: List[str]
    alias: Optional[str] = None
    line: int = 0


@dataclass
class VariableInfo:
    """Information about a variable"""
    name: str
    line: int
    annotation: Optional[str] = None


class PythonAnalyzer:
    """
    Production Python code analyzer with comprehensive features
    """
    
    def __init__(self):
        self.tree: Optional[ast.AST] = None
        self.source: str = ""
        self.functions: List[FunctionInfo] = []
        self.classes: List[ClassInfo] = []
        self.imports: List[ImportInfo] = []
        self.globals: List[VariableInfo] = []
    
    def parse(self, source: str, filename: str = "<string>") -> ast.AST:
        """
        Parse Python source code
        
        Args:
            source: Python source code
            filename: Filename for error messages
        
        Returns:
            AST tree
        """
        self.source = source
        self.tree = ast.parse(source, filename)
        self._analyze()
        return self.tree
    
    def parse_file(self, filepath: str) -> ast.AST:
        """
        Parse a Python file
        
        Args:
            filepath: Path to Python file
        
        Returns:
            AST tree
        """
        with open(filepath, 'r', encoding='utf-8') as f:
            source = f.read()
        return self.parse(source, filepath)
    
    def _analyze(self):
        """Analyze the AST tree"""
        if not self.tree:
            return
        
        self.functions = []
        self.classes = []
        self.imports = []
        self.globals = []
        
        for node in ast.walk(self.tree):
            if isinstance(node, ast.FunctionDef):
                self.functions.append(self._analyze_function(node))
            elif isinstance(node, ast.ClassDef):
                self.classes.append(self._analyze_class(node))
            elif isinstance(node, (ast.Import, ast.ImportFrom)):
                self.imports.extend(self._analyze_import(node))
            elif isinstance(node, ast.Assign) and isinstance(node.col_offset, int):
                # Top-level assignments (globals)
                if node.col_offset == 0:
                    for target in node.targets:
                        if isinstance(target, ast.Name):
                            self.globals.append(VariableInfo(
                                name=target.id,
                                line=node.lineno
                            ))
    
    def _analyze_function(self, node: ast.FunctionDef) -> FunctionInfo:
        """Analyze a function node"""
        args = [arg.arg for arg in node.args.args]
        
        # Get return type annotation
        returns = None
        if node.returns:
            returns = ast.unparse(node.returns) if hasattr(ast, 'unparse') else None
        
        # Get docstring
        docstring = ast.get_docstring(node)
        
        # Get decorators
        decorators = []
        for dec in node.decorator_list:
            if isinstance(dec, ast.Name):
                decorators.append(dec.id)
            elif isinstance(dec, ast.Call) and isinstance(dec.func, ast.Name):
                decorators.append(dec.func.id)
        
        # Calculate complexity
        complexity = self._calculate_complexity(node)
        
        # Find function calls
        calls = []
        for child in ast.walk(node):
            if isinstance(child, ast.Call):
                if isinstance(child.func, ast.Name):
                    calls.append(child.func.id)
                elif isinstance(child.func, ast.Attribute):
                    calls.append(child.func.attr)
        
        return FunctionInfo(
            name=node.name,
            args=args,
            returns=returns,
            docstring=docstring,
            line_start=node.lineno,
            line_end=node.end_lineno or node.lineno,
            complexity=complexity,
            calls=list(set(calls)),  # Unique calls
            decorators=decorators
        )
    
    def _analyze_class(self, node: ast.ClassDef) -> ClassInfo:
        """Analyze a class node"""
        bases = []
        for base in node.bases:
            if isinstance(base, ast.Name):
                bases.append(base.id)
            elif isinstance(base, ast.Attribute):
                bases.append(base.attr)
        
        # Get docstring
        docstring = ast.get_docstring(node)
        
        # Get decorators
        decorators = []
        for dec in node.decorator_list:
            if isinstance(dec, ast.Name):
                decorators.append(dec.id)
            elif isinstance(dec, ast.Call) and isinstance(dec.func, ast.Name):
                decorators.append(dec.func.id)
        
        # Analyze methods
        methods = []
        for item in node.body:
            if isinstance(item, ast.FunctionDef):
                methods.append(self._analyze_function(item))
        
        return ClassInfo(
            name=node.name,
            bases=bases,
            methods=methods,
            docstring=docstring,
            line_start=node.lineno,
            line_end=node.end_lineno or node.lineno,
            decorators=decorators
        )
    
    def _analyze_import(self, node) -> List[ImportInfo]:
        """Analyze an import node"""
        imports = []
        
        if isinstance(node, ast.Import):
            for alias in node.names:
                imports.append(ImportInfo(
                    module=alias.name,
                    names=[alias.name],
                    alias=alias.asname,
                    line=node.lineno
                ))
        elif isinstance(node, ast.ImportFrom):
            module = node.module or ""
            names = [alias.name for alias in node.names]
            imports.append(ImportInfo(
                module=module,
                names=names,
                line=node.lineno
            ))
        
        return imports
    
    def _calculate_complexity(self, node: ast.AST) -> int:
        """Calculate cyclomatic complexity"""
        complexity = 1
        
        for child in ast.walk(node):
            if isinstance(child, (ast.If, ast.While, ast.For, ast.ExceptHandler)):
                complexity += 1
            elif isinstance(child, ast.BoolOp):
                complexity += len(child.values) - 1
        
        return complexity
    
    def get_all_functions(self) -> List[FunctionInfo]:
        """Get all functions (including methods)"""
        all_functions = list(self.functions)
        
        for cls in self.classes:
            all_functions.extend(cls.methods)
        
        return all_functions
    
    def get_function(self, name: str) -> Optional[FunctionInfo]:
        """Get a specific function by name"""
        for func in self.get_all_functions():
            if func.name == name:
                return func
        return None
    
    def get_class(self, name: str) -> Optional[ClassInfo]:
        """Get a specific class by name"""
        for cls in self.classes:
            if cls.name == name:
                return cls
        return None
    
    def get_dependencies(self) -> Dict[str, List[str]]:
        """Get function dependencies (call graph)"""
        dependencies = defaultdict(list)
        
        for func in self.get_all_functions():
            dependencies[func.name] = func.calls
        
        return dict(dependencies)
    
    def find_unused_imports(self) -> List[str]:
        """Find unused imports"""
        # Get all names used in the code
        used_names: Set[str] = set()
        
        if self.tree:
            for node in ast.walk(self.tree):
                if isinstance(node, ast.Name):
                    used_names.add(node.id)
                elif isinstance(node, ast.Attribute):
                    # Get the base name
                    if isinstance(node.value, ast.Name):
                        used_names.add(node.value.id)
        
        # Check which imports are not used
        unused = []
        for imp in self.imports:
            if imp.alias:
                if imp.alias not in used_names:
                    unused.append(f"{imp.module} as {imp.alias}")
            else:
                for name in imp.names:
                    if name not in used_names and name != '*':
                        unused.append(f"{imp.module}.{name}" if imp.module else name)
        
        return unused
    
    def get_complexity_report(self) -> Dict[str, int]:
        """Get complexity report for all functions"""
        report = {}
        
        for func in self.get_all_functions():
            report[func.name] = func.complexity
        
        return dict(sorted(report.items(), key=lambda x: x[1], reverse=True))
    
    def find_long_functions(self, threshold: int = 50) -> List[FunctionInfo]:
        """Find functions longer than threshold lines"""
        long_functions = []
        
        for func in self.get_all_functions():
            length = func.line_end - func.line_start
            if length > threshold:
                long_functions.append(func)
        
        return sorted(long_functions, key=lambda f: f.line_end - f.line_start, reverse=True)
    
    def find_functions_without_docstrings(self) -> List[str]:
        """Find functions without docstrings"""
        return [func.name for func in self.get_all_functions() if not func.docstring]
    
    def get_statistics(self) -> Dict[str, Any]:
        """Get code statistics"""
        all_functions = self.get_all_functions()
        
        lines = self.source.split('\n')
        non_empty_lines = [line for line in lines if line.strip() and not line.strip().startswith('#')]
        
        return {
            'total_lines': len(lines),
            'non_empty_lines': len(non_empty_lines),
            'num_functions': len(all_functions),
            'num_classes': len(self.classes),
            'num_imports': len(self.imports),
            'num_globals': len(self.globals),
            'avg_complexity': sum(f.complexity for f in all_functions) / len(all_functions) if all_functions else 0,
            'max_complexity': max((f.complexity for f in all_functions), default=0),
            'functions_without_docstrings': len(self.find_functions_without_docstrings()),
        }
    
    def to_dict(self) -> Dict[str, Any]:
        """Export analysis as dictionary"""
        return {
            'functions': [
                {
                    'name': f.name,
                    'args': f.args,
                    'returns': f.returns,
                    'docstring': f.docstring,
                    'line_start': f.line_start,
                    'line_end': f.line_end,
                    'complexity': f.complexity,
                    'calls': f.calls,
                    'decorators': f.decorators,
                }
                for f in self.get_all_functions()
            ],
            'classes': [
                {
                    'name': c.name,
                    'bases': c.bases,
                    'methods': [m.name for m in c.methods],
                    'docstring': c.docstring,
                    'line_start': c.line_start,
                    'line_end': c.line_end,
                    'decorators': c.decorators,
                }
                for c in self.classes
            ],
            'imports': [
                {
                    'module': i.module,
                    'names': i.names,
                    'alias': i.alias,
                    'line': i.line,
                }
                for i in self.imports
            ],
            'statistics': self.get_statistics(),
        }

