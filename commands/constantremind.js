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
            return;
        }
        const data = fs.readFileSync('./constantReminders.json');
        let objs = JSON.parse(data);
        if(objs[message.author] == undefined){
            return;
        }
        var today = new Date();
        var day = today.getDay();
        var daylist = ["Sunday","Monday","Tuesday","Wednesday ","Thursday","Friday","Saturday"];
        console.log("Today is : " + daylist[day] + ".");
        var hour = today.getHours();
        var minute = today.getMinutes();
        var second = today.getSeconds();
        var prepand = (hour >= 12)? "PM":"AM";
        hour = (hour >= 12)? hour - 12: hour;
        if (hour===0 && prepand==='PM') 
        { 
        if (minute===0 && second===0)
        { 
        hour=12;
        } 
        else
        { 
        hour=12;
        prepand='PM';
        } 
        } 
        if (hour===0 && prepand==='AM') 
        { 
        if (minute===0 && second===0)
        { 
        hour=12;
        } 
        else
        { 
        hour=12;
        } 
        } 
      console.log("Current Time : "+hour + prepand + " : " + minute + " : " + second);
        message.channel.send("Remember:\n");
        for(var i = 0; i < objs[message.author].length; i++){
            if(objs[message.author][i].day===daylist[day]){
                if(parseInt(objs[message.author][i].hour)===hour){
                    if(parseInt(objs[message.author][i].minute)===minute){
                        if(objs[message.author][i].timeofday===prepand){
                            message.channel.send(`${objs[message.author][i].name} at ${objs[message.author][i].hour}:${objs[message.author][i].minute}:${objs[message.author][i].second} ${objs[message.author][i].timeofday}\n`)
                        }
                    }
                }
            }
        }      
    }
};