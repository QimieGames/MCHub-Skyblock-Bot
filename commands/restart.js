const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('restart')
		.setDescription('Restart the bot. [Trusted Command]')
		.setDMPermission(false),
	async execute(interaction, updatedConfigValue, discordBot, ingameBot, isDiscordBotReady, isIngameBotReady){
		try {

			const discordBotAdmin = updatedConfigValue.roles_id.admin;

			const discordBotTrusted = updatedConfigValue.roles_id.trusted;

			console.log('[MCHSB] Restarting the bot...');
			if(interaction.member.roles.cache.some(discordRole => discordRole.id === discordBotAdmin) === true || interaction.member.roles.cache.some(discordRole => discordRole.id === discordBotTrusted) === true){
				await interaction.editReply({content: '```Restarting...```', ephemeral: true });
				await discordBot.destroy();
				await ingameBot.end;
				return isDiscordBotReady = false, isIngameBotReady = false, process.exit(0);
			} else {
				await interaction.editReply({ content: '```You are not allowed to run this command!```', ephemeral: true });
				return isDiscordBotReady = true;
			}
		} catch {
			console.log('[MCHSB] Error occured while running the restart command! Restarting the bot...');
			try {
				await discordBot.destroy();
				await ingameBot.end;
				return isDiscordBotReady = false, isIngameBotReady = false, process.exit(0);
			} catch {
				console.log('[MCHSB] Error occured while restarting the bot properly!');
				return isDiscordBotReady = false, isIngameBotReady = false, process.exit(0);
			}
		}
	},
};