const fs = require('fs');
const filePath = 'src/app/admin/page.tsx';
let content = fs.readFileSync(filePath, 'utf8');

// Find the anchor: the grid closing div before the outer closing divs of the scope section
// Pattern: </div>\n                        </div>\n                      </div>\n\n                      {/* Options Input Fields
const anchor = '</div>\n                      </div>\n\n                      {/* Options Input Fields';
const insertIdx = content.indexOf(anchor);
if (insertIdx < 0) {
  console.log('Anchor not found!');
  // Try to find the options input fields comment directly
  const alt = content.indexOf('{/* Options Input Fields');
  console.log('Options comment at:', alt);
  // Show what's around it
  console.log(content.slice(Math.max(0, alt - 200), alt + 50));
  process.exit(1);
}

const hintBlock = `\n                          {/* Scope hint */}\n                          <div className={\`mt-2 px-3 py-2 rounded-lg text-[10px] font-bold border \${pollScope === 'general' ? 'bg-sky-50 border-sky-200 text-sky-700' : 'bg-amber-50 border-amber-200 text-amber-700'}\`}>\n                            {pollScope === 'general' ? '\uD83C\uDF10 \u0c08 \u0c2a\u0c4b\u0c32\u0c4d \u0c05\u0c28\u0c4d\u0c28\u0c3f \u0c2a\u0c47\u0c1c\u0c40\u0c32 \u0c38\u0c48\u0c21\u0c4d\u200c\u0c2c\u0c3e\u0c30\u0c4d\u200c\u0c32\u0c4b \u0c15\u0c28\u0c3f\u0c2a\u0c3f\u0c38\u0c4d\u0c24\u0c41\u0c02\u0c26\u0c3f (\u0c39\u0c4b\u0c2e\u0c4d, \u0c15\u0c47\u0c1f\u0c17\u0c30\u0c40 \u0c2a\u0c47\u0c1c\u0c40\u0c32\u0c41)' : '\uD83D\uDCC4 \u0c08 \u0c2a\u0c4b\u0c32\u0c4d \u0c15\u0c47\u0c35\u0c32\u0c02 \u0c35\u0c3e\u0c30\u0c4d\u0c24\u0c3e \u0c15\u0c25\u0c28 \u0c2a\u0c47\u0c1c\u0c40\u0c32\u0c32\u0c4b \u0c2e\u0c3e\u0c24\u0c4d\u0c30\u0c2e\u0c47 \u0c15\u0c28\u0c3f\u0c2a\u0c3f\u0c38\u0c4d\u0c24\u0c41\u0c02\u0c26\u0c3f'}\n                          </div>`;

// Insert before the outer scope closing divs and before Options section
const insertBefore = '\n\n                      {/* Options Input Fields';
const pos = content.indexOf(insertBefore, insertIdx);
if (pos < 0) {
  console.log('Insert position not found!');
  process.exit(1);
}

content = content.slice(0, pos) + hintBlock + content.slice(pos);
fs.writeFileSync(filePath, content, 'utf8');
console.log('SUCCESS: Scope hint added!');
