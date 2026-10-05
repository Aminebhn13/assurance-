# AssureCrypto — Assurance de prêt crypto

AssureCrypto est un assureur de prêt crypto. AssureCrypto **ne prête pas d'argent** et **ne finance rien** : il couvre le prêteur (fonds d'investissement partenaire) contre le défaut de remboursement de l'emprunteur.

## Le parcours

1. Le client veut un financement auprès d'un fonds partenaire.
2. Le fonds exige une preuve de solvabilité et une assurance de prêt.
3. Le client connecte son wallet pour prouver qu'il détient les actifs déclarés, choisit une couverture, reçoit une attestation.
4. En cas de défaut, l'assurance indemnise le fonds selon la police.

## Sécurité

AssureCrypto ne demande **jamais** d'approuver un contrat, de transférer des fonds ni de signer une transaction. La seule signature demandée est un message texte lisible (Sign-In with Ethereum, EIP-4361) qui ne donne aucune autorisation.

## Démarrage

```bash
npm install
cp .env.example .env.local   # puis remplis les valeurs
npm run dev
```

Ouvre http://localhost:3000

## Build de production

```bash
npm run build
npm start
```
