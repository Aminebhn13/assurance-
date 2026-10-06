import Glossary from "@/components/Glossary";

export default function Glossaire() {
  return (
    <div>
      <h1 className="text-3xl sm:text-4xl font-bold mb-2">Glossaire</h1>
      <p className="text-gray-400 mb-8">Plus de 60 termes essentiels de l&apos;assurance de prêt, de la finance structurée et de la crypto, classés alphabétiquement.</p>
      <Glossary />
    </div>
  );
}
