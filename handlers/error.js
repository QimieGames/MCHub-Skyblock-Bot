module.exports = {
    data: {
        name: 'error'
    },
    execute(errorInfo, discordBot, ingameBot, isDiscordBotReady, isIngameBotReady){
        try {
            switch(errorInfo) {
                default:
                    console.log('[MCHSB] Error occured! Shutting down the bot...');
                        discordBot.destroy();
                        ingameBot.end;
                        console.log(`[MCHSB] Error: ${errorInfo}`);
                        process.exit(1);
                    break;
            }
        } catch {
            console.log('[MCHSB] Error occured while executing error handler! Shutting down the bot...');
			try {
				discordBot.destroy();
				ingameBot.end;
				return isDiscordBotReady = false, isIngameBotReady = false, process.exit(1);
			} catch {
				console.log('[MCHSB] Error occured while restarting the bot properly!');
				return isDiscordBotReady = false, isIngameBotReady = false, process.exit(1);
			}
        }
    }
}