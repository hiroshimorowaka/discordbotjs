const { createClient } = require("redis");
const pino = require("../logger");

const client = createClient();
client.on("error", (err) => pino.error("Redis.js -> Redis Client Error", err));

client.on("connect", () => {
	pino.info("Redis.js -> Redis Client Connected");
});
client.connect();

async function setGuildLocaleCache(guild_id, locale) {
	await client.set(`${guild_id}:locale`, locale, { EX: 120 });
	return true;
}
async function getGuildLocaleCache(guild_id) {
	return await client.get(`${guild_id}:locale`);
}

async function addListCache(key, value = [], expire = 600, exp_option = "NX") {
	client.expire(key, expire, exp_option);
	for (word of value) {
		await client.sAdd(key, word);
	}
	return true;
}

async function removeListCache(key, value = [], expire = 600, exp_option = "NX") {
	client.expire(key, expire, exp_option);
	for (word of value) {
		await client.sRem(key, value);
	}
	return true;
}

async function hasListCached(key, value = []) {
	for (i of value) {
		const isMember = await client.sIsMember(key, value);
		if (isMember) {
			return true;
		}
	}
	return false;
}

async function itemsListCached(key) {
	const members = await client.sMembers(key);
	return members;
}

module.exports = {
	redis: client,
	removeListCache,
	addListCache,
	hasListCached,
	itemsListCached,
	setGuildLocaleCache,
	getGuildLocaleCache,
};
