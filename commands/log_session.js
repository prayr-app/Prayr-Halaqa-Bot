const { ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, SlashCommandBuilder } = require('discord.js');
const ReciterService = require('../services/reciter_service');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('log_session')
        .setDescription('Logs a Quran Session!')
        .addStringOption(option =>
            option.setName('surah')
                .setDescription('What was the last Surah that you recited?')
                .setRequired(true)
        )
        .addIntegerOption(option =>
            option.setName('ayah')
                .setDescription('What verse did you stop at?')
                .setRequired(true)
        ),
        
    async execute(interaction) {
        const reciterService = new ReciterService();

        let reciterCount = reciterService.getReciterCount();
        if (reciterCount < 2) {
            await interaction.reply({
                content: 'Error: You need to register a minimum of 02 reciters to start logging sessions !!!',
                ephemeral: true,
            });

            return;
        }

        // Retrieve reciters from the service and map them to include only the necessary fields (id and name)
        let reciters = (await reciterService.getAllReciters())
            .map(reciter => ({ id: reciter._id, name: reciter.name }));

        console.log(reciters);

        // Adding a new option (StringSelectMenuOptionBuilder) to the reciterOptions arr for each reciter
        const reciterOptions = [];
        reciters.forEach((reciter) => {
            reciterOptions.push(new StringSelectMenuOptionBuilder()
                .setLabel(reciter.name)
                .setValue(reciter.id.toString()));
        });

        // Creating a selection action using StringSelectMenuBuilder
        const selectReciters = new StringSelectMenuBuilder()
            .setCustomId('session')
            .setPlaceholder('Select the reciters')
            .setMinValues(1)
            .setMaxValues(reciterCount) // Setting a maximum of 10, else the session would be too long
            .addOptions(reciterOptions);

        const row = new ActionRowBuilder()
            .addComponents(selectReciters);

        // Reply to the interaction with the content and the row containing the select component
        await interaction.reply({
            content: `Who is attending today's Halaqa!`,
            components: [row],
        });
    },
};
