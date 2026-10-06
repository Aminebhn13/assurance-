// Génération d'une attestation d'assurance téléchargeable (HTML imprimable / PDF).

export interface AttestationData {
  reference: string;
  address: string;
  message: string;
  signature: string;
  balances: string;      // description texte des soldes
  readAt: string;
  loanAmountUsd: number;
  durationMonths: number;
  fundName: string;
  planName: string;
  coverageRate: number;
  premiumUsd: number;
  clientType?: string;
  score?: string;
  coverageRatio?: number;
}

export function generateReference(): string {
  return "AC-" + Date.now().toString(36).toUpperCase() + "-" + Math.random().toString(36).slice(2, 6).toUpperCase();
}

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

const STYLES = `
  :root{
    --navy:#0b1f3a; --navy2:#13294d; --gold:#c9a24b; --gold2:#e4c877;
    --ink:#1a2233; --muted:#6b7686; --line:#e5e8ee; --bg:#eef1f6;
  }
  *{box-sizing:border-box}
  html,body{margin:0;padding:0}
  body{font-family:"Segoe UI",Helvetica,Arial,sans-serif;color:var(--ink);background:var(--bg);-webkit-print-color-adjust:exact;print-color-adjust:exact}
  .toolbar{max-width:820px;margin:20px auto 0;display:flex;gap:10px;justify-content:flex-end;padding:0 10px}
  .btn{cursor:pointer;border:none;border-radius:10px;padding:11px 20px;font-size:14px;font-weight:600}
  .btn-print{background:var(--navy);color:#fff}
  .btn-print:hover{background:var(--navy2)}
  .page{max-width:820px;margin:16px auto 40px;background:#fff;position:relative;overflow:hidden;
    box-shadow:0 10px 40px rgba(11,31,58,.14);border-radius:14px}
  .watermark{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%) rotate(-32deg);
    font-size:120px;font-weight:800;color:rgba(11,31,58,.04);letter-spacing:8px;white-space:nowrap;pointer-events:none;z-index:0}
  .inner{position:relative;z-index:1;padding:46px 54px}
  header{display:flex;justify-content:space-between;align-items:flex-start;
    padding-bottom:22px;border-bottom:3px solid var(--gold)}
  .brand{display:flex;align-items:center;gap:14px}
  .logo{width:52px;height:52px;border-radius:13px;background:linear-gradient(135deg,var(--navy),var(--navy2));
    display:flex;align-items:center;justify-content:center;box-shadow:inset 0 0 0 1.5px rgba(201,162,75,.5)}
  .brand-name{font-size:22px;font-weight:800;color:var(--navy);letter-spacing:.3px}
  .brand-sub{font-size:11px;color:var(--muted);letter-spacing:2px;text-transform:uppercase;margin-top:2px}
  .ref-box{text-align:right;font-size:12px;color:var(--muted)}
  .ref-box .ref{font-family:"Courier New",monospace;font-size:14px;font-weight:700;color:var(--navy)}
  .badge{display:inline-block;margin-top:8px;padding:4px 10px;border-radius:999px;font-size:10px;font-weight:700;
    letter-spacing:1px;text-transform:uppercase;background:rgba(201,162,75,.15);color:#8a6d1f;border:1px solid rgba(201,162,75,.4)}
  h1{font-size:19px;color:var(--navy);margin:30px 0 4px;letter-spacing:.3px}
  .lead{font-size:13px;color:var(--muted);margin:0 0 24px}
  .grid{display:grid;grid-template-columns:1fr 1fr;gap:16px}
  .card{border:1px solid var(--line);border-radius:12px;padding:16px 18px;background:#fbfcfe}
  .card h3{margin:0 0 12px;font-size:11px;letter-spacing:1.4px;text-transform:uppercase;color:var(--gold);font-weight:700}
  .row{display:flex;justify-content:space-between;gap:12px;padding:6px 0;font-size:13px;border-bottom:1px solid #f1f3f7}
  .row:last-child{border-bottom:none}
  .row .k{color:var(--muted)}
  .row .v{font-weight:600;text-align:right}
  .mono{font-family:"Courier New",monospace;font-size:11px;word-break:break-all;color:var(--ink)}
  .full{grid-column:1 / -1}
  .score{display:flex;align-items:center;gap:18px}
  .score .big{width:68px;height:68px;border-radius:16px;display:flex;align-items:center;justify-content:center;
    font-size:34px;font-weight:800;color:#fff;background:linear-gradient(135deg,var(--navy),var(--navy2));
    box-shadow:inset 0 0 0 2px rgba(201,162,75,.55)}
  .score .meta{font-size:13px}
  .score .meta .ratio{font-size:22px;font-weight:800;color:var(--navy)}
  .sig-block{background:#0b1f3a;border-radius:12px;padding:16px 18px;color:#cdd6e4}
  .sig-block h3{color:var(--gold2)}
  .sig-block .mono{color:#aebdd4}
  .legal{margin-top:26px;padding-top:18px;border-top:1px solid var(--line);font-size:11px;color:var(--muted);line-height:1.6}
  footer{margin-top:22px;display:flex;justify-content:space-between;align-items:flex-end;font-size:11px;color:var(--muted)}
  .stamp{text-align:center}
  .stamp .ring{width:92px;height:92px;border-radius:50%;border:2px dashed rgba(201,162,75,.6);
    display:flex;align-items:center;justify-content:center;color:#8a6d1f;font-size:10px;font-weight:700;
    text-transform:uppercase;letter-spacing:1px;text-align:center;padding:8px;transform:rotate(-8deg)}
  @media (max-width:640px){.inner{padding:28px 22px}.grid{grid-template-columns:1fr}.watermark{font-size:72px}}
  .for-pdf .page{box-shadow:none;margin:0;max-width:none;border-radius:0}
  @media print{
    body{background:#fff}
    .toolbar{display:none}
    .page{box-shadow:none;margin:0;max-width:none;border-radius:0}
    @page{margin:14mm}
  }
`;

