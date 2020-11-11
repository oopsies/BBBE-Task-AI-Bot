const https = require('https');
const helper = require('../helper.js');
const fs = require('fs');
const { DiscordAPIError } = require('discord.js');
const Discord = require('discord.js');
const { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } = require('constants');
const e = require('express');

var prefix = "https://canvas.instructure.com"
var access_token = "";
//var m

module.exports = {
    name: 'getassignments',
    description: 'Displays the user\'s future assignments.',
    execute(message, args){
        if(!helper.userRegistered(message.author)){
            return message.channel.send(`${message.author} Please use !register in a private message first to link your Canvas account.`);
        }
        else {

            //intro message
            message.channel.send(`Getting future assignments for your classes. This may take a few moments...\n`);

            //access token
            access_token = '&access_token=' + helper.getUserToken(message.author);

            //set strings
            var main_call = '/api/v1/users/self/enrollments?'

            var url = prefix + main_call + access_token;
            //Course Ids
            courses = [];
            //Course Names
            coursed = [];
            //Validation of appearance
            courseBool = [];
            //List of Assignments
            courseEmbeds = [];
            function getAssignments(d) {
                result = d;
                for (var i = 0; i < result.length; i++){
                    var str = result[i].html_url
                    var cID = str.substring(str.lastIndexOf("courses/") + 1, str.lastIndexOf("/users"));
                    cID = cID.substring(7);
                    //console.log(cID);
                    courses.push(cID);
                }
                //Api Calls
                for (var i = 0; i < courses.length; i++){
                    url2 = prefix + "/api/v1/courses/" + courses[i] + "/assignments?per_page=50" + access_token;
                    url3 = prefix + "/api/v1/courses/" + courses[i] + "?" +access_token
                    helper.httpsGetJSON(url3, getCourseName);
                    helper.httpsGetJSON(url2, printAssignments);
                }

            }

            //Lists of courses
            function getCourseName(d){
                var result = d;
                var str = result.name;
                coursed.push(result);
                courseBool.push(0);
            }


            //Prints an embeded list based on courses and assignments
            function printAssignments(d) {
                var m = "";
                result = d;

                //build embed here
                var embed = new Discord.MessageEmbed()
                    .setColor('#059033')
                    .setTitle('Future Assignments')
                    .setThumbnail('https://upload.wikimedia.org/wikipedia/en/thumb/a/a2/North_Texas_Mean_Green_logo.svg/1200px-North_Texas_Mean_Green_logo.svg.png');



                var countAssignments = 1;
                //Cycles through all assignments then all courses
                for (var j = 0; j < result.length; j++){
                    var dueTime = result[j].due_at;
                    for(var k = 0; k < coursed.length; k++ ){
                        //Checks if the assignment courseid is equal to the courseID for naming purposes
                        if(parseInt(result[j].course_id)===parseInt(coursed[k].id)){
                            if(courseBool[k]!=1){
                                courseBool[k]=1;
                                var embed2 = new Discord.MessageEmbed()
                                    .setColor('#059033')
                                    .setTitle(coursed[k].name)
                               // .setURL() ~ Insert Canvas Dashboard Page Here?
                                    .setThumbnail('https://upload.wikimedia.org/wikipedia/en/thumb/a/a2/North_Texas_Mean_Green_logo.svg/1200px-North_Texas_Mean_Green_logo.svg.png');
                                    //.description(coursed[k].id)
                                embed = embed2
                                embed.description=coursed[k].id
                            }
                            else{
                                for(x = 0; x < courseEmbeds.length; x++){
                                    if(courseEmbeds[x].title==coursed[k].name){
                                        embed = courseEmbeds[x];
                                        break;
                                    }
                                }
                            }
                            break;
                        }
                    }
                    //Makes sure only futre assignments get printed
                    if (dueTime != null && dateInFuture(dueTime)){
                        if(embed.description!=result[j].course_id){
                            for(x=0; x < courseEmbeds.length; x++){
                                if(courseEmbeds[x].description===result[j].course_id){
                                    embed = courseEmbeds[x];
                                    break;
                                }
                            }
                        }
                        else{
                            console.log(embed.description+"==="+result[j].course_id)
                            for(var p = 0; p < coursed.length; p++){
                                if(embed.description===coursed[p].id){
                                    console.log(coursed[p].name)
                                }
                            }
                        }
                        //console.log(result[j].name + " is due on " + parseDate(dueTime)+ "\t");
                        m += result[j].name + " is due on " + parseDate(dueTime) + "\n";
                        //console.log(m);

                        //creating fields
                        embed.addField(`Assignment ${countAssignments}`, result[j].name + " is due on " + parseDate(dueTime), false);
                        countAssignments++;

                    }
                    //courseEmbeds.push(embed)
                }
                if (m != "") {
                    var checker = 0;
                    for(var x = 0; x < courseEmbeds.length; x++){
                        if(courseEmbeds[x].title===embed.title){
                            embed.title = courseEmbeds[x].title
                            courseEmbeds[x]=embed;
                            console.log(embed)
                            console.log("Found Again")
                            console.log(embed.title)
                            embed.title = courseEmbeds[x].title
                            message.channel.send(embed);
                            checker=1;
                            break;
                        }
                    }
                    if(checker==0){
                        courseEmbeds.push(embed);
                        message.channel.send(embed);
                    }


                }
            }

            helper.httpsGetJSON(url, getAssignments);

        }
    }
};



///Returns a readable string based on a date.
//example date format: 2020-11-03T05:59:59Z
function parseDate (date){

    //get parts of date and time
    var year = date.substring(0, 4);
    var month = date.substring(5, 7) - 1;
    var day = date.substring(8, 10);

    var time = date.substring(11, 19);
    var hour = time.substring(0, 2);
    var minute = time.substring(3, 5);
    var second = time.substring(6);

    //create date and subtract for correct time zone
    var d = new Date(year, month, day, hour, minute, second);
    d.setHours(d.getHours() - 6);

    //console.log(d.toString());
    //console.log(year + " " + month + " " + day + " " + hour + " " + minute + " " + second + "\n");

    return d.toString();
}

///Returns true if the date input is in the future from now
function dateInFuture (date) {
    var now = new Date();

    //get parts of date and time
    var year = date.substring(0, 4);
    var month = date.substring(5, 7) - 1;
    var day = date.substring(8, 10);

    var time = date.substring(11, 19);
    var hour = time.substring(0, 2);
    var minute = time.substring(3, 5);
    var second = time.substring(6);

    //create date
    var inputDate = new Date(year, month, day, hour, minute, second);

    //compare date
    if (inputDate > now)
        return true;
    return false;
}