const DiscordJS = require('discord.js');

module.exports = {
    data: {
        name: 'envoy_spawned'
    },
    async execute(regexMatches, discordBot, configValue, guildID){
        try {
    
            const envoySpawnedAlertChannelID = configValue.discord_channels.envoy_spawned;

            const envoySpawnedAlertChannelName = discordBot.guilds.cache.get(guildID).channels.cache.get(envoySpawnedAlertChannelID).name;

            const envoySpawnedPingRoleID = configValue.roles_id.envoy_spawned_ping;

            const envoySpawnedEmbed = new DiscordJS.MessageEmbed()
                .setColor('#eb8334')
                .setTitle('ENVOY SPAWNED')
                .setThumbnail('https://static.wikia.nocookie.net/minecraft/images/d/db/LockedChest.png/revision/latest/top-crop/width/360/height/450?cb=20191103223851')
                .setTimestamp()
                .setFooter({ text: 'Custom Coded By QimieGames', iconURL: 'https://images-ext-1.discordapp.net/external/HQFug-TJRekRG6wkhZL_wlEowWtUxuuR940ammbrz7k/https/cdn.discordapp.com/avatars/402039216487399447/347fd513aa2af9e8b4ac7ca80150b953.webp?width=115&height=115' });

            if(discordBot.guilds.cache.get(guildID).channels.cache.get(envoySpawnedAlertChannelID) != undefined){
                if(discordBot.guilds.cache.get(guildID).me.permissionsIn(envoySpawnedAlertChannelID).has('VIEW_CHANNEL') === true){
                    if(discordBot.guilds.cache.get(guildID).me.permissionsIn(envoySpawnedAlertChannelID).has('SEND_MESSAGES') === true){
                        await discordBot.guilds.cache.get(guildID).channels.cache.get(envoySpawnedAlertChannelID).send({content: `|| <@&${envoySpawnedPingRoleID}> ||`, embeds: [envoySpawnedEmbed] });
                        return true;
                    } else {
                        console.log(`[MCHSB] Error occured while sending envoy spawned alert in #${envoySpawnedAlertChannelName}!`);
                        return false;
                    }
                } else {
                    console.log(`[MCHSB] Error occured while viewing #${envoySpawnedAlertChannelName}!`);
                    return false;
                }
            } else {
                console.log('[MCHSB] Error occured while finding envoy spawned alert channel!');
                return false;
            }
        } catch {
            return 'ERROR';
        }
    }
}