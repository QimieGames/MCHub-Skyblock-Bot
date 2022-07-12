require('dotenv').config();

const nodeFS = require('fs');

const DiscordJS = require('discord.js');

const mineflayer = require('mineflayer');

const { REST } = require('@discordjs/rest');

const { Routes } = require('discord-api-types/v10');

const commandsDIR ='./commands/';

const handlersDIR ='./handlers/';

const errorLogsDIR = './error_logs/';

const defaultEnvFileLayout =

`DISCORD_BOT_TOKEN=DISCORD_BOT_TOKEN_HERE
INGAME_BOT_EMAIL=INGAME_BOT_EMAIL_HERE
INGAME_BOT_PASSWORD=INGAME_BOT_PASSWORD_HERE`;

const defaultConfigFileLayout = 

{
  discord_bot: {
      guild_id: "1",
      client_id: "1"
  },
  discord_channels: {
      ingame_chat: "1",
      monthly_giveaway: "1",
      weekly_giveaway: "1",
      daily_giveaway: "1",
      pve_boss_spawned: "1",
      upcoming_pve_boss: "1",
      dungeon_boss_spawned: "1",
      dungeon_opened: "1",
      upcoming_dungeon: "1",
      envoy_spawned: "1",
      upcoming_envoy: "1",
      discord_command_logs: "1",
      chat_alert_logs: "1"
  },
  features: {
      log_ingame_chat_to_discord: "true",
      log_ingame_chat_to_console: "true",
      monthly_giveaway: "true",
      weekly_giveaway: "true",
      daily_giveaway: "true",
      pve_boss_spawned: "true",
      upcoming_pve_boss: "true",
      dungeon_boss_spawned: "true",
      dungeon_opened: "true",
      upcoming_dungeon: "true",
      envoy_spawned: "true",
      upcoming_envoy: "true",
      discord_command_logs: "true",
      chat_alert_logs: "true"
  },
  roles_id: {
      bot_admin: "1",
      bot_trusted: "1",
      bot_blacklisted: "1",
      pve_boss_spawned_ping: "1",
      upcoming_pve_boss_ping: "1",
      dungeon_boss_spawned_ping: "1",
      dungeon_opened_ping: "1",
      envoy_spawned_ping: "1",
      upcoming_envoy_ping: "1"
  }
};

const discordBotIntents = 

[
    DiscordJS.Intents.FLAGS.GUILD_MEMBERS,
    DiscordJS.Intents.FLAGS.GUILD_MESSAGES,
    DiscordJS.Intents.FLAGS.GUILDS
];

const discordBotPartials =

[
    'CHANNEL',
    'GUILD_MEMBER',
    'MESSAGE',
    'USER'
];

const regexPatterns = {
    monthly_giveaway: new RegExp(/^Monthly giveaway winners for ([0-9-]+) are ([0-9A-Za-z_*]+)\, ([0-9A-Za-z_*]+)/, 'm'),
    weekly_giveaway: new RegExp(/^Weekly giveaway winners for ([0-9-]+) are ([0-9A-Za-z_*]+)\, ([0-9A-Za-z_*]+)/, 'm'),
    daily_giveaway: new RegExp(/^Daily giveaway winners for ([0-9-]+) are ([0-9A-Za-z_*]+)\, ([0-9A-Za-z_*]+)\, ([0-9A-Za-z_*]+)/, 'm'),
    pve_boss_spawned: new RegExp(/^BOSS \» A Boss has spawned\, find it in the depths of \/warp pve\!/, 'm'),
    upcoming_pve_boss: new RegExp(/^MCHUB » The next boss will spawn in ([a-z0-9 ]+)!/,'m'),
    dungeon_boss_spawned: new RegExp(/^Dungeons \» The dungeon boss has spawned\! There are ([0-9a-z ]+) left before the dungeon closes\!/, 'm'),
    dungeon_opened: new RegExp(/^Dungeons \» A new dungeon has opened\! You can join the dungeon by typing \/dungeon\!/, 'm'),
    upcoming_dungeon: new RegExp(/^Dungeons \» The next dungeon is scheduled to start in ([0-9a-z ]+)\!/, 'm'),
    envoy_spawned: new RegExp(/^ENVOY \> Loot Crates have spawned in the warzone\!/, 'm'),
    upcoming_envoy: new RegExp(/^ENVOY \> Loot Crates will be spawning in the warzone in ([0-9a-z ]+)\!/, 'm')
};

