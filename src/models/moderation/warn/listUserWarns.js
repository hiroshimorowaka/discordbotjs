const {
	EmbedBuilder,
	ButtonBuilder,
	ActionRowBuilder,
	Interaction,
	ComponentType,
	ButtonStyle,
} = require("discord.js");
const { checkTimezone } = require("../../settings/timezones");
const { checkGuildLocale } = require("../../guilds/locale");
const { query } = require("../../../../infra/database");
const { getDateFormater } = require("../../dateFormater");

/**
 * @param {Interaction} interaction
 * @returns
 */

const maxButtonsIdleTime = 300000;

async function listUserWarns(interaction, userSelected) {
	await interaction.deferReply();

	const serverLocale = await checkGuildLocale(interaction.guildId);
	const timezone = await checkTimezone(interaction.guildId);
	const warnFormatedDate = getDateFormater(serverLocale, timezone);

	const startTime = performance.now();

	const userWarns = await query(
		"SELECT * FROM warns WHERE guild_id = $1 AND user_id = $2 ORDER BY timestamp",
		[interaction.guildId, userSelected.id],
	);

	const endTime = performance.now();

	if (userWarns.rows.length === 0) {
		const userDontHaveWarnsLocales = {
			"pt-BR": "Esse usuário não tem advertências!",
			"en-US": "This user doesn't have any warns!",
		};
		interaction.editReply(userDontHaveWarnsLocales[serverLocale] || userDontHaveWarnsLocales["en-US"]);
		return;
	}

	const userWarnsTitleLocales = {
		"pt-BR": `Advertências de ${userSelected.user.username}`,
		"en-US": `${userSelected.user.username} warns`,
	};

	const embedTitle = userWarnsTitleLocales[serverLocale] || userWarnsTitleLocales["en-US"];

	const firstPage = new EmbedBuilder().setTitle(embedTitle);

	const previousButton = new ButtonBuilder()
		.setCustomId("previous_page_button")
		.setStyle(ButtonStyle.Primary)
		.setEmoji("⏮️");
	const nextButton = new ButtonBuilder()
		.setCustomId("next_page_button")
		.setStyle(ButtonStyle.Primary)
		.setEmoji("⏭️");

	const buttonRow = new ActionRowBuilder().addComponents([nextButton, previousButton]);

	let currentPage = 1;
	const maxItemPerPage = 5;

	const data = userWarns.rows;

	const lastPage = Math.ceil(data.length / maxItemPerPage);

	const firstInteraction = data.length > maxItemPerPage ? maxItemPerPage : data.length;
	showSlicedData(firstPage, data, firstInteraction, 0);

	updateButtons();

	let content = " ";
	if (process.env.DEBUG) {
		content = `Database Perfomance: ${(endTime - startTime).toFixed(2)}ms`;
	}
	const message = await interaction.editReply({
		content: content,
		embeds: [firstPage],
		components: [buttonRow],
		fetchReply: true,
	});

	const collector = message.createMessageComponentCollector({
		componentType: ComponentType.Button,
		idle: maxButtonsIdleTime,
	});

	collector
		.on("collect", async (buttonInteraction) => {
			await buttonInteraction.deferUpdate();
			checkPermissions(buttonInteraction, interaction);

			if (buttonInteraction.customId === "next_page_button") {
				currentPage++;
			}
			if (buttonInteraction.customId === "previous_page_button") {
				currentPage--;
			}

			const until_item = currentPage * maxItemPerPage;
			const from = until_item - maxItemPerPage;

			updateButtons();

			if (buttonInteraction.customId === "previous_page_button") {
				if (previousButton.data.disabled) {
					await message.edit({ embeds: [firstPage], components: [buttonRow] });
					return;
				}
			}

			const actualData = data.slice(from, until_item);
			const actualPage = new EmbedBuilder().setTitle(embedTitle);

			showSlicedData(actualPage, actualData, actualData.length, from);

			await message.edit({ embeds: [actualPage], components: [buttonRow] });
		})
		.on("end", async (reason) => {
			if (reason !== "messageDelete") {
				const locale = {
					"pt-BR": "Você passou muito tempo sem utilizar os botões. A mensagem será apagada em 5 segundos!",
					"en-US":
						"You spent a long time without using the buttons. The message will be deleted in 5 seconds!",
				};

				await message
					.edit({
						content: `> *${locale[serverLocale] ?? locale["en-US"]}*`,
						components: [buttonRow],
					})
					.catch(() => {});

				setTimeout(() => {
					message.delete().catch(() => {});
				}, 5000);
			}
		});

	function checkPermissions(buttonInteraction, interaction) {
		if (buttonInteraction.user.id !== interaction.user.id) {
			const cantUseButtonsLocales = {
				"pt-BR": "Você não pode utilizar estes botões!",
				"en-US": "You can't use these buttons!",
			};

			buttonInteraction.reply({
				content: cantUseButtonsLocales[serverLocale] || cantUseButtonsLocales["en-US"],
				ephemeral: true,
			});
		}
	}

	function showSlicedData(actualPage, data, maxIteractions, from) {
		const fieldNameLocales = {
			"pt-BR": "Advertência",
			"en-US": "Warn",
		};

		const fieldReasonLocales = {
			"pt-BR": "Motivo",
			"en-US": "Reason",
		};

		for (let i = 0; i < maxIteractions; i++) {
			const warnDate = data[i].timestamp;
			actualPage.addFields({
				name: `${fieldNameLocales[serverLocale] || fieldNameLocales["en-US"]} ${
					from + i + 1
				} - ${warnFormatedDate.format(warnDate)}`,
				value: `Staff: <@${data[i].staff}>\n${
					fieldReasonLocales[serverLocale] || fieldReasonLocales["en-US"]
				}: ${data[i].reason}\n`,
			});
		}
	}

	function updateButtons() {
		if (currentPage === 1) {
			previousButton.setDisabled(true);
		} else {
			previousButton.setDisabled(false);
		}

		if (currentPage === lastPage) {
			nextButton.setDisabled(true);
		} else {
			nextButton.setDisabled(false);
		}
	}
}

module.exports = {
	listUserWarns,
};
