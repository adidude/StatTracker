module.exports = (client, message, queue) => {
    setTimeout(function(){
        message.channel.send({
            embed: {
                color: 'PURPLE',
                author: {name: "This shit boring."},
                fields: [
                    {name:"Bye!", value: client.emotes.maitham_facepalm},
                        ]
                    },
        }).then(msg=>{msg.delete({timeout:30000})});
    },110000);
};