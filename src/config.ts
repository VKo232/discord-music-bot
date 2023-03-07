import * as dotenv from 'dotenv'
dotenv.config();

const Config = {
  token: process.env.token,
  prefix: process.env.prefix,
  clientID: process.env.clientID,
  guildId: process.env.guildId,
  channelID: process.env.channelID,
  webhook: process.env.webhook,
  MONGODB_URI:process.env.MONGODB_URI,
  DB_NAME:process.env.DB_NAME,
  SPOTIFY_CLIENT_ID: process.env.SPOTIFY_CLIENT_ID,
  SPOTIFY_CLIENT_SECRET: process.env.SPOTIFY_CLIENT_SECRET,
  GOOGLE_API_KEY:process.env.GOOGLE_API_KEY,
};
export {Config}
  