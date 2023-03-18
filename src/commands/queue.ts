import {
  Client,
  EmbedBuilder,
  Message,
  MessageReaction,
  SlashCommandBuilder,
  TextChannel,
  User,
} from "discord.js";
import { emojiReact } from "../utils/bot/bot-service";
import { getEmoji } from "../utils/misc/emojiMapper";
import { PaginatedQueue } from "../utils/misc/paginator";
import { hasPlayer, playerGetQueue } from "../utils/player/player-service";

const PREV_EMOJI = "arrow_backward";
const NEXT_EMOJI = "arrow_forward";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("queue")
    .setDescription("Get list of songs!"),
  aliases: ["q"],
  async execute(client: Client, message: Message, args: any) {
    console.log(
      `>>> Queue user: ${message.author.username} in guild: ${message.guild?.name}`
    );
    if (!message.guild?.id) {
      return;
    }
    if (message.guild?.id && hasPlayer(message.guild?.id)) {
      const queue = playerGetQueue(message.guild?.id);
      //   if (queue.length == 0) return;
      const paginatedQueue = new PaginatedQueue<ITrack>(queue);
      const queueMessage = await (message.channel as TextChannel).send({
        embeds: [refreshTemplate(paginatedQueue)],
      });
      refreshEmoji(queueMessage, paginatedQueue);
      addPageListener(queueMessage, paginatedQueue);
    } else {
      message.reactions.removeAll().catch();
      emojiReact({ message, emoji: "poop" });
    }
  },
};
const queueTemplateEmbed = {
  color: 0x0099ff,
  title: "Playlist",
  author: {
    name: "victor",
    icon_url: "https://cdn.discordapp.com/embed/avatars/1.png",
  },
};

const refreshTemplate = (paginatedQueue: PaginatedQueue<ITrack>) => {
  const items = paginatedQueue.items;
  const description: string = items.reduce((prev, curr, i) => {
    return (
      prev +
      `**${
        i + 1 + (paginatedQueue.currentPage - 1) * paginatedQueue.pageSize
      }.** ${curr.name}\n`
    );
  }, "");
  return {
    description,
    ...queueTemplateEmbed,
    footer: {
      text: `Page ${paginatedQueue.currentPage}/${paginatedQueue.totalPages}`,
    },
  };
};
const refreshEmoji = async (
  message: Message,
  paginatedQueue: PaginatedQueue<any>
) => {
  await removeUserReactions(message);
  // emoji react to the queue message
  await emojiReact({ message: message, emoji: PREV_EMOJI });
  await emojiReact({ message: message, emoji: NEXT_EMOJI });
};
const queueReactfilter = (reaction: MessageReaction, user: User): boolean => {
  return Boolean(
    !user.bot &&
      reaction?.emoji?.name &&
      [getEmoji(PREV_EMOJI), getEmoji(NEXT_EMOJI)].includes(reaction.emoji.name)
  );
};

const addPageListener = (
  message: Message,
  paginatedQueue: PaginatedQueue<ITrack>
) => {
  message
    .awaitReactions({
      filter: queueReactfilter,
      max: 1,
      time: 60000,
      errors: ["time"],
    })
    .then((collected) => {
      const reaction = collected.first();
      if (reaction?.emoji.name === getEmoji(PREV_EMOJI)) {
        paginatedQueue.previousPage();
      } else if (reaction?.emoji.name === getEmoji(NEXT_EMOJI)) {
        paginatedQueue.nextPage();
      }
      message.edit({
        embeds: [EmbedBuilder.from(refreshTemplate(paginatedQueue))],
      });
      refreshEmoji(message, paginatedQueue);
      addPageListener(message, paginatedQueue);
    })
    .catch((err) => {
      message.reactions.removeAll();
    });
};

const removeUserReactions = async (message: Message) => {
  const botUser = message.client.user;
  const reactionManager = message.reactions;
  reactionManager.cache.forEach(async (reaction) => {
    const users = await reaction.users.fetch(); // Fetch all users who reacted to this reaction
    users.forEach(async (user) => {
      if (user.id === botUser.id) {
        // Skip reactions made by the bot itself
        return;
      }

      await reaction.users.remove(user); // Remove the user's reaction
    });
  });
};
