import { Diagram } from '@code-lab/visualizers';

export interface D3Node {
  id: string;
  label: string;
  group?: number;
  value?: number;
}

export interface D3Link {
  source: string;
  target: string;
  value?: number;
}

export class D3GraphVisualizer {
  convertDiagramToD3(diagram: Diagram): { nodes: D3Node[]; links: D3Link[] } {
    const nodes: D3Node[] = diagram.nodes.map((node, index) => ({
      id: node.id,
      label: node.label,
      group: this.getNodeGroup(node.type),
      value: 10,
    }));

    const links: D3Link[] = diagram.edges.map(edge => ({
      source: edge.from,
      target: edge.to,
      value: 1,
    }));

    return { nodes, links };
  }

  generateHTML(diagram: Diagram, options: { width?: number; height?: number; theme?: string } = {}): string {
    const { width = 1200, height = 800, theme = 'light' } = options;
    const data = this.convertDiagramToD3(diagram);

    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <script src="https://d3js.org/d3.v7.min.js"></script>
  <style>
    body {
      margin: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: ${theme === 'dark' ? '#1e1e1e' : '#ffffff'};
      overflow: hidden;
    }
    svg {
      width: 100vw;
      height: 100vh;
    }
    .node {
      cursor: pointer;
    }
    .node circle {
      stroke: #fff;
      stroke-width: 2px;
    }
    .node text {
      font-size: 12px;
      fill: ${theme === 'dark' ? '#fff' : '#000'};
    }
    .link {
      fill: none;
      stroke: ${theme === 'dark' ? '#666' : '#999'};
      stroke-width: 2px;
    }
    .tooltip {
      position: absolute;
      background: ${theme === 'dark' ? '#333' : '#fff'};
      border: 1px solid ${theme === 'dark' ? '#555' : '#ddd'};
      padding: 10px;
      border-radius: 4px;
      pointer-events: none;
      opacity: 0;
      transition: opacity 0.2s;
    }
  </style>
</head>
<body>
  <svg id="graph"></svg>
  <div id="tooltip" class="tooltip"></div>
  
  <script>
    const data = ${JSON.stringify(data)};
    const width = ${width};
    const height = ${height};

    const svg = d3.select("#graph")
      .attr("viewBox", [0, 0, width, height]);

    const simulation = d3.forceSimulation(data.nodes)
      .force("link", d3.forceLink(data.links).id(d => d.id).distance(100))
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(30));

    const color = d3.scaleOrdinal(d3.schemeCategory10);

    const link = svg.append("g")
      .selectAll("line")
      .data(data.links)
      .join("line")
      .attr("class", "link")
      .attr("marker-end", "url(#arrowhead)");

    svg.append("defs").append("marker")
      .attr("id", "arrowhead")
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 20)
      .attr("refY", 0)
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("orient", "auto")
      .append("path")
      .attr("d", "M0,-5L10,0L0,5")
      .attr("fill", "${theme === 'dark' ? '#666' : '#999'}");

    const node = svg.append("g")
      .selectAll("g")
      .data(data.nodes)
      .join("g")
      .attr("class", "node")
      .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));

    node.append("circle")
      .attr("r", 20)
      .attr("fill", d => color(d.group));

    node.append("text")
      .attr("dx", 25)
      .attr("dy", 5)
      .text(d => d.label);

    node.on("mouseover", function(event, d) {
      d3.select("#tooltip")
        .style("opacity", 1)
        .style("left", event.pageX + 10 + "px")
        .style("top", event.pageY + 10 + "px")
        .html(\`<strong>\${d.label}</strong><br>ID: \${d.id}\`);
    })
    .on("mouseout", function() {
      d3.select("#tooltip").style("opacity", 0);
    });

    simulation.on("tick", () => {
      link
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);

      node
        .attr("transform", d => \`translate(\${d.x},\${d.y})\`);
    });

    function dragstarted(event) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }
  </script>
</body>
</html>
    `;
  }

  private getNodeGroup(type: string): number {
    const groups: Record<string, number> = {
      'function': 1,
      'class': 2,
      'variable': 3,
      'conditional': 4,
      'loop': 5,
    };
    return groups[type] || 0;
  }
}

