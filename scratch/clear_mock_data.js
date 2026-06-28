const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'src', 'lib', 'mockData.ts');
if (!fs.existsSync(filePath)) {
  console.error('File not found:', filePath);
  process.exit(1);
}

let content = fs.readFileSync(filePath, 'utf8');

// Match: export const <name>: NewsArticle[] = [ ... ];
// We use a regex that matches until the ending ];
const regex = /export const (\w+): NewsArticle\[\] = \[[^]*?\];/g;
const updatedContent = content.replace(regex, 'export const $1: NewsArticle[] = [];');

if (content === updatedContent) {
  console.log('No matches found. Check if the format is correct.');
} else {
  fs.writeFileSync(filePath, updatedContent, 'utf8');
  console.log('Successfully cleared all mock news article arrays in mockData.ts!');
}
