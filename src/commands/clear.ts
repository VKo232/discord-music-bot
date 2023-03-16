import { Client, Message, SlashCommandBuilder } from "discord.js";
import { emojiReact } from "../utils/bot/bot-service";
import { hasPlayer, playerClearQueue } from "../utils/player/player-service";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("clear")
    .setDescription("Clears the queue!"),
  aliases: ["c"],
  async execute(client: Client, message: Message, args: any) {
    console.log(
      `>>> Clear user: ${message.author.username} in guild: ${message.guild?.name}`
    );
    if (!message.guild?.id) {
      return;
    }
    if (message.guild?.id && hasPlayer(message.guild?.id)) {
      emojiReact({message,emoji:"ok_hand"});
      playerClearQueue(message.guild?.id);
    } else {
      message.reactions.removeAll().catch();
      emojiReact({message,emoji:"poop"});
    }
  },
};
