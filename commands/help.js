const { SlashCommandBuilder } = require('@discordjs/builders');

const DiscordJS = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Shows commands list.')
		.setDMPermission(false),
	async execute(discordInteraction){
		try{

			const helpMenuEmbed = new DiscordJS.MessageEmbed()
				.setColor('#4821bf')
				.setTitle('COMMANDS LIST')
				.setDescription('/help = Shows this menu.\n\n' + '/rejoin = Make the bot rejoin Sun Skyblock. [Trusted Command]\n\n' + '/restart = Restart the bot. [Admin Command]')
				.setThumbnail('https://i.imgur.com/3ovjQst.png')
				.setTimestamp()
				.setFooter({ text: 'Custom Coded By QimieGames', iconURL: 'https://images-ext-1.discordapp.net/external/HQFug-TJRekRG6wkhZL_wlEowWtUxuuR940ammbrz7k/https/cdn.discordapp.com/avatars/402039216487399447/347fd513aa2af9e8b4ac7ca80150b953.webp?width=115&height=115' });

			await discordInteraction.editReply({ embeds: [helpMenuEmbed], ephemeral: true });
			return true;
		} catch {
			return 'ERROR';
		}
	},
};