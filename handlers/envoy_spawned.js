const DiscordJS = require('discord.js');

module.exports = {
    data: {
        name: 'envoy_spawned'
    },
    async execute(regexMatches, discordBot, constantConfigValue, isDiscordBotReady, isIngameBotReady){
        try {

            const guildID = constantConfigValue.discord_bot.guild_id;
    
            const envoySpawnedAlertChannelID = constantConfigValue.discord_channels.envoy;

            const envoySpawnedPingRoleID = constantConfigValue.roles_id.envoy_ping;

            const envoySpawnedEmbed = new DiscordJS.MessageEmbed()
                .setColor('#eb8334')
                .setTitle('ENVOY SPAWNED')
                .setThumbnail('https://static.wikia.nocookie.net/minecraft/images/d/db/LockedChest.png/revision/latest/top-crop/width/360/height/450?cb=20191103223851')
                .setTimestamp()
                .setFooter({ text: 'Custom Coded By QimieGames', iconURL: 'https://images-ext-1.discordapp.net/external/HQFug-TJRekRG6wkhZL_wlEowWtUxuuR940ammbrz7k/https/cdn.discordapp.com/avatars/402039216487399447/347fd513aa2af9e8b4ac7ca80150b953.webp?width=115&height=115' });

            if(discordBot.guilds.cache.get(guildID).channels.cache.get(envoySpawnedAlertChannelID) != undefined){
                if(discordBot.guilds.cache.get(guildID).me.permissionsIn(envoySpawnedAlertChannelID).has('VIEW_CHANNEL') === true){
                    if(discordBot.guilds.cache.get(guildID).me.permissionsIn(envoySpawnedAlertChannelID).has('SEND_MESSAGES') === true){
                        discordBot.guilds.cache.get(guildID).channels.cache.get(envoySpawnedAlertChannelID).send({content: `|| <@&${envoySpawnedPingRoleID}> ||`, embeds: [envoySpawnedEmbed] });
                    } else {
                        console.log('[MCHSB] Error occured while sending envoy spawned alert in #' + discordBot.guilds.cache.get(guildID).channels.cache.get(envoySpawnedAlertChannelID).name + '!');
                    }
                } else {
                    console.log('[MCHSB] Error occured while viewing #' + discordBot.guilds.cache.get(guildID).channels.cache.get(envoySpawnedAlertChannelID).name + '!');
                }
            } else {
                console.log('[MCHSB] Error occured while finding envoy spawned alert channel!');
            }
            return isDiscordBotReady = true, isIngameBotReady = true;
        } catch {
            console.log('[MCHSB] Error occured while executing envoy spawned alert handler! Restarting the bot...');
			try {
				discordBot.destroy();
				ingameBot.end;
				return isDiscordBotReady = false, isIngameBotReady = false, process.exit(0);
			} catch {
				console.log('[MCHSB] Error occured while restarting the bot properly!');
				return isDiscordBotReady = false, isIngameBotReady = false, process.exit(0);
			}
        }
    }
}