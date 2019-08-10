/** Import discord.js API library and login token.
*/
const Discord = require('discord.js');
const { Pool } = require('pg');
const client = new Discord.Client();

// Use Heroku Postgres database
const database = new Pool({
	connectionString: process.env.DATABASE_URL,
	ssl: true,
});

// Will connect to the database.
database.connect();

// Will collect data
function collectData(connection) {
	// TODO: Specify in SQL that DMY mode is used for DateStyle parameter.
	// Adds data to file. This is PostgreSQL. New entries are added to the table voiceStateChanges.
	database.query('INSERT INTO voiceStateConnections(timestamp, tag, id, isConnected, isMuted, isDeaf) VALUES ($1,$2,$3,$4,$5,$6)', connection);
	// The Columns in the table are in the order:
	// | Timestamp | Tag | ID | isConnected | isMuted | isDeaf |
}

// Inform us when connected to server.
client.once('ready', () => {
	console.log('Ready!');
});

// TODO: message based stuff, music.
/* client.on('message', message => {
	message.reply('Yes I hear you.');
});*/


// When a user leaves/joins a voice channel
client.on('voiceStateUpdate', (oldMember, newMember) => {
	// EXPERIMENTAL START
	// If the user is not a bot.
	/*try {
		if (!client.user.bot) {
			console.log('client.user.bot: ' + client.user.bot);
			console.log('The user is not a bot.');
		}
		else if (client.user.bot) {
			console.log('client.user.bot: ' + client.user.bot);
			console.log('The user is a bot.');
		}
		else {
			console.log('We could not understand anything.');
		}
	}
	catch (e) {
		console.log('I did an oopsie');
	}*/
	// EXPERIMENTAL STOP

	// Collect date/time information in UTC.
	const date = new Date();
	const month = date.getUTCMonth() + 1;
	const timestamp = date.getUTCDate() + '-' + month + '-' + date.getUTCFullYear() + ' ' + date.getUTCHours() + ':' + date.getUTCMinutes() + ':' + date.getUTCSeconds() + ' UTC';

	// If a user joins or changes mute/deafened state.
	if ((typeof oldMember.voiceChannel === 'undefined' && newMember.voiceChannel != null) || oldMember.mute != newMember.mute || oldMember.deaf != newMember.deaf) {
		// Create voiceConnection object which stores connection details.
		// The Columns in the table are in the order:
		// | Timestamp | Tag | ID | isConnected | isMuted | isDeaf |
		const voiceConnection = [ timestamp, newMember.user.tag, newMember.id, true, newMember.mute, newMember.deaf ];
		// Collect the data.
		collectData(voiceConnection);
	} // If user leaves.
	else if (typeof newMember.voiceChannel === 'undefined') {
		// Create voiceConnection object which stores connection details.
		// The Columns in the table are in the order:
		// | Timestamp | Tag | ID | isConnected | isMuted | isDeaf |
		const voiceConnection = [ timestamp, newMember.user.tag, newMember.id, false, newMember.mute, newMember.deaf ];
		// Collect the data.
		collectData(voiceConnection);
	}
});

// TODO: Figure out what needs to be done on closing/crash event.
/* client.on('disconnect', CloseEvent => {

});*/

client.login(process.env.token);
