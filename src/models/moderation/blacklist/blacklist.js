const { EmbedBuilder, Interaction } = require("discord.js");
const {
	GetBanWord,
	RemoveBannedWord,
	setBannedWord,
	GetBannedWords,
} = require("./ban_words.js");

const pino = require("../../../../logger.js");
const { removeListCache, addListCache, itemsListCached } = require("../../../../infra/redis.js");

/**
 * @param {Interaction} interaction
 * @returns
 */

async function removeBlacklistWord(interaction) {
	const word = await interaction.options.get("word").value.replace(/ /g, "");
	const new_word = word.split(",");
	const guild_id = await interaction.guildId;
	if (new_word) {
		try {
			
      const wordExist = await GetBanWord(guild_id, new_word);

			if (wordExist) {

				const result = await RemoveBannedWord(guild_id, new_word);
        if(!result){
          
          return await interaction.reply('Your guild is not setuped. Please use /setup')
        }

				removeListCache(guild_id, word);
			
      } else {
				return await interaction.reply(
					"This word dosen't exist on database of this server!",
				);
			}
		} catch (error) {
			await interaction.reply({
				content: "A error ocurred on remove ban word on database!",
				ephemeral: true,
			});
			pino.error("Remove Ban Word Error: ", error);
			return;
		}
		return await interaction.reply({
			content: "Word removed successfully!",
			ephemeral: true,
		});
	}
}

async function addBlacklistWord(interaction) {
	const word = await interaction.options.get("word").value.replace(/ /g, "");
	const new_word = word.split(",");
	const guild_id = await interaction.guildId;

	if (new_word && new_word.length > 0) {
		try {
			
      const WordExist = await GetBanWord(guild_id, new_word);
			if (!WordExist) {

				const result = await setBannedWord(guild_id, new_word);
        if(!result){
          
          return await interaction.reply('Your guild is not setuped. Please use /setup')
        }

				await addListCache(guild_id, new_word);
			} else {
				return await interaction.reply("This Word already exists!");
			}

		} catch (error) {

			await interaction.reply({
				content: "A error ocurred on insert ban word on database!",
				ephemeral: true,
			});
			
      pino.error(`Ban Word Insert Error: ${error}`);
			return;
		}
		return await interaction.reply({
			content: "Word set successfully!",
			ephemeral: true,
		});
	}
}

async function listBlacklistWords(interaction) {
	const list = new EmbedBuilder().setTitle("Banned Words List!");
	try {

    const startTime = performance.now();
    let cached = true

    let result = await itemsListCached(interaction.guildId)

    if(!result || result.length === 0){
      cached = false;
      result = await GetBannedWords(interaction.guildId);
      addListCache(interaction.guildId,result)
    }

		if (result.length === 0) {
			interaction.reply({
				content: "This server dosen't have seted blacklist words yet!",
				ephemeral: true,
			});
			return;
		}

    const blacklistedWords = []

		for (const word of result) {
      const newString = `**${word.toUpperCase()}**\n`;
      blacklistedWords.push(newString);
    }

    list.setDescription(blacklistedWords.join(''));

    const endTime = performance.now();

    list.addFields({ name: `Perfomance`, value: `${(endTime - startTime).toFixed(2)}ms\nCached: ${cached}` });
		return await interaction.reply({ embeds: [list], ephemeral: true });
	
  
  } catch (error) {
		pino.error(error);
		return await interaction.reply({
			content: "A error ocurred on list ban words!",
			ephemeral: true,
		});
	}
}

module.exports = {
	listBlacklistWords,
	removeBlacklistWord,
	addBlacklistWord,
};