const discordBot = new DiscordJS.Client({ intents: discordBotIntents, partials: discordBotPartials });

discordBot.commands = new DiscordJS.Collection();

const handlers = new Map();

let isDiscordBotReady = false, isIngameBotReady = false;

let errorHandler, configValue, ingameBot, consoleChatBox, guildID, clientID;

function isImportantDIRsExists(){
    console.log('[MCHSB] Loading important directories...');
    try {
        nodeFS.accessSync(commandsDIR, nodeFS.constants.F_OK);
    } catch {
        return false;
    }
    try {
        nodeFS.accessSync(handlersDIR, nodeFS.constants.F_OK);
    } catch {
        return false;
    }
    try {
        nodeFS.accessSync(errorLogsDIR, nodeFS.constants.F_OK);
        return true;
    } catch {
        return false;
    }
}

function isImportantFilesExists(){
    console.log('[MCHSB] Loading important files...');
    try {
        const defaultHandlerFilesArray = ['chat.js', 'console_chat_box.js', 'daily_giveaway.js', 'dungeon_boss_spawned.js', 'dungeon_opened.js', 'envoy_spawned.js', 'error.js', 'monthly_giveaway.js', 'pve_boss_spawned.js', 'schedule_task.js', 'upcoming_dungeon.js', 'upcoming_envoy.js', 'upcoming_pve_boss.js', 'weekly_giveaway.js'];
    
        const defaultCommandFilesArray = ['help.js', 'rejoin.js', 'restart.js'];
    
        const currentHandlerFiles = nodeFS.readdirSync(handlersDIR).filter(fileName => fileName.endsWith('.js'));
    
        const currentCommandFiles = nodeFS.readdirSync(commandsDIR).filter(fileName => fileName.endsWith('.js'));

        let currentHandlerFilesArray = [], currentCommandFilesArray = [];

        for(const currentHandlerFile of currentHandlerFiles){
            if(defaultHandlerFilesArray.includes(currentHandlerFile) === true){
                currentHandlerFilesArray.push(currentHandlerFile);
            } else {
                return false;
            }
        }
        for(const currentCommandFile of currentCommandFiles){
            if(defaultCommandFilesArray.includes(currentCommandFile) === true){
                currentCommandFilesArray.push(currentCommandFile);
            } else {
                return false;
            }
        }
        defaultHandlerFilesArray.forEach(defaultHandlerFile => {
            if(currentHandlerFilesArray.includes(defaultHandlerFile) === false){
                return false;
            }
        });
        defaultCommandFilesArray.forEach(defaultCommandFile => {
            if(currentCommandFilesArray.includes(defaultCommandFile) === false){
                return false;
            }
        });
        nodeFS.accessSync('LICENSE', nodeFS.constants.F_OK);
        return true;
    } catch {
        return false;
    }
}

function isEnvFileExists(){
    console.log('[MCHSB] Loading .env file...');
    try {
        nodeFS.accessSync('.env', nodeFS.constants.F_OK);
        return true;
    } catch {
        return false;
    }
}

function generateEnvFile(){
    console.log('[MCHSB] Generating a new .env file...');
    try {
        nodeFS.appendFileSync('.env', defaultEnvFileLayout, 'utf-8');
        return true;
    } catch {
        return false;
    }
}

function isEnvFileValid(){
    if(process.env.DISCORD_BOT_TOKEN === undefined || process.env.INGAME_BOT_EMAIL === undefined || process.env.INGAME_BOT_PASSWORD === undefined){
        return false;
    } else {
        if(process.env.DISCORD_BOT_TOKEN === 'DISCORD_BOT_TOKEN_HERE' || process.env.INGAME_BOT_EMAIL === 'INGAME_BOT_EMAIL_HERE' || process.env.INGAME_BOT_PASSWORD === 'INGAME_BOT_PASSWORD_HERE'){
            return false;
        } else {
            return true;
        }
    }
}

