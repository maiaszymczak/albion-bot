// Base de données des builds Albion Online
// Armes organisées par catégorie du Destiny Board

// Codes couleur Discord pour les tiers
export const tierColors = {
  Standard: 0x808080,  // Gris
  Rune: 0x00FF00,      // Vert
  Soul: 0x0099FF,      // Bleu
  Relic: 0x9900FF,     // Violet
  Avalon: 0xFF6600,    // Orange
  Crystal: 0x00FFFF    // Cyan
};

// Emojis par catégorie d'arme
export const weaponIcons = {
  // Guerrier
  sword: '⚔️',
  axe: '🪓',
  mace: '🔨',
  hammer: '⚒️',
  wargloves: '👊',
  crossbow: '🏹',
  shield: '🛡️',
  
  // Chasseur
  bow: '🏹',
  dagger: '🗡️',
  spear: '🔱',
  quarterstaff: '🥢',
  shapeshifter: '🐺',
  nature: '🌿',
  torch: '🔥',
  
  // Mage
  fire: '🔥',
  holy: '✨',
  arcane: '🔮',
  frost: '❄️',
  cursed: '💀',
  tome: '📖'
};

// Emojis par rôle
export const roleIcons = {
  Tank: '🛡️',
  DPS: '⚔️',
  Healer: '💚',
  Support: '✨',
  Scout: '👁️'
};

