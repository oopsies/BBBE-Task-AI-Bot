///TODO: Resolve warnings LOL (there's a lot of them)
const https = require('https');
const helper = require('../helper.js');
const fs = require('fs');

var prefix = "https://canvas.instructure.com"
var access_token = "";
var m

module.exports = {
    name: 'getassignments',
    description: 'Displays the user\'s future assignments.',
    execute(message, args){
        if(!helper.userRegistered(message.author)){
            return message.channel.send(`${message.author} Please use !register first to link your Canvas account.`);
        }
        else {

            //intro message
            message.channel.send(`Getting future assignments for your classes. This may take a few moments...a\n`);

            //access token
            access_token = '&access_token=' + helper.getUserToken(message.author);

            //set strings
            var main_call = '/api/v1/users/self/enrollments?'

            var url = prefix + main_call + access_token;

            function getAssignments(d) {
                var result = d;
                courses = [];
                for (var i = 0; i < result.length; i++){
                    var str = result[i].html_url
                    var cID = str.substring(str.lastIndexOf("courses/") + 1, str.lastIndexOf("/users"));
                    cID = cID.substring(7);
                    //console.log(cID);
                    courses.push(cID);
                }
            
                for (var i = 0; i < courses.length; i++){
                    url2 = prefix + "/api/v1/courses/" + courses[i] + "/assignments?per_page=50" + access_token;
                    helper.httpsGetJSON(url2, printAssignments);
                }
            
            }
            
            function printAssignments(d) {
                var m = "";
                result = d;
                for (var j = 0; j < result.length; j++){
                    var dueTime = result[j].due_at;
                    if (dueTime != null && dateInFuture(dueTime)){
                        console.log(result[j].name + " is due on " + parseDate(dueTime));
                        m += result[j].name + " is due on " + parseDate(dueTime) + "\n";
                        //console.log(m);
                    }
                }
                if (m != "") { message.channel.send(m); } 
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