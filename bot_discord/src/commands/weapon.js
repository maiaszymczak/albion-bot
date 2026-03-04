import { SlashCommandBuilder } from 'discord.js';
import { weaponsByTree } from '../data/albion-data.js';

export const data = new SlashCommandBuilder()
  .setName('weapon')
  .setDescription('Rechercher une arme Albion Online')
  .addStringOption(option =>
    option
      .setName('nom')
      .setDescription('Nom de l\'arme')
      .setRequired(true)
      .setAutocomplete(true)
  );

export async function execute(interaction) {
  const weaponName = interaction.options.getString('nom');
  
  // Rechercher l'arme dans la base de données
  let foundWeapon = null;
  for (const tree of Object.values(weaponsByTree)) {
    foundWeapon = tree.find(w => w.name.toLowerCase() === weaponName.toLowerCase());
    if (foundWeapon) break;
  }
  
  if (!foundWeapon) {
    await interaction.reply({
      content: `❌ Arme "${weaponName}" introuvable.`,
      ephemeral: true
    });
    return;
  }
  
  // Afficher les infos de l'arme
  const embed = {
    color: foundWeapon.color || 0x808080,
    title: `${foundWeapon.icon} ${foundWeapon.name}`,
    fields: [
      {
        name: '📋 Rôle',
        value: foundWeapon.role,
        inline: true
      },
      {
        name: '🎯 Tier',
        value: foundWeapon.tier,
        inline: true
      },
      {
        name: '✋ Mains',
        value: foundWeapon.hands === 1 ? '1 Main' : '2 Mains',
        inline: true
      }
    ]
  };
  
  await interaction.reply({ embeds: [embed], ephemeral: true });
}

export async function autocomplete(interaction) {
  const focusedValue = interaction.options.getFocused().toLowerCase();
  
  // Collecter toutes les armes
  const allWeapons = [];
  for (const tree of Object.values(weaponsByTree)) {
    allWeapons.push(...tree);
  }
  
  // Filtrer par le texte saisi
  const filtered = allWeapons
    .filter(weapon => weapon.name.toLowerCase().includes(focusedValue))
    .slice(0, 25) // Discord limite à 25 options
    .map(weapon => ({
      name: `${weapon.icon} ${weapon.name} (${weapon.tier})`,
      value: weapon.name
    }));
  
  await interaction.respond(filtered);
}
