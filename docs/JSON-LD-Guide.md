# JSON-LD Implementation Guide

This project includes comprehensive JSON-LD structured data implementation using TypeScript and Next.js.

## Components Created

### JsonLd.tsx

A reusable component for rendering JSON-LD structured data with XSS protection. It sanitizes the JSON string to prevent XSS attacks by replacing dangerous characters with their unicode equivalents.

**Usage:**

```tsx
import { JsonLd } from "@/components/JsonLd";
import { WithContext, Product } from "schema-dts";

const productSchema: WithContext<Product> = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "Example Product",
  description: "Product description",
};

<JsonLd data={productSchema} id="product-schema" />;
```

### BreadcrumbSchema.tsx

Renders BreadcrumbList structured data for better navigation understanding by search engines.

**Usage:**

```tsx
import { BreadcrumbSchema } from "@/components/BreadcrumbSchema";

const breadcrumbItems = [
  { name: "Home", url: "https://example.com" },
  { name: "Category", url: "https://example.com/category" },
  { name: "Current Page" },
];

<BreadcrumbSchema items={breadcrumbItems} />;
```

### FAQSchema.tsx

Renders FAQ structured data which can help pages appear in FAQ rich results.

**Usage:**

```tsx
import { FAQSchema } from "@/components/FAQSchema";

const faqs = [
  {
    question: "How do I use this app?",
    answer:
      "Simply add your items and start ranking them by choosing between pairs.",
  },
];

<FAQSchema faqs={faqs} />;
```

## Current Implementation

### Root Layout (layout.tsx)

- **WebApplication schema**: Describes the main ranking application
- **Organization schema**: Describes the creator/organization

### Lists Page (app/lists/page.tsx)

- **BreadcrumbList schema**: Navigation breadcrumbs for the lists page

## Validation

You can validate your structured data using:

- [Google's Rich Results Test](https://search.google.com/test/rich-results)
- [Schema Markup Validator](https://validator.schema.org/)

## Additional Schema Types You Can Add

Based on your ranking app, you might want to add:

1. **SoftwareApplication** for mobile app versions
2. **Article** schema for blog posts or help content
3. **Review** schema for user reviews of the app
4. **HowTo** schema for tutorials on how to use the ranking features
5. **CreativeWork** schema for user-generated ranking lists

## Security Notes

All JSON-LD output is sanitized to prevent XSS attacks by:

- Replacing `<` with `\\u003c`
- Replacing `>` with `\\u003e`
- Replacing `&` with `\\u0026`

This follows Next.js security best practices for structured data implementation.
