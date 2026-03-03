import { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
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
    gearSuggestion = 'Casque Judicateur/Gardien + Armure Gardien/Royale + Bottes Soldat + Soupe/Omelette T7';
  } else if (role === 'healer') {
    gearSuggestion = 'Capuche Mage/Druide + Robe Mage/Druide + Sandales Mage + Omelette T7';
  } else if (role === 'melee_dps') {
    gearSuggestion = 'Casque Soldat/Assassin + Armure Chasseur/Assassin + Bottes Soldat + Ragout T8';
  } else if (role === 'ranged_dps') {
    gearSuggestion = 'Capuche Traqueur/Assassin + Robe Druide/Veste Assassin + Sandales Royales + Ragout T8';
  }
  
  const roleIcon = roleIcons.Tank || '⚔️';
  
  // Pagination : 10 armes par page
  const itemsPerPage = 10;
  const totalPages = Math.ceil(allWeapons.length / itemsPerPage);
  let currentPage = 0;
  
  const generateEmbed = (page) => {
    const start = page * itemsPerPage;
    const end = start + itemsPerPage;
    const pageWeapons = allWeapons.slice(start, end);
    
    const fields = pageWeapons.map(w => ({
      name: `${w.icon || roleIcon} ${w.name} (${w.tier})`,
      value: `📋 ${w.role}\n🎽 ${gearSuggestion}`,
      inline: false
    }));
    
    return {
      color: roleColors[role] || 0x0099FF,
      title: `${roleIcon} Builds disponibles - ${roleNames[role]}`,
      description: `${allWeapons.length} arme(s) disponible(s) • Page ${page + 1}/${totalPages}`,
      fields: fields,
      footer: {
        text: 'Albion Online - Guide des Builds'
      },
      timestamp: new Date().toISOString()
    };
  };
  
  const generateButtons = (page) => {
    const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('previous')
          .setLabel('◀️ Précédent')
          .setStyle(ButtonStyle.Primary)
          .setDisabled(page === 0),
        new ButtonBuilder()
          .setCustomId('next')
          .setLabel('Suivant ▶️')
          .setStyle(ButtonStyle.Primary)
          .setDisabled(page === totalPages - 1)
      );
    return row;
  };
  
  const embed = generateEmbed(currentPage);
  const buttons = totalPages > 1 ? generateButtons(currentPage) : null;
  
  const response = await interaction.reply({ 
    embeds: [embed], 
    components: buttons ? [buttons] : [],
    fetchReply: true
  });
  
  // Si une seule page, pas besoin d'écouter les boutons
  if (totalPages <= 1) return;
  
  // Collecteur de boutons (60 secondes)
  const collector = response.createMessageComponentCollector({ time: 60000 });
  
  collector.on('collect', async i => {
    if (i.customId === 'previous') {
      currentPage--;
    } else if (i.customId === 'next') {
      currentPage++;
    }
    
    await i.update({
      embeds: [generateEmbed(currentPage)],
      components: [generateButtons(currentPage)]
    });
  });
  
  collector.on('end', () => {
    // Désactiver les boutons après expiration
    interaction.editReply({ components: [] }).catch(() => {});
  });
}
