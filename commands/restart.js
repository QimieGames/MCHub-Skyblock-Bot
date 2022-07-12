const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('restart')
		.setDescription('Restart the bot. [Admin Command]')
		.setDMPermission(false),
	async execute(discordInteraction, configValue, ingameBot){
		try{

			const discordBotAdmin = configValue.roles_id.bot_admin;

			console.log('[MCHPB] Restarting the bot...');
			if(discordInteraction.member.roles.cache.some(discordRole => discordRole.id === discordBotAdmin) === true){
				await discordInteraction.editReply({content: '```Restarting...```', ephemeral: true });
				ingameBot.end;
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