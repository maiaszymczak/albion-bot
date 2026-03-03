# 🎨 Couleurs et Icônes - Bot Discord Albion

## 🎨 Codes Couleur Discord

### Tiers d'Armes
- **Standard** : `0x808080` (Gris)
- **Rune** : `0x00FF00` (Vert)
- **Soul** : `0x0099FF` (Bleu)
- **Relic** : `0x9900FF` (Violet)
- **Avalon** : `0xFF6600` (Orange)
- **Crystal** : `0x00FFFF` (Cyan)

### Rôles de Joueurs
- **Tank** : `0x3498db` (Bleu)
- **DPS Mêlée** : `0xe74c3c` (Rouge)
- **DPS Distance** : `0x9b59b6` (Violet)
- **Healer** : `0x2ecc71` (Vert)
- **Support** : `0xf39c12` (Orange)

### Types de Compositions
- **PvP** (CLAP, Brawl, ZvZ) : `0xe74c3c` (Rouge)
- **PvE** (Donjons, Raids) : `0x9b59b6` (Violet)
- **Défaut** : `0x00AE86` (Vert menthe)

## 📦 Icônes par Catégorie d'Arme

### Guerrier (Warrior)
- **Épée** : ⚔️
- **Hache** : 🪓
- **Masse** : 🔨
- **Marteau** : ⚒️
- **Gants de Guerre** : 👊
- **Arbalète** : 🏹
- **Bouclier** : 🛡️

### Chasseur (Hunter)
- **Arc** : 🏹
- **Dague** : 🗡️
- **Lance** : 🔱
- **Quarterstaff** : 🥢
- **Métamorphe** : 🐺
- **Nature** : 🌿
- **Torche** : 🔥

### Mage (Mage)
- **Feu** : 🔥
- **Sacré** : ✨
- **Arcane** : 🔮
- **Givre** : ❄️
- **Maudit** : 💀
- **Tome** : 📖

## 👤 Icônes par Rôle

- **Tank** : 🛡️
- **DPS** : ⚔️
- **Healer** : 💚
- **Support** : ✨
- **Scout** : 👁️

## 📊 Exemple d'utilisation dans Discord

```javascript
// Créer un embed avec couleur selon le tier
const embed = {
  color: tierColors.Avalon, // Orange
  title: `⚔️ ${weaponName}`,
  description: `${weaponIcon} Arme de tier ${tier}`
};

// Afficher une arme avec son icône
const weaponDisplay = `${weaponIcons.sword} **Claymore**`;

// Liste de rôles avec couleurs
const roleEmbed = {
  color: roleColors.tank, // Bleu
  title: `${roleIcons.Tank} Tank Builds`
};
```

## 🎯 Avantages

1. **Visibilité** : Les couleurs permettent d'identifier rapidement le type/tier
2. **Esthétique** : Les icônes rendent l'interface plus attractive
3. **Cohérence** : Système unifié dans tout le bot
4. **Accessibilité** : Icônes universelles faciles à comprendre

## 🔄 Mise à jour

Pour ajouter de nouvelles couleurs/icônes, modifier :
- `/src/data/albion-data.js` - Constantes tierColors, weaponIcons, roleIcons
- Toujours tester dans Discord pour vérifier le rendu
