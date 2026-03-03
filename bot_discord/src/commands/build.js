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
  
  // Équipement recommandé par arme spécifique
  const getWeaponGear = (weapon) => {
    const weaponName = weapon.name.toLowerCase();
    const weaponRole = weapon.role.toLowerCase();
    
    // Tanks spécifiques
    if (weaponName.includes('masse incube') || weaponName.includes('marteaux forgés')) {
      return 'Mandebrume + Capuche Assassin + Armure Gardien + Sandales Culte + Bridgewatch + Omelette T7';
    } else if (weaponName.includes('garde-serments') || weaponName.includes('marteau')) {
      return 'Tourmenteur + Judicateur + Armure Royale + Bottes Royales + Fort Sterling + Omelette T8';
    } else if (weaponRole.includes('tank')) {
      return 'Casque Gardien + Armure Gardien + Bottes Soldat + Cape + Soupe T7';
    }
    
    // Healers spécifiques
    else if (weaponName.includes('sacré') || weaponName.includes('divin')) {
      return 'Capuche Mage + Robe Mage + Sandales Mage + Cape Lymhurst + Omelette T7';
    } else if (weaponName.includes('nature') || weaponName.includes('druidique')) {
      return 'Capuche Druide + Robe Druide + Sandales Druide + Cape Lymhurst + Omelette T7';
    } else if (weaponName.includes('déchu') || weaponName.includes('fléau')) {
      return 'Capuchon Druide + Robe Royale + Chaussures Cuir + Cape Lymhurst + Omelette T7';
    } else if (weaponRole.includes('heal')) {
      return 'Capuche Mage + Robe Mage + Sandales Mage + Cape + Omelette T7';
    }
    
    // DPS Mêlée assassins
    else if (weaponName.includes('saigneur') || weaponName.includes('dague') || weaponName.includes('griffes')) {
      return 'Capuche Assassin + Veste Assassin + Chaussures Soldat + Cape Martlock + Pâté Anguille T8';
    }
    // DPS Mêlée burst
    else if (weaponName.includes('claymore') || weaponName.includes('adoube-roi') || weaponName.includes('galatine')) {
      return 'Casque Soldat + Armure Chasseur + Bottes Soldat + Cape Martlock + Ragout T8';
    }
    // DPS Mêlée sustain
    else if (weaponName.includes('pattes') || weaponName.includes('hallebarde') || weaponName.includes('faux')) {
      return 'Casque Chasseur + Armure Chasseur + Bottes Chasseur + Cape + Ragout T8';
    }
    // DPS Mêlée lance/glaive
    else if (weaponName.includes('lance') || weaponName.includes('glaive') || weaponName.includes('trinité')) {
      return 'Casque Soldat + Armure Mercenaire + Bottes Soldat + Cape + Ragout T8';
    }
    // DPS Mêlée générique
    else if (weaponRole.includes('dps') && !weaponRole.includes('ranged')) {
      return 'Casque Soldat + Armure Chasseur + Bottes Soldat + Cape + Ragout T8';
    }
    
    // DPS Distance mage burst
    else if (weaponName.includes('ardent') || weaponName.includes('feu') || weaponName.includes('infernal')) {
      return 'Capuche Assassin + Robe Druide + Sandales Royales + Cape Caerleon + Ragout T8';
    }
    // DPS Distance mage kite
    else if (weaponName.includes('glacial') || weaponName.includes('givre') || weaponName.includes('arctique')) {
      return 'Capuche Mage + Robe Mage + Sandales Mage + Cape Caerleon + Ragout T8';
    }
    // DPS Distance cursed
    else if (weaponName.includes('maudit') || weaponName.includes('ombre') || weaponName.includes('démoniaque')) {
      return 'Capuche Traqueur + Robe Druide + Sandales Royales + Cape Caerleon + Ragout Anguille T8';
    }
    // DPS Distance archer
    else if (weaponName.includes('arc') || weaponName.includes('bow')) {
      return 'Capuche Traqueur + Veste Assassin + Bottes Soldat + Cape Martlock + Ragout T8';
    }
    // DPS Distance arbalète
    else if (weaponName.includes('arbalète') || weaponName.includes('carreaux')) {
      return 'Capuche Chasseur + Veste Chasseur + Bottes Chasseur + Cape + Ragout T8';
    }
    // DPS Distance générique
    else if (weaponRole.includes('ranged') || weaponRole.includes('mage')) {
      return 'Capuche Traqueur + Robe Druide + Sandales Royales + Cape + Ragout T8';
    }
    
    // Support
    else if (weaponRole.includes('support')) {
      return 'Capuche Assassin + Veste Royale + Chaussures Cuir + Cape Bridgewatch + Omelette T7';
    }
    
    // Scout
    else if (weaponRole.includes('scout')) {
      return 'Casque Judicateur + Armure Crépusculaire + Bottes Pêcheur + Cape Fort Sterling + Tourte T7';
    }
    
    // Défaut
    return 'Équipement adapté au rôle + Cape + Nourriture T7-T8';
  };
  
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
      value: `📋 ${w.role}\n🎽 ${getWeaponGear(w)}`,
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
