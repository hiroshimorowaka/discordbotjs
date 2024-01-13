async function checkRolePosition(interaction, userSelectedObj, commandName) {
	const targetUserRolePosition = userSelectedObj.roles.highest.position;
	const requestUserRolePosition = interaction.member.roles.highest.position;
	const botRolePosition = interaction.guild.members.me.roles.highest.position;

	const requestUserId = interaction.member.id;
	const userSelectedId = userSelectedObj.id;
	const guildOwnerId = interaction.guild.ownerId;

	if (userSelectedObj.user.bot) {
		await interaction.editReply({
			content: `I can't ${commandName} a bot!`,
			ephemeral: true,
		});
		return false;
	}

	if (userSelectedId === requestUserId) {
		await interaction.editReply({
			content: `You can't auto ${commandName}!`,
			ephemeral: true,
		});
		return false;
	}

	if (requestUserId !== guildOwnerId) {
		if (
			targetUserRolePosition >= requestUserRolePosition ||
			userSelectedId === guildOwnerId
		) {
			await interaction.editReply({
				content: `You can't ${commandName} that user because they have the same/higher role than you or is Server Owner`,
				ephemeral: true,
			});
			return false;
		}
	}
	if (
		targetUserRolePosition >= botRolePosition ||
		userSelectedId === guildOwnerId
	) {
		await interaction.editReply({
			content: `I can't ${commandName} that user because they have the same/higher role than me or is Server Owner`,
			ephemeral: true,
		});
		return false;
	}

	return true;
}

module.exports = {
	checkRolePosition,
};
