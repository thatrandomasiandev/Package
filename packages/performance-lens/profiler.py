"""
Production-Quality Performance Profiler
Uses Python's cProfile and pstats for accurate profiling
Original implementation by Joshua Terranova
"""

import cProfile
import pstats
import io
import time
import functools
from typing import Dict, Any, Optional, Callable, List
from dataclasses import dataclass, field


@dataclass
class ProfileResult:
    """Result from profiling a function"""
    function_name: str
    total_time: float
    cumulative_time: float
    call_count: int
    stats: Dict[str, Any] = field(default_factory=dict)
    top_functions: List[Dict[str, Any]] = field(default_factory=list)


class Profiler:
    """
    Production profiler using Python's built-in cProfile
    """
    
    def __init__(self):
        self.profiler = cProfile.Profile()
        self.results = []
    
    def profile(self, func: Callable) -> Callable:
        """
        Decorator to profile a function
        
        Usage:
            @profiler.profile
            def my_function():
                # code here
        """
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            self.profiler.enable()
            try:
                result = func(*args, **kwargs)
                return result
            finally:
                self.profiler.disable()
        return wrapper
    
    def profile_block(self, name: str = "block"):
        """
        Context manager for profiling a code block
        
        Usage:
            with profiler.profile_block("my_code"):
                # code here
        """
        return ProfileContext(self.profiler, name)
    
    def get_stats(self, sort_by: str = 'cumulative', limit: int = 20) -> Dict[str, Any]:
        """
        Get profiling statistics
        
        Args:
            sort_by: How to sort results ('cumulative', 'time', 'calls')
            limit: Maximum number of functions to return
        
        Returns:
            Dictionary with profiling statistics
        """
        stream = io.StringIO()
        stats = pstats.Stats(self.profiler, stream=stream)
        
        # Sort by specified metric
        stats.sort_stats(sort_by)
        
        # Get top functions
        stats.print_stats(limit)
        
        # Parse output
        output = stream.getvalue()
        
        # Get function call statistics
        top_functions = []
        for func_info in list(stats.stats.items())[:limit]:
            func_name, (cc, nc, tt, ct, callers) = func_info
            top_functions.append({
                'function': f"{func_name[0]}:{func_name[1]}:{func_name[2]}",
                'calls': cc,
                'total_time': tt,
                'cumulative_time': ct,
                'time_per_call': tt/cc if cc > 0 else 0,
            })
        
        return {
            'total_calls': stats.total_calls,
            'total_time': stats.total_tt,
            'top_functions': top_functions,
            'raw_output': output,
        }
    
    def print_stats(self, sort_by: str = 'cumulative', limit: int = 20):
        """Print profiling statistics"""
        stats = pstats.Stats(self.profiler)
        stats.sort_stats(sort_by)
        stats.print_stats(limit)
    
    def reset(self):
        """Reset profiler"""
        self.profiler = cProfile.Profile()
        self.results = []


class ProfileContext:
    """Context manager for profiling code blocks"""
    
    def __init__(self, profiler: cProfile.Profile, name: str):
        self.profiler = profiler
        self.name = name
        self.start_time = None
    
    def __enter__(self):
        self.start_time = time.time()
        self.profiler.enable()
        return self
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        self.profiler.disable()
        elapsed = time.time() - self.start_time
        print(f"Block '{self.name}' took {elapsed:.4f} seconds")


