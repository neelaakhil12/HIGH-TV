const mariadb = require('mariadb');

async function testOptions() {
  const pool1 = mariadb.createPool({
    host: '13.201.118.106',
    port: 3306,
    user: 'hightv_user',
    password: 'Hightv@2026',
    database: 'hightv_db',
    maxAllowedPacket: 67108864,
  });

  try {
    const conn = await pool1.getConnection();
    console.log('Connected successfully with maxAllowedPacket!');
    const rows = await conn.query("SHOW VARIABLES LIKE 'max_allowed_packet'");
    console.log('Server max_allowed_packet:', rows);
    conn.release();
  } catch (err) {
    console.error('Error with pool1:', err);
  } finally {
    await pool1.end();
  }
}

testOptions();
