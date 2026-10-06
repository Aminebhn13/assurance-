# Prompt — recréer le site AssureCrypto à l'identique (DeCensor v1.5)

> À coller tel quel dans DeCensor v1.5.
> Si la réponse est tronquée, demande « continue le fichier suivant » : le modèle doit livrer TOUS les fichiers, en entier.

---

## RÔLE

Tu es développeur senior Next.js 14 / TypeScript / Tailwind, spécialisé Web3 (ethers v6, WalletConnect), et rédacteur expert en assurance de prêt et affacturage. Tu livres un projet COMPLET, prêt à `npm install && npm run build` sans aucune erreur TypeScript. Tout le contenu visible est en **français**. Ne mets jamais « // reste du code » : chaque fichier est donné en entier.

## PRODUIT (comprends-le avant de coder)

**AssureCrypto est un ASSUREUR DE PRÊT CRYPTO. Il ne prête pas et ne finance rien.**

Parcours réel : un client veut un financement auprès d'un **fonds d'investissement** ; le fonds exige une **preuve de solvabilité** et une **assurance de prêt** ; le client vient sur AssureCrypto, **connecte son wallet** pour prouver qu'il détient les actifs déclarés, choisit une couverture, et télécharge une **attestation** qu'il transmet au fonds. AssureCrypto se rémunère uniquement par la **prime d'assurance**.

### « Connecter son wallet » = deux choses, et rien d'autre
1. **Preuve de contrôle de l'adresse** : le client signe un message texte **Sign-In with Ethereum (EIP-4361 / SIWE)** via `personal_sign`. Gratuit, ne déplace aucun fonds, n'accorde aucune autorisation.
2. **Lecture publique (lecture seule) des soldes on-chain** via RPC : ETH natif + USDC (`0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48`) + USDT (`0xdAC17F958D2ee523a2206206994597C13D831ec7`) sur Ethereum mainnet.

À partir de ces soldes, calcule un **score** (A→E) et un **ratio de couverture** (actifs vérifiés / montant du prêt).

### INTERDICTIONS ABSOLUES (ne jamais écrire ni appeler)
`approve`, `increaseAllowance`, `setApprovalForAll`, `permit`, `Permit2`, `transfer`, `transferFrom`, `eth_sendTransaction`, `eth_signTypedData` (EIP-712), aucune adresse « spender »/« receiver », aucune signature autre que le message SIWE texte. Ces mécanismes sont ceux des arnaques « drainer » ; l'assurance n'en a aucun besoin. L'ABI ERC-20 ne contient QUE `balanceOf`, `decimals`, `symbol`. Affiche partout l'encadré : « AssureCrypto ne vous demandera jamais d'approuver un contrat, de transférer des fonds ni de signer une transaction. »

### Honnêteté
N'invente aucun audit, réassureur, agrément, chiffre ou avis. Utilise des placeholders visibles `[À COMPLÉTER : ...]` (ex. agrément ACPR / ORIAS, nom du porteur de risque).

## STACK EXACTE

- Next.js **14.2.5** (App Router), React 18.3, TypeScript strict, Tailwind 3.4
- `ethers` ^6.13, `@walletconnect/ethereum-provider` ^2.13, `@walletconnect/modal` ^2.6, `lucide-react` ^0.428, `html2pdf.js` ^0.10
- Variables d'env : `NEXT_PUBLIC_RPC_URL`, `NEXT_PUBLIC_USDC_CONTRACT`, `NEXT_PUBLIC_USDT_CONTRACT`, `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`
- Thème sombre « institution financière » : bleu nuit (navy) + or (gold), verre dépoli (`glass`), responsive mobile-first.
- `next.config.mjs` : `reactStrictMode: true`. Déployable sur Vercel sans config.

## ARBORESCENCE À PRODUIRE (identique)

