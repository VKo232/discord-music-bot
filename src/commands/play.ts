import { Client, Message, SlashCommandBuilder } from "discord.js";
import { addSongs } from "../utils/song/song-service";
import { joinChannel } from "../utils/bot/bot-service";


module.exports = {
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Plays a song!"),
  async execute(client: Client, message: Message, args: any) {
    if (
      !message.member?.voice?.channelId || // this one is when not in voice call
      !message.guild?.id || // something broke
      !message.guild?.voiceAdapterCreator // something broke
    ) {
      await message.reply("Join a voice call first");
      return;
    }
    // call request bot join to the channel if not in use
    await joinChannel(
      message.member.voice.channelId,
      message.guild.id,
      message.guild?.voiceAdapterCreator,
      message.channelId
    );
    // call add to queue
    await addSongs(message.member.voice.channelId, message.guild.id,args);
  },
};