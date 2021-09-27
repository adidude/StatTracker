import { Client, Intents, Interaction } from 'discord.js';
import { token } from './config/config.json';
import { Player } from 'discord-player';
import { userMention } from '@discordjs/builders';

console.log('Connecting...');

const client = new Client({ intents: [Intents.FLAGS.GUILD_INTEGRATIONS, Intents.FLAGS.GUILD_VOICE_STATES] });
const player = new Player(client);

player.on('trackStart', (queue, track) => queue.metadata.channel.send(`🎶 | Now playing **${track.title}**!`));

client.on('ready', () =>
{
	console.log('Connected!');
});

client.on('interactionCreate', async (interact) =>
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
async function play(interact: Interaction)
{
	const voiceChannelID = interact.member?.voice?.channelId;
	if (voiceChannelID == null && client.uptime < 1800000)
	{
		return interact.reply({ content: userMention(interact.user.id) + ' The bot was recently restarted and needs you to perform any voice action(mute/unmute) to find your voice channel' });
	}
	else if (!voiceChannelID)
	{
		return await interact.reply({ content: 'You are not in a voice channel!', ephemeral: true });
	}

	if (interact.guild.me != null && interact.guild.me.voice != null)
	{
		if (interact.guild.me.voice.channelId && voiceChannelID !== interact.guild.me.voice.channelId)
		{
			return await interact.reply({ content: 'You are not in my voice channel!', ephemeral: true });
		}
	}

	const query = interact.options.get('query').value;
	const queue = player.createQueue(interact.guild, {
		metadata: {
			channel: interact.channel,
		},
	});

	// verify vc connection
	try
	{
		const voiceChannel = await interact.guild.channels.fetch(voiceChannelID);
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

client.login(token);