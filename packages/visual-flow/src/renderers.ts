import { Diagram, RenderOptions, NodeShape } from './diagram-types';

/**
 * HTML Renderer for diagrams
 */
export class HTMLRenderer {
  render(diagram: Diagram, options: RenderOptions = {}): string {
    const {
      width = 1200,
      height = 800,
      theme = 'light',
      direction = 'TB',
      interactive = true,
    } = options;

    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${diagram.metadata?.title || 'Code Visualization'}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: ${theme === 'dark' ? '#1e1e1e' : '#ffffff'};
      color: ${theme === 'dark' ? '#ffffff' : '#000000'};
      padding: 20px;
      overflow: auto;
    }
    
    #container {
      width: 100%;
      height: 100vh;
      position: relative;
    }
    
    svg {
      width: 100%;
      height: 100%;
    }
    
    .node {
      cursor: ${interactive ? 'pointer' : 'default'};
      transition: all 0.2s;
    }
    
    .node:hover {
      opacity: 0.8;
      transform: scale(1.05);
    }
    
    .node-rect {
      stroke: #333;
      stroke-width: 2;
      fill: var(--node-color);
    }
    
    .node-text {
      fill: #fff;
      font-size: 14px;
      font-weight: 500;
      text-anchor: middle;
      dominant-baseline: middle;
      pointer-events: none;
    }
    
    .edge {
      fill: none;
      stroke: ${theme === 'dark' ? '#666' : '#999'};
      stroke-width: 2;
      marker-end: url(#arrowhead);
    }
    
    .edge-dashed {
      stroke-dasharray: 5, 5;
    }
    
    .edge-dotted {
      stroke-dasharray: 2, 2;
    }
    
    .edge-label {
      fill: ${theme === 'dark' ? '#aaa' : '#666'};
      font-size: 12px;
      text-anchor: middle;
    }
    
    .stats {
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${theme === 'dark' ? 'rgba(40, 40, 40, 0.9)' : 'rgba(255, 255, 255, 0.9)'};
      padding: 15px;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
      font-size: 12px;
      z-index: 1000;
    }
    
    .stats-item {
      margin: 5px 0;
    }
    
    .tooltip {
      position: absolute;
      background: ${theme === 'dark' ? '#333' : '#fff'};
      border: 1px solid ${theme === 'dark' ? '#555' : '#ddd'};
      padding: 10px;
      border-radius: 4px;
      font-size: 12px;
      pointer-events: none;
      opacity: 0;
      transition: opacity 0.2s;
      z-index: 1001;
    }
    
    .tooltip.show {
      opacity: 1;
    }
  </style>
</head>
<body>
  <div id="container">
    <svg id="diagram">
      <defs>
        <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
          <polygon points="0 0, 10 3, 0 6" fill="${theme === 'dark' ? '#666' : '#999'}" />
        </marker>
      </defs>
      <g id="edges"></g>
      <g id="nodes"></g>
    </svg>
  </div>
  
  <div class="stats">
    <div class="stats-item"><strong>Type:</strong> ${diagram.type}</div>
    <div class="stats-item"><strong>Nodes:</strong> ${diagram.nodes.length}</div>
    <div class="stats-item"><strong>Edges:</strong> ${diagram.edges.length}</div>
  </div>
  
  <div class="tooltip" id="tooltip"></div>
  
  <script>
    const diagram = ${JSON.stringify(diagram)};
    const options = ${JSON.stringify(options)};
    
    // Layout algorithm (simple hierarchical layout)
    function layoutDiagram() {
      const levelWidth = ${width} / (diagram.nodes.length > 0 ? Math.max(...diagram.nodes.map(n => getNodeLevel(n.id))) + 1 : 1);
      const levels = new Map();
      
      diagram.nodes.forEach(node => {
        const level = getNodeLevel(node.id);
        if (!levels.has(level)) levels.set(level, []);
        levels.get(level).push(node);
      });
      
      const positions = new Map();
      levels.forEach((nodes, level) => {
        const levelHeight = ${height} / (nodes.length + 1);
        nodes.forEach((node, index) => {
          positions.set(node.id, {
            x: level * levelWidth + levelWidth / 2,
            y: (index + 1) * levelHeight
          });
        });
      });
      
      return positions;
    }
    
    function getNodeLevel(nodeId) {
      const incomingEdges = diagram.edges.filter(e => e.to === nodeId);
      if (incomingEdges.length === 0) return 0;
      return Math.max(...incomingEdges.map(e => getNodeLevel(e.from))) + 1;
    }
    
    function renderDiagram() {
      const positions = layoutDiagram();
      const nodesGroup = document.getElementById('nodes');
      const edgesGroup = document.getElementById('edges');
      
      // Render nodes
      diagram.nodes.forEach(node => {
        const pos = positions.get(node.id);
        const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        g.classList.add('node');
        g.setAttribute('data-id', node.id);
        
        const shape = createShape(node, pos);
        shape.setAttribute('style', \`--node-color: \${node.color || '#999'}\`);
        g.appendChild(shape);
        
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.classList.add('node-text');
        text.setAttribute('x', pos.x);
        text.setAttribute('y', pos.y);
        text.textContent = node.label;
        g.appendChild(text);
        
        if (${interactive}) {
          g.addEventListener('mouseenter', (e) => showTooltip(e, node));
          g.addEventListener('mouseleave', hideTooltip);
        }
        
        nodesGroup.appendChild(g);
      });
      
      // Render edges
      diagram.edges.forEach(edge => {
        const fromPos = positions.get(edge.from);
        const toPos = positions.get(edge.to);
        
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.classList.add('edge');
        if (edge.type === 'dashed') path.classList.add('edge-dashed');
        if (edge.type === 'dotted') path.classList.add('edge-dotted');
        
        const d = \`M \${fromPos.x} \${fromPos.y + 30} L \${toPos.x} \${toPos.y - 30}\`;
        path.setAttribute('d', d);
        edgesGroup.appendChild(path);
        
        if (edge.label) {
          const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
          text.classList.add('edge-label');
          text.setAttribute('x', (fromPos.x + toPos.x) / 2);
          text.setAttribute('y', (fromPos.y + toPos.y) / 2);
          text.textContent = edge.label;
          edgesGroup.appendChild(text);
        }
      });
    }
    
    function createShape(node, pos) {
      const shape = node.shape || 'rectangle';
      let element;
      
      switch (shape) {
        case 'circle':
          element = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
          element.setAttribute('cx', pos.x);
          element.setAttribute('cy', pos.y);
          element.setAttribute('r', 30);
          break;
        case 'diamond':
          element = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
          element.setAttribute('points', \`\${pos.x},\${pos.y-30} \${pos.x+40},\${pos.y} \${pos.x},\${pos.y+30} \${pos.x-40},\${pos.y}\`);
          break;
        case 'hexagon':
          element = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
          element.setAttribute('points', \`\${pos.x-40},\${pos.y-20} \${pos.x-20},\${pos.y-30} \${pos.x+20},\${pos.y-30} \${pos.x+40},\${pos.y-20} \${pos.x+40},\${pos.y+20} \${pos.x+20},\${pos.y+30} \${pos.x-20},\${pos.y+30} \${pos.x-40},\${pos.y+20}\`);
          break;
        default:
          element = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
          element.setAttribute('x', pos.x - 60);
          element.setAttribute('y', pos.y - 25);
          element.setAttribute('width', 120);
          element.setAttribute('height', 50);
          element.setAttribute('rx', shape === 'rounded-rectangle' ? 10 : 0);
      }
      
      element.classList.add('node-rect');
      return element;
    }
    
    function showTooltip(event, node) {
      const tooltip = document.getElementById('tooltip');
      tooltip.innerHTML = \`
        <strong>\${node.label}</strong><br>
        Type: \${node.type}<br>
        \${node.metadata ? Object.entries(node.metadata).map(([k, v]) => \`\${k}: \${v}\`).join('<br>') : ''}
      \`;
      tooltip.style.left = event.pageX + 10 + 'px';
      tooltip.style.top = event.pageY + 10 + 'px';
      tooltip.classList.add('show');
    }
    
    function hideTooltip() {
      document.getElementById('tooltip').classList.remove('show');
    }
    
    renderDiagram();
  </script>
</body>
</html>
    `;
  }
}

/**
 * SVG Renderer for diagrams
 */
export class SVGRenderer {
  render(diagram: Diagram, options: RenderOptions = {}): string {
    // Simple SVG export
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${options.width || 800}" height="${options.height || 600}">
      <!-- SVG content here -->
    </svg>`;
  }
}

