
// ===============================
// UTILS & DATA
// ===============================

// Génère un UUID unique
const UUID = (typeof crypto !== 'undefined' && crypto.randomUUID)
  ? crypto.randomUUID.bind(crypto)
  : () => Date.now().toString(36) + Math.random().toString(36).slice(2);

// Données clients fixes
const clients = [
  { id: '5e385eab-f13b-466a-9dff-e3b9121382c3', nom: 'Henry', prenom: 'Charles' },
  { id: '5695efb5-6cd1-4c39-8901-8bf33dc69801', nom: 'Sylvie', prenom: 'Sophie' },
  { id: '132976a7-1dd5-46de-9e6a-712603ad4288', nom: 'Dupont', prenom: 'Paul' }
];

// Données comptes bancaires fixes
const comptesBancaires = [
  { id: 'a1f5c3e2-3b6d-4f8e-9c2d-1e2f3a4b5c6d', clientId: clients[0].id, solde: 1500, type: 'courant', history: [] },
  { id: 'b2g6d4f3-4c7e-5g9f-0d3e-2f3g4b5c6d7e', clientId: clients[1].id, solde: 2500.5, type: 'épargne', history: [] },
  { id: 'c3h7e5g4-5d8f-6h0g-1e4f-3g4h5c6d7e8f', clientId: clients[2].id, solde: 300.75, type: 'courant', history: [] }
];

// ===============================
// FONCTIONS MÉTIER BANQUE
// ===============================

// Trouver un compte par son ID
const findAcct = id => comptesBancaires.find(a => a.id === id);

// Ajouter une transaction à l'historique
const pushTx = (acct, type, amount, meta = {}) => {
  acct.history = acct.history || [];
  acct.history.push({
    id: UUID(),
    type,
    amount,
    balanceAfter: acct.solde,
    timestamp: new Date().toISOString(),
    ...meta
  });
};

// Créer un client
const createClient = (prenom, nom) => {
  const c = { id: UUID(), nom, prenom };
  clients.push(c);
  return c;
};

// Créer un compte bancaire pour un client existant
const createBankAccount = (clientId, solde = 0, type = 'courant') => {
  if (!clients.some(c => c.id === clientId)) {
    console.log('Client non trouvé');
    return;
  }
  if (!(solde > 0)) {
    console.log('Solde initial invalide (doit être > 0)');
    return;
  }
  const acc = { id: UUID(), clientId, solde, type, history: [] };
  comptesBancaires.push(acc);
  return acc;
};

// Supprimer un compte bancaire si le solde est à 0
const deleteBankAccount = id => {
  const i = comptesBancaires.findIndex(a => a.id === id);
  if (i === -1) {
    console.log('Compte non trouvé');
    return;
  }
  if (comptesBancaires[i].solde !== 0) {
    console.log('Impossible de supprimer un compte avec un solde non nul');
    return;
  }
  return comptesBancaires.splice(i, 1)[0];
};

// Dépôt sur un compte
const deposit = (id, amount) => {
  const a = findAcct(id);
  if (!a) {
    console.log('Compte non trouvé');
    return;
  }
  if (!(amount > 0)) {
    console.log('Montant invalide');
    return;
  }
  a.solde += amount;
  pushTx(a, 'deposit', amount);
  return a.solde;
};

// Retrait sur un compte
const withdraw = (id, amount) => {
  const a = findAcct(id);
  if (!a) {
    console.log('Compte non trouvé');
    return;
  }
  if (!(amount > 0) || amount > a.solde) {
    console.log('Montant invalide ou fonds insuffisants');
    return;
  }
  a.solde -= amount;
  pushTx(a, 'withdraw', amount);
  return a.solde;
};

// Transfert entre deux comptes
const transfer = (fromId, toId, amount) => {
  const f = findAcct(fromId), t = findAcct(toId);
  if (!f || !t) {
    console.log('Compte source ou destination introuvable');
    return;
  }
  if (!(amount > 0) || amount > f.solde) {
    console.log('Montant invalide ou fonds insuffisants');
    return;
  }
  f.solde -= amount;
  t.solde += amount;
  pushTx(f, 'transfer-debit', amount, { counterparty: toId });
  pushTx(t, 'transfer-credit', amount, { counterparty: fromId });
  return { from: f.solde, to: t.solde };
};

// Obtenir le solde d'un compte
const getAccountBalance = id => {
  const a = findAcct(id);
  if (!a) {
    console.log('Compte non trouvé');
    return;
  }
  return a.solde;
};

// Obtenir l'historique d'un compte
const getAccountHistory = id => {
  const a = findAcct(id);
  if (!a) {
    console.log('Compte non trouvé');
    return [];
  }
  return a.history || [];
};

// Obtenir le solde total d'un client (tous ses comptes)
const getTotalBalance = id => {
  if (clients.some(c => c.id === id)) {
    return comptesBancaires.filter(a => a.clientId === id).reduce((s, a) => s + a.solde, 0);
  }
  const acct = comptesBancaires.find(a => a.id === id);
  if (acct) return acct.solde;
  console.log('Aucun compte bancaire trouvé pour cet id');
  return 0;
};

