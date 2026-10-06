"use client";

import { ShieldCheck, Twitter, Github, Linkedin, Mail } from "lucide-react";

const cols = [
  {
    title: "Produit",
    links: ["Affacturage", "Assurance", "Tarifs", "Simulateur", "FAQ"],
  },
  {
    title: "Entreprise",
    links: ["À propos", "Équipe", "Carrières", "Presse", "Contact"],
  },
  {
    title: "Légal",
    links: ["Mentions légales", "Confidentialité", "CGU", "Conformité", "Audits"],
  },
];

export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-dark-700 bg-dark-950/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 rounded-xl bg-gradient-to-br from-accent-blue to-accent-purple">
                <ShieldCheck size={22} className="text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight">
                Assure<span className="text-accent-blue">Crypto</span>
              </span>
            </div>
            <p className="text-sm text-gray-400 max-w-xs leading-relaxed">
              L'assurance et l'affacturage décentralisés pour sécuriser tes prêts crypto. Transparent, rapide, fiable.
            </p>
            <div className="flex gap-3 mt-6">
              {[Twitter, Github, Linkedin, Mail].map((Icon, i) => (
                <a key={i} href="#" className="p-2.5 rounded-xl bg-dark-700 text-gray-400 hover:text-white hover:bg-dark-600 transition-all">
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {cols.map((col, i) => (
            <div key={i}>
              <h4 className="text-white font-semibold mb-4">{col.title}</h4>
              <ul className="space-y-2.5">
                {col.links.map((link, j) => (
                  <li key={j}>
                    <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">{link}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-dark-700 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500">© {new Date().getFullYear()} AssureCrypto. Tous droits réservés.</p>
          <p className="text-xs text-gray-500 flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-accent-green animate-pulse" />
            Tous les systèmes sont opérationnels
          </p>
        </div>
      </div>
    </footer>
  );
}
