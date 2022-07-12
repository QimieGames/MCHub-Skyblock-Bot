const DiscordJS = require('discord.js');

module.exports = {
    data: {
        name: 'upcoming_dungeon'
    },
    async execute(regexMatches, discordBot, configValue, guildID){
        try {
    
            const upcomingDungeonAlertChannelID = configValue.discord_channels.upcoming_dungeon;

            const upcomingDungeonAlertChannelName = discordBot.guilds.cache.get(guildID).channels.cache.get(upcomingDungeonAlertChannelID).name;

            const upcomingDungeonDetails = regexMatches[0];

            const upcomingDungeonTime = upcomingDungeonDetails[0];

            const upcomingDungeonEmbed = new DiscordJS.MessageEmbed()
                .setColor('#eb8334')
                .setTitle('UPCOMING DUNGEON EVENT')
                .setDescription(`Time: ${upcomingDungeonTime}`)
                .setThumbnail('https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/322/skull-and-crossbones_2620-fe0f.png')
                .setTimestamp()
                .setFooter({ text: 'Custom Coded By QimieGames', iconURL: 'https://images-ext-1.discordapp.net/external/HQFug-TJRekRG6wkhZL_wlEowWtUxuuR940ammbrz7k/https/cdn.discordapp.com/avatars/402039216487399447/347fd513aa2af9e8b4ac7ca80150b953.webp?width=115&height=115' });

            if(discordBot.guilds.cache.get(guildID).channels.cache.get(upcomingDungeonAlertChannelID) != undefined){
                if(discordBot.guilds.cache.get(guildID).me.permissionsIn(upcomingDungeonAlertChannelID).has('VIEW_CHANNEL') === true){
                    if(discordBot.guilds.cache.get(guildID).me.permissionsIn(upcomingDungeonAlertChannelID).has('SEND_MESSAGES') === true){
                        await discordBot.guilds.cache.get(guildID).channels.cache.get(upcomingDungeonAlertChannelID).send({ embeds: [upcomingDungeonEmbed] });
                        return true;
                    } else {
                        console.log(`[MCHSB] Error occured while sending upcoming dungeon event alert in #${upcomingDungeonAlertChannelName}!`);
                        return false;
                    }
                } else {
                    console.log(`[MCHSB] Error occured while viewing #${upcomingDungeonAlertChannelName}!`);
                    return false;
                }
            } else {
                console.log('[MCHSB] Error occured while finding upcoming dungeon event alert channel!');
                return false;
            }
        } catch {
            return 'ERROR';
        }
    }
}