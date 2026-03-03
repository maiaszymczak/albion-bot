# 🎮 Guide d'utilisation - Bot Albion Online

## 📋 Commandes disponibles

### 1. `/compo` - Générer une composition d'équipe

#### 🎯 Compositions pré-définies (builds imposés)

Ces compositions ont des builds **optimisés et imposés** :

```
/compo type:PvP 5v5
/compo type:Donjon Statique (5 joueurs)
/compo type:CLAP PvP (8 joueurs)
/compo type:Brawl PvP (10 joueurs)
/compo type:ZvZ (20 joueurs)
/compo type:Donjon Corrompu (Solo)
```

**Exemple - Donjon Corrompu :**
Affiche **8 builds solo recommandés** classés par tier (Meta/Viable/Situational/High Skill) avec descriptions et gear complet.

---

#### ⚙️ Compositions personnalisables

##### **Raid Avalonian**
Permet de choisir le **nombre de joueurs** (composition équilibrée PvE) :

```
/compo type:Raid Avalonian nombre:15
/compo type:Raid Avalonian nombre:10
/compo type:Raid Avalonian nombre:20
```

**Paramètres :**
- `nombre` : 1 à 50 joueurs (requis)
- Style : Toujours équilibré (PvE optimisé)

---

##### **Personnalisé**
Composition entièrement personnalisable avec nombre ET style :

```
/compo type:Personnalisé nombre:12 style:Équilibrée
/compo type:Personnalisé nombre:8 style:Style CLAP
/compo type:Personnalisé nombre:15 style:Style Brawl
```

**Paramètres :**
- `nombre` : 1 à 50 joueurs (requis)
- `style` : Équilibrée, Style CLAP, ou Style Brawl

---

### 2. `/build` - Voir les builds disponibles par rôle

```
/build role:Tank
/build role:Melee DPS
/build role:Ranged DPS
/build role:Healer
/build role:Support
```

Affiche toutes les armes disponibles pour ce rôle avec icônes et couleurs.

---

## 🎨 Système visuel

### Couleurs par tier
- 🟦 Standard (Gris)
- 🟢 Rune (Vert)
- 🔵 Soul (Bleu)
- 🟣 Relic (Violet)
- 🟠 Avalon (Orange)
- 🔷 Crystal (Cyan)

### Icônes par rôle
- 🛡️ Tank
- ⚔️ DPS
- 💚 Healer
- ✨ Support
- 👁️ Scout

### Tiers pour builds solo
- 🔥 Meta
- ✅ Viable
- ⚠️ Situational
- ⭐ High Skill

---

## 📊 Exemples complets

### Composition pour petit groupe PvP
```
/compo type:PvP 5v5
```
→ Affiche 5 builds imposés optimisés pour PvP 5v5

### Raid Avalonian équilibré 15 joueurs
```
/compo type:Raid Avalonian nombre:15
```
→ Génère composition équilibrée PvE avec ~3 tanks, ~3 healers, reste DPS

### Composition CLAP personnalisée 12 joueurs
```
/compo type:Personnalisé nombre:12 style:Style CLAP
```
→ Génère composition focus tank/support pour 12 joueurs

### Builds solo pour donjon corrompu
```
/compo type:Donjon Corrompu (Solo)
```
→ Affiche 8 builds recommandés avec tiers, descriptions et gear

---

## 🔧 Différences entre les modes

| Mode | Nombre fixe | Style fixe | Builds |
|------|-------------|------------|--------|
| **PvP 5v5** | ✅ 5 | ✅ PvP | Imposés |
| **Donjon Statique** | ✅ 5 | ✅ PvE | Imposés |
| **CLAP PvP** | ✅ 8 | ✅ CLAP | Imposés |
| **Brawl PvP** | ✅ 10 | ✅ Brawl | Imposés |
| **ZvZ** | ✅ 20 | ✅ ZvZ | Imposés |
| **Donjon Corrompu** | ✅ 1 | ✅ Solo | 8 presets |
| **Raid Avalonian** | ❌ Variable | ✅ Équilibré | Générés |
| **Personnalisé** | ❌ Variable | ❌ Variable | Générés |

---

## 💡 Tips

1. **Donjon Corrompu** : Utilise les builds Meta (🔥) pour débuter, puis essaie les Viable (✅) quand tu maîtrises
2. **Raid Avalonian** : Toujours équilibré car optimisé pour le PvE
3. **Personnalisé** : Utilise Style CLAP pour contenu difficile, Style Brawl pour farming rapide
4. **Style Équilibrée** : Valeur sûre pour toutes situations

---

## 🚀 Déploiement

Pour déployer les modifications sur Render :

```bash
git add .
git commit -m "Update: Raid Avalonian + style choices"
git push origin main
```

Render redéploiera automatiquement le bot avec les nouvelles commandes.
