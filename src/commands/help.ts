import { Client, Message, SlashCommandBuilder, TextChannel } from "discord.js";
import { Config } from "../config";

module.exports = {
  data: new SlashCommandBuilder().setName("help").setDescription("help"),
  aliases: ["h"],
  async execute(client: Client, message: Message, args: any) {
    console.log(
      `>>> Help user: ${message.author.username} in guild: ${message.guild?.name}`
    );
    if (!message.guild?.id) {
      return;
    }
    (message.channel as TextChannel).send({ embeds: [helpEmbed] });
  },
};

const commands = [
  {
    name: Config.prefix + "play",
    description:
      "Summons the bot into the channel and starts playing the song(s) requested",
  },
  {
    name: Config.prefix + "pause",
    description: "Pauses the current song playing",
  },
  {
    name: Config.prefix + "resume",
    description: "Resumes playing the song that was paused",
  },
  //   {
  //     name: Config.prefix + "replay",
  //     description:
  //       "Go back and replays the last song",
  //   },
  {
    name: Config.prefix + "skip",
    description: "Skips to the next song in the queue",
  },
  //   {
  //     name: Config.prefix + "loop",
  //     description:
  //       "Loops the queue",
  //   },
    {
      name: Config.prefix + "queue",
      description:
        "Shows you the queue of songs",
    },
  {
    name: Config.prefix + "stop",
    description: "Leaves the voice channel",
  },
  //   {
  //     name: Config.prefix + "shuffle",
  //     description:
  //       "Shuffles the queue of songs",
  //   },
  //   {
  //     name: Config.prefix + "volume",
  //     description:
  //       "Shows the current bot volume",
  //   },
  {
    name: Config.prefix + "clear",
    description: "Clears the queue",
  },
  //   {
  //     name: Config.prefix + "move",
  //     description:
  //       "Move songs around in the queue",
  //   },
  {
    name: Config.prefix + "help",
    description: "Shows the command list",
  },
  //   {
  //     name: Config.prefix + "lyrics",
  //     description:
  //       "Pulls up the lyrics for the song currently playing",
  //   },
];
const helpEmbed = {
  color: 0x0099ff,
  title: "Sending Help",
  author: {
    name: "victor",
    icon_url: "https://cdn.discordapp.com/embed/avatars/1.png",
  },
  fields: [
    {
      name: "List of commands:",
      value: "",
    },
    ...commands.map((obj) => {
      return {
        name: "",
        value: "**" + obj.name + "**" + ": " + obj.description,
      };
    }),
  ],
};
