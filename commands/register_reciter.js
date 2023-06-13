const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('register_reciter')
        .setDescription('Adds a Quran reciter to the Database!')
        .addStringOption(option =>
            option.setName('name')
                .setDescription('The name of the reciter')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('gender')
                .setDescription('The gender of the reciter')
                .setRequired(true)
        ),
    async execute(interaction) {
        const name = interaction.options.getString('name');
        const gender = interaction.options.getString('gender');

        // Check if both name and gender are provided
        if (!name || !gender) {
            await interaction.reply('Please provide both name and gender.');
            return;
        }

        // Rest of your code to add the user to the MongoDB collection
        await interaction.reply(name + " " + gender);
    },
};