```
.env.example
.gitignore
next.config.mjs
package.json
postcss.config.mjs
tailwind.config.ts
tsconfig.json
src/app/layout.tsx            (Header + Footer, métadonnées FR)
src/app/globals.css           (Tailwind + classes .glass .btn-gold .btn-navy, couleurs navy/gold)
src/app/page.tsx              (Accueil : promesse « L'assurance qui rassure votre prêteur », schéma Client→AssureCrypto→Fonds, bloc sécurité wallet, chiffres [À COMPLÉTER], CTA /souscrire)
src/app/comment-ca-marche/page.tsx
src/app/assurance-de-pret/page.tsx
src/app/affacturage/page.tsx
src/app/solvabilite/page.tsx
src/app/securite-wallet/page.tsx
src/app/tarifs/page.tsx        (grille + <PremiumSimulator/>)
src/app/fonds-partenaires/page.tsx
src/app/glossaire/page.tsx     (<Glossary/>, 60+ termes)
src/app/faq/page.tsx           (<FAQAccordion/>, 30+ questions)
src/app/souscrire/page.tsx     (<SubscribeWizard/> + Callout « Aucune transaction »)
src/app/mentions-legales/page.tsx
src/app/cgu/page.tsx
src/app/confidentialite/page.tsx
src/components/Header.tsx       (menu « Comprendre » déroulant)
src/components/Footer.tsx       (toutes les pages)
src/components/TOC.tsx          (sommaire cliquable)
src/components/Callout.tsx      (variants info/warning/success)
src/components/SecurityBanner.tsx
src/components/PremiumSimulator.tsx
src/components/Glossary.tsx     (recherche + tri alpha)
src/components/FAQAccordion.tsx (accordéon par thème)
src/components/SubscribeWizard.tsx
src/lib/wallet.ts
src/lib/siwe.ts
src/lib/balances.ts
src/lib/pricing.ts
src/lib/attestation.ts
src/types/window.d.ts
src/types/html2pdf.d.ts         (declare module "html2pdf.js";)
```

Chaque page de contenu : 800–1500 mots, titres, sommaire en haut, encadrés « À retenir », schémas en SVG/CSS. Le contenu riche est À CÔTÉ du tunnel, jamais devant.

## LOGIQUE — SPÉCIFICATIONS PRÉCISES

### src/lib/wallet.ts (client)
- `connectMetaMask()` : `eth_requestAccounts`, impose Ethereum mainnet (`wallet_switchEthereumChain`, ajout chain si code 4902), retourne `{address, shortAddress, connected, chainId, method}`.
- `connectWalletConnect()` : init `EthereumProvider` (import dynamique) avec `projectId` depuis `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`, `chains:[1]`, `showQrModal:true`.
- Mémorise le provider actif dans une variable de module ; expose `getActiveProvider()` pour que la signature SIWE passe par le wallet réellement connecté (MetaMask OU WalletConnect).
- `listenToAccountChanges(cb)` avec cleanup.

### src/lib/siwe.ts
- `buildSiweMessage({domain,address,nonce,issuedAt,chainId,statement?})` ; statement par défaut : « Je certifie être le détenteur de cette adresse pour l'évaluation de solvabilité AssureCrypto. Cette signature n'autorise aucun transfert de fonds ni aucune transaction. »
- `generateNonce(len=16)` via `crypto.getRandomValues`.
- `verifySiweSignature(message, signature, expected)` : `ethers.verifyMessage`, compare en minuscules.

### src/lib/balances.ts
- ABI ERC-20 limitée à `balanceOf, decimals, symbol`.
- **Robustesse RPC** : liste d'endpoints `[NEXT_PUBLIC_RPC_URL || llamarpc, ethereum-rpc.publicnode.com, rpc.ankr.com/eth, cloudflare-eth.com]` ; `getWorkingProvider()` essaie chacun (`getBlockNumber()`) jusqu'à un qui répond, sinon lève une erreur claire.
- `getBalances(address)` : lit ETH (try/catch → "0" si échec) + USDC + USDT (chaque lecture ERC-20 try/catch → null), retourne `{address,chainId,network,eth,usdc,usdt,readAt}`.

### src/lib/pricing.ts
- `fetchPrices()` : CoinGecko `simple/price?ids=ethereum,tether,usd-coin&vs_currencies=usd` ; repli `{eth:3000,usdc:1,usdt:1,source:"fallback"}` si échec ; ne jette jamais.
- `computeSolvency(eth,usdc,usdt,prices,loanAmountUsd)` → `{totalUsd,ethUsd,usdcUsd,usdtUsd,loanAmountUsd,coverageRatio,score}`.
- `scoreFromRatio` : ≥150 A, ≥120 B, ≥100 C, ≥70 D, sinon E.
- `COVERAGE_PLANS` : Essentielle (couv 50%, franchise 20%, taux 3,5%), Standard (70/15/4,5%), Premium (90/10/6%).
- `computePremium(montant,duréeMois,plan)` = montant × tauxAnnuel × mois / 12.

