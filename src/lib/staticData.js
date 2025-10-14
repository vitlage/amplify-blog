// Static data fetching for build-time generation
// This replaces API calls during static export

// Mock/static data for build time
// Replace this with your actual static data source
export const STATIC_POSTS = [
  {
    _id: '1',
    title: 'Getting Started with AI Email Marketing',
    desc: '<p>Learn how to leverage AI for better email marketing campaigns. Discover advanced techniques, automation strategies, and best practices that will transform your email marketing approach and boost engagement rates significantly.</p><p>This comprehensive guide covers AI-powered personalization, automated segmentation, predictive analytics, and optimization techniques that leading marketers use to achieve higher open rates and conversions.</p>',
    catSlug: 'ai-marketing',
    slug: 'getting-started-ai-email',
    img: '/p1.jpeg',
    createdAt: '2024-01-15T00:00:00.000Z',
    metatags: {
      title: 'Getting Started with AI Email Marketing | Convertic AI Guide',
      description: 'Learn how to leverage AI for better email marketing campaigns. Discover advanced techniques, automation strategies, and best practices to boost engagement rates.',
      keywords: 'AI email marketing, email automation, artificial intelligence, email campaigns, marketing automation, email engagement',
      author: 'Convertic AI Team',
      canonical: 'https://convertic.ai/blog/posts/getting-started-ai-email',
      ogTitle: 'Getting Started with AI Email Marketing | Complete Guide',
      ogDescription: 'Transform your email marketing with AI. Learn advanced techniques and automation strategies that boost engagement rates significantly.',
      ogImage: 'https://convertic.ai/p1.jpeg',
      ogType: 'article',
      twitterCard: 'summary_large_image',
      twitterTitle: 'Getting Started with AI Email Marketing',
      twitterDescription: 'Learn AI email marketing techniques that boost engagement rates significantly.',
      twitterImage: 'https://convertic.ai/p1.jpeg',
      schema: {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": "Getting Started with AI Email Marketing",
        "description": "Learn how to leverage AI for better email marketing campaigns with advanced techniques and automation strategies.",
        "author": {
          "@type": "Organization",
          "name": "Convertic AI"
        },
        "publisher": {
          "@type": "Organization",
          "name": "Convertic AI",
          "logo": {
            "@type": "ImageObject",
            "url": "https://convertic.ai/logo.png"
          }
        },
        "datePublished": "2024-01-15T00:00:00.000Z",
        "dateModified": "2024-01-15T00:00:00.000Z",
        "image": "https://convertic.ai/p1.jpeg",
        "mainEntityOfPage": "https://convertic.ai/blog/posts/getting-started-ai-email"
      }
    }
  },
  {
    _id: '2',
    title: 'AMP Email Best Practices',
    desc: 'Discover the best practices for creating effective AMP emails...',
    catSlug: 'amp-email',
    slug: 'amp-email-best-practices',
    img: '/p1.jpeg',
    createdAt: '2024-01-10T00:00:00.000Z'
  },
  {
    _id: '3',
    title: 'Convertic AI Features Overview',
    desc: 'Explore all the features that make Convertic AI powerful...',
    catSlug: 'product',
    slug: 'convertic-features-overview',
    img: '/p1.jpeg',
    createdAt: '2024-01-05T00:00:00.000Z'
  },
  {
    _id: '4',
    title: 'Interactive Email Templates',
    desc: 'Create engaging interactive email templates that convert...',
    catSlug: 'ai-marketing',
    slug: 'interactive-email-templates',
    img: '/p1.jpeg',
    createdAt: '2024-01-01T00:00:00.000Z'
  },
  {
    _id: '5',
    title: 'Why a Flower Shop Seller Knows the Customer Better than an Email Marketer — And How AMP Emails Can Help',
    metatags: {
      title: 'Why a Flower Shop Seller Knows the Customer Better than an Email Marketer | AMP Email Benefits',
      description: 'Discover why flower shop sellers understand their customers better than email marketers and how AMP emails bridge this gap with interactive, real-time engagement.',
      keywords: 'AI email marketing, email automation, artificial intelligence, email campaigns, marketing automation, email engagement, AMP emails, flower shop, real-time interaction, personalized marketing, email engagement',
      author: 'Convertic AI Team',
      // canonical: 'https://convertic.ai/blog/posts/getting-started-ai-email',
      ogTitle: 'Why a Flower Shop Seller Knows the Customer Better than an Email Marketer | AMP Email Benefits',
      ogDescription: 'Discover why flower shop sellers understand their customers better than email marketers and how AMP emails bridge this gap with interactive, real-time engagement.',
      // ogImage: 'https://convertic.ai/p1.jpeg',
      ogType: 'article',
      // twitterCard: 'summary_large_image',
      twitterTitle: 'Why a Flower Shop Seller Knows the Customer Better than an Email Marketer | AMP Email Benefits',
      twitterDescription: 'Why a Flower Shop Seller Knows the Customer Better than an Email Marketer | AMP Email Benefits',
      // twitterImage: 'https://convertic.ai/p1.jpeg',
      schema: {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": "Why a Flower Shop Seller Knows the Customer Better than an Email Marketer | AMP Email Benefits",
        "description": "Discover why flower shop sellers understand their customers better than email marketers and how AMP emails bridge this gap with interactive, real-time engagement.",
        "author": {
          "@type": "Organization",
          "name": "Convertic.ai"
        },
        "publisher": {
          "@type": "Organization",
          "name": "Convertic.ai",
          "logo": {
            "@type": "ImageObject",
            "url": "https://convertic.ai/logo.png"
          }
        },
        "datePublished": "2025-09-26",
        "dateModified": "2025-09-26",
        // "image": "https://convertic.ai/p1.jpeg",
        "mainEntityOfPage": "https://convertic.ai/blog/posts/how-amp-emails-can-help"
      }
    },
    desc: `
        <article>
          <p>In today’s fast-paced digital marketing world, it’s easy to assume that data-driven email marketers hold the deepest insights into customers. However, when it comes to truly understanding customer needs and preferences, a flower shop seller often has the upper hand. This contrast highlights important lessons about customer relationships and how modern email marketing technologies, like AMP emails, can help marketers close the empathy gap.</p>

          <h2>The Personal Touch of the Flower Shop Seller</h2>
          <p>A flower shop seller sees customers face-to-face. This direct interaction offers rich, qualitative information unavailable to typical marketers:</p>
          <ul>
            <li><strong>Immediate feedback:</strong> Sellers gauge reactions instantly — a smile, hesitation, or questions reveal preferences and emotions.</li>
            <li><strong>Contextual cues:</strong> Sellers notice occasions behind purchases (anniversaries, birthdays, condolences), helping tailor recommendations.</li>
            <li><strong>Relationship building:</strong> Repeat customers forge bonds of trust and familiarity, allowing sellers to remember past orders, favorite flowers, and style.</li>
            <li><strong>Real-time conversations:</strong> Sellers can clarify needs, suggest alternatives, and adapt offers on the spot.</li>
          </ul>
          <p>These human interactions form a nuanced customer understanding built on empathy, observation, and dialogue — aspects that traditional email marketing often lacks.</p>

          <h2>The Gap in Email Marketing</h2>
          <p>Most email marketers rely on data such as open rates, click-through rates, and purchase history. While useful, this </p>
          <ul>
            <li><strong>Is impersonal:</strong> It captures actions but not emotions or motivations.</li>
            <li><strong>Lacks context:</strong> Marketers rarely know why a customer made a purchase or their underlying need.</li>
            <li><strong>Is delayed:</strong> Behavioral data often arrives after the fact, not in real time.</li>
            <li><strong>Has limited interactivity:</strong> Static emails do not allow customers to instantly engage beyond clicking.</li>
          </ul>
          <p>Without the human touch, many email campaigns feel generic and miss opportunities for deeper connection.</p>

          <h2>How AMP Emails Can Help Bridge the Gap</h2>
          <p>AMP (Accelerated Mobile Pages) emails introduce dynamic, interactive content inside emails that can transform passive messages into engaging experiences:</p>
          <ul>
            <li><strong>Real-time interaction:</strong> Customers can fill forms, browse product catalogs, or schedule appointments without leaving the email.</li>
            <li><strong>Feedback collection:</strong> Quick surveys or preference selections enable marketers to gather rich qualitative data.</li>
            <li><strong>Personalization:</strong> Interactive choices empower customers to tailor what they see, giving marketers signals about preferences more like face-to-face cues.</li>
            <li><strong>Instant updates:</strong> Inventory, pricing, or event notifications can refresh in real time, aligning offers closely with customer context.</li>
          </ul>
          <p>By integrating AMP technology, marketers can mimic the conversational, responsive nature of a flower shop seller’s interaction, enriching their understanding of customers beyond basic metrics.</p>

          <h2>Conclusion</h2>
          <p>While a flower shop seller’s intimate customer knowledge comes from personal relationships built through in-person interaction, email marketers can leverage emerging AMP email capabilities to foster similar connections digitally. By enabling real-time engagement and richer feedback inside emails, AMP helps close the empathy gap — moving email marketing closer to the personalized experience customers crave.</p>
        </article>
`,
    catSlug: 'product',
    slug: 'how-amp-emails-can-help',
    img: '',
    createdAt: '2025-09-25'
  }
];

