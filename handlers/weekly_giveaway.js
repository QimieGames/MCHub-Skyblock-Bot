const DiscordJS = require('discord.js');

module.exports = {
    data: {
        name: 'weekly_giveaway'
    },
    async execute(regexMatches, discordBot, configValue, guildID){
        try {

            const weeklyGiveawayAlertChannelID = configValue.discord_channels.weekly_giveaway;

            const weeklyGiveawayAlertChannelName = discordBot.guilds.cache.get(guildID).channels.cache.get(weeklyGiveawayAlertChannelID).name;

            const weeklyGiveawayDetails = regexMatches[0];

            const weeklyGiveawayDate = weeklyGiveawayDetails[0];

            const weeklyGiveawayWinnerOne = weeklyGiveawayDetails[1];

            const weeklyGiveawayWinnerTwo = weeklyGiveawayDetails[2];

            const weeklyGiveawayEmbed = new DiscordJS.MessageEmbed()
                .setColor('#eb8334')
                .setTitle('WEEKLY GIVEAWAY')
                .setDescription(`Date: ${weeklyGiveawayDate}\n` + `Winner #1: ${weeklyGiveawayWinnerOne}\n` + `Winner #2: ${weeklyGiveawayWinnerTwo}`)
                .setThumbnail('https://images.emojiterra.com/twitter/v13.1/512px/1f389.png')
                .setTimestamp()
                .setFooter({ text: 'Custom Coded By QimieGames', iconURL: 'https://images-ext-1.discordapp.net/external/HQFug-TJRekRG6wkhZL_wlEowWtUxuuR940ammbrz7k/https/cdn.discordapp.com/avatars/402039216487399447/347fd513aa2af9e8b4ac7ca80150b953.webp?width=115&height=115' });
        
            if(discordBot.guilds.cache.get(guildID).channels.cache.get(weeklyGiveawayAlertChannelID) != undefined){
                if(discordBot.guilds.cache.get(guildID).me.permissionsIn(weeklyGiveawayAlertChannelID).has('VIEW_CHANNEL') === true){
                    if(discordBot.guilds.cache.get(guildID).me.permissionsIn(weeklyGiveawayAlertChannelID).has('SEND_MESSAGES') === true){
                        await discordBot.guilds.cache.get(guildID).channels.cache.get(weeklyGiveawayAlertChannelID).send({ embeds: [weeklyGiveawayEmbed] });
                        return true;
                    } else {
                        console.log(`[MCHSB] Error occured while sending weekly giveaway alert in #${weeklyGiveawayAlertChannelName}!`);
                        return false;
                    }
                } else {
                    console.log(`[MCHSB] Error occured while viewing #${weeklyGiveawayAlertChannelName}!`);
                    return false;
                }
            } else {
                console.log('[MCHSB] Error occured while finding weekly giveaway alert channel!');
                return false;
            }
        } catch {
			return 'ERROR';
        }
    }
}