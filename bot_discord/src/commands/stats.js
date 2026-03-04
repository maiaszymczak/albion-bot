import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { persistence } from '../utils/persistence.js';

export const data = new SlashCommandBuilder()
  .setName('stats')
  .setDescription('Affiche vos statistiques ou le classement du serveur')
  .addSubcommand(subcommand =>
    subcommand
      .setName('me')
      .setDescription('Voir vos statistiques personnelles')
  )
  .addSubcommand(subcommand =>
    subcommand
      .setName('user')
      .setDescription('Voir les stats d\'un autre utilisateur')
      .addUserOption(option =>
        option
          .setName('utilisateur')
          .setDescription('L\'utilisateur à consulter')
          .setRequired(true)
      )
  )
  .addSubcommand(subcommand =>
    subcommand
      .setName('leaderboard')
      .setDescription('Classement du serveur')
      .addStringOption(option =>
        option
          .setName('type')
          .setDescription('Type de classement')
          .setRequired(false)
          .addChoices(
            { name: 'Participations', value: 'participations' },
            { name: 'Tank MVP', value: 'Tank' },
            { name: 'DPS MVP', value: 'DPS' },
            { name: 'Healer MVP', value: 'Healer' }
          )
      )
  );

export async function execute(interaction) {
  const subcommand = interaction.options.getSubcommand();
  const stats = await persistence.loadStats();

  if (subcommand === 'me') {
    const userId = interaction.user.id;
    const userStats = stats.users[userId];

    if (!userStats) {
      await interaction.reply({
        content: '📊 Vous n\'avez pas encore participé à d\'événements !',
        ephemeral: true
      });
      return;
    }

    const embed = new EmbedBuilder()
      .setColor(0x3498db)
      .setTitle(`📊 Statistiques de ${interaction.user.username}`)
      .setThumbnail(interaction.user.displayAvatarURL())
      .addFields(
        { name: '🎯 Participations totales', value: `${userStats.participations}`, inline: true },
        { name: '📅 Dernière activité', value: `<t:${Math.floor(new Date(userStats.lastSeen).getTime() / 1000)}:R>`, inline: true }
      )
      .setTimestamp();

    // Rôles joués
    if (userStats.roles && Object.keys(userStats.roles).length > 0) {
      const rolesText = Object.entries(userStats.roles)
        .sort((a, b) => b[1] - a[1])
        .map(([role, count]) => `${getRoleIcon(role)} **${role}**: ${count}x`)
        .join('\n');
      embed.addFields({ name: '🎭 Rôles joués', value: rolesText, inline: false });

      // Rôle favori
      const favoriteRole = Object.entries(userStats.roles)
        .sort((a, b) => b[1] - a[1])[0];
      embed.addFields({ 
        name: '⭐ Rôle favori', 
        value: `${getRoleIcon(favoriteRole[0])} ${favoriteRole[0]} (${favoriteRole[1]}x)`, 
        inline: true 
      });
    }

    await interaction.reply({ embeds: [embed], ephemeral: true });
  }

  if (subcommand === 'user') {
    const targetUser = interaction.options.getUser('utilisateur');
    const userStats = stats.users[targetUser.id];

    if (!userStats) {
      await interaction.reply({
        content: `📊 ${targetUser.username} n'a pas encore participé à d'événements !`,
        ephemeral: true
      });
      return;
    }

    const embed = new EmbedBuilder()
      .setColor(0x3498db)
      .setTitle(`📊 Statistiques de ${targetUser.username}`)
      .setThumbnail(targetUser.displayAvatarURL())
      .addFields(
        { name: '🎯 Participations totales', value: `${userStats.participations}`, inline: true },
        { name: '📅 Dernière activité', value: `<t:${Math.floor(new Date(userStats.lastSeen).getTime() / 1000)}:R>`, inline: true }
      );

    if (userStats.roles && Object.keys(userStats.roles).length > 0) {
      const rolesText = Object.entries(userStats.roles)
        .sort((a, b) => b[1] - a[1])
        .map(([role, count]) => `${getRoleIcon(role)} **${role}**: ${count}x`)
        .join('\n');
      embed.addFields({ name: '🎭 Rôles joués', value: rolesText, inline: false });
    }

    await interaction.reply({ embeds: [embed] });
  }

  if (subcommand === 'leaderboard') {
    const type = interaction.options.getString('type') || 'participations';
    
    let sortedUsers;
    if (type === 'participations') {
      sortedUsers = Object.entries(stats.users)
        .sort((a, b) => b[1].participations - a[1].participations)
        .slice(0, 10);
    } else {
      // Classement par rôle spécifique
      sortedUsers = Object.entries(stats.users)
        .filter(([_, data]) => data.roles && data.roles[type])
        .sort((a, b) => (b[1].roles[type] || 0) - (a[1].roles[type] || 0))
        .slice(0, 10);
    }

    if (sortedUsers.length === 0) {
      await interaction.reply({
        content: '📊 Pas encore de données pour ce classement !',
        ephemeral: true
      });
      return;
    }

    const embed = new EmbedBuilder()
      .setColor(0xf39c12)
      .setTitle(`🏆 Classement - ${type === 'participations' ? 'Participations' : type + ' MVP'}`)
      .setDescription(
        sortedUsers.map(([userId, data], index) => {
          const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`;
          const value = type === 'participations' ? data.participations : (data.roles[type] || 0);
          return `${medal} <@${userId}> - **${value}** ${type === 'participations' ? 'participations' : 'fois'}`;
        }).join('\n')
      )
      .setFooter({ text: `Serveur: ${interaction.guild.name}` })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
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
