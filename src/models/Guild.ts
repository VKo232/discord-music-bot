import mongoose from 'mongoose';

const guildSchema = new mongoose.Schema({
    guildId: { type: String, required: true, unique: true },
    voiceChannelId: { type: String },
    textChannelId: {type:String},
});

const GuildModel = mongoose.model('Guild', guildSchema);

export default GuildModel;
