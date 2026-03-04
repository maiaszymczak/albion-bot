// Système de gestion des inscriptions pour les compositions
// Stocke les rosters actifs en mémoire et sur disque

import { persistence } from './persistence.js';

export class RosterManager {
  constructor() {
    // Map<messageId, RosterData>
    this.rosters = new Map();
    this.notificationManager = null; // Sera injecté depuis index.js
    this.autoSaveInterval = null; // Référence vers l'interval
    this.loadingPromise = this.loadRosters(); // Stocker la promesse
  }

  /**
   * Attend que les rosters soient chargés
   */
  async waitForLoad() {
    await this.loadingPromise;
  }

  /**
   * Démarre l'auto-save (appelé depuis index.js)
   */
  startAutoSave() {
    if (!this.autoSaveInterval) {
      this.autoSaveInterval = setInterval(() => this.saveRosters(), 5 * 60 * 1000);
      console.log('💾 Auto-save activé (toutes les 5 minutes)');
    }
  }

  /**
   * Arrête l'auto-save
   */
  stopAutoSave() {
    if (this.autoSaveInterval) {
      clearInterval(this.autoSaveInterval);
      this.autoSaveInterval = null;
    }
  }

  /**
   * Injecte le notification manager
   */
  setNotificationManager(notificationManager) {
    this.notificationManager = notificationManager;
  }

  /**
   * Charge les rosters depuis le disque
   */
  async loadRosters() {
    this.rosters = await persistence.loadRosters();
  }

  /**
   * Sauvegarde les rosters sur le disque
   */
  async saveRosters() {
    await persistence.saveRosters(this.rosters);
  }

  /**
   * Crée un nouveau roster
   */
  createRoster(messageId, creatorId, composition, scheduledDate = null, guildId = null, channelId = null) {
    const rosterData = {
      creatorId,
      guildId,
      channelId,
      composition,
      signups: {}, // { roleType: [{ userId, username, weapon }] }
      waitlist: [], // [{ userId, username, role, weapon }]
      quotas: this.calculateQuotas(composition.members || composition),
      status: 'open', // 'open', 'closed', 'full', 'completed'
      createdAt: new Date(),
      scheduledDate: scheduledDate ? new Date(scheduledDate) : null,
      notificationsSent: false,
      feedback: [] // [{ userId, rating, comment }]
    };
    
    this.rosters.set(messageId, rosterData);
    this.saveRosters(); // Sauvegarde immédiate
    
    // Programmer rappel si date prévue
    if (scheduledDate && this.notificationManager) {
      const messageLink = guildId && channelId 
        ? `https://discord.com/channels/${guildId}/${channelId}/${messageId}`
        : null;
      this.notificationManager.scheduleReminder(messageId, scheduledDate, rosterData, messageLink);
    }
    
    return rosterData;
  }

  /**
   * Calcule les quotas de chaque rôle
   */
  calculateQuotas(composition) {
    const quotas = {
      Tank: 0,
      DPS: 0,
      Healer: 0,
      Support: 0,
      Scout: 0
    };

    // Si c'est une composition générée avec des membres
    if (Array.isArray(composition)) {
      composition.forEach(member => {
        const roleType = this.getRoleType(member.type || member.role);
        quotas[roleType]++;
      });
    }

    return quotas;
  }

  /**
   * Détermine le type de rôle simplifié
   */
  getRoleType(role) {
    const roleStr = (role || '').toLowerCase();
    if (roleStr.includes('tank')) return 'Tank';
    if (roleStr.includes('heal')) return 'Healer';
    if (roleStr.includes('support')) return 'Support';
    if (roleStr.includes('scout')) return 'Scout';
    return 'DPS';
  }

