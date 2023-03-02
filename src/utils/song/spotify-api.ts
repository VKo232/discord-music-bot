import { Config } from "../../config";
import axios from "axios";

interface ITrack {
  name: string;
  artists: string[];
  source: string;
}

let expired_at = 0;
let token = "";

const refreshToken = async () => {
  if (new Date().getTime() > expired_at) {
    let request = {
      url: "https://accounts.spotify.com/api/token",
      headers: {
        Authorization:
          "Basic " +
          Buffer.from(
            Config.SPOTIFY_CLIENT_ID + ":" + Config.SPOTIFY_CLIENT_SECRET
          ).toString("base64"),
        "Content-Type": "application/x-www-form-urlencoded",
      },
      data: "grant_type=client_credentials",
      method: "post",
      json: true,
    };

    try {
      let res = await axios(request);
      console.log(res.status);
      console.log(res?.data);
      if (
        res.status === 200 &&
        res?.data?.access_token &&
        res?.data?.expires_in
      ) {
        token = res?.data?.access_token;
        expired_at = new Date().getTime() + res?.data?.expires_in;
        console.log("refreshed token");
        return true;
      }
    } catch (err) {
      console.log("fetching spotify token", err);
    }
    return false;
  } else {
    return true;
  }
};

const getspotID = (link: string): string | null => {
  const regex = /(album|playlist|track)\/([a-zA-Z0-9]+)(\?.*)?$/; // matches after /track|album|playlist
  const match = link.match(regex);
  if (match && match[2]) {
    return match[2];
  } else {
    return null;
  }
};

// gets data in the form of {[artists: string], songname:string}
const getTrackInfo = async (trackId: string) => {
  let isvalid = await refreshToken();
  if (isvalid) {
    try {
      console.log(trackId);
      const response = await axios.get(
        `https://api.spotify.com/v1/tracks/${trackId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const artists = response.data.artists.map((artist: any) => artist.name);
      const name = response.data.name;
      const res = {
        artists,
        name,
        source: `https://open.spotify.com/track/${response.data.id}`,
      };

      return [res];
    } catch (err) {
      // console.log("get track info err", err);
    }
  }
  return [];
};

const getPlaylistInfo = async (playlistId: string) => {
  let isvalid = await refreshToken();
  if (isvalid) {
    try {
      const tracks: ITrack[] = [];
      const { data } = await axios.get(`https://api.spotify.com/v1/playlists/${playlistId}`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { fields: 'name,tracks,next' }
      });
      tracks.push(
        ...data.tracks.items.map((item: any) => {
          const { name, id } = item.track;
          const artists = item.track.artists.map(
            (artist: any) => artist.name
          );
          const source = `https://open.spotify.com/track/${id}`;
          return { name, artists, source };
        })
      );
      
      let nextUrl: string | null = data.tracks.next;
      while (nextUrl) {
        const { data: nextData } = await axios.get(nextUrl, {
          headers: { Authorization: `Bearer ${token}` },
          params: {
            fields: "items(track(name,artists,id))",
            limit: 100,
            offset: tracks.length,
          },
        });
        nextUrl = nextData.next;
        tracks.push(
          ...nextData.items.map((item: any) => {
            const { name, id } = item.track;
            const artists = item.track.artists.map(
              (artist: any) => artist.name
            );
            const source = `https://open.spotify.com/track/${id}`;
            return { name, artists, source };
          })
        );
      }
      return tracks;
        } catch (err) {
      console.log("error in get playlist info", err);
    }
  }
  return [];
};

const getAlbumTracks = async (albumId: string) => {
  let isvalid = await refreshToken();
  if (isvalid) {
    try {
      const response = await axios.get(
        `https://api.spotify.com/v1/albums/${albumId}/tracks`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data.tracks.items.map((item: any) => ({
        name: item.name,
        artists: item.artists.map((artist: any) => ({ name: artist.name })),
        source: `https://open.spotify.com/track/${item.id}`,
      }));
    } catch (error) {
      console.error(error);
    }
  }
  return [];
};

export const getSpotifyTracks = async (link: string) => {
  const regex = /(album|playlist|track)\/([a-zA-Z0-9]+)(\?.*)?$/; // matches after /track|album|playlist
  const match = link.match(regex);
  console.log(match);
  let response: ITrack[] = [];
  if (match && match[1]) {
    if (match[1] === "album") {
      response = await getAlbumTracks(getspotID(link)!);
    } else if (match[1] === "playlist") {
      response = await getPlaylistInfo(getspotID(link)!);
    } else if (match[1] === "track") {
      response = await getTrackInfo(getspotID(link)!);
    }
    return response;
  } else {
    return [];
  }
};

// const testfunc = async (link: string) => {
//   let a = await getSpotifyTracks(link);
//   console.log(a.length);
// };
// testfunc("https://open.spotify.com/playlist/1OQyCPtrjjjDM8JB4JBRLA");
