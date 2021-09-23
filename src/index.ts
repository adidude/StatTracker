import { Client, Intents } from 'discord.js';
const key = require('../config/bot.js');

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.on('ready', () =>
{
	console.log('Logged in as bokemon!');
});

client.on('message', (msg) =>
{
	console.log('message detected');
	if (msg.author.bot)
	{
		return;
	}
	msg.reply('wasssup');
});

client.login(key.token);