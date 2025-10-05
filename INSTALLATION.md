# Installation Guide

## Quick Start

1. **Open the project in VSCode**
   ```bash
   code .
   ```

2. **Install dependencies** (if not already done)
   ```bash
   npm install
   ```

3. **Compile the TypeScript**
   ```bash
   npm run compile
   ```

4. **Run the extension**
   - Press `F5` or go to Run > Start Debugging
   - This will open a new "Extension Development Host" window
   - In the new window, press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac)
   - Type "Hello World" and select the command
   - You should see a notification appear!

## Development Workflow

1. **Make changes** to `src/extension.ts`
2. **Recompile** with `npm run compile` or run `npm run watch` for automatic recompilation
3. **Reload** the Extension Development Host window (`Ctrl+R` or `Cmd+R`)
4. **Test** your changes

## Building for Distribution

1. **Install vsce** (Visual Studio Code Extension manager)
   ```bash
   npm install -g @vscode/vsce
   ```

2. **Package the extension**
   ```bash
   vsce package
   ```

3. **Install the .vsix file**
   - In VSCode, go to Extensions
   - Click the "..." menu and select "Install from VSIX..."
   - Select your generated .vsix file

## Troubleshooting

- If you get permission errors, try using `npx` instead of global installs
- Make sure Node.js and npm are properly installed
- Check that the `out/extension.js` file exists after compilation
