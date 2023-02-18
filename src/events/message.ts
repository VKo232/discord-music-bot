import { Client, Message } from "discord.js";
import { Config } from "../config";

const {prefix} = Config;

module.exports = {
	name: "messageCreate",
	once: true,
	execute(message: Message, commands: any) {
        if (!message.content.startsWith(prefix) || message.author.bot) return;
        const args: any[] = message.content.slice(prefix.length).split(/ +/).filter(arg => arg !== '');
        const directive = args.shift().toLowerCase();
        const command = commands.get(directive);
		// try {
		// 	await command.execute(interaction);
		// } catch (error) {
		// 	console.error(`Error executing ${interaction.commandName}`);
		// 	console.error(error);
		// }
        
    }
}