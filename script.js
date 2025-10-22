/**
 * Création de l'UUID.
 */
const UUID = (typeof crypto !== 'undefined' && crypto.randomUUID)
  ? crypto.randomUUID.bind(crypto)
  : () => Date.now().toString(36) + Math.random().toString(36).slice(2);

/**
 * Création d'une base de donnée cliente fixe.
 */

const clients = [
  { id: '5e385eab-f13b-466a-9dff-e3b9121382c3', nom: 'Henry', prenom: 'Charles' },
  { id: '5695efb5-6cd1-4c39-8901-8bf33dc69801', nom: 'Sylvie', prenom: 'Sophie' },
  { id: '132976a7-1dd5-46de-9e6a-712603ad4288', nom: 'Durand', prenom: 'Paul' }
];

/**
 * Création d'une base de donnée de comptes bancaires fixe.
 */

const comptesBancaires = [
  { id: 'a1f5c3e2-3b6d-4f8e-9c2d-1e2f3a4b5c6d', clientId: clients[0].id, solde: 1500, type: 'courant', history: [] },
  { id: 'b2g6d4f3-4c7e-5g9f-0d3e-2f3g4b5c6d7e', clientId: clients[1].id, solde: 2500.5, type: 'épargne', history: [] },
  { id: 'c3h7e5g4-5d8f-6h0g-1e4f-3g4h5c6d7e8f', clientId: clients[2].id, solde: 300.75, type: 'courant', history: [] }
];

/** 
 * Fonction utilitaire pour trouver un compte par son ID.
*/

const findAcct = id => comptesBancaires.find(a => a.id === id);
const pushTx = (acct, type, amount, meta = {}) => {
  acct.history = acct.history || [];
  acct.history.push(Object.assign({ id: UUID(), type, amount, balanceAfter: acct.solde, timestamp: new Date().toISOString() }, meta));
};

/**
 * Fonction pour créer un client.
 */

const createClient = (prenom, nom) => {
  const c = { id: UUID(), nom, prenom };
  clients.push(c);
  return c;
};

/**
 * Fonction pour créer un compte en banque à un client (si le client existe)
 */

const createBankAccount = (clientId, solde = 0, type = 'courant') => {
  if (!clients.some(c => c.id === clientId)) return console.log('Client non trouvé');
  if (solde < 0) return console.log('Solde initial invalide');
  const acc = { id: UUID(), clientId, solde, type, history: [] };
  comptesBancaires.push(acc);
  return acc;
};

/**
 * Fonction pour supprimer un compte en banque si le solde est à 0.
 */

const deleteBankAccount = id => {
  const i = comptesBancaires.findIndex(a => a.id === id);
  if (i === -1) return console.log('Compte non trouvé');
  if (comptesBancaires[i].solde !== 0) return console.log('Impossible de supprimer un compte avec un solde non nul');
  return comptesBancaires.splice(i, 1)[0];
};

/**
 * Fonctions de gestion des transactions.
 */

//dépot supérieur à 0 sinon erreur.
const deposit = (id, amount) => {
  const a = findAcct(id); if (!a) return console.log('Compte non trouvé');
  if (!(amount > 0)) return console.log('Montant invalide');
  a.solde += amount; pushTx(a, 'deposit', amount); return a.solde;
};

//retrait, sauf si le montant est supérieur au solde ou négatif.
const withdraw = (id, amount) => {
  const a = findAcct(id); if (!a) return console.log('Compte non trouvé');
  if (!(amount > 0) || amount > a.solde) return console.log('Montant invalide ou fonds insuffisants');
  a.solde -= amount; pushTx(a, 'withdraw', amount); return a.solde;
};


//transfert entre deux comptes, avec vérifications. (supérieur, pas négatif)
const transfer = (fromId, toId, amount) => {
  const f = findAcct(fromId), t = findAcct(toId); if (!f || !t) return console.log('Compte source ou destination introuvable');
  if (!(amount > 0) || amount > f.solde) return console.log('Montant invalide ou fonds insuffisants');
  f.solde -= amount; t.solde += amount; pushTx(f, 'transfer-debit', amount, { counterparty: toId }); pushTx(t, 'transfer-credit', amount, { counterparty: fromId });
  return { from: f.solde, to: t.solde };
};

/**
 * Afficher le total d'un ou des comptes d'un même client (si il y a plusieurs compte
 * en banque) et afficher l'historique des transactions qu'il a effectué.
 */

const getAccountBalance = id => { const a = findAcct(id); if (!a) return console.log('Compte non trouvé'); return a.solde; };
const getAccountHistory = id => { const a = findAcct(id); if (!a) return console.log('Compte non trouvé'); return a.history || []; };
const getTotalBalance = id => {
  if (clients.some(c => c.id === id)) return comptesBancaires.filter(a => a.clientId === id).reduce((s, a) => s + a.solde, 0);
  const acct = comptesBancaires.find(a => a.id === id);
  if (acct) return acct.solde;
  console.log('Aucun compte bancaire trouvé pour cet id');
  return 0;
};

/**
 * Fonction pour avoir le total de tous les comptes en banques (donc total de la banque)
 */
const getBankTotalBalance = () => comptesBancaires.reduce((s, a) => s + a.solde, 0);


//Console log pour affiche au moins les clients et les comptes en banques fixent.
console.log({ clients, comptesBancaires });