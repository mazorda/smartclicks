import React from 'react';
import { Helmet } from 'react-helmet-async';

interface Props {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
}

export default function SEO({ 
  title = 'SmartClicks.AI - AI-Powered Google Ads Optimization',
  description = 'Transform your Google Ads performance with AI-powered insights and expert validation. Get a comprehensive audit in 7 days.',
  image = 'https://smartclicks.ai/og-image.png',
  url = 'https://smartclicks.ai'
}: Props) {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Additional Meta Tags */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="theme-color" content="#3B82F6" />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href={url} />
    </Helmet>
  );
}