import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  type?: 'website' | 'article' | 'place' | 'product';
  canonicalUrl?: string;
  jsonLd?: Record<string, any> | Array<Record<string, any>>;
}

const DEFAULT_TITLE = 'MovePlanner — The Ultimate All-in-One Travel Planning Platform';
const DEFAULT_DESCRIPTION = 'The ultimate all-in-one travel planning platform. Plan smarter, explore more, and travel better with destination guides, hotels, food, attractions, interactive maps, and smart itineraries.';
const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&h=630&q=85';
const DEFAULT_KEYWORDS = 'travel planner, itinerary builder, trip planner, travel guides, destination discovery, hotel booking, budget planner, packing list, MovePlanner';

export const SEOHead: React.FC<SEOHeadProps> = ({
  title,
  description = DEFAULT_DESCRIPTION,
  keywords = DEFAULT_KEYWORDS,
  image = DEFAULT_IMAGE,
  type = 'website',
  canonicalUrl,
  jsonLd
}) => {
  const location = useLocation();

  useEffect(() => {
    // 1. Page Title
    const formattedTitle = title
      ? `${title} | MovePlanner`
      : DEFAULT_TITLE;
    document.title = formattedTitle;

    // 2. Helper to set or create meta tag
    const setMetaTag = (attributeName: string, attributeValue: string, content: string) => {
      let meta = document.querySelector(`meta[${attributeName}="${attributeValue}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(attributeName, attributeValue);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    // 3. Helper to set or create link tag
    const setLinkTag = (rel: string, href: string) => {
      let link = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
      if (!link) {
        link = document.createElement('link');
        link.setAttribute('rel', rel);
        document.head.appendChild(link);
      }
      link.setAttribute('href', href);
    };

    // Current page URL
    const currentUrl = canonicalUrl || `${window.location.origin}${location.pathname}`;

    // Standard Meta
    setMetaTag('name', 'description', description);
    setMetaTag('name', 'keywords', keywords);
    setMetaTag('name', 'robots', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
    setLinkTag('canonical', currentUrl);

    // OpenGraph
    setMetaTag('property', 'og:title', formattedTitle);
    setMetaTag('property', 'og:description', description);
    setMetaTag('property', 'og:image', image);
    setMetaTag('property', 'og:url', currentUrl);
    setMetaTag('property', 'og:type', type);
    setMetaTag('property', 'og:site_name', 'MovePlanner');

    // Twitter Card
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', formattedTitle);
    setMetaTag('name', 'twitter:description', description);
    setMetaTag('name', 'twitter:image', image);

    // Dynamic Schema.org JSON-LD
    let scriptTag = document.getElementById('dynamic-seo-jsonld') as HTMLScriptElement | null;
    if (jsonLd) {
      if (!scriptTag) {
        scriptTag = document.createElement('script');
        scriptTag.id = 'dynamic-seo-jsonld';
        scriptTag.type = 'application/ld+json';
        document.head.appendChild(scriptTag);
      }
      scriptTag.textContent = JSON.stringify(
        Array.isArray(jsonLd)
          ? { '@context': 'https://schema.org', '@graph': jsonLd }
          : { '@context': 'https://schema.org', ...jsonLd }
      );
    } else if (scriptTag) {
      scriptTag.remove();
    }

    return () => {
      // Clean up dynamic script on unmount
      const existingScript = document.getElementById('dynamic-seo-jsonld');
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, [title, description, keywords, image, type, canonicalUrl, jsonLd, location.pathname]);

  return null;
};
