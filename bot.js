/** Import discord.js API library and login token.
*/
const Discord = require('discord.js');
const fs = require('fs');
const client = new Discord.Client();

// Will collect data
function collectData(connection) {
	// Write data to file
	let isWritten = false;
	// Loop as long as data is not written
	while (!isWritten) {
		try {
			// Adds data to file.
			fs.appendFile('Connections.dat', connection.date + ',' + connection.time + ',' + connection.id + ',' + connection.isConnected + ',' + connection.tag + ',' + connection.isMuted + ',' + connection.isDeaf + '\n', (e) =>{
				if (e) {throw e;}
			});
			isWritten = true;
		}
		catch (e) {
			console.log('Write failed. Retrying writing to  file.');
		}
	}
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
		const voiceConnection = { date:today, time:now, tag:newMember.user.tag, id:newMember.id, isConnected:true, isMuted:newMember.mute, isDeaf:newMember.deaf };
		// Collect the data.
		collectData(voiceConnection);
	} // If user leaves.
	else if (typeof newMember.voiceChannel === 'undefined') {
		// Create voiceConnection object which stores connection details.
		const voiceConnection = { date:today, time:now, tag:newMember.user.tag, id:newMember.id, isConnected:false, isMuted:newMember.mute, isDeaf:newMember.deaf };
		// Collect the data.
		collectData(voiceConnection);
		console.log(voiceConnection);
	}
});

client.login(process.env.token);
