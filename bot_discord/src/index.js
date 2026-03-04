import { Client, Collection, Events, GatewayIntentBits, ButtonBuilder, ButtonStyle, ActionRowBuilder } from 'discord.js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readdirSync } from 'fs';
import express from 'express';
import { rosterManager } from './utils/roster-manager.js';
import { generateSignupEmbed, generateSignupButtons, generateWeaponMenu, generateEditRosterMenu, generateRoleSelectMenu, generateMemberSelectMenu, generateSwapSelectionMenu } from './utils/signup-ui.js';
import { createCustomWeaponModal, createEditQuotasModal, createEditWeaponModal, createFeedbackModal, createSwapModal } from './utils/modal-handler.js';
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
client.once(Events.ClientReady, async (c) => {
  console.log('🔔 Initialisation du système de notifications...');
  
  // Attendre que les rosters soient chargés
  console.log('📂 Chargement des rosters...');
  await rosterManager.waitForLoad();
  console.log(`✅ ${rosterManager.rosters.size} roster(s) chargé(s)`);
  
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
          // Le field.name contient le numéro et le type de rôle (ex: "1. Tank", "2. DPS")
          // Le field.value contient: "🛡️ **Masse Incube**\n📋 Rôle: Frontline/CC\n🎽 Équipement:..."
          
          const fieldName = field.name || '';
          const fieldValue = field.value || '';
          
          // Extraire le type de rôle depuis le nom du field (Tank, DPS, Healer, etc.)
          const roleTypeMatch = fieldName.match(/\d+\.\s*(\w+)/);
          if (!roleTypeMatch) continue;
          
          const roleType = roleTypeMatch[1]; // Tank, DPS, Healer, Support, Scout
          
          // Extraire le nom de l'arme depuis la première ligne du value
          // Format: "🛡️ **Masse Incube**" - on cherche juste le texte entre **
          const lines = fieldValue.split('\n');
          const firstLine = lines[0] || '';
          const weaponMatch = firstLine.match(/\*\*(.+?)\*\*/);
          
          if (weaponMatch) {
            const weaponName = weaponMatch[1].trim();
            
            // Extraire le rôle détaillé depuis la ligne "📋 Rôle: ..."
            let detailedRole = roleType; // Par défaut, utiliser le type de rôle
            const roleLineMatch = fieldValue.match(/📋 Rôle:\s*(.+)/);
            if (roleLineMatch) {
              detailedRole = roleLineMatch[1].trim();
            }
            
            members.push({ 
              weapon: weaponName, 
              role: detailedRole,
              type: roleType // Tank, DPS, Healer, etc.
            });
            console.log(`✅ Membre extrait: ${weaponName} (${roleType} - ${detailedRole})`);
          }
        }
        
        console.log(`📊 Total membres extraits: ${members.length}`);

        if (members.length === 0) {
          await interaction.reply({ content: '❌ Aucun membre détecté dans la composition.', ephemeral: true });
          return;
        }

        // Créer d'abord le roster temporaire pour avoir l'ID
        const tempRoster = {
          creatorId: interaction.user.id,
          composition: { name: compositionName, members },
          signups: {},
          waitlist: [],
          quotas: rosterManager.calculateQuotas(members),
          status: 'open',
          createdAt: new Date()
        };

        // Générer l'interface d'inscription
        const signupEmbed = generateSignupEmbed(tempRoster);
        const signupButtons = generateSignupButtons(tempRoster, true);

        // Répondre avec le roster (le message créé aura un nouvel ID)
        const response = await interaction.reply({
          embeds: [signupEmbed],
          components: signupButtons,
          fetchReply: true
        });

        // MAINTENANT créer le roster définitif avec l'ID du nouveau message
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
          await interaction.reply({ content: `❌ ${result.error || result.error || result.message || 'Erreur' || 'Une erreur est survenue'}`, ephemeral: true });
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
          await interaction.reply({ content: `❌ ${result.error || result.message || 'Erreur'}`, ephemeral: true });
        }
        return;
      }

      // Boutons de sélection de rôle
      if (interaction.customId.startsWith('signup_')) {
        const rosterId = interaction.message.id;
        console.log(`🔍 Recherche roster ID: ${rosterId}`);
        const roster = rosterManager.getRoster(rosterId);
        
        if (!roster) {
          console.log(`❌ Roster ${rosterId} introuvable dans la Map`);
          console.log(`📋 Rosters disponibles:`, Array.from(rosterManager.rosters.keys()));
          await interaction.reply({ content: '❌ Roster introuvable', ephemeral: true });
          return;
        }
        
        console.log(`✅ Roster trouvé: ${roster.composition.name}`);
        
        // Vérifier si l'utilisateur est déjà inscrit
        let alreadySignedUp = false;
        for (const [roleType, signups] of Object.entries(roster.signups)) {
          if (signups.find(s => s.userId === interaction.user.id)) {
            alreadySignedUp = true;
            break;
          }
        }
        
        // Vérifier aussi dans la waitlist
        if (roster.waitlist && roster.waitlist.find(w => w.userId === interaction.user.id)) {
          alreadySignedUp = true;
        }
        
        if (alreadySignedUp) {
          await interaction.reply({ 
            content: '❌ Vous êtes déjà inscrit ! Désinscrivez-vous d\'abord pour changer de rôle.', 
            ephemeral: true 
          });
          return;
        }
        
        const roleType = interaction.customId.split('_')[1];
        // Normaliser: tank -> Tank, dps -> DPS, healer -> Healer, etc.
        const roleMapping = {
          'tank': 'Tank',
          'dps': 'DPS',
          'healer': 'Healer',
          'support': 'Support',
          'scout': 'Scout'
        };
        const capitalizedRole = roleMapping[roleType.toLowerCase()] || roleType.charAt(0).toUpperCase() + roleType.slice(1);
        
        // Générer le menu de sélection d'armes avec le rosterId
        const weaponMenu = generateWeaponMenu(capitalizedRole, rosterId);
        
        const response = await interaction.reply({
          content: `Choisissez votre arme pour le rôle **${capitalizedRole}** :\n\n💡 **Astuce :** Tapez \`/weapon\` ou \`/armor\` pour rechercher un équipement spécifique avec autocomplétion !`,
          components: [weaponMenu],
          ephemeral: true,
          fetchReply: true
        });
        
        // Auto-désactiver après 60 secondes
        setTimeout(async () => {
          try {
            await interaction.editReply({
              content: '⏱️ Menu expiré (60s)',
              components: []
            });
          } catch (error) {
            // Ignore si déjà modifié
          }
        }, 60000);
        
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
        
        const editMenu = generateEditRosterMenu(roster, rosterId);
        
        const response = await interaction.reply({
          content: '⚙️ **Modification du roster**\nChoisissez une action :',
          components: [editMenu],
          ephemeral: true,
          fetchReply: true
        });
        
        // Auto-désactiver le menu après 60 secondes
        setTimeout(async () => {
          try {
            await interaction.editReply({
              content: '⏱️ Menu expiré (60s)',
              components: []
            });
          } catch (error) {
            // Ignore si le message a déjà été modifié
          }
        }, 60000);
        
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
          await interaction.reply({ content: `❌ ${result.error || result.message || 'Erreur'}`, ephemeral: true });
        }
        return;
      }

      // Bouton "Donner mon avis"
      if (interaction.customId === 'add_feedback') {
        const modal = createFeedbackModal();
        await interaction.showModal(modal);
        return;
      }

      // Bouton "Ajouter un swap"
      if (interaction.customId.startsWith('add_swap_')) {
        const rosterId = interaction.customId.split('_')[2];
        const modal = createSwapModal(rosterId);
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
              value: '• `/weapon` : Rechercher une arme avec autocomplétion\n• `/armor` : Rechercher une armure avec autocomplétion\n• `/stats me` : Vos statistiques\n• `/roster list` : Liste des rosters actifs\n• `/template save` : Sauvegarder une compo',
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
        const parts = interaction.customId.split('_');
        const roleType = parts[2];
        const rosterId = parts[3]; // Extraire le rosterId du customId
        // Normaliser la casse
        const roleMapping = {
          'tank': 'Tank',
          'dps': 'DPS',
          'healer': 'Healer',
          'support': 'Support',
          'scout': 'Scout'
        };
        const capitalizedRole = roleMapping[roleType.toLowerCase()] || roleType.charAt(0).toUpperCase() + roleType.slice(1);
        const weaponName = interaction.values[0];

        // Cas spécial: arme personnalisée
        if (weaponName === 'custom_weapon') {
          const modal = createCustomWeaponModal(capitalizedRole, rosterId);
          await interaction.showModal(modal);
          return;
        }

        // Vérifier que le roster existe
        const roster = rosterManager.getRoster(rosterId);
        if (!roster) {
          await interaction.reply({ content: '❌ Roster introuvable.', ephemeral: true });
          return;
        }

        // Vérifier si on est en mode édition de membre
        const isEditMode = interaction.client.tempEditUserId && 
                           interaction.client.tempEditRosterId === rosterId;

        if (isEditMode) {
          // Mode édition: modifier l'inscription existante
          const userId = interaction.client.tempEditUserId;
          const oldRole = interaction.client.tempEditOldRole;
          const newRole = interaction.client.tempEditNewRole || capitalizedRole;
          
          // Modifier directement l'inscription
          const oldSignups = roster.signups[oldRole] || [];
          const memberIndex = oldSignups.findIndex(s => s.userId === userId);
          
          if (memberIndex === -1) {
            await interaction.update({ 
              content: '❌ Membre introuvable', 
              components: [] 
            });
            return;
          }

          // Retirer de l'ancien rôle
          const member = oldSignups[memberIndex];
          oldSignups.splice(memberIndex, 1);

          // Ajouter au nouveau rôle
          if (!roster.signups[newRole]) {
            roster.signups[newRole] = [];
          }
          roster.signups[newRole].push({
            userId: member.userId,
            username: member.username,
            weapon: weaponName,
            armor: null, // Pas d'armure via menu standard
            timestamp: Date.now()
          });

          // Sauvegarder
          rosterManager.saveRosters();

          // Nettoyer les variables temporaires
          delete interaction.client.tempEditUserId;
          delete interaction.client.tempEditOldRole;
          delete interaction.client.tempEditRosterId;
          delete interaction.client.tempEditNewRole;

          const embed = generateSignupEmbed(roster);
          const isCreator = roster.creatorId === interaction.user.id;
          const buttons = generateSignupButtons(roster, isCreator);

          const channel = interaction.channel;
          const rosterMessage = await channel.messages.fetch(rosterId);
          await rosterMessage.edit({
            embeds: [embed],
            components: buttons
          });

          await interaction.update({ 
            content: `✅ Membre modifié avec succès : **${newRole}** avec **${weaponName}**!`, 
            components: [] 
          });
        } else {
          // Mode inscription normale
          const result = rosterManager.signup(
            rosterId,
            interaction.user.id,
            interaction.user.username,
            capitalizedRole,
            weaponName,
            interaction.guild?.id,
            null // armor (pas d'armure via menu standard)
          );

          if (result.success) {
            // Mettre à jour le message du roster
            const embed = generateSignupEmbed(roster);
            const isCreator = roster.creatorId === interaction.user.id;
            const buttons = generateSignupButtons(roster, isCreator);

            const channel = interaction.channel;
            const rosterMessage = await channel.messages.fetch(rosterId);
            await rosterMessage.edit({
              embeds: [embed],
              components: buttons
            });

            // Créer un bouton pour ajouter un swap
            const addSwapButton = new ButtonBuilder()
              .setCustomId(`add_swap_${rosterId}`)
              .setLabel('➕ Ajouter un swap')
              .setStyle(ButtonStyle.Secondary)
              .setEmoji('🔄');

            const swapRow = new ActionRowBuilder().addComponents(addSwapButton);

            await interaction.update({ 
              content: `✅ Inscription réussie comme **${capitalizedRole}** avec **${weaponName}**!\n\n💡 Vous pouvez ajouter des builds alternatifs (swaps) que vous savez jouer.`, 
              components: [swapRow]
            });
          } else {
            await interaction.update({ 
              content: `❌ ${result.error || result.message || 'Erreur'}`, 
              components: [] 
            });
          }
        }
        return;
      }

      // Menu d'édition du roster
      if (interaction.customId.startsWith('edit_roster_menu')) {
        const parts = interaction.customId.split('_');
        const rosterId = parts[parts.length - 1]; // Dernier élément
        const action = interaction.values[0];
        
        const roster = rosterManager.getRoster(rosterId);
        if (!roster) {
          await interaction.reply({ content: '❌ Roster introuvable.', ephemeral: true });
          return;
        }

        switch (action) {
          case 'edit_quotas':
            const quotasModal = createEditQuotasModal(roster.quotas);
            await interaction.showModal(quotasModal);
            break;

          case 'add_slot':
            const addRoleMenu = generateRoleSelectMenu(rosterId);
            await interaction.update({
              content: '➕ **Ajouter un slot**\nSélectionnez le rôle :',
              components: [addRoleMenu]
            });
            break;

          case 'remove_slot':
            const removeRoleMenu = generateRoleSelectMenu(rosterId);
            await interaction.update({
              content: '➖ **Retirer un slot**\nSélectionnez le rôle :',
              components: [removeRoleMenu]
            });
            break;

          case 'edit_signup':
            const memberMenu = generateMemberSelectMenu(roster, rosterId);
            if (!memberMenu) {
              await interaction.update({
                content: '❌ Aucun membre inscrit à modifier',
                components: []
              });
              return;
            }
            await interaction.update({
              content: '✏️ **Modifier un inscrit**\nSélectionnez le membre :',
              components: [memberMenu]
            });
            break;

          case 'kick_member':
            const kickMenu = generateMemberSelectMenu(roster, rosterId);
            if (!kickMenu) {
              await interaction.update({
                content: '❌ Aucun membre inscrit à expulser',
                components: []
              });
              return;
            }
            await interaction.update({
              content: '👢 **Expulser un membre**\nSélectionnez le membre :',
              components: [kickMenu]
            });
            break;

          case 'optimize_roster':
            const analysis = rosterManager.analyzeRosterOptimization(rosterId);
            
            if (!analysis.success) {
              await interaction.update({
                content: `❌ ${analysis.error}`,
                components: []
              });
              return;
            }

            if (analysis.suggestions.length === 0) {
              await interaction.update({
                content: '✅ **Roster déjà optimisé !**\n\nAucune suggestion d\'amélioration disponible. Tous les rôles sont remplis ou aucun swap utile n\'est disponible.',
                components: []
              });
              return;
            }

            // Afficher les suggestions
            let suggestionsText = `🔮 **Suggestions d'optimisation** (${analysis.suggestions.length})\n\n`;
            
            analysis.suggestions.slice(0, 5).forEach((s, index) => {
              suggestionsText += `${index + 1}. ${s.message}\n   ↳ *${s.benefit}*\n\n`;
            });

            if (analysis.suggestions.length > 5) {
              suggestionsText += `... et ${analysis.suggestions.length - 5} autre(s) suggestion(s)\n\n`;
            }

            // Créer des boutons pour appliquer les suggestions
            const suggestionButtons = [];
            analysis.suggestions.slice(0, 3).forEach((s, index) => {
              suggestionButtons.push(
                new ButtonBuilder()
                  .setCustomId(`apply_suggestion_${index}_${rosterId}`)
                  .setLabel(`Appliquer suggestion ${index + 1}`)
                  .setStyle(ButtonStyle.Success)
                  .setEmoji('✅')
              );
            });

            const buttonRows = [];
            for (let i = 0; i < suggestionButtons.length; i += 5) {
              buttonRows.push(
                new ActionRowBuilder().addComponents(suggestionButtons.slice(i, i + 5))
              );
            }

            // Stocker les suggestions temporairement
            interaction.client.rosterSuggestions = interaction.client.rosterSuggestions || {};
            interaction.client.rosterSuggestions[rosterId] = analysis.suggestions;

            await interaction.update({
              content: suggestionsText,
              components: buttonRows
            });
            break;
        }
        return;
      }

      // Appliquer une suggestion d'optimisation
      if (interaction.customId.startsWith('apply_suggestion_')) {
        const parts = interaction.customId.split('_');
        const suggestionIndex = parseInt(parts[2]);
        const rosterId = parts[3];

        const suggestions = interaction.client.rosterSuggestions?.[rosterId];
        if (!suggestions || !suggestions[suggestionIndex]) {
          await interaction.reply({ 
            content: '❌ Suggestion expirée, veuillez relancer l\'optimisation', 
            ephemeral: true 
          });
          return;
        }

        const suggestion = suggestions[suggestionIndex];
        const result = rosterManager.applySuggestion(rosterId, interaction.user.id, suggestion);

        if (result.success) {
          const roster = rosterManager.getRoster(rosterId);
          const embed = generateSignupEmbed(roster);
          const isCreator = roster.creatorId === interaction.user.id;
          const buttons = generateSignupButtons(roster, isCreator);

          const channel = interaction.channel;
          const rosterMessage = await channel.messages.fetch(rosterId);
          await rosterMessage.edit({
            embeds: [embed],
            components: buttons
          });

          await interaction.update({
            content: `✅ Optimisation appliquée avec succès !\n\n${suggestion.message}`,
            components: []
          });
        } else {
          await interaction.reply({
            content: `❌ ${result.error}`,
            ephemeral: true
          });
        }
        return;
      }

      // Menu de sélection de rôle pour ajout/retrait de slot
      if (interaction.customId.startsWith('select_role_to_modify')) {
        const parts = interaction.customId.split('_');
        const rosterId = parts[parts.length - 1]; // Dernier élément est le rosterId
        const roleType = interaction.values[0];
        // Normaliser la casse
        const roleMapping = {
          'tank': 'Tank',
          'dps': 'DPS',
          'healer': 'Healer',
          'support': 'Support',
          'scout': 'Scout'
        };
        const capitalizedRole = roleMapping[roleType.toLowerCase()] || roleType.charAt(0).toUpperCase() + roleType.slice(1);
        
        const roster = rosterManager.getRoster(rosterId);
        if (!roster) {
          await interaction.reply({ content: '❌ Roster introuvable', ephemeral: true });
          return;
        }

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

          const channel = interaction.channel;
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
            content: `❌ ${result.error || result.message || 'Erreur'}`,
            components: []
          });
        }
        return;
      }

      // Menu de sélection de membre pour modification/kick
      // Menu de sélection de membre pour modification/kick
      if (interaction.customId.startsWith('select_member_to_modify')) {
        const parts = interaction.customId.split('_');
        const rosterId = parts[parts.length - 1]; // Dernier élément est le rosterId
        const value = interaction.values[0];
        
        if (value === 'none') {
          await interaction.update({ content: '❌ Aucun membre inscrit', components: [] });
          return;
        }

        const [userId, oldRole] = value.split('_');
        const isKick = interaction.message.content.includes('Expulser');

        const roster = rosterManager.getRoster(rosterId);
        if (!roster) {
          await interaction.reply({ content: '❌ Roster introuvable', ephemeral: true });
          return;
        }

        if (isKick) {
          // Expulser le membre
          const result = rosterManager.kick(rosterId, interaction.user.id, userId);
          
          if (result.success) {
            const embed = generateSignupEmbed(roster);
            const isCreator = roster.creatorId === interaction.user.id;
            const buttons = generateSignupButtons(roster, isCreator);

            const channel = interaction.channel;
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
              content: `❌ ${result.error || result.message || 'Erreur'}`,
              components: []
            });
          }
        } else {
          // Modifier le membre - afficher menu pour choisir nouveau rôle
          const roleMenu = generateRoleSelectMenu(rosterId, 'edit');
          
          // Stocker temporairement l'userId et oldRole dans le client
          interaction.client.tempEditUserId = userId;
          interaction.client.tempEditOldRole = oldRole;
          interaction.client.tempEditRosterId = rosterId;
          
          await interaction.update({
            content: `✏️ **Modifier le membre**\nChoisissez le nouveau rôle :`,
            components: [roleMenu]
          });
        }
        return;
      }

      // Menu de sélection de rôle pour modification de membre (étape 2: choix du nouveau rôle)
      if (interaction.customId.startsWith('select_role_for_edit')) {
        const newRole = interaction.values[0];
        // Normaliser la casse
        const roleMapping = {
          'tank': 'Tank',
          'dps': 'DPS',
          'healer': 'Healer',
          'support': 'Support',
          'scout': 'Scout'
        };
        const capitalizedRole = roleMapping[newRole.toLowerCase()] || newRole.charAt(0).toUpperCase() + newRole.slice(1);
        
        // Récupérer les infos temporaires
        const userId = interaction.client.tempEditUserId;
        const oldRole = interaction.client.tempEditOldRole;
        const rosterId = interaction.client.tempEditRosterId;
        
        if (!userId || !rosterId) {
          await interaction.update({ 
            content: '❌ Session expirée, veuillez recommencer', 
            components: [] 
          });
          return;
        }

        const roster = rosterManager.getRoster(rosterId);
        if (!roster) {
          await interaction.update({ content: '❌ Roster introuvable', components: [] });
          return;
        }
        
        // Afficher le menu de swaps ou d'armes
        const swapMenu = generateSwapSelectionMenu(roster, userId, capitalizedRole, rosterId);
        
        // Stocker le nouveau rôle aussi
        interaction.client.tempEditNewRole = capitalizedRole;
        
        await interaction.update({
          content: `✏️ **Modifier le membre**\nChoisissez l'équipement pour **${capitalizedRole}** :`,
          components: [swapMenu]
        });
        return;
      }

      // Menu de sélection de swap ou arme (nouvelle étape)
      if (interaction.customId.startsWith('select_swap_or_weapon')) {
        const parts = interaction.customId.split('_');
        const rosterId = parts[parts.length - 1];
        const choice = interaction.values[0];
        
        const userId = interaction.client.tempEditUserId;
        const oldRole = interaction.client.tempEditOldRole;
        const newRole = interaction.client.tempEditNewRole;
        
        if (!userId || !rosterId || !newRole) {
          await interaction.update({ 
            content: '❌ Session expirée, veuillez recommencer', 
            components: [] 
          });
          return;
        }

        if (choice === 'choose_weapon') {
          // Afficher le menu d'armes standard
          const weaponMenu = generateWeaponMenu(newRole, rosterId);
          
          await interaction.update({
            content: `✏️ **Modifier le membre**\nChoisissez la nouvelle arme pour **${newRole}** :`,
            components: [weaponMenu]
          });
        } else if (choice.startsWith('swap_')) {
          // Utiliser un swap existant
          const swapIndex = parseInt(choice.split('_')[1]);
          const roster = rosterManager.getRoster(rosterId);
          
          if (!roster) {
            await interaction.update({ content: '❌ Roster introuvable', components: [] });
            return;
          }

          // Trouver le swap
          let selectedSwap = null;
          for (const [roleType, signups] of Object.entries(roster.signups)) {
            const signup = signups.find(s => s.userId === userId);
            if (signup && signup.swaps && signup.swaps[swapIndex]) {
              selectedSwap = signup.swaps[swapIndex];
              break;
            }
          }

          if (!selectedSwap) {
            await interaction.update({ content: '❌ Swap introuvable', components: [] });
            return;
          }

          // Appliquer le swap
          const oldSignups = roster.signups[oldRole] || [];
          const memberIndex = oldSignups.findIndex(s => s.userId === userId);
          
          if (memberIndex === -1) {
            await interaction.update({ content: '❌ Membre introuvable', components: [] });
            return;
          }

          // Retirer de l'ancien rôle
          const member = oldSignups[memberIndex];
          oldSignups.splice(memberIndex, 1);

          // Ajouter au nouveau rôle avec le swap
          if (!roster.signups[newRole]) {
            roster.signups[newRole] = [];
          }
          roster.signups[newRole].push({
            userId: member.userId,
            username: member.username,
            weapon: selectedSwap.weapon,
            armor: selectedSwap.armor,
            swaps: member.swaps, // Conserver les swaps
            timestamp: Date.now()
          });

          // Sauvegarder
          rosterManager.saveRosters();

          // Nettoyer les variables temporaires
          delete interaction.client.tempEditUserId;
          delete interaction.client.tempEditOldRole;
          delete interaction.client.tempEditRosterId;
          delete interaction.client.tempEditNewRole;

          const embed = generateSignupEmbed(roster);
          const isCreator = roster.creatorId === interaction.user.id;
          const buttons = generateSignupButtons(roster, isCreator);

          const channel = interaction.channel;
          const rosterMessage = await channel.messages.fetch(rosterId);
          await rosterMessage.edit({
            embeds: [embed],
            components: buttons
          });

          const equipment = selectedSwap.armor 
            ? `**${selectedSwap.weapon}** + **${selectedSwap.armor}**`
            : `**${selectedSwap.weapon}**`;

          await interaction.update({ 
            content: `✅ Membre modifié avec succès : **${newRole}** avec ${equipment} (swap)!`, 
            components: [] 
          });
        }
        return;
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
        const parts = interaction.customId.split('_');
        const roleType = parts[3];
        const rosterId = parts[4]; // Extraire le rosterId du customId
        // Normaliser la casse
        const roleMapping = {
          'tank': 'Tank',
          'dps': 'DPS',
          'healer': 'Healer',
          'support': 'Support',
          'scout': 'Scout'
        };
        const capitalizedRole = roleMapping[roleType.toLowerCase()] || roleType.charAt(0).toUpperCase() + roleType.slice(1);
        const customWeapon = interaction.fields.getTextInputValue('custom_weapon_name');
        const customArmor = interaction.fields.getTextInputValue('custom_armor_name') || null;

        // Vérifier que le roster existe
        const roster = rosterManager.getRoster(rosterId);
        if (!roster) {
          await interaction.reply({ content: '❌ Roster introuvable.', ephemeral: true });
          return;
        }

        // Vérifier si on est en mode édition de membre
        const isEditMode = interaction.client.tempEditUserId && 
                           interaction.client.tempEditRosterId === rosterId;

        if (isEditMode) {
          // Mode édition via modal personnalisé
          const userId = interaction.client.tempEditUserId;
          const oldRole = interaction.client.tempEditOldRole;
          const newRole = interaction.client.tempEditNewRole || capitalizedRole;

          // Pour l'instant, on va modifier directement les données
          // TODO: créer une méthode changeRole dans roster-manager
          const oldSignups = roster.signups[oldRole] || [];
          const memberIndex = oldSignups.findIndex(s => s.userId === userId);
          
          if (memberIndex === -1) {
            await interaction.reply({ 
              content: '❌ Membre introuvable', 
              ephemeral: true 
            });
            return;
          }

          // Retirer de l'ancien rôle
          const member = oldSignups[memberIndex];
          oldSignups.splice(memberIndex, 1);

          // Ajouter au nouveau rôle
          if (!roster.signups[newRole]) {
            roster.signups[newRole] = [];
          }
          roster.signups[newRole].push({
            userId: member.userId,
            username: member.username,
            weapon: customWeapon,
            armor: customArmor,
            timestamp: Date.now()
          });

          // Sauvegarder
          rosterManager.saveRosters();

          // Nettoyer les variables temporaires
          delete interaction.client.tempEditUserId;
          delete interaction.client.tempEditOldRole;
          delete interaction.client.tempEditRosterId;
          delete interaction.client.tempEditNewRole;

          // Mettre à jour le message
          const embed = generateSignupEmbed(roster);
          const isCreator = roster.creatorId === interaction.user.id;
          const buttons = generateSignupButtons(roster, isCreator);

          const channel = interaction.channel;
          const rosterMessage = await channel.messages.fetch(rosterId);
          await rosterMessage.edit({
            embeds: [embed],
            components: buttons
          });

          const equipmentText = customArmor 
            ? `**${customWeapon}** + **${customArmor}**`
            : `**${customWeapon}**`;

          await interaction.reply({ 
            content: `✅ Membre modifié avec succès : **${newRole}** avec ${equipmentText}!`, 
            ephemeral: true 
          });
        } else {
          // Mode inscription normale
          const result = rosterManager.signup(
            rosterId,
            interaction.user.id,
            interaction.user.username,
            capitalizedRole,
            customWeapon,
            interaction.guild?.id,
            customArmor
          );

          if (result.success) {
            const embed = generateSignupEmbed(roster);
            const isCreator = roster.creatorId === interaction.user.id;
            const buttons = generateSignupButtons(roster, isCreator);

            const channel = interaction.channel;
            const rosterMessage = await channel.messages.fetch(rosterId);
            await rosterMessage.edit({
              embeds: [embed],
              components: buttons
            });

            const equipmentText = customArmor 
              ? `**${customWeapon}** + **${customArmor}**`
              : `**${customWeapon}**`;

            await interaction.reply({ 
              content: `✅ Inscription réussie comme **${capitalizedRole}** avec ${equipmentText}!`, 
              ephemeral: true 
            });
          } else {
            await interaction.reply({ 
              content: `❌ ${result.error || result.message || 'Erreur'}`, 
              ephemeral: true 
            });
          }
        }
        return;
      }

      // Modal ajout de swap
      if (interaction.customId.startsWith('add_swap_modal_')) {
        const rosterId = interaction.customId.split('_').pop();
        const swapRole = interaction.fields.getTextInputValue('swap_role');
        const swapWeapon = interaction.fields.getTextInputValue('swap_weapon');
        const swapArmor = interaction.fields.getTextInputValue('swap_armor') || null;

        // Normaliser le rôle
        const roleMapping = {
          'tank': 'Tank',
          'dps': 'DPS',
          'healer': 'Healer',
          'support': 'Support',
          'scout': 'Scout'
        };
        const normalizedRole = roleMapping[swapRole.toLowerCase()] || swapRole.charAt(0).toUpperCase() + swapRole.slice(1).toLowerCase();

        const result = rosterManager.addSwap(
          rosterId,
          interaction.user.id,
          normalizedRole,
          swapWeapon,
          swapArmor
        );

        if (result.success) {
          // Proposer d'ajouter un autre swap
          const addAnotherButton = new ButtonBuilder()
            .setCustomId(`add_swap_${rosterId}`)
            .setLabel('➕ Ajouter un autre swap')
            .setStyle(ButtonStyle.Secondary)
            .setEmoji('🔄');

          const swapRow = new ActionRowBuilder().addComponents(addAnotherButton);

          const equipmentText = swapArmor 
            ? `**${normalizedRole}** avec **${swapWeapon}** + **${swapArmor}**`
            : `**${normalizedRole}** avec **${swapWeapon}**`;

          await interaction.reply({ 
            content: `✅ Swap ajouté : ${equipmentText}\n📊 Total de swaps : **${result.swapCount}**`, 
            components: [swapRow],
            ephemeral: true 
          });
        } else {
          await interaction.reply({ 
            content: `❌ ${result.error || 'Erreur lors de l\'ajout du swap'}`, 
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
            content: `❌ ${result.error || result.message || 'Erreur'}`,
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
            content: `❌ ${result.error || result.message || 'Erreur'}`,
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
