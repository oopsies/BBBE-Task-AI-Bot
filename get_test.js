//A simple GET request to the Canvas API, not to be used for anything real
const https = require('https');

var prefix = "https://canvas.instructure.com"
var access_token = "&access_token=9082~9ojp64MaovXtBToA5OqfSTBIZqGk8luPJ52ChLobxglbrLYZpHM82yoDnpPc4qtX"


https.get(prefix + '/api/v1/courses?per_page=100' + access_token, (res) => {
  //console.log('statusCode:', res.statusCode);
  //console.log('headers:', res.headers);
  

  res.on('data', (d) => {
    //process.stdout.write(d);
    var dat = JSON.parse(d);
    //console.log(dat);
    for (var i = 0; i < dat.length; i++){
        if (dat[i].name != undefined) {
            console.log(dat[i].name);
        }
    }
  });

}).on('error', (e) => {
  console.error(e);
});
