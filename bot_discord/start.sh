#!/bin/bash

echo "🚀 Déploiement des commandes Discord..."
node src/deploy-commands.js

echo "🤖 Démarrage du bot..."
node src/index.js
