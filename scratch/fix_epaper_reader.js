const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'src', 'components', 'epaper', 'EPaperReader.tsx');
let content = fs.readFileSync(filePath, 'utf8');

const targetRegex = /const currentHost = typeof window !== 'undefined' \? window\.location\.origin : 'https:\/\/hightv\.in';\s*const clipLink = \$\{currentHost\}\/category\/epaper\?view=article&date=&edition=&page=&articleId=;\s*const getEditionDisplayName = \(editionVal: string\) => \{\s*const allEditions = \[\.\.\.MAIN_EDITIONS, \.\.\.AP_EDITIONS, \.\.\.TG_EDITIONS\];\s*const found = allEditions\.find\(ed => ed\.value === editionVal\);\s*return found \? `\$\{found\.nameTe\} \(\$\{found\.name\}\)` : editionVal;\s*\};/g;

const replacement = `const currentHost = typeof window !== 'undefined' ? window.location.origin : 'https://hightv.in';
          const clipLink = \`\${currentHost}/category/epaper?view=article&date=\${selectedDate}&edition=\${selectedEdition}&page=\${activePageIdx + 1}&articleId=\${activeArticle.id}\`;
          const getEditionDisplayName = (editionVal: string) => {
            const allEditions = [...MAIN_EDITIONS, ...AP_EDITIONS, ...TG_EDITIONS];
            const found = allEditions.find(ed => ed.value === editionVal);
            return found ? \`\${found.nameTe} (\${found.name})\` : editionVal;
          };`;

if (content.includes('const clipLink = ${currentHost}/category/epaper?view=article&date=&edition=&page=&articleId=;')) {
  // Let's do a direct string replace instead of regex to avoid any regex escape errors!
  const directTarget = `          const currentHost = typeof window !== 'undefined' ? window.location.origin : 'https://hightv.in';
          const clipLink = \`\${currentHost}/category/epaper?view=article&date=&edition=&page=&articleId=\`;
          const getEditionDisplayName = (editionVal: string) => {
            const allEditions = [...MAIN_EDITIONS, ...AP_EDITIONS, ...TG_EDITIONS];
            const found = allEditions.find(ed => ed.value === editionVal);
          


             return found ? \`\${found.nameTe} (\${found.name})\` : editionVal;
          };`;
  
  // Let's just find the start line and end line index and replace it.
  const startMarker = "const currentHost = typeof window !== 'undefined' ? window.location.origin : 'https://hightv.in';";
  const endMarker = "return found ? `${found.nameTe} (${found.name})` : editionVal;\r\n          };";
  const startMarkerLf = "const currentHost = typeof window !== 'undefined' ? window.location.origin : 'https://hightv.in';";
  const endMarkerLf = "return found ? `${found.nameTe} (${found.name})` : editionVal;\n          };";
  
  let startIdx = content.indexOf(startMarker);
  // Find the second occurrence since the first is at line 945!
  if (startIdx !== -1) {
    startIdx = content.indexOf(startMarker, startIdx + startMarker.Length);
  }
  
  let endIdx = content.indexOf(endMarker);
  if (endIdx === -1) {
    endIdx = content.indexOf(endMarkerLf);
  }
  // Find second occurrence of endMarker
  if (endIdx !== -1) {
    let firstEnd = content.indexOf(endMarker);
    if (firstEnd === -1) firstEnd = content.indexOf(endMarkerLf);
    endIdx = content.indexOf(endMarker, firstEnd + 5);
    if (endIdx === -1) endIdx = content.indexOf(endMarkerLf, firstEnd + 5);
  }
  
  if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
    const before = content.substring(0, startIdx);
    const after = content.substring(endIdx + (content.includes('\r\n') ? endMarker.length : endMarkerLf.length));
    content = before + replacement + after;
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Successfully fixed EPaperReader.tsx!');
  } else {
    console.log('Markers not found or indices invalid.', { startIdx, endIdx });
  }
} else {
  console.log('Target text not found in file.');
}
