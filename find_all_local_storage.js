const fs = require('fs');
const path = require('path');

const srcDir = 'c:/Users/AKHIL Kumar/OneDrive/Desktop/NAVASAKAM/src';

function searchDirectory(dir) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      searchDirectory(filePath);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts') || file.endsWith('.js')) {
      const content = fs.readFileSync(filePath, 'utf8');
      if (content.toLowerCase().includes('localstorage')) {
        const lines = content.split('\n');
        lines.forEach((line, idx) => {
          if (line.toLowerCase().includes('localstorage')) {
            // print filename relative to srcDir and line number
            const relativePath = path.relative(srcDir, filePath);
            console.log(`[${relativePath}:${idx + 1}]: ${line.trim()}`);
          }
        });
      }
    }
  });
}

searchDirectory(srcDir);
