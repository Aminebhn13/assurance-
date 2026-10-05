import Link from "next/link";

export default function Footer() {
  const cols = [
    {
      title: "Comprendre",
      links: [
        { href: "/assurance-de-pret", label: "Assurance de prêt" },
        { href: "/affacturage", label: "Affacturage" },
        { href: "/solvabilite", label: "Solvabilité" },
        { href: "/securite-wallet", label: "Sécurité wallet" },
        { href: "/glossaire", label: "Glossaire" },
        { href: "/faq", label: "FAQ" },
      ],
    },
    {
      title: "Assureur",
      links: [
        { href: "/comment-ca-marche", label: "Comment ça marche" },
        { href: "/tarifs", label: "Tarifs" },
        { href: "/fonds-partenaires", label: "Fonds partenaires" },
        { href: "/souscrire", label: "Souscrire" },
      ],
    },
    {
      title: "Légal",
      links: [
        { href: "/mentions-legales", label: "Mentions légales" },
        { href: "/cgu", label: "CGU" },
        { href: "/confidentialite", label: "Confidentialité" },
      ],
    },
  ];

  return (
    <footer className="border-t border-navy-border bg-navy-dark">
      <div className="mx-auto max-w-6xl px-4 py-12 grid gap-8 sm:grid-cols-2 md:grid-cols-4">
        <div>
          <div className="text-xl font-bold gold-text mb-3">AssureCrypto</div>
          <p className="text-sm text-gray-400">
            L&apos;assurance qui rassure votre prêteur. AssureCrypto ne prête pas d&apos;argent et ne finance rien.
          </p>
        </div>
        {cols.map((c) => (
          <div key={c.title}>
            <div className="font-semibold text-gold-light mb-3">{c.title}</div>
            <ul className="space-y-2 text-sm">
              {c.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-gray-400 hover:text-white transition">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-navy-border py-4 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} AssureCrypto. [À COMPLÉTER : n° d&apos;agrément ACPR / ORIAS]
      </div>
    </footer>
  );
}
