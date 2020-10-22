const fs = require('fs');
const helper = require ('../helper.js');
const https = require('https');
const { DiscordAPIError } = require('discord.js');
const Discord = require('discord.js');

module.exports = {
    name: 'getcourses',
    description: 'Displays the user who called the command in the server.',
    execute(message, args){
        if(!helper.userRegistered(message.author)){
            return message.channel.send(`${message.author} Please use !register first to link your Canvas account.`);
        }
        else {
            
            //intro message
            //message.channel.send(`Here's a list of your available courses:\n`);

            //get user token
            var access_token = '&access_token=' + helper.getUserToken(message.author);

            //set strings for HTTPS request
            var prefix = "https://canvas.instructure.com";
            var main_call = '/api/v1/courses?per_page=100';

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
                    const embed = new Discord.MessageEmbed()
                    .setColor('#059033')
                    .setTitle('Future Assignments')
                   // .setURL() ~ Insert Canvas Dashboard Page Here?
                    .setThumbnail('https://upload.wikimedia.org/wikipedia/en/thumb/a/a2/North_Texas_Mean_Green_logo.svg/1200px-North_Texas_Mean_Green_logo.svg.png');
                    
                    
                    var countCourses = 1
                    for (var i = 0; i < dat.length; i++){
                        if (dat[i].name != undefined) {
                            console.log(dat[i].name);
                            //message.channel.send(dat[i].name + "\n");
                            embed.addField(`Course ${countCourses}`, dat[i].name, false);
                            countCourses++; 
                        }
                    }
                    message.channel.send(embed);
                });
              
              }).on('error', (e) => {
                console.error(e);
              });

            return;
        }
    }
};