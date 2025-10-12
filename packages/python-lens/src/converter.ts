/**
 * Python to JavaScript converter utilities
 */

export class PythonToJSConverter {
  /**
   * Convert simple Python code to JavaScript
   * Note: This is a basic converter for demonstration purposes
   */
  convert(pythonCode: string): string {
    let jsCode = pythonCode;

    // Convert print to console.log
    jsCode = jsCode.replace(/print\((.*?)\)/g, 'console.log($1)');

    // Convert def to function
    jsCode = jsCode.replace(/def\s+(\w+)\s*\((.*?)\):/g, 'function $1($2) {');

    // Convert True/False to true/false
    jsCode = jsCode.replace(/\bTrue\b/g, 'true');
    jsCode = jsCode.replace(/\bFalse\b/g, 'false');

    // Convert None to null
    jsCode = jsCode.replace(/\bNone\b/g, 'null');

    // Convert elif to else if
    jsCode = jsCode.replace(/elif\s+/g, 'else if ');

    // Add closing braces (simple heuristic based on indentation changes)
    const lines = jsCode.split('\n');
    const result: string[] = [];
    let prevIndent = 0;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const indent = line.search(/\S/);
      
      if (indent < prevIndent && prevIndent > 0) {
        const diff = Math.floor((prevIndent - indent) / 4);
        for (let j = 0; j < diff; j++) {
          result.push(' '.repeat(indent) + '}');
        }
      }

      result.push(line.replace(/:$/, ' {'));
      prevIndent = indent;
    }

    // Close remaining braces
    while (prevIndent > 0) {
      result.push('}');
      prevIndent -= 4;
    }

    return result.join('\n');
  }
}

