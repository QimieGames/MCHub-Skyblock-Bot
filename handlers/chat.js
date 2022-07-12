module.exports = {
    data: {
        name: 'chat'
    },
    async execute(chatMSGRaw, configValue, discordBot, guildID, isIngameBotReady, isDiscordBotReady){
        async function logIngameChatToConsole(){
            if(configValue.features.log_ingame_chat_to_console === 'true') return console.log(chatMSGRaw.toAnsi());
        }
        async function logIngameChatToDiscord(){

            if(configValue.features.log_ingame_chat_to_discord === 'false') return;
        
            const ingameChatChannelID = configValue.discord_channels.ingame_chat;

            const ingameChatChannelName = discordBot.guilds.cache.get(guildID).channels.cache.get(ingameChatChannelID).name;
            
            if(chatMSGRaw.toString().length >= 5){
                if(discordBot.guilds.cache.get(guildID).channels.cache.get(ingameChatChannelID) != undefined){
                    if(discordBot.guilds.cache.get(guildID).me.permissionsIn(ingameChatChannelID).has('VIEW_CHANNEL') === true){
                        if(discordBot.guilds.cache.get(guildID).me.permissionsIn(ingameChatChannelID).has('SEND_MESSAGES') === true){
                            discordBot.guilds.cache.get(guildID).channels.cache.get(ingameChatChannelID).send('```' + chatMSGRaw + '```');
                        } else {
                            console.log(`[MCHSB] Error occured while sending chat messages in #${ingameChatChannelName}!`);
                        }
                    } else {
                        console.log(`[MCHSB] Error occured while sending chat messages in #${ingameChatChannelName}!`);
                    }
                } else {
                    console.log('[MCHSB] Error occured while finding ingame chat channel!');
                }
            }
        }
        logIngameChatToConsole().then(() => {
            logIngameChatToDiscord();
            return isDiscordBotReady = true, isIngameBotReady = true;
        });
    }
}