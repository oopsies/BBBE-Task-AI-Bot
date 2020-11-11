const fs = require('fs');
const helper = require ('../helper.js');
const https = require('https');
const { DiscordAPIError } = require('discord.js');
const Discord = require('discord.js');

module.exports = {
    name: 'update',
    description: 'Updates the user\'s courses from the API.',
    execute(message, args){
        if(!helper.userRegistered(message.author)){
            return message.channel.send(`${message.author} Please use !register in a private message first to link your Canvas account.`);
        }
        else {

            //Get and store user's class ID's to make fetching them easier in the future

            var prefix = "https://canvas.instructure.com"
            var access_token = "&access_token=" + helper.getUserToken(message.author);
            var main_call = '/api/v1/users/self/enrollments?per_page=50'

            let url = prefix + main_call + access_token;

            helper.httpsGetJSON2(url).then((result) => {
                var courses = [];
            
                //get all course ID's from the result
                for (let i = 0; i < result.length; i++){
                    var str = result[i].grades.html_url
                    var cID = str.substring(str.lastIndexOf("courses/") + 1, str.lastIndexOf("/grades"));
                    cID = cID.substring(7);
                    courses.push(cID);
                }
                //console.log(courses);
                const c = courses
            
                courseDataPromises = []; //start an array of promises
            
                for (let i = 0; i < courses.length; i++){
                    u = prefix + "/api/v1/courses/" + courses[i] + "?" + access_token;
                    //add data promise to array
                    courseDataPromises.push(helper.httpsGetJSON2(u));
                }
            
                //go through all promises when done
                Promise.all(courseDataPromises).then((results) => {
            
                    //create object
                    let IDNamePairs = {};
            
                    for (let i = 0; i < results.length; i++){
                        IDNamePairs[c[i]] = results[i].name;
                    }
            
                    helper.storeUserCourses(message.author.id, IDNamePairs);

                    //Return updated courses

                    message.channel.send("Your courses have been updated.")
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

                }).catch(reject => {console.error(reject)});
            
            }).catch((reject) => { console.log(reject) });

            return;

        }
    }
};