const ms = require('ms')
module.exports = {
    name: 'timer',
    description: 'timer',
    execute(message, args){
        let Timer = args[0]
        if(!args[0]){
            return message.channel.send("Usage: !timer + duration + s|m|h")
        }

        if(args[0] <= 0){
            return message.channel.send("Usage: !timer + duration + s|m|h")
        }

        message.channel.send("Timer:"+ms(ms(Timer),{long:true}))
        setTimeout(function(){
            message.channel.send(message.author.toString()+` It has been:${ms(ms(Timer),{long:true})}`)
        },ms(Timer))
    }
};