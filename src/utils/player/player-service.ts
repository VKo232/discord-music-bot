import { CustomPlayer } from "./player";
const allPlayers: Map<string, CustomPlayer> = new Map<string, CustomPlayer>();

export const getPlayer = async (guildID: string) => {
  if (!hasPlayer(guildID)) {
    const newPlayer = await CustomPlayer.createPlayer(guildID);
    allPlayers.set(guildID, newPlayer);
    return newPlayer;
  } else {
    return allPlayers.get(guildID);
  }
};

export const hasPlayer = (guildID: string) => {
  return allPlayers.has(guildID);
};

export const playerAddTracks = (guildID: string, tracks: ITrack[]) => {
  allPlayers.get(guildID)?.add(tracks);
  allPlayers.get(guildID)?.unpause();
};

export const playerClearQueue = (guildID: string) => {
  allPlayers.get(guildID)?.clearQueue();
};

export const playerSkip = (guildID: string) => {
  allPlayers.get(guildID)?.unpause();
  allPlayers.get(guildID)?.skip();
};

export const playerNowPlaying = (
  guildID: string
): INowPlaying | null | undefined => {
  return allPlayers.get(guildID)?.nowPlaying();
};
export const playerGetQueue = (guildID: string): ITrack[] => {
  return allPlayers.get(guildID) ? allPlayers.get(guildID)!.getQueue() : [];
};
export const playerPause = (guildID: string) => {
  allPlayers.get(guildID)?.pause();
};
export const playerUnpause = (guildID: string) => {
  allPlayers.get(guildID)?.unpause();
};
export const playerRemove = (guildID: string, index: number) => {
  allPlayers.get(guildID)?.remove(index);
};
export const playerMove = (guildID: string, index:number) => {
  allPlayers.get(guildID)?.move(index);
}
export const playerLoopQueue = (guildID: string) => {
  allPlayers.get(guildID)?.loopQueue();
}
export const playerLoopSong = (guildID: string) => {
  allPlayers.get(guildID)?.loopCurrSong();
}
export const playerDestroy = (guildID: string) => {
  const thisPlayer = allPlayers.get(guildID);
  if (thisPlayer) {
    thisPlayer.destroy();
  }
};
