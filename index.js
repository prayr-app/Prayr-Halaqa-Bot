// Require the necessary discord.js classes
const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
const { log } = require('node:console');
require('dotenv').config();

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	// Set a new item in the Collection with the key as the command name and the value as the exported module
	if ('data' in command && 'execute' in command) {
		client.commands.set(command.data.name, command);
	} else {
		console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
	}
}

// When the client is ready, run this code (only once)
// We use 'c' for the event parameter to keep it separate from the already defined 'client'
client.once(Events.ClientReady, c => {
	console.log(`Ready! Logged in as ${c.user.tag}`);
});


// Event handler for when an interaction occurs (e.g., a slash command)
client.on(Events.InteractionCreate, async interaction => {

	// Check if the interaction is a chat input command
	if (!interaction.isChatInputCommand()) return;
	
	// Get the command based on the interaction's command name
	const command = client.commands.get(interaction.commandName);
  
	// If the command does not exist, return
	if (!command) return;
  
	try {
	  // Execute the command with the interaction as the argument
	  await command.execute(interaction);
	} catch (error) {
	  console.error(error);
	  // When a message or response is marked as ephemeral, it means that only the user who triggered the interaction
	  // can see the message. Other users in the same channel or server cannot see the ephemeral message.
	  if (interaction.replied || interaction.deferred) {
		await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
	  } else {
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	  }
	}
  });
  

// Log in to Discord with your client's token
client.login(process.env.DISCORD_TOKEN);
