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
    const rows = await conn.query("SHOW VARIABLES LIKE 'max_allowed_packet'");
    console.log('max_allowed_packet variable:', rows);
  } catch (err) {
    console.error('Error querying max_allowed_packet:', err);
  } finally {
    if (conn) conn.end();
  }
}

main();
