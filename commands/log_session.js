const { ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, SlashCommandBuilder } = require('discord.js');
const ReciterService = require('../services/reciter_service');
const SessionService = require('../services/session_service');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('log_session')
        .setDescription('Logs a Quran Session!')
        .addIntegerOption(option =>
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

        // Condition to make sure that there is more than 1 reciter registered, else only 1 reciter can only be selected
        const reciterCount = await reciterService.getReciterCount();
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
            .setMinValues(2)
            .setMaxValues(reciterCount) // Setting a maximum of 10, else the session would be too long
            .addOptions(reciterOptions);

        const row = new ActionRowBuilder()
            .addComponents(selectReciters);

        // Reply to the interaction with the content and the row containing the select component
        await interaction.reply({
            content: `Who is attending today's Halaqa!`,
            components: [row],
        });

        // Define a collector filter function
        const collectorFilter = (interaction) => interaction.isStringSelectMenu() && interaction.customId === 'session';

        // Create a message collector
        const collector = interaction.channel.createMessageComponentCollector({
            filter: collectorFilter,
            time: 30000, // Timeout after 30 seconds
            max: 1, // Collect only one response
            errors: ['time'],
        });

        // Handle collected interactions
        collector.on('collect', async (collected) => {
            // Extract values from collector and create an array of reciter ids
            const selectedOptions = collected.values;
            const selectedReciters = reciters.filter(reciter => selectedOptions.includes(reciter.id.toString()));

            // Get values for the below options for logging the halaqa sessions
            const surah = interaction.options.getInteger('surah');
            const ayah = interaction.options.getInteger('ayah');
            
            const sessionService = new SessionService();
            await sessionService.createSession(surah, ayah, selectedReciters.map(reciter => reciter.id ));

            await collected.reply({
                content: `You selected: ${selectedReciters.map(reciter => reciter.name).join(', ')}`,
                ephemeral: true,
            });
        });

        // Handle timeout
        collector.on('end', (collected, reason) => {
            if (reason === 'time') {
                interaction.followUp('The selection timed out.');
            }
        });
    },
};
