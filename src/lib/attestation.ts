// Génération d'une attestation d'assurance téléchargeable (HTML imprimable).

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
}

export function generateReference(): string {
  return "AC-" + Date.now().toString(36).toUpperCase() + "-" + Math.random().toString(36).slice(2, 6).toUpperCase();
}

export function buildAttestationHtml(d: AttestationData): string {
  const date = new Date(d.readAt).toLocaleString("fr-FR");
  return `<!DOCTYPE html>
<html lang="fr"><head><meta charset="utf-8"><title>Attestation ${d.reference}</title>
<style>
body{font-family:Georgia,serif;color:#111;margin:40px;line-height:1.5}
h1{font-size:22px;color:#0E3A6E}.muted{color:#666;font-size:12px}
.box{border:1px solid #ccc;padding:16px;margin:16px 0;background:#fafafa}
table{width:100%;border-collapse:collapse}td,th{border:1px solid #ddd;padding:8px;text-align:left}
.sig{font-family:monospace;font-size:11px;word-break:break-all}
</style></head><body>
<h1>AssureCrypto — Attestation d'assurance de prêt</h1>
<p class="muted">N° d'attestation : ${d.reference} — Document indicatif en attente d'émission définitive par le porteur de risque.</p>
<div class="box">
<h3>Assuré (emprunteur)</h3>
<table><tr><td>Adresse wallet</td><td class="sig">${d.address}</td></tr>
<tr><td>Fonds prêteur</td><td>${d.fundName}</td></tr></table>
</div>
<div class="box">
<h3>Preuve de contrôle (SIWE)</h3>
<p><strong>Message signé :</strong></p>
<p class="sig">${d.message.replace(/\n/g, "<br/>")}</p>
<p><strong>Signature :</strong></p>
<p class="sig">${d.signature}</p>
</div>
<div class="box">
<h3>Soldes vérifiés à la lecture (${date})</h3>
<p>${d.balances}</p>
</div>
<div class="box">
<h3>Couverture</h3>
<table>
<tr><td>Montant du prêt</td><td>${d.loanAmountUsd.toLocaleString("fr-FR")} USD</td></tr>
<tr><td>Durée</td><td>${d.durationMonths} mois</td></tr>
<tr><td>Formule</td><td>${d.planName}</td></tr>
<tr><td>Taux de couverture</td><td>${(d.coverageRate * 100).toFixed(0)}%</td></tr>
<tr><td>Prime indicative</td><td>${d.premiumUsd.toLocaleString("fr-FR")} USD</td></tr>
</table>
</div>
<p class="muted">Ce document est indicatif et n'a aucune valeur contractuelle tant qu'il n'a pas été confirmé par le porteur de risque [À COMPLÉTER : nom du porteur de risque].</p>
</body></html>`;
}

export function downloadAttestation(d: AttestationData): void {
  const html = buildAttestationHtml(d);
  const blob = new Blob([html], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `attestation-${d.reference}.html`;
  a.click();
  URL.revokeObjectURL(url);
}
