import { weapons, roles } from '../data/albion-data.js';

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
      const weaponPool = weapons[roleConfig.role];
      const randomWeapon = weaponPool[Math.floor(Math.random() * weaponPool.length)];
      composition.push({
        position: composition.length + 1,
        ...randomWeapon
      });
    }
  }
  
  return composition;
}

/**
 * Formate une composition en embed Discord
 */
export function formatCompositionEmbed(compType, composition) {
  const fields = composition.map((member, index) => {
    const position = member.position || (index + 1);
    let value = `🗡️ **${member.name}**\n📋 Rôle: ${member.role}`;
    
    // Si le build a un gear prédéfini, l'afficher
    if (member.gear) {
      value += `\n🎽 Équipement:\n${member.gear}`;
    }
    
    return {
      name: `Joueur ${position} - ${member.type}`,
      value: value,
      inline: false
    };
  });
  
  return {
    color: 0x00AE86,
    title: `⚔️ ${compType.name}`,
    description: `Composition générée pour ${compType.size} joueur(s)`,
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
  const weaponPool = weapons[role];
  if (!weaponPool || weaponPool.length <= 1) return null;
  
  const alternatives = [...weaponPool]
    .sort(() => Math.random() - 0.5)
    .slice(0, 3)
    .map(w => `• ${w.name} (${w.role})`);
    
  return alternatives.join('\n');
}
