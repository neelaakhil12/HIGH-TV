const fs = require('fs');
const content = fs.readFileSync('c:/Users/AKHIL KUMAR/OneDrive/Desktop/NAVASAKAM/src/app/admin/page.tsx', 'utf8');
const lines = content.split('\n');
lines.slice(300, 950).forEach((line, i) => {
  if (line.includes('const [') && line.includes('useState')) {
    console.log(`Line ${301+i}: ${line.trim()}`);
  }
});
