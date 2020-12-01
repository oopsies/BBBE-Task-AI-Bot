module.exports = {
    name: 'ping',
    description: 'Test for connection and response.',
    execute(message, args){
        message.channel.send('pong!');
    }
};