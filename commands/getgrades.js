const https = require('https');
const helper = require('../helper.js');
const fs = require('fs');
const Discord = require('discord.js');

var prefix = "https://canvas.instructure.com"
var access_token = "";

module.exports = {
    name: 'getgrades',
    description: 'Displays the user\'s total grades.',
    execute(message, args){
        if(!helper.userRegistered(message.author)){
            return message.channel.send(`${message.author} Please use !register in a private message first to link your Canvas account.`);
        }
        else {

            //intro message
            message.channel.send(`Getting grades for your classes...\n`);

            //access token
            access_token = '&access_token=' + helper.getUserToken(message.author);

            //set strings
            var main_call = '/api/v1/users/self/enrollments?'

            var url = prefix + main_call + access_token;

            var courseIDs = []; //ids of courses
            var courseNames = []; //names of courses

            //get course IDs and Names from cache
            courses = helper.getUserCourses(message.author.id);
            for (key in courses){
                courseIDs.push(key);
                courseNames.push(courses[key]);
            }

        
            helper.httpsGetJSON2(url).then((result) => {
                //console.log(result)

                //set up embed
                const embed = new Discord.MessageEmbed()
                .setColor('#059033')
                .setTitle('Your grades')
                //.setURL() ~ Insert Canvas Dashboard Page Here?
                .setThumbnail('https://upload.wikimedia.org/wikipedia/en/thumb/a/a2/North_Texas_Mean_Green_logo.svg/1200px-North_Texas_Mean_Green_logo.svg.png')
                .setFooter("Wrong courses? Use !update to refresh your courses.", "https://e7.pngegg.com/pngimages/1017/780/png-clipart-exclamation-mark-exclamation-mark.png")
                .setTimestamp();

                for (let i = 0; i < courseIDs.length; i++){ //for each course, go through the enrollments and find the correct one
                    for (let j = 0; j < result.length; j++){
                        let cid = result[j].grades.html_url.substring(result[j].grades.html_url.lastIndexOf("courses/") + 1, result[j].grades.html_url.lastIndexOf("/grades")).substring(7); //god DANG this is ugly but i wanted to fit it on one line lol
                        if (courseIDs[i] == cid){
                            let grade = result[j].grades.current_score;

                            if (grade == null || grade == undefined){
                                embed.addField(`${courseNames[i]}`, "Your instructor has not put in a total grade for this course.", false);
                                break;
                            }
                            else {
                                embed.addField(`${courseNames[i]}`, `${grade}%`, false);
                                break;
                            }

                        }
                    }
                }

                return message.channel.send(embed);

            });
            return;
        }
    }
};