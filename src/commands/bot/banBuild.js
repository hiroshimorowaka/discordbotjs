const { SlashCommandBuilder, Client } = require("discord.js");
const { query } = require("../../../infra/database");
const commandTimeout = 3000;
const pino = require("../../../logger");
module.exports = {
	data: new SlashCommandBuilder()
		.setName("guild-ban")
		.setDescription("Ban guilds from using the bot!")
		.setDMPermission(true)

		.addSubcommand((subCommand) =>
			subCommand
				.setName("list")
				.setDescription("list all banned guilds")
				.addStringOption((option) =>
					option.setName("guild-id").setDescription("The guild id to list reason and staff and that things"),
				),
		)

		.addSubcommand((subCommand) =>
			subCommand
				.setName("add")
				.setDescription("Add guild ")

				.addStringOption((option) =>
					option
						.setName("guild-id")
						.setDescription("The id of the guild that will be banned from using the bot!")
						.setRequired(true),
				)
				.addStringOption((option) =>
					option.setName("reason").setDescription("the reason for this guild being banned!"),
				),
		)
		.addSubcommand((subCommand) =>
			subCommand
				.setName("remove")
				.setDescription("Remove guild ")

				.addStringOption((option) =>
					option
						.setName("guild-id")
						.setDescription("The id of the guild that will be unbanned from using the bot!")
						.setRequired(true),
				)
				.addStringOption((option) =>
					option.setName("reason").setDescription("the reason for this guild being unbanned!"),
				),
		),

	/**
	 * @param {import('commandkit').SlashCommandProps} param0
	 * @param {Client} param1
	 */
	run: async ({ interaction, client }) => {
		await interaction.deferReply();

		const guildId = interaction.options?.get("guild-id").value;

		const reason = interaction.options?.get("reason").value;
		const subCommand = interaction.options.getSubcommand();
		const staffId = interaction.member.id;

		//fazer try catch

		if (subCommand === "add") {
			const result = await query(
				"INSERT INTO banned_guilds (guild_id,reason,staff,banned) VALUES ($1,$2,$3,1) ON CONFLICT (guild_id) DO UPDATE SET (reason,staff,banned) = ($2,$3,1) WHERE banned_guilds.guild_id = $1 AND banned_guilds.banned = 0",
				[guildId, reason, staffId],
			);

			if (result.rowCount > 0) {
				interaction.editReply("This guild has been banned from using the bot!");

				const guild =
					client.guilds.cache.get(guildId) || (await client.guilds.fetch(guildId).catch(() => {}));

				if (guild) {
					const ownerId = guild.ownerId;
					const owner = guild.members.cache.get(ownerId) || (await guild.members.fetch(ownerId));
					await owner.send(`Your guild ${guild.name} (${guild.id}) has been banned from using this BOT`);
					guild.leave();
				}
			} else {
				interaction.editReply("This guild **already** has been banned!");
			}

			return;
		}

		if (subCommand === "remove") {
			const result = await query(
				"UPDATE banned_guilds SET (reason,staff,banned) = ($1,$2,0) WHERE guild_id = $3 AND banned = 1",
				[reason, staffId, guildId],
			);

			if (result.rowCount > 0) {
				interaction.editReply("This guild has been unbanned and can use bot again!");
			} else {
				interaction.editReply("This guild is not banned!");
			}

			return;
		}

		if (subCommand === "list") {
			return;
		}
	},
	options: {
		devOnly: true,
		timeout: commandTimeout,
	},
};
