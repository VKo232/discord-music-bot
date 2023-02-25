import {  Message } from "discord.js";
import { Config } from "../config";
import { client } from '../index';

const {prefix} = Config;

module.exports = {
	name: "messageCreate",
	execute(message: Message) {
		const commands = client.commands;
        if (!message.content.startsWith(prefix) || message.author.bot) return;
        const args: any[] = message.content.slice(prefix.length).split(/ +/).filter(arg => arg !== '');
        const directive = args.shift().toLowerCase();
        const command = commands.get(directive);
		try {
			command.execute(client.client, message,args);
		} catch (error) {
			console.error(`Error executing ${command.commandName}`);
			console.error(error);
		}
        
    }
}