class Benchmark:
    """
    Benchmarking utility for comparing function performance
    """
    
    def __init__(self):
        self.results = []
    
    def run(self, func: Callable, *args, iterations: int = 1000, 
            name: Optional[str] = None, **kwargs) -> Dict[str, Any]:
        """
        Benchmark a function
        
        Args:
            func: Function to benchmark
            iterations: Number of times to run
            name: Optional name for the benchmark
        
        Returns:
            Dictionary with benchmark results
        """
        name = name or func.__name__
        
        # Warm-up run
        func(*args, **kwargs)
        
        # Actual benchmark
        times = []
        for _ in range(iterations):
            start = time.perf_counter()
            func(*args, **kwargs)
            end = time.perf_counter()
            times.append(end - start)
        
        # Calculate statistics
        total_time = sum(times)
        avg_time = total_time / iterations
        min_time = min(times)
        max_time = max(times)
        
        # Calculate median
        sorted_times = sorted(times)
        mid = iterations // 2
        median_time = (sorted_times[mid] + sorted_times[mid-1]) / 2 if iterations % 2 == 0 else sorted_times[mid]
        
        result = {
            'name': name,
            'iterations': iterations,
            'total_time': total_time,
            'average_time': avg_time,
            'min_time': min_time,
            'max_time': max_time,
            'median_time': median_time,
            'ops_per_second': 1 / avg_time if avg_time > 0 else float('inf'),
        }
        
        self.results.append(result)
        return result
    
    def compare(self, functions: List[Callable], *args, 
                iterations: int = 1000, **kwargs) -> List[Dict[str, Any]]:
        """
        Compare multiple functions
        
        Args:
            functions: List of functions to compare
            iterations: Number of iterations for each
        
        Returns:
            List of results, sorted by average time
        """
        results = []
        for func in functions:
            result = self.run(func, *args, iterations=iterations, **kwargs)
            results.append(result)
        
        # Sort by average time (fastest first)
        results.sort(key=lambda x: x['average_time'])
        
        # Add relative performance
        if results:
            fastest = results[0]['average_time']
            for result in results:
                result['relative_speed'] = result['average_time'] / fastest
        
        return results
    
    def print_comparison(self, results: List[Dict[str, Any]]):
        """Print comparison results in a readable format"""
        print("\n" + "="*80)
        print("BENCHMARK COMPARISON RESULTS")
        print("="*80)
        
        for i, result in enumerate(results, 1):
            print(f"\n{i}. {result['name']}")
            print(f"   Average time: {result['average_time']*1000:.4f} ms")
            print(f"   Ops/second:   {result['ops_per_second']:.2f}")
            print(f"   Min time:     {result['min_time']*1000:.4f} ms")
            print(f"   Max time:     {result['max_time']*1000:.4f} ms")
            if 'relative_speed' in result:
                print(f"   Relative:     {result['relative_speed']:.2f}x")
        
        print("\n" + "="*80)


class MemoryProfiler:
    """
    Memory profiling utilities
    """
    
    def __init__(self):
        self.snapshots = []
    
    def get_memory_usage(self) -> float:
        """Get current memory usage in MB"""
        try:
            import psutil
            import os
            process = psutil.Process(os.getpid())
            return process.memory_info().rss / 1024 / 1024  # Convert to MB
        except ImportError:
            # Fallback if psutil not available
            import resource
            return resource.getrusage(resource.RUSAGE_SELF).ru_maxrss / 1024  # MB
    
    def snapshot(self, label: str = ""):
        """Take a memory snapshot"""
        usage = self.get_memory_usage()
        self.snapshots.append({
            'label': label,
            'memory_mb': usage,
            'timestamp': time.time()
        })
        return usage
    
    def compare_snapshots(self) -> List[Dict[str, Any]]:
        """Compare memory snapshots"""
        if len(self.snapshots) < 2:
            return []
        
        comparisons = []
        for i in range(1, len(self.snapshots)):
            prev = self.snapshots[i-1]
            curr = self.snapshots[i]
            diff = curr['memory_mb'] - prev['memory_mb']
            comparisons.append({
                'from': prev['label'],
                'to': curr['label'],
                'delta_mb': diff,
                'percent_change': (diff / prev['memory_mb'] * 100) if prev['memory_mb'] > 0 else 0
            })
        
        return comparisons
    
    def profile_function(self, func: Callable, *args, **kwargs) -> Dict[str, Any]:
        """Profile memory usage of a function"""
        before = self.get_memory_usage()
        result = func(*args, **kwargs)
        after = self.get_memory_usage()
        
        return {
            'memory_before': before,
            'memory_after': after,
            'memory_delta': after - before,
            'result': result
        }