export const STATIC_CATEGORIES = [
  { id: '1', slug: 'ai-marketing', title: 'AI Marketing', color: '#3B82F6' },
  { id: '2', slug: 'amp-email', title: 'AMP Email', color: '#EF4444' },
  { id: '3', slug: 'product', title: 'Product', color: '#10B981' }
];

// Static data fetching functions
export const getStaticPosts = (page = 1, category = null) => {
  console.log('getStaticPosts - page:', page, 'category:', category);
  const POST_PER_PAGE = 5;
  let filteredPosts = STATIC_POSTS;

  if (category) {
    filteredPosts = STATIC_POSTS.filter(post => post.catSlug === category);
    console.log('Filtered posts:', filteredPosts.length, 'out of', STATIC_POSTS.length);
  }

  console.log('Available categories in posts:', [...new Set(STATIC_POSTS.map(p => p.catSlug))]);

  const startIndex = (page - 1) * POST_PER_PAGE;
  const endIndex = startIndex + POST_PER_PAGE;
  const posts = filteredPosts.slice(startIndex, endIndex);

  return {
    posts,
    count: filteredPosts.length
  };
};

export const getStaticCategories = () => {
  return STATIC_CATEGORIES;
};

// For build-time, return empty comments
export const getStaticComments = (postSlug) => {
  return [];
};

