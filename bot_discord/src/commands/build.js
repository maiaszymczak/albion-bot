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
  
  // Récupérer les armes depuis weaponsByTree
  const allWeapons = [];
  for (const tree of Object.values(weaponsByTree)) {
    for (const weapon of tree) {
      const weaponRole = weapon.role.toLowerCase();
      
      // Filtrer par rôle
      if (role === 'tank' && (weaponRole.includes('tank') || weaponRole.includes('frontline'))) {
        allWeapons.push(weapon);
      } else if (role === 'melee_dps' && weaponRole.includes('dps') && 
                 !weaponRole.includes('tank') && !weaponRole.includes('heal') && !weaponRole.includes('ranged')) {
        allWeapons.push(weapon);
      } else if (role === 'ranged_dps' && 
                 (weaponRole.includes('ranged') || weaponRole.includes('mage') || weaponRole.includes('aoe') || weaponRole.includes('burst')) &&
                 !weaponRole.includes('tank') && !weaponRole.includes('heal')) {
        allWeapons.push(weapon);
      } else if (role === 'healer' && weaponRole.includes('heal') && !weaponRole.includes('tank')) {
        allWeapons.push(weapon);
      }
    }
  }
  
  if (allWeapons.length === 0) {
    await interaction.reply('❌ Aucune arme trouvée pour ce rôle !');
    return;
  }
  
  // Équipement recommandé par rôle
  let gearSuggestion = '';
  if (role === 'tank') {
    gearSuggestion = '🎽 **Équipement Tank** : Casque Judicateur/Gardien + Armure Gardien/Royale + Bottes Soldat + Soupe/Omelette T7';
  } else if (role === 'healer') {
    gearSuggestion = '🎽 **Équipement Healer** : Capuche Mage/Druide + Robe Mage/Druide + Sandales Mage + Omelette T7';
  } else if (role === 'melee_dps') {
    gearSuggestion = '🎽 **Équipement Melee DPS** : Casque Soldat/Assassin + Armure Chasseur/Assassin + Bottes Soldat + Ragout T8';
  } else if (role === 'ranged_dps') {
    gearSuggestion = '🎽 **Équipement Ranged DPS** : Capuche Traqueur/Assassin + Robe Druide/Veste Assassin + Sandales Royales + Ragout T8';
  }
  
  const roleIcon = roleIcons.Tank || '⚔️';
  const buildList = allWeapons
    .slice(0, 25) // Limite Discord : 25 fields max
    .map(w => `${w.icon || roleIcon} **${w.name}** (${w.tier}) - ${w.role}`)
    .join('\n');
  
  const embed = {
    color: roleColors[role] || 0x0099FF,
    title: `${roleIcon} Builds disponibles - ${roleNames[role]}`,
    description: buildList + '\n\n' + gearSuggestion,
    footer: {
      text: `Albion Online - ${allWeapons.length} arme(s) disponible(s)`
    },
    timestamp: new Date().toISOString()
  };
  
  await interaction.reply({ embeds: [embed] });
}
