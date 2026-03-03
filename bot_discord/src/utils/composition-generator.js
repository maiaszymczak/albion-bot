import { weaponsByTree, roles, roleIcons, tierColors } from '../data/albion-data.js';

/**
 * Récupère toutes les armes pour un rôle donné
 */
function getWeaponsForRole(role) {
  const allWeapons = [];
  
  // Parcourir tous les arbres d'armes et filtrer par rôle
  for (const tree of Object.values(weaponsByTree)) {
    for (const weapon of tree) {
      const weaponRole = weapon.role.toLowerCase();
      
      // Tank : doit contenir 'tank' ou 'frontline'
      if (role === roles.TANK && (weaponRole.includes('tank') || weaponRole.includes('frontline'))) {
        allWeapons.push(weapon);
      } 
      // Melee DPS : doit contenir 'dps' MAIS PAS 'tank', 'heal', 'ranged'
      else if (role === roles.MELEE_DPS && weaponRole.includes('dps') && 
               !weaponRole.includes('tank') && 
               !weaponRole.includes('heal') && 
               !weaponRole.includes('ranged')) {
        allWeapons.push(weapon);
      } 
      // Ranged DPS : doit contenir un mot-clé ranged MAIS PAS 'tank', 'heal'
      else if (role === roles.RANGED_DPS && 
               (weaponRole.includes('ranged') || weaponRole.includes('mage') || 
                weaponRole.includes('aoe') || weaponRole.includes('burst')) &&
               !weaponRole.includes('tank') && 
               !weaponRole.includes('heal')) {
        allWeapons.push(weapon);
      } 
      // Healer : doit contenir 'heal' MAIS PAS 'tank'
      else if (role === roles.HEALER && weaponRole.includes('heal') && !weaponRole.includes('tank')) {
        allWeapons.push(weapon);
      } 
      // Scout : doit contenir 'scout' ou 'vision'
      else if (role === roles.SCOUT && (weaponRole.includes('scout') || weaponRole.includes('vision'))) {
        allWeapons.push(weapon);
      }
    }
  }
  
  return allWeapons.length > 0 ? allWeapons : Object.values(weaponsByTree).flat();
}

/**
 * Génère une composition personnalisée basée sur un nombre de joueurs
 */
export function generateCustomComposition(size, style = 'balanced') {
  const composition = [];
  
  let tanks, healers, meleeDps, rangedDps, scouts, finishers;
  
  if (style === 'clap') {
    // Style CLAP : plus de tanks/support, moins de DPS pur
    tanks = Math.max(1, Math.ceil(size * 0.25));
    healers = Math.max(1, Math.ceil(size * 0.20));
    scouts = size >= 8 ? 1 : 0;
    const remaining = size - tanks - healers - scouts;
    meleeDps = Math.floor(remaining * 0.4);
    rangedDps = remaining - meleeDps;
    finishers = 0;
  } else if (style === 'brawl') {
    // Style Brawl : focus DPS et finish
    tanks = Math.max(1, Math.floor(size * 0.15));
    healers = Math.max(1, Math.floor(size * 0.20));
    finishers = size >= 10 ? 1 : 0;
    const remaining = size - tanks - healers - finishers;
    meleeDps = Math.floor(remaining * 0.5);
    rangedDps = remaining - meleeDps;
    scouts = 0;
  } else {
    // Style équilibré (défaut)
    tanks = Math.max(1, Math.floor(size * 0.2));
    healers = Math.max(1, Math.floor(size * 0.2));
    const remaining = size - tanks - healers;
    meleeDps = Math.floor(remaining * 0.4);
    rangedDps = remaining - meleeDps;
    scouts = 0;
    finishers = 0;
  }
  
  const template = [
    { role: roles.TANK, count: tanks },
    { role: roles.MELEE_DPS, count: meleeDps },
    { role: roles.RANGED_DPS, count: rangedDps },
    { role: roles.HEALER, count: healers }
  ];
  
  if (scouts > 0) template.push({ role: roles.SCOUT, count: scouts });
  if (finishers > 0) template.push({ role: roles.FINISH, count: finishers });
  
  return generateComposition(template);
}

/**
 * Génère une composition d'équipe aléatoire basée sur un template
 */
