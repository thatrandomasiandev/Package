// Sample JavaScript code for testing the Code Visualizer extension

class Calculator {
    constructor() {
        this.history = [];
    }

    add(a, b) {
        const result = a + b;
        this.history.push(`Added ${a} + ${b} = ${result}`);
        return result;
    }

    subtract(a, b) {
        const result = a - b;
        this.history.push(`Subtracted ${a} - ${b} = ${result}`);
        return result;
    }

    multiply(a, b) {
        if (a === 0 || b === 0) {
            return 0;
        }
        const result = a * b;
        this.history.push(`Multiplied ${a} * ${b} = ${result}`);
        return result;
    }

    divide(a, b) {
        if (b === 0) {
            throw new Error('Division by zero');
        }
        return a / b;
    }

    getHistory() {
        return this.history;
    }
}

function processNumbers(numbers) {
    const calculator = new Calculator();
    const results = [];

    for (let i = 0; i < numbers.length; i++) {
        const num = numbers[i];
        
        if (num % 2 === 0) {
            const doubled = calculator.multiply(num, 2);
            results.push(doubled);
        } else {
            const squared = calculator.multiply(num, num);
            results.push(squared);
        }
    }

    return {
        results: results,
        history: calculator.getHistory()
    };
}

const sampleNumbers = [1, 2, 3, 4, 5];
const processed = processNumbers(sampleNumbers);

console.log('Results:', processed.results);
console.log('History:', processed.history);
