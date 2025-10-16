/**
 * Création de la base client.
 */

const clients = [
    {
        id: '5e385eab-f13b-466a-9dff-e3b9121382c3',
        nom: 'Henry',
        prenom: 'Charles'
    },
    {
        id: '5695efb5-6cd1-4c39-8901-8bf33dc69801',
        nom: 'Sylvie',
        prenom: 'Sophie'
    },
    {
        id: '132976a7-1dd5-46de-9e6a-712603ad4288',
        nom: 'Durand',
        prenom: 'Paul'
    }
];

console.log(clients);

/**
 * Création des comptes bancaires des clients préexistants.
 */

const comptesBancaires = [
    {
        id: 'a1f5c3e2-3b6d-4f8e-9c2d-1e2f3a4b5c6d',
        clientId: '5e385eab-f13b-466a-9dff-e3b9121382c3',
        solde: 1500.00,
        type: 'courant',
        history: []
    },
    {
        id: 'b2g6d4f3-4c7e-5g9f-0d3e-2f3g4b5c6d7e',
        clientId: '5695efb5-6cd1-4c39-8901-8bf33dc69801',
        solde: 2500.50,
        type: 'épargne',
        history: []
    },
    {
        id: 'c3h7e5g4-5d8f-6h0g-1e4f-3g4h5c6d7e8f',
        clientId: '132976a7-1dd5-46de-9e6a-712603ad4288',
        solde: 300.75,
        type: 'courant',
        history: []
    }
];  

console.log(comptesBancaires);

/**
 * Possibilité de créer des nouveaux clients
 **/

// Fonction pour générer un identifiant unique. (uuid crypto)
const UUID = crypto.randomUUID.bind(crypto);

// Fonction pour créer un nouveau client
const createClient = (FirstName, LastName) => {
    const newClient = {
        id: UUID(),
        nom: LastName,
        prenom: FirstName
    };
    clients.push(newClient);
    console.log('Nouveau client créé:', newClient);
}

/**
 * Possibilité de créer un nouveau compte bancaire pour un client existant
 */

// Fonction pour créer un nouveau compte bancaire
const createBankAccount = (clientId, initialBalance, accountType) => {
    // Vérifier si le client existe
    const clientExists = clients.some(client => client.id === clientId);
    if (!clientExists) {
        console.log('Client non trouvé. Impossible de créer un compte bancaire.');
        return;
    }

    const newAccount = {
        id: UUID(),
        clientId: clientId,
        solde: initialBalance,
        type: accountType
    };
    // initialiser l'historique des transactions pour le nouveau compte
    newAccount.history = [];
    comptesBancaires.push(newAccount);
    console.log('Nouveau compte bancaire créé:', newAccount);
}

/**
 * Supprimer un compte bancaire
 */

const deleteBankAccount = (accountId) => {
    const accountIndex = comptesBancaires.findIndex(account => account.id === accountId);
    if (accountIndex === -1) {
        console.log('Compte bancaire non trouvé. Impossible de le supprimer.');
        return;
    }
    comptesBancaires.splice(accountIndex, 1);
    console.log(`Compte bancaire avec l'ID ${accountId} supprimé.`);
}

/**
 * Déposer de l'argent sur le compte d'un client.
 */

const deposit = (accountId, amount) => {
    const account = comptesBancaires.find(account => account.id === accountId);
    if (!account) {
        console.log('Compte bancaire non trouvé. Impossible de déposer de l\'argent.');
        return;
    }
    if (amount <= 0) {
        console.log('Le montant du dépôt doit être supérieur à zéro.');
        return;
    }
    account.solde += amount;
    console.log(`Dépôt de ${amount} effectué sur le compte ${accountId}. Nouveau solde: ${account.solde}`);
    // Enregistrer la transaction dans l'historique du compte
    const depositTx = {
        id: UUID(),
        type: 'deposit',
        amount,
        balanceAfter: account.solde,
        timestamp: new Date().toISOString()
    };
    account.history = account.history || [];
    account.history.push(depositTx);
    console.log('Transaction enregistrée dans l\'historique:', depositTx);
}

/**
 * Retirer de l'argent du compte d'un client.
 */

