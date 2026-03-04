import { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import { rosterManager } from '../utils/roster-manager.js';

export const data = new SlashCommandBuilder()
  .setName('roster')
  .setDescription('Gestion des rosters')
  .addSubcommand(subcommand =>
    subcommand
      .setName('list')
      .setDescription('Liste tous les rosters actifs du serveur')
  )
  .addSubcommand(subcommand =>
    subcommand
      .setName('history')
      .setDescription('Historique des événements passés')
  )
  .addSubcommand(subcommand =>
    subcommand
      .setName('clone')
      .setDescription('Cloner un roster existant')
      .addStringOption(option =>
        option
          .setName('message_id')
          .setDescription('ID du message du roster à cloner')
          .setRequired(true)
      )
  );

export async function execute(interaction) {
  const subcommand = interaction.options.getSubcommand();

  if (subcommand === 'list') {
    const allRosters = rosterManager.getAllRosters();
    const activeRosters = allRosters.filter(r => r.status !== 'completed');

    if (activeRosters.length === 0) {
      await interaction.reply({
        content: '📋 Aucun roster actif pour le moment.',
        ephemeral: true
      });
      return;
    }

    const embed = new EmbedBuilder()
      .setColor(0x2ecc71)
      .setTitle('📋 Rosters actifs')
      .setDescription(`${activeRosters.length} roster(s) en cours`)
      .setTimestamp();

    for (const roster of activeRosters.slice(0, 10)) {
      const totalSignups = Object.values(roster.signups).reduce((sum, arr) => sum + arr.length, 0);
      const totalQuota = Object.values(roster.quotas).reduce((sum, q) => sum + q, 0);
      const statusEmoji = roster.status === 'open' ? '🟢' : roster.status === 'full' ? '🟡' : '🔴';
      
      const createdTime = Math.floor(roster.createdAt.getTime() / 1000);
      let fieldValue = `${statusEmoji} **Status:** ${roster.status}\n👥 **Inscrits:** ${totalSignups}/${totalQuota}\n📅 **Créé:** <t:${createdTime}:R>`;
      
      if (roster.scheduledDate) {
        const scheduledTime = Math.floor(roster.scheduledDate.getTime() / 1000);
        fieldValue += `\n⏰ **Prévu pour:** <t:${scheduledTime}:F>`;
      }

      embed.addFields({
        name: roster.composition.name || 'Composition',
        value: fieldValue,
        inline: false
      });
    }

    await interaction.reply({ embeds: [embed] });
  }

  if (subcommand === 'history') {
    const allRosters = rosterManager.getAllRosters();
    const completedRosters = allRosters
      .filter(r => r.status === 'completed')
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, 10);

    if (completedRosters.length === 0) {
      await interaction.reply({
        content: '📜 Aucun événement terminé pour le moment.',
        ephemeral: true
      });
      return;
    }

    const embed = new EmbedBuilder()
      .setColor(0x95a5a6)
      .setTitle('📜 Historique des événements')
      .setDescription(`${completedRosters.length} événement(s) terminé(s)`)
      .setTimestamp();

    for (const roster of completedRosters) {
      const totalSignups = Object.values(roster.signups).reduce((sum, arr) => sum + arr.length, 0);
      const createdTime = Math.floor(roster.createdAt.getTime() / 1000);
      
      let fieldValue = `👥 **Participants:** ${totalSignups}\n📅 **Date:** <t:${createdTime}:F>`;
      
      if (roster.feedback && roster.feedback.length > 0) {
        const avgRating = roster.feedback.reduce((sum, f) => sum + f.rating, 0) / roster.feedback.length;
        fieldValue += `\n⭐ **Note moyenne:** ${avgRating.toFixed(1)}/5 (${roster.feedback.length} avis)`;
      }

      embed.addFields({
        name: roster.composition.name || 'Composition',
        value: fieldValue,
        inline: false
      });
    }

    await interaction.reply({ embeds: [embed] });
  }

  if (subcommand === 'clone') {
    const messageId = interaction.options.getString('message_id');
    const sourceRoster = rosterManager.getRoster(messageId);

    if (!sourceRoster) {
      await interaction.reply({
        content: '❌ Roster introuvable. Vérifiez l\'ID du message.',
        ephemeral: true
      });
      return;
    }

    // Créer l'embed de la composition clonée
    const embed = new EmbedBuilder()
      .setColor(0x3498db)
      .setTitle(`📋 ${sourceRoster.composition.name || 'Composition'} (Clonée)`)
      .setDescription('Cliquez sur "Ouvrir les inscriptions" pour créer un nouveau roster basé sur cette composition.')
      .setFooter({ text: `Clonée depuis ${messageId}` })
      .setTimestamp();

    // Afficher la structure
    const quotasText = Object.entries(sourceRoster.quotas)
      .filter(([_, quota]) => quota > 0)
      .map(([role, quota]) => `${getRoleIcon(role)} **${role}**: ${quota}`)
      .join('\n');
    
    embed.addFields({ name: 'Structure', value: quotasText || 'Aucune', inline: false });

    const signupButton = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('open_signup')
          .setLabel('📋 Ouvrir les inscriptions')
          .setStyle(ButtonStyle.Success)
      );

    await interaction.reply({ embeds: [embed], components: [signupButton] });
  }
}

function getRoleIcon(role) {
  const icons = {
    'Tank': '🛡️',
    'DPS': '⚔️',
    'Healer': '💚',
    'Support': '🌟',
    'Scout': '👁️'
  };
  return icons[role] || '⚔️';
}
