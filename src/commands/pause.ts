import { Client, Message, SlashCommandBuilder } from "discord.js";
import { emojiReact } from "../utils/bot/bot-service";
import { hasPlayer, playerPause } from "../utils/player/player-service";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("pause")
    .setDescription("Pauses the song!"),
  async execute(client: Client, message: Message, args: any) {
    console.log(
      `>>> Pause user: ${message.author.username} in guild: ${message.guild?.name}`
    );
    if (!message.guild?.id) {
      return;
    }
    if (message.guild?.id && hasPlayer(message.guild?.id)) {
      // pause the player
      emojiReact({ message, emoji: "ok_hand" });
      playerPause(message.guild?.id);
    } else {
      message.reactions.removeAll().catch();
      emojiReact({ message, emoji: "poop" });
    }
  },
};