export function generateComposition(template) {
  const composition = [];
  
  for (const roleConfig of template) {
    for (let i = 0; i < roleConfig.count; i++) {
      const weaponPool = getWeaponsForRole(roleConfig.role);
      const randomWeapon = weaponPool[Math.floor(Math.random() * weaponPool.length)];
      composition.push({
        position: composition.length + 1,
        name: randomWeapon.name,
        type: randomWeapon.tier,
        role: randomWeapon.role,
        gear: `${randomWeapon.tier} - ${randomWeapon.hands === 1 ? 'Main unique' : '2 Mains'}`
      });
    }
  }
  
  return composition;
}

/**
 * Formate une composition en embed Discord
 */
export function formatCompositionEmbed(compType, composition) {
  // Détermine l'icône et la couleur selon le type de composition
  const getCompositionColor = (name) => {
    if (name.includes('PvP') || name.includes('CLAP') || name.includes('Brawl') || name.includes('ZvZ')) {
      return 0xe74c3c; // Rouge pour PvP
    } else if (name.includes('Donjon') || name.includes('Raid')) {
      return 0x9b59b6; // Violet pour PvE
    }
    return 0x00AE86; // Vert par défaut
  };
  
  // Pour les builds solo (1 joueur), afficher différemment
  if (compType.size === 1 && composition.length > 1) {
    const fields = composition.map((build, index) => {
      const tierEmoji = {
        'Meta': '🔥',
        'Viable': '✅',
        'Situational': '⚠️',
        'High Skill': '⭐'
      }[build.tier] || '📌';
      
      let value = `${tierEmoji} **${build.tier}**\n`;
      value += `📋 ${build.role}\n`;
      if (build.description) {
        value += `💭 ${build.description}\n`;
      }
      if (build.gear) {
        value += `🎽 ${build.gear}`;
      }
      
      return {
        name: `${index + 1}. ${build.name}`,
        value: value,
        inline: false
      };
    });
    
    return {
      color: getCompositionColor(compType.name),
      title: `⚔️ ${compType.name}`,
      description: compType.description || `Builds recommandés pour **${compType.size} joueur(s)**`,
      fields: fields,
      footer: {
        text: 'Albion Online - Générateur de Compositions'
      },
      timestamp: new Date().toISOString()
    };
  }
  
  // Pour les compositions multi-joueurs
  const fields = composition.map((member, index) => {
    const position = member.position || (index + 1);
    
    // Détermine l'icône du rôle
    let roleIcon = '⚔️';
    let roleType = 'Joueur';
    if (member.role && member.role.includes('Tank')) {
      roleIcon = roleIcons.Tank;
      roleType = 'Tank';
    } else if (member.role && member.role.includes('Heal')) {
      roleIcon = roleIcons.Healer;
      roleType = 'Healer';
    } else if (member.role && member.role.includes('Scout')) {
      roleIcon = roleIcons.Scout;
      roleType = 'Scout';
    } else if (member.role && member.role.includes('Support')) {
      roleIcon = roleIcons.Support;
      roleType = 'Support';
    } else {
      roleIcon = roleIcons.DPS;
      roleType = 'DPS';
    }
    
    let value = `${roleIcon} **${member.name}**\n📋 Rôle: ${member.role}`;
    
    // Si le build a un gear prédéfini, l'afficher
    if (member.gear) {
      value += `\n🎽 Équipement:\n${member.gear}`;
    }
    
    return {
      name: `${position}. ${roleType}`,
      value: value,
      inline: false
    };
  });
  
  return {
    color: getCompositionColor(compType.name),
    title: `⚔️ ${compType.name}`,
    description: `Composition générée pour **${compType.size} joueur(s)**`,
    fields: fields,
    footer: {
      text: 'Albion Online - Générateur de Compositions'
    },
    timestamp: new Date().toISOString()
  };
}

/**
 * Génère des suggestions alternatives
 */
export function generateAlternatives(role) {
  const weaponPool = getWeaponsForRole(role);
  if (!weaponPool || weaponPool.length <= 1) return null;
  
  const alternatives = [...weaponPool]
    .sort(() => Math.random() - 0.5)
    .slice(0, 3)
    .map(w => `• ${w.name} (${w.role})`);
    
  return alternatives.join('\n');
}
