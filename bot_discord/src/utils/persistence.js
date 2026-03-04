import { readFile, writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const DATA_DIR = join(__dirname, '../../data');
const ROSTERS_FILE = join(DATA_DIR, 'rosters.json');
const STATS_FILE = join(DATA_DIR, 'stats.json');
const TEMPLATES_FILE = join(DATA_DIR, 'templates.json');

/**
 * Gestionnaire de persistance des données
 */
export class PersistenceManager {
  constructor() {
    this.ensureDataDir();
  }

  /**
   * Assure que le dossier data existe
   */
  async ensureDataDir() {
    if (!existsSync(DATA_DIR)) {
      await mkdir(DATA_DIR, { recursive: true });
    }
  }

  /**
   * Sauvegarde les rosters actifs
   */
  async saveRosters(rostersMap) {
    try {
      const rosters = {};
      for (const [messageId, roster] of rostersMap.entries()) {
        rosters[messageId] = {
          ...roster,
          createdAt: roster.createdAt.toISOString(),
          scheduledDate: roster.scheduledDate?.toISOString()
        };
      }
      await writeFile(ROSTERS_FILE, JSON.stringify(rosters, null, 2), 'utf-8');
      console.log(`💾 ${Object.keys(rosters).length} rosters sauvegardés`);
    } catch (error) {
      console.error('❌ Erreur sauvegarde rosters:', error);
    }
  }

  /**
   * Charge les rosters sauvegardés
   */
  async loadRosters() {
    try {
      if (!existsSync(ROSTERS_FILE)) {
        return new Map();
      }
      
      const data = await readFile(ROSTERS_FILE, 'utf-8');
      const rosters = JSON.parse(data);
      const rostersMap = new Map();
      
      for (const [messageId, roster] of Object.entries(rosters)) {
        rostersMap.set(messageId, {
          ...roster,
          createdAt: new Date(roster.createdAt),
          scheduledDate: roster.scheduledDate ? new Date(roster.scheduledDate) : null
        });
      }
      
      console.log(`📂 ${rostersMap.size} rosters chargés`);
      return rostersMap;
    } catch (error) {
      console.error('❌ Erreur chargement rosters:', error);
      return new Map();
    }
  }

  /**
   * Sauvegarde les statistiques
   */
  async saveStats(stats) {
    try {
      await writeFile(STATS_FILE, JSON.stringify(stats, null, 2), 'utf-8');
      console.log('💾 Statistiques sauvegardées');
    } catch (error) {
      console.error('❌ Erreur sauvegarde stats:', error);
    }
  }

  /**
   * Charge les statistiques
   */
  async loadStats() {
    try {
      if (!existsSync(STATS_FILE)) {
        return {
          users: {}, // { userId: { participations: 0, roles: {}, lastSeen: date } }
          guilds: {}, // { guildId: { totalEvents: 0, totalParticipants: 0 } }
          history: []  // [{ rosterId, date, participants, type, result }]
        };
      }
      
      const data = await readFile(STATS_FILE, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      console.error('❌ Erreur chargement stats:', error);
      return { users: {}, guilds: {}, history: [] };
    }
  }

  /**
   * Enregistre une participation
   */
  async recordParticipation(userId, username, role, guildId, rosterId) {
    const stats = await this.loadStats();
    
    // Stats utilisateur
    if (!stats.users[userId]) {
      stats.users[userId] = {
        username,
        participations: 0,
        roles: {},
        lastSeen: new Date().toISOString()
      };
    }
    
    stats.users[userId].participations++;
    stats.users[userId].roles[role] = (stats.users[userId].roles[role] || 0) + 1;
    stats.users[userId].lastSeen = new Date().toISOString();
    
    // Stats guilde
    if (!stats.guilds[guildId]) {
      stats.guilds[guildId] = { totalEvents: 0, totalParticipants: 0 };
    }
    stats.guilds[guildId].totalParticipants++;
    
    await this.saveStats(stats);
  }

  /**
   * Enregistre un événement terminé
   */
  async recordEvent(rosterId, guildId, participants, type, result = null) {
    const stats = await this.loadStats();
    
    stats.history.push({
      rosterId,
      guildId,
      date: new Date().toISOString(),
      participants: participants.length,
      type,
      result
    });
    
    if (!stats.guilds[guildId]) {
      stats.guilds[guildId] = { totalEvents: 0, totalParticipants: 0 };
    }
    stats.guilds[guildId].totalEvents++;
    
    await this.saveStats(stats);
  }

  /**
   * Sauvegarde les templates
   */
  async saveTemplates(templates) {
    try {
      await writeFile(TEMPLATES_FILE, JSON.stringify(templates, null, 2), 'utf-8');
      console.log('💾 Templates sauvegardés');
    } catch (error) {
      console.error('❌ Erreur sauvegarde templates:', error);
    }
  }

  /**
   * Charge les templates
   */
  async loadTemplates() {
    try {
      if (!existsSync(TEMPLATES_FILE)) {
        return {}; // { userId: { templateName: composition } }
      }
      
      const data = await readFile(TEMPLATES_FILE, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      console.error('❌ Erreur chargement templates:', error);
      return {};
    }
  }

  /**
   * Sauvegarde un template utilisateur
   */
  async saveUserTemplate(userId, templateName, composition) {
    const templates = await this.loadTemplates();
    
    if (!templates[userId]) {
      templates[userId] = {};
    }
    
    templates[userId][templateName] = {
      composition,
      createdAt: new Date().toISOString()
    };
    
    await this.saveTemplates(templates);
    return true;
  }

  /**
   * Récupère les templates d'un utilisateur
   */
  async getUserTemplates(userId) {
    const templates = await this.loadTemplates();
    return templates[userId] || {};
  }

  /**
   * Supprime un template
   */
  async deleteUserTemplate(userId, templateName) {
    const templates = await this.loadTemplates();
    
    if (templates[userId] && templates[userId][templateName]) {
      delete templates[userId][templateName];
      await this.saveTemplates(templates);
      return true;
    }
    
    return false;
  }
}

export const persistence = new PersistenceManager();
