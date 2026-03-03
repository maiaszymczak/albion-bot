# Bot Discord - Albion Online Composition Generator

🎮 Bot Discord pour générer des compositions d'équipe optimisées pour Albion Online (PvP, donjons, raids Avalonian, ZvZ, etc.)

## 🚀 Fonctionnalités

- **Génération de compositions** pour différents types de contenu :
  - PvP 5v5
  - Donjons statiques (5 joueurs)
  - Raids Avalonian (10 joueurs)
  - ZvZ (20 joueurs)
  - Donjons corrompus (Solo)

- **Consultation de builds** par rôle (Tank, DPS Mêlée, DPS Distance, Healer)
- **Compositions équilibrées** avec répartition des rôles
- **Interface Discord moderne** avec embeds et commandes slash

## 📋 Prérequis

- Node.js 18+ 
- Un compte Discord Developer avec un bot créé
- Les permissions suivantes pour le bot :
  - `applications.commands` (commandes slash)
  - `bot` (présence du bot)

## 🛠️ Installation

1. **Cloner ou naviguer vers le projet**
   ```bash
   cd /Users/maia/42/bot_discord
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Configurer les variables d'environnement**
   
   Créez un fichier `.env` à la racine du projet :
   ```bash
   cp .env.example .env
   ```
   
   Éditez `.env` et ajoutez vos identifiants :
   ```env
   DISCORD_TOKEN=votre_token_discord
   CLIENT_ID=votre_client_id
   GUILD_ID=votre_guild_id_optionnel
   ```

   **Comment obtenir ces informations :**
   - Rendez-vous sur [Discord Developer Portal](https://discord.com/developers/applications)
   - Créez une nouvelle application ou sélectionnez-en une existante
   - **DISCORD_TOKEN** : Onglet "Bot" → Reset Token
   - **CLIENT_ID** : Onglet "General Information" → Application ID
   - **GUILD_ID** (optionnel) : Activez le mode développeur dans Discord → Clic droit sur votre serveur → Copier l'ID

4. **Déployer les commandes slash**
   ```bash
   npm run deploy
   ```

5. **Démarrer le bot**
   ```bash
   npm start
   ```

   Pour le développement avec rechargement automatique :
   ```bash
   npm run dev
   ```

## 🎯 Utilisation

Une fois le bot en ligne sur votre serveur Discord, utilisez les commandes suivantes :

### `/compo <type>`
Génère une composition d'équipe complète

**Types disponibles :**
- `PvP 5v5` - Composition PvP classique
- `Donjon Statique (5 joueurs)` - Pour les donjons PvE
- `Raid Avalonian (10 joueurs)` - Pour les raids Avalonian
- `ZvZ (20 joueurs)` - Pour les batailles ZvZ
- `Donjon Corrompu (Solo)` - Build solo

**Exemple :**
```
/compo type:PvP 5v5
```

### `/build <role>`
Affiche tous les builds disponibles pour un rôle spécifique

**Rôles disponibles :**
- `Tank` - Builds frontline
- `Mêlée DPS` - Builds DPS corps à corps
- `Distance DPS` - Builds DPS à distance
- `Healer/Support` - Builds de soutien

**Exemple :**
```
/build role:Tank
```

## 📁 Structure du projet

```
bot_discord/
├── src/
│   ├── commands/          # Commandes Discord
│   │   ├── compo.js       # Génération de compositions
│   │   └── build.js       # Consultation de builds
│   ├── data/
│   │   └── albion-data.js # Base de données des armes/rôles
│   ├── utils/
│   │   └── composition-generator.js  # Logique de génération
│   ├── index.js           # Point d'entrée du bot
│   └── deploy-commands.js # Script de déploiement
├── .env                   # Configuration (à créer)
├── .env.example           # Exemple de configuration
├── .gitignore
├── package.json
└── README.md
```

## 🔧 Personnalisation

### Ajouter de nouvelles armes

Éditez `src/data/albion-data.js` et ajoutez vos armes dans les catégories appropriées :

```javascript
export const weapons = {
  tank: [
    { name: 'Nouvelle Arme', type: 'Tank', role: 'Description' }
  ]
};
```

### Créer de nouvelles compositions

Ajoutez une nouvelle composition dans `compositions` :

```javascript
export const compositions = {
  nouveau_type: {
    name: 'Nom de la composition',
    size: 5,
    template: [
      { role: roles.TANK, count: 1 },
      { role: roles.HEALER, count: 1 }
    ]
  }
};
```

Puis ajoutez le choix dans `src/commands/compo.js`.

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à :
- Ajouter de nouvelles armes et builds
- Proposer de nouvelles compositions
- Améliorer l'interface et les embeds
- Corriger des bugs

## 📝 Licence

MIT

## 🔗 Liens utiles

- [Documentation Discord.js](https://discord.js.org/)
- [Discord Developer Portal](https://discord.com/developers/applications)
- [Albion Online](https://albiononline.com/)
