const pg = require("pg");
const pino = require("../logger");

const URL = process.env.DB_URL;
const pool = new pg.Pool({
	connectionString: URL,
	max: Number(process.env.DB_POOL) || 35,
	idleTimeoutMillis: 3000,
	connectionTimeoutMillis: 10000,
	application_name: "Discord BOT",
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

	pino.info(`Database.js -> Creating table "logs" if not exists`);
	pool.query(`
  CREATE TABLE IF NOT EXISTS logs (
    id uuid DEFAULT gen_random_uuid() UNIQUE NOT NULL,
    guild_id TEXT UNIQUE NOT NULL,
    channels text[]
  );
`);

	pino.info(`Database.js -> Creating table "warns" if not exists`);
	pool.query(`
CREATE TABLE IF NOT EXISTS warns (
  id uuid DEFAULT gen_random_uuid() UNIQUE NOT NULL,
  guild_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  reason TEXT,
  staff TEXT NOT NULL,
  timestamp timestamp DEFAULT current_timestamp
);
`);

	pino.info(`Database.js -> Creating table "warn_config" if not exists`);
	pool.query(`
CREATE TABLE IF NOT EXISTS warn_config (
  id uuid DEFAULT gen_random_uuid() UNIQUE NOT NULL,
  guild_id TEXT UNIQUE NOT NULL,
  max_warns INT NOT NULL DEFAULT 0,
  punishment_type INT NOT NULL DEFAULT 0,
  timeout_duration INT NOT NULL DEFAULT 600000
  );
`);

	pino.info(`Database.js -> Creating table "banned_guilds" if not exists`);
	pool.query(`
CREATE TABLE IF NOT EXISTS banned_guilds (
guild_id TEXT NOT NULL UNIQUE,
reason TEXT,
staff TEXT NOT NULL,
banned INT NOT NULL,
timestamp timestamp DEFAULT current_timestamp
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
