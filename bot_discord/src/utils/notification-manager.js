import { EmbedBuilder } from 'discord.js';

/**
 * Gestionnaire de notifications Discord
 */
export class NotificationManager {
  constructor(client) {
    this.client = client;
    this.scheduledReminders = new Map(); // messageId -> timeoutId
  }

  /**
   * Envoie un DM à un utilisateur
   */
  async sendDM(userId, content) {
    try {
      const user = await this.client.users.fetch(userId);
      await user.send(content);
      return { success: true };
    } catch (error) {
      console.error(`❌ Erreur envoi DM à ${userId}:`, error.message);
      return { success: false, error: error.message };
    }
  }

  /**
   * Notifie le créateur d'une nouvelle inscription
   */
  async notifyCreatorNewSignup(creatorId, username, role, weapon, compositionName) {
    const embed = new EmbedBuilder()
      .setColor(0x2ecc71)
      .setTitle('✅ Nouvelle inscription !')
      .setDescription(`**${username}** s'est inscrit(e) à votre événement`)
      .addFields(
        { name: '📋 Événement', value: compositionName, inline: false },
        { name: '🎭 Rôle', value: role, inline: true },
        { name: '⚔️ Arme', value: weapon, inline: true }
      )
      .setTimestamp();

    return await this.sendDM(creatorId, { embeds: [embed] });
  }

  /**
   * Notifie le créateur d'une désinscription
   */
  async notifyCreatorSignout(creatorId, username, role, compositionName) {
    const embed = new EmbedBuilder()
      .setColor(0xe74c3c)
      .setTitle('❌ Désinscription')
      .setDescription(`**${username}** s'est désinscrit(e) de votre événement`)
      .addFields(
        { name: '📋 Événement', value: compositionName, inline: false },
        { name: '🎭 Rôle', value: role, inline: true }
      )
      .setTimestamp();

    return await this.sendDM(creatorId, { embeds: [embed] });
  }

  /**
   * Notifie le créateur que le roster est complet
   */
  async notifyCreatorRosterFull(creatorId, compositionName, totalParticipants) {
    const embed = new EmbedBuilder()
      .setColor(0xf39c12)
      .setTitle('🎉 Roster complet !')
      .setDescription(`Votre événement **${compositionName}** est maintenant complet !`)
      .addFields(
        { name: '👥 Participants', value: `${totalParticipants}`, inline: true }
      )
      .setFooter({ text: 'Vous pouvez maintenant fermer les inscriptions ou laisser une waitlist se former.' })
      .setTimestamp();

    return await this.sendDM(creatorId, { embeds: [embed] });
  }

  /**
   * Notifie un joueur qu'il a été promu de la waitlist
   */
  async notifyPromotion(userId, username, role, weapon, compositionName) {
    const embed = new EmbedBuilder()
      .setColor(0x2ecc71)
      .setTitle('🎉 Vous avez été promu(e) !')
      .setDescription(`Une place s'est libérée dans **${compositionName}**`)
      .addFields(
        { name: '🎭 Votre rôle', value: role, inline: true },
        { name: '⚔️ Votre arme', value: weapon, inline: true }
      )
      .setFooter({ text: 'Vous êtes maintenant inscrit(e) à l\'événement !' })
      .setTimestamp();

    return await this.sendDM(userId, { embeds: [embed] });
  }

  /**
   * Notifie un joueur qu'il a été ajouté à la waitlist
   */
  async notifyWaitlisted(userId, compositionName, position) {
    const embed = new EmbedBuilder()
      .setColor(0xf39c12)
      .setTitle('⏳ Ajouté à la liste d\'attente')
      .setDescription(`Le roster de **${compositionName}** est complet.`)
      .addFields(
        { name: '📊 Position', value: `#${position} dans la file`, inline: true }
      )
      .setFooter({ text: 'Vous serez automatiquement promu si une place se libère.' })
      .setTimestamp();

    return await this.sendDM(userId, { embeds: [embed] });
  }

  /**
   * Envoie un rappel à tous les participants 1h avant l'événement
   */
  async sendEventReminder(roster, messageLink) {
    const embed = new EmbedBuilder()
      .setColor(0xe91e63)
      .setTitle('⏰ Rappel d\'événement')
      .setDescription(`**${roster.composition.name}** commence dans 1 heure !`)
      .setFooter({ text: 'Préparez votre équipement et rejoignez le groupe !' })
      .setTimestamp();

    if (messageLink) {
      embed.addFields({ name: '🔗 Lien', value: `[Voir le roster](${messageLink})`, inline: false });
    }

    // Envoyer à tous les participants
    const allParticipants = new Set();
    for (const signups of Object.values(roster.signups)) {
      for (const signup of signups) {
        allParticipants.add(signup.userId);
      }
    }

    let successCount = 0;
    for (const userId of allParticipants) {
      const result = await this.sendDM(userId, { embeds: [embed] });
      if (result.success) successCount++;
    }

    console.log(`📢 Rappels envoyés: ${successCount}/${allParticipants.size}`);
    return { success: true, sent: successCount, total: allParticipants.size };
  }

