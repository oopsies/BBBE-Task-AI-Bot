const fs = require('fs');
const helper = require ('../helper.js');
const https = require('https');
const { DiscordAPIError } = require('discord.js');
const Discord = require('discord.js');
const Pagination = require('discord-paginationembed');

module.exports = {
    name: 'page',
    description: 'Command for users to pagination.',
    execute(message, args){
        const FieldsEmbed = new Pagination.FieldsEmbed()
            .setArray([{ name: 'John Doe' }, { name: 'Jane Doe' }])
            .setAuthorizedUsers([message.author.id])
            .setChannel(message.channel)
            .setElementsPerPage(1)
            // Initial page on deploy
            .setPage(2)
            .setPageIndicator(true)
            .formatField('Name', i => i.name)
            // Deletes the embed upon awaiting timeout
            .setDeleteOnTimeout(true)
            // Disable built-in navigation emojis, in this case: 🗑 (Delete Embed)
            .setDisabledNavigationEmojis(['delete'])
            // Set your own customised emojis
            .setFunctionEmojis({
            '🔄': (user, instance) => {
                const field = instance.embed.fields[0];
        
                if (field.name === 'Name')
                field.name = user.tag;
                else
                field.name = 'Name';
            }
            })
            // Similar to setFunctionEmojis() but this one takes only one emoji
            .addFunctionEmoji('🅱', (_, instance) => {
            const field = instance.embed.fields[0];
        
            if (field.name.includes('🅱'))
                field.name = 'Name';
            else
                field.name = 'Na🅱e';
            })
            // Sets whether function emojis should be deployed after navigation emojis
            .setEmojisFunctionAfterNavigation(false);
       
      FieldsEmbed.embed
        .setColor(0xFF00AE)
        .setDescription('Test Description');
       
      FieldsEmbed.build();

      message.channel.send(FieldsEmbed);
       
    }
};