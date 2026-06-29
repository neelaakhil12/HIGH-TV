const fs = require('fs');
const content = fs.readFileSync('c:/Users/AKHIL KUMAR/OneDrive/Desktop/NAVASAKAM/src/components/epaper/EPaperReader.tsx', 'utf8');
const lines = content.split('\n');
lines.forEach((line, i) => {
  if (line.includes('useEffect') || line.includes('epaper') || line.includes('edition') || line.includes('Edition') || line.includes('pdfUrl') || line.includes('section')) {
    if (i < 500) console.log(`Line ${i+1}: ${line.trim()}`);
  }
});
