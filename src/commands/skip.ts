import { Client, Message, SlashCommandBuilder } from "discord.js";
import { addSongs } from "../utils/song/song-service";
import { isInChannel, joinChannel } from "../utils/bot/bot-service";
import { CustomPlayer } from "../utils/song/player";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("skip")
    .setDescription("skips the song!"),
  aliases: ["s"],
  async execute(client: Client, message: Message, args: any) {
    console.log(`>>> Skip user: ${message.author.username} guild: ${message.guild?.name}`);
    if (message.guild?.id && (await isInChannel(message.guild?.id))) {
      CustomPlayer.getPlayer(message.guild?.id)?.skip();
    }
  },
};