  /**
   * Inscrit un joueur à un rôle
   */
  signup(messageId, userId, username, role, weapon, guildId, armor = null) {
    const roster = this.rosters.get(messageId);
    if (!roster) return { success: false, error: 'Roster introuvable' };
    if (roster.status === 'closed') return { success: false, error: 'Inscriptions fermées' };

    // Vérifier si déjà inscrit
    for (const [roleType, signups] of Object.entries(roster.signups)) {
      const existing = signups.find(s => s.userId === userId);
      if (existing) {
        return { success: false, error: 'Vous êtes déjà inscrit' };
      }
    }

    // Vérifier les quotas
    const currentCount = roster.signups[role]?.length || 0;
    const quota = roster.quotas[role] || 0;
    
    if (currentCount >= quota) {
      // Ajouter à la liste d'attente
      roster.waitlist.push({ userId, username, role, weapon, armor, timestamp: Date.now() });
      
      // Notifier l'utilisateur qu'il est en waitlist
      if (this.notificationManager) {
        this.notificationManager.notifyWaitlisted(
          userId,
          roster.composition.name || 'Composition',
          roster.waitlist.length
        );
      }
      
      this.saveRosters();
      return { success: true, waitlisted: true, message: 'Ajouté à la liste d\'attente' };
    }

    // Ajouter l'inscription
    if (!roster.signups[role]) {
      roster.signups[role] = [];
    }
    
    roster.signups[role].push({ 
      userId, 
      username, 
      weapon, 
      armor, 
      swaps: [], // Liste des builds alternatifs
      timestamp: Date.now() 
    });

    // Enregistrer la participation dans les stats
    if (guildId) {
      persistence.recordParticipation(userId, username, role, guildId, messageId);
    }

    // Vérifier si le roster est complet
    const totalSignups = Object.values(roster.signups).reduce((sum, arr) => sum + arr.length, 0);
    const totalQuota = Object.values(roster.quotas).reduce((sum, q) => sum + q, 0);
    
    if (totalSignups >= totalQuota) {
      roster.status = 'full';
      
      // Notifier le créateur que le roster est complet
      if (this.notificationManager) {
        this.notificationManager.notifyCreatorRosterFull(
          roster.creatorId,
          roster.composition.name || 'Composition',
          totalSignups
        );
      }
    }

    // Notifier le créateur de la nouvelle inscription
    if (this.notificationManager) {
      this.notificationManager.notifyCreatorNewSignup(
        roster.creatorId,
        username,
        role,
        weapon,
        roster.composition.name || 'Composition'
      );
    }

    this.saveRosters();
    return { success: true, roster };
  }

  /**
   * Ajoute un swap (build alternatif) pour un joueur inscrit
   */
  addSwap(messageId, userId, swapRole, swapWeapon, swapArmor = null) {
    const roster = this.rosters.get(messageId);
    if (!roster) return { success: false, error: 'Roster introuvable' };

    // Trouver l'inscription du joueur
    let userSignup = null;
    let currentRole = null;
    
    for (const [roleType, signups] of Object.entries(roster.signups)) {
      const signup = signups.find(s => s.userId === userId);
      if (signup) {
        userSignup = signup;
        currentRole = roleType;
        break;
      }
    }

    if (!userSignup) {
      return { success: false, error: 'Vous devez d\'abord vous inscrire avec un build principal' };
    }

    // Vérifier que le swap n'existe pas déjà
    const swapExists = userSignup.swaps?.some(s => 
      s.role === swapRole && s.weapon === swapWeapon
    );

    if (swapExists) {
      return { success: false, error: 'Ce swap existe déjà' };
    }

    // Initialiser swaps si nécessaire
    if (!userSignup.swaps) {
      userSignup.swaps = [];
    }

    // Ajouter le swap
    userSignup.swaps.push({
      role: swapRole,
      weapon: swapWeapon,
      armor: swapArmor,
      addedAt: Date.now()
    });

    this.saveRosters();
    return { success: true, swapCount: userSignup.swaps.length };
  }

