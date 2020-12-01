const fs = require('fs');
const helper = require ('../helper.js');
const https = require('https');
const { DiscordAPIError } = require('discord.js');
const Discord = require('discord.js');
module.exports = {
    name: 'constantremind',
    description: 'Sends a notification of daily schedule',
    execute(message, args){
        if(!fs.existsSync('./constantReminders.json')){
            fs.writeFileSync('./constantReminders.json',"{}",(err)=>{
                if(err) console.log("err");
                console.log('constantReminders file successfully created')
            })
        }
        const data = fs.readFileSync('./constantReminders.json');
        let objs = JSON.parse(data);
        if(objs[message.author] == undefined){
            return message.channel.send("You have no reminders set up use !setConstantReminder to find out how to make a reminder")
        }
        var today = new Date();
        var day = today.getDay();
        var daylist = ["Sunday","Monday","Tuesday","Wednesday ","Thursday","Friday","Saturday"];
        console.log("Today is : " + daylist[day] + ".");
        message.channel.send("Today you have:\n");
        for(var i = 0; i < objs[message.author].length; i++){
            if(objs[message.author][i].day===daylist[day]){
                message.channel.send(`${objs[message.author][i].name} at ${objs[message.author][i].hour}:${objs[message.author][i].minute}:${objs[message.author][i].second} ${objs[message.author][i].timeofday}\n`)
            }
        }      
    }
};