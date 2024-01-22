const { GetBannedWords } = require("../../models/moderation/blacklist/ban_words.js");

const { addListCache, itemsListCached } = require("../../../infra/redis.js");
const { checkGuildLocale } = require("../../models/guilds/locale.js");
const { Message } = require("discord.js");
/**
 * @param {Message} message
 * @returns
 */

module.exports = async (message) => {
	const words = message.content.trim().toLowerCase().split(/ +/);
	const cache = await itemsListCached(message.guildId);
	const serverLocale = await checkGuildLocale(message.guildId);
	const bannedWordLocales = {
		"pt-BR": "Uma das palavras digitas na sua ultima mensagem está BANIDA desse servidor, evite usa-la!",
		"en-US": "One of the words you typed in your last message is BANNED from this server, avoid using it!",
	};

	for (i of words) {
		if (cache.includes(i)) {
			await message.delete();
			await message.author.send(bannedWordLocales[serverLocale]);
			return;
		}
	}
	const db_words = await GetBannedWords(message.guildId);
	for (i of words) {
		if (db_words.includes(i)) {
			addListCache(message.guildId, i);
			await message.delete();
			await message.author.send(bannedWordLocales[serverLocale]);
			return;
		}
	}
};
