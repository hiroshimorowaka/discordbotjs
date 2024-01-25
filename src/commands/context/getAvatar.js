const { ApplicationCommandType, Client, EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const { ContextMenuCommandProps } = require("commandkit");
const commandTimeout = 3000;
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
		const embed = new EmbedBuilder()
			.setTitle(`:frame_photo: ${userObj.user.username}`)
			.setImage(userObj.user.displayAvatarURL({ dynamic: true, extension: "png", size: 2048 }));
		interaction.reply({ embeds: [embed], ephemeral: true });
	},

	options: {
		timeout: commandTimeout,
		userPermissions: ["SendMessages"],
		botPermissions: ["SendMessages"],
	},
};
