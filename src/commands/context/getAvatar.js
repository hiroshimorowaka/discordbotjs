const { ApplicationCommandType, Client, ContextMenuCommandInteraction } = require("discord.js");
const { ContextMenuCommandProps } = require("commandkit");

module.exports = {
	data: {
		name: "Get-Avatar",
		type: ApplicationCommandType.User,
	},
	/**
	 *
	 * @param {ContextMenuCommandProps} param0
	 * @param {Client} param1
	 */
	run: async ({ interaction, client, handler }) => {
		const userId = interaction.targetId;
		const userObj =
			interaction.guild.members.cache.get(userId) ||
			(await interaction.guild.members.fetch(userId).catch(() => {}));

		if (!userObj) {
			interaction.reply({
				content: "An error ocurred! Please select a USER to use this option!",
				ephemeral: true,
			});
			return;
		}
		interaction.member.send(`The user avatar is: ${userObj.user.avatarURL()}`);
	},

	options: {
		devOnly: true,
		userPermissions: ["Administrator", "AddReactions"],
		botPermissions: ["Administrator", "AddReactions"],
		deleted: false,
	},
};
