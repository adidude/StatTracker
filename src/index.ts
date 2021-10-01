import { Client, CommandInteraction, GuildMember, Guild, Intents, Interaction, VoiceChannel } from 'discord.js';
import { Player } from 'discord-player';
import { userMention } from '@discordjs/builders';
import { Snowflake } from 'discord-api-types';
import fs from 'fs';

console.log('Connecting...');

const client = new Client({ intents: [Intents.FLAGS.GUILD_INTEGRATIONS, Intents.FLAGS.GUILD_VOICE_STATES] });
const player = new Player(client);

player.on('trackStart', (queue, track) =>
{
	const data: any = queue.metadata;
	if (data.channel != null)
	{
		data.channel.send(`🎶 | Now playing **${track.title}**!`);
	}
});

client.on('ready', () =>
{
	console.log('Connected!');
});

client.on('interactionCreate', async (interact : Interaction) =>
{
	const chatChan = await interact.channelId;
	const isCmd : boolean = interact.isCommand();
	if (!chatChan)
	{
		console.log('Channel does not exist');
		return;
	}
	else if (isCmd)
	{
		const interactCmd = interact as CommandInteraction;
		if (isCmd && (chatChan == '389927870660870144' || chatChan == '867917110188343349'))
		{
			switch (interactCmd.commandName)
			{
			case 'play':
				await play(interactCmd);
				break;
			}
		}
	}
	else
	{
		console.log('Command does not exist');
	}


});

// async function play(interact: Interaction)
async function play(interact: CommandInteraction)
{
	const requestee = await interact.member;
	if (!requestee)
	{
		return await interact.reply(userMention(interact.user.id) + ' was unable to retrieve data');
	}

	let voiceChannelID;
	if (requestee instanceof GuildMember)
	{
		voiceChannelID = await requestee.voice.channelId;
	}
	else
	{
		console.log('Object returned from below line is APIGuildMember: \nconst requestee = await interact.member;');
	}

	if (interact.guild?.me != null && interact.guild.me.voice != null)
	{
		if (interact.guild.me.voice.channelId && voiceChannelID !== interact.guild.me.voice.channelId)
		{
			return await interact.reply('You are not in my voice channel!');
		}
	}

	const queryHolder = interact.options.get('query');
	let query : string;
	if (queryHolder != null)
	{
		query = queryHolder.value as string;
	}
	else
	{
		return await interact.reply(userMention(interact.user.id) + ', I was unable to find that song');
	}

	if (!voiceChannelID)
	{
		return await interact.reply(userMention(interact.user.id) + 'I just got here man, you need to mute/unmute so I can figure out where you are');
	}

	const guild = interact.guild as Guild;
	const queue = player.createQueue(guild, {
		metadata: {
			channel: interact.channel,
		},
	});

	// verify vc connection
	try
	{
		const voiceChannel = await interact.guild?.channels.fetch(voiceChannelID) as VoiceChannel;
		if (!queue.connection) await queue.connect(voiceChannel);
	}
	catch
	{
		queue.destroy();
		return await interact.reply({ content: 'Could not join your voice channel!', ephemeral: true });
	}

	await interact.deferReply();
	const track = await player.search(query, {
		requestedBy: interact.user,
	}).then(x => x.tracks[0]);
	if (!track) return await interact.followUp({ content: `❌ | Track **${query}** not found!` });

	queue.play(track);

	return await interact.followUp({ content: `⏱️ | Loading track **${track.title}**!` });
}

const path = __dirname + '\\config';

if (fs.existsSync(path))
{
	let token;
	fs.readFile(path + '\\config.json', 'utf8', (err, data) =>
	{
		if (err)
		{
			console.error(err);
			return;
		}
		token = JSON.parse(data).token;
		client.login(token);
	});
}
else
{
	client.login(process.env.token);
}