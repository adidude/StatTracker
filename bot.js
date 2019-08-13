/** Import discord.js API library and login token.
*/
const Discord = require('discord.js');
const { Pool } = require('pg');
// TEMPORARY
const { PerformanceObserver, performance } = require('perf_hooks');
// TEMPORARY
const client = new Discord.Client();

// Use Heroku Postgres database
const database = new Pool({
	connectionString: process.env.DATABASE_URL,
	ssl: true,
});

// Timer?
const obs = new PerformanceObserver((items) => {
	console.log(items.getEntries()[0].duration);
	performance.clearMarks();
});
obs.observe({ entryTypes: ['measure'] });

let isDatabaseConnected = false;
while (!isDatabaseConnected) {
	try {
		// Will connect to the database.
		database.connect();
		isDatabaseConnected = true;
	}
	catch (e) {
		isDatabaseConnected = false;
	}
}

// Will collect data
function collectData(connection) {
	// TODO: Specify in SQL that DMY mode is used for DateStyle parameter.
	// Adds data to file. This is PostgreSQL. New entries are added to the table voiceStateChanges.
	performance.mark('A');
	database.query('INSERT INTO voiceStateConnections(timestamp, tag, id, isConnected, isMuted, isDeaf) VALUES (NOW(),$1,$2,$3,$4,$5)', connection);
	performance.mark('B');
	performance.measure('A to B', 'A', 'B');
	//console.log('Interval: ' + measure.duration);
	// The Columns in the table are in the order:
	// | Timestamp | Tag | ID | isConnected | isMuted | isDeaf | isAFK |
}

// Inform us when connected to server.
client.once('ready', () => {
	console.log('Connected!');
});

// TODO: message based stuff, music.
/* client.on('message', message => {
	message.reply('Yes I hear you.');
});*/

// TODO: Fix issue where when user recieves a call and accepts the database fails to store data.
// TODO: Measure the faster method of collecting the timestamp.

// When a user leaves/joins a voice channel
client.on('voiceStateUpdate', (oldMember, newMember) => {
	// If the user is not a bot carry out tasks, else do nothing.
	if (!oldMember.user.bot && !newMember.user.bot) {
		// Collect date/time information in UTC.
		// const date = new Date();
		// const month = date.getUTCMonth() + 1;
		// const timestamp = date.getUTCDate() + '-' + month + '-' + date.getUTCFullYear() + ' ' + date.getUTCHours() + ':' + date.getUTCMinutes() + ':' + date.getUTCSeconds() + ' UTC';

		// If the user is in tha AFK channel.
		if (newMember.voiceSessionID == 405374555847262219) {
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
			// const voiceConnection = [ timestamp, newMember.user.tag, newMember.id, true, newMember.mute, newMember.deaf ];
			const voiceConnection = [ newMember.user.tag, newMember.id, false, newMember.mute, newMember.deaf ];
			// Collect the data.
			collectData(voiceConnection);
		}
	}
});

// TODO: Make following section functional.
// Will know when a user changes username and will update all entries with new username.
/* client.on('guildMemberUpdate', (oldMember, newMember) => {

});*/

// TODO: Figure out what needs to be done on closing/crash event.
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
