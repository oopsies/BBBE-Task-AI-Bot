//Starting files to import Discord functionality and config files for bot.
const { Client } = require("discord.js");
const { config } = require("dotenv"); 

const client = new Client();

//Path for token.
config({
    path: __dirname + "/.env"
});

//Turn the bot on and set presence. 
client.on("ready", () => {
    console.log("BBBE Bot is online!");

    client.user.setPresence({
        status: "online",
        game: {
            name: "our awesome group!",
            type: "WATCHING"
        }
    })
});

//Handles messages will be updated into command handler.
client.on("message", async message => {
    //Prefix for all commands
    const prefix = "!";

    //If the message does not start with prefix ignore it.
    if(!message.content.startsWith(prefix) || message.author.bot) return; 

    //If message does have prefix splice it by spaces for analysis. We use regex to account for multiple spaces.
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    //Command: Ping
    //Date: 09/30/2020
    //Desc: Test for connection and response.
    if(command === 'ping'){
        return message.channel.send("pong!")
    }

    //Command: Args
    //Date: 09/30/2020
    //Desc: Bread and butter for handling user arguements. 
    if(command === 'args'){
        if(!args.length){
            return message.channel.send(`${message.author} I need some arguments first. Use: !args <arguments>`);
        }
        else if(args[0] === 'azul'){
            return message.channel.send(':<3:'); 
        }
        message.channel.send(`Command name: ${command}\nArguments: ${args}`)
    }
    //Command: Encour
    //Date: 09/30/2020
    //Desc: Handles tagging users. 
    else if(command === 'encour')
    {
        const taggedUser = message.mentions.users.first();
        message.channel.send(`${taggedUser.username} got encouraged!`);
        return;
    }

    else if(command === 'how')
    {
        const taggedUser = message.mentions.users.first();
        message.channel.send(`${taggedUser.username} I hope you're doing okay.`);
        return;
    }

    else if(command === 'name')
    {
        return message.channel.send(message.guild.name);

    }
    else if(command === 'online')
    {
        return message.channel.send(`Total Members: ${message.guild.memberCount}`);
    }
    else if(command === 'me')
    {
        message.channel.send(`Username: ${message.author.username}`);
    }

    console.log(`${message.author.username} said: ${message.content}`);
});

client.login(process.env.TOKEN);