const fs = require('fs');
const content = fs.readFileSync('c:/Users/AKHIL KUMAR/OneDrive/Desktop/NAVASAKAM/src/components/epaper/EPaperReader.tsx', 'utf8');
const lines = content.split('\n');
lines.forEach((line, i) => {
  if (line.includes('getEditionsForSection') || line.includes('getCustomSectionPapers') || line.includes('MAIN_EDITIONS')) {
    console.log(`Line ${i+1}: ${line.trim()}`);
  }
});
