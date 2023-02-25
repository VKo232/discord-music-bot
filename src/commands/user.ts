import {Client, Message, SlashCommandBuilder, }from 'discord.js';
module.exports = {
	data: new SlashCommandBuilder()
		.setName('user')
		.setDescription('Provides information about the user.'),
	async execute(client: Client, message: Message, args: any) {
		// interaction.user is the object representing the User who ran the command
		// interaction.member is the GuildMember object, which represents the user in the specific guild
		await message.reply(`This command was run by ${message.author.username}, who joined on ${message?.member?.joinedAt}.`);
	},
};
