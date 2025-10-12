# Build Instructions for Code Lab

**Project by Joshua Terranova**

## Prerequisites

- Node.js 16.x or higher
- npm 7.x or higher
- TypeScript 4.9.x or higher

## Building the Monorepo

### 1. Install Dependencies

```bash
npm install
```

### 2. Build All Packages

You need to build packages in the correct order due to dependencies:

```bash
# Build core packages first
cd packages/code-lab-parser-core && npm run build && cd ../..
cd packages/code-lab-execution-engine && npm install && npm run build && cd ../..
cd packages/code-lab-visualizers && npm install && npm run build && cd ../..

# Build language parsers
cd packages/code-lab-python-parser && npm install && npm run build && cd ../..
cd packages/code-lab-java-parser && npm install && npm run build && cd ../..
cd packages/code-lab-rust-parser && npm install && npm run build && cd ../..

# Build visualization extensions
cd packages/code-lab-mermaid && npm install && npm run build && cd ../..
cd packages/code-lab-d3-visualizer && npm install && npm run build && cd ../..
cd packages/code-lab-charts && npm install && npm run build && cd ../..

# Build developer tools
cd packages/code-lab-testing && npm install && npm run build && cd ../..
cd packages/code-lab-profiler && npm install && npm run build && cd ../..
cd packages/code-lab-debugger && npm install && npm run build && cd ../..

# Build UI packages
cd packages/code-lab-themes && npm install && npm run build && cd ../..
cd packages/code-lab-components && npm install && npm run build && cd ../..

# Build integrations
cd packages/code-lab-jupyter && npm install && npm run build && cd ../..
cd packages/code-lab-git-integration && npm install && npm run build && cd ../..
cd packages/code-lab-ai-assistant && npm install && npm run build && cd ../..

# Build utilities
cd packages/code-lab-snippets && npm install && npm run build && cd ../..
cd packages/code-lab-export && npm install && npm run build && cd ../..
cd packages/code-lab-collaboration && npm install && npm run build && cd ../..
```

### 3. Build Main Extension

```bash
npm run compile
```

## Running the Extension

1. Open the project in VS Code
2. Press `F5` to start debugging
3. A new VS Code window will open with the extension loaded

## Package Development

### Watch Mode for a Single Package

```bash
cd packages/code-lab-<package-name>
npm run watch
```

### Adding a New Package

1. Create package directory: `mkdir -p packages/code-lab-new-package/src`
2. Create `package.json` with appropriate dependencies
3. Create `tsconfig.json` using the template from other packages
4. Implement your package in `src/`
5. Build and test

## Testing

Each package can have its own tests. Run tests with:

```bash
cd packages/code-lab-<package-name>
npm test
```

## Packaging for Distribution

```bash
# Install VSCE if not already installed
npm install -g @vscode/vsce

# Package the extension
vsce package
```

This will create a `.vsix` file that can be installed in VS Code or published to the marketplace.

## Development Tips

1. **Link Local Packages**: Use `npm link` to test packages locally
2. **Watch Mode**: Run `npm run watch` in package directories during development
3. **Clean Build**: Remove `dist/` folders and rebuild if you encounter issues
4. **Incremental Builds**: TypeScript will only recompile changed files

## Troubleshooting

### "Cannot find module" errors
- Make sure all packages are built
- Check that dependencies in `package.json` are correct
- Run `npm install` in the affected package

### Type errors
- Ensure all packages have generated `.d.ts` files in their `dist/` folders
- Rebuild packages in dependency order

### Extension not loading
- Check the Debug Console for errors
- Verify `out/` directory contains compiled JavaScript
- Run `npm run compile` in the root directory

## Project Structure

All code is original work by Joshua Terranova. No third-party implementations are integrated beyond standard npm dependencies for utilities.

## License

MIT - Created by Joshua Terranova

