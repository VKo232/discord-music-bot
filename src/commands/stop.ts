import { Client, Message, SlashCommandBuilder } from "discord.js";
import { leaveChannel } from "../utils/bot/bot-service";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("stop")
    .setDescription("stops the bot!"),
  async execute(client: Client, message: Message, args: any) {
    console.log(`>>> Stop user: ${message.author.username} guild: ${message.guild?.name}`);

    if (!message.guild?.id) {return; }
    // call request bot to leave channel
    await leaveChannel(message.guild.id);
    // TODO IT SHOULD  NOT REPLY
    await message.reply("Stopped playing");
  },
};
