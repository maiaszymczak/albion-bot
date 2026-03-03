// Base de données des builds Albion Online
// Armes organisées par catégorie du Destiny Board

export const weaponsByTree = {
  // GUERRIER (Warrior)
  sword: [
    { name: 'Épée Large', tier: 'Standard', hands: 1, role: 'DPS' },
    { name: 'Claymore', tier: 'Rune', hands: 2, role: 'DPS/Burst' },
    { name: 'Épées Jumelles', tier: 'Soul', hands: 2, role: 'DPS/Mobility' },
    { name: 'Lame de Clarent', tier: 'Relic', hands: 2, role: 'DPS/Execute' },
    { name: 'Épée Taillante', tier: 'Avalon', hands: 1, role: 'DPS/Pierce' },
    { name: 'Paire de Galatine', tier: 'Avalon', hands: 2, role: 'DPS/Dual' },
    { name: 'Adoube-Roi', tier: 'Avalon', hands: 2, role: 'DPS/Mobile' },
    { name: 'Lame Infinie', tier: 'Crystal', hands: 2, role: 'DPS/Unstoppable' }
  ],
  
  axe: [
    { name: 'Hache de Bataille', tier: 'Standard', hands: 1, role: 'DPS' },
    { name: 'Grande Hache', tier: 'Rune', hands: 2, role: 'DPS/Cleave' },
    { name: 'Hallebarde', tier: 'Soul', hands: 2, role: 'DPS/Range' },
    { name: 'Sonne-Charnier', tier: 'Relic', hands: 2, role: 'DPS/Execute' },
    { name: 'Faux Infernale', tier: 'Avalon', hands: 2, role: 'DPS/AoE' },
    { name: 'Pattes d\'Ours', tier: 'Avalon', hands: 2, role: 'DPS/Bleed' },
    { name: 'Brise-Royaume', tier: 'Avalon', hands: 2, role: 'DPS/Knockback' },
    { name: 'Faucheuse de Cristal', tier: 'Crystal', hands: 2, role: 'DPS/Burst' }
  ],
  
  mace: [
    { name: 'Masse', tier: 'Standard', hands: 1, role: 'Tank/CC' },
    { name: 'Masse Lourde', tier: 'Rune', hands: 1, role: 'Tank/Stun' },
    { name: 'Étoile du Matin', tier: 'Soul', hands: 1, role: 'Tank/Damage' },
    { name: 'Masse de Soubassement', tier: 'Relic', hands: 1, role: 'Scout/Vision' },
    { name: 'Masse Incube', tier: 'Avalon', hands: 1, role: 'Tank/CC' },
    { name: 'Masse de Camlann', tier: 'Avalon', hands: 1, role: 'Tank/AoE' },
    { name: 'Garde-Serments', tier: 'Avalon', hands: 2, role: 'Tank/Protection' },
    { name: 'Monarque Effroyable', tier: 'Crystal', hands: 2, role: 'Tank/Fear' }
  ],
  
  hammer: [
    { name: 'Marteau', tier: 'Standard', hands: 1, role: 'Tank/CC' },
    { name: 'Marteau d\'Hast', tier: 'Rune', hands: 2, role: 'Tank/Knockback' },
    { name: 'Grand Marteau', tier: 'Soul', hands: 2, role: 'Tank/Stun' },
    { name: 'Tombe-Marteau', tier: 'Relic', hands: 2, role: 'Tank/Slow' },
    { name: 'Marteaux Forgés', tier: 'Avalon', hands: 2, role: 'Tank/CC' },
    { name: 'Garde-Bosquet', tier: 'Avalon', hands: 2, role: 'Tank/Root' },
    { name: 'Main de Justice', tier: 'Avalon', hands: 2, role: 'Tank/Judgment' },
    { name: 'Marteau Éclair-Vrai', tier: 'Crystal', hands: 2, role: 'Tank/Lightning' }
  ],
  
  wargloves: [
    { name: 'Gants de Bagarre', tier: 'Standard', hands: 2, role: 'DPS/Melee' },
    { name: 'Brassards de Combat', tier: 'Rune', hands: 2, role: 'DPS/Brawl' },
    { name: 'Gantelets à Pointes', tier: 'Soul', hands: 2, role: 'DPS/Bleed' },
    { name: 'Mains Ursines', tier: 'Relic', hands: 2, role: 'DPS/Claw' },
    { name: 'Mains Infernales', tier: 'Avalon', hands: 2, role: 'DPS/AoE' },
    { name: 'Ceste Frappe-Corbeau', tier: 'Avalon', hands: 2, role: 'DPS/Chain' },
    { name: 'Poings d\'Avalon', tier: 'Avalon', hands: 2, role: 'DPS/Magic' },
    { name: 'Brassards Pulse-Force', tier: 'Crystal', hands: 2, role: 'DPS/Energy' }
  ],
  
  crossbow: [
    { name: 'Arbalète', tier: 'Standard', hands: 2, role: 'DPS/Ranged' },
    { name: 'Arbalète Lourde', tier: 'Rune', hands: 2, role: 'DPS/Burst' },
    { name: 'Arbalète Légère', tier: 'Soul', hands: 2, role: 'DPS/Mobility' },
    { name: 'Répétitrice Gémissante', tier: 'Relic', hands: 2, role: 'DPS/Rapid' },
    { name: 'Lance-Carreaux', tier: 'Avalon', hands: 2, role: 'DPS/Multi' },
    { name: 'Arc de Siège', tier: 'Avalon', hands: 2, role: 'DPS/Siege' },
    { name: 'Sculpteur d\'Énergie', tier: 'Avalon', hands: 2, role: 'DPS/Laser' },
    { name: 'Canonnières Lumière-Arc', tier: 'Crystal', hands: 2, role: 'DPS/Beam' }
  ],
  
  shield: [
    { name: 'Bouclier', tier: 'Standard', hands: 1, role: 'Tank/Defense' },
    { name: 'Sarcophage', tier: 'Relic', hands: 1, role: 'Tank/Absorb' },
    { name: 'Bouclier Caitiff', tier: 'Avalon', hands: 1, role: 'Tank/Reflect' },
    { name: 'Brise-Face', tier: 'Avalon', hands: 1, role: 'Tank/CC' },
    { name: 'Égide Astrale', tier: 'Avalon', hands: 1, role: 'Tank/Magic' },
    { name: 'Garde Incassable', tier: 'Crystal', hands: 1, role: 'Tank/Shield' }
  ],
  
  // CHASSEUR (Hunter)
  bow: [
    { name: 'Arc', tier: 'Standard', hands: 2, role: 'DPS/Ranged' },
    { name: 'Arc de Guerre', tier: 'Rune', hands: 2, role: 'DPS/AoE' },
    { name: 'Arc Long', tier: 'Soul', hands: 2, role: 'DPS/Range' },
    { name: 'Arc Chuchoteur', tier: 'Relic', hands: 2, role: 'DPS/Stealth' },
    { name: 'Arc Gémissant', tier: 'Avalon', hands: 2, role: 'DPS/CC' },
    { name: 'Arc de Badon', tier: 'Avalon', hands: 2, role: 'DPS/Pierce' },
    { name: 'Perce-Brume', tier: 'Avalon', hands: 2, role: 'DPS/Vision' },
    { name: 'Arc Marche-Ciel', tier: 'Crystal', hands: 2, role: 'DPS/Aerial' }
  ],
  
  dagger: [
    { name: 'Dague', tier: 'Standard', hands: 1, role: 'DPS/Assassin' },
    { name: 'Paire de Dagues', tier: 'Rune', hands: 2, role: 'DPS/Dual' },
    { name: 'Griffes', tier: 'Soul', hands: 2, role: 'DPS/Bleed' },
    { name: 'Saigneur', tier: 'Relic', hands: 1, role: 'Execute/Burst' },
    { name: 'Démoniaque', tier: 'Avalon', hands: 1, role: 'DPS/Dash' },
    { name: 'Donne-Morts', tier: 'Avalon', hands: 2, role: 'DPS/Execute' },
    { name: 'Fureur Bridée', tier: 'Avalon', hands: 2, role: 'DPS/Charge' },
    { name: 'Pourfendeurs Jumeaux', tier: 'Crystal', hands: 2, role: 'DPS/Twin' }
  ],
  
  spear: [
    { name: 'Lance', tier: 'Standard', hands: 2, role: 'DPS/Poke' },
    { name: 'Pique', tier: 'Rune', hands: 2, role: 'DPS/Range' },
    { name: 'Glaive', tier: 'Soul', hands: 2, role: 'DPS/Cleave' },
    { name: 'Lance du Héron', tier: 'Relic', hands: 2, role: 'DPS/Mobility' },
    { name: 'Chasse-Esprit', tier: 'Avalon', hands: 2, role: 'DPS/Hunt' },
    { name: 'Lance Trinité', tier: 'Avalon', hands: 2, role: 'DPS/Triple' },
    { name: 'Aube-Levante', tier: 'Avalon', hands: 2, role: 'DPS/Light' },
    { name: 'Glaive de Faille', tier: 'Crystal', hands: 2, role: 'DPS/Void' }
  ],
  
  quarterstaff: [
    { name: 'Bâton', tier: 'Standard', hands: 2, role: 'DPS/CC' },
    { name: 'Bâton Renforcé', tier: 'Rune', hands: 2, role: 'DPS/Defense' },
    { name: 'Bâton Double Lame', tier: 'Soul', hands: 2, role: 'DPS/Spin' },
    { name: 'Bâton du Moine Noir', tier: 'Relic', hands: 2, role: 'DPS/Martial' },
    { name: 'Faux d\'Âme', tier: 'Avalon', hands: 2, role: 'Execute/Reset' },
    { name: 'Bâton d\'Équilibre', tier: 'Avalon', hands: 2, role: 'DPS/Balance' },
    { name: 'Quête-Graal', tier: 'Avalon', hands: 2, role: 'DPS/Holy' },
    { name: 'Lame Jumelle Fantôme', tier: 'Crystal', hands: 2, role: 'DPS/Ghost' }
  ],
  
  shapeshifter: [
    { name: 'Bâton Rôdeur', tier: 'Standard', hands: 2, role: 'DPS/Transform' },
    { name: 'Bâton Enraciné', tier: 'Rune', hands: 2, role: 'DPS/Root' },
    { name: 'Bâton Primal', tier: 'Soul', hands: 2, role: 'DPS/Beast' },
    { name: 'Bâton Lune de Sang', tier: 'Relic', hands: 2, role: 'DPS/Feral' },
    { name: 'Bâton Progéniture', tier: 'Avalon', hands: 2, role: 'DPS/Summon' },
    { name: 'Bâton Rune-Terre', tier: 'Avalon', hands: 2, role: 'DPS/Earth' },
    { name: 'Appelle-Lumière', tier: 'Avalon', hands: 2, role: 'DPS/Light' },
    { name: 'Bâton Regard-Fixe', tier: 'Crystal', hands: 2, role: 'DPS/Gaze' }
  ],
  
  nature: [
    { name: 'Bâton de Nature', tier: 'Standard', hands: 1, role: 'Healer/HoT' },
    { name: 'Grand Bâton de Nature', tier: 'Rune', hands: 2, role: 'Healer/Group' },
    { name: 'Bâton Sauvage', tier: 'Soul', hands: 1, role: 'Healer/Mobile' },
    { name: 'Bâton Druidique', tier: 'Relic', hands: 1, role: 'Healer/Druid' },
    { name: 'Bâton Fléau', tier: 'Avalon', hands: 1, role: 'Healer/DoT' },
    { name: 'Bâton Déchaîné', tier: 'Avalon', hands: 2, role: 'Healer/Power' },
    { name: 'Bâton Racine-Fer', tier: 'Avalon', hands: 1, role: 'Healer/Tank' },
    { name: 'Bâton Écorce-Forge', tier: 'Crystal', hands: 2, role: 'Healer/Shield' }
  ],
  
  torch: [
    { name: 'Torche', tier: 'Standard', hands: 1, role: 'Support/Utility' },
    { name: 'Appeleur de Brume', tier: 'Relic', hands: 1, role: 'Support/Stealth' },
    { name: 'Canne Grimaçante', tier: 'Avalon', hands: 1, role: 'Support/CC' },
    { name: 'Bougie Crypte', tier: 'Avalon', hands: 1, role: 'Support/Dark' },
    { name: 'Sceptre Sacré', tier: 'Avalon', hands: 1, role: 'Support/Holy' },
    { name: 'Torche Flamme-Bleue', tier: 'Crystal', hands: 1, role: 'Support/Fire' }
  ],
  
  // MAGE (Mage)
  fire: [
    { name: 'Bâton de Feu', tier: 'Standard', hands: 1, role: 'DPS/Fire' },
    { name: 'Grand Bâton de Feu', tier: 'Rune', hands: 2, role: 'DPS/AoE' },
    { name: 'Bâton Infernal', tier: 'Soul', hands: 1, role: 'DPS/DoT' },
    { name: 'Bâton Feu Sauvage', tier: 'Relic', hands: 1, role: 'DPS/Wild' },
    { name: 'Bâton Soufre', tier: 'Avalon', hands: 1, role: 'DPS/Burn' },
    { name: 'Bâton Ardent', tier: 'Avalon', hands: 2, role: 'DPS/Burst' },
    { name: 'Aube-Chant', tier: 'Avalon', hands: 2, role: 'DPS/Song' },
    { name: 'Bâton Marche-Flamme', tier: 'Crystal', hands: 2, role: 'DPS/Walk' }
  ],
  
  holy: [
    { name: 'Bâton Sacré', tier: 'Standard', hands: 1, role: 'Healer/Single' },
    { name: 'Grand Bâton Sacré', tier: 'Rune', hands: 2, role: 'Healer/AoE' },
    { name: 'Bâton Divin', tier: 'Soul', hands: 1, role: 'Healer/Burst' },
    { name: 'Bâton Touche-Vie', tier: 'Relic', hands: 1, role: 'Healer/Touch' },
    { name: 'Bâton Déchu', tier: 'Avalon', hands: 1, role: 'Healer/Party' },
    { name: 'Bâton Rédemption', tier: 'Avalon', hands: 2, role: 'Healer/Revive' },
    { name: 'Chute-Bénie', tier: 'Avalon', hands: 2, role: 'Healer/Rain' },
    { name: 'Bâton Exalté', tier: 'Crystal', hands: 2, role: 'Healer/Power' }
  ],
  
  arcane: [
    { name: 'Bâton Arcane', tier: 'Standard', hands: 1, role: 'DPS/Magic' },
    { name: 'Grand Bâton Arcane', tier: 'Rune', hands: 2, role: 'DPS/Beam' },
    { name: 'Bâton Énigmatique', tier: 'Soul', hands: 1, role: 'DPS/Mystery' },
    { name: 'Bâton Sorcellerie', tier: 'Relic', hands: 1, role: 'DPS/Witch' },
    { name: 'Bâton Occulte', tier: 'Avalon', hands: 1, role: 'DPS/Dark' },
    { name: 'Locus Malveillant', tier: 'Avalon', hands: 2, role: 'DPS/Curse' },
    { name: 'Chant du Soir', tier: 'Avalon', hands: 2, role: 'DPS/Night' },
    { name: 'Bâton Astral', tier: 'Crystal', hands: 2, role: 'DPS/Stars' }
  ],
  
  frost: [
    { name: 'Bâton de Givre', tier: 'Standard', hands: 1, role: 'DPS/Slow' },
    { name: 'Grand Bâton de Givre', tier: 'Rune', hands: 2, role: 'DPS/Freeze' },
    { name: 'Bâton Glacial', tier: 'Soul', hands: 1, role: 'DPS/Ice' },
    { name: 'Bâton Givre-Blanc', tier: 'Relic', hands: 1, role: 'DPS/Chill' },
    { name: 'Bâton Glaçon', tier: 'Avalon', hands: 1, role: 'DPS/Spike' },
    { name: 'Prisme Pergélisol', tier: 'Avalon', hands: 2, role: 'DPS/Prism' },
    { name: 'Hurle-Givre', tier: 'Avalon', hands: 2, role: 'DPS/CC' },
    { name: 'Bâton Arctique', tier: 'Crystal', hands: 2, role: 'DPS/Arctic' }
  ],
  
  cursed: [
    { name: 'Bâton Maudit', tier: 'Standard', hands: 1, role: 'DPS/DoT' },
    { name: 'Grand Bâton Maudit', tier: 'Rune', hands: 2, role: 'DPS/AoE' },
    { name: 'Bâton Démoniaque', tier: 'Soul', hands: 1, role: 'DPS/Demon' },
    { name: 'Bâton Malédiction-Vie', tier: 'Relic', hands: 1, role: 'DPS/Drain' },
    { name: 'Crâne Maudit', tier: 'Avalon', hands: 1, role: 'DPS/Skull' },
    { name: 'Bâton Damnation', tier: 'Avalon', hands: 2, role: 'DPS/Hell' },
    { name: 'Appelle-Ombre', tier: 'Avalon', hands: 2, role: 'DPS/Shadow' },
    { name: 'Bâton Appelle-Putréfaction', tier: 'Crystal', hands: 2, role: 'DPS/Rot' }
  ],
  
  tome: [
    { name: 'Tome de Sorts', tier: 'Standard', hands: 1, role: 'Support/Magic' },
    { name: 'Œil des Secrets', tier: 'Relic', hands: 1, role: 'Support/Vision' },
    { name: 'Muisak', tier: 'Avalon', hands: 1, role: 'Support/Debuff' },
    { name: 'Racine-Pivot', tier: 'Avalon', hands: 1, role: 'Support/Root' },
    { name: 'Encensoir Céleste', tier: 'Avalon', hands: 1, role: 'Support/Buff' },
    { name: 'Grimoire Verrou-Temps', tier: 'Crystal', hands: 1, role: 'Support/Time' }
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
    template: [
      { role: roles.MELEE_DPS, count: 1 }
    ]
  }
};
