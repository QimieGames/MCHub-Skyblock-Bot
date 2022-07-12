const DiscordJS = require('discord.js');

module.exports = {
    data: {
        name: 'dungeon_opened'
    },
    async execute(regexMatches, discordBot, configValue, guildID){
        try {
    
            const dungeonOpenedAlertChannelID = configValue.discord_channels.dungeon_opened;

            const dungeonOpenedAlertChannelName = discordBot.guilds.cache.get(guildID).channels.cache.get(dungeonOpenedAlertChannelID).name;

            const dungeonOpenedPingRoleID = configValue.roles_id.dungeon_opened_ping;

            const dungeonOpenedEmbed = new DiscordJS.MessageEmbed()
                .setColor('#eb8334')
                .setTitle('DUNGEON OPENED')
                .setThumbnail('https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/322/skull-and-crossbones_2620-fe0f.png')
                .setTimestamp()
                .setFooter({ text: 'Custom Coded By QimieGames', iconURL: 'https://images-ext-1.discordapp.net/external/HQFug-TJRekRG6wkhZL_wlEowWtUxuuR940ammbrz7k/https/cdn.discordapp.com/avatars/402039216487399447/347fd513aa2af9e8b4ac7ca80150b953.webp?width=115&height=115' });
                
            if(discordBot.guilds.cache.get(guildID).channels.cache.get(dungeonOpenedAlertChannelID) != undefined){
                if(discordBot.guilds.cache.get(guildID).me.permissionsIn(dungeonOpenedAlertChannelID).has('VIEW_CHANNEL') === true){
                    if(discordBot.guilds.cache.get(guildID).me.permissionsIn(dungeonOpenedAlertChannelID).has('SEND_MESSAGES') === true){
                        await discordBot.guilds.cache.get(guildID).channels.cache.get(dungeonOpenedAlertChannelID).send({ content: `|| <@&${dungeonOpenedPingRoleID}> ||`, embeds: [dungeonOpenedEmbed] });
                        return true;
                    } else {
                        console.log(`[MCHSB] Error occured while sending dungeon opened alert in #${dungeonOpenedAlertChannelName}!`);
                        return false;
                    }
                } else {
                    console.log(`[MCHSB] Error occured while viewing #${dungeonOpenedAlertChannelName}!`);
                    return false;
                }
            } else {
                console.log('[MCHSB] Error occured while finding dungeon opened alert channel!');
                return false;
            }
        } catch {
            return 'ERROR';
        }
    }
}