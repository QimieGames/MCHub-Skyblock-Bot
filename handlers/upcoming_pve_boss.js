const DiscordJS = require('discord.js');

module.exports = {
    data: {
        name: 'upcoming_pve_boss'
    },
    async execute(regexMatches, discordBot, configValue, guildID){
        try {
    
            const upcomingBossAlertChannelID = configValue.discord_channels.upcoming_pve_boss;

            const upcomingBossAlertChannelName = discordBot.guilds.cache.get(guildID).channels.cache.get(upcomingBossAlertChannelID).name;

            const upcomingBossPingRoleID = configValue.roles_id.upcoming_pve_boss_ping;

            const upcomingBossDetails = regexMatches[0];

            const upcomingBossTime = String(upcomingBossDetails[0]);

            if(upcomingBossTime === '0 seconds')return;

            function tagOnAlert(){

                const upcomingBossMinutes = upcomingBossTime.match(new RegExp(/^([0-9]+) minutes/, 'm'));

                const upcomingBossMinute = upcomingBossTime.match(new RegExp(/^1 minute/, 'm'));

                const upcomingBossSeconds = upcomingBossTime.match(new RegExp(/^([0-9]+) seconds/, 'm'));

                const upcomingBossSecond = upcomingBossTime.match(new RegExp(/^1 second/, 'm'));

                if(upcomingBossMinutes != null){
                    if(upcomingBossMinutes[1] <= 5){
                        return true;
                    } else {
                        return false;
                    }
                } else {
                    if(upcomingBossMinute != null){
                        return true;
                    } else {
                        if(upcomingBossSeconds != null){
                            return true;
                        } else {
                            if(upcomingBossSecond != null){
                                return true;
                            } else {
                                return false;
                            }
                        }
                    }
                }
            }

            const upcomingBossEmbed = new DiscordJS.MessageEmbed()
                .setColor('#eb8334')
                .setTitle('UPCOMING PVE BOSS EVENT')
                .setDescription(`Time Until PvE Boss Spawns: ${upcomingBossTime}`)
                .setThumbnail('https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/322/skull-and-crossbones_2620-fe0f.png')
                .setTimestamp()
                .setFooter({ text: 'Custom Coded By QimieGames', iconURL: 'https://images-ext-1.discordapp.net/external/HQFug-TJRekRG6wkhZL_wlEowWtUxuuR940ammbrz7k/https/cdn.discordapp.com/avatars/402039216487399447/347fd513aa2af9e8b4ac7ca80150b953.webp?width=115&height=115' });

            if(discordBot.guilds.cache.get(guildID).channels.cache.get(upcomingBossAlertChannelID) != undefined){
                if(discordBot.guilds.cache.get(guildID).me.permissionsIn(upcomingBossAlertChannelID).has('VIEW_CHANNEL') === true){
                    if(discordBot.guilds.cache.get(guildID).me.permissionsIn(upcomingBossAlertChannelID).has('SEND_MESSAGES') === true){
                        if(tagOnAlert() === true){
                            await discordBot.guilds.cache.get(guildID).channels.cache.get(upcomingBossAlertChannelID).send({ content: `|| <@&${upcomingBossPingRoleID}> ||`, embeds: [upcomingBossEmbed] });
                            return true;
                        } else {
                            await discordBot.guilds.cache.get(guildID).channels.cache.get(upcomingBossAlertChannelID).send({ embeds: [upcomingBossEmbed] });
                            return true;
                        }
                    } else {
                        console.log(`[MCHSB] Error occured while sending upcoming pve boss alert in #${upcomingBossAlertChannelName}!`);
                        return false;
                    }
                } else {
                    console.log(`[MCHSB] Error occured while viewing #${upcomingBossAlertChannelName}!`);
                    return false;
                }
            } else {
                console.log('[MCHSB] Error occured while finding upcoming pve boss alert channel!');
                return false;
            }
        } catch {
            return 'ERROR';
        }
    }
}