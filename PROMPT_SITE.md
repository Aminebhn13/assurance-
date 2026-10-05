# Prompt — refonte du site AssureCrypto

> À coller tel quel dans DeCensor v1.5 ou DeepSeek V4 Flash.
> Conseil : DeepSeek V4 Flash a tendance à tronquer les gros fichiers. Si c'est le cas, demande-lui « continue fichier par fichier » après la première réponse.

---

## RÔLE

Tu es un développeur senior Next.js / TypeScript spécialisé Web3 et un rédacteur expert en assurance et finance structurée. Tu livres du code complet, prêt à compiler, sans « // ... reste du code ». Tout le contenu du site est en **français**.

## CONTEXTE MÉTIER (à comprendre avant d'écrire une ligne)

**AssureCrypto est un assureur de prêt crypto. AssureCrypto ne prête pas d'argent et ne finance rien.**

Le parcours réel :

1. Un client (particulier ou entreprise) veut obtenir un financement auprès d'un **fonds d'investissement / prêteur partenaire**.
2. Le fonds exige que le client **prouve sa solvabilité** et que le prêt soit **couvert par une assurance de prêt**.
3. Le client vient sur AssureCrypto, **connecte son wallet** pour prouver qu'il détient bien les actifs qu'il déclare (preuve de fonds), choisit une couverture, et reçoit une **attestation d'assurance** qu'il transmet au fonds.
4. Si le client fait défaut, l'assurance indemnise le fonds selon les conditions de la police.

AssureCrypto se rémunère uniquement par la **prime d'assurance**.

### Ce que signifie « connecter son wallet » ici (point technique central)

- La connexion se fait via **WalletConnect (protocole Reown)** et **MetaMask / wallets injectés (EIP-1193)**.
- La preuve de solvabilité repose sur deux éléments, et **uniquement** ceux-là :
  1. **Preuve de contrôle de l'adresse** : le client signe un message texte lisible au format **Sign-In with Ethereum (EIP-4361 / SIWE)** via `personal_sign`. Ce message ne coûte rien, ne déplace aucun fonds et ne donne aucune autorisation. Il contient : domaine, adresse, déclaration en clair (« Je certifie être le détenteur de cette adresse pour l'évaluation de solvabilité AssureCrypto. Cette signature n'autorise aucun transfert. »), nonce, date d'émission, chainId.
  2. **Lecture publique des soldes on-chain** (lecture seule, via RPC) : ETH natif + stablecoins (USDC `0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48`, USDT `0xdAC17F958D2ee523a2206206994597C13D831ec7`) sur Ethereum mainnet, extensible à d'autres chaînes.
- À partir de ces soldes, le site calcule un **score de solvabilité** et un **ratio de couverture** (actifs vérifiés / montant du prêt demandé).

### INTERDICTIONS TECHNIQUES ABSOLUES (non négociables)

Le code ne doit **jamais** contenir ni appeler :
- `approve`, `increaseAllowance`, `setApprovalForAll`, `permit`, `Permit2`, `transfer`, `transferFrom`, `eth_sendTransaction`, `eth_signTypedData` (EIP-712) ;
- aucune adresse « spender » ou « receiver » ;
- aucune signature autre que le message SIWE texte décrit ci-dessus.

Ajoute sur le site un encadré visible : « AssureCrypto ne vous demandera jamais d'approuver un contrat, de transférer des fonds ni de signer une transaction. Si un site prétendant être AssureCrypto vous le demande, c'est une arnaque. »

### HONNÊTETÉ DU CONTENU

