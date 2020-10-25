module.exports = {
    name: 'embed',
    description: 'Practicing to add color and design to commands.',
    execute(message, args){
        const embed = new Discord.MessageEmbed()
        .setTitle("This is an Example!")
        .setAuthor(`${message.author}`, "https://i.imgur.com/lm8s41J.png")
        
        
        .setColor(0x00AE86)
        .setDescription("This is for practice purposes.")
        .setFooter("Footer text goes here", "http://i.imgur.com/w1vhFSR.png")
        .setImage("http://i.imgur.com/yVpymuV.png")
        .setThumbnail("http://i.imgur.com/p2qNFag.png")
        /*
        * Takes a Date object, defaults to current date.
        */
        .setTimestamp()
        .setURL("https://discord.js.org/#/docs/main/v12/class/MessageEmbed")
        .addFields({ name: "Embed Practice",
            value: "*Insert field value information."})
        /*
        * Inline fields may not display as inline if the thumbnail and/or image is too big.
        */
        .addFields({ name: "Inline Field", value: "What goes here? Nothing for now", inline: true })
        /*
        * Blank field, useful to create some space.
        */

        message.channel.send(embed);

       
    }

};