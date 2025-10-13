"""
Production Java Code Analyzer
Uses javalang for Java parsing
Original implementation by Joshua Terranova
"""

from typing import List, Dict, Optional, Any
from dataclasses import dataclass, field


@dataclass
class JavaMethodInfo:
    """Information about a Java method"""
    name: str
    modifiers: List[str]
    return_type: Optional[str]
    parameters: List[Dict[str, str]]
    throws: List[str]
    annotations: List[str]
    line_start: Optional[int] = None


@dataclass
class JavaClassInfo:
    """Information about a Java class"""
    name: str
    modifiers: List[str]
    extends: Optional[str]
    implements: List[str]
    methods: List[JavaMethodInfo]
    fields: List[Dict[str, Any]]
    annotations: List[str]
    line_start: Optional[int] = None


@dataclass
class JavaPackageInfo:
    """Information about a Java package"""
    name: str
    classes: List[JavaClassInfo]
    imports: List[str]


class JavaAnalyzer:
    """
    Production Java code analyzer using javalang
    """
    
    def __init__(self):
        self.javalang = None
        self._ensure_import()
    
    def _ensure_import(self):
        """Lazy import javalang"""
        try:
            import javalang
            self.javalang = javalang
        except ImportError:
            raise ImportError("javalang is required. Install with: pip install javalang")
    
    def parse(self, source: str) -> JavaPackageInfo:
        """
        Parse Java source code
        
        Args:
            source: Java source code
        
        Returns:
            JavaPackageInfo with parsed information
        """
        try:
            tree = self.javalang.parse.parse(source)
        except Exception as e:
            raise ValueError(f"Failed to parse Java code: {e}")
        
        # Extract package name
        package_name = tree.package.name if tree.package else ""
        
        # Extract imports
        imports = []
        if tree.imports:
            for imp in tree.imports:
                imports.append(imp.path)
        
        # Extract classes
        classes = []
        for path, node in tree.filter(self.javalang.tree.ClassDeclaration):
            classes.append(self._analyze_class(node))
        
        return JavaPackageInfo(
            name=package_name,
            classes=classes,
            imports=imports
        )
    
    def parse_file(self, filepath: str) -> JavaPackageInfo:
        """
        Parse a Java file
        
        Args:
            filepath: Path to Java file
        
        Returns:
            JavaPackageInfo
        """
        with open(filepath, 'r', encoding='utf-8') as f:
            source = f.read()
        return self.parse(source)
    
    def _analyze_class(self, node) -> JavaClassInfo:
        """Analyze a class node"""
        # Get modifiers
        modifiers = node.modifiers if hasattr(node, 'modifiers') else []
        
        # Get extends
        extends = node.extends.name if node.extends else None
        
        # Get implements
        implements = []
        if node.implements:
            for impl in node.implements:
                implements.append(impl.name)
        
        # Get annotations
        annotations = []
        if hasattr(node, 'annotations') and node.annotations:
            for ann in node.annotations:
                annotations.append(ann.name)
        
        # Get methods
        methods = []
        for method in node.methods:
            methods.append(self._analyze_method(method))
        
        # Get fields
        fields = []
        for field in node.fields:
            for declarator in field.declarators:
                fields.append({
                    'name': declarator.name,
                    'type': field.type.name if hasattr(field.type, 'name') else str(field.type),
                    'modifiers': field.modifiers if hasattr(field, 'modifiers') else []
                })
        
        return JavaClassInfo(
            name=node.name,
            modifiers=modifiers,
            extends=extends,
            implements=implements,
            methods=methods,
            fields=fields,
            annotations=annotations,
            line_start=node.position.line if hasattr(node, 'position') and node.position else None
        )
    
    def _analyze_method(self, node) -> JavaMethodInfo:
        """Analyze a method node"""
        # Get modifiers
        modifiers = node.modifiers if hasattr(node, 'modifiers') else []
        
        # Get return type
        return_type = None
        if node.return_type:
            return_type = node.return_type.name if hasattr(node.return_type, 'name') else str(node.return_type)
        
        # Get parameters
        parameters = []
        if node.parameters:
            for param in node.parameters:
                param_type = param.type.name if hasattr(param.type, 'name') else str(param.type)
                parameters.append({
                    'name': param.name,
                    'type': param_type
                })
        
        # Get throws
        throws = []
        if node.throws:
            for throw in node.throws:
                throws.append(throw)
        
        # Get annotations
        annotations = []
        if hasattr(node, 'annotations') and node.annotations:
            for ann in node.annotations:
                annotations.append(ann.name)
        
        return JavaMethodInfo(
            name=node.name,
            modifiers=modifiers,
            return_type=return_type,
            parameters=parameters,
            throws=throws,
            annotations=annotations,
            line_start=node.position.line if hasattr(node, 'position') and node.position else None
        )
    
    def get_all_methods(self, package_info: JavaPackageInfo) -> List[JavaMethodInfo]:
        """Get all methods from all classes"""
        all_methods = []
        for cls in package_info.classes:
            all_methods.extend(cls.methods)
        return all_methods
    
    def get_class(self, package_info: JavaPackageInfo, class_name: str) -> Optional[JavaClassInfo]:
        """Get a specific class by name"""
        for cls in package_info.classes:
            if cls.name == class_name:
                return cls
        return None
    
    def get_method(self, class_info: JavaClassInfo, method_name: str) -> Optional[JavaMethodInfo]:
        """Get a specific method by name"""
        for method in class_info.methods:
            if method.name == method_name:
                return method
        return None
    
    def find_methods_with_annotation(self, package_info: JavaPackageInfo, annotation: str) -> List[JavaMethodInfo]:
        """Find all methods with a specific annotation"""
        methods = []
        for cls in package_info.classes:
            for method in cls.methods:
                if annotation in method.annotations:
                    methods.append(method)
        return methods
    
    def find_classes_with_annotation(self, package_info: JavaPackageInfo, annotation: str) -> List[JavaClassInfo]:
        """Find all classes with a specific annotation"""
        return [cls for cls in package_info.classes if annotation in cls.annotations]
    
    def get_inheritance_tree(self, package_info: JavaPackageInfo) -> Dict[str, List[str]]:
        """Get inheritance relationships"""
        tree = {}
        for cls in package_info.classes:
            if cls.extends:
                if cls.extends not in tree:
                    tree[cls.extends] = []
                tree[cls.extends].append(cls.name)
        return tree
    
    def get_statistics(self, package_info: JavaPackageInfo) -> Dict[str, Any]:
        """Get code statistics"""
        all_methods = self.get_all_methods(package_info)
        
        return {
            'package': package_info.name,
            'num_classes': len(package_info.classes),
            'num_imports': len(package_info.imports),
            'num_methods': len(all_methods),
            'public_methods': sum(1 for m in all_methods if 'public' in m.modifiers),
            'private_methods': sum(1 for m in all_methods if 'private' in m.modifiers),
            'static_methods': sum(1 for m in all_methods if 'static' in m.modifiers),
        }
    
    def to_dict(self, package_info: JavaPackageInfo) -> Dict[str, Any]:
        """Export analysis as dictionary"""
        return {
            'package': package_info.name,
            'imports': package_info.imports,
            'classes': [
                {
                    'name': cls.name,
                    'modifiers': cls.modifiers,
                    'extends': cls.extends,
                    'implements': cls.implements,
                    'annotations': cls.annotations,
                    'fields': cls.fields,
                    'methods': [
                        {
                            'name': m.name,
                            'modifiers': m.modifiers,
                            'return_type': m.return_type,
                            'parameters': m.parameters,
                            'throws': m.throws,
                            'annotations': m.annotations,
                        }
                        for m in cls.methods
                    ]
                }
                for cls in package_info.classes
            ],
            'statistics': self.get_statistics(package_info)
        }

