# 🎯 Amélioration : Donjons Corrompus (Solo)

## ❌ Problème
La composition pour "Donjon Corrompu" utilisait une génération aléatoire d'une seule arme, ce qui n'a pas de sens pour du contenu solo 1v1.

## ✅ Solution

### 8 Builds Solo Recommandés

J'ai remplacé la génération aléatoire par **8 builds meta/viables** pour les donjons corrompus, classés par tier :

#### 🔥 Meta Tier
1. **Saigneur** - Assassin burst avec forte mobilité
2. **Claymore** - DPS Bruiser équilibré
3. **Démoniaque** - Ultra mobile pour kiter

#### ✅ Viable Tier
4. **Bâton du Moine Noir** - Bruiser avec CC
5. **Arc Long** - Ranged kite
6. **Bâton Glacial** - Mage avec slow

#### ⚠️ Situational / High Skill
7. **Bâton Infernal** - DoT avec sustain
8. **Faux d'Âme** - Reset fighter high-risk

### 📊 Informations détaillées

Chaque build inclut maintenant :
- **Tier** (Meta, Viable, Situational, High Skill) avec emoji
- **Rôle** (Execute/Burst, Sustained/Burst, etc.)
- **Description** du playstyle
- **Gear recommandé** complet
- **Type** de build (Assassin, Bruiser, Kite, etc.)

### 🎨 Affichage amélioré

L'affichage a été spécialement adapté pour les builds solo :
```
⚔️ Donjon Corrompu (Solo)
Builds recommandés pour le PvP 1v1 en donjon corrompu

1. Saigneur
🔥 Meta
📋 Execute/Burst
💭 Build assassin burst avec forte mobilité et damage
🎽 Capuche Assassin + Veste Assassin + Chaussures Soldat + Pâté Anguille T8

2. Claymore
🔥 Meta
📋 Sustained/Burst
💭 Build équilibré avec bon damage et sustain
🎽 Casque Soldat + Armure Chasseur + Bottes Soldat + Pâté T8

...
```

## 🎮 Utilisation

```
/compo type:Donjon Corrompu (Solo)
```

Le bot affichera maintenant tous les 8 builds recommandés au lieu d'une seule arme aléatoire.

## 📝 Fichiers modifiés

1. **`src/data/albion-data.js`**
   - Composition `corrupted_dungeon` remplacée par preset avec 8 builds
   - Ajout de `description`, `tier`, et informations détaillées

2. **`src/utils/composition-generator.js`**
   - Logique d'affichage adaptée pour les builds solo (size === 1)
   - Affichage spécial avec tiers, descriptions, et gear
   - Emojis par tier (🔥 Meta, ✅ Viable, ⚠️ Situational, ⭐ High Skill)

## ✨ Avantages

- ✅ **Plus pertinent** pour le contenu solo
- ✅ **Informations complètes** sur chaque build
- ✅ **Classification par tier** pour guider les joueurs
- ✅ **Descriptions** pour comprendre le playstyle
- ✅ **Gear détaillé** pour build complet
- ✅ **Variété** - 8 builds différents pour tous les styles de jeu
