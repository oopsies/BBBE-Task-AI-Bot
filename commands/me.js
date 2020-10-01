module.exports = {
    name: 'me',
    description: 'Displays the user who called the command in the server.',
    execute(message, args){
        message.channel.send(`Username: ${message.author.username}`);
    }
};