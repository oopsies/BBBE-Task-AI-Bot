module.exports = {
    name: 'args',
    description: 'Bread and butter for handling user arguments.',
    execute(message, args){
        if(!args.length){
            return message.channel.send(`${message.author} I need some arguments first. Use: !args <arguments>`);
        }
        else if(args[0] === 'azul'){
            return message.channel.send(':<3:'); 
        }
        message.channel.send(`Command name: ${command}\nArguments: ${args}`)
    }

};