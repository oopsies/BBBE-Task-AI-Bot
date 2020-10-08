//A simple GET request to the Canvas API, not to be used for anything real
const https = require('https');

var prefix = "https://canvas.instructure.com"
var access_token = "&access_token="

https.get(prefix + '/api/v1/users/self/profile?' + access_token, (res) => {
  //console.log('statusCode:', res.statusCode);
  //console.log('headers:', res.headers);
  

  res.on('data', (d) => {
    process.stdout.write(d);
    //console.log(JSON.stringify(d));
  });

}).on('error', (e) => {
  console.error(e);
});
