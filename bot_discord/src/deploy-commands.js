import { REST, Routes } from 'discord.js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readdirSync } from 'fs';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const commands = [];

// Chargement des commandes
const commandsPath = join(__dirname, 'commands');
const commandFiles = readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const filePath = join(commandsPath, file);
  const command = await import(`file://${filePath}`);
  if ('data' in command) {
    commands.push(command.data.toJSON());
    console.log(`✅ Commande préparée: ${command.data.name}`);
  }
}

// Création de l'instance REST
const rest = new REST().setToken(process.env.DISCORD_TOKEN);

// Déploiement des commandes
(async () => {
  try {
    console.log(`🚀 Déploiement de ${commands.length} commande(s)...`);

    // Pour un serveur spécifique (développement)
    if (process.env.GUILD_ID) {
      const data = await rest.put(
        Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
        { body: commands }
      );
      console.log(`✅ ${data.length} commande(s) déployée(s) sur le serveur !`);
    } 
    // Pour tous les serveurs (global)
    else {
      const data = await rest.put(
        Routes.applicationCommands(process.env.CLIENT_ID),
        { body: commands }
      );
      console.log(`✅ ${data.length} commande(s) déployée(s) globalement !`);
    }
  } catch (error) {
    console.error('❌ Erreur lors du déploiement:', error);
  }
})();
