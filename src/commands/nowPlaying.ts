import { Client, Message, SlashCommandBuilder } from "discord.js";
import { emojiReact } from "../utils/bot/bot-service";
import { hasPlayer, playerNowPlaying } from "../utils/player/player-service";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("song")
    .setDescription("What is this song!"),
  aliases: ["np"],
  async execute(client: Client, message: Message, args: any) {
    console.log(
      `>>> Now Playing user: ${message.author.username} in guild: ${message.guild?.name}`
    );
    if (!message.guild?.id) {
      return;
    }
    if (message.guild?.id && hasPlayer(message.guild?.id)) {
      emojiReact({message,emoji:"ok_hand"});
      const currSong = playerNowPlaying(message.guild?.id);
      if(currSong) {
          await message.reply(`Now playing ${currSong.name} by ${currSong.artists.join(', ')} `)
      }
    } else {
      message.reactions.removeAll().catch();
      emojiReact({message,emoji:"poop"});
    } 


},
};
