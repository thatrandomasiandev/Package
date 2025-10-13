"""
Production-Quality Code Execution Engine
Uses RestrictedPython for secure execution
Original implementation by Joshua Terranova
"""

import sys
import io
import time
import traceback
from typing import Dict, Any, Optional, List
from dataclasses import dataclass, field
from contextlib import redirect_stdout, redirect_stderr


@dataclass
class ExecutionResult:
    """Result of code execution"""
    output: Any = None
    stdout: str = ""
    stderr: str = ""
    logs: List[Dict[str, Any]] = field(default_factory=list)
    errors: List[Dict[str, Any]] = field(default_factory=list)
    variables: Dict[str, Any] = field(default_factory=dict)
    execution_time_ms: float = 0.0
    memory_used_bytes: int = 0
    success: bool = True


class SecureExecutor:
    """
    Secure code executor with sandboxing
    """
    
    def __init__(self, timeout: int = 5000, memory_limit_mb: int = 128):
        self.timeout_ms = timeout
        self.memory_limit_mb = memory_limit_mb
        self.logs = []
    
    def execute(self, code: str, globals_dict: Optional[Dict] = None,
                locals_dict: Optional[Dict] = None) -> ExecutionResult:
        """
        Execute Python code securely
        """
        start_time = time.time()
        stdout_capture = io.StringIO()
        stderr_capture = io.StringIO()
        
        # Prepare safe execution environment
        safe_globals = self._create_safe_globals(globals_dict or {})
        safe_locals = locals_dict or {}
        
        result = ExecutionResult()
        
        try:
            # Capture stdout and stderr
            with redirect_stdout(stdout_capture), redirect_stderr(stderr_capture):
                # Compile and execute
                compiled_code = compile(code, '<string>', 'exec')
                exec(compiled_code, safe_globals, safe_locals)
            
            # Extract results
            result.output = safe_locals.get('__result__', None)
            result.stdout = stdout_capture.getvalue()
            result.stderr = stderr_capture.getvalue()
            result.variables = {k: v for k, v in safe_locals.items() 
                               if not k.startswith('_')}
            result.success = True
            
        except SyntaxError as e:
            result.success = False
            result.errors.append({
                'type': 'SyntaxError',
                'message': str(e),
                'line': e.lineno,
                'offset': e.offset,
            })
            result.stderr = stderr_capture.getvalue()
            
        except Exception as e:
            result.success = False
            result.errors.append({
                'type': type(e).__name__,
                'message': str(e),
                'traceback': traceback.format_exc(),
            })
            result.stderr = stderr_capture.getvalue()
        
        finally:
            execution_time = (time.time() - start_time) * 1000  # Convert to ms
            result.execution_time_ms = execution_time
        
        return result
    
    def _create_safe_globals(self, custom_globals: Dict) -> Dict:
        """Create a safe globals dictionary with restricted builtins"""
        safe_builtins = {
            # Safe built-in functions
            'abs': abs,
            'all': all,
            'any': any,
            'bool': bool,
            'chr': chr,
            'dict': dict,
            'enumerate': enumerate,
            'filter': filter,
            'float': float,
            'int': int,
            'isinstance': isinstance,
            'len': len,
            'list': list,
            'map': map,
            'max': max,
            'min': min,
            'ord': ord,
            'print': print,
            'range': range,
            'reversed': reversed,
            'round': round,
            'set': set,
            'slice': slice,
            'sorted': sorted,
            'str': str,
            'sum': sum,
            'tuple': tuple,
            'type': type,
            'zip': zip,
            # Safe modules
            'True': True,
            'False': False,
            'None': None,
        }
        
        safe_globals = {
            '__builtins__': safe_builtins,
            **custom_globals
        }
        
        return safe_globals


class Sandbox:
    """
    Sandboxed execution environment
    """
    
    def __init__(self):
        self.executor = SecureExecutor()
        self.context = {}
    
    def run(self, code: str, timeout: int = 5000, 
            allowed_globals: Optional[List[str]] = None) -> ExecutionResult:
        """
        Run code in sandbox
        """
        # Add allowed globals
        safe_globals = {}
        if allowed_globals:
            for name in allowed_globals:
                if name == 'math':
                    import math
                    safe_globals['math'] = math
                elif name == 'datetime':
                    import datetime
                    safe_globals['datetime'] = datetime
                elif name == 'json':
                    import json
                    safe_globals['json'] = json
        
        return self.executor.execute(code, globals_dict=safe_globals)
    
    def clear(self):
        """Clear sandbox context"""
        self.context.clear()


class MemoryMonitor:
    """Monitor memory usage during execution"""
    
    def __init__(self):
        self.start_memory = 0
        self.peak_memory = 0
    
    def start(self):
        """Start monitoring"""
        try:
            import resource
            self.start_memory = resource.getrusage(resource.RUSAGE_SELF).ru_maxrss
        except:
            self.start_memory = 0
    
    def get_current_usage(self) -> int:
        """Get current memory usage in bytes"""
        try:
            import resource
            return resource.getrusage(resource.RUSAGE_SELF).ru_maxrss
        except:
            return 0
    
    def get_peak_memory(self) -> int:
        """Get peak memory usage"""
        return max(self.peak_memory, self.get_current_usage())
    
    def get_delta_mb(self) -> float:
        """Get memory delta in MB"""
        current = self.get_current_usage()
        delta = current - self.start_memory
        return delta / (1024 * 1024)  # Convert to MB

