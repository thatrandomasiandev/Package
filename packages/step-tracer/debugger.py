"""
Production Step Tracer
Python debugger integration for execution tracing
Original implementation by Joshua Terranova
"""

import sys
from typing import List, Dict, Optional, Any, Callable
from dataclasses import dataclass, field
from enum import Enum


class EventType(Enum):
    """Trace event types"""
    CALL = "call"
    LINE = "line"
    RETURN = "return"
    EXCEPTION = "exception"


@dataclass
class TraceEvent:
    """A single trace event"""
    event_type: EventType
    filename: str
    line_number: int
    function_name: str
    locals: Dict[str, Any]
    return_value: Optional[Any] = None
    exception: Optional[Exception] = None


@dataclass
class ExecutionTrace:
    """Complete execution trace"""
    events: List[TraceEvent] = field(default_factory=list)
    
    def filter_by_file(self, filename: str) -> List[TraceEvent]:
        """Filter events by filename"""
        return [e for e in self.events if filename in e.filename]
    
    def filter_by_function(self, function_name: str) -> List[TraceEvent]:
        """Filter events by function name"""
        return [e for e in self.events if e.function_name == function_name]
    
    def get_call_stack(self, index: int) -> List[TraceEvent]:
        """Get call stack at specific event index"""
        stack = []
        for i in range(index + 1):
            event = self.events[i]
            if event.event_type == EventType.CALL:
                stack.append(event)
            elif event.event_type == EventType.RETURN and stack:
                stack.pop()
        return stack


class StepTracer:
    """
    Production step tracer with Python debugger integration
    """
    
    def __init__(self):
        self.trace: ExecutionTrace = ExecutionTrace()
        self.is_tracing = False
        self.filter_files: List[str] = []
        self.filter_functions: List[str] = []
        self.max_events: Optional[int] = None
        self.on_event_callbacks: List[Callable[[TraceEvent], None]] = []
    
    def set_filter_files(self, files: List[str]):
        """Set file filter (only trace these files)"""
        self.filter_files = files
        return self
    
    def set_filter_functions(self, functions: List[str]):
        """Set function filter (only trace these functions)"""
        self.filter_functions = functions
        return self
    
    def set_max_events(self, max_events: int):
        """Set maximum number of events to record"""
        self.max_events = max_events
        return self
    
    def on_event(self, callback: Callable[[TraceEvent], None]):
        """Register callback for trace events"""
        self.on_event_callbacks.append(callback)
        return self
    
    def _should_trace_file(self, filename: str) -> bool:
        """Check if file should be traced"""
        if not self.filter_files:
            # Exclude standard library and site-packages
            if 'site-packages' in filename or '/lib/python' in filename:
                return False
            return True
        
        return any(f in filename for f in self.filter_files)
    
    def _should_trace_function(self, function_name: str) -> bool:
        """Check if function should be traced"""
        if not self.filter_functions:
            return True
        return function_name in self.filter_functions
    
    def _trace_callback(self, frame, event, arg):
        """Internal trace callback"""
        if not self.is_tracing:
            return None
        
        filename = frame.f_code.co_filename
        function_name = frame.f_code.co_name
        line_number = frame.f_lineno
        
        # Apply filters
        if not self._should_trace_file(filename):
            return None
        
        if not self._should_trace_function(function_name):
            return None
        
        # Check max events limit
        if self.max_events and len(self.trace.events) >= self.max_events:
            self.stop()
            return None
        
        # Create trace event
        event_type_map = {
            'call': EventType.CALL,
            'line': EventType.LINE,
            'return': EventType.RETURN,
            'exception': EventType.EXCEPTION
        }
        
        event_type = event_type_map.get(event)
        if not event_type:
            return self._trace_callback
        
        # Get local variables (with size limit)
        try:
            locals_dict = {k: v for k, v in frame.f_locals.items() if not k.startswith('__')}
            # Limit size of locals to prevent memory issues
            if len(str(locals_dict)) > 1000:
                locals_dict = {k: f"<{type(v).__name__}>" for k, v in locals_dict.items()}
        except:
            locals_dict = {}
        
        trace_event = TraceEvent(
            event_type=event_type,
            filename=filename,
            line_number=line_number,
            function_name=function_name,
            locals=locals_dict,
            return_value=arg if event == 'return' else None,
            exception=arg if event == 'exception' else None
        )
        
        self.trace.events.append(trace_event)
        
        # Call event callbacks
        for callback in self.on_event_callbacks:
            try:
                callback(trace_event)
            except:
                pass  # Don't let callbacks break tracing
        
        return self._trace_callback
    
    def start(self):
        """Start tracing"""
        self.trace = ExecutionTrace()
        self.is_tracing = True
        sys.settrace(self._trace_callback)
        return self
    
    def stop(self):
        """Stop tracing"""
        self.is_tracing = False
        sys.settrace(None)
        return self
    
    def trace_function(self, func: Callable) -> Any:
        """
        Trace a function execution
        
        Args:
            func: Function to trace
        
        Returns:
            Function return value
        """
        self.start()
        try:
            result = func()
            return result
        finally:
            self.stop()
    
    def trace_code(self, code: str, globals_dict: Optional[Dict] = None, locals_dict: Optional[Dict] = None):
        """
        Trace code execution
        
        Args:
            code: Python code to trace
            globals_dict: Global variables
            locals_dict: Local variables
        """
        globals_dict = globals_dict or {}
        locals_dict = locals_dict or {}
        
        self.start()
        try:
            exec(code, globals_dict, locals_dict)
        finally:
            self.stop()
    
    def get_trace(self) -> ExecutionTrace:
        """Get the execution trace"""
        return self.trace
    
    def print_trace(self, show_locals: bool = False):
        """Print the trace in a readable format"""
        for i, event in enumerate(self.trace.events):
            indent = "  " * len(self.trace.get_call_stack(i))
            
            symbol = {
                EventType.CALL: "→",
                EventType.LINE: "·",
                EventType.RETURN: "←",
                EventType.EXCEPTION: "✗"
            }[event.event_type]
            
            print(f"{i:4d} {indent}{symbol} {event.function_name}:{event.line_number}")
            
            if show_locals and event.locals:
                for key, value in event.locals.items():
                    print(f"     {indent}  {key} = {value}")
            
            if event.return_value is not None:
                print(f"     {indent}  → returns {event.return_value}")
            
            if event.exception:
                print(f"     {indent}  ✗ {event.exception}")
    
    def get_function_calls(self) -> List[TraceEvent]:
        """Get all function call events"""
        return [e for e in self.trace.events if e.event_type == EventType.CALL]
    
    def get_execution_path(self) -> List[str]:
        """Get execution path as list of function names"""
        return [e.function_name for e in self.trace.events if e.event_type == EventType.CALL]
    
    def get_variable_history(self, var_name: str) -> List[Dict[str, Any]]:
        """Get history of a variable's values"""
        history = []
        
        for event in self.trace.events:
            if var_name in event.locals:
                history.append({
                    'line': event.line_number,
                    'function': event.function_name,
                    'value': event.locals[var_name]
                })
        
        return history
    
    def to_dict(self) -> Dict[str, Any]:
        """Export trace as dictionary"""
        return {
            'total_events': len(self.trace.events),
            'function_calls': len(self.get_function_calls()),
            'execution_path': self.get_execution_path(),
            'events': [
                {
                    'type': e.event_type.value,
                    'function': e.function_name,
                    'line': e.line_number,
                    'file': e.filename,
                    'locals': e.locals if e.event_type == EventType.CALL else {}
                }
                for e in self.trace.events
            ]
        }


