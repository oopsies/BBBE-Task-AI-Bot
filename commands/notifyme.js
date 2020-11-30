const fs = require('fs');

module.exports = {
    name: 'notifyme',
    description: 'Adds the user to the list of users to notify for assignments.',
    execute(message, args){

        if(!fs.existsSync('usersToNotify.json'))  {
            fs.writeFileSync('usersToNotify.json', "{}", (err) => {
                if (err) console.log("err");
                console.log('User noitifcations file successfully created')
            })
        }

        const data = fs.readFileSync('usersToNotify.json');

        let objs = JSON.parse(data);

        if (objs[message.author] == 0 || objs[message.author] == undefined) {
            objs[message.author] = 1;
            message.channel.send(`Notifications enabled for ${message.author}.`);
        }
        else {
            objs[message.author] = 0;
            message.channel.send(`Notifications disabled for ${message.author}.`);
        }

        fs.writeFileSync('usersToNotify.json', JSON.stringify(objs));

    }

};