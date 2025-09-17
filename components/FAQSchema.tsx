import { WithContext, FAQPage } from "schema-dts";
import { JsonLd } from "./JsonLd";

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSchemaProps {
  faqs: FAQItem[];
}

/**
 * Component for rendering FAQ structured data
 * Useful for help pages or FAQ sections
 */
export function FAQSchema({ faqs }: FAQSchemaProps) {
  const faqSchema: WithContext<FAQPage> = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return <JsonLd data={faqSchema} id="faq-schema" />;
}
