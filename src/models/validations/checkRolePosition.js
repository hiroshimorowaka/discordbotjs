async function checkRolePosition(interaction, userSelectedObj, commandName) {
	const targetUserRolePosition = userSelectedObj.roles.highest.position;
	const requestUserRolePosition = interaction.member.roles.highest.position;
	const botRolePosition = interaction.guild.members.me.roles.highest.position;

	const requestUserId = interaction.member.id;
	const userSelectedId = userSelectedObj.id;
	const guildOwnerId = interaction.guild.ownerId;

	const serverLocale = interaction.guild.preferredLocale;

	if (userSelectedObj.user.bot) {
		const userIsBotLocales = {
			"pt-BR": `Eu não posso dar ${commandName} em um bot!`,
			"en-US": `I can't ${commandName} a bot!`,
		};

		await interaction.editReply({
			content: userIsBotLocales[serverLocale] || userIsBotLocales["en-US"],
			ephemeral: true,
		});
		return false;
	}

	if (userSelectedId === requestUserId) {
		const userIsRequesterLocales = {
			"pt-BR": `Você não pode se dar ${commandName}`,
			"en-US": `You can't auto ${commandName}!`,
		};

		await interaction.editReply({
			content: userIsRequesterLocales[serverLocale] || userIsRequesterLocales["en-US"],
			ephemeral: true,
		});
		return false;
	}

	if (requestUserId !== guildOwnerId) {
		if (targetUserRolePosition >= requestUserRolePosition || userSelectedId === guildOwnerId) {
			const userIsHigherLocales = {
				"pt-BR": `Você não poder dar ${commandName} nesse usuário, porque ele tem um cargo igual/maior que o SEU ou é o Dono do Servidor!`,
				"en-US": `You can't ${commandName} that user because they have the same/higher role than you or is Server Owner`,
			};

			await interaction.editReply({
				content: userIsHigherLocales[serverLocale] || userIsHigherLocales["en-US"],
				ephemeral: true,
			});
			return false;
		}
	}
	if (targetUserRolePosition >= botRolePosition || userSelectedId === guildOwnerId) {
		const botIsLowerLocales = {
			"pt-BR": `Eu não posso dar ${commandName} nesse usuário, porque ele tem um cargo igual/maior que o MEU ou é o Dono do Servidor!`,
			"en-US": `I can't ${commandName} that user because they have the same/higher role than me or is Server Owner`,
		};

		await interaction.editReply({
			content: botIsLowerLocales[serverLocale] || botIsLowerLocales["en-US"],
			ephemeral: true,
		});
		return false;
	}

	return true;
}

module.exports = {
	checkRolePosition,
};
