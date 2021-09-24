// Only needs to be run once to register new commands.
import { SlashCommandBuilder } from '@discordjs/builders';
import { Client, Intents } from 'discord.js';
import { guildID, token } from './config/config.json';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';

// All commands can be added here. This is here to store an array of commands to register
const actions = [
	new SlashCommandBuilder().setName('test').setDescription('Tests absolutly nothing'),
	new SlashCommandBuilder().setName('test1').setDescription('Tests another command'),
].map(command => command.toJSON());

const client = new Client({ intents: [ Intents.FLAGS.GUILDS ] });

client.on('ready', () =>
{
	registerCommands();
});

async function registerCommands()
{
	const rest = new REST({ version: '9' }).setToken(token);

	try
	{
		await rest.put(
			Routes.applicationGuildCommands(client.application!.id, guildID),
			{ body: actions },
		);
		client.destroy();
	}
	catch (err)
	{
		console.log(err);
	}
}

client.login(token);