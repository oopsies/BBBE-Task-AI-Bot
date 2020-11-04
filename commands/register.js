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
            
            //create file if it does not exist
            if(!fs.existsSync('./tokens.json'))  {
                fs.writeFile('./tokens.json', "{}", (err) => {
                    if (err) console.log(err);
                    console.log('Successfully created')
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

            return message.author.send(`Token recieved ${message.author}!`); 
        }
    }

};