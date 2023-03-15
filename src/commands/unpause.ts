import { Client, Message, SlashCommandBuilder } from "discord.js";
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
        // pause the player 
        playerUnpause(message.guild?.id);
    }
  },
};