function reformatEnvFile(){
    console.log('[MCHSB] Reformatting .env file...');
    try {
        nodeFS.writeFileSync('.env', defaultEnvFileLayout, 'utf-8');
        return true;
    } catch {
        return false;
    }
}

function isConfigFileExists(){
    console.log('[MCHSB] Loading config file...');
    try {
        nodeFS.accessSync('config.json', nodeFS.constants.F_OK);
        return true;
    } catch {
        return false;
    }
}

function generateConfigFile(){
    console.log('[MCHSB] Generating a new config file...');
    try {
        nodeFS.appendFileSync('config.json', JSON.stringify(defaultConfigFileLayout, null, 4), 'utf-8');
        return true;
    } catch {
        return false;
    }
}

function isConfigFileValid(){
    try {

        const configValue = JSON.parse(nodeFS.readFileSync('config.json', 'utf-8'));

        let defaultConfigObjects = [], currentConfigObjects = [], functionResult = true;

        Object.keys(defaultConfigFileLayout).forEach(defaultConfigObject => defaultConfigObjects.push(defaultConfigObject));
        Object.keys(defaultConfigFileLayout.discord_bot).forEach(defaultConfigObject => defaultConfigObjects.push(defaultConfigObject));
        Object.keys(defaultConfigFileLayout.discord_channels).forEach(defaultConfigObject => defaultConfigObjects.push(defaultConfigObject));
        Object.keys(defaultConfigFileLayout.features).forEach(defaultConfigObject => defaultConfigObjects.push(defaultConfigObject));
        Object.keys(defaultConfigFileLayout.roles_id).forEach(defaultConfigObject => defaultConfigObjects.push(defaultConfigObject));
        Object.keys(configValue).forEach(currentConfigObject => currentConfigObjects.push(currentConfigObject));
        Object.keys(configValue.discord_bot).forEach(currentConfigObject => currentConfigObjects.push(currentConfigObject));
        Object.keys(configValue.discord_channels).forEach(currentConfigObject => currentConfigObjects.push(currentConfigObject));
        Object.keys(configValue.features).forEach(currentConfigObject => currentConfigObjects.push(currentConfigObject));
        Object.keys(configValue.roles_id).forEach(currentConfigObject => currentConfigObjects.push(currentConfigObject));
        defaultConfigObjects.forEach(defaultConfigObject => {
            if(currentConfigObjects.includes(defaultConfigObject) === false){
                functionResult = false;
            }
        });
        currentConfigObjects.forEach(currentConfigObject => {
            if(defaultConfigObjects.includes(currentConfigObject) === false){
                functionResult = false;
            }
        });
        return functionResult;
    } catch {
        return false;
    }
}

function reformatConfigFile(){
    console.log('[MCHSB] Reformatting config file...');
    try {
        nodeFS.writeFileSync('config.json', JSON.stringify(defaultConfigFileLayout, null, 4), 'utf-8');
        return true;
    } catch {
        return false;
    }
}

