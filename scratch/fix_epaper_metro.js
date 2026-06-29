const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'src', 'components', 'epaper', 'EPaperReader.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Remove METRO_EDITIONS definition
const metroDef = `const METRO_EDITIONS = [
  { name: 'Hyderabad Metro', nameTe: 'హైదరాబాద్ మెట్రో', value: 'Hyderabad' },
  { name: 'Karimnagar Metro', nameTe: 'కరీంనగర్ మెట్రో', value: 'Karimnagar' },
  { name: 'Warangal Metro', nameTe: 'వరంగల్ మెట్రో', value: 'Warangal' },
  { name: 'Vijayawada Metro', nameTe: 'విజయవాడ మెట్రో', value: 'Vijayawada' }
];`;
content = content.replace(metroDef, '');

// 2. Remove METRO_EDITIONS from allEditions arrays
content = content.replace(', ...METRO_EDITIONS', '');
content = content.replace(', ...METRO_EDITIONS', ''); // do it twice for both locations!

// 3. Remove metro from customSections filter
content = content.replace(" && s !== 'metro'", "");

// 4. Remove Metro button from subnav menus
const metroNavButton = `              <button 
                onClick={() => {
                  const el = document.getElementById('metro-editions-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="hover:text-yellow-300 transition-colors cursor-pointer"
              >
                Metro
              </button>`;
content = content.replace(metroNavButton, '');

// 5. Remove Metro section from dashboard
const metroSectionHtml = `              {/* Section: METRO EDITIONS */}
              <div id="metro-editions-section" className="flex flex-col text-left">
                <h2 className="text-xl font-black text-[#02599c] tracking-tight uppercase border-b-2 border-[#02599c] pb-1.5 mb-6">
                  Metro Editions
                </h2>
                {renderCarousel('metro-carousel', getEditionsForSection('metro', METRO_EDITIONS))}
                {getEditionsForSection('metro', METRO_EDITIONS).length === 0 && (
                  <div className="text-gray-400 text-sm py-4">No Metro editions match your search.</div>
                )}
              </div>`;
content = content.replace(metroSectionHtml, '');

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully completed E-Paper reader updates for removing metro editions!');
