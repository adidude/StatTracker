import { Client, Intents, Interaction, CommandInteraction } from 'discord.js';
import { MusicPlayer } from './MusicPlayer';

import fs from 'fs';

console.log('Connecting...');

const client : Client = new Client({ intents: [Intents.FLAGS.GUILD_INTEGRATIONS, Intents.FLAGS.GUILD_VOICE_STATES] });

const musicHandler : MusicPlayer = new MusicPlayer(client);

client.on('ready', () => {
	console.log('Connected!');
});

client.on('interactionCreate', async (interact : Interaction) => {
	const chatChan = await interact.channelId;
	const isCmd : boolean = interact.isCommand();
	if (!chatChan) {
		console.log('Channel does not exist');
		return;
	}
	else if (isCmd) {
		const interactCmd = interact as CommandInteraction;
		if (isCmd && (chatChan == '389927870660870144' || chatChan == '867917110188343349')) {
			switch (interactCmd.commandName) {
			case 'play':
				await musicHandler.play(interactCmd);
				break;
			case 'skip':
				musicHandler.skip(interactCmd);
				break;
			}
		}
	}
	else {
		console.log('Command does not exist');
	}


});

const path = __dirname + '\\config';

if (fs.existsSync(path)) {
	let token;
	fs.readFile(path + '\\config.json', 'utf8', (err, data) => {
		if (err) {
			console.error(err);
			return;
		}
		token = JSON.parse(data).token;
		client.login(token);
	});
}
else {
	client.login(process.env.token);
}