const https = require('https');
const helper = require('../helper.js');
const fs = require('fs');

var prefix = "https://canvas.instructure.com"
var access_token = "";

module.exports = {
    name: 'getgrades',
    description: 'Displays the user\'s total grades.',
    execute(message, args){
        if(!helper.userRegistered(message.author)){
            return message.channel.send(`${message.author} Please use !register first to link your Canvas account.`);
        }
        else {

            //intro message
            message.channel.send(`Getting grades for your classes. This may take a few moments...a\n`);

            //access token
            access_token = '&access_token=' + helper.getUserToken(message.author);

            //set strings
            var main_call = '/api/v1/users/self/enrollments?'

            var grades = [];
            var iter = 0;

            var url = prefix + main_call + access_token;

            function getGrades(d) {
                var result = d;
                var courses = [];
                
                for (var i = 0; i < result.length; i++){
                    var str = result[i].grades.html_url
                    var cID = str.substring(str.lastIndexOf("courses/") + 1, str.lastIndexOf("/grades"));
                    cID = cID.substring(7);
                    //console.log(cID);
                    
                    var grade = result[i].grades.current_grade
                    if (grade !== undefined) {
                        //console.log(grade);
                        courses.push(cID);
                        grades.push(grade);
                    }
                }
            
                for (var i = 0; i < courses.length; i++){
                    iter = i;
                    url = prefix + "/api/v1/courses/" + courses[i] + "?" + access_token;
                    helper.httpsGetJSON(url, printGrades);
                }
            
            }
            
            function printGrades(d) {
                if (grades[iter] == null) {
                    //console.log("Your instructor has not put in a total grade for " + d.name + ".");
                    message.channel.send("Your instructor has not put in a total grade for " + d.name + ".");
                }
                else {
                    //console.log("Grade for " + d.name + ": " + grades[iter]);
                    message.channel.send("Grade for " + d.name + ": " + grades[iter]);
                }
            }

            helper.httpsGetJSON(url, getGrades);

        }
    }
};