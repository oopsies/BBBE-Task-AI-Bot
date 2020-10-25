const ms = require('ms')
module.exports = {
    name: 'timer',
    description: 'Sends message at end of timer',
    execute(message, args){
        let Timer = args[0]
        if(args.length===0)
        {
            return message.channel.send("Usage: !timer + duration + s|m|h\n(ex. !timer 30s )\n or\n Usage: !timer + duration + s|m|h + command\n(ex. !timer 30s !ping)\n or \nUsage: !timer + duration + s|m|h + command + target\n(!timer 30s !encour @target)")
        }
        else if(args.length===1)
        {
            message.channel.send("Timer:"+ms(ms(Timer),{long:true}))
            setTimeout(function(){
                message.channel.send(message.author.toString()+` It has been:${ms(ms(Timer),{long:true})}`)
            },ms(Timer))
        }
        else if(args.length>=2)
        {
            arr = []
            arr.forEach(myfunction2)
            function myfunction2(item){
                message.channel.send(`${item}`)
            }
            message.channel.send("Timer:"+ms(ms(Timer),{long:true}))
            setTimeout(function(){
                message.channel.send(message.author.toString()+` It has been:${ms(ms(Timer),{long:true})}`)
            },ms(Timer))
        }
    }
};