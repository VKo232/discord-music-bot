import { Client, Message, SlashCommandBuilder } from "discord.js";
import { addSongs } from "../utils/song/song-service";
import { isInChannel, joinChannel } from "../utils/bot/bot-service";
import { CustomPlayer } from "../utils/song/player";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("skip")
    .setDescription("skips the song!"),
  async execute(client: Client, message: Message, args: any) {
    console.log("executing skip");
    if (message.guild?.id && (await isInChannel(message.guild?.id))) {
      CustomPlayer.getPlayer(message.guild?.id)?.skip();
    }
  },
};
