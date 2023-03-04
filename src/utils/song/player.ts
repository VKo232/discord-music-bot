import {
  createAudioPlayer,
  AudioPlayerStatus,
  AudioPlayer,
  getVoiceConnection,
  createAudioResource,
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
    await this.setupAudioPlayer();
    this.queue.concat(tracks);
    if (!this.currSong) await this.playNext();
  };

  private async setupAudioPlayer() {
    if (this.audioPlayer) {
      return;
    }
    this.audioPlayer = createAudioPlayer();
    const connection = getVoiceConnection(this.guildID);
    if (!connection || !this.audioPlayer) {
      return;
    }
    connection.subscribe(this.audioPlayer);

    this.audioPlayer.on("error", async (error) => {
      console.error(`Error: with resource `);
      await this.playNext();
    });
    this.audioPlayer.on(AudioPlayerStatus.Idle, async () => {
      this.currSong = null;
      await this.playNext();
    });
  }

  private async playNext() {
    if (!this.queue.length) {
      return;
    }
    do {
      let newSong = this.queue.shift();
      if (!newSong) {
        return;
      }
      let ytlink = await getYTlink(newSong);
      if (ytlink) {
        this.currSong = { ...newSong, ytlink };
        var stream = await play.stream(ytlink);
        let resource = createAudioResource(stream.stream, {
          inputType: stream.type,
        });
        await this.setupAudioPlayer();
        if(this.audioPlayer){
          this.audioPlayer.play(resource);
        }

      } else {
        console.log("error getting song", newSong);
        sendMessage({
          message: "can't play " + newSong.name,
          guildID: this.guildID,
        });
      }
    } while (this.currSong == null && this.queue.length);
  }

  static destroy(guildID: string) {
    const thisPlayer = CustomPlayer.allPlayers?.get(guildID);
    if (thisPlayer) {
      thisPlayer.audioPlayer?.stop();
    }
    CustomPlayer.allPlayers?.delete(guildID);
  }
}

// export const getPlayer = (guildID: string) => {
//   let player = allPlayers.get(guildID);
//   if (!player) {
//     player = { audioPlayer: createAudioPlayer(), queue: [] };
//     const connection = getVoiceConnection(guildID);
//     if (!connection) {
//       return null;
//     }
//     connection.subscribe(player.audioPlayer);
//   }

//   player.audioPlayer.on(AudioPlayerStatus.Playing, () => {});
//   player.audioPlayer.on("error", (error) => {
//     console.error(`Error: with resource `);
//     // play next one
//   });
//   player.audioPlayer.on(AudioPlayerStatus.Idle, async () => {
//     // play next one
//     // make sure this only happens once
//     // get queue from db
//   });
//     // check if status is idle, if so play the first resource in the queue
//     console.log(player?.audioPlayer.state);
//     if (player?.audioPlayer.state) {
//     }
//   player.add = () => {

//   }
//   return player;

//       // var stream = await play.stream(
//     //   "https://www.youtube.com/watch?v=ybUJoVg0szU"
//     // ); // This will create stream from the above search

//     // let resource = createAudioResource(stream.stream, {
//     //   inputType: stream.type,
//     // });
//     // let player = createAudioPlayer({
//     //   behaviors: {
//     //     noSubscriber: NoSubscriberBehavior.Play,
//     //   },
//     // });
//     // player.play(resource);
//     // const connection = getVoiceConnection(guildID);
//     // connection?.subscribe(player);

// };
