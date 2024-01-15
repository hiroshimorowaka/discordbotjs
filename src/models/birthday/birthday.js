const { query } = require("../../../infra/database.js");
const { EmbedBuilder } = require("discord.js");
const { format } = require("date-fns");
const { ptBR } = require("date-fns/locale");
const pino = require("../../../logger.js");
const { validateDate } = require("../../models/birthday/validations.js");

async function SetBirthday(id, birth) {
	const result = await query(
		"INSERT INTO birthdays (user_id,birthday) VALUES ($1,$2) ON CONFLICT (user_id) DO UPDATE SET birthday = $2",
		[id, birth],
	);
	return result;
}

async function GetBirthdays() {
	const result = await query("SELECT * FROM birthdays");
	return result;
}

async function commandSetBirthday(interaction) {
	try {
		const user_id = interaction.user.id;
		const date = interaction.options.get("date").value.replace(/ /g, "");

		const new_date = validateDate(date);
		if (new_date) {
			await SetBirthday(user_id, new_date);
			return await interaction.reply({
				content: "Your birthday has been set successfully!",
				ephemeral: true,
			});
		}
		return await interaction.reply({
			content: "You have entered an INVALID date!",
			ephemeral: true,
		});
	} catch (e) {
		pino.error(e);
		return await interaction.reply({
			content: "An error ocurred when setting your birthday!",
			ephemeral: true,
		});
	}
}

async function commandListBirthdays(interaction, client) {
	const list = new EmbedBuilder().setTitle("Lista dos aniversáriantes!");
	try {
		const result = await GetBirthdays();
		for (const user in result.rows) {
			const actual_user = result.rows[user];
			const user_id = actual_user.user_id;
			const user_obj = await client.users.fetch(user_id);

			const birthday = format(actual_user.birthday, "dd 'de' MMMM 'de' yyyy", {
				locale: ptBR,
			});

			list.addFields({
				name: `${user_obj.username}: ${birthday}`,
				value: ".",
			});
		}
		return await interaction.reply({ embeds: [list] });
	} catch (error) {
		console.error(error);
	}
}

module.exports = {
	SetBirthday,
	GetBirthdays,
	commandSetBirthday,
	commandListBirthdays,
};
