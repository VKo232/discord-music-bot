import { CustomPlayer } from "./player";
const allPlayers: Map<string, CustomPlayer> = new Map<string, CustomPlayer>();

export const getPlayer = (guildID: string) => {
  if (!hasPlayer(guildID)) {
    const newPlayer = new CustomPlayer(guildID);
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

export const playerPause = (guildID: string) => {
  allPlayers.get(guildID)?.pause();
};
export const playerUnpause = (guildID: string) => {
  allPlayers.get(guildID)?.unpause();
};
export const playerDestroy = (guildID: string) => {
  const thisPlayer = allPlayers.get(guildID);
  if (thisPlayer) {
    thisPlayer.destroy();
  }
};
