import {
  AudioPlayer,
  createAudioPlayer,
  createAudioResource,
  getVoiceConnection,
  NoSubscriberBehavior,
} from "@discordjs/voice";
import play from "play-dl";
import PlayerModel from "../../models/Player";
import { getPlayer } from "./player";
import * as spotapi from "./spotify-api";
import * as youtubeapi from "./youtube-api";


export const addSongs = async (
  channelID: string,
  guildID: string,
  args: string[]
) => {
  try {
    // parse argument string
    if (!(args.length > 0 && args[0].trim() !== "")) {
      return;
    }
    const player = getPlayer(guildID);
    if (!player) {
      console.log("ERROR: cant get player");
      return;
    }

    const parsed_song: ParsedSongType | null = parseArguments(args);
    // send arguments to be handled by the song handler
    if (parsed_song) {
      await addToQueue(parsed_song);
    } else {
      return;
    }

    // check if status is idle, if so play the first resource in the queue
    console.log(player?.audioPlayer.state);
    if (player?.audioPlayer.state) {
    }

    // var stream = await play.stream(
    //   "https://www.youtube.com/watch?v=ybUJoVg0szU"
    // ); // This will create stream from the above search

    // let resource = createAudioResource(stream.stream, {
    //   inputType: stream.type,
    // });
    // let player = createAudioPlayer({
    //   behaviors: {
    //     noSubscriber: NoSubscriberBehavior.Play,
    //   },
    // });
    // player.play(resource);
    // const connection = getVoiceConnection(guildID);
    // connection?.subscribe(player);
  } catch (err) {
    console.log("ERROR: addSongs", err);
  }
};

// checks if the link is spotify, youtube, otherwise search for it
const parseArguments = (args: string[]) => {
  const spotPattern =
    /^https?:\/\/open\.spotify\.com\/(playlist|album|track)\/([a-zA-Z0-9]+)(\?.*)?$/;
  const youPattern =
    /^https?:\/\/(www\.)?youtube\.com\/(watch\?v=[a-zA-Z0-9_-]+|playlist\?list=[a-zA-Z0-9_-]+)(\&.*)?$/;
  let parsed = null;
  if (spotPattern.test(args[0])) {
    const match = args[0].match(spotPattern);
    if (match) {
      parsed = {
        requestType: "spotify",
        link: args[0],
      };
    }
  } else if (youPattern.test(args[0])) {
    const match = args[0].match(youPattern);
    if (match) {
      parsed = {
        requestType: "youtube",
        link: args[0],
      };
    }
  } else {
    parsed = {
      requestType: "search",
      link: args.join(" "),
    };
  }
  return parsed;
};

/*
Adds all songs from the list into the db
*/
const addToQueue = async (parsedSong: ParsedSongType) => {
  let tracks: ITrack[] = [];
  if (parsedSong.requestType === "spotify") {
    tracks = await spotapi.getSpotifyTracks(parsedSong.link);
  } else if (parsedSong.requestType === "youtube") {
    tracks = await youtubeapi.getYTTracks(parsedSong.link);
  } else if (parsedSong.requestType === "search"){
    tracks = await youtubeapi.searchYTTracks(parsedSong.link);
  }
};
