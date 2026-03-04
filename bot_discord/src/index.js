import { Client, Collection, Events, GatewayIntentBits } from 'discord.js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readdirSync } from 'fs';
import express from 'express';
import { rosterManager } from './utils/roster-manager.js';
import { generateSignupEmbed, generateSignupButtons, generateWeaponMenu, generateEditRosterMenu, generateRoleSelectMenu, generateMemberSelectMenu } from './utils/signup-ui.js';
import { createCustomWeaponModal, createEditQuotasModal, createEditWeaponModal, createFeedbackModal } from './utils/modal-handler.js';
import { createNotificationManager } from './utils/notification-manager.js';

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

// Keepalive - ping toutes les 5 minutes pour éviter l'inactivité
setInterval(() => {
  console.log(`💓 Keepalive - Bot actif - ${new Date().toISOString()}`);
}, 5 * 60 * 1000);

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

// Gestion des erreurs et reconnexions
client.on('error', error => {
  console.error('❌ Erreur Discord:', error);
});

client.on('warn', info => {
  console.warn('⚠️ Warning Discord:', info);
});

client.on('shardError', error => {
  console.error('❌ Erreur de shard:', error);
});

client.on('shardReconnecting', () => {
  console.log('🔄 Reconnexion au gateway Discord...');
});

client.on('shardResume', () => {
  console.log('✅ Connexion rétablie au gateway Discord');
});

// Initialisation du système de notifications
client.once(Events.ClientReady, (c) => {
  console.log('🔔 Initialisation du système de notifications...');
  const notificationManager = createNotificationManager(c);
  rosterManager.setNotificationManager(notificationManager);
  
  // Démarrer l'auto-save
  rosterManager.startAutoSave();
  
  // Reprogrammer tous les rappels existants
  notificationManager.rescheduleAllReminders(rosterManager.rosters, c);
  console.log('✅ Système de notifications initialisé');
});

