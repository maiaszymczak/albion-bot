# 🔧 Troubleshooting Render

## Problème : Bot hors ligne sur Discord mais "Live" sur Render

### Causes possibles :

1. **Render Free Tier - Sleep après 15 min d'inactivité**
   - Le service gratuit s'endort automatiquement après 15 minutes sans requête HTTP
   - Le bot Discord reste "connecté" techniquement mais ne répond plus

2. **Solution 1 : Pinger le service régulièrement**
   
   Utilise un service externe comme **UptimeRobot** (gratuit) :
   - Crée un compte sur https://uptimerobot.com
   - Ajoute un monitor HTTP(S)
   - URL : `https://ton-service.onrender.com/health`
   - Interval : 5 minutes
   - Le service pingera ton bot toutes les 5 min pour le garder éveillé

3. **Solution 2 : Passer au plan payant Render**
   - 7$/mois pour un service toujours actif
   - Pas de sleep, pas de cold start

4. **Solution 3 : Déployer ailleurs**
   - **Railway** : Free tier plus généreux (500h/mois)
   - **Fly.io** : Free tier avec 3 machines gratuites
   - **Heroku** : Plus de free tier malheureusement

### Vérification

Pour vérifier si ton bot est actif :
```bash
curl https://ton-service.onrender.com/health
```

Devrait retourner :
```json
{
  "status": "healthy",
  "discord": "connected",
  "guilds": 1
}
```

### Logs à surveiller

Dans les logs Render, tu devrais voir :
- `💓 Keepalive - Bot actif` toutes les 5 minutes
- `🤖 Bot connecté en tant que...` au démarrage
- `🔄 Reconnexion au gateway Discord...` si problème de connexion

### Configuration actuelle

Le bot a maintenant :
- ✅ Serveur HTTP pour Render
- ✅ Endpoint `/health` pour monitoring
- ✅ Keepalive interne toutes les 5 minutes
- ✅ Gestion des erreurs et reconnexions Discord

**Recommandation** : Configure UptimeRobot pour pinger `/health` toutes les 5 minutes.
