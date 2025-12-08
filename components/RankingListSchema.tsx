// Example of how to add JSON-LD for a specific ranking list page
// This would be useful if you create individual pages for shared ranking lists

import { WithContext, ItemList, CreativeWork } from "schema-dts";
import { JsonLd } from "@/components/JsonLd";

interface RankingListItem {
  name: string;
  position: number;
  description?: string;
}

interface RankingListSchemaProps {
  title: string;
  description: string;
  items: RankingListItem[];
  author?: string;
  dateCreated?: string;
  url?: string;
}

/**
 * Component for rendering structured data for a ranking list
 * Useful for individual ranking pages that can be shared
 */
export function RankingListSchema({
  title,
  description,
  items,
  author,
  dateCreated,
  url,
}: RankingListSchemaProps) {
  // ItemList schema for the ranking
  const itemListSchema: WithContext<ItemList> = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: title,
    description: description,
    numberOfItems: items.length,
    itemListOrder: "https://schema.org/ItemListOrderDescending",
    itemListElement: items.map((item) => ({
      "@type": "ListItem",
      position: item.position,
      name: item.name,
      ...(item.description && { description: item.description }),
    })),
  };

  // CreativeWork schema for the ranking as a creative work
  const creativeWorkSchema: WithContext<CreativeWork> = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: title,
    description: description,
    ...(author && {
      author: {
        "@type": "Person",
        name: author,
      },
    }),
    ...(dateCreated && { dateCreated }),
    ...(url && { url }),
    genre: "Ranking",
    inLanguage: "en",
  };

  return (
    <>
      <JsonLd data={itemListSchema} id="ranking-list-schema" />
      <JsonLd data={creativeWorkSchema} id="creative-work-schema" />
    </>
  );
}
