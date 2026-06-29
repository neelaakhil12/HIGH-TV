const fs = require('fs');
const content = fs.readFileSync('c:/Users/AKHIL KUMAR/OneDrive/Desktop/NAVASAKAM/src/app/admin/page.tsx', 'utf8');
const lines = content.split('\n');
lines.forEach((line, i) => {
  if (line.includes('title') && (line.includes('setTitle') || line.includes('onChange') || line.includes('input') || line.includes('placeholder'))) {
    if (i < 5000) console.log(`Line ${i+1}: ${line.trim()}`);
  }
});
