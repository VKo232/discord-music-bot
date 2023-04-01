import { Client, Message, SlashCommandBuilder } from "discord.js";
import { emojiReact } from "../utils/bot/bot-service";
import { hasPlayer, playerGetQueue, playerMove} from "../utils/player/player-service";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("move")
    .setDescription("Moves the selected song to the front of the queue"),
  aliases: ["m"],
  async execute(client: Client, message: Message, args: any) {
    console.log(
      `>>>Move user: ${message.author.username} in guild: ${message.guild?.name}`
    );
    if (!message.guild?.id) {
      return;
    }
    const length = playerGetQueue(message.guild?.id).length;
    if (message.guild?.id && hasPlayer(message.guild?.id) && args.length == 1 && parseInt(args[0]) - 1 <= length && parseInt(args[0]) > 0) {
        emojiReact({message,emoji:"ok_hand"});
        playerMove(message.guild?.id, parseInt(args[0]));
    } else {
      message.reactions.removeAll().catch();
      emojiReact({message,emoji:"poop"});
    }
  },
};
