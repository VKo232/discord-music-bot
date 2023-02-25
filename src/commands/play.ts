import {Client, Message, SlashCommandBuilder, }from 'discord.js';
import { joinChannel } from 'src/utils/bot/bot-service';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('play')
		.setDescription('Plays a song!'),
	async execute(client: Client, message: Message, args: any) {
		if (!message.member?.voice?.channelId || !message.guild?.id || !message.guild?.voiceAdapterCreator ) {
			await message.reply("this server does not have the required permissions");
			return;
		}
		// call request bot join to the channel if not in use
		joinChannel(message.member.voice.channelId,message.guild.id, message.guild?.voiceAdapterCreator, message.channelId);
		// call add to queue 
		await message.reply("Added");

	},
};
