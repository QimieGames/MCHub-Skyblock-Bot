const DiscordJS = require('discord.js');

module.exports = {
    data: {
        name: 'pve_boss_spawned'
    },
    async execute(regexMatches, discordBot, constantConfigValue, isDiscordBotReady, isIngameBotReady){
        try {

            const guildID = constantConfigValue.discord_bot.guild_id;
    
            const pveBossSpawnedAlertChannelID = constantConfigValue.discord_channels.pve_boss;

            const pveBossSpawnedPingRoleID = constantConfigValue.roles_id.pve_boss_ping;

            const pveBossSpawnedEmbed = new DiscordJS.MessageEmbed()
                .setColor('#eb8334')
                .setTitle('PVE BOSS SPAWNED')
                .setThumbnail('https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/322/skull-and-crossbones_2620-fe0f.png')
                .setTimestamp()
                .setFooter({ text: 'Custom Coded By QimieGames', iconURL: 'https://images-ext-1.discordapp.net/external/HQFug-TJRekRG6wkhZL_wlEowWtUxuuR940ammbrz7k/https/cdn.discordapp.com/avatars/402039216487399447/347fd513aa2af9e8b4ac7ca80150b953.webp?width=115&height=115' });
    
            if(discordBot.guilds.cache.get(guildID).channels.cache.get(pveBossSpawnedAlertChannelID) != undefined){
                if(discordBot.guilds.cache.get(guildID).me.permissionsIn(pveBossSpawnedAlertChannelID).has('VIEW_CHANNEL') === true){
                    if(discordBot.guilds.cache.get(guildID).me.permissionsIn(pveBossSpawnedAlertChannelID).has('SEND_MESSAGES') === true){
                        discordBot.guilds.cache.get(guildID).channels.cache.get(pveBossSpawnedAlertChannelID).send({ content: `|| <@&${pveBossSpawnedPingRoleID}> ||`, embeds: [pveBossSpawnedEmbed] });
                    } else {
                        console.log('[MCHSB] Error occured while sending pve boss spawned alert in #' + discordBot.guilds.cache.get(guildID).channels.cache.get(pveBossSpawnedAlertChannelID).name + '!');
                    }
                } else {
                    console.log('[MCHSB] Error occured while viewing #' + discordBot.guilds.cache.get(guildID).channels.cache.get(pveBossSpawnedAlertChannelID).name + '!');
                }
            } else {
                console.log('[MCHSB] Error occured while finding pve boss spawned alert channel!');
            }
            return isDiscordBotReady = true, isIngameBotReady = true;
        } catch {
            console.log('[MCHSB] Error occured while executing pve boss spawned alert handler! Restarting the bot...');
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