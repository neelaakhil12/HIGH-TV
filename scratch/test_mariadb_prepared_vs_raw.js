const mariadb = require('mariadb');

async function testRaw() {
  const pool = mariadb.createPool({
    host: '13.201.118.106',
    port: 3306,
    user: 'hightv_user',
    password: 'Hightv@2026',
    database: 'hightv_db',
    maxAllowedPacket: 67108864,
  });

  const hugeString = 'data:application/pdf;base64,' + 'B'.repeat(12 * 1024 * 1024); // 12MB string

  try {
    const conn = await pool.getConnection();
    const id = 'test-raw-' + Date.now();
    
    console.log('Attempting raw string query (non-parameterized)...');
    // Escape single quotes and backslashes for safety
    const escapedPdf = hugeString.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
    const escapedTitle = "Test Title".replace(/'/g, "\\'");
    
    const sql = `INSERT INTO Epaper (id, title, date, pdfUrl, section, createdAt) VALUES ('${id}', '${escapedTitle}', '2026-06-28', '${escapedPdf}', 'main', NOW())`;
    
    await conn.query(sql);
    console.log('Raw string insert SUCCEEDED!');
    
    await conn.query(`DELETE FROM Epaper WHERE id = '${id}'`);
    console.log('Cleaned up.');

    conn.release();
  } catch (err) {
    console.error('Raw insert FAILED:', err.message);
  } finally {
    await pool.end();
  }
}

testRaw();
