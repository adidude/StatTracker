// Import discord.js API library and login token.
const Discord = require('discord.js');
const mysql = require('mysql');
const { Pool } = require('pg');
const client = new Discord.Client();
// Counter Variables
let pogcounter = 0;
// const YTDL = require('ytdl-core');
// let songQue = {};

// Database credentials
const connDet = mysql.createConnection({
	host: process.env.JAWSDB_URL,
	user: process.env.username,
	password: process.env.pass,
	database: process.env.DB
});

// Use Heroku Postgres database
const database = new Pool({
	connectionString: process.env.DATABASE_URL,
	ssl: true,
});

connDet.connect(function(err) {
	console.log('Connected to SharkDB');
	if(err) {
		console.log('DB connection failed');
	}
})

// Will connect to the database.
database.connect();

// Will collect data
function collectData(connection) {
	// Adds data to file. This is PostgreSQL. New entries are added to the table voiceStateChanges.
	database.query('INSERT INTO voiceStateConnections(timestamp, tag, id, isConnected, isMuted, isDeaf, isAFK) VALUES (NOW(),$1,$2,$3,$4,$5,$6)', connection, (err) => {
		if (err) {
			return console.error('Error executing query', err.stack);
		}
	});
	// The Columns in the table are in the order:
	// | Timestamp | Tag | ID | isConnected | isMuted | isDeaf | isAFK |
}

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

// TODO: Fix issue where when user recieves a call and accepts the database fails to store data.

// When a user leaves/joins a voice channel
client.on('voiceStateUpdate', (oldMember, newMember) => {
	// If the user is not a bot carry out tasks, else do nothing.
	if (!oldMember.user.bot && !newMember.user.bot) {
		// If the user is in tha AFK channel.
		if (newMember.voiceChannelID == 405374555847262219) {
			// Create voiceConnection object which stores connection details.
			const voiceConnection = [ newMember.user.tag, newMember.id, true, newMember.mute, newMember.deaf, true ];
			// The Columns in the table are in the order:
			// | Timestamp | Tag | ID | isConnected | isMuted | isDeaf | isAFK |

			// Collect the data.
			collectData(voiceConnection);
		} // If a user joins or changes mute/deafened state.
		else if ((typeof oldMember.voiceChannel === 'undefined' && newMember.voiceChannel != null) || oldMember.mute != newMember.mute || oldMember.deaf != newMember.deaf) {
			// Create voiceConnection object which stores connection details.
			const voiceConnection = [ newMember.user.tag, newMember.id, true, newMember.mute, newMember.deaf, newMember.deaf ];
			// The Columns in the table are in the order:
			// | Timestamp | Tag | ID | isConnected | isMuted | isDeaf | isAFK |

			// Collect the data.
			collectData(voiceConnection);
		} // If user leaves.
		else if (typeof newMember.voiceChannel === 'undefined') {
			// Create voiceConnection object which stores connection details.
			// The Columns in the table are in the order:
			// | Timestamp | Tag | ID | isConnected | isMuted | isDeaf | isAFK |
			const voiceConnection = [ newMember.user.tag, newMember.id, false, newMember.mute, newMember.deaf, false ];
			// Collect the data.
			collectData(voiceConnection);
		} // If user leaves the AFK channel.
		else if (oldMember.voiceChannelID == 405374555847262219 && typeof newMember.voiceChannel != 'undefined') {
			// Create voiceConnection object which stores connection details.
			// The Columns in the table are in the order:
			// | Timestamp | Tag | ID | isConnected | isMuted | isDeaf | isAFK |
			const voiceConnection = [ newMember.user.tag, newMember.id, true, newMember.mute, newMember.deaf, newMember.deaf ];
			// Collect the data.
			collectData(voiceConnection);
		}
	}
});

// Will know when a user changes username and will update all entries with new username.
client.on('userUpdate', (oldUser, newUser) => {
	// Store both values locally to avoid using the api calls more than neccessary.
	const newName = newUser.tag;
	const oldName = oldUser.tag;
	console.log('newName: ' + newName + '\noldName: ' + oldName);
	// If the username has changed
	if (oldName != newName) {
		// Form the update query
		const update = 'UPDATE voiceStateConnections SET tag=\'' + newName + '\' WHERE tag=\'' + oldName + '\'';
		// Run the query
		database.query(update, (err, res)=>{
			if (err) {
				// Will print out errors
				return console.error('Error executing query', err.stack);
			}
			else {
				return console.log('Successful query...!' + res);
			}
		});
		console.log('Updated Username for ' + oldName);
	}
});

// TODO: Figure out what needs to be done on closing/crash event, and if this is enough.
client.on('disconnect', CloseEvent => {
	// Disconnect from database.
	database.end().then(() => console.log('Disconnected from database.'));
	connDet.end(function(err) {
		if(err) {
			console.log('error: ' + err.message);
		}
		console.log('Disconnected from SharkDB');
	});
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