const withdraw = (accountId, amount) => {
    const account = comptesBancaires.find(account => account.id === accountId);
    if (!account) {
        console.log('Compte bancaire non trouvé. Impossible de retirer de l\'argent.');
        return;
    }
    if (amount <= 0) {
        console.log('Le montant du retrait doit être supérieur à zéro.');
        return;
    }
    if (amount > account.solde) {
        console.log('Fonds insuffisants pour ce retrait.');
        return;
    }
    account.solde -= amount;
    console.log(`Retrait de ${amount} effectué sur le compte ${accountId}. Nouveau solde: ${account.solde}`);
    // Enregistrer la transaction dans l'historique du compte
    const withdrawTx = {
        id: UUID(),
        type: 'withdraw',
        amount,
        balanceAfter: account.solde,
        timestamp: new Date().toISOString()
    };
    account.history = account.history || [];
    account.history.push(withdrawTx);
    console.log('Transaction enregistrée dans l\'historique:', withdrawTx);
}

/**
 * Possibilité de trasnférer de l'argent entre deux comptes bancaires.
 **/

const transfer = (fromAccountId, toAccountId, amount) => {
    const fromAccount = comptesBancaires.find(account => account.id === fromAccountId);
    const toAccount = comptesBancaires.find(account => account.id === toAccountId);

    if (!fromAccount) {
        console.log('Compte bancaire source non trouvé. Impossible de transférer de l\'argent.');
        return;
    }
    if (!toAccount) {
        console.log('Compte bancaire de destination non trouvé. Impossible de transférer de l\'argent.');
        return;
    }
    if (amount <= 0) {
        console.log('Le montant du transfert doit être supérieur à zéro.');
        return;
    }
    if (amount > fromAccount.solde) {
        console.log('Fonds insuffisants pour ce transfert.');
        return;
    }

    fromAccount.solde -= amount;
    toAccount.solde += amount;
    console.log(`Transfert de ${amount} de ${fromAccountId} à ${toAccountId} effectué.`);
    console.log(`Nouveau solde du compte source: ${fromAccount.solde}`);
    console.log(`Nouveau solde du compte de destination: ${toAccount.solde}`);
    // Enregistrer les transactions horodatées dans l'historique des deux comptes
    const timestamp = new Date().toISOString();
    const debitTx = {
        id: UUID(),
        type: 'transfer-debit',
        amount,
        balanceAfter: fromAccount.solde,
        counterparty: toAccountId,
        timestamp
    };
    const creditTx = {
        id: UUID(),
        type: 'transfer-credit',
        amount,
        balanceAfter: toAccount.solde,
        counterparty: fromAccountId,
        timestamp
    };
    fromAccount.history = fromAccount.history || [];
    toAccount.history = toAccount.history || [];
    fromAccount.history.push(debitTx);
    toAccount.history.push(creditTx);
    console.log('Transactions enregistrées dans les historiques:', debitTx, creditTx);
}

/**
 * Possibilité d'afficher le solde d'un compte bancaire pour un client id donné.
 */

const getAccountBalance = (accountId) => {
    const account = comptesBancaires.find(account => account.id === accountId);
    if (!account) {
        console.log('Compte bancaire non trouvé.');
        return;
    }
    console.log(`Le solde du compte ${accountId} est de: ${account.solde}`);
    return account.solde;
}


/**
 * Possibilité d'afficher l'historique des transactions pour un compte donné.
 */

const getAccountHistory = (accountId) => {
    const account = comptesBancaires.find(account => account.id === accountId);
    if (!account) {
        console.log('Compte bancaire non trouvé.');
        return;
    }
    if (!account.history || account.history.length === 0) {
        console.log('Aucune transaction trouvée pour ce compte.');
        return;
    }
    console.log(`Historique des transactions pour le compte ${accountId}:`, account.history);
    return account.history;
}

/** 
 * Possibilité d'afficher l'argent total détenu par un client sur tous ses comptes.
 */

const getTotalBalance = (clientId) => {
    const clientAccounts = comptesBancaires.filter(account => account.clientId === clientId);
    if (clientAccounts.length === 0) {
        console.log('Aucun compte bancaire trouvé pour ce client.');
        return;
    }
    const totalBalance = clientAccounts.reduce((total, account) => total + account.solde, 0);
    console.log(`Le solde total pour le client ${clientId} est de: ${totalBalance}`);
    return totalBalance;
}

/**
 * Possibilité d'afficher l'argent total détenu par la banque sur tous les comptes.
 */

const getBankTotalBalance = () => {
    const totalBalance = comptesBancaires.reduce((total, account) => total + account.solde, 0);
    console.log(`Le solde total détenu par la banque sur tous les comptes est de: ${totalBalance}`);
    return totalBalance;
}