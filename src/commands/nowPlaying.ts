import { Client, Message, SlashCommandBuilder } from "discord.js";
import { playerNowPlaying } from "../utils/player/player-service";

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
    // SHOULD MOVE THIS INTO ANOTHER SERVICE
    const currSong = playerNowPlaying(message.guild?.id);
    if(currSong) {
        // TODO HAVE A NOW PLAYING INTERFACE IN THE BOT-SERVICE
        await message.reply(`Now playing ${currSong.name} by ${currSong.artists.join(', ')} `)
    }
},
};
