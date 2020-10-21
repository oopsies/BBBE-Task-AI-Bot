//helper functions
const fs = require('fs');
const https = require('https');

/**Returns Canvas access token based on Discord ID: goes through JSON file containing pairs
*@param {string} id - User's Discord ID
*/
function getUserToken(id){
    const data = fs.readFileSync('tokens.json', 'utf8');
    var objs = JSON.parse(data);
    return objs[id];
}

/**Checks if the user has a registered access token. Returns true or false.
*@param {string} id - User's Discord ID
*/
function userRegistered(id){
    const data = fs.readFileSync('tokens.json', 'utf8');
    var objs = JSON.parse(data);
    if (objs[id] == undefined)
        return false;
    return true;
}
/**
 * Gets the HTTPS Response from the page, and returns the parsed JSON.
 * @param {string} url 
 */
function httpsGetJSON (url){
    return new Promise((resolve, reject) => {
    var result;
    https.get(url, "JSON", function (response) {
        var data;

        response.on('data', function (chunk) {
            if (!data) {
                data = chunk;
            }
            else {
                data += chunk;
            }
        });
        response.on("end", function () {
            result = JSON.parse(data);
            resolve(result);
        });

    }).on('error', (e) => {
        console.error(e);
    });

    });
}

module.exports = { getUserToken, userRegistered, httpsGetJSON };

