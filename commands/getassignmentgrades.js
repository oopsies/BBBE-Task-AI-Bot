const https = require('https');
const helper = require('../helper.js');
const fs = require('fs');
const Discord = require('discord.js');

var prefix = "https://canvas.instructure.com"
var access_token = "";

module.exports = {
    name: 'getassignmentgrades',
    description: 'Displays the user\'s total grades.',
    execute(message, args){
        if(!helper.userRegistered(message.author)){
            return message.channel.send(`${message.author} Please use !register in a private message first to link your Canvas account.`);
        }
        else {

            //intro message
            message.channel.send(`Getting grades for your classes...\n`);

            //access token
            var access_token = '&access_token=' + helper.getUserToken(message.author);

            var courses = helper.getUserCourses(message.author.id); //returns an object of courseIDs:CourseNames
            var promises = [];
            var courseNames = [];

            for (key in courses){
                courseNames.push(courses[key]);
                let url = prefix + '/api/v1/courses/' + key + '/assignments?include[]=submission' + access_token;
                promises.push(helper.httpsGetJSON2(url));
            }

            Promise.all(promises).then((results) => {
                for (let i = 0; i < results.length; i++){
                    
                    const embed = new Discord.MessageEmbed()
                        .setColor('#059033')
                        .setTitle('Grades for ' + courseNames[i] + ':')
                        // .setURL() ~ Insert Canvas Dashboard Page Here?
                        .setThumbnail('https://upload.wikimedia.org/wikipedia/en/thumb/a/a2/North_Texas_Mean_Green_logo.svg/1200px-North_Texas_Mean_Green_logo.svg.png')
                        .setFooter("Wrong courses? Use !update to refresh your courses.", "https://e7.pngegg.com/pngimages/1017/780/png-clipart-exclamation-mark-exclamation-mark.png")
                        .setTimestamp();
                    

                    //console.log(courseNames[i] + ":");
                    let assignments = results[i];
                    for (let j = 0; j < assignments.length; j++){
                        let grade = assignments[j].submission.entered_grade;
                        if (grade != undefined){
                            let percent = 100 * grade/assignments[j].points_possible;
                            embed.addField(assignments[j].name + ": " + percent + "%", "(" + grade + "/" + assignments[j].points_possible + ")");
                            //console.log("   " + assignments[j].name + ": " + grade + "/" + assignments[j].points_possible + " == " + percent + "%");
                        }
                    }
                    message.channel.send(embed);
                }
            });

        }
    }
};