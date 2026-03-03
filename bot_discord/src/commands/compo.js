import { SlashCommandBuilder } from 'discord.js';
import { compositions } from '../data/albion-data.js';
import { generateComposition, generateCustomComposition, formatCompositionEmbed } from '../utils/composition-generator.js';

export const data = new SlashCommandBuilder()
  .setName('compo')
  .setDescription('Génère une composition d\'équipe pour Albion Online')
  .addStringOption(option =>
    option.setName('type')
      .setDescription('Type de composition')
      .setRequired(true)
      .addChoices(
        { name: 'PvP 5v5', value: 'pvp_5v5' },
        { name: 'Donjon Statique (5 joueurs)', value: 'dungeon_static' },
        { name: 'Raid Avalonian', value: 'avalonian_raid' },
        { name: 'CLAP PvP (8 joueurs)', value: 'clap_pvp' },
        { name: 'Brawl PvP (10 joueurs)', value: 'brawl_pvp' },
        { name: 'ZvZ (20 joueurs)', value: 'zvz' },
        { name: 'Donjon Corrompu (Solo)', value: 'corrupted_dungeon' },
        { name: 'Personnalisé', value: 'custom' }
      )
  )
  .addIntegerOption(option =>
    option.setName('nombre')
      .setDescription('Nombre de joueurs (pour Raid Avalonian ou Personnalisé)')
      .setMinValue(1)
      .setMaxValue(50)
      .setRequired(false)
  )
  .addStringOption(option =>
    option.setName('style')
      .setDescription('Style de composition (pour Personnalisé uniquement)')
      .setRequired(false)
      .addChoices(
        { name: 'Équilibrée (par défaut)', value: 'balanced' },
        { name: 'Style CLAP (focus tank/support)', value: 'clap' },
        { name: 'Style Brawl (focus DPS/finish)', value: 'brawl' }
      )
  );

export async function execute(interaction) {
  const compType = interaction.options.getString('type');
  const customSize = interaction.options.getInteger('nombre');
  const style = interaction.options.getString('style') || 'balanced';
  
  // Composition personnalisée avec nombre ET style
  if (compType === 'custom') {
    if (!customSize) {
      await interaction.reply('❌ Vous devez spécifier le nombre de joueurs pour une composition personnalisée !');
      return;
    }
    
    const composition = generateCustomComposition(customSize, style);
    const styleNames = {
      balanced: 'Équilibrée',
      clap: 'Style CLAP',
      brawl: 'Style Brawl'
    };
    const customTemplate = {
      name: `Composition Personnalisée ${styleNames[style]} (${customSize} joueurs)`,
      size: customSize
    };
    const embed = formatCompositionEmbed(customTemplate, composition);
    await interaction.reply({ embeds: [embed] });
    return;
  }
  
  // Raid Avalonian avec nombre personnalisé (toujours équilibré car PvE)
  if (compType === 'avalonian_raid') {
    if (!customSize) {
      await interaction.reply('❌ Vous devez spécifier le nombre de joueurs pour un raid Avalonian !');
      return;
    }
    
    const composition = generateCustomComposition(customSize, 'balanced');
    const customTemplate = {
      name: `Raid Avalonian (${customSize} joueurs)`,
      size: customSize
    };
    const embed = formatCompositionEmbed(customTemplate, composition);
    await interaction.reply({ embeds: [embed] });
    return;
  }
  
  const template = compositions[compType];
  
  if (!template) {
    await interaction.reply('❌ Type de composition invalide !');
    return;
  }
  
  // Si c'est une composition preset (avec builds prédéfinis)
  if (template.preset) {
    const embed = formatCompositionEmbed(template, template.preset);
    await interaction.reply({ embeds: [embed] });
    return;
  }
  
  // Sinon génération aléatoire
  const composition = generateComposition(template.template);
  const embed = formatCompositionEmbed(template, composition);
  
  await interaction.reply({ embeds: [embed] });
}
