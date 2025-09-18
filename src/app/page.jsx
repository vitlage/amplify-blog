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
          }),
        }}
      />
      <HomeClient searchParams={staticSearchParams} />
    </div>
  );
}
