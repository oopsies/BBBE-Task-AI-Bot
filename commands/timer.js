const ms = require('ms')
module.exports = {
    name: 'timer',
    description: 'Sends message at end of timer',
    execute(message, args){
        let Timer = args[0]
        if(args.length===0)
        {
            return message.channel.send("Usage: !timer + duration + s|m|h\n(ex. !timer 30s )\n")
        }
        else if(args.length===1)
        {
            message.channel.send("Timer:"+ms(ms(Timer),{long:true}))
            setTimeout(function(){
                message.channel.send(message.author.toString()+` It has been:${ms(ms(Timer),{long:true})}`)
            },ms(Timer))
        }
    }
};