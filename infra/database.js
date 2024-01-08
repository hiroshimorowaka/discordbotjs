const pg = require("pg");
const pino = require('../logger')

const URL = process.env.DB_URL;
const pool = new pg.Pool({
  connectionString: URL,
  max: Number(process.env.DB_POOL) || 35,
  idleTimeoutMillis: 3000,
  connectionTimeoutMillis: 10000,
  application_name: 'Discord BOT'
});

pool.once("connect", () => {
  pino.info(`Database.js -> Connected  to database: ${process.env.POSTGRES_DB}`);
  pino.info(`Database.js -> Creating table "users" if not exists`);
  pool.query(`

      CREATE TABLE IF NOT EXISTS birthdays (
          user_id TEXT UNIQUE NOT NULL,
          birthday DATE NOT NULL
      );
      `);
  pino.info(`Database.js -> Creating table "banned_words" if not exists`);
  pool.query(`
    CREATE TABLE IF NOT EXISTS banned_words (
      guild_id TEXT UNIQUE NOT NULL,
      words text[]
    );
  `);
});

async function connect() {
  try {
    await pool.connect();
  } catch (err) {
    pino.error(`Database.js -> Error on connecting to PG pool: ${err}`);
  }
}

async function query(queryObject, queryParam) {
  const result = await pool.query(queryObject, queryParam);
  return result;
}

connect();

module.exports = {
  query,
};
