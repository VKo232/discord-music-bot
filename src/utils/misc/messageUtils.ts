import {
  APIEmbed,
  CollectorFilter,
  EmbedBuilder,
  JSONEncodable,
  Message,
  MessageReaction,
  User,
} from "discord.js";
import { emojiReact } from "../bot/bot-service";

export const removeUserReactions = async (message: Message) => {
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

export const addMessageReactListener = (
  message: Message,
  filter: CollectorFilter<[MessageReaction, User]> | undefined,
  idle: number,
  onReaction: (reaction: MessageReaction | undefined) => void
) => {
  const collector = message.createReactionCollector({ filter, idle });
  collector.on("collect", (reaction, user) => {
    collector.resetTimer();
    removeUserReactions(message);
    onReaction(reaction);
  });
  collector.on("end", (reason) => {
    message.reactions.removeAll();
  });
  return collector;
};
export const addReacts = async (message: Message, emojis: string[]) => {
  await removeUserReactions(message);
  // emoji react to the queue message
  emojis.forEach(async (emoji) => {
    await emojiReact({ message: message, emoji });
  });
};
