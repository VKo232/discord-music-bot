import { Client, Message, SlashCommandBuilder } from "discord.js";
import { emojiReact } from "../utils/bot/bot-service";
import { hasPlayer, playerMove} from "../utils/player/player-service";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("move")
    .setDescription("Moves the selected song to the front of the queue"),
  aliases: ["m"],
  async execute(client: Client, message: Message, args: any) {
    console.log(
      `>>>Remove user: ${message.author.username} in guild: ${message.guild?.name}`
    );
    if (!message.guild?.id) {
      return;
    }
    if (message.guild?.id && hasPlayer(message.guild?.id) && args.length == 1) {
        emojiReact({message,emoji:"ok_hand"});
        playerMove(message.guild?.id, parseInt(args[0]));
    } else {
      message.reactions.removeAll().catch();
      emojiReact({message,emoji:"poop"});
    }
  },
};
