module.exports = {
    name: 'Encour',
    description: 'Handles tagging users.',
    execute(message, args){
        const taggedUser = message.mentions.users.first();
        message.channel.send(`${taggedUser.username} got encouraged!`);
        return;
    }

};