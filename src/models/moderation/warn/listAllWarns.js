const {
	EmbedBuilder,
	ButtonStyle,
	ButtonBuilder,
	ActionRowBuilder,
	ComponentType,
	Interaction,
} = require("discord.js");
const { checkGuildLocale } = require("../../guilds/locale");
const { query } = require("../../../../infra/database");

const maxButtonsIdleTime = 300000; //300000 = 5 minutos
/**
 *
 * @param {Interaction} interaction
 * @returns
 */
async function listWarn(interaction) {
	await interaction.deferReply();
	const guildId = interaction.guild.id;
	const serverLocale = await checkGuildLocale(guildId);

	const startTime = performance.now();
	const users = await query(
		"SELECT user_id,count(user_id) FROM warns WHERE guild_id = $1 GROUP BY user_id ORDER BY count DESC;",
		[guildId],
	);
	const endTime = performance.now();

	if (users.rowCount === 0) {
		const noWarnsLocales = {
			"pt-BR": "Ninguém nesse servidor tem advertências!",
			"en-US": "No one on this server has warnings!",
		};

		interaction.editReply(noWarnsLocales[serverLocale] || noWarnsLocales["en-US"]);
		return;
	}

	const listTitleLocales = {
		"pt-BR": "Lista de advertências",
		"en-US": "List of warns",
	};

	const embedTitle = listTitleLocales[serverLocale] || listTitleLocales["en-US"];

	const actualPage = new EmbedBuilder().setTitle(embedTitle);

	const previousButton = new ButtonBuilder()
		.setCustomId("previous_page_button")
		.setStyle(ButtonStyle.Primary)
		.setEmoji("⏮️");
	const nextButton = new ButtonBuilder()
		.setCustomId("next_page_button")
		.setStyle(ButtonStyle.Primary)
		.setEmoji("⏭️");

	const buttonRow = new ActionRowBuilder().addComponents([previousButton, nextButton]);

	let currentPage = 1;
	const maxItemPerPage = 5;

	const data = users.rows;

	const lastPage = Math.ceil(data.length / maxItemPerPage);

	const firstInteraction = data.length > maxItemPerPage ? maxItemPerPage : data.length;
	showSlicedData(actualPage, data, firstInteraction);

	updateButtons();

	let content = " ";
	if (process.env.DEBUG) {
		content = `Database Perfomance: ${(endTime - startTime).toFixed(2)}ms`;
	}
	const message = await interaction.editReply({
		content: content,
		embeds: [actualPage],
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

			showSlicedData(actualPage, actualData, actualData.length);

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

	function showSlicedData(actualPage, data, maxIteractions) {
		const warnCountLocales = {
			"pt-BR": "advertência(s)",
			"en-US": "warn(s)",
		};
		const description = [];
		for (let i = 0; i < maxIteractions; i++) {
			const newString = `<@${data[i].user_id}>: **${data[i].count}** ${
				warnCountLocales[serverLocale] || warnCountLocales["en-US"]
			}\n`;
			description.push(newString);
		}

		actualPage.setDescription(description.join(" "));
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
	listWarn,
};
