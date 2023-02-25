import { Client, Message, SlashCommandBuilder } from "discord.js";
import { joinChannel } from  "../utils/bot/bot-service";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Plays a song!"),
  async execute(client: Client, message: Message, args: any) {
    if (
      !message.member?.voice?.channelId ||
      !message.guild?.id ||
      !message.guild?.voiceAdapterCreator
    ) {
      await message.reply("Join a voice call first");
      return;
    }
    // call request bot join to the channel if not in use
    await joinChannel(
      message.member.voice.channelId,
      message.guild.id,
      message.guild?.voiceAdapterCreator,
      message.channelId
    );
    // call add to queue
    await message.reply("Added");
  },
};
