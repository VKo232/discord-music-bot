import { REST, Routes } from 'discord.js';
import { Config } from'./config';
import fs from 'node:fs';
const { clientID, guildId, token } = Config;
const commands = [];
// Grab all the command files from the commands directory you created earlier
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.ts'));

// Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	commands.push(command.data.toJSON());
}

// Construct and prepare an instance of the REST module
const rest = new REST({ version: '10' }).setToken(token!);

// and deploy your commands!
(async () => {
	try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);

		// The put method is used to fully refresh all commands in the guild with the current set
		const data :any = await rest.put(
			Routes.applicationGuildCommands(clientID!, guildId!),
			{ body: commands },
		);

		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {
		// And of course, make sure you catch and log any errors!
		console.error(error);
	}
})();

//To deploy global commands, you can use the same script from the guild commands section and simply adjust the route in the script to .applicationCommands(clientId)
// await rest.put(
// 	Routes.applicationCommands(clientId),
// 	{ body: commands },
// );