export const weaponsByTree = {
  // GUERRIER (Warrior)
  sword: [
    { name: 'Épée Large', tier: 'Standard', hands: 1, role: 'DPS', icon: '⚔️', color: 0x808080 },
    { name: 'Claymore', tier: 'Rune', hands: 2, role: 'DPS/Burst', icon: '⚔️', color: 0x00FF00 },
    { name: 'Épées Jumelles', tier: 'Soul', hands: 2, role: 'DPS/Mobility', icon: '⚔️', color: 0x0099FF },
    { name: 'Lame de Clarent', tier: 'Relic', hands: 2, role: 'DPS/Execute', icon: '⚔️', color: 0x9900FF },
    { name: 'Épée Taillante', tier: 'Avalon', hands: 1, role: 'DPS/Pierce', icon: '⚔️', color: 0xFF6600 },
    { name: 'Paire de Galatine', tier: 'Avalon', hands: 2, role: 'DPS/Dual', icon: '⚔️', color: 0xFF6600 },
    { name: 'Adoube-Roi', tier: 'Avalon', hands: 2, role: 'DPS/Mobile', icon: '⚔️', color: 0xFF6600 },
    { name: 'Lame Infinie', tier: 'Crystal', hands: 2, role: 'DPS/Unstoppable', icon: '⚔️', color: 0x00FFFF }
  ],
  
  axe: [
    { name: 'Hache de Bataille', tier: 'Standard', hands: 1, role: 'DPS', icon: '🪓', color: 0x808080 },
    { name: 'Grande Hache', tier: 'Rune', hands: 2, role: 'DPS/Cleave', icon: '🪓', color: 0x00FF00 },
    { name: 'Hallebarde', tier: 'Soul', hands: 2, role: 'DPS/Range', icon: '🪓', color: 0x0099FF },
    { name: 'Sonne-Charnier', tier: 'Relic', hands: 2, role: 'DPS/Execute', icon: '🪓', color: 0x9900FF },
    { name: 'Faux Infernale', tier: 'Avalon', hands: 2, role: 'DPS/AoE', icon: '🪓', color: 0xFF6600 },
    { name: 'Pattes d\'Ours', tier: 'Avalon', hands: 2, role: 'DPS/Bleed', icon: '🪓', color: 0xFF6600 },
    { name: 'Brise-Royaume', tier: 'Avalon', hands: 2, role: 'DPS/Knockback', icon: '🪓', color: 0xFF6600 },
    { name: 'Faucheuse de Cristal', tier: 'Crystal', hands: 2, role: 'DPS/Burst', icon: '🪓', color: 0x00FFFF }
  ],
  
  mace: [
    { name: 'Masse', tier: 'Standard', hands: 1, role: 'Tank/CC', icon: '🔨', color: 0x808080 },
    { name: 'Masse Lourde', tier: 'Rune', hands: 1, role: 'Tank/Stun', icon: '🔨', color: 0x00FF00 },
    { name: 'Étoile du Matin', tier: 'Soul', hands: 1, role: 'Tank/Damage', icon: '🔨', color: 0x0099FF },
    { name: 'Masse de Soubassement', tier: 'Relic', hands: 1, role: 'Scout/Vision', icon: '🔨', color: 0x9900FF },
    { name: 'Masse Incube', tier: 'Avalon', hands: 1, role: 'Tank/CC', icon: '🔨', color: 0xFF6600 },
    { name: 'Masse de Camlann', tier: 'Avalon', hands: 1, role: 'Tank/AoE', icon: '🔨', color: 0xFF6600 },
    { name: 'Garde-Serments', tier: 'Avalon', hands: 2, role: 'Tank/Protection', icon: '🔨', color: 0xFF6600 },
    { name: 'Monarque Effroyable', tier: 'Crystal', hands: 2, role: 'Tank/Fear', icon: '🔨', color: 0x00FFFF }
  ],
  
  hammer: [
    { name: 'Marteau', tier: 'Standard', hands: 1, role: 'Tank/CC', icon: '⚒️', color: 0x808080 },
    { name: 'Marteau d\'Hast', tier: 'Rune', hands: 2, role: 'Tank/Knockback', icon: '⚒️', color: 0x00FF00 },
    { name: 'Grand Marteau', tier: 'Soul', hands: 2, role: 'Tank/Stun', icon: '⚒️', color: 0x0099FF },
    { name: 'Tombe-Marteau', tier: 'Relic', hands: 2, role: 'Tank/Slow', icon: '⚒️', color: 0x9900FF },
    { name: 'Marteaux Forgés', tier: 'Avalon', hands: 2, role: 'Tank/CC', icon: '⚒️', color: 0xFF6600 },
    { name: 'Garde-Bosquet', tier: 'Avalon', hands: 2, role: 'Tank/Root', icon: '⚒️', color: 0xFF6600 },
    { name: 'Main de Justice', tier: 'Avalon', hands: 2, role: 'Tank/Judgment', icon: '⚒️', color: 0xFF6600 },
    { name: 'Marteau Éclair-Vrai', tier: 'Crystal', hands: 2, role: 'Tank/Lightning', icon: '⚒️', color: 0x00FFFF }
  ],
  
  wargloves: [
    { name: 'Gants de Bagarre', tier: 'Standard', hands: 2, role: 'DPS/Melee', icon: '👊', color: 0x808080 },
    { name: 'Brassards de Combat', tier: 'Rune', hands: 2, role: 'DPS/Brawl', icon: '👊', color: 0x00FF00 },
    { name: 'Gantelets à Pointes', tier: 'Soul', hands: 2, role: 'DPS/Bleed', icon: '👊', color: 0x0099FF },
    { name: 'Mains Ursines', tier: 'Relic', hands: 2, role: 'DPS/Claw', icon: '👊', color: 0x9900FF },
    { name: 'Mains Infernales', tier: 'Avalon', hands: 2, role: 'DPS/AoE', icon: '👊', color: 0xFF6600 },
    { name: 'Ceste Frappe-Corbeau', tier: 'Avalon', hands: 2, role: 'DPS/Chain', icon: '👊', color: 0xFF6600 },
    { name: 'Poings d\'Avalon', tier: 'Avalon', hands: 2, role: 'DPS/Magic', icon: '👊', color: 0xFF6600 },
    { name: 'Brassards Pulse-Force', tier: 'Crystal', hands: 2, role: 'DPS/Energy', icon: '👊', color: 0x00FFFF }
  ],
  
  crossbow: [
    { name: 'Arbalète', tier: 'Standard', hands: 2, role: 'DPS/Ranged', icon: '🏹', color: 0x808080 },
    { name: 'Arbalète Lourde', tier: 'Rune', hands: 2, role: 'DPS/Burst', icon: '🏹', color: 0x00FF00 },
    { name: 'Arbalète Légère', tier: 'Soul', hands: 2, role: 'DPS/Mobility', icon: '🏹', color: 0x0099FF },
    { name: 'Répétitrice Gémissante', tier: 'Relic', hands: 2, role: 'DPS/Rapid', icon: '🏹', color: 0x9900FF },
    { name: 'Lance-Carreaux', tier: 'Avalon', hands: 2, role: 'DPS/Multi', icon: '🏹', color: 0xFF6600 },
    { name: 'Arc de Siège', tier: 'Avalon', hands: 2, role: 'DPS/Siege', icon: '🏹', color: 0xFF6600 },
    { name: 'Sculpteur d\'Énergie', tier: 'Avalon', hands: 2, role: 'DPS/Laser', icon: '🏹', color: 0xFF6600 },
    { name: 'Canonnières Lumière-Arc', tier: 'Crystal', hands: 2, role: 'DPS/Beam', icon: '🏹', color: 0x00FFFF }
  ],
  
  shield: [
    { name: 'Bouclier', tier: 'Standard', hands: 1, role: 'Tank/Defense', icon: '🛡️', color: 0x808080 },
    { name: 'Sarcophage', tier: 'Relic', hands: 1, role: 'Tank/Absorb', icon: '🛡️', color: 0x9900FF },
    { name: 'Bouclier Caitiff', tier: 'Avalon', hands: 1, role: 'Tank/Reflect', icon: '🛡️', color: 0xFF6600 },
    { name: 'Brise-Face', tier: 'Avalon', hands: 1, role: 'Tank/CC', icon: '🛡️', color: 0xFF6600 },
    { name: 'Égide Astrale', tier: 'Avalon', hands: 1, role: 'Tank/Magic', icon: '🛡️', color: 0xFF6600 },
    { name: 'Garde Incassable', tier: 'Crystal', hands: 1, role: 'Tank/Shield', icon: '🛡️', color: 0x00FFFF }
  ],
  
  // CHASSEUR (Hunter)
  bow: [
    { name: 'Arc', tier: 'Standard', hands: 2, role: 'DPS/Ranged', icon: '🏹', color: 0x808080 },
    { name: 'Arc de Guerre', tier: 'Rune', hands: 2, role: 'DPS/AoE', icon: '🏹', color: 0x00FF00 },
    { name: 'Arc Long', tier: 'Soul', hands: 2, role: 'DPS/Range', icon: '🏹', color: 0x0099FF },
    { name: 'Arc Chuchoteur', tier: 'Relic', hands: 2, role: 'DPS/Stealth', icon: '🏹', color: 0x9900FF },
    { name: 'Arc Gémissant', tier: 'Avalon', hands: 2, role: 'DPS/CC', icon: '🏹', color: 0xFF6600 },
    { name: 'Arc de Badon', tier: 'Avalon', hands: 2, role: 'DPS/Pierce', icon: '🏹', color: 0xFF6600 },
    { name: 'Perce-Brume', tier: 'Avalon', hands: 2, role: 'DPS/Vision', icon: '🏹', color: 0xFF6600 },
    { name: 'Arc Marche-Ciel', tier: 'Crystal', hands: 2, role: 'DPS/Aerial', icon: '🏹', color: 0x00FFFF }
  ],
  
  dagger: [
    { name: 'Dague', tier: 'Standard', hands: 1, role: 'DPS/Assassin', icon: '🗡️', color: 0x808080 },
    { name: 'Paire de Dagues', tier: 'Rune', hands: 2, role: 'DPS/Dual', icon: '🗡️', color: 0x00FF00 },
    { name: 'Griffes', tier: 'Soul', hands: 2, role: 'DPS/Bleed', icon: '🗡️', color: 0x0099FF },
    { name: 'Saigneur', tier: 'Relic', hands: 1, role: 'Execute/Burst', icon: '🗡️', color: 0x9900FF },
    { name: 'Démoniaque', tier: 'Avalon', hands: 1, role: 'DPS/Dash', icon: '🗡️', color: 0xFF6600 },
    { name: 'Donne-Morts', tier: 'Avalon', hands: 2, role: 'DPS/Execute', icon: '🗡️', color: 0xFF6600 },
    { name: 'Fureur Bridée', tier: 'Avalon', hands: 2, role: 'DPS/Charge', icon: '🗡️', color: 0xFF6600 },
    { name: 'Pourfendeurs Jumeaux', tier: 'Crystal', hands: 2, role: 'DPS/Twin', icon: '🗡️', color: 0x00FFFF }
  ],
  
  spear: [
    { name: 'Lance', tier: 'Standard', hands: 2, role: 'DPS/Poke', icon: '🔱', color: 0x808080 },
    { name: 'Pique', tier: 'Rune', hands: 2, role: 'DPS/Range', icon: '🔱', color: 0x00FF00 },
    { name: 'Glaive', tier: 'Soul', hands: 2, role: 'DPS/Cleave', icon: '🔱', color: 0x0099FF },
    { name: 'Lance du Héron', tier: 'Relic', hands: 2, role: 'DPS/Mobility', icon: '🔱', color: 0x9900FF },
    { name: 'Chasse-Esprit', tier: 'Avalon', hands: 2, role: 'DPS/Hunt', icon: '🔱', color: 0xFF6600 },
    { name: 'Lance Trinité', tier: 'Avalon', hands: 2, role: 'DPS/Triple', icon: '🔱', color: 0xFF6600 },
    { name: 'Aube-Levante', tier: 'Avalon', hands: 2, role: 'DPS/Light', icon: '🔱', color: 0xFF6600 },
    { name: 'Glaive de Faille', tier: 'Crystal', hands: 2, role: 'DPS/Void', icon: '🔱', color: 0x00FFFF }
  ],
  
  quarterstaff: [
    { name: 'Bâton', tier: 'Standard', hands: 2, role: 'DPS/CC', icon: '🥢', color: 0x808080 },
    { name: 'Bâton Renforcé', tier: 'Rune', hands: 2, role: 'DPS/Defense', icon: '🥢', color: 0x00FF00 },
    { name: 'Bâton Double Lame', tier: 'Soul', hands: 2, role: 'DPS/Spin', icon: '🥢', color: 0x0099FF },
    { name: 'Bâton du Moine Noir', tier: 'Relic', hands: 2, role: 'DPS/Martial', icon: '🥢', color: 0x9900FF },
    { name: 'Faux d\'Âme', tier: 'Avalon', hands: 2, role: 'Execute/Reset', icon: '🥢', color: 0xFF6600 },
    { name: 'Bâton d\'Équilibre', tier: 'Avalon', hands: 2, role: 'DPS/Balance', icon: '🥢', color: 0xFF6600 },
    { name: 'Quête-Graal', tier: 'Avalon', hands: 2, role: 'DPS/Holy', icon: '🥢', color: 0xFF6600 },
    { name: 'Lame Jumelle Fantôme', tier: 'Crystal', hands: 2, role: 'DPS/Ghost', icon: '🥢', color: 0x00FFFF }
  ],
  
  shapeshifter: [
    { name: 'Bâton Rôdeur', tier: 'Standard', hands: 2, role: 'DPS/Transform', icon: '🐺', color: 0x808080 },
    { name: 'Bâton Enraciné', tier: 'Rune', hands: 2, role: 'DPS/Root', icon: '🐺', color: 0x00FF00 },
    { name: 'Bâton Primal', tier: 'Soul', hands: 2, role: 'DPS/Beast', icon: '🐺', color: 0x0099FF },
    { name: 'Bâton Lune de Sang', tier: 'Relic', hands: 2, role: 'DPS/Feral', icon: '🐺', color: 0x9900FF },
    { name: 'Bâton Progéniture', tier: 'Avalon', hands: 2, role: 'DPS/Summon', icon: '🐺', color: 0xFF6600 },
    { name: 'Bâton Rune-Terre', tier: 'Avalon', hands: 2, role: 'DPS/Earth', icon: '🐺', color: 0xFF6600 },
    { name: 'Appelle-Lumière', tier: 'Avalon', hands: 2, role: 'DPS/Light', icon: '🐺', color: 0xFF6600 },
    { name: 'Bâton Regard-Fixe', tier: 'Crystal', hands: 2, role: 'DPS/Gaze', icon: '🐺', color: 0x00FFFF }
  ],
  
  nature: [
    { name: 'Bâton de Nature', tier: 'Standard', hands: 1, role: 'Healer/HoT', icon: '🌿', color: 0x808080 },
    { name: 'Grand Bâton de Nature', tier: 'Rune', hands: 2, role: 'Healer/Group', icon: '🌿', color: 0x00FF00 },
    { name: 'Bâton Sauvage', tier: 'Soul', hands: 1, role: 'Healer/Mobile', icon: '🌿', color: 0x0099FF },
    { name: 'Bâton Druidique', tier: 'Relic', hands: 1, role: 'Healer/Druid', icon: '🌿', color: 0x9900FF },
    { name: 'Bâton Fléau', tier: 'Avalon', hands: 1, role: 'Healer/DoT', icon: '🌿', color: 0xFF6600 },
    { name: 'Bâton Déchaîné', tier: 'Avalon', hands: 2, role: 'Healer/Power', icon: '🌿', color: 0xFF6600 },
    { name: 'Bâton Racine-Fer', tier: 'Avalon', hands: 1, role: 'Healer/Tank', icon: '🌿', color: 0xFF6600 },
    { name: 'Bâton Écorce-Forge', tier: 'Crystal', hands: 2, role: 'Healer/Shield', icon: '🌿', color: 0x00FFFF }
  ],
  
  torch: [
    { name: 'Torche', tier: 'Standard', hands: 1, role: 'Support/Utility', icon: '🔥', color: 0x808080 },
    { name: 'Appeleur de Brume', tier: 'Relic', hands: 1, role: 'Support/Stealth', icon: '🔥', color: 0x9900FF },
    { name: 'Canne Grimaçante', tier: 'Avalon', hands: 1, role: 'Support/CC', icon: '🔥', color: 0xFF6600 },
    { name: 'Bougie Crypte', tier: 'Avalon', hands: 1, role: 'Support/Dark', icon: '🔥', color: 0xFF6600 },
    { name: 'Sceptre Sacré', tier: 'Avalon', hands: 1, role: 'Support/Holy', icon: '🔥', color: 0xFF6600 },
    { name: 'Torche Flamme-Bleue', tier: 'Crystal', hands: 1, role: 'Support/Fire', icon: '🔥', color: 0x00FFFF }
  ],
  
  // MAGE (Mage)
  fire: [
    { name: 'Bâton de Feu', tier: 'Standard', hands: 1, role: 'DPS/Fire', icon: '🔥', color: 0x808080 },
    { name: 'Grand Bâton de Feu', tier: 'Rune', hands: 2, role: 'DPS/AoE', icon: '🔥', color: 0x00FF00 },
    { name: 'Bâton Infernal', tier: 'Soul', hands: 1, role: 'DPS/DoT', icon: '🔥', color: 0x0099FF },
    { name: 'Bâton Feu Sauvage', tier: 'Relic', hands: 1, role: 'DPS/Wild', icon: '🔥', color: 0x9900FF },
    { name: 'Bâton Soufre', tier: 'Avalon', hands: 1, role: 'DPS/Burn', icon: '🔥', color: 0xFF6600 },
    { name: 'Bâton Ardent', tier: 'Avalon', hands: 2, role: 'DPS/Burst', icon: '🔥', color: 0xFF6600 },
    { name: 'Aube-Chant', tier: 'Avalon', hands: 2, role: 'DPS/Song', icon: '🔥', color: 0xFF6600 },
    { name: 'Bâton Marche-Flamme', tier: 'Crystal', hands: 2, role: 'DPS/Walk', icon: '🔥', color: 0x00FFFF }
  ],
  
  holy: [
    { name: 'Bâton Sacré', tier: 'Standard', hands: 1, role: 'Healer/Single', icon: '✨', color: 0x808080 },
    { name: 'Grand Bâton Sacré', tier: 'Rune', hands: 2, role: 'Healer/AoE', icon: '✨', color: 0x00FF00 },
    { name: 'Bâton Divin', tier: 'Soul', hands: 1, role: 'Healer/Burst', icon: '✨', color: 0x0099FF },
    { name: 'Bâton Touche-Vie', tier: 'Relic', hands: 1, role: 'Healer/Touch', icon: '✨', color: 0x9900FF },
    { name: 'Bâton Déchu', tier: 'Avalon', hands: 1, role: 'Healer/Party', icon: '✨', color: 0xFF6600 },
    { name: 'Bâton Rédemption', tier: 'Avalon', hands: 2, role: 'Healer/Revive', icon: '✨', color: 0xFF6600 },
    { name: 'Chute-Bénie', tier: 'Avalon', hands: 2, role: 'Healer/Rain', icon: '✨', color: 0xFF6600 },
    { name: 'Bâton Exalté', tier: 'Crystal', hands: 2, role: 'Healer/Power', icon: '✨', color: 0x00FFFF }
  ],
  
  arcane: [
    { name: 'Bâton Arcane', tier: 'Standard', hands: 1, role: 'DPS/Magic', icon: '🔮', color: 0x808080 },
    { name: 'Grand Bâton Arcane', tier: 'Rune', hands: 2, role: 'DPS/Beam', icon: '🔮', color: 0x00FF00 },
    { name: 'Bâton Énigmatique', tier: 'Soul', hands: 1, role: 'DPS/Mystery', icon: '🔮', color: 0x0099FF },
    { name: 'Bâton Sorcellerie', tier: 'Relic', hands: 1, role: 'DPS/Witch', icon: '🔮', color: 0x9900FF },
    { name: 'Bâton Occulte', tier: 'Avalon', hands: 1, role: 'DPS/Dark', icon: '🔮', color: 0xFF6600 },
    { name: 'Locus Malveillant', tier: 'Avalon', hands: 2, role: 'DPS/Curse', icon: '🔮', color: 0xFF6600 },
    { name: 'Chant du Soir', tier: 'Avalon', hands: 2, role: 'DPS/Night', icon: '🔮', color: 0xFF6600 },
    { name: 'Bâton Astral', tier: 'Crystal', hands: 2, role: 'DPS/Stars', icon: '🔮', color: 0x00FFFF }
  ],
  
  frost: [
    { name: 'Bâton de Givre', tier: 'Standard', hands: 1, role: 'DPS/Slow', icon: '❄️', color: 0x808080 },
    { name: 'Grand Bâton de Givre', tier: 'Rune', hands: 2, role: 'DPS/Freeze', icon: '❄️', color: 0x00FF00 },
    { name: 'Bâton Glacial', tier: 'Soul', hands: 1, role: 'DPS/Ice', icon: '❄️', color: 0x0099FF },
    { name: 'Bâton Givre-Blanc', tier: 'Relic', hands: 1, role: 'DPS/Chill', icon: '❄️', color: 0x9900FF },
    { name: 'Bâton Glaçon', tier: 'Avalon', hands: 1, role: 'DPS/Spike', icon: '❄️', color: 0xFF6600 },
    { name: 'Prisme Pergélisol', tier: 'Avalon', hands: 2, role: 'DPS/Prism', icon: '❄️', color: 0xFF6600 },
    { name: 'Hurle-Givre', tier: 'Avalon', hands: 2, role: 'DPS/CC', icon: '❄️', color: 0xFF6600 },
    { name: 'Bâton Arctique', tier: 'Crystal', hands: 2, role: 'DPS/Arctic', icon: '❄️', color: 0x00FFFF }
  ],
  
  cursed: [
    { name: 'Bâton Maudit', tier: 'Standard', hands: 1, role: 'DPS/DoT', icon: '💀', color: 0x808080 },
    { name: 'Grand Bâton Maudit', tier: 'Rune', hands: 2, role: 'DPS/AoE', icon: '💀', color: 0x00FF00 },
    { name: 'Bâton Démoniaque', tier: 'Soul', hands: 1, role: 'DPS/Demon', icon: '💀', color: 0x0099FF },
    { name: 'Bâton Malédiction-Vie', tier: 'Relic', hands: 1, role: 'DPS/Drain', icon: '💀', color: 0x9900FF },
    { name: 'Crâne Maudit', tier: 'Avalon', hands: 1, role: 'DPS/Skull', icon: '💀', color: 0xFF6600 },
    { name: 'Bâton Damnation', tier: 'Avalon', hands: 2, role: 'DPS/Hell', icon: '💀', color: 0xFF6600 },
    { name: 'Appelle-Ombre', tier: 'Avalon', hands: 2, role: 'DPS/Shadow', icon: '💀', color: 0xFF6600 },
    { name: 'Bâton Appelle-Putréfaction', tier: 'Crystal', hands: 2, role: 'DPS/Rot', icon: '💀', color: 0x00FFFF }
  ],
  
  tome: [
    { name: 'Tome de Sorts', tier: 'Standard', hands: 1, role: 'Support/Magic', icon: '📖', color: 0x808080 },
    { name: 'Œil des Secrets', tier: 'Relic', hands: 1, role: 'Support/Vision', icon: '📖', color: 0x9900FF },
    { name: 'Muisak', tier: 'Avalon', hands: 1, role: 'Support/Debuff', icon: '📖', color: 0xFF6600 },
    { name: 'Racine-Pivot', tier: 'Avalon', hands: 1, role: 'Support/Root', icon: '📖', color: 0xFF6600 },
    { name: 'Encensoir Céleste', tier: 'Avalon', hands: 1, role: 'Support/Buff', icon: '📖', color: 0xFF6600 },
    { name: 'Grimoire Verrou-Temps', tier: 'Crystal', hands: 1, role: 'Support/Time', icon: '📖', color: 0x00FFFF }
  ]
};

