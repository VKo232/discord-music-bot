import {Client, Message, SlashCommandBuilder, }from 'discord.js';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('server')
		.setDescription('Provides information about the server.'),
	async execute(client: Client, message: Message, args: any) {
		// interaction.guild is the object representing the Guild in which the command was run
		await message.reply(`This server is ${message?.guild?.name} and has ${message?.guild?.memberCount} members.`);
	},
};
