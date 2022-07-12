const nodeFS = require('fs');

module.exports = {
    data: {
        name: 'error'
    },
    execute(errorInfo, discordBot, ingameBot, isDiscordBotReady, isIngameBotReady){

        const errorOccuredDate = new Date();

        const errorLogsDIR = '././error_logs/';

        const errorLogFileName = `ERROR_LOG-${errorOccuredDate.getDate()}_${errorOccuredDate.getMonth() + 1}_${errorOccuredDate.getFullYear()}-${errorOccuredDate.getHours()}_${errorOccuredDate.getMinutes()}_${errorOccuredDate.getSeconds()}`;

        nodeFS.appendFileSync(`${String(errorLogsDIR)}${String(errorLogFileName)}.json`, String(errorInfo), 'utf-8');
        console.log(`[MCHSB] Error occured! Restarting the bot...`);
        discordBot.destroy();
        ingameBot.end;
        return isDiscordBotReady = false, isIngameBotReady = false, process.exit(0);
    }
}