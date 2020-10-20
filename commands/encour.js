module.exports = {
    name: 'encour',
    description: 'Handles tagging users.',
    execute(message, args){
        if(!args.length){
            return message.channel.send(`${message.author} I need a user to encourage first. Use: !encour <user>`);
        }
        else {
            const taggedUser = message.mentions.users.first();
            message.channel.send(`${taggedUser.username} got encouraged!`);
            return;
        }
    }

};