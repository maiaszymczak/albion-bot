import { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } from 'discord.js';

/**
 * Crée un modal pour la saisie manuelle d'une arme
 */
export function createCustomWeaponModal(roleType) {
  const modal = new ModalBuilder()
    .setCustomId(`custom_weapon_modal_${roleType.toLowerCase()}`)
    .setTitle(`Arme personnalisée - ${roleType}`);

  const weaponInput = new TextInputBuilder()
    .setCustomId('custom_weapon_name')
    .setLabel('Nom de l\'arme')
    .setStyle(TextInputStyle.Short)
    .setPlaceholder('Ex: Épée Runique T8.3')
    .setRequired(true)
    .setMaxLength(100);

  const firstRow = new ActionRowBuilder().addComponents(weaponInput);
  modal.addComponents(firstRow);

  return modal;
}

/**
 * Crée un modal pour modifier les quotas
 */
export function createEditQuotasModal(currentQuotas) {
  const modal = new ModalBuilder()
    .setCustomId('edit_quotas_modal')
    .setTitle('Modifier les quotas de rôles');

  const tankInput = new TextInputBuilder()
    .setCustomId('quota_tank')
    .setLabel('Tanks')
    .setStyle(TextInputStyle.Short)
    .setValue(String(currentQuotas.Tank || 0))
    .setPlaceholder('Nombre de tanks')
    .setRequired(true)
    .setMaxLength(2);

  const dpsInput = new TextInputBuilder()
    .setCustomId('quota_dps')
    .setLabel('DPS')
    .setStyle(TextInputStyle.Short)
    .setValue(String(currentQuotas.DPS || 0))
    .setPlaceholder('Nombre de DPS')
    .setRequired(true)
    .setMaxLength(2);

  const healerInput = new TextInputBuilder()
    .setCustomId('quota_healer')
    .setLabel('Healers')
    .setStyle(TextInputStyle.Short)
    .setValue(String(currentQuotas.Healer || 0))
    .setPlaceholder('Nombre de healers')
    .setRequired(true)
    .setMaxLength(2);

  const supportInput = new TextInputBuilder()
    .setCustomId('quota_support')
    .setLabel('Supports')
    .setStyle(TextInputStyle.Short)
    .setValue(String(currentQuotas.Support || 0))
    .setPlaceholder('Nombre de supports')
    .setRequired(true)
    .setMaxLength(2);

  const scoutInput = new TextInputBuilder()
    .setCustomId('quota_scout')
    .setLabel('Scouts')
    .setStyle(TextInputStyle.Short)
    .setValue(String(currentQuotas.Scout || 0))
    .setPlaceholder('Nombre de scouts')
    .setRequired(true)
    .setMaxLength(2);

  modal.addComponents(
    new ActionRowBuilder().addComponents(tankInput),
    new ActionRowBuilder().addComponents(dpsInput),
    new ActionRowBuilder().addComponents(healerInput),
    new ActionRowBuilder().addComponents(supportInput),
    new ActionRowBuilder().addComponents(scoutInput)
  );

  return modal;
}

/**
 * Crée un modal pour modifier l'arme d'un membre
 */
export function createEditWeaponModal(userId, currentWeapon) {
  const modal = new ModalBuilder()
    .setCustomId(`edit_weapon_modal_${userId}`)
    .setTitle('Modifier l\'arme du membre');

  const weaponInput = new TextInputBuilder()
    .setCustomId('new_weapon_name')
    .setLabel('Nouvelle arme')
    .setStyle(TextInputStyle.Short)
    .setValue(currentWeapon || '')
    .setPlaceholder('Ex: Claymore T8')
    .setRequired(true)
    .setMaxLength(100);

  modal.addComponents(new ActionRowBuilder().addComponents(weaponInput));

  return modal;
}

/**
 * Crée un modal pour le feedback
 */
export function createFeedbackModal() {
  const modal = new ModalBuilder()
    .setCustomId('feedback_modal')
    .setTitle('Donner votre avis sur l\'événement');

  const ratingInput = new TextInputBuilder()
    .setCustomId('feedback_rating')
    .setLabel('Note (1-5)')
    .setStyle(TextInputStyle.Short)
    .setPlaceholder('Entre 1 et 5')
    .setRequired(true)
    .setMinLength(1)
    .setMaxLength(1);

  const commentInput = new TextInputBuilder()
    .setCustomId('feedback_comment')
    .setLabel('Commentaire (optionnel)')
    .setStyle(TextInputStyle.Paragraph)
    .setPlaceholder('Votre retour sur l\'événement...')
    .setRequired(false)
    .setMaxLength(500);

  modal.addComponents(
    new ActionRowBuilder().addComponents(ratingInput),
    new ActionRowBuilder().addComponents(commentInput)
  );

  return modal;
}
