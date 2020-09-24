const { Client } = require("discord.js");
const { config } = require("dotenv"); 

const client = new Client();

config({
    path: __dirname + "/.env"
});

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

client.on("message", async message => {
    console.log(`${message.author.username} said: ${message.content}`);
});

client.login(process.env.TOKEN);