// Organisation simplifiée par rôle pour les compositions
export const weapons = {
  tank: [
    'Masse Incube', 'Marteaux Forgés', 'Garde-Serments', 
    'Grand Marteau', 'Masse Lourde', 'Masse de Soubassement',
    'Masse de Camlann', 'Main de Justice', 'Brise-Face',
    'Bouclier Caitiff', 'Sarcophage', 'Garde Incassable'
  ],
  
  melee_dps: [
    'Claymore', 'Épées Jumelles', 'Adoube-Roi', 'Lame de Clarent',
    'Grande Hache', 'Hallebarde', 'Pattes d\'Ours', 'Faux Infernale',
    'Saigneur', 'Paire de Dagues', 'Griffes', 'Démoniaque',
    'Lance', 'Glaive', 'Lance Trinité', 'Faux d\'Âme',
    'Mains Infernales', 'Gantelets à Pointes', 'Brassards de Combat'
  ],
  
  ranged_dps: [
    'Arc Long', 'Arc de Guerre', 'Arc Gémissant',
    'Arbalète Lourde', 'Répétitrice Gémissante', 'Lance-Carreaux',
    'Bâton de Feu', 'Grand Bâton de Feu', 'Bâton Ardent',
    'Bâton de Givre', 'Grand Bâton de Givre', 'Hurle-Givre', 'Bâton Arctique',
    'Bâton Arcane', 'Grand Bâton Arcane', 'Bâton Astral',
    'Bâton Maudit', 'Bâton Démoniaque', 'Appelle-Ombre'
  ],
  
  healer: [
    'Bâton Sacré', 'Grand Bâton Sacré', 'Bâton Divin', 'Bâton Déchu',
    'Bâton de Nature', 'Grand Bâton de Nature', 'Bâton Sauvage', 'Bâton Druidique',
    'Chute-Bénie', 'Bâton Rédemption', 'Bâton Fléau'
  ],
  
  support: [
    'Appeleur de Brume', 'Canne Grimaçante', 'Bougie Crypte', 'Sceptre Sacré',
    'Tome de Sorts', 'Œil des Secrets', 'Encensoir Céleste', 'Muisak'
  ],
  
  scout: [
    'Masse de Soubassement', 'Saigneur', 'Arc Chuchoteur', 'Perce-Brume'
  ]
};

