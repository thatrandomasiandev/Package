# Code Visualizer

A powerful VSCode extension that converts code into visual representations, making it easier to understand code structure and flow.

## Features

- **Code Flow Charts**: Generate interactive flowcharts showing code execution paths
- **Code Structure Trees**: Visualize hierarchical code structure with expandable tree views
- **Multi-language Support**: Works with JavaScript, TypeScript, Python, Java, and more
- **Interactive Visualizations**: Click and explore your code structure visually
- **Context Menu Integration**: Right-click in editor to access visualization commands
- **Beautiful UI**: Modern, responsive design with color-coded elements

## Installation

### Development

1. Clone this repository
2. Run `npm install` to install dependencies
3. Press `F5` to run the extension in a new Extension Development Host window
4. Open the Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P`)
5. Type "Hello World" and select the command

### Building

1. Run `npm run compile` to build the extension
2. Use `vsce package` to create a `.vsix` file for distribution

## Usage

### Flow Chart Visualization
1. Open any code file (JavaScript, TypeScript, Python, Java, etc.)
2. Right-click in the editor and select "Show Code Flow Chart"
3. Or use Command Palette (`Ctrl+Shift+P`) → "Code Visualizer: Show Code Flow Chart"
4. An interactive flow chart will open showing your code's execution flow

### Structure Visualization
1. Open any code file
2. Right-click in the editor and select "Show Code Structure"
3. Or use Command Palette (`Ctrl+Shift+P`) → "Code Visualizer: Show Code Structure"
4. A hierarchical tree view will open showing your code's organization

### Features
- **Color-coded elements**: Functions (green), Classes (blue), Conditions (orange), Loops (purple), Variables (gray)
- **Interactive diagrams**: Click on elements to see details
- **Statistics**: View counts of functions, classes, variables, and more
- **Line numbers**: See where each element is located in your code

## Development

This extension is built with TypeScript and follows VSCode extension development best practices.

### Project Structure

```
├── src/
│   └── extension.ts          # Main extension entry point
├── out/                      # Compiled JavaScript (generated)
├── package.json              # Extension manifest
├── tsconfig.json            # TypeScript configuration
└── README.md                # This file
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT
