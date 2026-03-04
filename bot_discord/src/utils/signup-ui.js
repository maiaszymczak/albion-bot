import { ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder } from 'discord.js';
import { rosterManager } from './roster-manager.js';
import { weaponsByTree, roleIcons } from '../data/albion-data.js';

/**
 * Génère l'embed d'inscription
 */
export function generateSignupEmbed(roster) {
  const fields = [];
  
  for (const [roleType, quota] of Object.entries(roster.quotas)) {
    if (quota === 0) continue;
    
    const signups = roster.signups[roleType] || [];
    const count = signups.length;
    const icon = roleIcons[roleType] || '⚔️';
    
    // Barre de progression visuelle
    const progressBar = generateProgressBar(count, quota);
    
    let value = `${progressBar}\n`;
    if (signups.length > 0) {
      value += signups.map(s => {
        let equipment = s.weapon;
        if (s.armor) {
          equipment += ` + ${s.armor}`;
        }
        return `• ${s.username} - ${equipment}`;
      }).join('\n');
    } else {
      value += '_(Aucune inscription)_';
    }
    
    fields.push({
      name: `${icon} ${roleType} (${count}/${quota})`,
      value,
      inline: false
    });
  }
  
  // Afficher la liste d'attente si elle existe
  if (roster.waitlist && roster.waitlist.length > 0) {
    const waitlistText = roster.waitlist.slice(0, 5)
      .map((w, i) => {
        let equipment = w.weapon;
        if (w.armor) {
          equipment += ` + ${w.armor}`;
        }
        return `${i + 1}. ${w.username} - ${getRoleIcon(w.role)} ${w.role} - ${equipment}`;
      })
      .join('\n');
    
    fields.push({
      name: `⏳ Liste d'attente (${roster.waitlist.length})`,
      value: waitlistText + (roster.waitlist.length > 5 ? `\n_... et ${roster.waitlist.length - 5} autre(s)_` : ''),
      inline: false
    });
  }
  
  const totalSignups = Object.values(roster.signups).reduce((sum, arr) => sum + arr.length, 0);
  const totalQuota = Object.values(roster.quotas).reduce((sum, q) => sum + q, 0);
  
  let statusEmoji = '🟢';
  let statusText = 'Ouvert';
  let color = 0x2ecc71; // Vert
  
  if (roster.status === 'closed') {
    statusEmoji = '🔴';
    statusText = 'Fermé';
    color = 0xe74c3c; // Rouge
  } else if (roster.status === 'full') {
    statusEmoji = '🟡';
    statusText = 'Complet';
    color = 0xf39c12; // Orange
  } else if (roster.status === 'completed') {
    statusEmoji = '✅';
    statusText = 'Terminé';
    color = 0x95a5a6; // Gris
  }
  
  let description = `${statusEmoji} **Status:** ${statusText}\n👥 **Inscrits:** ${totalSignups}/${totalQuota}`;
  
  // Ajouter la date prévue si elle existe
  if (roster.scheduledDate) {
    const timestamp = Math.floor(roster.scheduledDate.getTime() / 1000);
    description += `\n⏰ **Prévu pour:** <t:${timestamp}:F> (<t:${timestamp}:R>)`;
  }
  
  // Afficher feedback si terminé
  if (roster.status === 'completed' && roster.feedback && roster.feedback.length > 0) {
    const avgRating = roster.feedback.reduce((sum, f) => sum + f.rating, 0) / roster.feedback.length;
    description += `\n⭐ **Note moyenne:** ${avgRating.toFixed(1)}/5 (${roster.feedback.length} avis)`;
  }
  
  return {
    color,
    title: `📋 Inscriptions - ${roster.composition.name || 'Composition'}`,
    description,
    fields,
    footer: {
      text: roster.status === 'completed' ? 'Événement terminé' : 'Cliquez sur un bouton pour vous inscrire'
    },
    timestamp: new Date().toISOString()
  };
}

/**
 * Génère une barre de progression visuelle
 */
function generateProgressBar(current, max) {
  const percentage = Math.min(current / max, 1);
  const filled = Math.round(percentage * 10);
  const empty = 10 - filled;
  
  return '🟩'.repeat(filled) + '⬜'.repeat(empty) + ` ${current}/${max}`;
}

/**
 * Récupère l'icône d'un rôle
 */
function getRoleIcon(role) {
  return roleIcons[role] || '⚔️';
}

/**
 * Génère les boutons d'inscription
 */
export function generateSignupButtons(roster, isCreator = false) {
  const buttons = [];
  
  for (const [roleType, quota] of Object.entries(roster.quotas)) {
    if (quota === 0) continue;
    
    const signups = roster.signups[roleType] || [];
    const icon = roleIcons[roleType] || '⚔️';
    const disabled = signups.length >= quota || roster.status === 'closed';
    
    buttons.push(
      new ButtonBuilder()
        .setCustomId(`signup_${roleType.toLowerCase()}`)
        .setLabel(`${icon} ${roleType}`)
        .setStyle(disabled ? ButtonStyle.Secondary : ButtonStyle.Primary)
        .setDisabled(disabled)
    );
  }
  
  buttons.push(
    new ButtonBuilder()
      .setCustomId('signout')
      .setLabel('❌ Se désinscrire')
      .setStyle(ButtonStyle.Danger)
  );
  
  // Boutons admin (uniquement pour le créateur)
  if (isCreator) {
    buttons.push(
      new ButtonBuilder()
        .setCustomId('edit_roster')
        .setLabel('✏️ Modifier')
        .setStyle(ButtonStyle.Secondary)
    );
    
    // Bouton pour marquer comme terminé
    if (roster.status !== 'completed') {
      buttons.push(
        new ButtonBuilder()
          .setCustomId('complete_roster')
          .setLabel('✅ Marquer terminé')
          .setStyle(ButtonStyle.Success)
      );
    }
  }
  
  // Bouton feedback (si terminé)
  if (roster.status === 'completed') {
    buttons.push(
      new ButtonBuilder()
        .setCustomId('add_feedback')
        .setLabel('⭐ Donner mon avis')
        .setStyle(ButtonStyle.Primary)
    );
  }
  
  // Bouton aide
  buttons.push(
    new ButtonBuilder()
      .setCustomId('roster_help')
      .setLabel('❓')
      .setStyle(ButtonStyle.Secondary)
  );
  
  buttons.push(
    new ButtonBuilder()
      .setCustomId('close_signup')
      .setLabel('🔒 Fermer')
      .setStyle(ButtonStyle.Secondary)
  );
  
  // Discord limite à 5 boutons par row, donc on fait 2 rows si nécessaire
  const rows = [];
  for (let i = 0; i < buttons.length; i += 5) {
    const row = new ActionRowBuilder()
      .addComponents(buttons.slice(i, i + 5));
    rows.push(row);
  }
  
  return rows;
}

/**
 * Génère le menu de sélection d'armes
 */
export function generateWeaponMenu(roleType, rosterId = '') {
  const weapons = [];
  
  // Filtrer les armes par rôle
  for (const tree of Object.values(weaponsByTree)) {
    for (const weapon of tree) {
      const weaponRole = weapon.role.toLowerCase();
      
      if (roleType === 'Tank' && (weaponRole.includes('tank') || weaponRole.includes('frontline'))) {
        weapons.push(weapon);
      } else if (roleType === 'DPS' && weaponRole.includes('dps') && 
                 !weaponRole.includes('tank') && !weaponRole.includes('heal')) {
        weapons.push(weapon);
      } else if (roleType === 'Healer' && weaponRole.includes('heal') && !weaponRole.includes('tank')) {
        weapons.push(weapon);
      } else if (roleType === 'Support' && weaponRole.includes('support')) {
        weapons.push(weapon);
      } else if (roleType === 'Scout' && weaponRole.includes('scout')) {
        weapons.push(weapon);
      }
    }
  }
  
  // Limiter à 24 options (on garde 1 place pour "Autre")
  const options = weapons.slice(0, 24).map(w => ({
    label: `${w.name} (${w.tier})`,
    value: w.name,
    description: w.role.substring(0, 100), // Limite 100 chars
    emoji: w.icon
  }));
  
  // Ajouter l'option "Autre" pour saisie manuelle
  options.push({
    label: '✍️ Autre (saisie manuelle)',
    value: 'custom_weapon',
    description: 'Entrer un nom d\'arme personnalisé',
    emoji: '✍️'
  });
  
  // Inclure le rosterId dans le customId si fourni
  const customId = rosterId 
    ? `weapon_select_${roleType.toLowerCase()}_${rosterId}`
    : `weapon_select_${roleType.toLowerCase()}`;
  
  const menu = new StringSelectMenuBuilder()
    .setCustomId(customId)
    .setPlaceholder(`Choisissez votre arme ${roleType}`)
    .addOptions(options);
  
  return new ActionRowBuilder().addComponents(menu);
}

/**
 * Génère l'interface de modification de roster (pour le créateur)
 */
export function generateEditRosterMenu(roster, rosterId = null) {
  const options = [];
  
  // Option pour modifier les quotas
  options.push({
    label: '📊 Modifier les quotas de rôles',
    value: 'edit_quotas',
    description: 'Ajuster le nombre de places par rôle',
    emoji: '📊'
  });
  
  // Option pour ajouter/retirer des places
  options.push({
    label: '➕ Ajouter un slot',
    value: 'add_slot',
    description: 'Ajouter une place pour un rôle',
    emoji: '➕'
  });
  
  options.push({
    label: '➖ Retirer un slot',
    value: 'remove_slot',
    description: 'Retirer une place d\'un rôle',
    emoji: '➖'
  });
  
  // Option pour modifier un inscrit
  options.push({
    label: '✏️ Modifier un inscrit',
    value: 'edit_signup',
    description: 'Changer le rôle/arme d\'un membre',
    emoji: '✏️'
  });
  
  // Option pour kick
  options.push({
    label: '👢 Expulser un membre',
    value: 'kick_member',
    description: 'Retirer un membre du roster',
    emoji: '👢'
  });
  
  const customId = rosterId 
    ? `edit_roster_menu_${rosterId}`
    : 'edit_roster_menu';
  
  const menu = new StringSelectMenuBuilder()
    .setCustomId(customId)
    .setPlaceholder('Choisissez une action')
    .addOptions(options);
  
  return new ActionRowBuilder().addComponents(menu);
}

/**
 * Génère le menu de sélection de rôle pour modification
 */
export function generateRoleSelectMenu(rosterId = '', purpose = 'slot') {
  const roles = ['Tank', 'DPS', 'Healer', 'Support', 'Scout'];
  const options = roles.map(role => ({
    label: `${roleIcons[role]} ${role}`,
    value: role.toLowerCase(),
    emoji: roleIcons[role]
  }));
  
  let customId;
  if (purpose === 'edit') {
    // Pour la modification de membre
    customId = rosterId 
      ? `select_role_for_edit_${rosterId}`
      : 'select_role_for_edit';
  } else {
    // Pour l'ajout/retrait de slots
    customId = rosterId 
      ? `select_role_to_modify_${rosterId}`
      : 'select_role_to_modify';
  }
  
  const menu = new StringSelectMenuBuilder()
    .setCustomId(customId)
    .setPlaceholder('Sélectionnez un rôle')
    .addOptions(options);
  
  return new ActionRowBuilder().addComponents(menu);
}

/**
 * Génère le menu de sélection d'un membre inscrit
 */
export function generateMemberSelectMenu(roster, rosterId = null) {
  const options = [];
  
  for (const [roleType, signups] of Object.entries(roster.signups)) {
    for (const signup of signups) {
      options.push({
        label: `${signup.username} (${roleType})`,
        value: `${signup.userId}_${roleType}`,
        description: `${roleType} - ${signup.weapon}`,
        emoji: roleIcons[roleType]
      });
    }
  }
  
  if (options.length === 0) {
    options.push({
      label: 'Aucun membre inscrit',
      value: 'none',
      description: 'Personne n\'est encore inscrit'
    });
  }
  
  const customId = rosterId 
    ? `select_member_to_modify_${rosterId}`
    : 'select_member_to_modify';
  
  const menu = new StringSelectMenuBuilder()
    .setCustomId(customId)
    .setPlaceholder('Sélectionnez un membre')
    .addOptions(options.slice(0, 25)); // Limite Discord
  
  return new ActionRowBuilder().addComponents(menu);
}
