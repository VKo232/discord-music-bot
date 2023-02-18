import { Client, GatewayIntentBits, Collection } from 'discord.js';
import { readdirSync } from 'fs';
import { join } from 'path';

import { Config } from './config';

interface LoaderClient {
    client: Client;
    commands: Collection<any, any>;
}

const options = { intents: [GatewayIntentBits.Guilds,GatewayIntentBits.GuildMessages] };
export const client: LoaderClient = { client: new Client(options), commands: new Collection() };

const loadCommands = (directory: string) => {
    readdirSync(directory)
        .filter((file) => file.endsWith('.ts'))
        .forEach((file) => {
            const command = require(join(directory, file));
            if ('data' in command && 'execute' in command) {
                client.commands.set(command.data.name, command);
            } else {
                console.log(`[WARNING] The command at ${file} is missing a required "data" or "execute" property.`);
            }
        });
};

const loadEvents = (directory: string) => {
    readdirSync(directory)
        .filter((file) => file.endsWith('.ts'))
        .forEach((file) => {
            const event = require(join(directory, file));
            if (event.once) {
                client.client.once(event.name, (...args) => event.execute(...args));
            } else {
                client.client.on(event.name, (...args) => event.execute(...args));
            }
        });
};

loadCommands(join(__dirname, 'commands'));
loadEvents(join(__dirname, 'events'));

client.client.login(Config.token);