function loadEssentials(){
    console.log('[MCHSB] Loading important directories & files...');
    if(isImportantDIRsExists() === true){
        console.log('[MCHSB] Successfully loaded important directories.');
        if(isImportantFilesExists() === true){
            console.log('[MCHSB] Successfully loaded important files.');
            if(isEnvFileExists() === true){
                if(isEnvFileValid() === true){
                    console.log('[MCHSB] Successfully loaded .env file.');
                    if(isConfigFileExists() === true){
                        if(isConfigFileValid() === true){
                            console.log('[MCHSB] Successfully loaded config file.');
                            return true;
                        } else {
                            console.log('[MCHSB] Invalid config file!');
                            if(reformatConfigFile() === true){
                                console.log('[MCHSB] Successfully reformatted config file. Please configure it before running the bot again.');
                                return false;
                            } else {
                                console.log('[MCHSB] Error occured while reformatting config file! Please reinstall the bot.');
                                return false;
                            }
                        }
                    } else {
                        console.log('[MCHSB] Missing config file!');
                        if(generateConfigFile() === true){
                            console.log('[MCHSB] Successfully generated a new config file! Please configure it before running the bot again.');
                            return false;
                        } else {
                            console.log('[MCHSB] Error occured while generating a new config file! Please reinstall the bot.');
                            return false;
                        }
                    }
                } else {
                    console.log('[MCHSB] Invalid .env file or its configuration!');
                    if(reformatEnvFile() === true){
                        console.log('[MCHSB] Successfully reformatted .env file. Please configure it before running the bot again.');
                        return false;
                    } else {
                        console.log('[MCHSB] Error occured while reformatting .env file! Please reinstall the bot.');
                        return false;
                    }
                }
            } else {
                console.log('[MCHSB] Missing .env file!');
                if(generateEnvFile() === true){
                    console.log('[MCHSB] Successfully generated a new .env file! Please configure it before running the bot again.');
                    return false;
                } else {
                    console.log('[MCHSB] Error occured while generating a new .env file! Please reinstall the bot.');
                    return false;
                }
            }
        } else {
            console.log('[MCHSB] Error occured while loading important files! Please reinstall the bot.');
            return false;
        }
    } else {
        console.log('[MCHSB] Error occured while loading important directories! Please reinstall the bot.');
        return false;
    }
}

function registerHandlers(){
    console.log('[MCHSB] Registering handlers...');
    try {

        const handlerFiles = nodeFS.readdirSync(handlersDIR).filter(handlerFileName => handlerFileName.endsWith('.js'));

        for(const handlerFile of handlerFiles){
            const handlerFilePath = `${handlersDIR}${handlerFile}`;
            const handler = require(handlerFilePath);
            handlers.set(handler.data.name, handler);
        }

        errorHandler = handlers.get('error'); 

        consoleChatBox = require('readline').createInterface({ input: process.stdin });

        return true;
    } catch {
        return false;
    }
}

function validateConfigValue(){
    console.log('[MCHSB] Validating config values...');
    try {

        configValue = JSON.parse(nodeFS.readFileSync('config.json', 'utf-8'));

        clientID = configValue.discord_bot.client_id;

        guildID = configValue.discord_bot.guild_id;

        let currentDiscordRolesID = [], currentDiscordChannelsID = [], functionResult = true;

        discordBot.guilds.cache.get(guildID).roles.fetch().then(roleDetails => {
            roleDetails.forEach(roleDetail => {
                currentDiscordRolesID.push(String(roleDetail.id));
            });
        }).then(() => {
            Object.keys(configValue.roles_id).forEach(roleName => {
                const roleID = configValue.roles_id[roleName];
                if(currentDiscordRolesID.includes(roleID) === false){
                    functionResult = false;
                }
            });
        });
        discordBot.guilds.cache.get(guildID).channels.fetch().then(channelDetails => {
            channelDetails.forEach(channelDetail => {
                currentDiscordChannelsID.push(String(channelDetail.id));
            });
        }).then(() => {
            Object.keys(configValue.discord_channels).forEach(channelName => {
                const channelID = configValue.discord_channels[channelName];
                if(currentDiscordChannelsID.includes(channelID) === false){
                    functionResult = false;
                }
            });
        });
        if(configValue.discord_bot.client_id != String(discordBot.user.id)){
            functionResult = false;
        }
        Object.keys(configValue.features).forEach(featureName => {
            const featureValue = configValue.features[featureName];
            if(typeof Boolean(featureValue) != 'boolean'){
                functionResult = false;
            }
        });
        return functionResult;
    } catch {
        return false;
    }
}

function registerSlashCommands(){
    console.log('[MCHSB] Synchronizing slash commands...');
    try {

        const restAPI = new REST({ version: '10' }).setToken(process.env.DISCORD_BOT_TOKEN);

        const discordCommandFiles = nodeFS.readdirSync(commandsDIR).filter(file => file.endsWith('.js'));

        let discordCommands = [];

        for (const discordCommandFile of discordCommandFiles){
            const discordCommandsFilePath = `${commandsDIR}${discordCommandFile}`;
            const command = require(discordCommandsFilePath);
            discordCommands.push(command.data.toJSON());
            discordBot.commands.set(command.data.name, command);
        }
        restAPI.put(Routes.applicationGuildCommands(clientID, guildID), { body: discordCommands });
        return true;
    } catch {
        return false;
    }
}

