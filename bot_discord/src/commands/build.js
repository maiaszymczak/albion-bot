import { SlashCommandBuilder } from 'discord.js';
import { weapons, weaponsByTree, roleIcons } from '../data/albion-data.js';
import { generateAlternatives } from '../utils/composition-generator.js';

const roleNames = {
  tank: 'Tank',
  melee_dps: 'DPS Mêlée',
  ranged_dps: 'DPS Distance',
  healer: 'Soigneur/Support',
  support: 'Support'
};

const roleColors = {
  tank: 0x3498db,      // Bleu
  melee_dps: 0xe74c3c, // Rouge
  ranged_dps: 0x9b59b6, // Violet
  healer: 0x2ecc71,    // Vert
  support: 0xf39c12    // Orange
};

export const data = new SlashCommandBuilder()
  .setName('build')
  .setDescription('Affiche les builds disponibles par rôle')
  .addStringOption(option =>
    option.setName('role')
      .setDescription('Rôle à consulter')
      .setRequired(true)
      .addChoices(
        { name: 'Tank', value: 'tank' },
        { name: 'DPS Mêlée', value: 'melee_dps' },
        { name: 'DPS Distance', value: 'ranged_dps' },
        { name: 'Soigneur/Support', value: 'healer' }
      )
  );

export async function execute(interaction) {
  const role = interaction.options.getString('role');
  const builds = weapons[role];
  
  if (!builds) {
    await interaction.reply('❌ Rôle invalide !');
    return;
  }
  
  const roleIcon = roleIcons[role.split('_')[0].charAt(0).toUpperCase() + role.split('_')[0].slice(1)] || '⚔️';
  const buildList = builds.map(b => `${roleIcon} **${b}**`).join('\n');
  
  const embed = {
    color: roleColors[role] || 0x0099FF,
    title: `${roleIcon} Builds disponibles - ${roleNames[role]}`,
    description: buildList,
    footer: {
      text: 'Albion Online - Guide des Builds'
    },
    timestamp: new Date().toISOString()
  };
  
  await interaction.reply({ embeds: [embed] });
}
