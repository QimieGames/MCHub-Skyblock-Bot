module.exports = {
    data: {
        name: 'chat'
    },
    async execute(chatMSGRaw, chatType, constantConfigValue, discordBot, isIngameBotReady, isDiscordBotReady){
        if(chatType === 'game_info') return;

        async function logIngameChatToDiscord(chatMSG){
            
            const guildID = constantConfigValue.discord_bot.guild_id;
        
            const ingameChatChannelID = constantConfigValue.discord_channels.ingame_chat;
            
            if(constantConfigValue.features.discord_ingame_chat === 'true'){
                if(chatMSG.toString().length >= 5){
                    if(discordBot.guilds.cache.get(guildID).channels.cache.get(ingameChatChannelID) != undefined){
                        if(discordBot.guilds.cache.get(guildID).me.permissionsIn(ingameChatChannelID).has('VIEW_CHANNEL') === true){
                            if(discordBot.guilds.cache.get(guildID).me.permissionsIn(ingameChatChannelID).has('SEND_MESSAGES') === true){
                                discordBot.guilds.cache.get(guildID).channels.cache.get(ingameChatChannelID).send('```' + chatMSG + '```');
                            } else {
                                console.log('[MCHSB] Error occured while sending chat messages in #' + discordBot.guilds.cache.get(guildID).channels.cache.get(ingameChatChannelID).name + '!');
                            }
                        } else {
                            console.log('[MCHSB] Error occured while sending chat messages in #' + discordBot.guilds.cache.get(guildID).channels.cache.get(ingameChatChannelID).name + '!');
                        }
                    } else {
                        console.log('[MCHSB] Error occured while finding ingame chat channel!');
                    }
                }
            }
        }
        
        async function logIngameChatToConsole(chatMSG){
            if(constantConfigValue.features.console_ingame_chat === 'true'){
                console.log(chatMSG.toAnsi());
            }
        }

        try {
            logIngameChatToConsole(chatMSGRaw).then(async () => {
                logIngameChatToDiscord(chatMSGRaw);
            });
            return isDiscordBotReady = true, isIngameBotReady = true;
        } catch {
            console.log('[MCHSB] Error occured while executing chat handler! Restarting the bot...');
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