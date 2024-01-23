const pg = require("pg");
const pino = require("../logger");
const { createTables } = require("./create_tables");

const URL = process.env.DB_URL;
const node_env = process.env.NODE_ENV ?? "development";

const pool = new pg.Pool({
	connectionString: URL,
	max: Number(process.env.DB_POOL) || 35,
	idleTimeoutMillis: 3000,
	connectionTimeoutMillis: 10000,
	application_name: "Discord BOT",
});

pool.once("connect", () => {
	pino.info(
		`Database.js -> Connected to database: ${process.env.DB_URL.split(
			"/",
		).pop()}\nNode ENV: ${node_env}\nPool Size: ${Number(process.env.DB_POOL || 35)}`,
	);
	createTables(pool);
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
