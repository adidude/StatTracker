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
	const begun = Date.now();
	database.query('INSERT INTO voiceStateConnections(timestamp, tag, id, isConnected, isMuted, isDeaf) VALUES (NOW(),$1,$2,$3,$4,$5)', connection);
	const interval = Date.now() - begun;
	console.log('Collected at ' + begun + '\n Interval: ' + interval);
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


// TODO: Take note when a user enters and leaves the AFK channel.
// TODO: Fix issue where when user recieves a call and accepts the database fails to store data.
// TODO: Measure the faster method of collecting the timestamp.

// When a user leaves/joins a voice channel
client.on('voiceStateUpdate', (oldMember, newMember) => {
	// NOTE: next line holds valuable information on how to know when a user becomes afk.
	console.log(oldMember.user.tag + ' joined the ' + newMember.voiceChannel + ' channel with chanel id: ' + newMember.voiceChannelID + '\n Session id: ' + newMember.voiceSessionID);
	// If the user is not a bot carry out tasks, else do nothing.
	if (!oldMember.user.bot && !newMember.user.bot) {
		// Collect date/time information in UTC.
		// const date = new Date();
		// const month = date.getUTCMonth() + 1;
		// const timestamp = date.getUTCDate() + '-' + month + '-' + date.getUTCFullYear() + ' ' + date.getUTCHours() + ':' + date.getUTCMinutes() + ':' + date.getUTCSeconds() + ' UTC';

		// If a user joins or changes mute/deafened state.
		if ((typeof oldMember.voiceChannel === 'undefined' && newMember.voiceChannel != null) || oldMember.mute != newMember.mute || oldMember.deaf != newMember.deaf) {
			// Create voiceConnection object which stores connection details.
			// The Columns in the table are in the order:
			// | Timestamp | Tag | ID | isConnected | isMuted | isDeaf |
			// const voiceConnection = [ timestamp, newMember.user.tag, newMember.id, true, newMember.mute, newMember.deaf ];
			const voiceConnection = [ newMember.user.tag, newMember.id, true, newMember.mute, newMember.deaf ];
			// Collect the data.
			collectData(voiceConnection);
		} // If user leaves.
		else if (typeof newMember.voiceChannel === 'undefined') {
			// Create voiceConnection object which stores connection details.
			// The Columns in the table are in the order:
			// | Timestamp | Tag | ID | isConnected | isMuted | isDeaf |
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
/* client.on('disconnect', CloseEvent => {

});*/

client.login(process.env.token);
