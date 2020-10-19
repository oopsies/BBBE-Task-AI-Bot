module.exports = {
    name: 'abc',
    description: 'Test for embeds.',
    execute(message, args){
        message.channel.send("It works!")
    }
};