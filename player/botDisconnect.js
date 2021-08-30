module.exports = (client, message, queue) => {
    message.channel.send({
        embeds: {
            color: 'PURPLE',
            title: "Ah shit, something fucked up!",
            description: client.emotes.maitham_facepalm,
                },
        });
};