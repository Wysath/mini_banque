# Mini banque

Petit projet pédagogique qui simule une mini-banque en JavaScript. Le but est de permettre de créer des clients et des comptes, effectuer des dépôts, retraits, transferts, et consulter les historiques et totaux.

## Structure du projet
- `index.html` : page de démonstration et documentation d'utilisation en console pour le professeur.
- `script.js` : logique principale (clients, comptes, transactions).
- `README.md` : ce fichier.

## Comment l'utiliser
1. Ouvrir `index.html` dans un navigateur (double-clic ou via Live Server).
2. Ouvrir la console du navigateur (F12) pour exécuter les commandes JS et vérifier le comportement.

## Commandes utiles en console
Les fonctions suivantes sont exposées globalement par `script.js` :

- `createClient(prenom, nom)` — crée et retourne un client.
- `createBankAccount(clientId, solde = 0, type = 'courant')` — crée un compte pour un client existant.
- `deleteBankAccount(accountId)` — supprime un compte si son solde est à 0.
- `deposit(accountId, amount)` — dépôt sur un compte (amount > 0).
- `withdraw(accountId, amount)` — retrait (amount > 0 et ≤ solde).
- `transfer(fromAccountId, toAccountId, amount)` — transfert entre comptes.
- `getAccountBalance(accountId)` — retourne le solde du compte.
- `getAccountHistory(accountId)` — retourne l'historique des transactions.
- `getTotalBalance(id)` — si `id` est un client retourne la somme de tous ses comptes, si c'est un compte retourne son solde.
- `getBankTotalBalance()` — somme de tous les comptes de la banque.
- `applyInterest(accountId, rate)` — applique des intérêts annuels sur un compte (rate en %, ex: 1.5).
- `applyFee(accountId, amount)` — applique des frais de tenue de compte mensuels (amount en €, ex: 2).
- `clients` et `comptesBancaires` — tableaux exposés pour inspection directe.

