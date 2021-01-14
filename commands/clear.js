module.exports= {
  name:'Clear',
  description: "Clears messages.",
  async execute(message, args) {
    if (!args[0]) return message.reply("Please enter the amount of messages that you want to clear!");
    if(isNaN(args[0])) return message.reply("Please enter a real number!");

    if(args[0]>100) return message.reply("You cannot delete more than 100 messages or I die.");
    if(args[0]<1) return message.reply("You need to delete at least 1 message.");


    await message.channel.message.fetch({limit: args[0]}).then(messages =>{
      message.channel.bulkDelete(messages);
    })
    }


  }
