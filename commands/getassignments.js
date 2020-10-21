//A simple GET request to the Canvas API, not to be used for anything real
const https = require('https');

var prefix = "https://canvas.instructure.com"
var access_token = 

https.get(prefix + '/api/v1/courses/90820000000033995/assignments?per_page=100' + access_token, "JSON", function(response){
   var data;

  response.on('data', function(chunk) {
    if (!data){
        data = chunk;
    }
    else{
        data += chunk;
    }
  });
  response.on("end", function() {
    const result = JSON.parse(data);
    for (var i = 0; i < result.length; i++){
        var dueTime = result[i].due_at;
        if (dueTime != null && dateInFuture(dueTime)){
            console.log(result[i].name + " is due at " + parseDate(dueTime));
        }
    }

      //console.log(result);
  })

}).on('error', (e) => {
  console.error(e);
});

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

    //create date and subtract for correct time zone
    var inputDate = new Date(year, month, day, hour, minute, second);

    if (inputDate > now)
        return true;
    return false;
}