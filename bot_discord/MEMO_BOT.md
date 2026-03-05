# 📝 Mémo Bot Discord Albion

## 🚀 Développement

### Tester en local (recommandé)
```bash
cd /Users/maia/42/albion-bot/bot_discord
node src/index.js
```
- ✅ Changements **instantanés**
- ✅ Pas besoin d'attendre Render
- ⚠️ Arrête le bot local avant de push (sinon 2 bots actifs)

### Arrêter le bot local
```bash
Ctrl + C
# ou
kill $(lsof -t -i:3000)
```

---

## 📦 Déploiement sur Render

### Push automatique (activé par défaut)
```bash
git add -A
git commit -m "ton message"
git push
```
- ⏱️ Prend **2-3 minutes** à redémarrer
- 🔄 Auto-deploy dès qu'un commit arrive sur `main`

### Forcer un redéploiement
```bash
git commit --allow-empty -m "Force redeploy"
git push
```

### Vérifier le statut
1. Va sur **render.com** → ton service
2. Regarde en haut : **"Live"** = ok, **"Deploying"** = en cours
3. Logs en direct : onglet **"Logs"**

---

## 🛠️ Commandes Bot

### Commandes disponibles

**📋 Gestion des rosters**
`/roster` - Créer un roster d'inscription pour vos événements PvP/PvE

**⚔️ Recherche d'équipement**
`/weapon` - Chercher une arme (avec autocomplétion)
`/armor` - Chercher une pièce d'armure (avec autocomplétion)

**🛡️ Compositions**
`/build` - Chercher une composition spécifique
`/compo` - Afficher la liste de toutes les compositions disponibles
`/template` - Sauvegarder ou charger vos compositions personnalisées

**📊 Statistiques**
`/stats` - Voir les statistiques d'utilisation du bot

### Redéployer les commandes
Si les commandes ne s'affichent pas sur Discord :
```bash
node src/deploy-commands.js
```

---

## 🐛 Debugging

### Voir les logs Render en temps réel
1. Render.com → ton service → **Logs**
2. Cherche les erreurs avec `❌` ou `Error`

### Erreurs courantes

#### "Missing Access" (code 50001)
- ❌ Le bot n'a pas les permissions
- ✅ Solution : Donne-lui le rôle **Administrateur** sur le serveur

#### "Cannot read properties of null (reading 'messages')"
- ❌ Channel pas en cache (gros serveurs)
- ✅ Déjà corrigé avec `fetchChannel()`

#### "Vous êtes déjà inscrit"
- ❌ Ancienne version du code
- ✅ Nouvelle version : changement de rôle direct automatique

#### Bot ne répond pas
1. Vérifie sur Render : statut **"Live"** ?
2. Vérifie les logs : bot connecté ?
3. Vérifie Discord : bot en ligne (vert) ?

---

## 📂 Structure du code

```
bot_discord/
├── src/
│   ├── index.js              # Point d'entrée principal
│   ├── deploy-commands.js    # Déploiement des commandes slash
│   ├── commands/             # Commandes Discord
│   │   ├── roster.js
│   │   ├── build.js
│   │   ├── weapon.js
│   │   └── ...
│   ├── utils/
│   │   ├── roster-manager.js # Gestion des rosters
│   │   ├── signup-ui.js      # Interface utilisateur
│   │   ├── modal-handler.js  # Modals Discord
│   │   └── notification-manager.js
│   └── data/
│       └── albion-data.js    # Données armes/armures
├── data/
│   ├── rosters.json          # Rosters sauvegardés
│   └── stats.json            # Statistiques
├── package.json
├── .env                       # TOKEN + CLIENT_ID (secret)
└── start.sh                   # Script de démarrage Render
```

---

## 🔑 Variables d'environnement

### Fichier `.env` (local)
```env
DISCORD_TOKEN=ton_token_discord
CLIENT_ID=ton_client_id
```

### Sur Render
1. Dashboard → ton service → **Environment**
2. Ajoute les mêmes variables

---

## ✨ Fonctionnalités récentes

### Swap System (builds alternatifs)
- ✅ Ajout de swaps avec menu déroulant (rôle)
- ✅ Affichage détaillé des swaps dans le roster
- ✅ Optimisation automatique avec TOUS les swaps
- ✅ Système de priorité (high/medium)

### Changement de rôle direct
- ✅ Plus besoin de se désinscrire manuellement
- ✅ Clic sur nouveau rôle = désinscription auto + réinscription
- ✅ Message : `🔄 Changement de rôle : Tank → DPS`

### Fix gros serveurs Discord
- ✅ Gestion du cache des channels (`fetchChannel`)
- ✅ Messages d'erreur détaillés au lieu de "Une erreur est survenue"
- ✅ Notifications d'inscription désactivées (spam)

---

## 📊 Workflow recommandé

### Pour développer une nouvelle fonctionnalité
1. **Test local** : `node src/index.js`
2. **Modifie le code** dans VS Code
3. **Redémarre** avec Ctrl+C puis relance
4. **Teste** sur ton petit serveur Discord
5. Quand ça marche : **arrête le local**, `git push`
6. **Vérifie sur Render** que tout marche en prod

### Pour un bug urgent en prod
1. **Vérifie les logs Render** pour l'erreur exacte
2. **Fixe le code** localement
3. **Push direct** sur main
4. **Attends 2-3 min** le redéploiement

---

## 🆘 Commandes utiles

```bash
# Voir les processus Node en cours
lsof -i:3000

# Tuer un processus sur le port 3000
kill $(lsof -t -i:3000)

# Voir l'historique Git
git log --oneline -10

# Revenir à un commit précédent
git reset --hard <commit_hash>
git push --force

# Créer une branche de dev
git checkout -b dev
git push -u origin dev
```

---

## 💡 Tips

- 🔥 **Toujours tester en local** avant de push
- 📝 **Messages de commit clairs** (emoji + description)
- 🚫 **Ne jamais commit le .env** (déjà dans .gitignore)
- 🔄 **Auto-save toutes les 5 min** (rosters.json)
- 📊 **Stats sauvegardées** automatiquement
- ⚡ **Gros serveurs** = besoin permissions Administrateur

---

## 🎯 Prochaines améliorations possibles

- [ ] Système de templates de compo plus avancé
- [ ] Export des rosters en image/PDF
- [ ] Intégration avec l'API Albion officielle
- [ ] Dashboard web pour voir les stats
- [ ] Commande `/history` pour voir l'historique des rosters
- [ ] Système de réservation de créneaux horaires
- [ ] Intégration calendrier (Google Calendar)
- [ ] Multi-langue (FR/EN)

---

**Créé le 5 mars 2026** 🚀