### src/components/SubscribeWizard.tsx (client) — tunnel 6 étapes avec barre de progression
1. **Votre prêt** : slider montant **min 500 000, max 50 000 000, pas 500 000, défaut 5 000 000** (USD) ; slider durée 3–36 mois ; champ texte « Nom du fonds prêteur » ; choix Particulier/Entreprise.
2. **Connexion** : boutons MetaMask + WalletConnect, gestion erreurs, affichage adresse, déconnexion. À la connexion, construire le message SIWE (domaine = `window.location.hostname`).
3. **Preuve de contrôle** : afficher le texte EXACT du message, puis `personal_sign` via `getActiveProvider() ?? window.ethereum` ; vérifier avec `verifySiweSignature` ; afficher « ✓ Signature vérifiée ».
4. **Analyse** : bouton « Lancer l'analyse des soldes » → `getBalances` + `fetchPrices` + `computeSolvency` ; afficher ETH/USDC/USDT en USD, total, ratio, score, source du prix.
5. **Couverture** : 3 cartes de formules avec prime calculée ; mention « Prime indicative. Paiement par contact commercial / virement ».
6. **Attestation** : récapitulatif, case CGU obligatoire, bouton « Télécharger l'attestation (PDF) » → `downloadAttestation` (async, état « Génération du PDF… », gestion d'erreur). Aucune transaction, aucun paiement on-chain.

### src/lib/attestation.ts — VRAI PDF A4, design pro
- `generateReference()` → `AC-<base36>-<4 car>`.
- `AttestationData` : reference, address, message, signature, balances (texte), readAt, loanAmountUsd, durationMonths, fundName, planName, coverageRate, premiumUsd, clientType?, score?, coverageRatio?.
- Un bloc `STYLES` (CSS) + `pageMarkup(d)` partagés. Design : fond blanc, carte A4 (max 820px), **filigrane « INDICATIF »** en diagonale, en-tête de marque (logo bouclier SVG or + « AssureCrypto » + sous-titre), encart n° d'attestation + date + badge « Document indicatif », titre, cartes : Assuré (type, fonds, adresse mono), Évaluation (grand score dans un carré navy/or + ratio), Conditions de couverture (montant, durée, formule, taux, prime), bloc sombre « Preuve de contrôle SIWE » (message + signature en mono), pied de page légal avec placeholders + tampon rond « Vérifié ». Couleurs : navy `#0b1f3a`/`#13294d`, or `#c9a24b`/`#e4c877`. `print-color-adjust:exact`. Échapper le HTML (`esc`).
- `buildAttestationHtml(d)` : document complet (avec bouton impression) pour aperçu/fallback.
- `downloadAttestation(d)` **async** : `import("html2pdf.js")`, créer un `<div class="for-pdf">` hors écran (`position:fixed;left:-10000px;width:820px`) contenant `<style>${STYLES}</style>${pageMarkup(d)}`, cibler `.page`, appeler `html2pdf().set({margin:0, filename:`attestation-${ref}.pdf`, image:{type:"jpeg",quality:0.98}, html2canvas:{scale:2,useCORS:true,backgroundColor:"#ffffff"}, jsPDF:{unit:"mm",format:"a4",orientation:"portrait"}, pagebreak:{mode:["css","avoid-all"]}}).from(el).save()`, puis retirer le div (try/finally). CSS `.for-pdf .page{box-shadow:none;border-radius:0;margin:0;max-width:none}`.
- `src/types/html2pdf.d.ts` : `declare module "html2pdf.js";`.

## PIÈGES TYPESCRIPT À ÉVITER (le build DOIT passer)
- `address` est `string | null` : ne jamais le passer à une fonction attendant `string` sans garde (`if (w.address) ...`).
- Pas de `any` implicite ; typer les handlers d'événements wallet (`unknown` puis cast).
- `html2pdf.js` sans types → le module declaration suffit, importer en dynamique et caster `.default`.

## LIVRAISON
1. Arborescence complète. 2. `package.json`, `tsconfig.json`, `tailwind.config.ts`, `postcss.config.mjs`, `.env.example`, `.gitignore`. 3. Tous les fichiers `src/**` en entier. 4. Checklist finale confirmant : (a) aucune fonction interdite, (b) aucun chiffre/partenaire inventé, (c) `npm run build` attendu sans erreur, (d) attestation = vrai PDF.
