// Base de données des builds Albion Online
export const weapons = {
  // Armes de Tank
  tank: [
    { name: 'Masse Incube', type: 'Tank', role: 'Frontline/CC' },
    { name: 'Grand Esotérique', type: 'Tank Support CC', role: 'Frontline/Support' },
    { name: 'Esotorque 1H', type: 'Tank Support CC', role: 'Frontline/CC' },
    { name: 'Marteaux Forgés', type: 'Tank', role: 'Frontline/CC' },
    { name: 'Garde-Serments', type: 'Tank', role: 'Frontline/Protection' }
  ],
  
  // Armes de DPS Mêlée
  melee_dps: [
    { name: 'Souchefer', type: 'DPS Main Heal', role: 'Damage/Execute' },
    { name: 'Mande-Ténèbre', type: 'DPS', role: 'Burst/Damage' },
    { name: 'Bâton Ardent', type: 'DPS', role: 'AoE/Burst' },
    { name: 'Carving', type: 'Pierce', role: 'Damage/Poke' },
    { name: 'Pattes d\'ours', type: 'DPS', role: 'Sustained Damage' },
    { name: 'Adoube-Roi', type: 'DPS', role: 'Damage/Mobile' },
    { name: 'Mains infernales', type: 'DPS', role: 'Damage/AoE' }
  ],
  
  // Armes de DPS Ranged
  ranged_dps: [
    { name: 'Mande-Lumière', type: 'DPS', role: 'Burst/Damage' },
    { name: 'Hurle-Givre', type: 'DPS', role: 'CC/Damage' },
    { name: 'Bâton Arctique', type: 'DPS', role: 'Slow/Damage' },
    { name: 'Arbalète à Répétition', type: 'DPS', rate: 'Sustained Damage' },
    { name: 'Faucheuse de Crystal', type: 'DPS', role: 'Burst/AoE' }
  ],
  
  // Armes de Support/Healer
  healer: [
    { name: 'Bâton Déchu', type: 'Party Heal', role: 'Main Healer' },
    { name: 'Sanctificateur', type: 'Healer', role: 'Main Healer' },
    { name: 'Fléau', type: 'Healer', role: 'Cleanse/Heal' }
  ],
  
  // Scout
  scout: [
    { name: 'Masse de Soubassement', type: 'Scout', role: 'Vision/Mobility' }
  ],
  
  // Finish/Execute
  finish: [
    { name: 'Saigneur', type: 'Finish', role: 'Execute/Burst' }
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
