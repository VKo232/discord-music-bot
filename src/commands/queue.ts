import {
  Client,
  EmbedBuilder,
  Message,
  MessageReaction,
  SlashCommandBuilder,
  TextChannel,
  User,
} from "discord.js";
import {
  addMessageReactListener,
  addReacts,
} from "../utils/misc/messageUtils";
import { Config } from "../config";
import { emojiReact } from "../utils/bot/bot-service";
import { getEmoji } from "../utils/misc/emojiMapper";
import { PaginatedQueue } from "../utils/misc/paginator";
import { hasPlayer, playerGetQueue } from "../utils/player/player-service";

const PREV_EMOJI = "arrow_backward";
const NEXT_EMOJI = "arrow_forward";
const prefix = Config.prefix;
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
      if (queue.length == 0) {
        (message.channel as TextChannel).send({
          embeds: [
            {
              ...queueTemplateEmbed,
              description: `0 items in the queue!!!\n Add some using the ${prefix}p or ${prefix}play command`,
            },
          ],
        });
        return;
      }
      const paginatedQueue = new PaginatedQueue<ITrack>(queue);
      const queueMessage = await (message.channel as TextChannel).send({
        embeds: [getRefreshTemplate(paginatedQueue)()],
      });
      addReacts(queueMessage, [PREV_EMOJI, NEXT_EMOJI]);
      addMessageReactListener(
        queueMessage,
        queueReactfilter,
        60000,
        getReactHandler(paginatedQueue,queueMessage,),
      );
    } else {
      message.reactions.removeAll().catch();
      emojiReact({ message, emoji: "poop" });
    }
  },
};
const getRefreshTemplate = (paginatedQueue: PaginatedQueue<ITrack>) => {
  return () => {
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
  }
}

const getReactHandler = (paginatedQueue: PaginatedQueue<ITrack>,message:Message) => {
  return (reaction: MessageReaction | undefined) => {
    if (reaction?.emoji.name === getEmoji(PREV_EMOJI)) {
      paginatedQueue.previousPage();
    } else if (reaction?.emoji.name === getEmoji(NEXT_EMOJI)) {
      paginatedQueue.nextPage();
    }
    message.edit({
      embeds: [EmbedBuilder.from(getRefreshTemplate(paginatedQueue)())],
    });
  };
};
const queueTemplateEmbed = {
  color: 0x0099ff,
  title: "Playlist",
};

const queueReactfilter = (reaction: MessageReaction, user: User): boolean => {
  return Boolean(
    !user.bot &&
      reaction?.emoji?.name &&
      [getEmoji(PREV_EMOJI), getEmoji(NEXT_EMOJI)].includes(reaction.emoji.name)
  );
};
