const fs = require('fs');
const helper = require ('../helper.js');
const https = require('https');
const { DiscordAPIError } = require('discord.js');
const Discord = require('discord.js');
const Pagination = require('discord-paginationembed');

module.exports = {
    name: 'getcourses',
    description: 'Displays the user\'s courses.',
    execute(message, args){
        if(!helper.userRegistered(message.author)){
            return message.channel.send(`${message.author} Please use !register first to link your Canvas account.`);
        }
        else {

            //set up embed
            const embeds = [];
            
            let courses = helper.getUserCourses(message.author.id); //returns an object of courseIDs:CourseNames
            let count = 0; //keep track of course no.
            //console.log(courses);
            for (key in courses){
                count += 1;
                //console.log(courses[key]);
                //embed.addField(`Course ${count}`, courses[key], false);
                embeds.push(new Discord.MessageEmbed().addField(`Course ${count}`, courses[key], false));
            }
            
            const myImage = message.author.displayAvatarURL();

            new Pagination.Embeds()
                .setArray(embeds)
                .setAuthorizedUsers([message.author.id])
                .setChannel(message.channel)
                .setPageIndicator(true)
                .setPage(1)
                // Methods below are for customising all embeds
                .setImage(myImage)
                .setThumbnail('https://upload.wikimedia.org/wikipedia/en/thumb/a/a2/North_Texas_Mean_Green_logo.svg/1200px-North_Texas_Mean_Green_logo.svg.png')
                .setTitle('Your Courses')
                .setDescription(`Here are the coures for: ${message.author}`)
                .setThumbnail('https://upload.wikimedia.org/wikipedia/en/thumb/a/a2/North_Texas_Mean_Green_logo.svg/1200px-North_Texas_Mean_Green_logo.svg.png')
                .setFooter("Wrong courses? Use !update to refresh your courses.", "https://e7.pngegg.com/pngimages/1017/780/png-clipart-exclamation-mark-exclamation-mark.png")
                .setTimestamp()
                .setColor('#059033')
                .build();    

            return;

        }
    }
};