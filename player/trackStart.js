module.exports = (client, message, track) => {
    message.channel.send({
        embed: {
            color: 'PURPLE',
            author: {   name: track.title },
            fields: [
                {name: 'Requested by', value: track.requestedBy.username + '\n\n' + client.emotes.music },
                    ],
                },
        });
};
