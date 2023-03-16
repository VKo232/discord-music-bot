import { client } from "../../index";
type EmojiMap = {
    [discordEmoji: string]: string;
  };
  
export const getEmoji = (emojiName: string) => {
  if (discordToUnicodeMap[emojiName]) {
    return discordToUnicodeMap[emojiName];
  } else {
    return null;
  }
  // future code for getting emojis from a custom servers in the cache
//   client.client.emojis.cache.find((emoji) => emoji.name === emojiName);
};

const discordToUnicodeMap: { [discordEmoji: string]: string } = {
    "smile": "😊",
    "grinning": "😀",
    "blush": "😊",
    "wink": "😉",
    "heart_eyes": "😍",
    "thumbsup": "👍",
    "thumbsdown": "👎",
    "100": "💯",
    "fire": "🔥",
    "poop": "💩",
    "sob": "😭",
    "sunglasses": "😎",
    "thinking_face": "🤔",
    "zipper_mouth_face": "🤐",
    "robot": "🤖",
    "ghost": "👻",
    "skull": "💀",
    "muscle": "💪",
    "ok_hand": "👌",
    "raised_hands": "🙌",
    "pray": "🙏",
    "wave": "👋",
    "eyes": "👀",
    "star": "⭐️",
    "crown": "👑",
    "money_with_wings": "💸",
    "gem": "💎",
    // Add more Discord emojis and their corresponding Unicode emojis here
  };
  