  /**
   * Désinscrit un joueur
   */
  signout(messageId, userId, username = 'Un joueur') {
    const roster = this.rosters.get(messageId);
    if (!roster) return { success: false, error: 'Roster introuvable' };

    // Trouver et retirer le joueur
    let removed = false;
    let removedRole = null;
    for (const [roleType, signups] of Object.entries(roster.signups)) {
      const index = signups.findIndex(s => s.userId === userId);
      if (index !== -1) {
        signups.splice(index, 1);
        removed = true;
        removedRole = roleType;
        break;
      }
    }

    if (!removed) {
      // Vérifier dans la waitlist
      if (roster.waitlist) {
        const waitlistIndex = roster.waitlist.findIndex(w => w.userId === userId);
        if (waitlistIndex !== -1) {
          roster.waitlist.splice(waitlistIndex, 1);
          this.saveRosters();
          return { success: true, message: 'Retiré de la liste d\'attente', roster };
        }
      }
      return { success: false, error: 'Vous n\'\u00eates pas inscrit' };
    }

    // Notifier le créateur de la désinscription
    if (this.notificationManager) {
      this.notificationManager.notifyCreatorSignout(
        roster.creatorId,
        username,
        removedRole,
        roster.composition.name || 'Composition'
      );
    }

    // Promouvoir quelqu'un de la waitlist
    const promoted = this.promoteFromWaitlist(roster, removedRole);

    // Mettre à jour le status
    roster.status = 'open';
    
    this.saveRosters();
    return { success: true, roster, promoted };
  }

  /**
   * Promouvoir quelqu'un de la waitlist
   */
  promoteFromWaitlist(roster, roleType) {
    if (!roster.waitlist || roster.waitlist.length === 0) return null;

    // Trouver le premier dans la waitlist pour ce rôle
    const index = roster.waitlist.findIndex(w => w.role === roleType);
    if (index === -1) return null;

    const promoted = roster.waitlist.splice(index, 1)[0];
    
    if (!roster.signups[roleType]) {
      roster.signups[roleType] = [];
    }
    
    roster.signups[roleType].push({
      userId: promoted.userId,
      username: promoted.username,
      weapon: promoted.weapon,
      timestamp: Date.now()
    });

    // Notifier l'utilisateur de sa promotion
    if (this.notificationManager) {
      this.notificationManager.notifyPromotion(
        promoted.userId,
        promoted.username,
        roleType,
        promoted.weapon,
        roster.composition.name || 'Composition'
      );
    }

    return promoted;
  }

  /**
   * Retire un joueur (admin)
   */
  kick(messageId, requesterId, targetUserId) {
    const roster = this.rosters.get(messageId);
    if (!roster) return { success: false, error: 'Roster introuvable' };
    if (roster.creatorId !== requesterId) return { success: false, error: 'Permission refusée' };

    return this.signout(messageId, targetUserId);
  }

  /**
   * Ferme les inscriptions
   */
  close(messageId, requesterId) {
    const roster = this.rosters.get(messageId);
    if (!roster) return { success: false, error: 'Roster introuvable' };
    if (roster.creatorId !== requesterId) return { success: false, error: 'Permission refusée' };

    roster.status = 'closed';
    return { success: true, roster };
  }

  /**
   * Modifie les quotas d'un roster (créateur uniquement)
   */
  updateQuotas(messageId, requesterId, newQuotas) {
    const roster = this.rosters.get(messageId);
    
    if (!roster) {
      return { success: false, message: 'Roster introuvable' };
    }
    
    if (roster.creatorId !== requesterId) {
      return { success: false, message: 'Seul le créateur peut modifier les quotas' };
    }
    
    // Valider les nouveaux quotas
    for (const [roleType, quota] of Object.entries(newQuotas)) {
      if (quota < 0) {
        return { success: false, message: `Quota invalide pour ${roleType}` };
      }
      
      // Vérifier qu'on ne réduit pas en dessous du nombre d'inscrits
      const currentSignups = roster.signups[roleType]?.length || 0;
      if (quota < currentSignups) {
        return { success: false, message: `Impossible de réduire ${roleType} à ${quota} (${currentSignups} déjà inscrits)` };
      }
    }
    
    roster.quotas = { ...roster.quotas, ...newQuotas };
    
    this.saveRosters();
    return { success: true, message: 'Quotas mis à jour' };
  }
  
