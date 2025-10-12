"""
Base Parser Interface
Original implementation by Joshua Terranova
"""

from abc import ABC, abstractmethod
from typing import Dict, List, Optional
from dataclasses import dataclass
from .ast_types import Program


@dataclass
class ParseResult:
    ast: Program
    errors: List[Dict]
    warnings: List[Dict]
    metadata: Dict


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


class ParserRegistry:
    """Registry for managing multiple language parsers"""
    
    def __init__(self):
        self._parsers: Dict[str, BaseParser] = {}
    
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


# Global parser registry instance
parser_registry = ParserRegistry()

