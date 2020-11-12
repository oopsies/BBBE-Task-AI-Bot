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

            //get request
            https.get(prefix + main_call + access_token, (res) => {
                //console.log('statusCode:', res.statusCode);
                //console.log('headers:', res.headers);
              
                //get data
                res.on('data', (d) => {
                    
                    //parse JSON data
                    var dat = JSON.parse(d);
                    //console.log(dat);
                    //print name of courses if they are defined
                    //const embed = new Discord.MessageEmbed()
                    //.setColor('#059033')
                    //.setTitle('Future Assignments')
                    //.setURL() ~ Insert Canvas Dashboard Page Here?
                    //.setThumbnail('https://upload.wikimedia.org/wikipedia/en/thumb/a/a2/North_Texas_Mean_Green_logo.svg/1200px-North_Texas_Mean_Green_logo.svg.png');
                    
                   // const FieldsEmbed = new Pagination.FieldsEmbed();
                    
                    const embeds = [];
 
                    var countCourses = 1
                    for (var i = 0; i < dat.length; i++){
                        if (dat[i].name != undefined) {
                            console.log(dat[i].name);
                            //message.channel.send(dat[i].name + "\n");
                            //embed.addField(`Course ${countCourses}`, dat[i].name, false);
                            embeds.push(new Discord.MessageEmbed().addField(`Course ${countCourses}`, dat[i].name, false));
                            countCourses++; 
                        }
                    }

                    const myImage = message.author.displayAvatarURL();

                    new Pagination.Embeds()
                        .setArray(embeds)
                        .setAuthorizedUsers([message.author.id])
                        .setChannel(message.channel)
                        .setPageIndicator(true)
                        .setPage(3)
                        // Methods below are for customising all embeds
                        .setImage(myImage)
                        .setThumbnail('https://upload.wikimedia.org/wikipedia/en/thumb/a/a2/North_Texas_Mean_Green_logo.svg/1200px-North_Texas_Mean_Green_logo.svg.png')
                        .setTitle('Fall 2020 Courses')
                        .setDescription(`Here are the coures for: ${message.author}`)
                        //.setFooter('Test Footer Text')
                        //.setURL(myImage)
                        .setColor('#059033')
                        //.addField('\u200b', '\u200b')
                        //.addField('Test Field 1', 'Test Field 1', true)
                        //.addField('Test Field 2', 'Test Field 2', true)
                        .build();
                });
              
              }).on('error', (e) => {
                console.error(e);
              });

            return;

        }
       
    }
};