  /**
   * Modifie le rôle/arme d'un inscrit (créateur uniquement)
   */
  updateSignup(messageId, requesterId, targetUserId, newRole, newWeapon) {
    const roster = this.rosters.get(messageId);
    
    if (!roster) {
      return { success: false, message: 'Roster introuvable' };
    }
    
    if (roster.creatorId !== requesterId) {
      return { success: false, message: 'Seul le créateur peut modifier les inscriptions' };
    }
    
    // Trouver l'ancien rôle de l'utilisateur
    let oldRole = null;
    let username = 'Utilisateur';
    for (const [roleType, signups] of Object.entries(roster.signups)) {
      const index = signups.findIndex(s => s.userId === targetUserId);
      if (index !== -1) {
        oldRole = roleType;
        username = signups[index].username;
        signups.splice(index, 1);
        break;
      }
    }
    
    if (!oldRole) {
      return { success: false, message: 'Utilisateur non inscrit' };
    }
    
    // Vérifier le quota du nouveau rôle
    const newRoleSignups = roster.signups[newRole] || [];
    const quota = roster.quotas[newRole] || 0;
    
    if (newRoleSignups.length >= quota) {
      return { success: false, message: `Quota ${newRole} déjà atteint` };
    }
    
    // Inscrire dans le nouveau rôle
    if (!roster.signups[newRole]) {
      roster.signups[newRole] = [];
    }
    
    roster.signups[newRole].push({
      userId: targetUserId,
      username,
      weapon: newWeapon,
      timestamp: Date.now()
    });
    
    this.saveRosters();
    return { success: true, message: `${username} déplacé de ${oldRole} à ${newRole}` };
  }

  /**
   * Marque le roster comme terminé
   */
  completeRoster(messageId, requesterId) {
    const roster = this.rosters.get(messageId);
    
    if (!roster) {
      return { success: false, message: 'Roster introuvable' };
    }
    
    if (roster.creatorId !== requesterId) {
      return { success: false, message: 'Seul le créateur peut marquer comme terminé' };
    }
    
    roster.status = 'completed';
    this.saveRosters();
    
    // Notifier tous les participants
    if (this.notificationManager) {
      this.notificationManager.notifyEventCompleted(roster);
    }
    
    // Annuler le rappel si programmé
    if (this.notificationManager) {
      this.notificationManager.cancelReminder(messageId);
    }
    
    return { success: true, roster };
  }

  /**
   * Ajoute un feedback
   */
  addFeedback(messageId, userId, username, rating, comment = '') {
    const roster = this.rosters.get(messageId);
    
    if (!roster) {
      return { success: false, message: 'Roster introuvable' };
    }
    
    if (!roster.feedback) {
      roster.feedback = [];
    }
    
    // Vérifier si déjà donné feedback
    const existing = roster.feedback.find(f => f.userId === userId);
    if (existing) {
      return { success: false, message: 'Vous avez déjà donné votre avis' };
    }
    
    roster.feedback.push({
      userId,
      username,
      rating,
      comment,
      timestamp: Date.now()
    });
    
    this.saveRosters();
    return { success: true };
  }

  /**
   * Récupère un roster
   */
  getRoster(messageId) {
    return this.rosters.get(messageId);
  }

  /**
   * Supprime un roster
   */
  deleteRoster(messageId) {
    const deleted = this.rosters.delete(messageId);
    if (deleted) {
      this.saveRosters();
    }
    return deleted;
  }

  /**
   * Récupère tous les rosters actifs
   */
  getAllRosters() {
    return Array.from(this.rosters.entries()).map(([id, roster]) => ({
      id,
      ...roster
    }));
  }

  /**
   * Récupère les rosters d'une guilde
   */
  getGuildRosters(guildId) {
    return this.getAllRosters().filter(r => r.guildId === guildId);
  }

  /**
   * Clone un roster
   */
  cloneRoster(sourceMessageId, newMessageId, creatorId) {
    const source = this.rosters.get(sourceMessageId);
    
    if (!source) {
      return { success: false, message: 'Roster source introuvable' };
    }
    
    const cloned = {
      ...source,
      createdAt: new Date(),
      signups: {},
      waitlist: [],
      status: 'open',
      creatorId,
      notificationsSent: false,
      feedback: []
    };
    
    this.rosters.set(newMessageId, cloned);
    this.saveRosters();
    
    return { success: true, roster: cloned };
  }

