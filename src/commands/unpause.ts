import { Client, Message, SlashCommandBuilder } from "discord.js";
import { emojiReact } from "../utils/bot/bot-service";
import { hasPlayer, playerUnpause } from "../utils/player/player-service";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("unpause")
    .setDescription("Unpause the song!"),
  async execute(client: Client, message: Message, args: any) {
    console.log(
      `>>>unpause user: ${message.author.username} in guild: ${message.guild?.name}`
    );
    if (!message.guild?.id) {
      return;
    }
    if (message.guild?.id && hasPlayer(message.guild?.id)) {
        emojiReact({message,emoji:"ok_hand"});
        playerUnpause(message.guild?.id);
    } else {
      message.reactions.removeAll().catch();
      emojiReact({message,emoji:"poop"});
    }
  },
};
