import { WithContext, Thing } from "schema-dts";

interface JsonLdProps {
  data: WithContext<Thing>;
  id?: string;
}

/**
 * Component for rendering JSON-LD structured data with XSS protection
 * Sanitizes the JSON string to prevent XSS attacks by replacing dangerous characters
 */
export function JsonLd({ data, id }: JsonLdProps) {
  // Sanitize the JSON string to prevent XSS attacks
  const sanitizedJson = JSON.stringify(data)
    .replace(/</g, "\\u003c") // Replace < with unicode equivalent
    .replace(/>/g, "\\u003e") // Replace > with unicode equivalent
    .replace(/&/g, "\\u0026"); // Replace & with unicode equivalent

  return (
    <script
      id={id}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: sanitizedJson }}
    />
  );
}
