module.exports={
  name: 'leave',
  description: 'stop the bot and leave the channel.',
  async execute(message, args) {
    const voiceChannel = message.member.voice.channel;

    if(!voiceChannel) return message.channel.send("You Fool you need to be in the channel to summon me!");
    await voiceChannel.leave();
    await message.channel.send("Party Pooper:japanese_goblin:");
  }
}