async function registerChatPattern(){
    console.log('[MCHSB] Registering chat patterns...');
    try {
        Object.keys(regexPatterns).forEach(regexPatternName => {
            if(configValue.features[regexPatternName] === 'false') return;
            ingameBot.addChatPattern(regexPatternName, regexPatterns[regexPatternName], { repeat: true, parse: true });
            ingameBot.addChatPatternSet;
        });
        return true;
    } catch {
        return false;
    }
}

async function logCommandUsage(discordInteraction, commandResult){
    try {
        if(configValue.features.discord_command_logs === 'false') return;

        const commandLogsChannelID = configValue.discord_channels.discord_command_logs;

        switch(commandResult){
            default:
                commandResult = 'ERROR';
                break;
            case true:
                commandResult = 'SUCCESS';
                break;
            case false:
                commandResult = 'FAILED';
                break;
        }
        
        const commandLogEmbed = new DiscordJS.MessageEmbed()
			.setColor('#b2ebe3')
			.setTitle('COMMAND LOG')
			.setDescription(`Command Result: ${commandResult}\n` + `Command: ${discordInteraction.commandName.toUpperCase()}\n` + `Channel's Name: #${discordInteraction.channel.name}\n` + `Channel's ID: ${discordInteraction.channel.id}\n` + `User's Discord Username: ${discordInteraction.member.displayName}\n` + `User's Discord ID: ${discordInteraction.member.id}`)
			.setThumbnail(discordInteraction.member.displayAvatarURL())
			.setTimestamp()
			.setFooter({ text: 'Custom Coded By QimieGames', iconURL: 'https://images-ext-1.discordapp.net/external/HQFug-TJRekRG6wkhZL_wlEowWtUxuuR940ammbrz7k/https/cdn.discordapp.com/avatars/402039216487399447/347fd513aa2af9e8b4ac7ca80150b953.webp?width=115&height=115' });

        if(discordBot.guilds.cache.get(guildID).channels.cache.get(commandLogsChannelID) != undefined){
            if(discordBot.guilds.cache.get(guildID).me.permissionsIn(commandLogsChannelID).has('VIEW_CHANNEL') === true){
                if(discordBot.guilds.cache.get(guildID).me.permissionsIn(commandLogsChannelID).has('SEND_MESSAGES') === true){
                    discordBot.guilds.cache.get(guildID).channels.cache.get(commandLogsChannelID).send({ embeds: [commandLogEmbed] });
                } else {
                    console.log('[MCHSB] Error occured while sending command log in #' + discordBot.guilds.cache.get(guildID).channels.cache.get(commandLogsChannelID).name + '!');
                }
            } else {
                console.log('[MCHSB] Error occured while sending command log in #' + discordBot.guilds.cache.get(guildID).channels.cache.get(commandLogsChannelID).name + '!');
            }
        } else {
            console.log('[MCHSB] Error occured while finding command logs channel!');
        }
    } catch {
        console.log('[MCHSB] Error occured while logging command usage! Restarting the bot...');
        try {
            errorHandler.execute('Logging command usage.', discordBot, ingameBot, isDiscordBotReady, isIngameBotReady);
        } catch {
            console.log('[MCHSB] Error occured while executing error handler! Force restarting the bot...');
            process.exit(0);
        }
    }
}

