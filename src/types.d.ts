
declare interface Config {
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
  GOOGLE_API_KEY: string;
}

declare interface ITrack  {
  name: string;
  artists: string[];
  source: string;
}
declare interface ParsedSongType  {
  requestType: string; // spotify, search, youtube
  link: string;
}

declare interface INowPlaying  {
  name: string;
  artists: string[];
  source:string;
  ytlink: string;
}

declare interface sendMessageProp  {
  message: string;
  guildID: string;
  textChannel?: string;
};