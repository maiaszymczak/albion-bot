import { SlashCommandBuilder } from 'discord.js';
import { armor } from '../data/albion-data.js';

export const data = new SlashCommandBuilder()
  .setName('armor')
  .setDescription('Rechercher une armure Albion Online')
  .addStringOption(option =>
    option
      .setName('piece')
      .setDescription('Type de pièce d\'armure')
      .setRequired(true)
      .setChoices(
        { name: '🪖 Casque', value: 'helmets' },
        { name: '🛡️ Armure', value: 'chestpieces' },
        { name: '👢 Bottes', value: 'boots' }
      )
  )
  .addStringOption(option =>
    option
      .setName('nom')
      .setDescription('Nom de l\'armure')
      .setRequired(true)
      .setAutocomplete(true)
  );

export async function execute(interaction) {
  const piece = interaction.options.getString('piece');
  const armorName = interaction.options.getString('nom');
  
  // Rechercher dans quelle catégorie se trouve l'armure
  let foundCategory = null;
  let armorType = null;
  
  if (armor[piece]) {
    for (const [category, items] of Object.entries(armor[piece])) {
      if (items.includes(armorName)) {
        foundCategory = category;
        armorType = piece;
        break;
      }
    }
  }
  
  if (!foundCategory) {
    await interaction.reply({
      content: `❌ Armure "${armorName}" introuvable.`,
      ephemeral: true
    });
    return;
  }
  
  // Traduire les types
  const typeTranslations = {
    'helmets': '🪖 Casque',
    'chestpieces': '🛡️ Armure',
    'boots': '👢 Bottes'
  };
  
  const categoryTranslations = {
    'tank': '🛡️ Tank',
    'dps': '⚔️ DPS',
    'healer': '💚 Healer',
    'hybrid': '✨ Hybride',
    'mobility': '👟 Mobilité'
  };
  
  // Afficher les infos
  const embed = {
    color: 0x5865F2,
    title: armorName,
    fields: [
      {
        name: '📋 Type',
        value: typeTranslations[armorType] || armorType,
        inline: true
      },
      {
        name: '🎯 Catégorie',
        value: categoryTranslations[foundCategory] || foundCategory,
        inline: true
      }
    ]
  };
  
  // Ajouter d'autres armures de la même catégorie
  const sameCategory = armor[piece][foundCategory].filter(a => a !== armorName);
  if (sameCategory.length > 0) {
    embed.fields.push({
      name: '🔗 Alternatives',
      value: sameCategory.slice(0, 5).join(', '),
      inline: false
    });
  }
  
  await interaction.reply({ embeds: [embed], ephemeral: true });
}

export async function autocomplete(interaction) {
  const piece = interaction.options.getString('piece');
  const focusedValue = interaction.options.getFocused().toLowerCase();
  
  if (!piece || !armor[piece]) {
    await interaction.respond([]);
    return;
  }
  
  // Collecter toutes les armures du type sélectionné
  const allArmors = [];
  for (const [category, items] of Object.entries(armor[piece])) {
    for (const item of items) {
      allArmors.push({ name: item, category });
    }
  }
  
  // Filtrer par le texte saisi
  const filtered = allArmors
    .filter(armor => armor.name.toLowerCase().includes(focusedValue))
    .slice(0, 25) // Discord limite à 25 options
    .map(armor => ({
      name: `${armor.name} (${armor.category})`,
      value: armor.name
    }));
  
  await interaction.respond(filtered);
}
