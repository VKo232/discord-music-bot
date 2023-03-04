import GuildModel from "../../models/Guild";
import { TextChannel } from "discord.js";

import { joinVoiceChannel, getVoiceConnection, VoiceConnectionStatus } from "@discordjs/voice";
import { InternalDiscordGatewayAdapterCreator } from "discord.js";
import { client } from "../../index";
import { CustomPlayer } from "../song/player";

type sendMessageProp = {message:string, guildID: string};

export const sendMessage = async ({message,guildID}:sendMessageProp) => {
  
}

export const joinChannel = async (
  voiceChannelID: string,
  guildID: string,
  voiceAdapterCreator: InternalDiscordGatewayAdapterCreator,
  textChannelID: string
) => {
  // check if connection exists before joining call
  const connection = getVoiceConnection(guildID);
  if(!connection){
    const guild = await GuildModel.findOneAndUpdate(
      { guildId: guildID },
      { voiceChannelId: voiceChannelID, textChannelId: textChannelID },
      { new: true, upsert: true }
    );
    if (
      !guild.voiceChannelId &&
      client?.client?.channels?.cache?.get(textChannelID)
    ) {
      (client.client.channels.cache.get(textChannelID) as TextChannel).send(
        "no channel or server??"
      );
      console.log("no channel or guildID");
      return;
    }

    const connection = joinVoiceChannel({
      channelId: voiceChannelID,
      guildId: guildID,
      adapterCreator: voiceAdapterCreator,
    });
    connection.on(VoiceConnectionStatus.Disconnected, () =>{
      console.log("Disconnected from ",guildID);
      CustomPlayer.destroy(guildID);
    })
  }
};

export const leaveChannel = async (guildID: string) => {
  const guild = await GuildModel.findOneAndUpdate(
    { guildId: guildID },
    { voiceChannelId: undefined },
    { new: true }
  );
  const connection = getVoiceConnection(guildID);
  CustomPlayer.destroy(guildID);
  if (connection) {
    await connection.destroy(); // disconnect
  }

  console.log(`Left ${guild?.voiceChannelId} in ${guild?.guildId}`);
};