function pageMarkup(d: AttestationData): string {
  const issued = new Date();
  const issuedStr = issued.toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" });
  const readStr = new Date(d.readAt).toLocaleString("fr-FR");
  const money = (n: number) => n.toLocaleString("fr-FR", { maximumFractionDigits: 0 }) + " USD";

  return `  <div class="page">
    <div class="watermark">INDICATIF</div>
    <div class="inner">
      <header>
        <div class="brand">
          <div class="logo">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2 4 5v6c0 5 3.4 8.3 8 11 4.6-2.7 8-6 8-11V5l-8-3Z" stroke="#e4c877" stroke-width="1.5" fill="rgba(228,200,119,.12)"/>
              <path d="M8.5 12.2 11 14.7l4.6-5" stroke="#e4c877" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <div>
            <div class="brand-name">AssureCrypto</div>
            <div class="brand-sub">Assurance de prêt crypto</div>
          </div>
        </div>
        <div class="ref-box">
          N° d'attestation<br>
          <span class="ref">${esc(d.reference)}</span><br>
          Émise le ${issuedStr}
          <div class="badge">Document indicatif</div>
        </div>
      </header>

      <h1>Attestation d'assurance de prêt</h1>
      <p class="lead">Ce document atteste de l'étude de couverture réalisée pour l'emprunteur identifié ci-dessous, sur la base d'une preuve de contrôle d'adresse et d'une lecture on-chain de ses actifs.</p>

      <div class="grid">
        <div class="card">
          <h3>Assuré (emprunteur)</h3>
          <div class="row"><span class="k">Type de client</span><span class="v">${esc(d.clientType || "—")}</span></div>
          <div class="row"><span class="k">Fonds prêteur</span><span class="v">${esc(d.fundName || "—")}</span></div>
          <div class="row full"><span class="k">Adresse wallet</span></div>
          <div class="mono">${esc(d.address)}</div>
        </div>

        <div class="card">
          <h3>Évaluation de solvabilité</h3>
          <div class="score">
            <div class="big">${esc(d.score || "—")}</div>
            <div class="meta">
              <div class="ratio">${d.coverageRatio != null ? d.coverageRatio.toFixed(0) + " %" : "—"}</div>
              <div class="k" style="color:var(--muted)">Ratio de couverture</div>
            </div>
          </div>
          <div class="row" style="margin-top:12px"><span class="k">Soldes lus le</span><span class="v">${esc(readStr)}</span></div>
          <div class="row full"><span class="k">Détail des soldes</span></div>
          <div class="mono" style="font-family:'Segoe UI',Arial,sans-serif;font-size:12px">${esc(d.balances)}</div>
        </div>

        <div class="card full">
          <h3>Conditions de couverture</h3>
          <div class="grid" style="gap:0 28px">
            <div class="row"><span class="k">Montant du prêt</span><span class="v">${money(d.loanAmountUsd)}</span></div>
            <div class="row"><span class="k">Durée</span><span class="v">${d.durationMonths} mois</span></div>
            <div class="row"><span class="k">Formule</span><span class="v">${esc(d.planName)}</span></div>
            <div class="row"><span class="k">Taux de couverture</span><span class="v">${(d.coverageRate * 100).toFixed(0)} %</span></div>
            <div class="row full"><span class="k">Prime indicative</span><span class="v" style="color:var(--navy);font-size:15px">${money(d.premiumUsd)}</span></div>
          </div>
        </div>

        <div class="card full sig-block">
          <h3>Preuve de contrôle — Sign-In with Ethereum (EIP-4361)</h3>
          <div class="mono" style="white-space:pre-wrap;margin-bottom:12px">${esc(d.message)}</div>
          <div style="font-size:11px;letter-spacing:1px;text-transform:uppercase;color:#8aa0c4;margin-bottom:4px">Signature cryptographique</div>
          <div class="mono">${esc(d.signature)}</div>
        </div>
      </div>

      <div class="legal">
        <strong>Mentions.</strong> Ce document est <strong>indicatif</strong> et n'a aucune valeur contractuelle tant qu'il n'a pas été confirmé et émis par le porteur de risque [À COMPLÉTER : nom et agrément du porteur de risque — ACPR / ORIAS]. Les soldes constituent une photographie à l'instant de la lecture et peuvent varier. AssureCrypto n'accède jamais aux fonds de l'assuré : la signature SIWE ci-dessus ne confère aucune autorisation de transfert. L'authenticité de cette attestation peut être vérifiée en recalculant l'adresse signataire à partir du message et de la signature (ethers.verifyMessage).
      </div>

      <footer>
        <div>
          AssureCrypto — Assurance &amp; vérification de solvabilité crypto<br>
          [À COMPLÉTER : raison sociale, SIREN, agrément] · support@[À COMPLÉTER]
        </div>
        <div class="stamp">
          <div class="ring">AssureCrypto<br>Vérifié</div>
        </div>
      </footer>
    </div>
  </div>`;
}

