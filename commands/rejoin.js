const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('rejoin')
		.setDescription('Make the bot rejoin Sun Skyblock. [Trusted Command]')
		.setDMPermission(false),
	async execute(discordInteraction, configValue, ingameBot){
		try{

			const discordBotAdmin = configValue.roles_id.bot_admin;

			const discordBotTrusted = configValue.roles_id.bot_trusted;

			if(discordInteraction.member.roles.cache.some(discordRole => discordRole.id === discordBotAdmin || discordRole.id === discordBotTrusted) === true){
				await discordInteraction.editReply({ content: '```Attempting to send the bot to Sun Skyblock...```', ephemeral: true });
				ingameBot.chat('/server atlantic11');
				return true;
			} else {
				await discordInteraction.editReply({ content: '```You are not allowed to run this command!```', ephemeral: true });
				return false;
			}
		} catch {
			return 'ERROR';
		}
	},
};