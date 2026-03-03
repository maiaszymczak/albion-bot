import { SlashCommandBuilder } from 'discord.js';
import { weapons } from '../data/albion-data.js';
import { generateAlternatives } from '../utils/composition-generator.js';

const roleNames = {
  tank: 'Tank',
  melee_dps: 'DPS Mêlée',
  ranged_dps: 'DPS Distance',
  healer: 'Soigneur/Support'
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
  
  const buildList = builds.map(b => `• **${b.name}** - ${b.role}`).join('\n');
  
  const embed = {
    color: 0x0099FF,
    title: `🛡️ Builds disponibles - ${roleNames[role]}`,
    description: buildList,
    footer: {
      text: 'Albion Online - Guide des Builds'
    },
    timestamp: new Date().toISOString()
  };
  
  await interaction.reply({ embeds: [embed] });
}
