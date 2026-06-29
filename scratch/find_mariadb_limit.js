const mariadb = require('mariadb');

async function findLimit() {
  const pool = mariadb.createPool({
    host: '13.201.118.106',
    port: 3306,
    user: 'hightv_user',
    password: 'Hightv@2026',
    database: 'hightv_db',
    maxAllowedPacket: 67108864,
  });

  for (let sizeMb of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]) {
    const conn = await pool.getConnection();
    const hugeString = 'data:application/pdf;base64,' + 'C'.repeat(sizeMb * 1024 * 1024);
    const id = 'test-limit-' + sizeMb;

    try {
      const escapedPdf = hugeString.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
      const sql = `INSERT INTO Epaper (id, title, date, pdfUrl, section, createdAt) VALUES ('${id}', 'Test Size ${sizeMb}MB', '2026-06-28', '${escapedPdf}', 'main', NOW())`;
      await conn.query(sql);
      console.log(`✅ Size ${sizeMb}MB SUCCEEDED!`);
      await conn.query(`DELETE FROM Epaper WHERE id = '${id}'`);
    } catch (err) {
      console.error(`❌ Size ${sizeMb}MB FAILED:`, err.message);
      conn.release();
      break;
    }
    conn.release();
  }

  await pool.end();
}

findLimit();
