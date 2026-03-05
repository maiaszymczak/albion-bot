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
   * Envoie un résumé des feedbacks au créateur lorsque le roster est fermé
   */
  async sendFeedbackSummary(creatorId, roster) {
    if (!roster.feedback || roster.feedback.length === 0) {
      console.log(`📊 Pas de feedback à envoyer pour le roster ${roster.composition.name}`);
      return { success: true, hasFeedback: false };
    }

    // Calculer les statistiques
    const ratings = roster.feedback.map(f => f.rating);
    const averageRating = (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1);
    const ratingCounts = {
      5: ratings.filter(r => r === 5).length,
      4: ratings.filter(r => r === 4).length,
      3: ratings.filter(r => r === 3).length,
      2: ratings.filter(r => r === 2).length,
      1: ratings.filter(r => r === 1).length
    };

    // Créer l'embed principal
    const embed = new EmbedBuilder()
      .setColor(0xf39c12)
      .setTitle('⭐ Résumé des feedbacks')
      .setDescription(`**${roster.composition.name}**\n\n📊 Moyenne: **${averageRating}/5** (${roster.feedback.length} avis)`)
      .addFields(
        { 
          name: '📈 Répartition', 
          value: `⭐⭐⭐⭐⭐ ${ratingCounts[5]}\n⭐⭐⭐⭐ ${ratingCounts[4]}\n⭐⭐⭐ ${ratingCounts[3]}\n⭐⭐ ${ratingCounts[2]}\n⭐ ${ratingCounts[1]}`,
          inline: true
        }
      )
      .setTimestamp();

    // Ajouter les commentaires s'il y en a
    const comments = roster.feedback.filter(f => f.comment && f.comment.trim().length > 0);
    if (comments.length > 0) {
      const commentText = comments.map((f, index) => {
        const stars = '⭐'.repeat(f.rating);
        const username = f.username || 'Anonyme';
        return `**${username}** ${stars}\n> ${f.comment}`;
      }).join('\n\n');

      // Discord limite les field values à 1024 caractères
      if (commentText.length <= 1024) {
        embed.addFields({ name: '💬 Commentaires', value: commentText, inline: false });
      } else {
        // Diviser en plusieurs fields si nécessaire
        const chunks = [];
        let currentChunk = '';
        for (const comment of comments.map((f, index) => {
          const stars = '⭐'.repeat(f.rating);
          const username = f.username || 'Anonyme';
          return `**${username}** ${stars}\n> ${f.comment}`;
        })) {
          if ((currentChunk + '\n\n' + comment).length > 1024) {
            chunks.push(currentChunk);
            currentChunk = comment;
          } else {
            currentChunk += (currentChunk ? '\n\n' : '') + comment;
          }
        }
        if (currentChunk) chunks.push(currentChunk);

        embed.addFields({ name: '💬 Commentaires (1/2)', value: chunks[0], inline: false });
        if (chunks[1]) {
          embed.addFields({ name: '💬 Commentaires (2/2)', value: chunks[1], inline: false });
        }
      }
    }

    const result = await this.sendDM(creatorId, { embeds: [embed] });
    
    if (result.success) {
      console.log(`📬 Résumé des feedbacks envoyé au créateur ${creatorId}`);
    } else {
      console.error(`❌ Échec envoi résumé feedbacks au créateur ${creatorId}`);
    }

    return { success: result.success, hasFeedback: true, feedbackCount: roster.feedback.length };
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