// Helper function to truncate HTML content safely
export const truncateHtml = (html, maxLength = 100) => {
  if (!html) return '';
  // Strip HTML tags and get plain text
  const plainText = html.replace(/<[^>]*>/g, '');
  // Truncate and add ellipsis if needed
  return plainText.length > maxLength
    ? plainText.substring(0, maxLength) + '...'
    : plainText;
};

// Helper function to create SEO metatags for new posts
export const createMetatags = ({
  title,
  description,
  keywords,
  slug,
  image = '/p1.jpeg',
  author = 'Convertic AI Team',
  publishedDate,
  articleType = 'article'
}) => {
  const siteUrl = 'https://convertic.ai';
  const canonical = `${siteUrl}/blog/posts/${slug}`;
  const fullImage = image.startsWith('http') ? image : `${siteUrl}${image}`;

  return {
    title: `${title} | Convertic AI`,
    description,
    keywords,
    author,
    canonical,
    ogTitle: title,
    ogDescription: description,
    ogImage: fullImage,
    ogType: articleType,
    twitterCard: 'summary_large_image',
    twitterTitle: title,
    twitterDescription: description,
    twitterImage: fullImage,
    schema: {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": title,
      "description": description,
      "author": {
        "@type": "Organization",
        "name": author
      },
      "publisher": {
        "@type": "Organization",
        "name": "Convertic AI",
        "logo": {
          "@type": "ImageObject",
          "url": `${siteUrl}/logo.png`
        }
      },
      "datePublished": publishedDate,
      "dateModified": publishedDate,
      "image": fullImage,
      "mainEntityOfPage": canonical
    }
  };
};