export function buildAttestationHtml(d: AttestationData): string {
  return `<!DOCTYPE html>
<html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Attestation ${esc(d.reference)} — AssureCrypto</title>
<style>${STYLES}</style></head>
<body>
  <div class="toolbar">
    <button class="btn btn-print" onclick="window.print()">Imprimer / Enregistrer en PDF</button>
  </div>
${pageMarkup(d)}
</body></html>`;
}

// Génère un vrai fichier PDF A4 côté client, à partir du même design.
export async function downloadAttestation(d: AttestationData): Promise<void> {
  const mod = await import("html2pdf.js");
  const html2pdf = (mod as unknown as { default: (...a: unknown[]) => any }).default;

  const wrapper = document.createElement("div");
  wrapper.className = "for-pdf";
  wrapper.style.cssText = "position:fixed;left:-10000px;top:0;width:820px;background:#fff;z-index:-1";
  wrapper.innerHTML = `<style>${STYLES}</style>${pageMarkup(d)}`;
  document.body.appendChild(wrapper);

  const target = wrapper.querySelector(".page") as HTMLElement;
  try {
    await html2pdf()
      .set({
        margin: 0,
        filename: `attestation-${d.reference}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, backgroundColor: "#ffffff" },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
        pagebreak: { mode: ["css", "avoid-all"] },
      })
      .from(target)
      .save();
  } finally {
    document.body.removeChild(wrapper);
  }
}
