"""
Production UI Component Generation
Uses Jinja2 for templating
Original implementation by Joshua Terranova
"""

from typing import Dict, List, Optional, Any
from dataclasses import dataclass


@dataclass
class Component:
    """UI Component definition"""
    name: str
    html: str
    css: Optional[str] = None
    js: Optional[str] = None
    props: Optional[Dict[str, Any]] = None


class UIComponentGenerator:
    """
    Production UI component generator with Jinja2 templates
    """
    
    def __init__(self):
        self.jinja_env = None
        self._ensure_import()
    
    def _ensure_import(self):
        """Lazy import Jinja2"""
        try:
            from jinja2 import Environment, BaseLoader, TemplateNotFound
            self.jinja_env = Environment(loader=BaseLoader())
        except ImportError:
            raise ImportError("Jinja2 is required. Install with: pip install Jinja2")
    
    def render_template(self, template_str: str, context: Dict[str, Any]) -> str:
        """
        Render a Jinja2 template
        
        Args:
            template_str: Template string
            context: Template context variables
        
        Returns:
            Rendered string
        """
        template = self.jinja_env.from_string(template_str)
        return template.render(**context)
    
    def create_button(
        self,
        text: str,
        variant: str = "primary",
        size: str = "medium",
        disabled: bool = False,
        on_click: Optional[str] = None
    ) -> Component:
        """Create a button component"""
        html = f'''<button class="btn btn-{variant} btn-{size}" {'disabled' if disabled else ''} {f'onclick="{on_click}"' if on_click else ''}>
    {text}
</button>'''
        
        css = '''.btn {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 4px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
}

.btn-primary {
    background-color: #2196F3;
    color: white;
}

.btn-primary:hover {
    background-color: #1976D2;
}

.btn-secondary {
    background-color: #757575;
    color: white;
}

.btn-small {
    padding: 0.25rem 0.5rem;
    font-size: 0.875rem;
}

.btn-large {
    padding: 0.75rem 1.5rem;
    font-size: 1.125rem;
}

.btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}'''
        
        return Component(name="button", html=html, css=css)
    
    def create_card(
        self,
        title: str,
        content: str,
        image_url: Optional[str] = None,
        actions: Optional[List[str]] = None
    ) -> Component:
        """Create a card component"""
        image_html = f'<img src="{image_url}" class="card-image" alt="{title}">' if image_url else ''
        actions_html = ''
        
        if actions:
            actions_html = '<div class="card-actions">'
            for action in actions:
                actions_html += action
            actions_html += '</div>'
        
        html = f'''<div class="card">
    {image_html}
    <div class="card-content">
        <h3 class="card-title">{title}</h3>
        <p class="card-text">{content}</p>
    </div>
    {actions_html}
</div>'''
        
        css = '''.card {
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    overflow: hidden;
}

.card-image {
    width: 100%;
    height: 200px;
    object-fit: cover;
}

.card-content {
    padding: 1rem;
}

.card-title {
    margin: 0 0 0.5rem 0;
    font-size: 1.25rem;
}

.card-text {
    margin: 0;
    color: #666;
}

.card-actions {
    padding: 1rem;
    border-top: 1px solid #eee;
    display: flex;
    gap: 0.5rem;
}'''
        
        return Component(name="card", html=html, css=css)
    
    def create_input(
        self,
        label: str,
        input_type: str = "text",
        placeholder: str = "",
        name: Optional[str] = None,
        required: bool = False
    ) -> Component:
        """Create an input component"""
        html = f'''<div class="form-group">
    <label class="form-label">{label}{' *' if required else ''}</label>
    <input 
        type="{input_type}" 
        class="form-input" 
        placeholder="{placeholder}"
        {f'name="{name}"' if name else ''}
        {'required' if required else ''}
    />
</div>'''
        
        css = '''.form-group {
    margin-bottom: 1rem;
}

.form-label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
}

.form-input {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1rem;
}

.form-input:focus {
    outline: none;
    border-color: #2196F3;
    box-shadow: 0 0 0 3px rgba(33, 150, 243, 0.1);
}'''
        
        return Component(name="input", html=html, css=css)
    
    def create_modal(
        self,
        title: str,
        content: str,
        show: bool = False
    ) -> Component:
        """Create a modal component"""
        html = f'''<div class="modal {'modal-show' if show else ''}" id="modal">
    <div class="modal-overlay" onclick="closeModal()"></div>
    <div class="modal-content">
        <div class="modal-header">
            <h2 class="modal-title">{title}</h2>
            <button class="modal-close" onclick="closeModal()">&times;</button>
        </div>
        <div class="modal-body">
            {content}
        </div>
    </div>
</div>'''
        
        css = '''.modal {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1000;
}

.modal-show {
    display: flex;
    align-items: center;
    justify-content: center;
}

.modal-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
}

.modal-content {
    position: relative;
    background: white;
    border-radius: 8px;
    max-width: 500px;
    width: 90%;
    max-height: 90vh;
    overflow: auto;
}

.modal-header {
    padding: 1rem;
    border-bottom: 1px solid #eee;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.modal-title {
    margin: 0;
}

.modal-close {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
}

.modal-body {
    padding: 1rem;
}'''
        
        js = '''function closeModal() {
    document.getElementById('modal').classList.remove('modal-show');
}

function openModal() {
    document.getElementById('modal').classList.add('modal-show');
}'''
        
        return Component(name="modal", html=html, css=css, js=js)
    
    def create_navbar(
        self,
        brand: str,
        links: List[Dict[str, str]]
    ) -> Component:
        """Create a navbar component"""
        links_html = ''
        for link in links:
            links_html += f'<a href="{link.get("href", "#")}" class="nav-link">{link.get("text", "")}</a>'
        
        html = f'''<nav class="navbar">
    <div class="navbar-brand">{brand}</div>
    <div class="navbar-links">
        {links_html}
    </div>
</nav>'''
        
        css = '''.navbar {
    background: #2196F3;
    color: white;
    padding: 1rem 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.navbar-brand {
    font-size: 1.25rem;
    font-weight: bold;
}

.navbar-links {
    display: flex;
    gap: 1rem;
}

.nav-link {
    color: white;
    text-decoration: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    transition: background 0.2s;
}

.nav-link:hover {
    background: rgba(255, 255, 255, 0.1);
}'''
        
        return Component(name="navbar", html=html, css=css)
    
    def create_table(
        self,
        headers: List[str],
        rows: List[List[str]]
    ) -> Component:
        """Create a table component"""
        headers_html = ''.join(f'<th>{h}</th>' for h in headers)
        rows_html = ''
        
        for row in rows:
            row_html = ''.join(f'<td>{cell}</td>' for cell in row)
            rows_html += f'<tr>{row_html}</tr>'
        
        html = f'''<table class="table">
    <thead>
        <tr>{headers_html}</tr>
    </thead>
    <tbody>
        {rows_html}
    </tbody>
</table>'''
        
        css = '''.table {
    width: 100%;
    border-collapse: collapse;
}

.table th,
.table td {
    padding: 0.75rem;
    text-align: left;
    border-bottom: 1px solid #eee;
}

.table th {
    background: #f5f5f5;
    font-weight: 500;
}

.table tr:hover {
    background: #f9f9f9;
}'''
        
        return Component(name="table", html=html, css=css)
    
    def render_page(self, components: List[Component], title: str = "Page") -> str:
        """Render a complete HTML page with components"""
        all_css = set()
        all_js = set()
        all_html = []
        
        for comp in components:
            all_html.append(comp.html)
            if comp.css:
                all_css.add(comp.css)
            if comp.js:
                all_js.add(comp.js)
        
        css_block = '\n\n'.join(all_css)
        js_block = '\n\n'.join(all_js)
        html_block = '\n\n'.join(all_html)
        
        return f'''<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{title}</title>
    <style>
* {{
    box-sizing: border-box;
}}

body {{
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    line-height: 1.6;
}}

{css_block}
    </style>
</head>
<body>
{html_block}

<script>
{js_block}
</script>
</body>
</html>'''

