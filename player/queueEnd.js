const { TextChannel } = require("discord.js");

module.exports = (client, message, queue) => {

    setTimeout(function(){
        message.channel.send({
            embed: {
                color: 'PURPLE',
                author: {name: "Ayo play more music."},
                fields: [
                    {name:"Brotheerr!", value: client.emotes.zidan},
                        ]
                    },
        }).then(msg=>{msg.delete({timeout:30000})});
    },110000);
};