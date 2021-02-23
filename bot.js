// Import discord.js API library and login token.
const Discord = require('discord.js');
// Imports the Google Cloud client library
const Compute = require('@google-cloud/compute');
const compute = new Compute();
const zone = compute.zone('us-central1-a');
const machine = zone.vm('valheim-server');


// Make client for API calls
const client = new Discord.Client();

// Inform us when connected to server.
client.once('ready', () =>
{
	console.log('Connected!');
});

client.on('message', message =>
{
	// If the command prefix is used in a channel besides the request channel.
	if ((message.content.startsWith('-') || message.content.startsWith('!') || message.content.startsWith(';;') || message.content.startsWith(';') || message.content.startsWith('[')) && message.channel.name != 'requests')
	{
		// Deletes message
		message.delete();
		return;
	}
	else if(message.content.startsWith('!'))
	{
		const switchState = message.content.substr(1, message.content.length); // Decides to switch server on or off.
		switch(switchState)
		{
		case 'start':
			machine.start((err, operation, apiResponse) => serverSwitch(err, operation, apiResponse, message, 1));
			break;
		case 'stop':
			machine.stop((err, operation, apiResponse) => serverSwitch(err, operation, apiResponse, message, 0));
			break;
		}
	}
});

function serverSwitch(err, operation, apiResponse, msg, state)
{
	// TODO: Poll server for status
	if(err != null)
	{
		if(state == 1)
		{
			console.log('Error Occured While Starting: ' + err);
			msg.reply('We having an issue getting this thing into gear.');
		}
		else
		{
			console.log('Error Occured While Stopping: ' + err);
			msg.reply('We having an issue getting this thing into gear.');
		}
	}
	else if(state == 1) // Inform user that the server has started
	{
		msg.reply('The Valheim server has started.');
	}
	else
	{
		msg.reply('The Valheim server has stoped.');
	}
}

// TODO: implement better async sleep
function sleep(milliseconds)
{
	const date = Date.now();
	let currentDate = null;
	do
	{
		currentDate = Date.now();
	} while (currentDate - date < milliseconds);
}

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
