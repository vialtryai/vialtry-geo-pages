#!/usr/bin/env node

/**
 * VIALTRY SCHEMA INJECTOR
 * 
 * Injects JSON-LD schema into HTML files for AI visibility
 * - ACP ready (ChatGPT)
 * - UCP ready (Gemini)
 * - Perplexity crawlable
 * - Amazon Rufus compatible
 * 
 * Usage: node inject-schema.js [directory]
 * Default: ./
 * 
 * Pattern: ai-catalog-visibility-[category]-[topic]-[region].html
 * Example: ai-catalog-visibility-beauty-skincare-india.html
 */

const fs = require('fs');
const path = require('path');

// ============================================================================
// CONFIG
// ============================================================================

const CONFIG = {
  BRAND_NAME: 'Vialtry',
  BRAND_URL: 'https://vialtry.com',
  BRAND_LOGO: 'https://vialtry.com/logo.png',
  SUPPORT_EMAIL: 'support@vialtry.com',
};

// Category → metadata mapping
const CATEGORIES = {
  beauty: {
    name: 'Beauty & Personal Care',
    breadcrumbs: ['Shop', 'Beauty'],
    description: 'Optimize your beauty product catalog for AI commerce visibility',
  },
  fashion: {
    name: 'Fashion & Apparel',
    breadcrumbs: ['Shop', 'Fashion'],
    description: 'Improve AI visibility for fashion and apparel products',
  },
  home: {
    name: 'Home & Kitchen',
    breadcrumbs: ['Shop', 'Home'],
    description: 'AI catalog optimization for home and kitchen products',
  },
  electronics: {
    name: 'Electronics',
    breadcrumbs: ['Shop', 'Electronics'],
    description: 'Electronics product visibility on AI shopping agents',
  },
  food: {
    name: 'Food & Beverages',
    breadcrumbs: ['Shop', 'Food'],
    description: 'Food product discoverability in AI search',
  },
  general: {
    name: 'General Products',
    breadcrumbs: ['Shop', 'Products'],
    description: 'General product catalog optimization for AI agents',
  },
};

// ============================================================================
// SCHEMA GENERATION
// ============================================================================

/**
 * Extract category from filename
 * Pattern: ai-catalog-visibility-[category]-[topic]-[region].html
 */
function extractCategory(filename) {
  const match = filename.match(/ai-catalog-visibility-(\w+)-/);
  return match ? match[1].toLowerCase() : 'general';
}

/**
 * Extract topic from filename
 * Pattern: ai-catalog-visibility-[category]-[topic]-[region].html
 */
function extractTopic(filename) {
  const match = filename.match(/ai-catalog-visibility-\w+-(.+?)-\w+\.html/);
  if (!match) return 'product optimization';
  return match[1].replace(/-/g, ' ');
}

/**
 * Generate Organization schema
 */
function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: CONFIG.BRAND_NAME,
    url: CONFIG.BRAND_URL,
    logo: CONFIG.BRAND_LOGO,
    description: 'AI commerce visibility platform for D2C brands',
    sameAs: [
      'https://twitter.com/vialtry',
      'https://linkedin.com/company/vialtry',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      email: CONFIG.SUPPORT_EMAIL,
      contactType: 'Customer Support',
    },
  };
}

/**
 * Generate BreadcrumbList schema
 */
function generateBreadcrumbSchema(category, topic) {
  const categoryConfig = CATEGORIES[category] || CATEGORIES.general;
  const breadcrumbs = [
    {
      position: 1,
      name: 'Vialtry',
      item: CONFIG.BRAND_URL,
    },
    {
      position: 2,
      name: 'AI Catalog Visibility',
      item: `${CONFIG.BRAND_URL}/ai-catalog`,
    },
  ];

  categoryConfig.breadcrumbs.forEach((name, idx) => {
    breadcrumbs.push({
      position: idx + 3,
      name: name,
      item: `${CONFIG.BRAND_URL}/ai-catalog/${name.toLowerCase()}`,
    });
  });

  breadcrumbs.push({
    position: breadcrumbs.length + 1,
    name: topic.charAt(0).toUpperCase() + topic.slice(1),
    item: '',
  });

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs,
  };
}

/**
 * Generate WebPage + FAQPage schema
 */
