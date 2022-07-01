const { SlashCommandBuilder } = require('@discordjs/builders');

const DiscordJS = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Shows commands list.')
		.setDMPermission(false),
	async execute(interaction, logCommandUsage, isDiscordBotReady){
		try {

			const helpMenuEmbed = new DiscordJS.MessageEmbed()
				.setColor('#4821bf')
				.setTitle('COMMANDS LIST')
				.setURL('https://www.twitch.tv/officialqimiegames')
				.setDescription('/help = Shows this menu.\n\n' + '/rejoin = Make the bot rejoin Atlantic Prisons. [Trusted Command]\n\n' + '/restart = Restart the bot. [Trusted Command]')
				.setThumbnail('https://i.imgur.com/3ovjQst.png')
				.setTimestamp()
				.setFooter({ text: 'Custom Coded By QimieGames', iconURL: 'https://images-ext-1.discordapp.net/external/HQFug-TJRekRG6wkhZL_wlEowWtUxuuR940ammbrz7k/https/cdn.discordapp.com/avatars/402039216487399447/347fd513aa2af9e8b4ac7ca80150b953.webp?width=115&height=115' });

			await interaction.editReply({ embeds: [helpMenuEmbed], ephemeral: true });
			await logCommandUsage(interaction, true);
			return isDiscordBotReady = true;
		} catch {
			try {
				await logCommandUsage(interaction);
				return isDiscordBotReady = true;
			} catch {
				console.log('[MCHSB] Error occured while running the help command! Restarting the bot...');
				try{
					await discordBot.destroy();
					await ingameBot.end;
					return isDiscordBotReady = false, process.exit(0);
				} catch {
					console.log('[MCHSB] Error occured while restarting the bot properly!');
					return isDiscordBotReady = false, process.exit(0);
				}
			}
		}
	},
};