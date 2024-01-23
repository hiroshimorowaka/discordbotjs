const pino = require("../logger");

async function createTables(pool) {
	const startTime = performance.now();

	pino.info("Database.js -> Creating tables if not exists");

	pool.query(`

  begin;

CREATE TABLE IF NOT EXISTS banned_words (
	guild_id TEXT UNIQUE NOT NULL,
	words text[]
  );

  CREATE TABLE IF NOT EXISTS warns (
    id uuid DEFAULT gen_random_uuid() UNIQUE NOT NULL,
    guild_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    reason TEXT,
    staff TEXT NOT NULL,
    timestamp timestamp DEFAULT current_timestamp
  );
  
  CREATE INDEX IF NOT EXISTS idx_warns_guildid ON public.warns USING btree (guild_id);
  
  CREATE TABLE IF NOT EXISTS warn_config (
    guild_id TEXT UNIQUE NOT NULL,
    max_warns INT NOT NULL DEFAULT 0,
    punishment_type INT NOT NULL DEFAULT 0,
    timeout_duration INT NOT NULL DEFAULT 600000
    );


    CREATE TABLE IF NOT EXISTS banned_guilds (
      guild_id TEXT UNIQUE NOT NULL,
      reason TEXT,
      staff TEXT NOT NULL,
      banned INT NOT NULL,
      timestamp timestamp DEFAULT current_timestamp
      );


      CREATE TABLE IF NOT EXISTS guild_config (
        guild_id TEXT UNIQUE NOT NULL,
        locale TEXT NOT NULL,
        timezone TEXT NOT NULL
        );


        CREATE TABLE IF NOT EXISTS ban_config (
          guild_id TEXT UNIQUE NOT NULL,
          announce INT DEFAULT 0,
          announce_channel TEXT,
          announce_embed_title TEXT,
          announce_embed_description TEXT
          );

commit;

  `);

	const endTime = performance.now();
	const totalTime = (endTime - startTime).toFixed(2);

	pino.info(`Database.js -> Create tables completed! || Time: ${totalTime}ms`);
}

module.exports = {
	createTables,
};
