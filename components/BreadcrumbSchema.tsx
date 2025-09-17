import { WithContext, BreadcrumbList } from "schema-dts";
import { JsonLd } from "./JsonLd";

interface BreadcrumbItem {
  name: string;
  url?: string;
}

interface BreadcrumbSchemaProps {
  items: BreadcrumbItem[];
}

/**
 * Component for rendering BreadcrumbList structured data
 */
export function BreadcrumbSchema({ items }: BreadcrumbSchemaProps) {
  const breadcrumbSchema: WithContext<BreadcrumbList> = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      ...(item.url && { item: item.url }),
    })),
  };

  return <JsonLd data={breadcrumbSchema} id="breadcrumb-schema" />;
}
