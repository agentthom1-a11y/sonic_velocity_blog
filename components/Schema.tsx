import React from 'react';

type SchemaType = 'Organization' | 'WebSite' | 'BlogPosting' | 'BreadcrumbList' | 'FAQPage' | 'CollectionPage';

interface SchemaProps {
  type: SchemaType;
  data: Record<string, any>;
}

export const Schema: React.FC<SchemaProps> = ({ type, data }) => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': type,
    ...data,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};

export const OrganizationSchema = ({ baseUrl }: { baseUrl: string }) => (
  <Schema
    type="Organization"
    data={{
      name: 'Sonic Velocity',
      url: baseUrl,
      description: 'AI music intelligence platform tracking Indonesian and Asian music trends, AI audio synthesis models, viral song patterns, momentum songs, and creator growth signals.',
      logo: `${baseUrl}/icon.svg`,
      sameAs: [
        'https://x.com/sonicvelmusic',
        'https://www.instagram.com/sonicvelocitymusic/',
      ],
    }}
  />
);

export const WebSiteSchema = ({ baseUrl, locale }: { baseUrl: string, locale: string }) => (
  <Schema
    type="WebSite"
    data={{
      name: 'Sonic Velocity',
      url: baseUrl,
      description: 'AI music intelligence platform tracking Indonesian and Asian music trends, AI audio synthesis models, viral song patterns, momentum songs, and creator growth signals.',
      potentialAction: {
        '@type': 'SearchAction',
        target: `${baseUrl}/${locale}/transmissions?q={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    }}
  />
);
