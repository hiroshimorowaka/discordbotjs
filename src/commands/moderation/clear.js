const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

const { sendLogs } = require("../../models/logs/sendLogs");
const pino = require("../../../logger");

const maxValue = 100;
const commandTimeout = 5000;
module.exports = {
	data: new SlashCommandBuilder()
		.setName("clear")
		.setNameLocalization("pt-BR", "limpar")
		.setDescription("Delete X messages from chat")
		.setDescriptionLocalization("pt-BR", "Exclui X mensagens do chat!")
		.setDMPermission(false)
		.addIntegerOption((option) =>
			option
				.setName("amount")
				.setNameLocalization("pt-BR", "quantidade")
				.setDescription(`Amount of messages to be deleted (Limit: ${maxValue}) `)
				.setDescriptionLocalization(
					"pt-BR",
					`Quantidade de mensagens para serem deletadas (Limite: ${maxValue}) `,
				)
				.setRequired(true)
				.setMinValue(1)
				.setMaxValue(maxValue),
		)
		.addUserOption((option) =>
			option
				.setName("target")
				.setNameLocalization("pt-BR", "usuário")
				.setDescription("Exclui as mensagens de um usuário especifico!"),
		),

	/**
	 * @param {import('commandkit').SlashCommandProps} param0
	 */

	run: async ({ interaction }) => {
		const { options, channel } = interaction;
		let amount = options.getInteger("amount");
		const target = options.getUser("target");
		const multiMessages = amount === 1 ? "message" : "messages";
		const serverLocale = interaction.guild.preferredLocale;
		if (!amount || amount > maxValue || amount < 1) {
			const locales = {
				"pt-BR": `Por favor, especifique uma quantidade de 1 a ${maxValue}`,
				"en-US": `Please specify an amount between 1 and ${maxValue}`,
			};
			return await interaction.reply({
				content: locales[serverLocale] || locales["en-US"],
				ephemeral: true,
			});
		}

		try {
			const channelMessages = await channel.messages.fetch({ limit: maxValue });

			if (channelMessages.size === 0) {
				const locales = {
					"pt-BR": "Não tem mensagens para deletar nesse canal",
					"en-US": "There are no messages in this channel to delete!",
				};

				return await interaction.reply({
					content: locales[serverLocale] || locales["en-US"],
					ephemeral: true,
				});
			}

			if (amount > channelMessages.size) amount = channelMessages.size;

			const clearEmbed = new EmbedBuilder().setColor(0x36d63b);

			await interaction.deferReply({ ephemeral: true });

			let messagesToDelete = [];

			if (target) {
				for (message in channelMessages) {
					if (message.author.id === target.id && messagesToDelete.length < amount) {
						messagesToDelete.push(m);
					}
				}
				clearEmbed.setDescription(`
              \`✅\` Successfully cleared \`${messagesToDelete.length}\` ${multiMessages} from ${target} in ${channel}.
            `);
			} else {
				messagesToDelete = channelMessages.first(amount);
				clearEmbed.setDescription(`
          \`✅\` Successfully cleared \`${messagesToDelete.length}\` ${multiMessages} in ${channel}.
        `);
			}

			if (messagesToDelete.length > 0) {
				await channel.bulkDelete(messagesToDelete, true);
			}

			return await interaction.editReply({ embeds: [clearEmbed] });
		} catch (e) {
			await interaction.reply({
				content: "An error occurred when executing this command!",
				ephemeral: true,
			});
			pino.error(e);
		}
	},
	options: {
		userPermissions: ["ManageMessages"],
		botPermissions: ["ManageMessages"],
		timeout: commandTimeout,
	},
};
