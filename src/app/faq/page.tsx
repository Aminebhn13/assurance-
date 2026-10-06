import FAQAccordion from "@/components/FAQAccordion";

export default function Faq() {
  return (
    <div>
      <h1 className="text-3xl sm:text-4xl font-bold mb-2">Questions fréquentes</h1>
      <p className="text-gray-400 mb-8">Plus de 30 questions regroupées par thème. Trouvez la réponse à vos interrogations.</p>
      <FAQAccordion />
    </div>
  );
}
