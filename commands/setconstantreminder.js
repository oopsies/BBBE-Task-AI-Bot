const fs = require('fs');
const helper = require ('../helper.js');
const https = require('https');
const { DiscordAPIError } = require('discord.js');
const Discord = require('discord.js');

module.exports = {
    name: 'setconstantreminder',
    description: 'Sends a notification when a user\'s class is about to start',
    execute(message, args){
        if(args.length!=6){
            return message.channel.send("Usage: !setConstantReminder + Name + Day + Hours + Minutes + Seconds + Time of Day (AM or PM)\n(ex. !setConstantReminder Class1 Tuesday 10 30 00 AM)")
        }
        else{
            if(!fs.existsSync('./constantReminders.json')){
                fs.writeFileSync('./constantReminders.json',"{}",(err)=>{
                    if(err) console.log("err");
                    console.log('constantReminders file successfully created')
                })
            }
            var notification = {
                "name" : args[0],
                "day" : args[1],
                "hour" : args[2],
                "minute" : args[3],
                "second" : args[4],
                "timeofday" : args[5]
            };
            const data = fs.readFileSync('./constantReminders.json');
            let objs = JSON.parse(data);
            if(objs[message.author] == undefined){
                objs[message.author] = [];
                objs[message.author].push(notification)
            }
            else{
                objs[message.author].push(notification)
            }
            fs.writeFileSync('./constantReminders.json', JSON.stringify(objs));
            console.log(args.length);
            message.channel.send(`${message.author}`+"Set constant reminders for:"+notification.name+" at "+ notification.day + " "+notification.hour+":"+notification.minute+":"+notification.second+" "+notification.timeofday);
        }
        var today = new Date();
        var day = today.getDay();
        var daylist = ["Sunday","Monday","Tuesday","Wednesday ","Thursday","Friday","Saturday"];
        console.log("Today is : " + daylist[day] + ".");
    }
};