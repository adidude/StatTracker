module.exports = (client, message, queue, track) => {

        message.channel.send({
            embed: {
                color: 'PURPLE',
                author: {name: track.title + 'has been added to the queue!'},
                fields: [
                    {name:"Brotheerr!", value: '\n'+client.emotes.zidan},
                        ]
                    },
        });
};