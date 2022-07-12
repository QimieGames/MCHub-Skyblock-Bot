const DiscordJS = require('discord.js');

module.exports = {
    data: {
        name: 'pve_boss_spawned'
    },
    async execute(regexMatches, discordBot, configValue, guildID){
        try {
    
            const pveBossSpawnedAlertChannelID = configValue.discord_channels.pve_boss_spawned;

            const pveBossSpawnedAlertChannelName = discordBot.guilds.cache.get(guildID).channels.cache.get(pveBossSpawnedAlertChannelID).name;

            const pveBossSpawnedPingRoleID = configValue.roles_id.pve_boss_spawned_ping;

            const pveBossSpawnedEmbed = new DiscordJS.MessageEmbed()
                .setColor('#eb8334')
                .setTitle('PVE BOSS SPAWNED')
                .setThumbnail('https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/322/skull-and-crossbones_2620-fe0f.png')
                .setTimestamp()
                .setFooter({ text: 'Custom Coded By QimieGames', iconURL: 'https://images-ext-1.discordapp.net/external/HQFug-TJRekRG6wkhZL_wlEowWtUxuuR940ammbrz7k/https/cdn.discordapp.com/avatars/402039216487399447/347fd513aa2af9e8b4ac7ca80150b953.webp?width=115&height=115' });
    
            if(discordBot.guilds.cache.get(guildID).channels.cache.get(pveBossSpawnedAlertChannelID) != undefined){
                if(discordBot.guilds.cache.get(guildID).me.permissionsIn(pveBossSpawnedAlertChannelID).has('VIEW_CHANNEL') === true){
                    if(discordBot.guilds.cache.get(guildID).me.permissionsIn(pveBossSpawnedAlertChannelID).has('SEND_MESSAGES') === true){
                        await discordBot.guilds.cache.get(guildID).channels.cache.get(pveBossSpawnedAlertChannelID).send({ content: `|| <@&${pveBossSpawnedPingRoleID}> ||`, embeds: [pveBossSpawnedEmbed] });
                        return true;
                    } else {
                        console.log(`[MCHSB] Error occured while sending pve boss spawned alert in #${pveBossSpawnedAlertChannelName}!`);
                        return false;
                    }
                } else {
                    console.log(`[MCHSB] Error occured while viewing #${pveBossSpawnedAlertChannelName}!`);
                    return false;
                }
            } else {
                console.log('[MCHSB] Error occured while finding pve boss spawned alert channel!');
                return false;
            }
        } catch {
            return 'ERROR';
        }
    }
}