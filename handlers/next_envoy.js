const DiscordJS = require('discord.js');

module.exports = {
    data: {
        name: 'next_envoy'
    },
    async execute(regexMatches, discordBot, constantConfigValue, isDiscordBotReady, isIngameBotReady){
        try {

            const guildID = constantConfigValue.discord_bot.guild_id;
    
            const nextEnvoyAlertChannelID = constantConfigValue.discord_channels.envoy;

            const nextEnvoyPingRoleID = constantConfigValue.roles_id.envoy_ping;

            const nextEnvoyDetails = regexMatches[0];

            const nextEnvoyTimeString = nextEnvoyDetails[0];

            function tagOnAlert(nextEnvoyTimeString){

                const nextEnvoyMinutes = nextEnvoyTimeString.match(new RegExp(/^5 minutes/,'m'));

                if(nextEnvoyMinutes != null){
                    return true;
                } else {
                    return false;
                }
            }

            const nextEnvoyEmbed = new DiscordJS.MessageEmbed()
                .setColor('#eb8334')
                .setTitle('NEXT ENVOY EVENT')
                .setDescription(`Time: ${nextEnvoyTimeString}`)
                .setThumbnail('https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/322/skull-and-crossbones_2620-fe0f.png')
                .setTimestamp()
                .setFooter({ text: 'Custom Coded By QimieGames', iconURL: 'https://images-ext-1.discordapp.net/external/HQFug-TJRekRG6wkhZL_wlEowWtUxuuR940ammbrz7k/https/cdn.discordapp.com/avatars/402039216487399447/347fd513aa2af9e8b4ac7ca80150b953.webp?width=115&height=115' });

            if(discordBot.guilds.cache.get(guildID).channels.cache.get(nextEnvoyAlertChannelID) != undefined){
                if(discordBot.guilds.cache.get(guildID).me.permissionsIn(nextEnvoyAlertChannelID).has('VIEW_CHANNEL') === true){
                    if(discordBot.guilds.cache.get(guildID).me.permissionsIn(nextEnvoyAlertChannelID).has('SEND_MESSAGES') === true){
                        if(tagOnAlert(nextEnvoyTimeString) === true){
                            discordBot.guilds.cache.get(guildID).channels.cache.get(nextEnvoyAlertChannelID).send({ content: `|| <@&${nextEnvoyPingRoleID}> ||`, embeds: [nextEnvoyEmbed] });
                        } else {
                            discordBot.guilds.cache.get(guildID).channels.cache.get(nextEnvoyAlertChannelID).send({ embeds: [nextEnvoyEmbed] });
                        }
                    } else {
                        console.log('[MCHSB] Error occured while sending next envoy event alert in #' + discordBot.guilds.cache.get(guildID).channels.cache.get(nextEnvoyAlertChannelID).name + '!');
                    }
                } else {
                    console.log('[MCHSB] Error occured while viewing #' + discordBot.guilds.cache.get(guildID).channels.cache.get(nextEnvoyAlertChannelID).name + '!');
                }
            } else {
                console.log('[MCHSB] Error occured while finding next envoy event alert channel!');
            }
            return isDiscordBotReady = true, isIngameBotReady = true;
        } catch {
            console.log('[MCHSB] Error occured while executing next envoy alert handler! Restarting the bot...');
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