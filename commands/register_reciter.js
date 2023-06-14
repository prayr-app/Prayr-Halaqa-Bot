const { SlashCommandBuilder } = require('discord.js');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();

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

        const connectionString = process.env.CONNECTION_STRING;
        
        // Create a MongoClient with a MongoClientOptions object to set the Stable API version
        const client = new MongoClient(connectionString, {
            serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
            }
        });

        try {
            const database = client.db("quran_halaqa_db");
            const reciters = database.collection("reciters");

            // create a document to insert
            const doc = {
                name: name,
                gender: gender,
            }
            
            const result = await reciters.insertOne(doc);
            console.log(`A document was inserted with the _id: ${result.insertedId}`);
        } finally {
            await client.close();
        }

        // Rest of your code to add the user to the MongoDB collection
        await interaction.reply(name + " " + gender);
    },
};
