# AssureCrypto 🛡️ — Assurance & Affacturage pour prêts crypto

Plateforme **ultra-design** et **100% fonctionnelle** qui sécurise les prêts crypto via l'**assurance** et l'**affacturage**, avec **vérification réelle des garanties USDC** sur la blockchain Ethereum.

## ✨ Fonctionnalités

### 🎨 Design professionnel
- Dark mode crypto avec gradients, glassmorphism, animations
- Navbar sticky responsive (mobile + desktop)
- Hero avec carte portefeuille animée
- Preuve sociale (stats, badges de confiance)
- Grille tarifaire dégressive
- FAQ interactive
- Footer pro avec mentions légales

### 🔗 Côté technique (réel & fonctionnel)
- **Connexion wallet** : MetaMask + WalletConnect
- **Vérification des garanties** : lecture du **vrai solde USDC** on-chain
- **Calcul du ratio de couverture** en direct
- **Simulateur d'affacturage** : avance immédiate, prime, éligibilité
- **Tunnel de souscription guidé** en 3 étapes (wallet → garanties → signature)

### 📚 Sections du site
1. **Hero** — accroche + carte portefeuille animée
2. **Affacturage expliqué** — pédagogie simple avec exemple chiffré
3. **Comment ça marche** — 3 étapes visuelles
4. **Vérification & simulateur** — lecture on-chain réelle
5. **Grille tarifaire** — taux dégressifs selon le ratio
6. **Tunnel de souscription** — guidé en 3 étapes
7. **Sécurité** — badges de confiance
8. **FAQ** — questions fréquentes
9. **CTA final + Footer**

## 🚀 Installation

```bash
npm install
npm run dev
```

Ouvre [http://localhost:3000](http://localhost:3000).

## ⚙️ Configuration

### 1. Clé API RPC (recommandé)
Par défaut le site utilise un provider public (`https://eth.llamarpc.com`).
Pour plus de fiabilité, crée un compte gratuit sur [Infura](https://infura.io) ou [Alchemy](https://alchemy.com) et modifie `.env.local` :

```env
NEXT_PUBLIC_RPC_URL=https://mainnet.infura.io/v3/TON_ID
```

### 2. WalletConnect (optionnel)
Crée un projet sur [WalletConnect Cloud](https://cloud.walletconnect.com) et mets le Project ID dans `.env.local` :
```env
NEXT_PUBLIC_PROJECT_ID=TON_PROJECT_ID
```

## 📁 Structure

```
src/
├── app/
│   ├── layout.tsx            # Layout + SEO
│   ├── page.tsx              # Page principale (assemble tout)
│   └── globals.css           # Styles globaux
├── components/
│   ├── WalletButton.tsx      # Connexion wallet (MetaMask + WC)
│   ├── VerifyCollateral.tsx  # Vérification solde USDC on-chain
│   ├── Simulator.tsx         # Simulateur affacturage & assurance
│   ├── FactoringExplainer.tsx# Pédagogie affacturage
│   ├── HowItWorks.tsx        # 3 étapes
│   ├── TrustBar.tsx          # Stats + badges de confiance
│   ├── PricingTable.tsx      # Grille tarifaire
│   ├── OnboardingTunnel.tsx  # Tunnel de souscription guidé
│   ├── SecuritySection.tsx   # Sécurité
│   ├── FAQ.tsx               # Questions fréquentes
│   └── Footer.tsx            # Pied de page
└── lib/
    ├── ethers.ts             # Utils ethers.js + logique métier
    └── wallet.ts             # Gestion connexion wallet
```

## ⚠️ Limites (honnêteté)

Ce site fait la **vérification des garanties** et la **simulation** de A à Z (lecture on-chain réelle). Mais la **mise en place réelle** de l'assurance — paiement des primes, indemnisation automatique, anti-fraude — nécessite :
- Des **smart contracts** on-chain
- Un **backend** pour la gestion des polices
- Une **base de données** clients

Le front est 100% prêt à être branché sur ces services.

## 🧮 Logique métier incluse

- **Ratio de couverture** = garantie / montant du prêt
- **Taux d'avance d'affacturage** : 60% → 95% selon le ratio
- **Prime d'assurance** : 1.2% → 5% par an selon le ratio
- **Éligibilité** : ratio minimum de 80%
