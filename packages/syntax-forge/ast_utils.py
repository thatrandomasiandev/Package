"""
Production-Quality AST Utility Functions
Original implementation by Joshua Terranova
"""

import ast
from typing import List, Callable, Optional, Dict, Any, Set
from .ast_types import ASTNode, NodeType, Program
from collections import defaultdict


def walk(node: ASTNode, callback: Callable[[ASTNode, Optional[ASTNode]], None], 
         parent: Optional[ASTNode] = None) -> None:
    """Walk through AST nodes recursively with callback"""
    callback(node, parent)
    
    # Traverse children based on node type
    if hasattr(node, 'body'):
        if isinstance(node.body, list):
            for child in node.body:
                if child:
                    walk(child, callback, node)
        elif node.body:
            walk(node.body, callback, node)


def find_nodes_by_type(ast_tree: ASTNode, node_type: NodeType) -> List[ASTNode]:
    """Find all nodes of a specific type"""
    results = []
    
    def collect(node: ASTNode, parent: Optional[ASTNode]) -> None:
        if node.type == node_type:
            results.append(node)
    
    walk(ast_tree, collect)
    return results


def find_node_at_line(ast_tree: ASTNode, line: int) -> Optional[ASTNode]:
    """Find node at a specific line number"""
    result = None
    
    def check_line(node: ASTNode, parent: Optional[ASTNode]) -> None:
        nonlocal result
        if node.loc and node.loc.start.line <= line <= node.loc.end.line:
            result = node
    
    walk(ast_tree, check_line)
    return result


def find_nodes_at_range(ast_tree: ASTNode, start_line: int, end_line: int) -> List[ASTNode]:
    """Find all nodes within a line range"""
    results = []
    
    def check_range(node: ASTNode, parent: Optional[ASTNode]) -> None:
        if node.loc:
            if (node.loc.start.line >= start_line and 
                node.loc.end.line <= end_line):
                results.append(node)
    
    walk(ast_tree, check_range)
    return results


def count_nodes(ast_tree: ASTNode) -> int:
    """Count total number of nodes in AST"""
    count = 0
    
    def increment(node: ASTNode, parent: Optional[ASTNode]) -> None:
        nonlocal count
        count += 1
    
    walk(ast_tree, increment)
    return count


def get_max_depth(ast_tree: ASTNode) -> int:
    """Calculate maximum depth of AST"""
    max_depth = 0
    
    def calculate_depth(node: ASTNode, parent: Optional[ASTNode], depth: int = 0) -> None:
        nonlocal max_depth
        max_depth = max(max_depth, depth)
        
        if hasattr(node, 'body'):
            if isinstance(node.body, list):
                for child in node.body:
                    if child:
                        calculate_depth(child, node, depth + 1)
            elif node.body:
                calculate_depth(node.body, node, depth + 1)
    
    calculate_depth(ast_tree, None, 0)
    return max_depth


def calculate_complexity(ast_tree: ASTNode) -> int:
    """
    Calculate cyclomatic complexity
    Complexity = edges - nodes + 2 * connected_components
    Simplified: count decision points + 1
    """
    complexity = 1  # Base complexity
    
    def count_decisions(node: ASTNode, parent: Optional[ASTNode]) -> None:
        nonlocal complexity
        # Each decision point increases complexity
        if node.type in [NodeType.IF_STATEMENT, NodeType.WHILE_LOOP, 
                        NodeType.FOR_LOOP]:
            complexity += 1
    
    walk(ast_tree, count_decisions)
    return complexity


def extract_metrics(ast_tree: Program) -> Dict[str, Any]:
    """Extract comprehensive code metrics from AST"""
    
    metrics = {
        'functions': len(find_nodes_by_type(ast_tree, NodeType.FUNCTION_DECLARATION)),
        'classes': len(find_nodes_by_type(ast_tree, NodeType.CLASS_DECLARATION)),
        'variables': len(find_nodes_by_type(ast_tree, NodeType.VARIABLE_DECLARATION)),
        'conditionals': len(find_nodes_by_type(ast_tree, NodeType.IF_STATEMENT)),
        'loops': (len(find_nodes_by_type(ast_tree, NodeType.WHILE_LOOP)) + 
                 len(find_nodes_by_type(ast_tree, NodeType.FOR_LOOP))),
        'complexity': calculate_complexity(ast_tree),
        'depth': get_max_depth(ast_tree),
        'node_count': count_nodes(ast_tree),
    }
    
    # Calculate average complexity per function
    functions = find_nodes_by_type(ast_tree, NodeType.FUNCTION_DECLARATION)
    if functions:
        total_func_complexity = sum(calculate_complexity(func) for func in functions)
        metrics['avg_function_complexity'] = total_func_complexity / len(functions)
    else:
        metrics['avg_function_complexity'] = 0
    
    return metrics


def get_function_names(ast_tree: Program) -> List[str]:
    """Extract all function names"""
    functions = find_nodes_by_type(ast_tree, NodeType.FUNCTION_DECLARATION)
    return [func.name for func in functions if hasattr(func, 'name')]


def get_class_names(ast_tree: Program) -> List[str]:
    """Extract all class names"""
    classes = find_nodes_by_type(ast_tree, NodeType.CLASS_DECLARATION)
    return [cls.name for cls in classes if hasattr(cls, 'name')]


def get_variable_names(ast_tree: Program) -> List[str]:
    """Extract all variable names"""
    variables = find_nodes_by_type(ast_tree, NodeType.VARIABLE_DECLARATION)
    return [var.name for var in variables if hasattr(var, 'name')]


def build_symbol_table(ast_tree: Program) -> Dict[str, List[Dict[str, Any]]]:
    """Build a symbol table with all identifiers and their locations"""
    symbol_table = defaultdict(list)
    
    def collect_symbols(node: ASTNode, parent: Optional[ASTNode]) -> None:
        if hasattr(node, 'name') and node.name:
            symbol_info = {
                'type': node.type.value if hasattr(node.type, 'value') else str(node.type),
                'location': {
                    'line': node.loc.start.line if node.loc else None,
                    'column': node.loc.start.column if node.loc else None,
                },
                'parent': parent.type.value if parent and hasattr(parent, 'type') else None,
            }
            symbol_table[node.name].append(symbol_info)
    
    walk(ast_tree, collect_symbols)
    return dict(symbol_table)


def find_unused_variables(ast_tree: Program) -> List[str]:
    """
    Find variables that are declared but never used
    (Simplified implementation)
    """
    declared = set(get_variable_names(ast_tree))
    symbol_table = build_symbol_table(ast_tree)
    
    # Variables that appear only once (declaration) might be unused
    unused = []
    for name in declared:
        if len(symbol_table.get(name, [])) == 1:
            unused.append(name)
    
    return unused


def get_function_calls(code: str) -> List[Dict[str, Any]]:
    """
    Extract all function calls from code
    Uses Python's ast module directly for accuracy
    """
    calls = []
    
    try:
        tree = ast.parse(code)
        for node in ast.walk(tree):
            if isinstance(node, ast.Call):
                func_name = None
                if isinstance(node.func, ast.Name):
                    func_name = node.func.id
                elif isinstance(node.func, ast.Attribute):
                    func_name = node.func.attr
                
                if func_name:
                    calls.append({
                        'name': func_name,
                        'line': node.lineno,
                        'col': node.col_offset,
                        'args_count': len(node.args),
                    })
    except:
        pass
    
    return calls