try {
    if(loadEssentials() === true){
        console.log('[MCHSB] Successfully loaded important directories & files.');    
        if(registerHandlers() === true){
            console.log('[MCHSB] Successfully registered handlers.');
        } else {
            console.log('[MCHSB] Error occured while registering handlers! Force restarting the bot...');
            process.exit(0);
        }
        console.log('[MCHSB] Connecting to the Discord bot...');
        discordBot.login(process.env.DISCORD_BOT_TOKEN).then(() => {
            if(validateConfigValue() === true){
                console.log('[MCHSB] Successfully validated config values.');
            } else {
                console.log('[MCHSB] Error occured while validating config values! Please make sure you configure the config file correctly.');
                discordBot.destroy();
                process.exit(1);
            }
        }).then(() => {
            if(registerSlashCommands() === true){
                console.log('[MCHSB] Successfully synchronized slash commands.');
            } else {
                console.log('[MCHSB] Error occured while synchronizing slash commands! Force restarting bot...');
                discordBot.destroy();
                process.exit(0);
            }
        });

        ingameBot = mineflayer.createBot({ host: 'MCHub.COM', version: '1.18', username: process.env.INGAME_BOT_EMAIL, password: process.env.INGAME_BOT_PASSWORD, auth: 'microsoft', keepAlive: true, checkTimeoutInterval: 60000, physicsEnabled: 'false' });

    } else {
        console.log('[MCHSB] Error occured while loading important directories & files! Force restarting the bot...');
        process.exit(0);
    }
} catch {
    console.log('[MCHSB] Error occured while starting the bot! Force restarting the bot...');
    process.exit(0);
}

ingameBot.on('error', ingameBotError => {
    try {
        errorHandler.execute(ingameBotError, discordBot, ingameBot, isDiscordBotReady, isIngameBotReady);
    } catch {
        console.log('[MCHSB] Error occured while executing error handler! Force restarting the bot...');
        process.exit(0);
    }
});

ingameBot.on('kicked', ingameBotError => {
    try {
        errorHandler.execute(ingameBotError, discordBot, ingameBot, isDiscordBotReady, isIngameBotReady);
    } catch {
        console.log('[MCHSB] Error occured while executing error handler! Force restarting the bot...');
        process.exit(0);
    }
});

discordBot.on('error', discordBotError => {
    try {
        errorHandler.execute(discordBotError, discordBot, ingameBot, isDiscordBotReady, isIngameBotReady);
    } catch {
        console.log('[MCHSB] Error occured while executing error handler! Force restarting the bot...');
        process.exit(0);
    }
});

discordBot.on('shardError', discordBotError => {
    try {
        errorHandler.execute(discordBotError, discordBot, ingameBot, isDiscordBotReady, isIngameBotReady);
    } catch {
        console.log('[MCHSB] Error occured while executing error handler! Force restarting the bot...');
        process.exit(0);
    }
});

process.on('unhandledRejection', proccessError => {
    try {
        errorHandler.execute(proccessError, discordBot, ingameBot, isDiscordBotReady, isIngameBotReady);
    } catch {
        console.log('[MCHSB] Error occured while executing error handler! Force restarting the bot...');
        process.exit(0);
    }
});

process.on('uncaughtException', proccessError => {
    try {
        errorHandler.execute(proccessError, discordBot, ingameBot, isDiscordBotReady, isIngameBotReady);
    } catch {
        console.log('[MCHSB] Error occured while executing error handler! Force restarting the bot...');
        process.exit(0);
    }
});

ingameBot.on('end', onEndIngameBot => {

    isIngameBotReady = false;

});

consoleChatBox.on('line', async consoleChatBoxInput => {
    try {

        const consoleChatBoxHandler = handlers.get('console_chat_box');

        consoleChatBoxHandler.execute(consoleChatBoxInput, discordBot, ingameBot, isDiscordBotReady, isIngameBotReady);
    } catch {
        console.log('[MCHSB] Error occured while executing console chat box handler! Restarting the bot...');
        try {
            errorHandler.execute('Executing console chat box handler.', discordBot, ingameBot, isDiscordBotReady, isIngameBotReady);
        } catch {
            console.log('[MCHSB] Error occured while executing error handler! Force restarting the bot...');
            process.exit(0);
        }
    }
});

discordBot.on('ready', async onReadyDiscordBot => {
    console.log('[MCHSB] Connected to the Discord bot.');
    try {
        discordBot.user.setActivity('MCHub.COM - Sun Skyblock', { type: 'STREAMING', url: 'https://www.twitch.tv/officialqimiegames' });
        
        isDiscordBotReady = true;
    
    } catch {
        console.log('[MCHSB] Error occured while executing discord bot on ready functions! Restarting the bot...');
        try {
            errorHandler.execute('Executing discord bot on ready functions.', discordBot, ingameBot, isDiscordBotReady, isIngameBotReady);
        } catch {
            console.log('[MCHSB] Error occured while executing error handler! Force restarting the bot...');
            process.exit(0);
        }
    }
});

