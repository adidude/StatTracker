import { Client, CommandInteraction, Guild, GuildMember, Intents, Interaction, VoiceChannel } from 'discord.js';
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
	data.channel.send(`🎶 | Now playing **${track.title}**!`);
});

client.on('ready', () =>
{
	console.log('Connected!');
});

client.on('interactionCreate', async (interact : Interaction) =>
{
	if (interact.isCommand())
	{
		switch (interact.commandName)
		{
		case 'play':
			play(interact);
		}
	}
});

// async function play(interact: Interaction)
async function play(interact: CommandInteraction)
{
	const requestee : GuildMember = interact.member as GuildMember;
	let voiceChannelID : Snowflake;

	if (requestee != null && typeof requestee.voice.channelId == 'string')
	{
		voiceChannelID = requestee.voice.channelId;
	}
	else
	{
		return await interact.channel?.send(userMention(interact.user.id) + ' cannot get your voice channel, either join a channel or mute/unmute.');
	}

	if (interact.guild?.me != null && interact.guild.me.voice != null)
	{
		if (interact.guild.me.voice.channelId && voiceChannelID !== interact.guild.me.voice.channelId)
		{
			return await interact.channel?.send('You are not in my voice channel!');
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
		return await interact.channel?.send(userMention(interact.user.id) + ', I was unable to find that song');
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