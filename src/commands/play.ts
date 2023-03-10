import { Client, Message, SlashCommandBuilder } from "discord.js";
import { addSongs } from "../utils/song/song-service";
import { joinChannel } from "../utils/bot/bot-service";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Plays a song!"),
    aliases:['p'],
  async execute(client: Client, message: Message, args: any) {
    console.log("executing play");
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
    console.log("joined channel");
    // call add to queue
    await addSongs({ guildID: message.guild.id, args: args });
    console.log("added songs");
  },
};
