const DiscordJS = require('discord.js');

module.exports = {
    data: {
        name: 'dungeon_opened'
    },
    async execute(regexMatches, discordBot, constantConfigValue, isDiscordBotReady, isIngameBotReady){
        try {

            const guildID = constantConfigValue.discord_bot.guild_id;
    
            const dungeonOpenedAlertChannelID = constantConfigValue.discord_channels.dungeon;

            const dungeonOpenedPingRoleID = constantConfigValue.roles_id.dungeon_ping;

            const dungeonOpenedEmbed = new DiscordJS.MessageEmbed()
                .setColor('#eb8334')
                .setTitle('DUNGEON OPENED')
                .setThumbnail('https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/322/skull-and-crossbones_2620-fe0f.png')
                .setTimestamp()
                .setFooter({ text: 'Custom Coded By QimieGames', iconURL: 'https://images-ext-1.discordapp.net/external/HQFug-TJRekRG6wkhZL_wlEowWtUxuuR940ammbrz7k/https/cdn.discordapp.com/avatars/402039216487399447/347fd513aa2af9e8b4ac7ca80150b953.webp?width=115&height=115' });
                
            if(discordBot.guilds.cache.get(guildID).channels.cache.get(dungeonOpenedAlertChannelID) != undefined){
                if(discordBot.guilds.cache.get(guildID).me.permissionsIn(dungeonOpenedAlertChannelID).has('VIEW_CHANNEL') === true){
                    if(discordBot.guilds.cache.get(guildID).me.permissionsIn(dungeonOpenedAlertChannelID).has('SEND_MESSAGES') === true){
                        discordBot.guilds.cache.get(guildID).channels.cache.get(dungeonOpenedAlertChannelID).send({ content: `|| <@&${dungeonOpenedPingRoleID}> ||`, embeds: [dungeonOpenedEmbed] });
                    } else {
                        console.log('[MCHSB] Error occured while sending dungeon opened alert in #' + discordBot.guilds.cache.get(guildID).channels.cache.get(dungeonOpenedAlertChannelID).name + '!');
                    }
                } else {
                    console.log('[MCHSB] Error occured while viewing #' + discordBot.guilds.cache.get(guildID).channels.cache.get(dungeonOpenedAlertChannelID).name + '!');
                }
            } else {
                console.log('[MCHSB] Error occured while finding dungeon opened alert channel!');
            }
            return isDiscordBotReady = true, isIngameBotReady = true;
        } catch {
            console.log('[MCHSB] Error occured while executing dungeon opened alert handler! Restarting the bot...');
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