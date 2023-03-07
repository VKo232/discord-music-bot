import {
  createAudioPlayer,
  AudioPlayerStatus,
  AudioPlayer,
  getVoiceConnection,
  createAudioResource,
  NoSubscriberBehavior,
} from "@discordjs/voice";
import play from "play-dl";
import { sendMessage } from "../bot/bot-service";
import { getYTlink } from "./youtube-api";

export class CustomPlayer {
  private static allPlayers: Map<string, CustomPlayer> | null;

  private guildID: string;
  private audioPlayer: AudioPlayer | null = null;
  private queue: ITrack[] = [];
  private currSong: NowPlaying | null = null;

  private constructor(guildID: string) {
    console.log("creating player");
    this.guildID = guildID;
    if (!CustomPlayer.allPlayers!.has(guildID)) {
      this.setupAudioPlayer();
    }
  }

  static getPlayer = (guildID: string) => {
    let currPlayer = null;
    if (!CustomPlayer.allPlayers) {
      CustomPlayer.allPlayers = new Map<string, CustomPlayer>();
    }
    if (!CustomPlayer.allPlayers.has(guildID)) {
      currPlayer = new CustomPlayer(guildID);
      CustomPlayer.allPlayers.set(guildID, currPlayer);
    } else {
      currPlayer = CustomPlayer.allPlayers.get(guildID);
    }
    return currPlayer;
  };

  add = async (tracks: ITrack[]) => {
    console.log("adding tracks", tracks.length);
    await this.setupAudioPlayer();
    this.queue = this.queue.concat(tracks);
    console.log("added tracks", tracks.length);
    if (!this.currSong) {
      console.log("keeping it up, add more songs");
      await this.playNext();
    }
  };

  private async setupAudioPlayer() {
    console.log("setting up audio player");
    if (this.audioPlayer) {
      const connection = getVoiceConnection(this.guildID);
      connection?.subscribe(this.audioPlayer);
      return;
    }
    this.audioPlayer = createAudioPlayer({
      behaviors: {
        noSubscriber: NoSubscriberBehavior.Play,
      },
    });
    const connection = getVoiceConnection(this.guildID);
    if (!connection || !this.audioPlayer) {
      console.log("no connection or audio player D:");
      return;
    }
    connection.subscribe(this.audioPlayer);
    this.audioPlayer.on("error", async (error) => {
      console.error(`Error: with resource `);
      await this.playNext();
    });
    this.audioPlayer.on(AudioPlayerStatus.Idle, async () => {
      console.log("audio player idling");
      setTimeout(async () => {
        if (this.audioPlayer?.state.status === AudioPlayerStatus.Idle) {
          this.currSong = null;
          await this.playNext();
            }
      }, 500); // wait for .5s before skipping
    
    });
    this.audioPlayer.on(AudioPlayerStatus.Playing, () => {
      console.log("playing");
    });
    this.audioPlayer.on(AudioPlayerStatus.Buffering, () => {
      console.log("audio player buffering");
    });
    this.audioPlayer.on(AudioPlayerStatus.Paused, () => {
      console.log("audio player paused");
    });
    console.log("done setting up");
  }

  private async playNext() {
    console.log("play next pls", this.queue.length);
    if (!this.queue.length) {
      return;
    }
    do {
      let newSong = this.queue.shift();
      if (!newSong) {
        return;
      }
      console.log("wow its ", newSong.name);

      let ytlink = await getYTlink(newSong);
      if (ytlink) {
        console.log("got yt link", ytlink);
        this.currSong = { ...newSong, ytlink };
        var stream = await play.stream(ytlink,{discordPlayerCompatibility: true});
        let resource = createAudioResource(stream.stream, {
          inputType: stream.type,
          inlineVolume: true 
        });
        resource.volume?.setVolume(0.5);
        await this.setupAudioPlayer();
        if (this.audioPlayer) {
          console.log("playing audio resource");
          this.audioPlayer.play(resource);
        }
        console.log("trying best to play");
      } else {
        console.log("error getting song", newSong);
        sendMessage({
          message: "can't play " + newSong.name,
          guildID: this.guildID,
        });
      }
    } while (this.currSong == null && this.queue.length);
  }

  async skip() {
    console.log("skipping song");
    this.audioPlayer?.stop();
    // this.audioPlayer = null;
    // this.playNext();
  }

  static destroy(guildID: string) {
    const thisPlayer = CustomPlayer.allPlayers?.get(guildID);
    if (thisPlayer) {
      thisPlayer.audioPlayer?.stop();
    }
    CustomPlayer.allPlayers?.delete(guildID);
  }
}
