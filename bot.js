// Import discord.js API library and login token.
const Discord = require('discord.js');
const client = new Discord.Client({ partials: ['CHANNEL', 'MESSAGE', 'REACTION'] });
// Counter Variables
let pogcounter = 0;
// const YTDL = require('ytdl-core');
// let songQue = {};

// Inform us when connected to server.
client.once('ready', () =>
{
	console.log('Connected!');
});

// const prefix = '[';

// Will scold users for not posting in the right channel for music.
client.on('message', message =>
{
	// If the command prefix is used in a channel besides the request channel.
	if ((message.content.startsWith('-') || message.content.startsWith('!') || message.content.startsWith(';;') || message.content.startsWith(';') || message.content.startsWith('[')) && message.channel.name != 'requests')
	{
		// Deletes message
		message.delete();
	}
	// Counter
	if(message.content.toLowerCase() == 'poggers' || message.content.toLowerCase() == 'pog' || message.content.toLowerCase() == 'pogchamp')
	{
		pogcounter++ ;
		message.reply('Poggers: ' + pogcounter);
	}
});

// Display message to assign roles to new members
client.on('guildMemberAdd', member =>
{
	const msg = '<@' + member.id + '> To get access to the server react with the person who invited you here.';
	// Grabbing the text channel from API
	client.channels.cache.find(chan => chan.id === '759165571798401075')
		.then(channel =>
		{
			console.log("Channel found!");
			// Setting a timeout due to issues mentioning users as soon as they join.
			setTimeout(function()
			{
				// Sending a message to the text channel on successful fetch
				channel.send(msg)
					.then(newMsg =>
					{
						console.log("Message sent!");
						// shortcut for emojis
						const emojis = channel.guild.emojis.cache;
						// Reacting with the emojis that pertain to specific roles.
						newMsg.react(emojis.get('389860539146436608')); // Zidan
						newMsg.react(emojis.get('493493598176673802')); // Maitham
						newMsg.react(emojis.get('389860488579907594')); // Kyle
						newMsg.react(emojis.get('389860119019651073')); // Arfaan
						newMsg.react(emojis.get('389860495407972352')); // Adi
						newMsg.react(emojis.get('494502157131972634')); // Nick
						newMsg.react(emojis.get('787945689409519616')); // Sarrie
						newMsg.react(emojis.get('787843490901393409')); // Alfy
						console.log("Emojis should be added at this point");
					}).catch('Retrieving emojis...');
			}, 1000);

		}).catch('Failed to send message');
});

// TODO: Add other roles+emojis
// TODO: add roles to users.

client.on('messageReactionAdd', (reaction, user) =>
{
	// Retrieve the message object which has been reacted to
	const reactedMsg = reaction.message;
	// Get's the guildmember object to assign a role
	const userGuildInfo = reactedMsg.mentions.members.get(user.id);
	// If the message is in the welcome channel and a user has been retrieved
	if(reactedMsg.channel.id == '759165571798401075' && userGuildInfo != null)
	{
		let roleChoice;
		switch(reaction.emoji.id)
		{
		case '389860539146436608':
			// Zidan
			roleChoice = 'Zidan';
			break;
		case '493493598176673802':
			// Maitham
			roleChoice = 'Maitham';
			break;
		case '389860488579907594':
			// Kyle
			roleChoice = 'Kyle';
			break;
		case '389860119019651073':
			// Arfaan
			roleChoice = 'Arfaan';
			break;
		case '389860495407972352':
			// Adi
			roleChoice = 'Adi';
			break;
		case '494502157131972634':
			// Nick
			roleChoice = 'Nic';
			break;
		case '787843490901393409':
			//Alfy
			roleChoice = 'Alfy';
			break;
		case '787945689409519616':
			roleChoice = 'Sarrie';
			break;
		}
		// Find the role and assign the role to the user.
		userGuildInfo.roles.add(userGuildInfo.guild.roles.cache.find(role => role.name === roleChoice))
			.then(function()
			{
				// Delete the message that was reacted to.
				reactedMsg.delete();
				console.log('role successfuly added');
			}).catch('Failed to add role');
		userGuildInfo.roles.add('764145218688778281');
	}
});

// TODO: Figure out what needs to be done on closing/crash event, and if this is enough.
client.on('disconnect', CloseEvent =>
{
	// Informs of reason of disconnection on console.
	console.log('Disconnected with code ' + CloseEvent.code);
	switch (CloseEvent.code)
	{
	case 1000:
		console.log('Normal Closure');
		break;
	case 1001:
		console.log('The endpoint is going away, either because of a server failure or because the browser is navigating away from the page that opened the connection.');
		break;
	case 1002:
		console.log('The endpoint is terminating the connection due to a protocol error.');
		break;
	case 1003:
		console.log('The connection is being terminated because the endpoint received data of a type it cannot accept (for example, a text-only endpoint received binary data).');
		break;
	case 1005:
		console.log('No status code was provided even though one was expected.');
		break;
	case 1006:
		console.log('A connection was closed abnormally (that is, with no close frame being sent) when a status code is expected.');
		break;
	case 1007:
		console.log('Invalid frame payload data. The endpoint is terminating the connection because a message was received that contained inconsistent data (e.g., non-UTF-8 data within a text message).');
		break;
	case 1008:
		console.log('The endpoint is terminating the connection because it received a message that violates its policy.');
		break;
	case 1009:
		console.log('The endpoint is terminating the connection because a data frame was received that is too large.');
		break;
	case 1010:
		console.log('The client is terminating the connection because it expected the server to negotiate one or more extension, but the server didn\'t.');
		break;
	case 1011:
		console.log('Internal Error. The server is terminating the connection because it encountered an unexpected condition that prevented it from fulfilling the request.');
		break;
	case 1012:
		console.log('Service Restart.');
		break;
	case 1013:
		console.log('The server is terminating the connection due to a temporary condition, e.g. it is overloaded and is casting off some of its clients.');
		break;
	case 1014:
		console.log('The server was acting as a gateway or proxy and received an invalid response from the upstream server.');
		break;
	case 1015:
		console.log('Connection was closed due to a failure to perform a TLS handshake');
		break;
	default:
	}
});

client.login(process.env.token);
