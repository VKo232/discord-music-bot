interface Config {
  token: string;
  prefix: string;
  clientID: string;
  guildId: string;
  channelID: string;
  role: string;
  webhook: string;
  MONGODB_URI: string;
  DB_NAME: string;
  SPOTIFY_CLIENT_ID: string;
  SPOTIFY_CLIENT_SECRET: string;
  LAVASFY_ID: string;
  LAVASFY_HOST: string;
  LAVASFY_PORT: number;
  LAVASFY_PASSWORD: string;
  LAVASFY_SECURE: boolean;
  GOOGLE_API_KEY: string;
}

interface ITrack {
  name: string;
  artists: string[];
  source: string;
}
interface ParsedSongType {
  requestType: string; // spotify, search, youtube
  link: string;
}

interface NowPlaying {
  name: string;
  artists: string[];
  source:string;
  ytlink: string;
}