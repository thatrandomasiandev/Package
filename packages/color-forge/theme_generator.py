"""
Production Theme and Color Generation
Generates CSS themes and color schemes
Original implementation by Joshua Terranova
"""

from typing import List, Dict, Optional, Tuple, Literal
from dataclasses import dataclass
import colorsys


@dataclass
class Color:
    """RGB color representation"""
    r: int
    g: int
    b: int
    
    def to_hex(self) -> str:
        """Convert to hex string"""
        return f"#{self.r:02x}{self.g:02x}{self.b:02x}"
    
    def to_rgb(self) -> str:
        """Convert to RGB string"""
        return f"rgb({self.r}, {self.g}, {self.b})"
    
    def to_hsl(self) -> Tuple[float, float, float]:
        """Convert to HSL"""
        r, g, b = self.r / 255, self.g / 255, self.b / 255
        h, l, s = colorsys.rgb_to_hls(r, g, b)
        return (h * 360, s * 100, l * 100)
    
    @classmethod
    def from_hex(cls, hex_color: str) -> 'Color':
        """Create from hex string"""
        hex_color = hex_color.lstrip('#')
        return cls(
            r=int(hex_color[0:2], 16),
            g=int(hex_color[2:4], 16),
            b=int(hex_color[4:6], 16)
        )
    
    @classmethod
    def from_hsl(cls, h: float, s: float, l: float) -> 'Color':
        """Create from HSL"""
        r, g, b = colorsys.hls_to_rgb(h / 360, l / 100, s / 100)
        return cls(
            r=int(r * 255),
            g=int(g * 255),
            b=int(b * 255)
        )


