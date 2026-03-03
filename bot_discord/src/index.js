import { Client, Collection, Events, GatewayIntentBits } from 'discord.js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readdirSync } from 'fs';
import express from 'express';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Création du serveur HTTP pour Render
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.json({
    status: 'online',
    bot: 'Albion PVP/PVE Bot',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    discord: client.isReady() ? 'connected' : 'disconnected',
    guilds: client.guilds?.cache.size || 0
  });
});

app.listen(PORT, () => {
  console.log(`🌐 Serveur HTTP démarré sur le port ${PORT}`);
});

// Création du client Discord
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages
  ]
});

// Collection des commandes
client.commands = new Collection();

// Chargement des commandes
const commandsPath = join(__dirname, 'commands');
const commandFiles = readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const filePath = join(commandsPath, file);
  const command = await import(`file://${filePath}`);
  
  if ('data' in command && 'execute' in command) {
    client.commands.set(command.data.name, command);
    console.log(`✅ Commande chargée: ${command.data.name}`);
  } else {
    console.log(`⚠️ La commande ${file} n'a pas les propriétés requises.`);
  }
}

// Événement: Bot prêt
client.once(Events.ClientReady, c => {
  console.log(`🤖 Bot connecté en tant que ${c.user.tag}`);
  console.log(`📊 Présent sur ${c.guilds.cache.size} serveur(s)`);
});

// Événement: Interaction (commandes slash)
client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const command = interaction.client.commands.get(interaction.commandName);

  if (!command) {
    console.error(`❌ Commande inconnue: ${interaction.commandName}`);
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(`❌ Erreur lors de l'exécution de ${interaction.commandName}:`, error);
    
    const errorMessage = {
      content: '❌ Une erreur s\'est produite lors de l\'exécution de cette commande !',
      ephemeral: true
    };
    
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp(errorMessage);
    } else {
      await interaction.reply(errorMessage);
    }
  }
});

// Connexion du bot
client.login(process.env.DISCORD_TOKEN);
