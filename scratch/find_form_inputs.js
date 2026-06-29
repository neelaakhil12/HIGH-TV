const fs = require('fs');
const content = fs.readFileSync('c:/Users/AKHIL KUMAR/OneDrive/Desktop/NAVASAKAM/src/app/admin/page.tsx', 'utf8');
const lines = content.split('\n');
lines.forEach((line, i) => {
  if (line.includes('slug') || line.includes('Slug') || line.includes('URL') || line.includes('url') || line.includes('description')) {
    console.log(`Line ${i+1}: ${line.trim()}`);
  }
});