// Obtenir le solde total de la banque
const getBankTotalBalance = () => comptesBancaires.reduce((s, a) => s + a.solde, 0);

// Appliquer des intérêts annuels
const applyInterest = (id, rate) => {
  const a = findAcct(id);
  if (!a) {
    console.log('Compte non trouvé');
    return;
  }
  if (!(rate >= 0)) {
    console.log("Taux d'intérêt invalide");
    return;
  }
  const interestAmount = a.solde * (rate / 100);
  a.solde += interestAmount;
  pushTx(a, 'interest', interestAmount, { rate });
  console.log(`Intérêts de ${interestAmount.toFixed(2)} appliqués (taux: ${rate}%). Nouveau solde: ${a.solde.toFixed(2)}`);
  return a.solde;
};

// Appliquer des frais de tenue de compte
const applyFee = (id, amount) => {
  const a = findAcct(id);
  if (!a) {
    console.log('Compte non trouvé');
    return;
  }
  if (!(amount >= 0)) {
    console.log('Montant de frais invalide');
    return;
  }
  if (amount > a.solde) {
    console.log('Fonds insuffisants pour appliquer les frais');
    return;
  }
  a.solde -= amount;
  pushTx(a, 'fee', amount);
  console.log(`Frais de ${amount} appliqués. Nouveau solde: ${a.solde.toFixed(2)}`);
  return a.solde;
};

// Debug : afficher les clients et comptes initiaux
console.log({ clients, comptesBancaires });


// ===============================
// INTERFACE UTILISATEUR (UI)
// ===============================

// Afficher une notification
const showNotification = (message, type = 'success') => {
  const notif = document.getElementById('notification');
  notif.textContent = message;
  notif.className = `notification ${type}`;
  notif.classList.add('show');
  setTimeout(() => notif.classList.remove('show'), 3000);
};

// Obtenir le nom d'un client par son ID
const getClientName = clientId => {
  const client = clients.find(c => c.id === clientId);
  return client ? `${client.prenom} ${client.nom}` : 'Client inconnu';
};

// Afficher la liste des clients
const renderClients = () => {
  const container = document.getElementById('clientsList');
  if (clients.length === 0) {
    container.innerHTML = '<div class="empty-state">Aucun client enregistré</div>';
    return;
  }
  container.innerHTML = clients.map(client => {
    const totalBalance = getTotalBalance(client.id);
    const accountCount = comptesBancaires.filter(a => a.clientId === client.id).length;
    return `
      <div class="client-item">
        <div class="client-name">${client.prenom} ${client.nom}</div>
        <div class="client-id">ID: ${client.id}</div>
        <div class="client-id">Comptes: ${accountCount} | Total: ${totalBalance.toFixed(2)} €</div>
      </div>
    `;
  }).join('');
  updateClientSelects();
};

// Afficher la liste des comptes bancaires
const renderAccounts = () => {
  const container = document.getElementById('accountsList');
  const bankTotal = document.getElementById('bankTotal');
  bankTotal.textContent = getBankTotalBalance().toFixed(2);
  if (comptesBancaires.length === 0) {
    container.innerHTML = '<div class="empty-state">Aucun compte bancaire</div>';
    return;
  }
  container.innerHTML = comptesBancaires.map(account => {
    const clientName = getClientName(account.clientId);
    const historyCount = account.history ? account.history.length : 0;
    return `
      <div class="account-item">
        <div class="account-header">
          <div>
            <div class="client-name">${clientName}</div>
            <div class="account-detail">ID: ${account.id}</div>
            <div class="account-detail">Transactions: ${historyCount}</div>
          </div>
          <div style="text-align:right;">
            <div class="account-balance">${account.solde.toFixed(2)} €</div>
            <span class="account-type">${account.type}</span>
          </div>
        </div>
        <div class="account-actions">
          <button class="btn btn-danger" onclick="handleDeleteAccount('${account.id}')">
            Supprimer
          </button>
        </div>
      </div>
    `;
  }).join('');
  updateAccountSelects();
};

// Mettre à jour les listes déroulantes de clients
const updateClientSelects = () => {
  const select = document.getElementById('accountClient');
  select.innerHTML = '<option value="">Sélectionnez un client</option>' +
    clients.map(c => `<option value="${c.id}">${c.prenom} ${c.nom}</option>`).join('');
};

// Mettre à jour les listes déroulantes de comptes
const updateAccountSelects = () => {
  const selects = ['depositAccount', 'withdrawAccount', 'transferFrom', 'transferTo'];
  selects.forEach(selectId => {
    const select = document.getElementById(selectId);
    select.innerHTML = '<option value="">Sélectionnez un compte</option>' +
      comptesBancaires.map(a => {
        const clientName = getClientName(a.clientId);
        return `<option value="${a.id}">${clientName} - ${a.type} (${a.solde.toFixed(2)} €)</option>`;
      }).join('');
  });
};

// Gestion des formulaires

