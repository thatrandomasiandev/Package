// Code Lab Demo - Like Google Colab but for any file!
// Select code sections and right-click to execute them

// 1. Basic Math and Variables
const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const doubled = numbers.map(n => n * 2);
console.log('Original numbers:', numbers);
console.log('Doubled:', doubled);

// 2. Data Generation and Visualization
function generateRandomData(n = 20) {
    return Array.from({length: n}, (_, i) => ({
        x: i,
        y: Math.sin(i * 0.3) * 50 + Math.random() * 20
    }));
}

const timeSeriesData = generateRandomData(30);
console.log('Generated time series data:', timeSeriesData.length, 'points');

// 3. Create a line chart
plot(timeSeriesData, {title: 'Sine Wave with Noise'});

// 4. Statistical Analysis
const values = [23, 45, 67, 89, 12, 34, 56, 78, 90, 11];
const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
const max = Math.max(...values);
const min = Math.min(...values);

console.log('Statistics:');
console.log('Mean:', mean.toFixed(2));
console.log('Max:', max);
console.log('Min:', min);

// 5. Create a bar chart
barChart(values, {title: 'Random Values'});

// 6. Function Definition and Execution
function fibonacci(n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}

// Execute the function for multiple values
const fibResults = [];
for (let i = 0; i <= 10; i++) {
    fibResults.push({x: i, y: fibonacci(i)});
}

console.log('Fibonacci sequence:', fibResults);
plot(fibResults, {title: 'Fibonacci Sequence'});

// 7. Data Processing
const salesData = [
    {month: 'Jan', sales: 1200, profit: 300},
    {month: 'Feb', sales: 1500, profit: 400},
    {month: 'Mar', sales: 1800, profit: 500},
    {month: 'Apr', sales: 1600, profit: 450},
    {month: 'May', sales: 2000, profit: 600}
];

// Calculate profit margins
salesData.forEach(item => {
    item.profitMargin = (item.profit / item.sales * 100).toFixed(1);
});

console.log('Sales Data with Profit Margins:');
console.table(salesData);

// 8. Create pie chart for sales
const salesValues = salesData.map(item => item.sales);
const salesLabels = salesData.map(item => item.month);
pieChart(salesData.map(item => ({label: item.month, value: item.sales})), {title: 'Monthly Sales'});

// 9. Complex Data Analysis
function analyzeTrend(data) {
    const n = data.length;
    const sumX = data.reduce((sum, item) => sum + item.x, 0);
    const sumY = data.reduce((sum, item) => sum + item.y, 0);
    const sumXY = data.reduce((sum, item) => sum + (item.x * item.y), 0);
    const sumXX = data.reduce((sum, item) => sum + (item.x * item.x), 0);
    
    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;
    
    return {slope, intercept, correlation: Math.abs(slope)};
}

const trend = analyzeTrend(timeSeriesData);
console.log('Trend Analysis:', trend);

// 10. Advanced Visualization
const scatterData = generateRandomData(50);
scatterPlot(scatterData, {title: 'Random Scatter Plot'});

// 11. Histogram
const randomValues = Array.from({length: 1000}, () => Math.random() * 100);
histogram(randomValues, {title: 'Random Values Distribution'});

console.log('Demo completed! Check the output panel for all results and charts.');

