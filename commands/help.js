const https = require('https');
const helper = require('../helper.js');
const { DiscordAPIError } = require('discord.js');
const Discord = require('discord.js');
const fs = require("fs");
const { Client } = require("discord.js");
const { config } = require("dotenv"); 
const client = new Client();

client.catgories = fs.readdirSync("./commands/");


module.exports = {
    name: 'help',
    aliases: ["h"],
    category: "info",
    description: "Returns all or one command info.",
    usage: "[command | alias]",
    run: async (client, message, args) => {
    
    }
};
 

function getAll(client, message) {
    const embed = new Discord.MessageEmbed()
    .setColor("RANDOM")

    const commands = (category) => {
        return client.commands
            .filter(cmd => cmd.category === category)
            .map(cmd => `- \`${cmd.name}\``)
            .join("\n");
    }

    const info = client.categories
        .map(cat => stripIndents`**${cat[0].toUpperCase() + cat.slice(1)}** \n${commands(car)}`)
        .reduce((string, category) => string + "\n" + category);


    return message.channel.send(embed.setDescription(info));

}

