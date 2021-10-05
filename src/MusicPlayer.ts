import { GuildMember, Guild, VoiceChannel, Client, CommandInteraction, Message } from 'discord.js';
import { userMention } from '@discordjs/builders';
import { Player, Track, Queue } from 'discord-player';
import { APIMessage } from 'discord-api-types';
import { TestResponse } from './TestResponse';
// TODO: Need to use the proper file for
import { guildID } from './config/config.json';

export class MusicPlayer {
	player: Player
	constructor(client: Client) {
		this.player = new Player(client);
		this.informPlayingTrack();
	}

	informPlayingTrack() : void {
		this.player.on('trackStart', (queue : Queue, track : Track) => {
			console.log('trackStart player event triggered');
			const data :any = queue.metadata;
			if (data.channel != null) {
				data.channel.send(`🎶 | Now playing **${track.title}**!`);
			}
		});
	}

	/**
	 * Retrieves the guild member that called the command
	 * @param interact The CommandInteraction from discord.js
	 * @returns TestResponse which confirms if the data could get retrieved
	 */
	async getInteractionMember(interact : CommandInteraction) : Promise<TestResponse> {
		try {
			const requestee = await interact.member as GuildMember;
			if (!requestee) {
				console.log('ERR: Failed to retrieve GuildMember in getInteractionMember()');
				console.log('Interaction:');
				console.log(interact);
				await interact.reply('I was unable to find out who you are to figure out where you are.');
				// FAIL
				const res : TestResponse = {
					testPassed: false,
					resObj: null,
				};
				return res;
			}
			else {
				// PASS
				const res : TestResponse = {
					testPassed: true,
					resObj: requestee,
				};

				return res;
			}
		}
		catch (err) {
			console.log('ERR: Could not properly type cast to GuildMember in getInteractionMember()');
			console.log(err);
			await interact.reply('Tell some idiot to check my logs, coz I don\'t know how to turn water into wine!');
			// FAIL
			const res : TestResponse = {
				testPassed: false,
				resObj: null,
			};
			return res;
		}
	}


	async play(interact: CommandInteraction) : Promise<Message|APIMessage|void> {
		// Retrieving the GuildMember to find the voice channel to connect to as well as who to reply to.
		const memberStore = await this.getInteractionMember(interact);
		let requestee : GuildMember;
		if (memberStore.testPassed) {
			requestee = memberStore.resObj;
		}
		else {
			return;
		}

		// Retrieving voice channel ID to join channel
		const voiceChannelID = await requestee.voice.channelId;
		if (!voiceChannelID) {
			console.log('WARN: Failed to retrieve user\'s voice channel for user: ' + requestee.displayName);
			return await interact.reply(userMention(requestee.id) + ', I just got here man, you need to mute/unmute so I can figure out where you are');
		}

		// Getting the bot's GuildMember object to check if bot and user are in the same voice channel
		const botConnection = interact.guild?.me;
		if (botConnection != null && botConnection.voice != null) {
			const botVoiceID = botConnection.voice.channelId;
			if (voiceChannelID !== botVoiceID) {
				return await interact.reply(userMention(requestee.id) + ' you are not in my voice channel!');
			}
		}

		// Getting the song name that the user searched for
		const queryHolder = interact.options.get('query');
		let query: string;
		if (queryHolder != null) {
			query = queryHolder.value as string;
		}
		else {
			console.log('ERR: Could not retrieve song name from interactions\'s query field');
			return await interact.reply(userMention(requestee.id) + ', I was unable to find that song');
		}


		const guild = interact.guild as Guild;
		const queue = this.player.createQueue(guild, { metadata: { channel: interact.channel } });

		// verify vc connection
		try {
			const voiceChannel = (await interact.guild?.channels.fetch(
				voiceChannelID,
			)) as VoiceChannel;
			if (!queue.connection) await queue.connect(voiceChannel);
		}
		catch {
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
		if (!track) {
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
