import {Client, Message, SlashCommandBuilder, }from 'discord.js';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!'),
	async execute(client: Client, message: Message, args: any) {
		await message.reply("Pong");
	},
};
