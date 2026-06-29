const mariadb = require('mariadb');

const config = {
  host: '13.201.118.106',
  port: 3306,
  user: 'hightv_user',
  password: 'Hightv@2026',
  database: 'hightv_db',
  connectionLimit: 1,
  allowPublicKeyRetrieval: true,
};

async function main() {
  let conn;
  try {
    conn = await mariadb.createConnection(config);
    // Create a 2MB dummy string
    const largeString = 'a'.repeat(2 * 1024 * 1024);
    const res = await conn.query(
      "INSERT INTO Epaper (id, title, date, pdfUrl, section, createdAt) VALUES (?, ?, ?, ?, ?, ?)",
      ['test-id-large', 'Test Title', '2026-06-28', largeString, 'main', new Date()]
    );
    console.log('Successfully inserted large record:', res);
    
    // Clean up
    await conn.query("DELETE FROM Epaper WHERE id = 'test-id-large'");
    console.log('Cleaned up test record.');
  } catch (err) {
    console.error('Error inserting large record:', err);
  } finally {
    if (conn) conn.end();
  }
}

main();