class ColorPalette:
    """Color palette generator"""
    
    def __init__(self, base_color: Color):
        self.base_color = base_color
    
    def generate_analogous(self, count: int = 3) -> List[Color]:
        """Generate analogous colors"""
        h, s, l = self.base_color.to_hsl()
        colors = []
        
        step = 30  # degrees
        for i in range(-(count//2), count - (count//2)):
            new_h = (h + i * step) % 360
            colors.append(Color.from_hsl(new_h, s, l))
        
        return colors
    
    def generate_complementary(self) -> Color:
        """Generate complementary color"""
        h, s, l = self.base_color.to_hsl()
        return Color.from_hsl((h + 180) % 360, s, l)
    
    def generate_triadic(self) -> List[Color]:
        """Generate triadic colors"""
        h, s, l = self.base_color.to_hsl()
        return [
            self.base_color,
            Color.from_hsl((h + 120) % 360, s, l),
            Color.from_hsl((h + 240) % 360, s, l)
        ]
    
    def generate_tetradic(self) -> List[Color]:
        """Generate tetradic colors"""
        h, s, l = self.base_color.to_hsl()
        return [
            self.base_color,
            Color.from_hsl((h + 90) % 360, s, l),
            Color.from_hsl((h + 180) % 360, s, l),
            Color.from_hsl((h + 270) % 360, s, l)
        ]
    
    def generate_monochromatic(self, count: int = 5) -> List[Color]:
        """Generate monochromatic colors"""
        h, s, l = self.base_color.to_hsl()
        colors = []
        
        step = 80 / (count - 1) if count > 1 else 0
        for i in range(count):
            new_l = 10 + i * step
            colors.append(Color.from_hsl(h, s, min(new_l, 90)))
        
        return colors
    
    def lighten(self, amount: float = 0.1) -> Color:
        """Lighten the base color"""
        h, s, l = self.base_color.to_hsl()
        return Color.from_hsl(h, s, min(l + amount * 100, 100))
    
    def darken(self, amount: float = 0.1) -> Color:
        """Darken the base color"""
        h, s, l = self.base_color.to_hsl()
        return Color.from_hsl(h, s, max(l - amount * 100, 0))
    
    def saturate(self, amount: float = 0.1) -> Color:
        """Increase saturation"""
        h, s, l = self.base_color.to_hsl()
        return Color.from_hsl(h, min(s + amount * 100, 100), l)
    
    def desaturate(self, amount: float = 0.1) -> Color:
        """Decrease saturation"""
        h, s, l = self.base_color.to_hsl()
        return Color.from_hsl(h, max(s - amount * 100, 0), l)


class ThemeGenerator:
    """
    Production theme generator with CSS output
    """
    
    def __init__(self):
        self.variables: Dict[str, str] = {}
        self.rules: Dict[str, Dict[str, str]] = {}
    
    def set_variable(self, name: str, value: str):
        """Set a CSS variable"""
        self.variables[name] = value
        return self
    
    def add_rule(self, selector: str, properties: Dict[str, str]):
        """Add a CSS rule"""
        self.rules[selector] = properties
        return self
    
    def generate_theme(
        self,
        primary_color: Color,
        secondary_color: Optional[Color] = None,
        accent_color: Optional[Color] = None,
        theme_name: str = "custom"
    ) -> 'ThemeGenerator':
        """
        Generate a complete theme from base colors
        
        Args:
            primary_color: Primary theme color
            secondary_color: Secondary color (optional)
            accent_color: Accent color (optional)
            theme_name: Name of the theme
        
        Returns:
            Self for chaining
        """
        palette = ColorPalette(primary_color)
        
        # Generate secondary and accent if not provided
        if not secondary_color:
            secondary_color = palette.generate_complementary()
        
        if not accent_color:
            triadic = palette.generate_triadic()
            accent_color = triadic[1]
        
        # Set CSS variables
        self.set_variable("--primary-color", primary_color.to_hex())
        self.set_variable("--primary-light", palette.lighten(0.2).to_hex())
        self.set_variable("--primary-dark", palette.darken(0.2).to_hex())
        
        self.set_variable("--secondary-color", secondary_color.to_hex())
        self.set_variable("--accent-color", accent_color.to_hex())
        
        # Generate neutral colors
        self.set_variable("--background", "#ffffff")
        self.set_variable("--surface", "#f5f5f5")
        self.set_variable("--text", "#212121")
        self.set_variable("--text-secondary", "#757575")
        
        # Generate semantic colors
        self.set_variable("--success", "#4caf50")
        self.set_variable("--warning", "#ff9800")
        self.set_variable("--error", "#f44336")
        self.set_variable("--info", "#2196f3")
        
        # Add base rules
        self.add_rule(":root", self.variables.copy())
        
        self.add_rule("body", {
            "color": "var(--text)",
            "background-color": "var(--background)",
            "font-family": "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        })
        
        self.add_rule("a", {
            "color": "var(--primary-color)",
            "text-decoration": "none",
        })
        
        self.add_rule("a:hover", {
            "color": "var(--primary-dark)",
        })
        
        self.add_rule("button, .btn", {
            "background-color": "var(--primary-color)",
            "color": "white",
            "border": "none",
            "padding": "0.5rem 1rem",
            "border-radius": "4px",
            "cursor": "pointer",
        })
        
        self.add_rule("button:hover, .btn:hover", {
            "background-color": "var(--primary-dark)",
        })
        
        return self
    
    def generate_dark_theme(
        self,
        primary_color: Color,
        theme_name: str = "dark"
    ) -> 'ThemeGenerator':
        """Generate a dark theme"""
        palette = ColorPalette(primary_color)
        
        # Set CSS variables for dark theme
        self.set_variable("--primary-color", primary_color.to_hex())
        self.set_variable("--primary-light", palette.lighten(0.3).to_hex())
        self.set_variable("--primary-dark", palette.darken(0.2).to_hex())
        
        # Dark theme specific colors
        self.set_variable("--background", "#121212")
        self.set_variable("--surface", "#1e1e1e")
        self.set_variable("--text", "#e0e0e0")
        self.set_variable("--text-secondary", "#a0a0a0")
        
        # Semantic colors
        self.set_variable("--success", "#66bb6a")
        self.set_variable("--warning", "#ffa726")
        self.set_variable("--error", "#ef5350")
        self.set_variable("--info", "#42a5f5")
        
        # Add base rules
        self.add_rule(":root", self.variables.copy())
        
        self.add_rule("body", {
            "color": "var(--text)",
            "background-color": "var(--background)",
            "font-family": "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        })
        
        return self
    
    def to_css(self) -> str:
        """Generate CSS string"""
        lines = []
        
        for selector, properties in self.rules.items():
            lines.append(f"{selector} {{")
            for prop, value in properties.items():
                lines.append(f"    {prop}: {value};")
            lines.append("}")
            lines.append("")
        
        return "\n".join(lines)
    
    def to_scss(self) -> str:
        """Generate SCSS string with variables"""
        lines = []
        
        # SCSS variables
        for name, value in self.variables.items():
            scss_name = name.replace("--", "$")
            lines.append(f"{scss_name}: {value};")
        
        lines.append("")
        
        # SCSS rules
        for selector, properties in self.rules.items():
            if selector == ":root":
                continue
            
            lines.append(f"{selector} {{")
            for prop, value in properties.items():
                # Convert CSS var() to SCSS variables
                if "var(--" in value:
                    value = value.replace("var(--", "$").replace(")", "")
                lines.append(f"  {prop}: {value};")
            lines.append("}")
            lines.append("")
        
        return "\n".join(lines)
    
    def export_json(self) -> Dict[str, Any]:
        """Export theme as JSON"""
        return {
            "variables": self.variables,
            "rules": self.rules
        }