  /**
   * Nettoie les vieux rosters (> 7 jours pour les terminés, > 30 jours pour les autres)
   */
  cleanup() {
    const now = new Date();
    let cleaned = 0;
    
    for (const [messageId, roster] of this.rosters.entries()) {
      const age = now - roster.createdAt;
      const maxAge = roster.status === 'completed' ? 7 * 24 * 60 * 60 * 1000 : 30 * 24 * 60 * 60 * 1000;
      
      if (age > maxAge) {
        this.rosters.delete(messageId);
        cleaned++;
      }
    }
    
    if (cleaned > 0) {
      this.saveRosters();
      console.log(`🧹 ${cleaned} rosters nettoyés`);
    }
  }

  /**
   * Analyse le roster et suggère des optimisations basées sur les swaps disponibles
   */
  analyzeRosterOptimization(messageId) {
    const roster = this.rosters.get(messageId);
    if (!roster) return { success: false, error: 'Roster introuvable' };

    const suggestions = [];
    
    // Trouver les rôles qui manquent de joueurs
    const needsMorePlayers = {};
    for (const [roleType, quota] of Object.entries(roster.quotas)) {
      const currentCount = (roster.signups[roleType] || []).length;
      if (currentCount < quota) {
        needsMorePlayers[roleType] = quota - currentCount;
      }
    }

    // Analyser les swaps de chaque joueur inscrit
    for (const [currentRole, signups] of Object.entries(roster.signups)) {
      for (const signup of signups) {
        if (!signup.swaps || signup.swaps.length === 0) continue;

        // Vérifier si ce joueur a un swap pour un rôle qui manque de joueurs
        for (const swap of signup.swaps) {
          if (needsMorePlayers[swap.role] && needsMorePlayers[swap.role] > 0) {
            const equipment = swap.armor 
              ? `${swap.weapon} + ${swap.armor}`
              : swap.weapon;

            suggestions.push({
              type: 'fill_slot',
              priority: 'high',
              userId: signup.userId,
              username: signup.username,
              currentRole,
              currentWeapon: signup.weapon,
              suggestedRole: swap.role,
              suggestedWeapon: swap.weapon,
              suggestedArmor: swap.armor,
              swapIndex: signup.swaps.indexOf(swap),
              message: `💡 **${signup.username}** pourrait passer de **${currentRole}** à **${swap.role}** avec ${equipment}`,
              benefit: `Remplirait un slot ${swap.role} vide (${needsMorePlayers[swap.role]} manquant${needsMorePlayers[swap.role] > 1 ? 's' : ''})`
            });
          }
        }
      }
    }

    // Trier les suggestions par priorité
    suggestions.sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });

    return {
      success: true,
      suggestions,
      summary: {
        totalSuggestions: suggestions.length,
        roleNeeds: needsMorePlayers,
        canOptimize: suggestions.length > 0
      }
    };
  }

  /**
   * Applique une suggestion d'optimisation
   */
  applySuggestion(messageId, creatorId, suggestion) {
    const roster = this.rosters.get(messageId);
    if (!roster) return { success: false, error: 'Roster introuvable' };
    if (roster.creatorId !== creatorId) return { success: false, error: 'Permission refusée' };

    if (suggestion.type === 'fill_slot') {
      // Déplacer le joueur vers le nouveau rôle avec son swap
      const oldSignups = roster.signups[suggestion.currentRole] || [];
      const memberIndex = oldSignups.findIndex(s => s.userId === suggestion.userId);
      
      if (memberIndex === -1) {
        return { success: false, error: 'Membre introuvable' };
      }

      const member = oldSignups[memberIndex];
      oldSignups.splice(memberIndex, 1);

      // Ajouter au nouveau rôle
      if (!roster.signups[suggestion.suggestedRole]) {
        roster.signups[suggestion.suggestedRole] = [];
      }
      
      roster.signups[suggestion.suggestedRole].push({
        userId: member.userId,
        username: member.username,
        weapon: suggestion.suggestedWeapon,
        armor: suggestion.suggestedArmor,
        swaps: member.swaps,
        timestamp: Date.now()
      });

      this.saveRosters();
      return { success: true, message: 'Optimisation appliquée' };
    }

    return { success: false, error: 'Type de suggestion non supporté' };
  }
}

// Instance singleton
export const rosterManager = new RosterManager();

// Nettoyer les vieux rosters toutes les heures
setInterval(() => {
  rosterManager.cleanup();
}, 60 * 60 * 1000);
