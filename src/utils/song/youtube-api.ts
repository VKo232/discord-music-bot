// https://www.npmjs.com/package/ytdl-core

import { google } from "googleapis";
import { Config } from "../../config";

const youtube = google.youtube({
    version: "v3",
    auth: Config.GOOGLE_API_KEY,
});
  
export const getYTlink = async (track:ITrack) => {
  try{
    const query = track.name + ' ' + track.artists.join(' ');
    const searchParams = {
        part: ['id','snippet'],
        type: ["video"],
        q: query,
        maxResults: 1,
      };
    // const res = await youtube.search.list(searchParams);
    const res =await youtube.search.list(searchParams);
    if(res?.data?.items && res?.data?.items[0]?.snippet?.title) {
        const firstResult = res.data.items[0];
        return {snippet:firstResult!.snippet,url:`https://www.youtube.com/watch?v=${firstResult!.id!.videoId}`};
    }
  }catch(err) {
    console.log("error getting yt link for ", track);
  }
    return null;
}

const extractYoutubePlaylistId = (url: string) =>{
  const match = url.match(/list=([\w-]+)/);
  return match ? match[1] : null;
}

// TODO doesnt work
const getPlaylistInfo = async (playlistUrl: string)=> {
  const playlistId = extractYoutubePlaylistId(playlistUrl);
  if (!playlistId) {
    return [];
  }

  const response = await youtube.playlistItems.list({
    part: ['snippet'],
    id:[playlistId!],
    maxResults: 50 // Maximum number of videos to retrieve per API request
  });

  const playlist = response.data;

  if (!playlist) {
    throw new Error('Playlist not found');
  }

  const name = playlist.items[0].snippet.playlistTitle;
  const tracks = [];

  for (const item of playlist.items) {
    const videoId = item.snippet.resourceId.videoId;
    const videoInfo = await getVideoInfo(`https://www.youtube.com/watch?v=${videoId}`);
    const track = {
      name: videoInfo.title,
      artists: [videoInfo.channel],
      youtubeLink: videoInfo.youtubeLink
    };
    tracks.push(track);
  }

  return {
    name,
    tracks
  };
}

export const getYTTracks = async (link: string):Promise<ITrack[]> => {
  return []
}
export const searchYTTracks = async (link: string):Promise<ITrack[]> => {
  return []
}

// getYTlink({title:"all for nothing",artists:['lauv'],source:"blah",ytlink:"blah"})