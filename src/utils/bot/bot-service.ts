import GuildModel from "src/models/Guild";
import { TextChannel } from 'discord.js';

import { joinVoiceChannel,getVoiceConnection } from "@discordjs/voice";
import { InternalDiscordGatewayAdapterCreator } from "discord.js";
import {client} from '../../index';

export const joinChannel = async (
  voiceChannelID: string,
  guildID: string,
  voiceAdapterCreator: InternalDiscordGatewayAdapterCreator,
  textChannelID: string
) => {
  const guild = await GuildModel.findOneAndUpdate(
    { guildId: guildID },
    { voiceChannelId: voiceChannelID, textChannelId: textChannelID },
    { new: true, upsert: true }
  );
  if (!guild.voiceChannelId && client?.client?.channels?.cache?.get(textChannelID) ) {
    (client.client.channels.cache.get(textChannelID) as TextChannel).send("no channel or guildID");
    console.log("no channel or guildID");
    return;
  }

  const connection = joinVoiceChannel({
    channelId: voiceChannelID,
    guildId: guildID,
    adapterCreator: voiceAdapterCreator,
  });
};

export const leaveChannel = async (guildID: string) => {
  const guild = await GuildModel.findOneAndUpdate(
    { guildId: guildID },
    { voiceChannelId: undefined },
    { new: true }
  );
  
  if (!guild?.voiceChannelId) {
      return;
  }
  const connection = getVoiceConnection(guildID);
  if(!connection) {
    return;
  }
  await connection.destroy(); // disconnect
  console.log(`Left ${guild.voiceChannelId} in ${guild.guildId}`);
};