// Événement: Interaction (commandes slash, boutons, menus, autocomplete)
client.on(Events.InteractionCreate, async interaction => {
  // ==================== AUTOCOMPLETE ====================
  if (interaction.isAutocomplete()) {
    const command = interaction.client.commands.get(interaction.commandName);
    
    if (command && command.autocomplete) {
      try {
        await command.autocomplete(interaction);
      } catch (error) {
        console.error(`❌ Erreur autocomplete ${interaction.commandName}:`, error);
      }
    }
    return;
  }

  // ==================== COMMANDES SLASH ====================
  if (interaction.isChatInputCommand()) {
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
    return;
  }

  // ==================== BOUTONS ====================
  if (interaction.isButton()) {
    try {
      // Bouton "Ouvrir les inscriptions"
      if (interaction.customId === 'open_signup') {
        const originalMessage = interaction.message;
        const embed = originalMessage.embeds[0];
        
        if (!embed) {
          await interaction.reply({ content: '❌ Impossible de récupérer les données de la composition.', ephemeral: true });
          return;
        }

        // Extraire les données de la composition depuis l'embed
        const compositionName = embed.title || 'Composition';
        const members = [];
        
        for (const field of embed.fields) {
          // Extraire les membres depuis les fields de l'embed
          const lines = field.value.split('\n');
          for (const line of lines) {
            // Format: "1️⃣ 🛡️ **Nom** - Role: Tank - Stuff: ..."
            const match = line.match(/\*\*(.*?)\*\*.*?Role:\s*(.*?)\s*-/);
            if (match) {
              const weaponName = match[1].trim();
              const role = match[2].trim();
              members.push({ weapon: weaponName, role: role });
            }
          }
        }

        // Générer l'interface d'inscription
        const signupEmbed = generateSignupEmbed({
          creatorId: interaction.user.id,
          composition: { name: compositionName, members },
          signups: {},
          waitlist: [],
          quotas: rosterManager.calculateQuotas({ members }),
          status: 'open',
          createdAt: new Date()
        });
        const isCreator = true;
        const signupButtons = generateSignupButtons({
          creatorId: interaction.user.id,
          status: 'open'
        }, isCreator);

        // Répondre avec le roster (le message créé aura un nouvel ID)
        const response = await interaction.reply({
          embeds: [signupEmbed],
          components: signupButtons,
          fetchReply: true
        });

        // MAINTENANT créer le roster avec l'ID du nouveau message
        rosterManager.createRoster(
          response.id,
          interaction.user.id,
          { name: compositionName, members },
          null, // scheduledDate (peut être ajouté plus tard)
          interaction.guild?.id,
          interaction.channel?.id
        );

        return;
      }

      // Bouton "Se désinscrire"
      if (interaction.customId === 'signout') {
        const rosterId = interaction.message.id;
        const result = rosterManager.signout(rosterId, interaction.user.id, interaction.user.username);
        
        if (result.success) {
          const roster = rosterManager.getRoster(rosterId);
          const embed = generateSignupEmbed(roster);
          const isCreator = roster.creatorId === interaction.user.id;
          const buttons = generateSignupButtons(roster, isCreator);
          
          await interaction.update({
            embeds: [embed],
            components: buttons
          });
        } else {
          await interaction.reply({ content: `❌ ${result.message}`, ephemeral: true });
        }
        return;
      }

      // Bouton "Fermer"
      if (interaction.customId === 'close_signup') {
        const rosterId = interaction.message.id;
        const result = rosterManager.close(rosterId, interaction.user.id);
        
        if (result.success) {
          const roster = rosterManager.getRoster(rosterId);
          const embed = generateSignupEmbed(roster);
          const isCreator = roster.creatorId === interaction.user.id;
          const buttons = generateSignupButtons(roster, isCreator);
          
          await interaction.update({
            embeds: [embed],
            components: buttons
          });
        } else {
          await interaction.reply({ content: `❌ ${result.message}`, ephemeral: true });
        }
        return;
      }

      // Boutons de sélection de rôle
      if (interaction.customId.startsWith('signup_')) {
        const roleType = interaction.customId.split('_')[1];
        const capitalizedRole = roleType.charAt(0).toUpperCase() + roleType.slice(1);
        
        // Générer le menu de sélection d'armes
        const weaponMenu = generateWeaponMenu(capitalizedRole);
        
        await interaction.reply({
          content: `Choisissez votre arme pour le rôle **${capitalizedRole}** :`,
          components: [weaponMenu],
          ephemeral: true
        });
        return;
      }

      // Bouton "Modifier" (créateur uniquement)
      if (interaction.customId === 'edit_roster') {
        const rosterId = interaction.message.id;
        const roster = rosterManager.getRoster(rosterId);
        
        if (!roster) {
          await interaction.reply({ content: '❌ Roster introuvable', ephemeral: true });
          return;
        }
        
        if (roster.creatorId !== interaction.user.id) {
          await interaction.reply({ content: '❌ Seul le créateur peut modifier le roster', ephemeral: true });
          return;
        }
        
        const editMenu = generateEditRosterMenu(roster);
        
        await interaction.reply({
          content: '⚙️ **Modification du roster**\nChoisissez une action :',
          components: [editMenu],
          ephemeral: true
        });
        return;
      }

      // Bouton "Marquer terminé"
      if (interaction.customId === 'complete_roster') {
        const rosterId = interaction.message.id;
        const result = rosterManager.completeRoster(rosterId, interaction.user.id);
        
        if (result.success) {
          const roster = rosterManager.getRoster(rosterId);
          const embed = generateSignupEmbed(roster);
          const isCreator = roster.creatorId === interaction.user.id;
          const buttons = generateSignupButtons(roster, isCreator);
          
          await interaction.update({
            embeds: [embed],
            components: buttons
          });
          
          // Envoyer message de félicitations
          await interaction.followUp({
            content: `✅ **Événement terminé !**\n\nMerci à tous les participants ! N'hésitez pas à donner votre avis avec le bouton ⭐`,
            ephemeral: false
          });
        } else {
          await interaction.reply({ content: `❌ ${result.message}`, ephemeral: true });
        }
        return;
      }

      // Bouton "Donner mon avis"
      if (interaction.customId === 'add_feedback') {
        const modal = createFeedbackModal();
        await interaction.showModal(modal);
        return;
      }

      // Bouton "Aide"
      if (interaction.customId === 'roster_help') {
        const helpEmbed = {
          color: 0x3498db,
          title: '❓ Aide - Système d\'inscription',
          description: 'Voici comment utiliser le système d\'inscriptions pour les événements.',
          fields: [
            {
              name: '📝 S\'inscrire',
              value: '1. Cliquez sur le bouton de votre rôle (Tank, DPS, etc.)\n2. Sélectionnez votre arme dans le menu\n3. Validez votre inscription',
              inline: false
            },
            {
              name: '❌ Se désinscrire',
              value: 'Cliquez sur "Se désinscrire" pour retirer votre inscription.',
              inline: false
            },
            {
              name: '⏳ Liste d\'attente',
              value: 'Si le roster est complet, vous serez ajouté à la liste d\'attente. Vous serez automatiquement promu si une place se libère.',
              inline: false
            },
            {
              name: '✏️ Pour les créateurs',
              value: '• **Modifier** : Ajuster quotas, déplacer membres, expulser\n• **Marquer terminé** : Marque l\'événement comme fini\n• **Fermer** : Ferme les inscriptions',
              inline: false
            },
            {
              name: '📊 Commandes utiles',
              value: '• `/stats me` : Vos statistiques\n• `/roster list` : Liste des rosters actifs\n• `/template save` : Sauvegarder une compo',
              inline: false
            }
          ],
          footer: {
            text: 'Bot Albion Online - Système d\'inscriptions'
          }
        };
        
        await interaction.reply({ embeds: [helpEmbed], ephemeral: true });
        return;
      }

    } catch (error) {
      console.error('❌ Erreur lors du traitement du bouton:', error);
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({ content: '❌ Une erreur est survenue!', ephemeral: true });
      } else {
        await interaction.reply({ content: '❌ Une erreur est survenue!', ephemeral: true });
      }
    }
    return;
  }

  // ==================== MENUS DE SÉLECTION ====================
  if (interaction.isStringSelectMenu()) {
    try {
      // Menu de sélection d'armes
      if (interaction.customId.startsWith('weapon_select_')) {
        const roleType = interaction.customId.split('_')[2];
        const capitalizedRole = roleType.charAt(0).toUpperCase() + roleType.slice(1);
        const weaponName = interaction.values[0];

        // Cas spécial: arme personnalisée
        if (weaponName === 'custom_weapon') {
          const modal = createCustomWeaponModal(capitalizedRole);
          await interaction.showModal(modal);
          return;
        }

        // Trouver le roster ID depuis les messages récents du canal
        const channel = interaction.channel;
        const messages = await channel.messages.fetch({ limit: 10 });
        let rosterId = null;
        
        for (const msg of messages.values()) {
          if (msg.embeds[0]?.title?.includes('Inscriptions')) {
            rosterId = msg.id;
            break;
          }
        }

        if (!rosterId) {
          await interaction.reply({ content: '❌ Impossible de trouver le roster.', ephemeral: true });
          return;
        }

        // Enregistrer l'inscription
        const result = rosterManager.signup(
          rosterId,
          interaction.user.id,
          interaction.user.username,
          capitalizedRole,
          weaponName
        );

        if (result.success) {
          // Mettre à jour le message du roster
          const roster = rosterManager.getRoster(rosterId);
          const embed = generateSignupEmbed(roster);
          const isCreator = roster.creatorId === interaction.user.id;
          const buttons = generateSignupButtons(roster, isCreator);

          const rosterMessage = await channel.messages.fetch(rosterId);
          await rosterMessage.edit({
            embeds: [embed],
            components: buttons
          });

          await interaction.update({ 
            content: `✅ Inscription réussie comme **${capitalizedRole}** avec **${weaponName}**!`, 
            components: [] 
          });
        } else {
          await interaction.update({ 
            content: `❌ ${result.message}`, 
            components: [] 
          });
        }
        return;
      }

      // Menu d'édition du roster
      if (interaction.customId === 'edit_roster_menu') {
        const action = interaction.values[0];
        const channel = interaction.channel;
        const messages = await channel.messages.fetch({ limit: 10 });
        let rosterId = null;
        
        for (const msg of messages.values()) {
          if (msg.embeds[0]?.title?.includes('Inscriptions')) {
            rosterId = msg.id;
            break;
          }
        }

        if (!rosterId) {
          await interaction.reply({ content: '❌ Impossible de trouver le roster.', ephemeral: true });
          return;
        }

        const roster = rosterManager.getRoster(rosterId);

        switch (action) {
          case 'edit_quotas':
            const quotasModal = createEditQuotasModal(roster.quotas);
            await interaction.showModal(quotasModal);
            break;

          case 'add_slot':
            const addRoleMenu = generateRoleSelectMenu();
            await interaction.update({
              content: '➕ **Ajouter un slot**\nSélectionnez le rôle :',
              components: [addRoleMenu]
            });
            break;

          case 'remove_slot':
            const removeRoleMenu = generateRoleSelectMenu();
            await interaction.update({
              content: '➖ **Retirer un slot**\nSélectionnez le rôle :',
              components: [removeRoleMenu]
            });
            break;

          case 'edit_signup':
            const memberMenu = generateMemberSelectMenu(roster);
            await interaction.update({
              content: '✏️ **Modifier un inscrit**\nSélectionnez le membre :',
              components: [memberMenu]
            });
            break;

          case 'kick_member':
            const kickMenu = generateMemberSelectMenu(roster);
            await interaction.update({
              content: '👢 **Expulser un membre**\nSélectionnez le membre :',
              components: [kickMenu]
            });
            break;
        }
        return;
      }

      // Menu de sélection de rôle pour ajout/retrait de slot
      if (interaction.customId === 'select_role_to_modify') {
        const roleType = interaction.values[0];
        const capitalizedRole = roleType.charAt(0).toUpperCase() + roleType.slice(1);
        
        const channel = interaction.channel;
        const messages = await channel.messages.fetch({ limit: 10 });
        let rosterId = null;
        
        for (const msg of messages.values()) {
          if (msg.embeds[0]?.title?.includes('Inscriptions')) {
            rosterId = msg.id;
            break;
          }
        }

        if (!rosterId) {
          await interaction.reply({ content: '❌ Roster introuvable', ephemeral: true });
          return;
        }

        const roster = rosterManager.getRoster(rosterId);
        const currentQuota = roster.quotas[capitalizedRole] || 0;

        // Déterminer si c'est un ajout ou retrait selon le message précédent
        const isAdding = interaction.message.content.includes('Ajouter');
        const newQuota = isAdding ? currentQuota + 1 : Math.max(0, currentQuota - 1);

        const result = rosterManager.updateQuotas(rosterId, interaction.user.id, {
          [capitalizedRole]: newQuota
        });

        if (result.success) {
          const updatedRoster = rosterManager.getRoster(rosterId);
          const embed = generateSignupEmbed(updatedRoster);
          const isCreator = updatedRoster.creatorId === interaction.user.id;
          const buttons = generateSignupButtons(updatedRoster, isCreator);

          const rosterMessage = await channel.messages.fetch(rosterId);
          await rosterMessage.edit({
            embeds: [embed],
            components: buttons
          });

          await interaction.update({
            content: `✅ ${capitalizedRole}: ${currentQuota} → ${newQuota}`,
            components: []
          });
        } else {
          await interaction.update({
            content: `❌ ${result.message}`,
            components: []
          });
        }
        return;
      }

      // Menu de sélection de membre pour modification/kick
      if (interaction.customId === 'select_member_to_modify') {
        const value = interaction.values[0];
        
        if (value === 'none') {
          await interaction.update({ content: '❌ Aucun membre inscrit', components: [] });
          return;
        }

        const [userId, oldRole] = value.split('_');
        const isKick = interaction.message.content.includes('Expulser');

        const channel = interaction.channel;
        const messages = await channel.messages.fetch({ limit: 10 });
        let rosterId = null;
        
        for (const msg of messages.values()) {
          if (msg.embeds[0]?.title?.includes('Inscriptions')) {
            rosterId = msg.id;
            break;
          }
        }

        if (!rosterId) {
          await interaction.reply({ content: '❌ Roster introuvable', ephemeral: true });
          return;
        }

        if (isKick) {
          // Expulser le membre
          const result = rosterManager.kick(rosterId, interaction.user.id, userId);
          
          if (result.success) {
            const roster = rosterManager.getRoster(rosterId);
            const embed = generateSignupEmbed(roster);
            const isCreator = roster.creatorId === interaction.user.id;
            const buttons = generateSignupButtons(roster, isCreator);

            const rosterMessage = await channel.messages.fetch(rosterId);
            await rosterMessage.edit({
              embeds: [embed],
              components: buttons
            });

            await interaction.update({
              content: `✅ Membre expulsé avec succès`,
              components: []
            });
          } else {
            await interaction.update({
              content: `❌ ${result.message}`,
              components: []
            });
          }
        } else {
          // Modifier le membre - afficher menu pour choisir nouveau rôle et arme
          const roleMenu = generateRoleSelectMenu();
          
          // Stocker temporairement l'userId dans le customId du prochain menu
          await interaction.update({
            content: `✏️ **Modifier le membre**\nChoisissez le nouveau rôle :`,
            components: [roleMenu]
          });
          
          // Stocker l'userId dans une variable temporaire (limitation: utiliser un Map global ou le message)
          interaction.client.tempEditUserId = userId;
        }
        return;
      }

    } catch (error) {
      console.error('❌ Erreur lors du traitement du menu:', error);
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({ content: '❌ Une erreur est survenue!', ephemeral: true });
      } else {
        await interaction.reply({ content: '❌ Une erreur est survenue!', ephemeral: true });
      }
    }
    return;
  }

  // ==================== MODALS ====================
  if (interaction.isModalSubmit()) {
    try {
      // Modal arme personnalisée
      if (interaction.customId.startsWith('custom_weapon_modal_')) {
        const roleType = interaction.customId.split('_')[3];
        const capitalizedRole = roleType.charAt(0).toUpperCase() + roleType.slice(1);
        const customWeapon = interaction.fields.getTextInputValue('custom_weapon_name');

        // Trouver le roster
        const channel = interaction.channel;
        const messages = await channel.messages.fetch({ limit: 10 });
        let rosterId = null;
        
        for (const msg of messages.values()) {
          if (msg.embeds[0]?.title?.includes('Inscriptions')) {
            rosterId = msg.id;
            break;
          }
        }

        if (!rosterId) {
          await interaction.reply({ content: '❌ Impossible de trouver le roster.', ephemeral: true });
          return;
        }

        // Enregistrer l'inscription avec l'arme personnalisée
        const result = rosterManager.signup(
          rosterId,
          interaction.user.id,
          interaction.user.username,
          capitalizedRole,
          customWeapon,
          interaction.guild?.id
        );

        if (result.success) {
          const roster = rosterManager.getRoster(rosterId);
          const embed = generateSignupEmbed(roster);
          const isCreator = roster.creatorId === interaction.user.id;
          const buttons = generateSignupButtons(roster, isCreator);

          const rosterMessage = await channel.messages.fetch(rosterId);
          await rosterMessage.edit({
            embeds: [embed],
            components: buttons
          });

          await interaction.reply({ 
            content: `✅ Inscription réussie comme **${capitalizedRole}** avec **${customWeapon}**!`, 
            ephemeral: true 
          });
        } else {
          await interaction.reply({ 
            content: `❌ ${result.message}`, 
            ephemeral: true 
          });
        }
        return;
      }

      // Modal modification des quotas
      if (interaction.customId === 'edit_quotas_modal') {
        const newQuotas = {
          Tank: parseInt(interaction.fields.getTextInputValue('quota_tank')) || 0,
          DPS: parseInt(interaction.fields.getTextInputValue('quota_dps')) || 0,
          Healer: parseInt(interaction.fields.getTextInputValue('quota_healer')) || 0,
          Support: parseInt(interaction.fields.getTextInputValue('quota_support')) || 0,
          Scout: parseInt(interaction.fields.getTextInputValue('quota_scout')) || 0
        };

        const channel = interaction.channel;
        const messages = await channel.messages.fetch({ limit: 10 });
        let rosterId = null;
        
        for (const msg of messages.values()) {
          if (msg.embeds[0]?.title?.includes('Inscriptions')) {
            rosterId = msg.id;
            break;
          }
        }

        if (!rosterId) {
          await interaction.reply({ content: '❌ Roster introuvable', ephemeral: true });
          return;
        }

        const result = rosterManager.updateQuotas(rosterId, interaction.user.id, newQuotas);

        if (result.success) {
          const roster = rosterManager.getRoster(rosterId);
          const embed = generateSignupEmbed(roster);
          const isCreator = roster.creatorId === interaction.user.id;
          const buttons = generateSignupButtons(roster, isCreator);

          const rosterMessage = await channel.messages.fetch(rosterId);
          await rosterMessage.edit({
            embeds: [embed],
            components: buttons
          });

          await interaction.reply({
            content: `✅ Quotas mis à jour avec succès!`,
            ephemeral: true
          });
        } else {
          await interaction.reply({
            content: `❌ ${result.message}`,
            ephemeral: true
          });
        }
        return;
      }

      // Modal feedback
      if (interaction.customId === 'feedback_modal') {
        const ratingStr = interaction.fields.getTextInputValue('feedback_rating');
        const comment = interaction.fields.getTextInputValue('feedback_comment') || '';
        
        const rating = parseInt(ratingStr);
        if (isNaN(rating) || rating < 1 || rating > 5) {
          await interaction.reply({
            content: '❌ La note doit être entre 1 et 5.',
            ephemeral: true
          });
          return;
        }

        const channel = interaction.channel;
        const messages = await channel.messages.fetch({ limit: 10 });
        let rosterId = null;
        
        for (const msg of messages.values()) {
          if (msg.embeds[0]?.title?.includes('Inscriptions') && msg.embeds[0]?.description?.includes('Terminé')) {
            rosterId = msg.id;
            break;
          }
        }

        if (!rosterId) {
          await interaction.reply({ content: '❌ Roster introuvable', ephemeral: true });
          return;
        }

        const result = rosterManager.addFeedback(
          rosterId,
          interaction.user.id,
          interaction.user.username,
          rating,
          comment
        );

        if (result.success) {
          const roster = rosterManager.getRoster(rosterId);
          const embed = generateSignupEmbed(roster);
          const isCreator = roster.creatorId === interaction.user.id;
          const buttons = generateSignupButtons(roster, isCreator);

          const rosterMessage = await channel.messages.fetch(rosterId);
          await rosterMessage.edit({
            embeds: [embed],
            components: buttons
          });

          await interaction.reply({
            content: `✅ Merci pour votre avis ! ${'⭐'.repeat(rating)}`,
            ephemeral: true
          });
        } else {
          await interaction.reply({
            content: `❌ ${result.message}`,
            ephemeral: true
          });
        }
        return;
      }

    } catch (error) {
      console.error('❌ Erreur lors du traitement du modal:', error);
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({ content: '❌ Une erreur est survenue!', ephemeral: true });
      } else {
        await interaction.reply({ content: '❌ Une erreur est survenue!', ephemeral: true });
      }
    }
  }
});

// Connexion du bot
client.login(process.env.DISCORD_TOKEN);
