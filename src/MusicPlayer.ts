import { GuildMember, Guild, VoiceChannel, Client, CommandInteraction, Message } from 'discord.js';
import { userMention } from '@discordjs/builders';
import { Player, Queue } from 'discord-player';
import { APIMessage } from 'discord-api-types';
// TODO: Need to use the proper file for
// import { guildID } from './config/config.json';

export class MusicPlayer
{
	player: Player
	// que :Queue;
	constructor(client: Client)
	{
		this.player = new Player(client);
		// this.que = new Queue(this.player, client.guilds.cache.first() as Guild);
		this.informPlayingTrack();
	}

	informPlayingTrack() : void
	{
		this.player.on('trackStart', (queue, track) =>
		{
			const data: any = queue.metadata;
			if (data.channel != null)
			{
				data.channel.send(`🎶 | Now playing **${track.title}**!`);
			}
		});
	}

	async play(interact: CommandInteraction) : Promise<Message|APIMessage|void>
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
			console.log(
				'Object returned from below line is APIGuildMember: \nconst requestee = await interact.member;',
			);
		}

		if (interact.guild?.me != null && interact.guild.me.voice != null)
		{
			if (
				interact.guild.me.voice.channelId &&
				voiceChannelID !== interact.guild.me.voice.channelId
			)
			{
				return await interact.reply('You are not in my voice channel!');
			}
		}

		const queryHolder = interact.options.get('query');
		let query: string;
		if (queryHolder != null)
		{
			query = queryHolder.value as string;
		}
		else
		{
			return await interact.reply(
				userMention(interact.user.id) + ', I was unable to find that song',
			);
		}

		if (!voiceChannelID)
		{
			return await interact.reply(
				userMention(interact.user.id) +
				'I just got here man, you need to mute/unmute so I can figure out where you are',
			);
		}

		const guild = interact.guild as Guild;
		const queue = this.player.createQueue(guild, {
			metadata: {
				channel: interact.channel,
			},
		});

		// verify vc connection
		try
		{
			const voiceChannel = (await interact.guild?.channels.fetch(
				voiceChannelID,
			)) as VoiceChannel;
			if (!queue.connection) await queue.connect(voiceChannel);
		}
		catch
		{
			queue.destroy();
			return await interact.reply({
				content: 'Could not join your voice channel!',
				ephemeral: true,
			});
		}

		await interact.deferReply();
		const track = await this.player
			.search(query, {
				requestedBy: interact.user,
			})
			.then((x) => x.tracks[0]);
		if (!track)
		{
			await interact.followUp({
				content: `❌ | Track **${query}** not found!`,
			});
			return;
		}

		queue.play(track);

		await interact.followUp({
			content: `⏱️ | Loading track **${track.title}**!`,
		});
		return;
	}
}
