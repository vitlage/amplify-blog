import './global.css';
import HomeClient from "@/components/home/HomeClient";

export default function Home({ searchParams }) {
  // Server component: no client-side state/effects here.

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
      <HomeClient searchParams={searchParams} />
    </div>
  );
}
