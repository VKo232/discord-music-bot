import { Client, Message, SlashCommandBuilder } from "discord.js";
import { addSongs } from "../utils/song/song-service";
import { joinChannel } from "../utils/bot/bot-service";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("clear")
    .setDescription("Clears the queue!"),
  aliases: ["p"],
  async execute(client: Client, message: Message, args: any) {
    console.log(`>>> Clear user: ${message.author.username} in guild: ${message.guild?.name}`);
    if (!message.guild?.id) {return;}
  },
};