function generateWebPageSchema(filename, category, topic) {
  const categoryConfig = CATEGORIES[category] || CATEGORIES.general;
  const url = `${CONFIG.BRAND_URL}/ai-catalog/${filename.replace('.html', '')}`;

  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: `${categoryConfig.name} - AI Visibility Guide`,
    description: `${categoryConfig.description} - ${topic}`,
    url: url,
    isPartOf: {
      '@type': 'WebSite',
      name: CONFIG.BRAND_NAME,
      url: CONFIG.BRAND_URL,
    },
    mainEntity: {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: `Why is AI visibility important for ${categoryConfig.name.toLowerCase()}?`,
          acceptedAnswer: {
            '@type': 'Answer',
            text: `AI agents like ChatGPT, Gemini, and Perplexity now power product discovery. Without proper catalog optimization and schema markup, ${categoryConfig.name.toLowerCase()} products are invisible to these AI shopping agents. Vialtry solves this by auditing your catalog, fixing missing data, and ensuring compliance with ACP, UCP, and other AI commerce protocols.`,
          },
        },
        {
          '@type': 'Question',
          name: `How does Vialtry optimize ${categoryConfig.name.toLowerCase()} catalogs for AI?`,
          acceptedAnswer: {
            '@type': 'Answer',
            text: `Vialtry uses three core steps: (1) Audit - scan your product feeds for schema errors, missing descriptions, and broken images; (2) Fix - auto-correct data quality issues; (3) Deploy - sync optimized catalog to ChatGPT ACP, Google UCP, Perplexity, Amazon Rufus, and other AI platforms. Result: your products show up in AI shopping results.`,
          },
        },
        {
          '@type': 'Question',
          name: `What is the difference between ACP, UCP, and other AI protocols?`,
          acceptedAnswer: {
            '@type': 'Answer',
            text: `ACP (OpenAI Agentic Commerce Protocol) powers ChatGPT shopping. UCP (Google Unified Commerce) powers Gemini and Google AI Mode. Perplexity has its own crawler. Amazon Rufus reads product XML. Vialtry generates separate, optimized feeds for each platform from your single product catalog, so you don't have to.`,
          },
        },
        {
          '@type': 'Question',
          name: `How long does it take to get ${categoryConfig.name.toLowerCase()} products visible in AI agents?`,
          acceptedAnswer: {
            '@type': 'Answer',
            text: `Timeline varies: ChatGPT (ACP approval: 3-7 days, then weekly crawls); Gemini (3-5 days); Google Shopping (1-2 days); Perplexity (daily). Plan for 2-4 weeks from setup to full propagation. Vialtry handles all platform integrations; you just provide clean product data.`,
          },
        },
        {
          '@type': 'Question',
          name: `Can I use Vialtry if I sell on Shopify?`,
          acceptedAnswer: {
            '@type': 'Answer',
            text: `Yes. Vialtry works with any product catalog—Shopify, WooCommerce, custom stores, or spreadsheets. We auto-fetch your product feed, audit it, and push optimized versions to AI platforms. If you're on Shopify, we also offer a direct app integration for automatic syncing.`,
          },
        },
      ],
    },
    publisher: {
      '@type': 'Organization',
      name: CONFIG.BRAND_NAME,
      logo: {
        '@type': 'ImageObject',
        url: CONFIG.BRAND_LOGO,
      },
    },
  };
}

/**
 * Inject all schemas into HTML
 */
function injectSchemaIntoHTML(filePath) {
  let html = fs.readFileSync(filePath, 'utf-8');
  const filename = path.basename(filePath);

  // Skip if already has Vialtry schema
  if (html.includes('Vialtry')) {
    console.log(`⊘ Already injected: ${filename}`);
    return false;
  }

  const category = extractCategory(filename);
  const topic = extractTopic(filename);

  const schemas = [
    generateOrganizationSchema(),
    generateBreadcrumbSchema(category, topic),
    generateWebPageSchema(filename, category, topic),
  ];

  // Build schema tags
  const schemaTags = schemas
    .map(
      (schema) =>
        `<script type="application/ld+json">\n${JSON.stringify(schema, null, 2)}\n</script>`
    )
    .join('\n');

  // Inject into <head> before </head>
  if (html.includes('</head>')) {
    html = html.replace('</head>', `${schemaTags}\n</head>`);
  } else if (html.includes('<body')) {
    // Fallback: inject after <body>
    html = html.replace(/<body[^>]*>/, `$&\n${schemaTags}`);
  } else {
    console.log(`✗ No <head> or <body> tag found: ${filename}`);
    return false;
  }

  fs.writeFileSync(filePath, html, 'utf-8');
  console.log(`✓ Schema injected: ${filename}`);
  return true;
}

// ============================================================================
// MAIN
// ============================================================================

function main() {
  const targetDir = process.argv[2] || './';

  if (!fs.existsSync(targetDir)) {
    console.error(`✗ Directory not found: ${targetDir}`);
    process.exit(1);
  }

  // Find all ai-catalog-visibility-*.html files
  const files = fs
    .readdirSync(targetDir)
    .filter(
      (f) =>
        f.endsWith('.html') && f.startsWith('ai-catalog-visibility-')
    )
    .sort();

  if (files.length === 0) {
    console.log(`⊘ No HTML files matching pattern found in ${targetDir}`);
    process.exit(0);
  }

  console.log(`\n🔄 Injecting schema into ${files.length} HTML files...\n`);

  let injected = 0;
  let skipped = 0;
  let failed = 0;

  files.forEach((file) => {
    try {
      const result = injectSchemaIntoHTML(path.join(targetDir, file));
      if (result) {
        injected++;
      } else {
        skipped++;
      }
    } catch (e) {
      console.error(`✗ Error processing ${file}: ${e.message}`);
      failed++;
    }
  });

  console.log(`\n✅ Complete:`);
  console.log(`  ✓ Injected: ${injected}`);
  console.log(`  ⊘ Skipped: ${skipped}`);
  console.log(`  ✗ Failed: ${failed}`);
  console.log(`  📊 Total: ${files.length}\n`);

  process.exit(failed > 0 ? 1 : 0);
}

main();
