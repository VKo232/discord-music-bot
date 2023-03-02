import {
  createAudioPlayer,
  AudioPlayerStatus,
  AudioPlayer,
  getVoiceConnection,
} from "@discordjs/voice";
import play from "play-dl";
import PlayerModel from "src/models/Player";

type Track = {
  title: string;
  artists: string[];
  source: string;
  ytlink: string;
};

type CustomPlayer = {
  audioPlayer: AudioPlayer;
  queue: Track[];
};

const allPlayers = new Map<string, CustomPlayer>();

export const getPlayer = (guildID: string) => {
  let player = allPlayers.get(guildID);
  if (!player) {
    player = { audioPlayer: createAudioPlayer(), queue: [] };
    const connection = getVoiceConnection(guildID);
    if (!connection) {
      return null;
    }
    connection.subscribe(player.audioPlayer);
  }

  player.audioPlayer.on(AudioPlayerStatus.Playing, () => {});
  player.audioPlayer.on("error", (error) => {
    console.error(`Error: with resource `);
    // play next one
  });
  player.audioPlayer.on(AudioPlayerStatus.Idle, async () => {
    // play next one
    // make sure this only happens once
    // get queue from db
  });

  return player;
};
