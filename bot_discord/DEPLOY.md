# Guide de déploiement sur Render

## Étapes pour déployer le bot :

### 1. Créer un compte sur Render
1. Va sur [render.com](https://render.com)
2. Inscris-toi avec ton compte GitHub

### 2. Créer un dépôt GitHub
Le projet est déjà initialisé avec Git. Il faut maintenant le pousser sur GitHub :

```bash
cd /Users/maia/42/albion-bot
git add .
git commit -m "Initial commit - Albion bot"
# Crée un repo sur github.com puis :
git remote add origin https://github.com/TON_USERNAME/albion-bot.git
git branch -M main
git push -u origin main
```

### 3. Déployer sur Render
1. Sur Render, clique sur "New +" → "Background Worker"
2. Connecte ton dépôt GitHub
3. Configure :
   - **Name**: `albion-bot`
   - **Root Directory**: `bot_discord`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node src/index.js`

4. Ajoute les variables d'environnement :
   - `DISCORD_TOKEN` = Ton token Discord (du fichier .env)
   - `CLIENT_ID` = Ton Client ID Discord (du fichier .env)

5. Clique sur "Create Background Worker"

Le bot sera en ligne 24/7 gratuitement ! 🎉

## Alternative : Railway

1. Va sur [railway.app](https://railway.app)
2. Clique sur "Start a New Project" → "Deploy from GitHub repo"
3. Sélectionne ton repo
4. Ajoute les variables d'environnement (DISCORD_TOKEN, CLIENT_ID)
5. Railway détecte automatiquement Node.js et lance le bot

## Pour arrêter le bot local :
```bash
pkill -9 node
```
