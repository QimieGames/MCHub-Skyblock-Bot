const DiscordJS = require('discord.js');

module.exports = {
    data: {
        name: 'upcoming_envoy'
    },
    async execute(regexMatches, discordBot, configValue, guildID){
        try {
    
            const upcomingEnvoyAlertChannelID = configValue.discord_channels.upcoming_envoy;

            const upcomingEnvoyAlertChannelName = discordBot.guilds.cache.get(guildID).channels.cache.get(upcomingEnvoyAlertChannelID).name;

            const upcomingEnvoyPingRoleID = configValue.roles_id.upcoming_envoy_ping;

            const upcomingEnvoyDetails = regexMatches[0];

            const upcomingEnvoyTime = String(upcomingEnvoyDetails[0]);

            function tagOnAlert(){

                const upcomingEnvoyMinutes = upcomingEnvoyTime.match(new RegExp(/^5 minutes/,'m'));

                if(upcomingEnvoyMinutes != null){
                    return true;
                } else {
                    return false;
                }
            }

            const upcomingEnvoyEmbed = new DiscordJS.MessageEmbed()
                .setColor('#eb8334')
                .setTitle('UPCOMING ENVOY EVENT')
                .setDescription(`Time: ${upcomingEnvoyTime}`)
                .setThumbnail('https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/322/skull-and-crossbones_2620-fe0f.png')
                .setTimestamp()
                .setFooter({ text: 'Custom Coded By QimieGames', iconURL: 'https://images-ext-1.discordapp.net/external/HQFug-TJRekRG6wkhZL_wlEowWtUxuuR940ammbrz7k/https/cdn.discordapp.com/avatars/402039216487399447/347fd513aa2af9e8b4ac7ca80150b953.webp?width=115&height=115' });

            if(discordBot.guilds.cache.get(guildID).channels.cache.get(upcomingEnvoyAlertChannelID) != undefined){
                if(discordBot.guilds.cache.get(guildID).me.permissionsIn(upcomingEnvoyAlertChannelID).has('VIEW_CHANNEL') === true){
                    if(discordBot.guilds.cache.get(guildID).me.permissionsIn(upcomingEnvoyAlertChannelID).has('SEND_MESSAGES') === true){
                        if(tagOnAlert() === true){
                            await discordBot.guilds.cache.get(guildID).channels.cache.get(upcomingEnvoyAlertChannelID).send({ content: `|| <@&${upcomingEnvoyPingRoleID}> ||`, embeds: [upcomingEnvoyEmbed] });
                            return true;
                        } else {
                            await discordBot.guilds.cache.get(guildID).channels.cache.get(upcomingEnvoyAlertChannelID).send({ embeds: [upcomingEnvoyEmbed] });
                            return true;
                        }
                    } else {
                        console.log(`[MCHSB] Error occured while sending upcoming envoy event alert in #${upcomingEnvoyAlertChannelName}!`);
                        return false;
                    }
                } else {
                    console.log(`[MCHSB] Error occured while viewing #${upcomingEnvoyAlertChannelName}!`);
                    return false;
                }
            } else {
                console.log('[MCHSB] Error occured while finding upcoming envoy event alert channel!');
                return false;
            }
        } catch {
            return 'ERROR';
        }
    }
}