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
            var promises = [];
            var promises2 = [];
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
                    // console.log(courses[i])
                    // console.log(i)
                    let url2 = prefix + "/api/v1/courses/" + courses[i] + "/assignments?per_page=50" + access_token;
                    let url3 = prefix + "/api/v1/courses/" + courses[i] + "?" +access_token
                    //helper.httpsGetJSON(url3, getCourseName);
                    promises.push(helper.httpsGetJSON2(url3));
                    promises2.push(helper.httpsGetJSON2(url2));
                    //helper.httpsGetJSON(url2, printAssignments);
                }
                Promise.all(promises).then((results)=>{
                    for(let i = 0; i < results.length; i++){
                        coursed.push(results[i]);
                    }
                });
                Promise.all(promises2).then((results)=>{
                    for(let i = 0; i < results.length; i++){
                        var embed = new Discord.MessageEmbed()
                        .setColor('#059033')
                        .setTitle(coursed[i].name)
                        .setThumbnail('https://upload.wikimedia.org/wikipedia/en/thumb/a/a2/North_Texas_Mean_Green_logo.svg/1200px-North_Texas_Mean_Green_logo.svg.png');    
                        var countAssignments = 1;
                        m=""
                        for(let j = 0; j < results[i].length; j++){
                            var dueTime = results[i][j].due_at;

                            if (dueTime != null && dateInFuture(dueTime)){
                                //console.log(result[j].name + " is due on " + parseDate(dueTime)+ "\t");
                                m += results[i][j].name + " is due on " + parseDate(dueTime) + "\n";
                                //console.log(m);
        
                                //creating fields
                                embed.addField(`Assignment ${countAssignments}`, results[i][j].name + " is due on " + parseDate(dueTime), false);
                                countAssignments++;
        
                            }
                        }
                        if (m != "") {message.channel.send(embed);}
                    }                   
                })
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