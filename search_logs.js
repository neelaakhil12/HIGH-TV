const fs = require('fs');
const readline = require('readline');
const path = require('path');

const logPath = 'C:\\Users\\AKHIL KUMAR\\.gemini\\antigravity-ide\\brain\\d8913459-7a58-426a-b98f-a9ace966bcd7\\.system_generated\\logs\\transcript.jsonl';

async function search() {
  const fileStream = fs.createReadStream(logPath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  let index = 0;
  for await (const line of rl) {
    if (line.includes('team-manager') || line.includes('teamFormMode')) {
      console.log(`LINE ${index} MATCHED`);
      // print first 500 chars
      console.log(line.slice(0, 800));
      console.log('\n-------------------\n');
    }
    index++;
  }
}

search().catch(console.error);
