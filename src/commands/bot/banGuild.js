const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { query } = require("../../../infra/database");
const commandTimeout = 3000;
const pino = require("../../../logger");
const { subHours, format } = require("date-fns");
module.exports = {
	data: new SlashCommandBuilder()
		.setName("guild-ban")
		.setDescription("Ban guilds from using the bot!")
		.setDMPermission(true)

		.addSubcommand((subCommand) =>
			subCommand
				.setName("list")
				.setDescription("list all banned guilds")

				.addIntegerOption((option) =>
					option
						.setName("type")
						.setDescription("The search type")
						.addChoices(
							{ name: "Banned Only", value: 1 },
							{ name: "Unbanned Only", value: 2 },
							{ name: "All", value: 3 },
						)
						.setRequired(true),
				)

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

		const guildId = interaction.options.get("guild-id")?.value;

		const reason = interaction.options.get("reason")?.value || "No reason provided";
		const subCommand = interaction.options.getSubcommand();
		const staffId = interaction.member.id;

		if (subCommand === "list") {
			const type = interaction.options.get("type").value;
			const embed = new EmbedBuilder();
			console.log(type);

			try {
				let result;
				if (type === 1) {
					embed.setTitle("Banned guilds only");
					result = await query("SELECT * FROM banned_guilds WHERE banned = 1;");
				}

				if (type === 2) {
					embed.setTitle("Unbanned guilds only");
					result = await query("SELECT * FROM banned_guilds WHERE banned = 0;");
				}

				if (type === 3) {
					embed.setTitle("All guilds");
					result = await query("SELECT * FROM banned_guilds;");
				}

				if (result.rows.length > 0) {
					for (let i = 0; i < result.rows.length; i++) {
						const date = subHours(result.rows[i].timestamp, 3);
						const newDate = format(date, "dd/MM H:mm:ss");
						embed.addFields({
							name: `(${i + 1}) Guild ID: ${result.rows[i].guild_id}`,
							value: `**Staff:** <@${result.rows[i].staff}>
              **Reason:** \`${result.rows[i].reason}\`
              **Timestamp:** \`${newDate}\` GMT-3
              **Banned:** \`${Boolean(result.rows[i].banned)}\``,
						});
					}
				} else {
					interaction.editReply("Não tem guilda porra!");
					return;
				}

				interaction.editReply({ embeds: [embed] });
			} catch (error) {
				interaction.editReply("An error ocurred when executing this command!");
				pino.error(error);
			}
		}

		if (subCommand === "add") {
			try {
				const result = await query(
					"INSERT INTO banned_guilds (guild_id,reason,staff,banned) VALUES ($1,$2,$3,1) ON CONFLICT (guild_id) DO UPDATE SET (reason,staff,banned) = ($2,$3,1) WHERE banned_guilds.guild_id = $1 AND banned_guilds.banned = 0;",
					[guildId, reason, staffId],
				);

				if (result.rowCount > 0) {
					interaction.editReply("This guild has been banned from using the bot!");

					const guild =
						client.guilds.cache.get(guildId) || (await client.guilds.fetch(guildId).catch(() => {}));

					if (guild) {
						const ownerId = guild.ownerId;
						const owner = guild.members.cache.get(ownerId) || (await guild.members.fetch(ownerId));
						await owner.send(
							`Your guild \`${guild.name}\` (${guild.id}) has been banned from using this BOT\n**Reason**${reason}`,
						);
						guild.leave();
					}
				} else {
					interaction.editReply("This guild **already** has been banned!");
				}

				return;
			} catch (error) {
				interaction.editReply("An error ocurred when executing this command!");
				pino.error(error);
			}
		}

		if (subCommand === "remove") {
			try {
				const result = await query(
					"UPDATE banned_guilds SET (reason,staff,banned) = ($1,$2,0) WHERE guild_id = $3 AND banned = 1;",
					[reason, staffId, guildId],
				);

				if (result.rowCount > 0) {
					interaction.editReply("This guild has been unbanned and can use bot again!");
				} else {
					interaction.editReply("This guild is not banned!");
				}

				return;
			} catch (error) {
				interaction.editReply("An error ocurred when executing this command!");
				pino.error(error);
			}
		}
	},
	options: {
		devOnly: true,
		timeout: commandTimeout,
	},
};
