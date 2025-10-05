# My VSCode Extension

A sample VSCode extension that demonstrates basic functionality.

## Features

- Simple "Hello World" command
- Easy to extend and customize

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

1. Open the Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P`)
2. Type "Hello World" and select the command
3. A notification will appear with "Hello World from My VSCode Extension!"

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
