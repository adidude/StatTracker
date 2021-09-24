import { Client, Intents, Interaction } from 'discord.js';
import { token } from './config/config.json';

console.log('Connecting...');

const client = new Client({ intents: [Intents.FLAGS.GUILD_INTEGRATIONS] });

client.on('ready', () =>
{
	console.log('Connected!');
});

client.on('interactionCreate', (interact: Interaction) =>
{
	if (interact.isCommand())
	{
		interact.reply('hola');
	}
});

client.login(token);