- N'invente **aucun** audit, réassureur nommé, agrément, chiffre client, avis ou partenaire. Là où une information réelle sera nécessaire, mets un placeholder visible : `[À COMPLÉTER : n° d'agrément ACPR / ORIAS]`, `[À COMPLÉTER : nom du porteur de risque]`, etc.
- Les mentions légales, les CGU et la politique de confidentialité doivent exister avec ces placeholders.

## STACK (obligatoire, pour rester compatible avec le repo existant et Vercel)

- Next.js **14.2** (App Router), React 18, TypeScript strict, Tailwind CSS 3
- `ethers` v6, `@walletconnect/ethereum-provider`, `@walletconnect/modal`, `lucide-react`
- Variables d'environnement : `NEXT_PUBLIC_RPC_URL`, `NEXT_PUBLIC_USDC_CONTRACT`, `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`
- Aucune erreur TypeScript : `npm run build` doit passer. Attention aux `string | null` (adresse wallet).
- Responsive mobile-first, thème sombre élégant (bleu nuit / or), typographie sobre « institution financière ».

## ARBORESCENCE DES PAGES

Le site doit être **très riche en contenu** : un client sérieux doit trouver une réponse à toutes ses questions. Chaque page de contenu fait au minimum 800 à 1500 mots, structurée avec des titres, un sommaire cliquable en haut, des encadrés « À retenir » et des schémas en SVG/CSS. Le parcours de souscription reste, lui, court et clair (le contenu riche est **à côté** du tunnel, pas un obstacle devant lui).

1. **`/` Accueil** — proposition de valeur (« L'assurance qui rassure votre prêteur »), schéma du parcours Client → AssureCrypto → Fonds, bloc sécurité wallet, chiffres-clés en placeholder, CTA « Vérifier ma solvabilité ».
2. **`/comment-ca-marche`** — le parcours en 6 étapes détaillées, rôle de chaque acteur (client, fonds, assureur, porteur de risque), ce qui se passe en cas de défaut.
3. **`/assurance-de-pret`** — qu'est-ce qu'une assurance de prêt (assurance-crédit, garantie de remboursement), différence avec une caution, avec une sûreté réelle (nantissement), avec une assurance emprunteur classique ; spécificités crypto (volatilité, liquidation, custody).
4. **`/affacturage`** — guide complet : définition, affacturage avec/sans recours, notifié/confidentiel, reverse factoring, affacturage de créances tokenisées / RWA, rôle de l'assurance-crédit dans l'affacturage, exemple chiffré pas à pas, glossaire.
5. **`/solvabilite`** — ce qu'est une preuve de solvabilité, proof-of-funds vs proof-of-reserves, comment fonctionne la vérification par wallet (SIWE + lecture on-chain), limites (un solde est une photo à un instant T), pourquoi les fonds l'exigent, méthode de calcul du score (formule affichée).
6. **`/securite-wallet`** — ce que la signature SIWE fait et ne fait pas, comment lire ce que votre wallet vous demande de signer, liste des signatures dangereuses à toujours refuser (approve, permit, setApprovalForAll), comment révoquer des autorisations (revoke.cash), bonnes pratiques hardware wallet.
7. **`/tarifs`** — grille de primes selon ratio de couverture et durée (valeurs indicatives clairement marquées « indicatif »), simulateur interactif.
8. **`/fonds-partenaires`** — page destinée aux fonds : ce que contient l'attestation, comment vérifier son authenticité (vérification de la signature SIWE et des soldes à la date indiquée), procédure de sinistre.
9. **`/glossaire`** — au moins 60 termes (LTV, liquidation, stablecoin, custody, prime, franchise, subrogation, recours, cédant, factor, porteur de risque, réassurance, SIWE, EIP-1193, RPC, etc.), classés alphabétiquement avec recherche.
10. **`/faq`** — au moins 30 questions groupées par thème (fonctionnement, wallet & sécurité, tarifs, sinistres, fonds, juridique).
11. **`/souscrire`** — le tunnel (voir ci-dessous).
12. **`/mentions-legales`**, **`/cgu`**, **`/confidentialite`** — avec placeholders.

Header avec menu déroulant « Comprendre » (assurance de prêt, affacturage, solvabilité, sécurité wallet, glossaire) ; footer complet avec toutes les pages.

## TUNNEL DE SOUSCRIPTION (`/souscrire`)

Étapes avec barre de progression :

1. **Votre prêt** : montant demandé (USD), durée (3 à 36 mois), nom du fonds prêteur (texte libre), type de client (particulier / entreprise).
2. **Connexion du wallet** : boutons MetaMask et WalletConnect ; afficher l'adresse abrégée et le réseau ; gestion des erreurs (wallet absent, refus, mauvais réseau) ; bouton déconnexion.
3. **Preuve de contrôle** : afficher **le texte exact** du message SIWE avant signature, puis `personal_sign`. Vérifier côté client avec `ethers.verifyMessage` que l'adresse récupérée correspond.
4. **Analyse de solvabilité** : lecture des soldes ETH/USDC/USDT, conversion en USD (prix via une API publique gratuite type CoinGecko avec repli sur valeur fixe si l'appel échoue), calcul du ratio de couverture et du score (A à E), affichage détaillé.
5. **Choix de la couverture** : 3 formules (Essentielle / Standard / Premium) avec taux de couverture, franchise et prime calculée.
6. **Récapitulatif & attestation** : récapitulatif complet, case « J'ai lu les CGU » obligatoire, puis génération d'une **attestation téléchargeable** (PDF ou HTML imprimable) contenant : n° d'attestation, adresse, message signé, signature, soldes et date de lecture, montant et durée du prêt, formule, mention « Document indicatif en attente d'émission définitive par le porteur de risque ».

Aucune étape ne déclenche de transaction ni de paiement on-chain. Le paiement de la prime est présenté comme « contact commercial / virement » (placeholder).

## STRUCTURE DE CODE ATTENDUE

```
src/
  app/            (une route par page ci-dessus + layout.tsx + globals.css)
  components/     (Header, Footer, TOC, Callout, Diagram*, Simulator, WalletConnectButton, SubscribeWizard/*, Glossary, FAQ)
  lib/
    wallet.ts     (connexion MetaMask + WalletConnect, déconnexion, écoute des changements de compte/réseau)
    siwe.ts       (construction du message EIP-4361 + vérification)
    balances.ts   (lecture seule ETH / ERC-20 balanceOf / decimals)
    pricing.ts    (prix USD, score, ratio, prime)
    attestation.ts
  content/        (textes longs en .ts ou .mdx séparés du JSX)
  types/window.d.ts
```

L'ABI ERC-20 utilisée ne contient **que** `balanceOf`, `decimals`, `symbol`.

## FORMAT DE LIVRAISON

1. Arborescence complète.
2. `package.json` complet.
3. Chaque fichier en entier, dans l'ordre de l'arborescence, chacun précédé de son chemin.
4. À la fin : checklist confirmant (a) aucune fonction interdite dans le code, (b) aucun chiffre/partenaire inventé, (c) `npm run build` sans erreur attendu.
