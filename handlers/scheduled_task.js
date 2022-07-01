module.exports = {
    data: {
        name: 'scheduled_task'
    },
    async execute(ingameBot, isDiscordBotReady, isIngameBotReady){
        try {
            setInterval(async () => ingameBot.chat('/server sun8'), 180000);
            setInterval(async () => ingameBot.chat('/nextboss'), 299500);
            setInterval(async () => ingameBot.chat('/nextdungeon'), 1800000);
            return isIngameBotReady = true;
        } catch {
            console.log('[MCHSB] Error occured while executing scheduled task handler! Restarting the bot...');
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