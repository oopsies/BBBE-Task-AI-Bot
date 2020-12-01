//Starting files to import Discord functionality and config files for bot.
const { Client } = require("discord.js");
const { config } = require("dotenv"); 

const client = new Client();

const fs = require('fs');
const Discord = require('discord.js');
const helper = require("./helper");
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'))


//Path for token.
config({
    path: __dirname + "/.env"
});

//Turn the bot on and set presence. 
client.on("ready", () => {
    console.log("BBBE Bot is online!");

    client.user.setPresence({
        status: "online",
        game: {
            name: "our awesome group!",
            type: "WATCHING"
        }
    })
    notifyAssignments();
    timetest();
});

for (const file of commandFiles){
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}


//Handles messages
client.on("message", async message => {
    //Prefix for all commands
    const prefix = "!";

    //If the message does not start with prefix ignore it.
    if(!message.content.startsWith(prefix) || message.author.bot) return; 

    //If message does have prefix splice it by spaces for analysis. We use regex to account for multiple spaces.
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if (!client.commands.has(command)) return;
    try {
        client.commands.get(command).execute(message, args);
        //console.log(`${command}\t${message}\t${args}`)
    }
    catch(error){
        console.error(error);
        message.reply('Command error');
    }
    console.log(`${message.author.username} said: ${message.content}`);
});

client.login(process.env.TOKEN);



function timetest(){
    setTimeout(function(){
        notifyAssignments();
        timetest();
    }, 15*1000*60); //every 15 mins
}

function notifyAssignments(){

    let users = []; //array of users to notify
    if(fs.existsSync('usersToNotify.json'))  {
        const data = JSON.parse(fs.readFileSync('usersToNotify.json'));
        //get users to notify
        for (key in data){
            if (data[key] == "1") {
               users.push(key);
            }
        }

        for (let i = 0; i < users.length; i++){ //for every user
            //get access token
            let token = helper.getUserToken(users[i]);
            
            //get course ids
            let courseIDs = [];
            let uid = users[i].substring(2).slice(0, -1);
            let courses = helper.getUserCourses(uid);
            
            for (key in courses){
                courseIDs.push(key);
                ///console.log(key);
            }

            let promises = []; //list of promises for assignments
            for (let j = 0; j < courseIDs.length; j++){
                //go through all courses and all assignments
                let url = "https://canvas.instructure.com/api/v1/courses/" + courseIDs[j] + "/assignments?per_page=50&access_token=" + token;
                promises.push(helper.httpsGetJSON2(url));
            }

            Promise.all(promises).then((results) => { //when all calls are made, print assignments
                //console.log(results[1][0].name);
                for (let j = 0; j < results.length; j++){
                    for (let k = 0; k < results[j].length; k++){
                        //if (helper.dateInFuture(results[i].due_at))
                        if (results[j][k] != undefined && results[j][k].due_at != null && helper.dateInFuture(results[j][k].due_at)){
                            //console.log(results[j][k].name)
                            if (helper.isDue(results[j][k].due_at, 1, 0, 0, 15))
                                client.users.cache.get(uid).send(results[j][k].name + "is due in 1 day.")
                            else if (helper.isDue(results[j][k].due_at, 0, 3, 0, 15))
                                client.users.cache.get(uid).send(results[j][k].name + "is due in 3 hours.")
                            else if (helper.isDue(results[j][k].due_at, 0, 1, 0, 15))
                                client.users.cache.get(uid).send(results[j][k].name + "is due in 1 hour.")
                            else if (helper.isDue(results[j][k].due_at, 0, 0, 30, 15))
                                client.users.cache.get(uid).send(results[j][k].name + "is due in 30 minutes.")
                        }
                    }
                }
                //console.log(results);
            });



        }



    }
}