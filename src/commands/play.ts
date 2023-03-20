import { Client, Message, SlashCommandBuilder } from "discord.js";
import { emojiReact, joinChannel } from "../utils/bot/bot-service";
import { addSongs } from "../utils/song/song-service";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Plays a song!"),
  aliases: ["p"],
  async execute(client: Client, message: Message, args: any) {
    console.log(
      `>>> Play user: ${message.author.username} in guild: ${
        message.guild?.name
      } song request: ${args.join(" ")}`
    );
    if (
      !message.member?.voice?.channelId || // this one is when not in voice call
      !message.guild?.id || // something broke
      !message.guild?.voiceAdapterCreator // something broke
    ) {
      emojiReact({ message, emoji: "thumbsdown" });
      await message.reply("Join a voice call first");
      return;
    }
    emojiReact({ message, emoji: "ok_hand" });

    // call request bot join to the channel if not in use
    await joinChannel(
      message.member.voice.channelId,
      message.guild.id,
      message.guild?.voiceAdapterCreator,
      message.channelId
    );
    console.log("joined channel");
    // call add to queue
    let res = await addSongs({ guildID: message.guild.id, args: args });
    if (res != 0) {
      message.reactions.removeAll().then(()=>emojiReact({message,emoji:"thumbsdown"}));
    }
    console.log("added songs");
  },
};
