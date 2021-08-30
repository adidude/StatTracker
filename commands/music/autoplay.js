const trackAdd = require("../../player/trackAdd");

module.exports = {
    name: 'autoplay',
    aliases: ['ap'],
    category: 'music',    
    usage: '${prefix}autoplay',

    async execute(client, message, args) {
        const queue = client.player.getQueue(message);

        if (!message.member.voice.channel) return message.channel.send({
            embed: {
                color:'PURPLE',
                author:{name: 'You FOOl get on the channel.'}
            }
        }

        );
        if (message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id) return message.channel.send({
            embed: {
                color:'PURPLE',
                author:{name: 'You FOOl get on the channel.'}
            }
        });
        if (!queue) return message.channel.send({
            embed: {
                color:'PURPLE',
                author:{name: 'Imma mute that song.'}
            }
        });

        client.player.setRepeatMode(message, false);
        client.player.setLoopMode(message, false);
        await client.player.setAutoPlay(message, queue.autoPlay ? false : true);
        return message.channel.send(queue.autoPlay ? {
            embed: {
                color:'PURPLE',
                author:{name:'Ayo Imma control the music now.'},
                fields: [
                    {name: 'Mr. T in the house', value: client.emotes.derp},
                ],
                    }
            }:
            {
            embed: {
                color:'PURPLE',
                author:{name: 'Fine you control the music.'},
                fields: [
                    {name: 'Mr. T out', value: client.emotes.thumb}
                ],
                    },
        
        
            },);
},
};