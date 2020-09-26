// Import discord.js API library and login token.
const Discord = require('discord.js');
const client = new Discord.Client({partials: ["CHANNEL","MESSAGE","REACTION"]});
// Counter Variables
let pogcounter = 0;
// const YTDL = require('ytdl-core');
// let songQue = {};

// Inform us when connected to server.
client.once('ready', () => {
	console.log('Connected!');
});

// const prefix = '[';

// Will scold users for not posting in the right channel for music.
client.on('message', message => {
	// If the command prefix is used in a channel besides the request channel.
	if ((message.content.startsWith('-') || message.content.startsWith('!') || message.content.startsWith(';;') || message.content.startsWith(';') || message.content.startsWith('[')) && message.channel.name != 'requests') {
		// Inform the user.
		message.reply('Yo fool! You\'re supposed to put music related mumbo jumbo in the requests channel!');
		// Deletes message
		message.delete();
	}
	// Counter
	if(message.content.toLowerCase() == 'poggers' || message.content.toLowerCase() == 'pog' || message.content.toLowerCase() == 'pogchamp') {
		pogcounter++ ;
		message.reply('Poggers: ' + pogcounter);
	}
});

//Assigns roles to new members
client.on('guildMemberAdd', member => {
	const user = "@" + member.nickname
	//Sends a message to the channel mentioning a user
	const roleAssignMsg = new Discord.Message(client, user + " To get access to the server react with the person who invited you here.", client.channels.fetch('759165571798401075'));
	//shortcut for emojis
	const emojis = roleAssignMsg.guild.emojis.cache;
	roleAssignMsg.react(emojis.get('389860539146436608')); //Zidan
	roleAssignMsg.react(emojis.get('493493598176673802')); //Maitham
	roleAssignMsg.react(emojis.get('389860488579907594')); //Kyle
	roleAssignMsg.react(emojis.get('389860119019651073')); //Arfaan
	roleAssignMsg.react(emojis.get('389860495407972352')); //Adi
	roleAssignMsg.react(emojis.get('494502157131972634')); //Nick
	/* TODO: Add other roles+emojis
	roleAssignMsg.react(emojis.get(''));
	roleAssignMsg.react(emojis.get(''));
	roleAssignMsg.react(emojis.get(''));
	roleAssignMsg.react(emojis.get(''));
	roleAssignMsg.react(emojis.get(''));*/
	//TODO: add roles to users.
});

// TODO: Figure out what needs to be done on closing/crash event, and if this is enough.
client.on('disconnect', CloseEvent => {
	// Informs of reason of disconnection on console.
	console.log('Disconnected with code ' + CloseEvent.code);
	switch (CloseEvent.code) {
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