class BreakpointDebugger:
    """Simple breakpoint-based debugger"""
    
    def __init__(self):
        self.breakpoints: Dict[str, List[int]] = {}  # filename -> [line numbers]
        self.on_breakpoint_callbacks: List[Callable[[Any], None]] = []
    
    def add_breakpoint(self, filename: str, line: int):
        """Add a breakpoint"""
        if filename not in self.breakpoints:
            self.breakpoints[filename] = []
        self.breakpoints[filename].append(line)
        return self
    
    def remove_breakpoint(self, filename: str, line: int):
        """Remove a breakpoint"""
        if filename in self.breakpoints and line in self.breakpoints[filename]:
            self.breakpoints[filename].remove(line)
        return self
    
    def on_breakpoint(self, callback: Callable[[Any], None]):
        """Register callback for breakpoints"""
        self.on_breakpoint_callbacks.append(callback)
        return self
    
    def _trace_callback(self, frame, event, arg):
        """Internal trace callback for breakpoints"""
        if event != 'line':
            return self._trace_callback
        
        filename = frame.f_code.co_filename
        line = frame.f_lineno
        
        # Check if we hit a breakpoint
        if filename in self.breakpoints and line in self.breakpoints[filename]:
            # Call breakpoint callbacks with frame
            for callback in self.on_breakpoint_callbacks:
                callback(frame)
        
        return self._trace_callback
    
    def start(self):
        """Start debugging with breakpoints"""
        sys.settrace(self._trace_callback)
        return self
    
    def stop(self):
        """Stop debugging"""
        sys.settrace(None)
        return self