discordBot.on('interactionCreate', async discordInteraction => {
    try {
	    if (!discordInteraction.isCommand()) return;
        await discordInteraction.deferReply({ ephemeral: true });

        const discordBotBlacklisted = configValue.roles_id.bot_blacklisted;

        if(discordInteraction.member.roles.cache.some(discordRole => discordRole.id === discordBotBlacklisted) === true){
            await discordInteraction.editReply({ content: '```You are blacklisted from using this bot!```', ephemeral: true });
            await logCommandUsage(discordInteraction, configValue, false);
        } else {

            const discordSlashCommand = discordBot.commands.get(discordInteraction.commandName);

            let commandResult;

            switch(discordInteraction.commandName){
                case 'help':
                    commandResult = await discordSlashCommand.execute(discordInteraction);
                    logCommandUsage(discordInteraction, commandResult);
                    break;
                case 'rejoin':
                    commandResult = await discordSlashCommand.execute(discordInteraction, configValue, ingameBot);
                    logCommandUsage(discordInteraction, commandResult);
                    break;
                case 'restart':
                    commandResult = await discordSlashCommand.execute(discordInteraction, configValue, ingameBot);
                    logCommandUsage(discordInteraction, commandResult).then(() => {
                        setTimeout(() => {
                            process.exit(0);
                        }, 3000);
                    });
                    break;
            }
        }
    } catch {
        try {
            console.log('[MCHSB] Error occured while executing command handler! Restarting the bot...');
            errorHandler.execute('Executing command handler.', discordBot, ingameBot, isDiscordBotReady, isIngameBotReady);
        } catch {
            console.log('[MCHSB] Error occured while executing error handler! Force restarting the bot...');
            process.exit(0);
        }
    }
});

ingameBot.once('login', async onceLoginIngameBot => {
    console.log('[MCHSB] Connecting to MCHUB.COM...');
});

ingameBot.once('spawn', async onceSpawnIngameBot => {
    console.log('[MCHSB] Connected to MCHub.COM.');
    try {
        if(await registerChatPattern() === true){
            console.log('[MCHSB] Successfully registered chat patterns.');
            setTimeout(async () => ingameBot.chat('/server sun8'), 10000);

            const scheduleTaskHandler = handlers.get('schedule_task');
            
            scheduleTaskHandler.execute(discordBot, ingameBot, configValue, isDiscordBotReady, isIngameBotReady);
        } else {
            console.log('[MCHSB] Error occured while registering chat patterns! Restarting the bot...');
            try {
                errorHandler.execute('Registering chat patterns.', discordBot, ingameBot, isDiscordBotReady, isIngameBotReady);
            } catch {
                console.log('[MCHSB] Error occured while executing error handler! Force restarting the bot...');
                process.exit(0);
            }
        }
    } catch {
        console.log('[MCHSB] Error occured while executing ingame bot once spawn functions! Restarting the bot...');
        try {
            errorHandler.execute('Executing ingame bot once spawn functions.', discordBot, ingameBot, isDiscordBotReady, isIngameBotReady);
        } catch {
            console.log('[MCHSB] Error occured while executing error handler! Force restarting the bot...');
            process.exit(0);
        }
    }
});

ingameBot.on('spawn', async onSpawnIngameBot => {

    isIngameBotReady = true;

});

ingameBot.on('message', async (chatMSGRaw, chatType) => {
    try {
        if(chatType === 'game_info') return;

        const chatHandler = handlers.get('chat');

        chatHandler.execute(chatMSGRaw, configValue, discordBot, guildID, isIngameBotReady, isDiscordBotReady);
    } catch {
        console.log('[MCHSB] Error occured while executing chat handler! Restarting the bot...');
        try {
            errorHandler.execute('Executing chat handler.', discordBot, ingameBot, isDiscordBotReady, isIngameBotReady);
        } catch {
            console.log('[MCHSB] Error occured while executing error handler! Force restarting the bot...');
            process.exit(0);
        }
    }
});

