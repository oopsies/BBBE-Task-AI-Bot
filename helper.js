//helper functions
const fs = require('fs');

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

module.exports = { getUserToken, userRegistered };