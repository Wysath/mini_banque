# Mini banque

Petit projet pédagogique qui simule une mini-banque en JavaScript avec une interface utilisateur complète. Le but est de permettre de créer des clients et des comptes, effectuer des dépôts, retraits, transferts, et consulter les historiques et totaux.

## Structure du projet
- `index.html` : interface utilisateur complète avec formulaires et visualisation en temps réel.
- `script.js` : logique principale (clients, comptes, transactions) avec validation centralisée et gestion d'erreurs.
- `style.css` : styles pour l'interface utilisateur.
- `README.md` : ce fichier.

## Comment l'utiliser
1. Ouvrir `index.html` dans un navigateur (double-clic ou via Live Server).
2. Utiliser l'interface graphique pour :
   - **Créer des clients** avec un compte initial
   - **Créer des comptes supplémentaires** pour des clients existants
   - **Effectuer des dépôts** sur les comptes
   - **Retirer de l'argent** des comptes
   - **Transférer de l'argent** entre comptes
   - **Supprimer des comptes** (uniquement si le solde est à 0)
   - **Consulter** la liste des clients et leurs comptes en temps réel

## Fonctionnalités de l'interface

### 📊 Visualisation
- **Liste des clients** : affiche tous les clients avec le nombre de comptes et le solde total
- **Liste des comptes** : affiche tous les comptes avec leur type, solde et nombre de transactions
- **Total de la banque** : somme de tous les soldes

### ✨ Opérations disponibles
- Création de nouveaux clients avec un compte courant initial
- Création de comptes supplémentaires (courant ou épargne)
- Dépôts, retraits et transferts avec validation en temps réel
- Suppression de comptes vides
- Notifications visuelles pour chaque opération (succès/erreur)

## Architecture technique

### Validation centralisée
Le code utilise une fonction `isValidAmount(amount)` qui vérifie que les montants sont des nombres positifs valides.

### Gestion d'erreurs robuste
Toutes les fonctions métier lancent des exceptions (`throw new Error`) en cas d'erreur :
- Client ou compte non trouvé
- Montants invalides
- Fonds insuffisants
- Solde non nul lors d'une suppression

L'interface capture ces erreurs avec des blocs `try/catch` et affiche des notifications appropriées à l'utilisateur.

### Transactions avec historique
Chaque opération est enregistrée dans l'historique du compte avec :
- Type d'opération (deposit, withdraw, transfer, interest, fee)
- Montant
- Date (objet Date)
- Solde après l'opération
- Métadonnées supplémentaires (taux d'intérêt, compte de destination, etc.)

### Transactions avec historique
Chaque opération est enregistrée dans l'historique du compte avec :
- Type d'opération (deposit, withdraw, transfer, interest, fee)
- Montant
- Date (objet Date)
- Solde après l'opération
- Métadonnées supplémentaires (taux d'intérêt, compte de destination, etc.)

### Opérations spéciales (console uniquement)
Pour les besoins pédagogiques, certaines fonctions avancées sont disponibles via la console du navigateur (F12) :

- `applyInterest(accountId, rate)` — applique des intérêts annuels (rate en %, ex: 1.5)
  - Vérifie automatiquement qu'aucun intérêt n'a été appliqué dans les 12 derniers mois
  
- `applyFee(accountId, amount)` — applique des frais de tenue de compte (amount en €, ex: 2)
  - Vérifie automatiquement qu'aucun frais n'a été appliqué dans les 30 derniers jours

**Exemple d'utilisation en console :**
```javascript
// Appliquer des intérêts de 2% sur un compte
applyInterest('a1f5c3e2-3b6d-4f8e-9c2d-1e2f3a4b5c6d', 2);

// Appliquer des frais de 5€
applyFee('a1f5c3e2-3b6d-4f8e-9c2d-1e2f3a4b5c6d', 5);
```

## Données de test
Le projet contient des données initiales pour faciliter les tests :
- 3 clients pré-créés (Charles Henry, Sophie Sylvie, Paul Dupont)
- 3 comptes bancaires avec des soldes différents
- Vous pouvez créer de nouveaux clients et comptes via l'interface

---

**Note** : Ce projet est purement pédagogique et simule le fonctionnement d'une mini-banque en JavaScript. Les données sont stockées en mémoire et seront perdues lors du rechargement de la page.

