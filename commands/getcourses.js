const fs = require('fs');
const helper = require ('../helper.js');
const https = require('https');
const { DiscordAPIError } = require('discord.js');
const Discord = require('discord.js');

module.exports = {
    name: 'getcourses',
    description: 'Displays the user\'s courses.',
    execute(message, args){
        if(!helper.userRegistered(message.author)){
            return message.channel.send(`${message.author} Please use !register first to link your Canvas account.`);
        }
        else {

            //set up embed
            const embed = new Discord.MessageEmbed()
                    .setColor('#059033')
                    .setTitle('Your courses')
                   // .setURL() ~ Insert Canvas Dashboard Page Here?
                    .setThumbnail('https://upload.wikimedia.org/wikipedia/en/thumb/a/a2/North_Texas_Mean_Green_logo.svg/1200px-North_Texas_Mean_Green_logo.svg.png')
                    .setFooter("Wrong courses? Use !update to refresh your courses.", "https://e7.pngegg.com/pngimages/1017/780/png-clipart-exclamation-mark-exclamation-mark.png")
                    .setTimestamp();
            
            let courses = helper.getUserCourses(message.author.id); //returns an object of courseIDs:CourseNames
            let count = 0; //keep track of course no.
            //console.log(courses);
            for (key in courses){
                count += 1;
                //console.log(courses[key]);
                embed.addField(`Course ${count}`, courses[key], false);
            }
            message.channel.send(embed);

            return;

        }
    }
};