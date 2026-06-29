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
    const res = await conn.query('DELETE FROM Epaper');
    console.log('Successfully cleared all epaper records:', res);
  } catch (err) {
    console.error('Error clearing epapers:', err);
  } finally {
    if (conn) conn.end();
  }
}

main();
