// Système de gestion des inscriptions pour les compositions
// Stocke les rosters actifs en mémoire

export class RosterManager {
  constructor() {
    // Map<messageId, RosterData>
    this.rosters = new Map();
  }

  /**
   * Crée un nouveau roster
   */
  createRoster(messageId, creatorId, composition) {
    const rosterData = {
      creatorId,
      composition,
      signups: {}, // { roleType: [{ userId, username, weapon }] }
      quotas: this.calculateQuotas(composition),
      status: 'open', // 'open', 'closed', 'full'
      createdAt: new Date()
    };
    
    this.rosters.set(messageId, rosterData);
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
  signup(messageId, userId, username, role, weapon) {
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
      return { success: false, error: `Plus de places disponibles pour ${role}` };
    }

    // Ajouter l'inscription
    if (!roster.signups[role]) {
      roster.signups[role] = [];
    }
    
    roster.signups[role].push({ userId, username, weapon });

    // Vérifier si le roster est complet
    const totalSignups = Object.values(roster.signups).reduce((sum, arr) => sum + arr.length, 0);
    const totalQuota = Object.values(roster.quotas).reduce((sum, q) => sum + q, 0);
    
    if (totalSignups >= totalQuota) {
      roster.status = 'full';
    }

    return { success: true, roster };
  }

  /**
   * Désinscrit un joueur
   */
  signout(messageId, userId) {
    const roster = this.rosters.get(messageId);
    if (!roster) return { success: false, error: 'Roster introuvable' };

    for (const [roleType, signups] of Object.entries(roster.signups)) {
      const index = signups.findIndex(s => s.userId === userId);
      if (index !== -1) {
        signups.splice(index, 1);
        roster.status = 'open'; // Rouvrir si c'était plein
        return { success: true, roster };
      }
    }

    return { success: false, error: 'Vous n\'êtes pas inscrit' };
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
    
    return { success: true, message: `${username} déplacé de ${oldRole} à ${newRole}` };
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
    return this.rosters.delete(messageId);
  }

  /**
   * Nettoie les vieux rosters (> 24h)
   */
  cleanup() {
    const now = new Date();
    for (const [messageId, roster] of this.rosters.entries()) {
      const age = now - roster.createdAt;
      if (age > 24 * 60 * 60 * 1000) { // 24h
        this.rosters.delete(messageId);
      }
    }
  }
}

// Instance singleton
export const rosterManager = new RosterManager();

// Nettoyer les vieux rosters toutes les heures
setInterval(() => {
  rosterManager.cleanup();
}, 60 * 60 * 1000);
