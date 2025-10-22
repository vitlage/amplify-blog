import './global.css';
import HomeClient from "@/components/home/HomeClient";

// Page will be statically optimized automatically by Next.js

export default function Home() {
  // Server component: no client-side state/effects here.
  // For static export, don't pass searchParams
  const staticSearchParams = {};

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: 'Convertic AI',
            url: 'https://convertic.ai',
            logo: 'https://convertic.ai/logo.png',
            sameAs: [
              'https://www.linkedin.com/company/convertic-ai/',
              'https://twitter.com/convertic_ai'
            ]
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            url: 'https://convertic.ai',
            name: 'Convertic AI',
            potentialAction: {
              '@type': 'SearchAction',
              target: {
                '@type': 'EntryPoint',
                urlTemplate: 'https://convertic.ai/blog?search={search_term_string}'
              },
              'query-input': 'required name=search_term_string'
            }
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            itemListElement: [
              {
                '@type': 'SiteNavigationElement',
                position: 1,
                name: 'Home',
                url: 'https://convertic.ai'
              },
              {
                '@type': 'SiteNavigationElement',
                position: 2,
                name: 'Pricing',
                url: 'https://convertic.ai/pricing'
              },
              {
                '@type': 'SiteNavigationElement',
                position: 3,
                name: 'Blog',
                url: 'https://convertic.ai/blog'
              }
            ]
          }),
        }}
      />
      <HomeClient searchParams={staticSearchParams} />
    </div>
  );
}
