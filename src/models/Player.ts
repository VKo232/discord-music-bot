import mongoose from "mongoose";

// TODO change meta to string
const song = new mongoose.Schema({
  title: String,
  artists: { type: [String] },
  source: String,
  ytlink: String,
});

const guildSchema = new mongoose.Schema({
  guildId: { type: String, required: true, unique: true },
  voiceChannelId: { type: String },
  textChannelId: { type: String },
  playlist: { type: [song], default: [] },
  nowPlaying: { type: song },
  isBotConnected: { type: Boolean, default: false },
  isPlayerConnected: { type: Boolean, default: false },
});

const PlayerModel = mongoose.model("Player", guildSchema);

export default PlayerModel;
