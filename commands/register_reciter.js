const { SlashCommandBuilder } = require('discord.js');
const ReciterService = require('../services/reciter_service');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('register_reciter')
        .setDescription('Adds a Quran reciter to the Database!')
        .addStringOption(option =>
            option.setName('name')
                .setDescription('What is your name?')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('gender')
                .setDescription('Are you a brother or sister?')
                .setRequired(true)
                .addChoices(
                    { name: 'Brother', value: 'male' },
                    { name: 'Sister', value: 'female' },
                )
        ),
    async execute(interaction) {
        const name = interaction.options.getString('name');
        const gender = interaction.options.getString('gender');

        // Check if both name and gender are provided
        if (!name || !gender) {
            await interaction.reply('Please provide both name and gender.');
            return;
        }

        const reciterService = new ReciterService();
        let result = await reciterService.addReciter(name, gender);
        let response;

        if (result.insertedId !== null) {
            response = `A document was inserted with the _id: ${result.insertedId}`
        } else {
            response = 'There was an issue when adding the reciter to the DB, please try again!'
        }
        await interaction.reply(response);
    },
};