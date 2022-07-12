const DiscordJS = require('discord.js');

module.exports = {
    data: {
        name: 'daily_giveaway'
    },
    async execute(regexMatches, discordBot, configValue, guildID){
        try {

            const dailyGiveawayAlertChannelID = configValue.discord_channels.daily_giveaway;

            const dailyGiveawayAlertChannelName = discordBot.guilds.cache.get(guildID).channels.cache.get(dailyGiveawayAlertChannelID).name;

            const dailyGiveawayDetails = regexMatches[0];

            const dailyGiveawayDate = dailyGiveawayDetails[0];

            const dailyGiveawayWinnerOne = dailyGiveawayDetails[1];

            const dailyGiveawayWinnerTwo = dailyGiveawayDetails[2];

            const dailyGiveawayWinnerThree = dailyGiveawayDetails[3];

            const dailyGiveawayEmbed = new DiscordJS.MessageEmbed()
                .setColor('#eb8334')
                .setTitle('DAILY GIVEAWAY')
                .setDescription(`Date: ${dailyGiveawayDate}\n` + `Winner #1: ${dailyGiveawayWinnerOne}\n` + `Winner #2: ${dailyGiveawayWinnerTwo}\n` + `Winner #3: ${dailyGiveawayWinnerThree}`)
                .setThumbnail('https://images.emojiterra.com/twitter/v13.1/512px/1f389.png')
                .setTimestamp()
                .setFooter({ text: 'Custom Coded By QimieGames', iconURL: 'https://images-ext-1.discordapp.net/external/HQFug-TJRekRG6wkhZL_wlEowWtUxuuR940ammbrz7k/https/cdn.discordapp.com/avatars/402039216487399447/347fd513aa2af9e8b4ac7ca80150b953.webp?width=115&height=115' });
        
            if(discordBot.guilds.cache.get(guildID).channels.cache.get(dailyGiveawayAlertChannelID) != undefined){
                if(discordBot.guilds.cache.get(guildID).me.permissionsIn(dailyGiveawayAlertChannelID).has('VIEW_CHANNEL') === true){
                    if(discordBot.guilds.cache.get(guildID).me.permissionsIn(dailyGiveawayAlertChannelID).has('SEND_MESSAGES') === true){
                        await discordBot.guilds.cache.get(guildID).channels.cache.get(dailyGiveawayAlertChannelID).send({ embeds: [dailyGiveawayEmbed] });
                        return true;
                    } else {
                        console.log(`[MCHSB] Error occured while sending daily giveaway alert in #${dailyGiveawayAlertChannelName}!`);
                        return false;
                    }
                } else {
                    console.log(`[MCHSB] Error occured while viewing #${dailyGiveawayAlertChannelName}!`);
                    return false;
                }
            } else {
                console.log('[MCHSB] Error occured while finding daily giveaway alert channel!');
                return false;
            }
        } catch {
            return 'ERROR';
        }
    }
}