// Création d'un client
document.getElementById('createClientForm').addEventListener('submit', e => {
  e.preventDefault();
  const prenom = document.getElementById('clientPrenom').value.trim();
  const nom = document.getElementById('clientNom').value.trim();
  const solde = parseFloat(document.getElementById('clientSolde').value);
  if (!prenom || !nom || isNaN(solde)) {
    showNotification('Veuillez remplir tous les champs', 'error');
    return;
  }
  if (!(solde > 0)) {
    showNotification('Le solde initial doit être supérieur à 0 €', 'error');
    return;
  }
  const newClient = createClient(prenom, nom);
  const newAccount = createBankAccount(newClient.id, solde, 'courant');
  if (newAccount) {
    showNotification(`Client ${prenom} ${nom} créé avec un compte courant de ${solde.toFixed(2)} € !`, 'success');
    e.target.reset();
    renderClients();
    renderAccounts();
  } else {
    showNotification('Erreur lors de la création du client ou du compte', 'error');
  }
});

// Création d'un compte bancaire
document.getElementById('createAccountForm').addEventListener('submit', e => {
  e.preventDefault();
  const clientId = document.getElementById('accountClient').value;
  const solde = parseFloat(document.getElementById('accountSolde').value);
  const type = document.getElementById('accountType').value;
  if (!clientId) {
    showNotification('Veuillez sélectionner un client', 'error');
    return;
  }
  if (!(solde > 0)) {
    showNotification('Le solde initial doit être supérieur à 0 €', 'error');
    return;
  }
  const newAccount = createBankAccount(clientId, solde, type);
  if (newAccount) {
    const clientName = getClientName(clientId);
    showNotification(`Compte ${type} créé pour ${clientName} !`, 'success');
    e.target.reset();
    renderAccounts();
    renderClients();
  } else {
    showNotification('Erreur lors de la création du compte', 'error');
  }
});

// Dépôt d'argent
document.getElementById('depositForm').addEventListener('submit', e => {
  e.preventDefault();
  const accountId = document.getElementById('depositAccount').value;
  const amount = parseFloat(document.getElementById('depositAmount').value);
  if (!accountId) {
    showNotification('Veuillez sélectionner un compte', 'error');
    return;
  }
  const result = deposit(accountId, amount);
  if (result !== undefined) {
    showNotification(`Dépôt de ${amount.toFixed(2)} € effectué avec succès !`, 'success');
    e.target.reset();
    renderAccounts();
    renderClients();
  } else {
    showNotification('Erreur lors du dépôt', 'error');
  }
});

// Retrait d'argent
document.getElementById('withdrawForm').addEventListener('submit', e => {
  e.preventDefault();
  const accountId = document.getElementById('withdrawAccount').value;
  const amount = parseFloat(document.getElementById('withdrawAmount').value);
  if (!accountId) {
    showNotification('Veuillez sélectionner un compte', 'error');
    return;
  }
  const result = withdraw(accountId, amount);
  if (result !== undefined) {
    showNotification(`Retrait de ${amount.toFixed(2)} € effectué avec succès !`, 'success');
    e.target.reset();
    renderAccounts();
    renderClients();
  } else {
    showNotification('Erreur lors du retrait (fonds insuffisants ?)', 'error');
  }
});

// Transfert d'argent
document.getElementById('transferForm').addEventListener('submit', e => {
  e.preventDefault();
  const fromId = document.getElementById('transferFrom').value;
  const toId = document.getElementById('transferTo').value;
  const amount = parseFloat(document.getElementById('transferAmount').value);
  if (!fromId || !toId) {
    showNotification('Veuillez sélectionner les deux comptes', 'error');
    return;
  }
  if (fromId === toId) {
    showNotification('Les comptes source et destination doivent être différents', 'error');
    return;
  }
  const result = transfer(fromId, toId, amount);
  if (result) {
    showNotification(`Transfert de ${amount.toFixed(2)} € effectué avec succès !`, 'success');
    e.target.reset();
    renderAccounts();
    renderClients();
  } else {
    showNotification('Erreur lors du transfert', 'error');
  }
});

// Suppression d'un compte
window.handleDeleteAccount = accountId => {
  const account = findAcct(accountId);
  if (!account) {
    showNotification('Compte non trouvé', 'error');
    return;
  }
  if (account.solde !== 0) {
    showNotification(`Impossible de supprimer : solde de ${account.solde.toFixed(2)} € restant`, 'warning');
    return;
  }
  const clientName = getClientName(account.clientId);
  if (confirm(`Êtes-vous sûr de vouloir supprimer ce compte de ${clientName} ?`)) {
    const deleted = deleteBankAccount(accountId);
    if (deleted) {
      showNotification('Compte supprimé avec succès !', 'success');
      renderAccounts();
      renderClients();
    } else {
      showNotification('Erreur lors de la suppression', 'error');
    }
  }
};

// Initialisation de l'interface au chargement
document.addEventListener('DOMContentLoaded', () => {
  renderClients();
  renderAccounts();
});