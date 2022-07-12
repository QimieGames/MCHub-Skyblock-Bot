const DiscordJS = require('discord.js');

module.exports = {
    data: {
        name: 'monthly_giveaway'
    },
    async execute(regexMatches, discordBot, configValue, guildID){
        try {

            const monthlyGiveawayAlertChannelID = configValue.discord_channels.monthly_giveaway;

            const monthlyGiveawayAlertChannelName = discordBot.guilds.cache.get(guildID).channels.cache.get(monthlyGiveawayAlertChannelID).name;

            const monthlyGiveawayDetails = regexMatches[0];

            const monthlyGiveawayDate = monthlyGiveawayDetails[0];

            const monthlyGiveawayWinnerOne = monthlyGiveawayDetails[1];

            const monthlyGiveawayWinnerTwo = monthlyGiveawayDetails[2];

            const monthlyGiveawayEmbed = new DiscordJS.MessageEmbed()
                .setColor('#eb8334')
                .setTitle('MONTHLY GIVEAWAY')
                .setDescription(`Date: ${monthlyGiveawayDate}\n` + `Winner #1: ${monthlyGiveawayWinnerOne}\n` + `Winner #2: ${monthlyGiveawayWinnerTwo}`)
                .setThumbnail('https://images.emojiterra.com/twitter/v13.1/512px/1f389.png')
                .setTimestamp()
                .setFooter({ text: 'Custom Coded By QimieGames', iconURL: 'https://images-ext-1.discordapp.net/external/HQFug-TJRekRG6wkhZL_wlEowWtUxuuR940ammbrz7k/https/cdn.discordapp.com/avatars/402039216487399447/347fd513aa2af9e8b4ac7ca80150b953.webp?width=115&height=115' });
        
            if(discordBot.guilds.cache.get(guildID).channels.cache.get(monthlyGiveawayAlertChannelID) != undefined){
                if(discordBot.guilds.cache.get(guildID).me.permissionsIn(monthlyGiveawayAlertChannelID).has('VIEW_CHANNEL') === true){
                    if(discordBot.guilds.cache.get(guildID).me.permissionsIn(monthlyGiveawayAlertChannelID).has('SEND_MESSAGES') === true){
                        await discordBot.guilds.cache.get(guildID).channels.cache.get(monthlyGiveawayAlertChannelID).send({ embeds: [monthlyGiveawayEmbed] });
                        return true;
                    } else {
                        console.log(`[MCHSB] Error occured while sending monthly giveaway alert in #${monthlyGiveawayAlertChannelName}!`);
                        return false;
                    }
                } else {
                    console.log(`[MCHSB] Error occured while viewing #${monthlyGiveawayAlertChannelName}!`);
                    return false;
                }
            } else {
                console.log('[MCHSB] Error occured while finding monthly giveaway alert channel!');
                return false;
            }
        } catch {
            return 'ERROR';
        }
    }
}