export const roles = {
  TANK: 'tank',
  MELEE_DPS: 'melee_dps',
  RANGED_DPS: 'ranged_dps',
  HEALER: 'healer',
  SCOUT: 'scout',
  FINISH: 'finish'
};

export const armor = {
  // Casques
  helmets: {
    tank: ['Casque Judicateur', 'Casque de Gardien', 'Casque de Chevalier', 'Casque Gravé'],
    dps: ['Capuche Assassin', 'Capuche Traqueur', 'Casque Soldat', 'Capuche de Chasseur', 'Casque du Spectre'],
    healer: ['Capuchon Druide', 'Capuche de Clerc', 'Capuche de Mage', 'Capuchon de Sage'],
    hybrid: ['Casque Royal', 'Casque de Mercenaire', 'Capuche Avalon']
  },
  
  // Armures
  chestpieces: {
    tank: ['Armure de plaques', 'Armure de Gardien', 'Armure de Chevalier', 'Armure Gravée', 'Armure Démoniaque'],
    dps: ['Veste d\'Assassin', 'Veste d\'Hellion', 'Veste de Chasseur', 'Armure de Stalker', 'Armure du Spectre', 'Veste de Cuir'],
    healer: ['Robe de Clerc', 'Robe de Druide', 'Robe de Mage', 'Robe de Sage', 'Armure de Tissu'],
    hybrid: ['Armure Royale', 'Veste de Mercenaire', 'Armure Avalon']
  },
  
  // Chaussures
  boots: {
    tank: ['Bottes Soldats', 'Bottes de Gardien', 'Bottes de Chevalier', 'Bottes Gravées', 'Bottes Démoniaque'],
    dps: ['Chaussures Cuir', 'Sandales Royales', 'Chaussures Chasseur', 'Bottes de Stalker', 'Sandales du Spectre', 'Bottes d\'Assassin'],
    healer: ['Sandales de Clerc', 'Sandales de Druide', 'Sandales de Mage', 'Sandales de Sage', 'Chaussures de Tissu'],
    mobility: ['Bottes Pêcheur', 'Bottes Crépusculaires', 'Sandales Culte'],
    hybrid: ['Sandales Royales', 'Bottes de Mercenaire', 'Bottes Avalon']
  },
  
  // Sets complets pour référence
  tank: ['Armure de plaques', 'Armure de gardien'],
  dps: ['Armure de cuir', 'Veste d\'assassin', 'Veste d\'hellion'],
  healer: ['Armure de tissu', 'Robe de clerc', 'Robe de druide'],
  hybrid: ['Armure royale', 'Veste de mercenaire']
};

