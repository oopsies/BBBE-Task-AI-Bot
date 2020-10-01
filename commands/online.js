module.exports = {
    name: 'online',
    description: 'Displays total member in server.',
    execute(message, args){
        return message.channel.send(`Total Members: ${message.guild.memberCount}`);
    }
};