async function logChatAlert(alertName, alertStatus){
    try {
        if(configValue.features.chat_alert_logs === 'false') return;
        switch(alertStatus){
            default:
                alertStatus = 'UNKNOWN';
                break;
            case 'ERROR':
                alertStatus = 'ERROR';
                break;
            case true:
                alertStatus = 'SUCCESS';
                break;
            case false:
                alertStatus = 'FAILED';
                break;
        }

        alertName = String(alertName).replace(new RegExp(/([_]+)/, 'g'), ' ').toUpperCase();

        const chatAlertLogsChannelID = configValue.discord_channels.chat_alert_logs;

        const chatAlertLogsChannelName = discordBot.guilds.cache.get(guildID).channels.cache.get(chatAlertLogsChannelID).name;

        const chatAlertLogEmbed = new DiscordJS.MessageEmbed()
			.setColor('#b2ebe3')
			.setTitle('CHAT ALERT LOG')
			.setDescription(`Alert Status: ${alertStatus}\n` + `Alert Type: ${alertName}\n` + `Channel's Name: #${chatAlertLogsChannelName}\n` + `Channel's ID: ${chatAlertLogsChannelID}`)
			.setThumbnail('https://emojipedia-us.s3.amazonaws.com/source/skype/289/exclamation-mark_2757.png')
			.setTimestamp()
			.setFooter({ text: 'Custom Coded By QimieGames', iconURL: 'https://images-ext-1.discordapp.net/external/HQFug-TJRekRG6wkhZL_wlEowWtUxuuR940ammbrz7k/https/cdn.discordapp.com/avatars/402039216487399447/347fd513aa2af9e8b4ac7ca80150b953.webp?width=115&height=115' });
        
        if(discordBot.guilds.cache.get(guildID).channels.cache.get(chatAlertLogsChannelID) != undefined){
            if(discordBot.guilds.cache.get(guildID).me.permissionsIn(chatAlertLogsChannelID).has('VIEW_CHANNEL') === true){
                if(discordBot.guilds.cache.get(guildID).me.permissionsIn(chatAlertLogsChannelID).has('SEND_MESSAGES') === true){
                    discordBot.guilds.cache.get(guildID).channels.cache.get(chatAlertLogsChannelID).send({ embeds: [chatAlertLogEmbed] });
                } else {
                    console.log('[MCHSB] Error occured while sending chat alert log in #' + discordBot.guilds.cache.get(guildID).channels.cache.get(chatAlertLogsChannelID).name + '!');
                }
            } else {
                console.log('[MCHSB] Error occured while sending chat alert log in #' + discordBot.guilds.cache.get(guildID).channels.cache.get(chatAlertLogsChannelID).name + '!');
            }
        } else {
            console.log('[MCHSB] Error occured while finding chat alert logs channel!');
        }
        return isDiscordBotReady = true, isIngameBotReady = true;
    } catch {
        try {
            errorHandler.execute('Logging chat alert.', discordBot, ingameBot, isDiscordBotReady, isIngameBotReady);
        } catch {
            console.log('[MCHSB] Error occured while executing error handler! Force restarting the bot...');
            process.exit(0);
        }
    }
}

Object.keys(regexPatterns).forEach(async regexPatternName => {
    ingameBot.on(`chat:${regexPatternName}`, async regexMatches => {
        try {
            if(configValue.features[regexPatternName] === 'false') return;

            const alertHandler = handlers.get(regexPatternName);

            const alertStatus = await alertHandler.execute(regexMatches, discordBot, configValue, guildID);

            logChatAlert(regexPatternName, alertStatus);
        } catch {
            console.log(`[MCHSB] Error occured while executing ${regexPatternName} handler! Restarting the bot...`);
            try {
                errorHandler.execute(`Executing ${regexPatternName} handler.`, discordBot, ingameBot, isDiscordBotReady, isIngameBotReady);
            } catch {
                console.log('[MCHSB] Error occured while executing error handler! Force restarting the bot...');
                process.exit(0);
            }
        }
    });
});