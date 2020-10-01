module.exports = {
    name: 'name',
    description: 'Displays the user who called the command in the server.',
    execute(message, args){
        return message.channel.send(message.guild.name);
    }
};