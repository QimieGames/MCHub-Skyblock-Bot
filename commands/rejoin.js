const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('rejoin')
		.setDescription('Make the bot rejoin Atlantic Prisons. [Trusted Command]')
		.setDMPermission(false),
	async execute(interaction, updatedConfigValue, discordBot, ingameBot, logCommandUsage, isDiscordBotReady, isIngameBotReady){
		try {

			const discordBotAdmin = updatedConfigValue.roles_id.admin;

			const discordBotTrusted = updatedConfigValue.roles_id.trusted;

			if(interaction.member.roles.cache.some(discordRole => discordRole.id === discordBotAdmin) === true || interaction.member.roles.cache.some(discordRole => discordRole.id === discordBotTrusted) === true){
				await interaction.editReply({ content: '```Attempting to send the bot to Atlantic Prisons...```', ephemeral: true });
				await ingameBot.chat('/server atlantic11');
				await logCommandUsage(interaction, true);
				return isDiscordBotReady = true, isIngameBotReady = true;
			} else {
				await interaction.editReply({ content: '```You are not allowed to run this command!```', ephemeral: true });
				await logCommandUsage(interaction, false);
				return isDiscordBotReady = true, isIngameBotReady = true;
			}
		} catch {
			console.log('[MCHSB] Error occured while running the rejoin command! Restarting the bot...');
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