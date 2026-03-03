# 🚀 Déploiement du Bot Albion sur Render

## 📋 Prérequis

- Un compte [Render](https://render.com) (gratuit)
- Un bot Discord configuré sur le [Discord Developer Portal](https://discord.com/developers/applications)
- Le code du bot sur GitHub (ou autre dépôt Git)

## 🔧 Configuration Render

### 1. Créer un nouveau Web Service

1. Connectez-vous à [Render](https://dashboard.render.com)
2. Cliquez sur **"New +"** → **"Web Service"** (pas Background Worker!)
3. Connectez votre dépôt GitHub/GitLab
4. Sélectionnez le dépôt du bot

### 2. Configuration du Service

Utilisez les paramètres suivants :

| Paramètre | Valeur |
|-----------|--------|
| **Name** | `albion-bot` (ou votre choix) |
| **Environment** | `Node` |
| **Region** | `Frankfurt (EU Central)` ou le plus proche |
| **Branch** | `main` |
| **Root Directory** | `bot_discord` (si le bot n'est pas à la racine) |
| **Build Command** | `npm install` |
| **Start Command** | `node src/index.js` |
| **Plan** | `Free` |

### 3. Variables d'environnement

Ajoutez les variables d'environnement suivantes dans l'onglet **"Environment"** :

```env
DISCORD_TOKEN=votre_token_discord
CLIENT_ID=votre_application_id
```

**⚠️ Important :** Ne PAS définir `PORT` - Render le définit automatiquement !

**Comment obtenir ces valeurs :**

#### DISCORD_TOKEN
1. Allez sur [Discord Developer Portal](https://discord.com/developers/applications)
2. Sélectionnez votre application
3. Onglet **"Bot"** → Cliquez sur **"Reset Token"**
4. Copiez le token (vous ne pourrez plus le voir après !)

#### CLIENT_ID
1. Même application sur Discord Developer Portal
2. Onglet **"General Information"**
3. Copiez **"Application ID"**

### 4. Déployer les commandes Discord

**Avant le premier lancement**, vous devez déployer les commandes slash. Deux options :

#### Option A : Localement (recommandé)
```bash
# Dans votre projet local
DISCORD_TOKEN=votre_token CLIENT_ID=votre_id npm run deploy
```

#### Option B : Via Render Shell
1. Une fois le service déployé, allez dans l'onglet **"Shell"**
2. Exécutez : `node src/deploy-commands.js`

### 5. Lancer le déploiement

1. Cliquez sur **"Create Web Service"**
2. Render va :
   - Cloner votre dépôt
   - Installer les dépendances (`npm install`)
   - Lancer le bot (`node src/index.js`)
3. Vérifiez les logs en temps réel

## ✅ Vérification

### Endpoints de santé

Le bot expose deux endpoints HTTP :

**Status :**
```
https://votre-app.onrender.com/
```
Retourne :
```json
{
  "status": "online",
  "bot": "Albion PVP/PVE Bot",
  "uptime": 12345.67,
  "timestamp": "2026-03-03T10:00:00.000Z"
}
```

**Health Check :**
```
https://votre-app.onrender.com/health
```
Retourne :
```json
{
  "status": "healthy",
  "discord": "connected",
  "guilds": 1
}
```

### Vérifier dans Discord

1. Invitez le bot sur votre serveur avec ce lien :
```
https://discord.com/api/oauth2/authorize?client_id=VOTRE_CLIENT_ID&permissions=2147502080&scope=bot%20applications.commands
```

2. Testez une commande :
```
/compo type:PvP 5v5
```

## 🐛 Dépannage

### Le bot ne démarre pas
- Vérifiez les logs dans l'onglet **"Logs"** de Render
- Assurez-vous que `DISCORD_TOKEN` et `CLIENT_ID` sont bien définis
- Vérifiez que le token Discord est valide

### Les commandes ne s'affichent pas
- Exécutez `node src/deploy-commands.js` (localement ou via Shell)
- Attendez quelques minutes (propagation Discord)
- Relancez Discord complètement

### "No open ports detected" (problème résolu)
✅ **Solution implémentée !** Le bot inclut maintenant un serveur HTTP Express qui écoute sur le port fourni par Render.

### Le bot se déconnecte souvent (plan gratuit)
Le plan gratuit de Render met le service en veille après 15 minutes d'inactivité.

**Solutions :**
- Passer au plan payant ($7/mois)
- Utiliser un service de ping externe (comme [UptimeRobot](https://uptimerobot.com))
- Héberger ailleurs (Railway, Fly.io, VPS)

## 🔄 Mises à jour

Render redéploie automatiquement à chaque push sur la branche `main`.

Pour forcer un redéploiement manuel :
1. Allez sur votre service
2. Onglet **"Manual Deploy"**
3. Cliquez sur **"Deploy latest commit"**

## 📊 Surveillance

### Logs en temps réel
```
Dashboard → Votre service → Onglet "Logs"
```

### Métriques
```
Dashboard → Votre service → Onglet "Metrics"
```
- CPU Usage
- Memory Usage
- Network I/O

## 🔐 Sécurité

- ✅ Ne commitez **JAMAIS** le fichier `.env`
- ✅ Utilisez les variables d'environnement de Render
- ✅ Régénérez les tokens si compromis
- ✅ Limitez les permissions du bot au minimum nécessaire

## 📚 Ressources

- [Documentation Render](https://render.com/docs)
- [Discord.js Guide](https://discordjs.guide)
- [Discord Developer Portal](https://discord.com/developers/applications)
- [Guide des permissions Discord](https://discord.com/developers/docs/topics/permissions)

---

**Besoin d'aide ?** Consultez les logs Render ou les issues GitHub du projet.
