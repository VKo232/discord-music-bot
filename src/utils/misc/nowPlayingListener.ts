import { Message, MessageCollector, MessageReaction, ReactionCollector, TextChannel, User } from "discord.js";
import { client } from "../../index";
import GuildModel from "../../models/Guild";
import { playerPause, playerSkip, playerUnpause } from "../player/player-service";
import { getEmoji } from "./emojiMapper";
import { addMessageReactListener, addReacts } from "./messageUtils";

const RESUME_EMOJI = 'arrow_forward';
const PAUSE_EMOJI = 'pause_button';
const SKIP_EMOJI = 'track_next';

export class NowPlayingListener {
  private message: Message | null;
  private textChannelID: string;
  private msgCollector: MessageCollector | null;
  private reactionCollector: ReactionCollector | null;
  private isOld: boolean;
  private guildID="";

  private constructor(textChannelID: string, guildID: string) {
    this.message = null;
    this.textChannelID = textChannelID;
    this.msgCollector = (
      client.client.channels.cache.get(textChannelID) as TextChannel
    )?.createMessageCollector({ time: 1000 * 60 * 60 * 10 });
    this.isOld = true;
    this.msgCollector.on("collect", (message) => {
      this.isOld = this.isOld || !message.author.bot;
    });
    this.reactionCollector = null;
    this.guildID = guildID;
  }

  public static async createNowPlayingListener(guildID: string) {
    const guild = await GuildModel.findOne({ guildId: guildID });
    if (guild?.textChannelId && guildID) {
      return new NowPlayingListener(guild.textChannelId, guildID);
    }
    return null;
  }

  public async onNewSong(song: INowPlaying) {
    if (this.isOld) {
      this.sendNewMessage(song);
    } else {
      this.updateMessage(song);
    }
  }

  private async sendNewMessage(song: INowPlaying) {
    this.message = await (
      client.client.channels.cache.get(this.textChannelID) as TextChannel
    ).send({
      embeds: [createNowPlayingEmbed(song)],
    });
    if(this.message) {
      this.reactionCollector?.stop("new message");
      this.reactionCollector = await addMessageReactListener(this.message,nowPlayingReactfilter,1000 * 60 * 60 * 3,getOnReaction(this.guildID))
      addReacts(this.message,[RESUME_EMOJI,PAUSE_EMOJI,SKIP_EMOJI]);
    }
    this.isOld = false;
  }

  private updateMessage(song: INowPlaying) {
    this.message?.edit({
      embeds: [createNowPlayingEmbed(song)],
    });
  }

  public onDelete() {
    this.msgCollector?.stop();
    this.reactionCollector?.stop();
  }
  
}

const getOnReaction = (guildID: string) => {
  return (reaction: MessageReaction | undefined) => {
    if (reaction?.emoji.name === getEmoji(RESUME_EMOJI)) {
      playerUnpause(guildID);
    } else if (reaction?.emoji.name === getEmoji(PAUSE_EMOJI)) {
      playerPause(guildID);
    } else if (reaction?.emoji.name === getEmoji(SKIP_EMOJI)) {
      playerSkip(guildID);
    }
  
  }
}

const createNowPlayingEmbed = (song: INowPlaying) => {
  let newEmbed = nowPlayingEmbedTemplate;
  newEmbed.fields[0].value = song.name;
  newEmbed.fields[1].value = song.artists.join(" - ");
  newEmbed.footer.text = song.ytlink;
  return newEmbed;
};

const nowPlayingEmbedTemplate = {
  color: 0x0099ff,
  title: "Now Playing",
  fields: [
    {
      name: "",
      value: "No Name",
      inline: false,
    },
    {
      name: "",
      value: "Unknown",
      inline: false,
    },
  ],
  footer: {
    text: "",
  },

};
const nowPlayingReactfilter = (reaction: MessageReaction, user: User): boolean => {
  return Boolean(
    !user.bot &&
      reaction?.emoji?.name &&
      [getEmoji(PAUSE_EMOJI), getEmoji(SKIP_EMOJI),getEmoji(RESUME_EMOJI)].includes(reaction.emoji.name)
  );
};