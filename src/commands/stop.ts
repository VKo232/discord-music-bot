import { Client, Message, SlashCommandBuilder } from "discord.js";
import { leaveChannel } from "../utils/bot/bot-service";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("stop")
    .setDescription("stops the bot!"),
  async execute(client: Client, message: Message, args: any) {
    if (
      !message.member?.voice?.channelId ||
      !message.guild?.id ||
      !message.guild?.voiceAdapterCreator
    ) {
      await message.reply("this server does not have the required permissions");
      return;
    }
    // call request bot to leave channel
    await leaveChannel(message.guild.id);
    // clean up remove the queue
    await message.reply("left channel");
  },
};
