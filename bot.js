/** Import discord.js API library and login token.
*/
const Discord = require('discord.js');
const { pg } = require('pg');
const client = new Discord.Client();

// Use Heroku Postgres database
const database = new pg({
	connectionString: process.env.DATABASE_URL,
	ssl: true,
});

// Will connect to the database.
database.connect();

// Will collect data
function collectData(connection) {
	// TODO: Specify in SQL that DMY mode is used for DateStyle parameter.
	// Adds data to file. This is PostgreSQL. New entries are added to the table voiceStateChanges.
	database.query('INSERT INTO voiceStateChanges(date, time, tag, id, isConnected, isMuted, isDeaf) VALUES ($1,$2,$3,$4,$5,$6,$7)', connection);
	// The Columns in the table are in the order:
	// | Date | Time | Tag | ID | isConnected | isMuted | isDeaf |
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
	// Collect date/time information.
	const date = new Date();
	const month = date.getMonth() + 1;
	const today = date.getDate() + '-' + month + '-' + date.getFullYear();
	const now = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();

	// If a user joins or changes mute/deafened state.
	if ((typeof oldMember.voiceChannel === 'undefined' && newMember.voiceChannel != null) || oldMember.mute != newMember.mute || oldMember.deaf != newMember.deaf) {
		// Create voiceConnection object which stores connection details.
		// The Columns in the table are in the order:
		// | Date | Time | Tag | ID | isConnected | isMuted | isDeaf |
		const voiceConnection = [ today, now, newMember.user.tag, newMember.id, true, newMember.mute, newMember.deaf ];
		// Collect the data.
		collectData(voiceConnection);
	} // If user leaves.
	else if (typeof newMember.voiceChannel === 'undefined') {
		// Create voiceConnection object which stores connection details.
		// The Columns in the table are in the order:
		// | Date | Time | Tag | ID | isConnected | isMuted | isDeaf |
		const voiceConnection = [ today, now, newMember.user.tag, newMember.id, false, newMember.mute, newMember.deaf ];
		// Collect the data.
		collectData(voiceConnection);
	}
});

// TODO: Figure out what needs to be done on closing/crash event.
/* client.on('disconnect', CloseEvent => {

});*/

client.login(Process.env.token);
