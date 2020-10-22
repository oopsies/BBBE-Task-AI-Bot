//Starting files to import Discord functionality and config files for bot.
const { Client } = require("discord.js");
const { config } = require("dotenv"); 

const client = new Client();

const fs = require('fs');
const Discord = require('discord.js');
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'))

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

for (const file of commandFiles){
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}


//Handles messages
client.on("message", async message => {

    //Prefix for all commands
    const prefix = "!";

    //If the message does not start with prefix ignore it.
    if(!message.content.startsWith(prefix) || message.author.bot) return; 

    //If message does have prefix splice it by spaces for analysis. We use regex to account for multiple spaces.
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if (!client.commands.has(command)) return;
    try {
        client.commands.get(command).execute(message, args);
    }
    catch(error){
        console.error(error);
        message.reply('Command error');
    }
    console.log(`${message.author.username} said: ${message.content}`);
});

client.login(process.env.TOKEN);