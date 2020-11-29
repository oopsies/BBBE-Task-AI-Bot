const https = require('https');
const helper = require('../helper.js');
const { DiscordAPIError } = require('discord.js');
const Discord = require('discord.js');
const fs = require("fs");
const { Client } = require("discord.js");
const { config } = require("dotenv"); 
const client = new Client();

module.exports = {
    name: 'help',
    description: 'Help Command.',
    execute(message, args){
       

        if(!args.length){
            const embed = new Discord.MessageEmbed()

            .setColor('#059033')
            .setTitle('HELP COMMAND')
            .setThumbnail('https://upload.wikimedia.org/wikipedia/en/thumb/a/a2/North_Texas_Mean_Green_logo.svg/1200px-North_Texas_Mean_Green_logo.svg.png');
            embed.addField('Here is a list of available commands: \n!getassignments \n!getcourses \n!getgrades \n!register \n!timer \nTo learn more about a specific command, try !help [command]');
            
            message.channel.send(embed);
        }


        else if (args[0] == "getassignments"){
            const embed = new Discord.MessageEmbed()

            .setColor('#059033')
            .setTitle('!getassignments')
            .setThumbnail('https://upload.wikimedia.org/wikipedia/en/thumb/a/a2/North_Texas_Mean_Green_logo.svg/1200px-North_Texas_Mean_Green_logo.svg.png');
            embed.addField('!getassignments -- ');
            embed.addField("")
            
            
            message.channel.send(embed);
            
    
        }

        else if (args[0] == "getcourses"){
            const embed = new Discord.MessageEmbed()

            .setColor('#059033')
            .setTitle('!getcourses')
            .setThumbnail('https://upload.wikimedia.org/wikipedia/en/thumb/a/a2/North_Texas_Mean_Green_logo.svg/1200px-North_Texas_Mean_Green_logo.svg.png');
            embed.addField('Use this command to print out current courses. ');
            
            
            message.channel.send(embed);
            
    
        }

        else if (args[0] == "getgrades"){
            const embed = new Discord.MessageEmbed()

            .setColor('#059033')
            .setTitle('!getgrades')
            .setThumbnail('https://upload.wikimedia.org/wikipedia/en/thumb/a/a2/North_Texas_Mean_Green_logo.svg/1200px-North_Texas_Mean_Green_logo.svg.png')
            embed.addField('Use this command to print out current grades.');
            
            
            message.channel.send(embed);
            
    
        }



        else if (args[0] == "register"){
            const embed = new Discord.MessageEmbed()

            .setColor('#059033')
            .setTitle('!register')
            .setThumbnail('https://upload.wikimedia.org/wikipedia/en/thumb/a/a2/North_Texas_Mean_Green_logo.svg/1200px-North_Texas_Mean_Green_logo.svg.png')
            embed.addField('!Use this commands for instructions on how to register as a user.');
            
            
            message.channel.send(embed);
            
    
        }


        else if (args[0] == "timer"){
            const embed = new Discord.MessageEmbed()

            .setColor('#059033')
            .setTitle('!timer')
            .setThumbnail('https://upload.wikimedia.org/wikipedia/en/thumb/a/a2/North_Texas_Mean_Green_logo.svg/1200px-North_Texas_Mean_Green_logo.svg.png')
            embed.addField('Use this command to use the timer..hehehe');
            
            
            message.channel.send(embed);
            
    
        }

    }

};