  /**
   * Notifie tous les participants que l'événement est terminé
   */
  async notifyEventCompleted(roster) {
    const embed = new EmbedBuilder()
      .setColor(0x95a5a6)
      .setTitle('✅ Événement terminé')
      .setDescription(`**${roster.composition.name}** est maintenant terminé.`)
      .addFields(
        { name: '💬 Feedback', value: 'N\'oubliez pas de donner votre avis avec le bouton ⭐', inline: false }
      )
      .setFooter({ text: 'Merci d\'avoir participé !' })
      .setTimestamp();

    const allParticipants = new Set();
    for (const signups of Object.values(roster.signups)) {
      for (const signup of signups) {
        allParticipants.add(signup.userId);
      }
    }

    let successCount = 0;
    for (const userId of allParticipants) {
      const result = await this.sendDM(userId, { embeds: [embed] });
      if (result.success) successCount++;
    }

    console.log(`📢 Notifications fin d'événement: ${successCount}/${allParticipants.size}`);
    return { success: true, sent: successCount, total: allParticipants.size };
  }

  /**
   * Programme un rappel automatique 1h avant l'événement
   */
  scheduleReminder(messageId, scheduledDate, roster, messageLink) {
    // Annuler rappel existant si présent
    if (this.scheduledReminders.has(messageId)) {
      clearTimeout(this.scheduledReminders.get(messageId));
    }

    const now = new Date();
    const eventTime = new Date(scheduledDate);
    const reminderTime = new Date(eventTime.getTime() - 60 * 60 * 1000); // 1h avant

    if (reminderTime <= now) {
      console.log(`⚠️ Rappel non programmé pour ${messageId}: événement trop proche ou passé`);
      return { success: false, reason: 'Event too soon or past' };
    }

    const delay = reminderTime.getTime() - now.getTime();

    const timeoutId = setTimeout(async () => {
      await this.sendEventReminder(roster, messageLink);
      this.scheduledReminders.delete(messageId);
    }, delay);

    this.scheduledReminders.set(messageId, timeoutId);

    console.log(`⏰ Rappel programmé pour ${messageId} dans ${Math.round(delay / 1000 / 60)} minutes`);
    return { success: true, reminderTime: reminderTime.toISOString() };
  }

  /**
   * Annule un rappel programmé
   */
  cancelReminder(messageId) {
    if (this.scheduledReminders.has(messageId)) {
      clearTimeout(this.scheduledReminders.get(messageId));
      this.scheduledReminders.delete(messageId);
      return { success: true };
    }
    return { success: false };
  }

  /**
   * Reprogramme tous les rappels au démarrage du bot
   */
  async rescheduleAllReminders(rosters, client) {
    let scheduled = 0;
    const now = new Date();

    for (const [messageId, roster] of rosters.entries()) {
      if (roster.scheduledDate && roster.status === 'open') {
        const scheduledDate = new Date(roster.scheduledDate);
        const reminderTime = new Date(scheduledDate.getTime() - 60 * 60 * 1000);

        if (reminderTime > now) {
          // Reconstruire le lien du message
          let messageLink = null;
          try {
            // Chercher le message dans tous les channels
            for (const guild of client.guilds.cache.values()) {
              for (const channel of guild.channels.cache.values()) {
                if (channel.isTextBased()) {
                  try {
                    await channel.messages.fetch(messageId);
                    messageLink = `https://discord.com/channels/${guild.id}/${channel.id}/${messageId}`;
                    break;
                  } catch (e) {
                    // Message pas dans ce channel
                  }
                }
              }
              if (messageLink) break;
            }
          } catch (error) {
            console.error(`Erreur recherche message ${messageId}:`, error.message);
          }

          const result = this.scheduleReminder(messageId, scheduledDate, roster, messageLink);
          if (result.success) scheduled++;
        }
      }
    }

    console.log(`📅 ${scheduled} rappel(s) reprogrammé(s)`);
    return scheduled;
  }
}

export function createNotificationManager(client) {
  return new NotificationManager(client);
}
