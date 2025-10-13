"""
Production Diagram Generation
Supports multiple diagram types and formats
Original implementation by Joshua Terranova
"""

from typing import List, Dict, Optional, Any, Literal
from dataclasses import dataclass


class DiagramGenerator:
    """
    Production diagram generator with support for:
    - Sequence diagrams
    - Class diagrams
    - Entity-relationship diagrams
    - State diagrams
    - Gantt charts
    """
    
    def __init__(self):
        self.diagram_type: Optional[str] = None
        self.content: List[str] = []
    
    def create_sequence_diagram(self) -> 'SequenceDiagram':
        """Create a sequence diagram"""
        return SequenceDiagram()
    
    def create_class_diagram(self) -> 'ClassDiagram':
        """Create a class diagram"""
        return ClassDiagram()
    
    def create_er_diagram(self) -> 'ERDiagram':
        """Create an entity-relationship diagram"""
        return ERDiagram()
    
    def create_state_diagram(self) -> 'StateDiagram':
        """Create a state diagram"""
        return StateDiagram()
    
    def create_gantt_chart(self) -> 'GanttChart':
        """Create a Gantt chart"""
        return GanttChart()


class SequenceDiagram:
    """Sequence diagram builder"""
    
    def __init__(self):
        self.participants: List[str] = []
        self.messages: List[Dict[str, str]] = []
    
    def add_participant(self, name: str):
        """Add a participant"""
        if name not in self.participants:
            self.participants.append(name)
        return self
    
    def message(self, from_participant: str, to_participant: str, message: str):
        """Add a message"""
        self.add_participant(from_participant)
        self.add_participant(to_participant)
        self.messages.append({
            'from': from_participant,
            'to': to_participant,
            'message': message,
            'type': 'solid'
        })
        return self
    
    def async_message(self, from_participant: str, to_participant: str, message: str):
        """Add an async message"""
        self.add_participant(from_participant)
        self.add_participant(to_participant)
        self.messages.append({
            'from': from_participant,
            'to': to_participant,
            'message': message,
            'type': 'async'
        })
        return self
    
    def return_message(self, from_participant: str, to_participant: str, message: str):
        """Add a return message"""
        self.messages.append({
            'from': from_participant,
            'to': to_participant,
            'message': message,
            'type': 'return'
        })
        return self
    
    def note(self, participant: str, text: str, position: Literal['left', 'right'] = 'right'):
        """Add a note"""
        self.messages.append({
            'type': 'note',
            'participant': participant,
            'text': text,
            'position': position
        })
        return self
    
    def to_mermaid(self) -> str:
        """Generate Mermaid.js syntax"""
        lines = ["sequenceDiagram"]
        
        for participant in self.participants:
            lines.append(f"    participant {participant}")
        
        for msg in self.messages:
            if msg.get('type') == 'note':
                lines.append(f"    Note {msg['position']} of {msg['participant']}: {msg['text']}")
            else:
                from_p = msg['from']
                to_p = msg['to']
                text = msg['message']
                
                if msg['type'] == 'async':
                    lines.append(f"    {from_p}--){to_p}: {text}")
                elif msg['type'] == 'return':
                    lines.append(f"    {from_p}-->{to_p}: {text}")
                else:
                    lines.append(f"    {from_p}->>{to_p}: {text}")
        
        return "\n".join(lines)
    
    def to_plantuml(self) -> str:
        """Generate PlantUML syntax"""
        lines = ["@startuml"]
        
        for participant in self.participants:
            lines.append(f"participant {participant}")
        
        for msg in self.messages:
            if msg.get('type') == 'note':
                lines.append(f"note {msg['position']} of {msg['participant']}: {msg['text']}")
            else:
                from_p = msg['from']
                to_p = msg['to']
                text = msg['message']
                
                if msg['type'] == 'async':
                    lines.append(f"{from_p} ->> {to_p}: {text}")
                elif msg['type'] == 'return':
                    lines.append(f"{from_p} --> {to_p}: {text}")
                else:
                    lines.append(f"{from_p} -> {to_p}: {text}")
        
        lines.append("@enduml")
        return "\n".join(lines)


class ClassDiagram:
    """Class diagram builder"""
    
    def __init__(self):
        self.classes: List[Dict[str, Any]] = []
        self.relationships: List[Dict[str, str]] = []
    
    def add_class(self, name: str, attributes: Optional[List[str]] = None, methods: Optional[List[str]] = None):
        """Add a class"""
        self.classes.append({
            'name': name,
            'attributes': attributes or [],
            'methods': methods or []
        })
        return self
    
    def inheritance(self, parent: str, child: str):
        """Add inheritance relationship"""
        self.relationships.append({
            'type': 'inheritance',
            'from': child,
            'to': parent
        })
        return self
    
    def association(self, class1: str, class2: str, label: Optional[str] = None):
        """Add association relationship"""
        self.relationships.append({
            'type': 'association',
            'from': class1,
            'to': class2,
            'label': label or ''
        })
        return self
    
    def composition(self, container: str, component: str):
        """Add composition relationship"""
        self.relationships.append({
            'type': 'composition',
            'from': container,
            'to': component
        })
        return self
    
    def to_mermaid(self) -> str:
        """Generate Mermaid.js syntax"""
        lines = ["classDiagram"]
        
        for cls in self.classes:
            lines.append(f"    class {cls['name']} {{")
            for attr in cls['attributes']:
                lines.append(f"        {attr}")
            for method in cls['methods']:
                lines.append(f"        {method}()")
            lines.append("    }")
        
        for rel in self.relationships:
            if rel['type'] == 'inheritance':
                lines.append(f"    {rel['to']} <|-- {rel['from']}")
            elif rel['type'] == 'association':
                label = f" : {rel['label']}" if rel.get('label') else ""
                lines.append(f"    {rel['from']} --> {rel['to']}{label}")
            elif rel['type'] == 'composition':
                lines.append(f"    {rel['from']} *-- {rel['to']}")
        
        return "\n".join(lines)
    
    def to_plantuml(self) -> str:
        """Generate PlantUML syntax"""
        lines = ["@startuml"]
        
        for cls in self.classes:
            lines.append(f"class {cls['name']} {{")
            for attr in cls['attributes']:
                lines.append(f"  {attr}")
            for method in cls['methods']:
                lines.append(f"  {method}()")
            lines.append("}")
        
        for rel in self.relationships:
            if rel['type'] == 'inheritance':
                lines.append(f"{rel['to']} <|-- {rel['from']}")
            elif rel['type'] == 'association':
                label = f" : {rel['label']}" if rel.get('label') else ""
                lines.append(f"{rel['from']} --> {rel['to']}{label}")
            elif rel['type'] == 'composition':
                lines.append(f"{rel['from']} *-- {rel['to']}")
        
        lines.append("@enduml")
        return "\n".join(lines)


