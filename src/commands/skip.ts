import { Client, Message, SlashCommandBuilder } from "discord.js";
import { emojiReact } from "../utils/bot/bot-service";
import { hasPlayer, playerSkip } from "../utils/player/player-service";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("skip")
    .setDescription("skips the song!"),
  aliases: ["s"],
  async execute(client: Client, message: Message, args: any) {
    console.log(`>>> Skip user: ${message.author.username} guild: ${message.guild?.name}`);
    if (message.guild?.id && (hasPlayer(message.guild?.id))) {
      emojiReact({message,emoji:"ok_hand"})
      playerSkip(message.guild?.id);
    } else {
      message.reactions.removeAll().catch();
      emojiReact({message,emoji:"poop"})
    }
  },
};
