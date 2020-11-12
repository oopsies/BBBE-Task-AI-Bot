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
 * Uses callbacks. Try to use the one with promises
 * @param {string} url 
 * @param {function} callback
 */
function httpsGetJSON (url, callback){
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
            data = JSON.parse(data);
            callback(data);
        });

    }).on('error', (e) => {
        console.error(e);
        });
}

/**
 * Gets the HTTPS Response from the page, and returns a promise of the parsed JSON.
 * Uses promises instead of callbacks
 * @param {string} url 
 */
function httpsGetJSON2(url){
    let dataPromise = new Promise((resolve, reject) => {
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
                data = JSON.parse(data);
                resolve(data); //sucess, return the data
            });

        }).on('error', (e) => {
            console.error(e);
            reject(e); //error, reject
            });
    });
    //return the promise of the data
    return dataPromise;
}
/**
 * Store the user's course ID's along with their name per user.
 * This is done to reduce the total number of calls to the API.
 * @param {string} filename - where to store the courses
 * @param {string} id - the user's Discord ID
 * @param {JSON} courses - a JSON object of the user's courseID's and courseNames
 */
function storeUserCourses(id, courses){
    //create file if it does not exist
    if(!fs.existsSync('userCourses.json'))  {
        fs.writeFileSync('userCourses.json', "{}", (err) => {
            if (err) console.log("err");
            console.log('User courses file successfully created')
        })
    }

    //console.log(id);

    const data = fs.readFileSync('userCourses.json');

    let objs = JSON.parse(data);
    //console.log(objs);

    objs[id] = courses;
    //console.log("in: ");
    //console.log(objs);

    fs.writeFileSync('userCourses.json', JSON.stringify(objs));

    //1. Read JSON file into JS object
    //2. Append the courses into the object
    //3. Write back to JSON file
    /*fs.readFileSync('userCourses.json', function(err, data) {
        if (err) throw err;
    
        console.log("yo we good");
        let objs = JSON.parse(data);
        objs[id] = courses;
        console.log("yo we good");
    
        fs.writeFileSync('userCourses.json', JSON.stringify(objs), 'utf-8', function(err) {
            if (err) throw err;
        })
    });*/
    //console.log("done")

}

/**
 * Get the user's stored courses based on their id
 * Returns an object containing a list of courseID's and names.
 * @param {string} id s
 */
function getUserCourses(id){
    
    const data = fs.readFileSync('userCourses.json', 'utf8');
    const userData = JSON.parse(data)[id];
    //console.log("out: ");
    //console.log(userData);
    /*for (key in betterData){
        console.log(key + " == " + betterData[key]);
    }*/
    return userData;
}

module.exports = { getUserToken, userRegistered, httpsGetJSON, httpsGetJSON2, storeUserCourses, getUserCourses };