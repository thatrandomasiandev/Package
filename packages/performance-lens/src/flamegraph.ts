import { ProfileEntry } from './profiler';

export interface FlameGraphNode {
  name: string;
  value: number;
  children: FlameGraphNode[];
}

export class FlameGraphGenerator {
  generate(entries: ProfileEntry[]): FlameGraphNode {
    const root: FlameGraphNode = {
      name: 'root',
      value: 0,
      children: [],
    };

    entries.forEach(entry => {
      const node: FlameGraphNode = {
        name: entry.name,
        value: entry.duration,
        children: [],
      };
      root.children.push(node);
      root.value += entry.duration;
    });

    return root;
  }

  generateSVG(node: FlameGraphNode, width: number = 1200, height: number = 600): string {
    const colorScale = (value: number) => {
      const intensity = Math.min(255, Math.floor((value / node.value) * 255));
      return `rgb(${255}, ${255 - intensity}, ${100})`;
    };

    const renderNode = (n: FlameGraphNode, x: number, y: number, w: number, depth: number): string => {
      const h = 20;
      const color = colorScale(n.value);
      
      let svg = `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${color}" stroke="#fff" />`;
      svg += `<text x="${x + 5}" y="${y + 14}" font-size="12" fill="#000">${n.name} (${n.value.toFixed(2)}ms)</text>`;

      let childX = x;
      n.children.forEach(child => {
        const childWidth = (child.value / n.value) * w;
        svg += renderNode(child, childX, y + h + 2, childWidth, depth + 1);
        childX += childWidth;
      });

      return svg;
    };

    return `
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
  ${renderNode(node, 0, 0, width, 0)}
</svg>
    `;
  }
}

