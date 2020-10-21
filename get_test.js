//A simple GET request to the Canvas API, not to be used for anything real
const https = require('https');
const helper = require ('./helper.js');

var prefix = "https://canvas.instructure.com"
//var access_token = 
var main_call = '/api/v1/users/self/enrollments?'

var url = prefix + main_call + access_token;

var result;

helper.httpsGetJSON(url).then(response => {
    result = response;
    console.log(result);

})
