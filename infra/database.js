const pg = require("pg");

const URL = process.env.DB_URL;
const pool = new pg.Pool({
  connectionString: URL,
  max: Number(process.env.DB_POOL) || 35,
  idleTimeoutMillis: 3000,
  connectionTimeoutMillis: 10000,
});

pool.once("connect", () => {
  console.log(`Database.js: Connected  to db ${URL}`);
  console.log(`Database.js: Creating table "users" if not exists`);
  pool.query(`

      CREATE TABLE IF NOT EXISTS birthdays (
          user_id TEXT UNIQUE NOT NULL,
          birthday DATE NOT NULL
      );
      `);
  console.log(`Database.js: Creating table "banned_words" if not exists`);
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
    console.log(`Database.js: Error on connecting to PG pool: ${err}`);
  }
}

async function query(queryObject, queryParam) {
  const result = await pool.query(queryObject, queryParam);
  return result;
}

async function registerGuild(guild_id) {
  return await query(
    "INSERT INTO banned_words (guild_id) VALUES($1) ON CONFLICT (guild_id) DO NOTHING;",
    [guild_id],
  );
}

connect();

module.exports = {
  query,
  registerGuild,
};
