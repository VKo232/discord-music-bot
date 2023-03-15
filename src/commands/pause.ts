import { Client, Message, SlashCommandBuilder } from "discord.js";
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
        playerPause(message.guild?.id);
    }
  },
};