class ERDiagram:
    """Entity-relationship diagram builder"""
    
    def __init__(self):
        self.entities: List[Dict[str, Any]] = []
        self.relationships: List[Dict[str, str]] = []
    
    def add_entity(self, name: str, attributes: Optional[List[str]] = None):
        """Add an entity"""
        self.entities.append({
            'name': name,
            'attributes': attributes or []
        })
        return self
    
    def one_to_one(self, entity1: str, entity2: str, label: Optional[str] = None):
        """Add one-to-one relationship"""
        self.relationships.append({
            'type': '1:1',
            'from': entity1,
            'to': entity2,
            'label': label or ''
        })
        return self
    
    def one_to_many(self, one: str, many: str, label: Optional[str] = None):
        """Add one-to-many relationship"""
        self.relationships.append({
            'type': '1:N',
            'from': one,
            'to': many,
            'label': label or ''
        })
        return self
    
    def many_to_many(self, entity1: str, entity2: str, label: Optional[str] = None):
        """Add many-to-many relationship"""
        self.relationships.append({
            'type': 'N:M',
            'from': entity1,
            'to': entity2,
            'label': label or ''
        })
        return self
    
    def to_mermaid(self) -> str:
        """Generate Mermaid.js syntax"""
        lines = ["erDiagram"]
        
        for entity in self.entities:
            lines.append(f"    {entity['name']} {{")
            for attr in entity['attributes']:
                lines.append(f"        string {attr}")
            lines.append("    }")
        
        for rel in self.relationships:
            label = rel.get('label', '')
            if rel['type'] == '1:1':
                lines.append(f"    {rel['from']} ||--|| {rel['to']} : {label}")
            elif rel['type'] == '1:N':
                lines.append(f"    {rel['from']} ||--o{{ {rel['to']} : {label}")
            elif rel['type'] == 'N:M':
                lines.append(f"    {rel['from']} }}o--o{{ {rel['to']} : {label}")
        
        return "\n".join(lines)


class StateDiagram:
    """State diagram builder"""
    
    def __init__(self):
        self.states: List[str] = []
        self.transitions: List[Dict[str, str]] = []
    
    def add_state(self, name: str):
        """Add a state"""
        if name not in self.states:
            self.states.append(name)
        return self
    
    def transition(self, from_state: str, to_state: str, label: Optional[str] = None):
        """Add a transition"""
        self.add_state(from_state)
        self.add_state(to_state)
        self.transitions.append({
            'from': from_state,
            'to': to_state,
            'label': label or ''
        })
        return self
    
    def to_mermaid(self) -> str:
        """Generate Mermaid.js syntax"""
        lines = ["stateDiagram-v2"]
        lines.append("    [*] --> " + (self.states[0] if self.states else "End"))
        
        for trans in self.transitions:
            label = f" : {trans['label']}" if trans['label'] else ""
            lines.append(f"    {trans['from']} --> {trans['to']}{label}")
        
        if self.states:
            lines.append(f"    {self.states[-1]} --> [*]")
        
        return "\n".join(lines)


class GanttChart:
    """Gantt chart builder"""
    
    def __init__(self):
        self.title: str = "Gantt Chart"
        self.sections: List[Dict[str, Any]] = []
    
    def set_title(self, title: str):
        """Set chart title"""
        self.title = title
        return self
    
    def add_section(self, name: str):
        """Add a section"""
        self.sections.append({
            'name': name,
            'tasks': []
        })
        return self
    
    def add_task(self, name: str, start: str, duration: str, status: Optional[str] = None):
        """Add a task to the current section"""
        if self.sections:
            self.sections[-1]['tasks'].append({
                'name': name,
                'start': start,
                'duration': duration,
                'status': status or 'active'
            })
        return self
    
    def to_mermaid(self) -> str:
        """Generate Mermaid.js syntax"""
        lines = ["gantt"]
        lines.append(f"    title {self.title}")
        lines.append("    dateFormat YYYY-MM-DD")
        
        for section in self.sections:
            lines.append(f"    section {section['name']}")
            for task in section['tasks']:
                lines.append(f"    {task['name']} :{task['status']}, {task['start']}, {task['duration']}")
        
        return "\n".join(lines)

