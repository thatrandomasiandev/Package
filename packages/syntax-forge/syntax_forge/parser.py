"""
Production-Quality Parser Implementation
Uses Python's built-in ast module for real parsing
Original implementation by Joshua Terranova
"""

import ast
import time
from abc import ABC, abstractmethod
from typing import Dict, List, Optional, Any, Union
from dataclasses import dataclass, field
from .ast_types import (
    NodeType, ASTNode, Program, FunctionDeclaration, 
    ClassDeclaration, VariableDeclaration, SourceLocation, SourceRange
)


@dataclass
class ParseResult:
    """Complete parse result with AST and metadata"""
    ast: Program
    errors: List[Dict[str, Any]] = field(default_factory=list)
    warnings: List[Dict[str, Any]] = field(default_factory=list)
    metadata: Dict[str, Any] = field(default_factory=dict)


class BaseParser(ABC):
    """Abstract base class for all language parsers"""
    
    def __init__(self, config: Optional[Dict] = None):
        self.config = config or {}
    
    @abstractmethod
    def parse(self, code: str, filename: Optional[str] = None) -> ParseResult:
        """Parse source code into an AST"""
        pass
    
    @abstractmethod
    def get_supported_extensions(self) -> List[str]:
        """Get list of supported file extensions"""
        pass
    
    @abstractmethod
    def get_language_id(self) -> str:
        """Get language identifier"""
        pass
    
    def can_parse(self, filename: str) -> bool:
        """Check if this parser can handle the given filename"""
        ext = filename.split('.')[-1].lower()
        return ext in self.get_supported_extensions()


class PythonASTParser(BaseParser):
    """
    Production-quality Python parser using built-in ast module
    """
    
    def get_supported_extensions(self) -> List[str]:
        return ['py', 'pyw', 'python']
    
    def get_language_id(self) -> str:
        return 'python'
    
    def parse(self, code: str, filename: Optional[str] = None) -> ParseResult:
        """Parse Python code using ast module"""
        start_time = time.time()
        errors = []
        warnings = []
        
        try:
            # Parse using Python's ast module
            tree = ast.parse(code, filename=filename or '<string>', mode='exec')
            
            # Convert to our AST format
            program = self._convert_ast(tree, code)
            
            parse_time = (time.time() - start_time) * 1000  # ms
            
            return ParseResult(
                ast=program,
                errors=errors,
                warnings=warnings,
                metadata={
                    'language': 'python',
                    'parse_time_ms': parse_time,
                    'node_count': self._count_nodes(tree),
                    'line_count': len(code.splitlines()),
                    'filename': filename,
                }
            )
            
        except SyntaxError as e:
            errors.append({
                'type': 'SyntaxError',
                'message': str(e.msg),
                'line': e.lineno,
                'column': e.offset,
                'text': e.text,
            })
            
            # Return empty program with errors
            return ParseResult(
                ast=Program(type=NodeType.PROGRAM, body=[]),
                errors=errors,
                warnings=warnings,
                metadata={
                    'language': 'python',
                    'parse_time_ms': (time.time() - start_time) * 1000,
                    'node_count': 0,
                    'line_count': len(code.splitlines()),
                    'filename': filename,
                }
            )
    
    def _convert_ast(self, tree: ast.AST, code: str) -> Program:
        """Convert Python ast to our AST format"""
        body = []
        
        for node in ast.walk(tree):
            if isinstance(node, ast.Module):
                continue  # Skip module node
            
            converted = self._convert_node(node, code)
            if converted and hasattr(node, 'lineno'):
                # Only add top-level nodes to body
                if isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef, 
                                    ast.ClassDef, ast.Assign)):
                    body.append(converted)
        
        return Program(type=NodeType.PROGRAM, body=body, source_type='module')
    
    def _convert_node(self, node: ast.AST, code: str) -> Optional[ASTNode]:
        """Convert individual ast node to our format"""
        
        if isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef)):
            return FunctionDeclaration(
                type=NodeType.FUNCTION_DECLARATION,
                name=node.name,
                params=[{'name': arg.arg, 'annotation': ast.unparse(arg.annotation) 
                        if arg.annotation else None} for arg in node.args.args],
                body=None,  # Simplified for now
                async_=isinstance(node, ast.AsyncFunctionDef),
                generator=any(isinstance(n, ast.Yield) for n in ast.walk(node)),
                loc=self._get_location(node),
            )
        
        elif isinstance(node, ast.ClassDef):
            bases = [ast.unparse(base) for base in node.bases] if node.bases else []
            return ClassDeclaration(
                type=NodeType.CLASS_DECLARATION,
                name=node.name,
                super_class=bases[0] if bases else None,
                body=[],
                loc=self._get_location(node),
            )
        
        elif isinstance(node, ast.Assign):
            if node.targets and isinstance(node.targets[0], ast.Name):
                return VariableDeclaration(
                    type=NodeType.VARIABLE_DECLARATION,
                    name=node.targets[0].id,
                    kind='var',
                    init=None,
                    loc=self._get_location(node),
                )
        
        return None
    
    def _get_location(self, node: ast.AST) -> Optional[SourceRange]:
        """Extract location information from ast node"""
        if hasattr(node, 'lineno') and hasattr(node, 'col_offset'):
            end_lineno = getattr(node, 'end_lineno', node.lineno)
            end_col_offset = getattr(node, 'end_col_offset', node.col_offset)
            
            return SourceRange(
                start=SourceLocation(line=node.lineno, column=node.col_offset),
                end=SourceLocation(line=end_lineno, column=end_col_offset)
            )
        return None
    
    def _count_nodes(self, tree: ast.AST) -> int:
        """Count total nodes in AST"""
        return sum(1 for _ in ast.walk(tree))


class ParserRegistry:
    """Registry for managing multiple language parsers"""
    
    def __init__(self):
        self._parsers: Dict[str, BaseParser] = {}
        
        # Auto-register Python parser
        self.register('python', PythonASTParser())
    
    def register(self, language_id: str, parser: BaseParser) -> None:
        """Register a parser for a specific language"""
        self._parsers[language_id.lower()] = parser
    
    def unregister(self, language_id: str) -> bool:
        """Unregister a parser"""
        return self._parsers.pop(language_id.lower(), None) is not None
    
    def get_parser(self, language_id: str) -> Optional[BaseParser]:
        """Get parser for a specific language"""
        return self._parsers.get(language_id.lower())
    
    def get_parser_by_filename(self, filename: str) -> Optional[BaseParser]:
        """Get parser by filename extension"""
        for parser in self._parsers.values():
            if parser.can_parse(filename):
                return parser
        return None
    
    def get_registered_languages(self) -> List[str]:
        """Get all registered language identifiers"""
        return list(self._parsers.keys())
    
    def parse(self, code: str, language_id: str, filename: Optional[str] = None) -> ParseResult:
        """Parse code using the appropriate parser"""
        parser = self.get_parser(language_id)
        if not parser:
            raise ValueError(f"No parser registered for language: {language_id}")
        return parser.parse(code, filename)
    
    def parse_file(self, filepath: str) -> ParseResult:
        """Parse a file automatically detecting language"""
        parser = self.get_parser_by_filename(filepath)
        if not parser:
            raise ValueError(f"No parser found for file: {filepath}")
        
        with open(filepath, 'r', encoding='utf-8') as f:
            code = f.read()
        
        return parser.parse(code, filename=filepath)


# Global parser registry instance
parser_registry = ParserRegistry()
