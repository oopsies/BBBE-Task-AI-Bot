const fs = require('fs')
const helper = require ('../helper.js');
const https = require('https');
const { DiscordAPIError } = require('discord.js');
const Discord = require('discord.js');
module.exports = {
    name: 'deleteallreminders',
    description: 'Deletes all reminders a user has set',
    execute(message,args){
        if(!fs.existsSync('./constantReminders.json')){
            return message.channel.send('You currently have no reminders set up.\n');
        }
        const data = fs.readFileSync('./constantReminders.json');
        let objs = JSON.parse(data);
        if(objs[message.author] == undefined){
            return message.channel.send('You currently have no reminders set up.\n');
        }
        else{
            if(fs.existsSync('./usersToNotify.json')){
                const data2 = JSON.parse(fs.readFileSync('usersToNotify.json'));
                let users = [];
                let content = [];
                for(key in data2){
                    if(key.substring(2).slice(0, -1)==message.author.id){
                        console.log(message.author.id);
                    }
                    else{
                        if(objs[key.substring(2).slice(0, -1)] != undefined){
                            content.push(objs[key.substring(2).slice(0, -1)])
                        }
                    }
                }
                fs.writeFileSync('./constantReminders.json',JSON.stringify(content));
                message.channel.send(`${message.author}`+" all reminders has been deleted")
            }
        }
    }
}