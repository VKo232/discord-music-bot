import {
  createAudioPlayer,
  AudioPlayerStatus,
  AudioPlayer,
  getVoiceConnection,
} from "@discordjs/voice";
import play from "play-dl";



export class CustomPlayer {
  static allPlayers: Map<string, CustomPlayer> | null;

  audioPlayer: AudioPlayer | null = null;
  queue: ITrack[] = [];
  private constructor(guildID:string) {
    if(!CustomPlayer.allPlayers!.has(guildID)) {
      this.audioPlayer = createAudioPlayer();
    }

  }
  add = (tracks:ITrack[]) => {
    this.queue.concat(tracks);
  }
  
  static getPlayer = (guildID: string) => {
    let currPlayer = null;
    if(!CustomPlayer.allPlayers) {
      CustomPlayer.allPlayers = new Map<string, CustomPlayer>();
    }
    if(!CustomPlayer.allPlayers.has(guildID)) {
       currPlayer = new CustomPlayer(guildID);
       CustomPlayer.allPlayers.set(guildID,currPlayer);
    } else {
      currPlayer = CustomPlayer.allPlayers.get(guildID);
    }
    return currPlayer;
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