// Compositions prédéfinies
export const compositions = {
  pvp_5v5: {
    name: 'Composition PvP 5v5',
    size: 5,
    template: [
      { role: roles.TANK, count: 1 },
      { role: roles.MELEE_DPS, count: 1 },
      { role: roles.RANGED_DPS, count: 2 },
      { role: roles.HEALER, count: 1 }
    ]
  },
  
  dungeon_static: {
    name: 'Donjon Statique (5 joueurs)',
    size: 5,
    template: [
      { role: roles.TANK, count: 1 },
      { role: roles.MELEE_DPS, count: 1 },
      { role: roles.RANGED_DPS, count: 2 },
      { role: roles.HEALER, count: 1 }
    ]
  },
  
  avalonian_raid: {
    name: 'Raid Avalonian (10 joueurs)',
    size: 10,
    template: [
      { role: roles.TANK, count: 2 },
      { role: roles.MELEE_DPS, count: 2 },
      { role: roles.RANGED_DPS, count: 4 },
      { role: roles.HEALER, count: 2 }
    ]
  },
  
  clap_pvp: {
    name: 'CLAP PvP (8 joueurs)',
    size: 8,
    preset: [
      { name: 'Masse Incube', type: 'Tank', role: 'Frontline/CC', gear: 'Mandebrume + Capuche Assassin + Armure Gardien + Sandales Culte + Bridgewatch + Omelette T7' },
      { name: 'Grand Esotérique', type: 'Support CC', role: 'Frontline/Support', gear: 'Capuche Assassin + Veste Royale + Chaussures Cuir + Bridgewatch + Omelette T7' },
      { name: 'Esotorque 1H', type: 'Support CC', role: 'Frontline/CC', gear: 'Canne Grimaçante + Capuche Assassin + Armure Gardien + Chaussures Chasseur + Bridgewatch + Sandwich Ava T8' },
      { name: 'Souchefer', type: 'DPS Main Heal', role: 'Damage/Execute', gear: 'Encens Celeste + Capuche Assassin + Veste Royale + Chaussures Cuir + Lymhurst + Omelette T7' },
      { name: 'Mande-Ténèbre', type: 'DPS', role: 'Burst/Damage', gear: 'Bougie Crypte + Capuche Traqueur + Robe Druide + Sandales Royales + Caerleon + Ragout Anguille T8' },
      { name: 'Bâton Ardent', type: 'DPS', role: 'AoE/Burst', gear: 'Capuche Assassin + Robe Druide + Sandales Royales + Caerleon + Ragout T8' },
      { name: 'Bâton Déchu', type: 'Party Heal', role: 'Main Healer', gear: 'Capuchon Druide + Robe Royale + Chaussures Cuir + Lymhurst + Omelette T7' },
      { name: 'Masse de Soubassement', type: 'Scout', role: 'Vision/Mobility', gear: 'Mandebrume + Casque Judicateur + Armure Crépusculaire + Bottes Pêcheur/Crépusculaires + Fort Sterling + Tourte T7' }
    ]
  },
  
  brawl_pvp: {
    name: 'PvP Brawl (10 joueurs)',
    size: 10,
    preset: [
      { name: 'Sanctificateur', type: 'Healer', role: 'Main Healer', gear: 'Brise-face + Soldat + Pureté + Mercenaire/Royales + Lym + Omelette ava + Gig' },
      { name: 'Fléau', type: 'Healer', role: 'Cleanse/Heal', gear: 'Cleans + Pureté + Mercenaire/Royales + Lym + Omelette ava + Gig' },
      { name: 'Marteaux Forgés', type: 'Tank', role: 'Frontline/CC', gear: 'Tourmenteur + Judicateur + Tranqueur/Royales + Lym + Omelette ava + Gig' },
      { name: 'Garde-Serments', type: 'Tank', role: 'Frontline/Protection', gear: 'Tourmenteur + Armure Royale + Tranqueur/Royales + Lym/Contrebandier + Omelette ava + Gig' },
      { name: 'Carving', type: 'Pierce', role: 'Damage/Poke', gear: 'Tourmenteur + Tourmenteur + Tranqueur/Royales + Lym + Ragout + Gig' },
      { name: 'Pattes d\'ours', type: 'DPS', role: 'Sustained Damage', gear: 'Soldat + Tourmenteur + Tranqueur/Royales + Lym + Ragout + Gig' },
      { name: 'Pattes d\'ours', type: 'DPS', role: 'Sustained Damage', gear: 'Soldat + Tourmenteur + Tranqueur/Royales + Lym + Ragout + Gig' },
      { name: 'Adoube-Roi', type: 'DPS', role: 'Damage/Mobile', gear: 'Soldat + Tourmenteur + Tranqueur/Royales + Lym + Ragout + Gig' },
      { name: 'Mains infernales', type: 'DPS', role: 'Damage/AoE', gear: 'Soldat + Tourmenteur + Tranqueur/Royales + Lym + Ragout + Gig' },
      { name: 'Saigneur', type: 'Finish', role: 'Execute/Burst', gear: 'Soldat + Veste Assassin + Tranqueur/Royales + Mart/Contrebandier + Ragout + Gig' }
    ]
  },
  
  zvz: {
    name: 'ZvZ (20 joueurs)',
    size: 20,
    template: [
      { role: roles.TANK, count: 4 },
      { role: roles.MELEE_DPS, count: 4 },
      { role: roles.RANGED_DPS, count: 8 },
      { role: roles.HEALER, count: 4 }
    ]
  },
  
  corrupted_dungeon: {
    name: 'Donjon Corrompu (Solo)',
    size: 1,
    description: 'Builds recommandés pour le PvP 1v1 en donjon corrompu',
    preset: [
      { 
        name: 'Saigneur', 
        type: 'Assassin 1v1', 
        role: 'Execute/Burst', 
        tier: 'Meta',
        gear: 'Capuche Assassin + Veste Assassin + Chaussures Soldat + Pâté Anguille T8',
        description: 'Build assassin burst avec forte mobilité et damage'
      },
      { 
        name: 'Claymore', 
        type: 'DPS Bruiser', 
        role: 'Sustained/Burst', 
        tier: 'Meta',
        gear: 'Casque Soldat + Armure Chasseur + Bottes Soldat + Pâté T8',
        description: 'Build équilibré avec bon damage et sustain'
      },
      { 
        name: 'Démoniaque', 
        type: 'Kite/Mobility', 
        role: 'High Mobility', 
        tier: 'Meta',
        gear: 'Capuche Traqueur + Veste Assassin + Chaussures Assassin + Pâté T8',
        description: 'Build ultra mobile pour kiter et punish'
      },
      { 
        name: 'Bâton du Moine Noir', 
        type: 'Bruiser/CC', 
        role: 'Control/Damage', 
        tier: 'Viable',
        gear: 'Capuche Traqueur + Veste Chasseur + Bottes Soldat + Pâté T8',
        description: 'Build avec CC et bon damage soutenu'
      },
      { 
        name: 'Arc Long', 
        type: 'Ranged Kite', 
        role: 'Range/Poke', 
        tier: 'Viable',
        gear: 'Capuche Traqueur + Veste Assassin + Bottes Soldat + Pâté T8',
        description: 'Build ranged pour maintenir la distance'
      },
      { 
        name: 'Bâton Glacial', 
        type: 'Mage Kite', 
        role: 'CC/Damage', 
        tier: 'Viable',
        gear: 'Capuche Mage + Robe Mage + Sandales Mage + Pâté T8',
        description: 'Build mage avec slow et burst damage'
      },
      { 
        name: 'Bâton Infernal', 
        type: 'DoT/Sustain', 
        role: 'Damage/Heal', 
        tier: 'Situational',
        gear: 'Capuche Mage + Robe Mage + Sandales Mage + Pâté T8',
        description: 'Build DoT avec heal pour long fights'
      },
      { 
        name: 'Faux d\'Âme', 
        type: 'Reset Fighter', 
        role: 'Execute/Reset', 
        tier: 'High Skill',
        gear: 'Casque Soldat + Veste Assassin + Bottes Soldat + Pâté T8',
        description: 'Build high-risk high-reward avec reset sur kill'
      }
    ]
  }
};
