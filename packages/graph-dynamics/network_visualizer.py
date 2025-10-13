"""
Production Network Visualization
Uses networkx for graph algorithms and plotly for interactive visualization
Original implementation by Joshua Terranova
"""

from typing import List, Dict, Optional, Any, Tuple, Literal
from dataclasses import dataclass
import json


@dataclass
class Node:
    """Graph node"""
    id: str
    label: str
    properties: Optional[Dict[str, Any]] = None


@dataclass
class Edge:
    """Graph edge"""
    source: str
    target: str
    weight: float = 1.0
    properties: Optional[Dict[str, Any]] = None


class NetworkVisualizer:
    """
    Production network visualization using networkx and plotly
    """
    
    def __init__(self):
        self.nx = None
        self.go = None
        self._ensure_imports()
    
    def _ensure_imports(self):
        """Lazy import networkx and plotly"""
        try:
            import networkx as nx
            import plotly.graph_objects as go
            self.nx = nx
            self.go = go
        except ImportError as e:
            raise ImportError(f"Required libraries not found: {e}. Install with: pip install networkx plotly")
    
    def create_graph(self, nodes: List[Node], edges: List[Edge], directed: bool = False):
        """
        Create a networkx graph from nodes and edges
        
        Args:
            nodes: List of Node objects
            edges: List of Edge objects
            directed: Whether the graph is directed
        
        Returns:
            networkx Graph or DiGraph
        """
        G = self.nx.DiGraph() if directed else self.nx.Graph()
        
        # Add nodes
        for node in nodes:
            G.add_node(node.id, label=node.label, **(node.properties or {}))
        
        # Add edges
        for edge in edges:
            G.add_edge(edge.source, edge.target, weight=edge.weight, **(edge.properties or {}))
        
        return G
    
    def visualize_graph(
        self,
        nodes: List[Node],
        edges: List[Edge],
        directed: bool = False,
        layout: Literal['spring', 'circular', 'kamada_kawai', 'spectral', 'shell'] = 'spring',
        title: str = "Network Graph",
        output_format: Literal['html', 'json'] = 'html'
    ) -> str:
        """
        Visualize a graph interactively
        
        Args:
            nodes: List of Node objects
            edges: List of Edge objects
            directed: Whether the graph is directed
            layout: Layout algorithm to use
            title: Graph title
            output_format: Output format ('html' or 'json')
        
        Returns:
            HTML string or JSON string
        """
        G = self.create_graph(nodes, edges, directed)
        
        # Choose layout algorithm
        if layout == 'spring':
            pos = self.nx.spring_layout(G)
        elif layout == 'circular':
            pos = self.nx.circular_layout(G)
        elif layout == 'kamada_kawai':
            pos = self.nx.kamada_kawai_layout(G)
        elif layout == 'spectral':
            pos = self.nx.spectral_layout(G)
        elif layout == 'shell':
            pos = self.nx.shell_layout(G)
        else:
            pos = self.nx.spring_layout(G)
        
        # Create edge traces
        edge_traces = []
        for edge in G.edges():
            x0, y0 = pos[edge[0]]
            x1, y1 = pos[edge[1]]
            
            edge_trace = self.go.Scatter(
                x=[x0, x1, None],
                y=[y0, y1, None],
                mode='lines',
                line=dict(width=0.5, color='#888'),
                hoverinfo='none',
                showlegend=False
            )
            edge_traces.append(edge_trace)
        
        # Create node trace
        node_x = []
        node_y = []
        node_text = []
        
        for node_id in G.nodes():
            x, y = pos[node_id]
            node_x.append(x)
            node_y.append(y)
            node_text.append(G.nodes[node_id].get('label', node_id))
        
        node_trace = self.go.Scatter(
            x=node_x,
            y=node_y,
            mode='markers+text',
            text=node_text,
            textposition="top center",
            hoverinfo='text',
            marker=dict(
                showscale=True,
                colorscale='YlGnBu',
                size=10,
                colorbar=dict(
                    thickness=15,
                    title='Node Connections',
                    xanchor='left',
                    titleside='right'
                ),
                line_width=2
            )
        )
        
        # Color nodes by degree
        node_adjacencies = []
        for node in G.nodes():
            node_adjacencies.append(len(list(G.neighbors(node))))
        
        node_trace.marker.color = node_adjacencies
        
        # Create figure
        fig = self.go.Figure(data=[*edge_traces, node_trace])
        
        fig.update_layout(
            title=title,
            titlefont_size=16,
            showlegend=False,
            hovermode='closest',
            margin=dict(b=20, l=5, r=5, t=40),
            xaxis=dict(showgrid=False, zeroline=False, showticklabels=False),
            yaxis=dict(showgrid=False, zeroline=False, showticklabels=False)
        )
        
        if output_format == 'html':
            return fig.to_html(full_html=False, include_plotlyjs='cdn')
        else:
            return fig.to_json()
    
    def analyze_centrality(self, nodes: List[Node], edges: List[Edge], directed: bool = False) -> Dict[str, Dict[str, float]]:
        """
        Calculate various centrality metrics
        
        Args:
            nodes: List of Node objects
            edges: List of Edge objects
            directed: Whether the graph is directed
        
        Returns:
            Dictionary of centrality metrics
        """
        G = self.create_graph(nodes, edges, directed)
        
        return {
            'degree_centrality': self.nx.degree_centrality(G),
            'betweenness_centrality': self.nx.betweenness_centrality(G),
            'closeness_centrality': self.nx.closeness_centrality(G),
            'eigenvector_centrality': self.nx.eigenvector_centrality(G, max_iter=1000) if len(G) > 0 else {},
        }
    
    def find_shortest_path(self, nodes: List[Node], edges: List[Edge], source: str, target: str) -> List[str]:
        """
        Find shortest path between two nodes
        
        Args:
            nodes: List of Node objects
            edges: List of Edge objects
            source: Source node ID
            target: Target node ID
        
        Returns:
            List of node IDs in the shortest path
        """
        G = self.create_graph(nodes, edges, False)
        
        try:
            return self.nx.shortest_path(G, source=source, target=target)
        except self.nx.NetworkXNoPath:
            return []
    
    def detect_communities(self, nodes: List[Node], edges: List[Edge]) -> List[List[str]]:
        """
        Detect communities in the graph using Louvain method
        
        Args:
            nodes: List of Node objects
            edges: List of Edge objects
        
        Returns:
            List of communities (each community is a list of node IDs)
        """
        G = self.create_graph(nodes, edges, False)
        
        try:
            import networkx.algorithms.community as nx_comm
            communities = nx_comm.louvain_communities(G)
            return [list(community) for community in communities]
        except ImportError:
            # Fallback to connected components if louvain is not available
            return [list(c) for c in self.nx.connected_components(G)]
    
    def calculate_metrics(self, nodes: List[Node], edges: List[Edge], directed: bool = False) -> Dict[str, Any]:
        """
        Calculate various graph metrics
        
        Args:
            nodes: List of Node objects
            edges: List of Edge objects
            directed: Whether the graph is directed
        
        Returns:
            Dictionary of graph metrics
        """
        G = self.create_graph(nodes, edges, directed)
        
        metrics = {
            'node_count': G.number_of_nodes(),
            'edge_count': G.number_of_edges(),
            'density': self.nx.density(G),
            'average_degree': sum(dict(G.degree()).values()) / G.number_of_nodes() if G.number_of_nodes() > 0 else 0,
        }
        
        # Add connected component metrics for undirected graphs
        if not directed:
            metrics['connected_components'] = self.nx.number_connected_components(G)
            metrics['is_connected'] = self.nx.is_connected(G)
        else:
            metrics['strongly_connected_components'] = self.nx.number_strongly_connected_components(G)
            metrics['weakly_connected_components'] = self.nx.number_weakly_connected_components(G)
            metrics['is_strongly_connected'] = self.nx.is_strongly_connected(G)
        
        # Clustering coefficient
        if not directed:
            metrics['average_clustering'] = self.nx.average_clustering(G)
        
        # Diameter (if connected)
        try:
            if not directed and self.nx.is_connected(G):
                metrics['diameter'] = self.nx.diameter(G)
                metrics['average_shortest_path'] = self.nx.average_shortest_path_length(G)
        except:
            pass
        
        return metrics
    
    def find_cycles(self, nodes: List[Node], edges: List[Edge]) -> List[List[str]]:
        """
        Find all cycles in the graph
        
        Args:
            nodes: List of Node objects
            edges: List of Edge objects
        
        Returns:
            List of cycles (each cycle is a list of node IDs)
        """
        G = self.create_graph(nodes, edges, True)
        
        try:
            cycles = list(self.nx.simple_cycles(G))
            return cycles
        except:
            return []
    
    def minimum_spanning_tree(self, nodes: List[Node], edges: List[Edge]) -> Tuple[List[Node], List[Edge]]:
        """
        Calculate minimum spanning tree
        
        Args:
            nodes: List of Node objects
            edges: List of Edge objects
        
        Returns:
            Tuple of (nodes, edges) in the MST
        """
        G = self.create_graph(nodes, edges, False)
        
        mst = self.nx.minimum_spanning_tree(G)
        
        mst_nodes = [Node(id=n, label=G.nodes[n].get('label', n)) for n in mst.nodes()]
        mst_edges = [Edge(source=e[0], target=e[1], weight=mst[e[0]][e[1]].get('weight', 1.0)) for e in mst.edges()]
        
        return mst_nodes, mst_edges
    
    def export_to_gexf(self, nodes: List[Node], edges: List[Edge], filepath: str, directed: bool = False):
        """
        Export graph to GEXF format (compatible with Gephi)
        
        Args:
            nodes: List of Node objects
            edges: List of Edge objects
            filepath: Output file path
            directed: Whether the graph is directed
        """
        G = self.create_graph(nodes, edges, directed)
        self.nx.write_gexf(G, filepath)
    
    def export_to_graphml(self, nodes: List[Node], edges: List[Edge], filepath: str, directed: bool = False):
        """
        Export graph to GraphML format
        
        Args:
            nodes: List of Node objects
            edges: List of Edge objects
            filepath: Output file path
            directed: Whether the graph is directed
        """
        G = self.create_graph(nodes, edges, directed)
        self.nx.write_graphml(G, filepath)

