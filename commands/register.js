const fs = require('fs');
const helper = require ('../helper.js');

module.exports = {
    name: 'register',
    description: 'Register a user\'s token with their Discord ID.',
    execute(message, args){
        if(!args.length){
            return message.author.send(`${message.author} Usage: !register <Canvas Access Token>
            \nHow to get your access token:
            \n1. Log in to canvas on your web browser.
            \n2. On the left hand side, click account > settings.
            \n3. Scroll down and click on '+ New Access Token
            \n4. Click 'Generate Token' and copy the token given to you.`);
            
        }
        else {

            //if the user posts their key in a public channel, delete it and tell them to register privately
            if (message.channel.type == "text") {
                message.delete({timeout:1});
                return message.channel.send(`${message.author}, please register your token with me through a private message. Do not release your Canvas token publicly.`);
            }
            
            //create file if it does not exist
            if(!fs.existsSync('./tokens.json'))  {
                fs.writeFileSync('./tokens.json', "{}", (err) => {
                    if (err) console.log("err");
                    console.log('Tokens file successfully created')
                })
            }

            //1. Read JSON file into JS object
            //2. Append the user's input into the object
            //3. Write back to JSON file
            //4. Send confirmation to user
            fs.readFile('./tokens.json', 'utf-8', function(err, data) {
                if (err) throw err;
            
                var objs = JSON.parse(data);

                
                objs[message.author] = args[0];
            
                //console.log(objs);
            
                fs.writeFile('./tokens.json', JSON.stringify(objs), 'utf-8', function(err) {
                    if (err) throw err;
                })
            })
            //console.log(helper.getUserToken(message.author));

            message.channel.send(`Token recieved ${message.author}!`); 

            //Get and store user's class ID's to make fetching them easier in the future

            var prefix = "https://canvas.instructure.com"
            var access_token = "&access_token=" + args[0];
            var main_call = '/api/v1/users/self/enrollments?per_page=50'

            let url = prefix + main_call + access_token;

            helper.httpsGetJSON2(url).then((result) => {
                let courses = [];
            
                //get all course ID's from the result
                for (let i = 0; i < result.length; i++){
                    var str = result[i].grades.html_url
                    var cID = str.substring(str.lastIndexOf("courses/") + 1, str.lastIndexOf("/grades"));
                    cID = cID.substring(7);
                    courses.push(cID);
                }
                //console.log(courses);
            
                courseDataPromises = []; //start an array of promises
            
                for (let i = 0; i < courses.length; i++){
                    u = prefix + "/api/v1/courses/" + courses[i] + "?" + access_token;
                    //add data promise to array
                    courseDataPromises.push(helper.httpsGetJSON2(u));
                }
            
                //go through all promises when done
                Promise.all(courseDataPromises).then((results) => {
            
                    //create object
                    let IDNamePairs = {};
            
                    for (let i = 0; i < results.length; i++){
                        IDNamePairs[courses[i]] = results[i].name;
                        //console.log(results[i].name);
                    }
            
                    helper.storeUserCourses(message.author.id, IDNamePairs);
                    //console.log(message.author.id);
                    //console.log(IDNamePairs);
                }).catch(reject => {console.error(reject)});
            
            }).catch((reject) => { console.log(reject) });

        }
    }

};