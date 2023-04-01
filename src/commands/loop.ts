import { Client, Message, SlashCommandBuilder } from "discord.js";
import { emojiReact } from "../utils/bot/bot-service";
import { hasPlayer, playerLoopQueue, playerLoopSong, playerMove} from "../utils/player/player-service";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("loop")
    .setDescription("Loops either the whole queue or the current song"),
  async execute(client: Client, message: Message, args: any) {
    console.log(
      `>>>Loop user: ${message.author.username} in guild: ${message.guild?.name}`
    );
    if (!message.guild?.id) {
      return;
    }
    if (message.guild?.id && hasPlayer(message.guild?.id)) {
      emojiReact({message,emoji:"ok_hand"});
      if (args.length == 1 && args[0] == 'song') {
        playerLoopSong(message.guild?.id)
      } else {
        playerLoopQueue(message.guild?.id)
      }
        
    } else {
      message.reactions.removeAll().catch();
      emojiReact({message,emoji:"poop"});
    }
  },
};
