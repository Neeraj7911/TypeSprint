import React from "react";
import { Helmet } from "react-helmet-async";

const SEO = ({
  title,
  description,
  keywords,
  image,
  url,
  type = "website",
  article,
  faqs,
  howTo,
  breadcrumbs,
  speakable,
  noindex = false,
}) => {
  // Default values
  const siteUrl = "https://typesprint.live";
  const defaultImage = `${siteUrl}/og-banner.jpg`;
  const defaultTitle =
    "TypeSprint: Free Online Typing Tests for Government Exams | SSC CGL, CSIR, UPPSC";
  const defaultDescription =
    "Master typing tests for SSC CGL, CSIR JSA, UPPSC RO/ARO, DGAFMS with AI-powered practice. Achieve 35+ WPM accuracy with real exam simulations. Hindi & English support. Free certificates.";

  // Use provided values or defaults
  const pageTitle = title || defaultTitle;
  const pageDescription = description || defaultDescription;
  const pageImage = image || defaultImage;
  const pageUrl = url ? `${siteUrl}${url}` : siteUrl;
  const pageKeywords =
    keywords ||
    "typing test online free, government exam typing practice, SSC CGL typing test, CSIR JSA typing speed, Hindi typing test, English typing speed test, competitive exam preparation, typing certificate online, WPM improvement, accuracy typing test, government job typing practice";

  // Generate structured data
  const generateStructuredData = () => {
    const structuredData = [];

    // Organization Schema
    structuredData.push({
      "@context": "https://schema.org",
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: "TypeSprint",
      alternateName: "Type Sprint",
      url: siteUrl,
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/logo.png`,
        width: 512,
        height: 512,
      },
      description:
        "Leading online typing test platform specializing in government exam preparation including SSC CGL, CSIR JSA, UPPSC RO/ARO, and DGAFMS typing tests.",
      foundingDate: "2024",
      founders: [
        {
          "@type": "Person",
          name: "TypeSprint Team",
        },
      ],
      contactPoint: {
        "@type": "ContactPoint",
        telephone: "+91-XXXXXXXXXX",
        contactType: "customer service",
        availableLanguage: ["English", "Hindi"],
      },
      sameAs: [
        "https://www.youtube.com/@typesprint",
        "https://www.linkedin.com/company/typesprint",
        "https://x.com/typesprint",
        "https://www.instagram.com/typesprint",
      ],
      areaServed: {
        "@type": "Country",
        name: "India",
      },
      knowsAbout: [
        "Typing Tests",
        "Government Exams",
        "SSC CGL",
        "CSIR JSA",
        "Competitive Exam Preparation",
        "Typing Speed Training",
      ],
    });

    // WebSite Schema
    structuredData.push({
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: "TypeSprint",
      description:
        "Free online typing test platform for government exam preparation",
      publisher: {
        "@id": `${siteUrl}/#organization`,
      },
      potentialAction: [
        {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${siteUrl}/search?q={search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        },
      ],
      inLanguage: ["en", "hi"],
    });

    // Article Schema (if article props provided)
    if (article) {
      structuredData.push({
        "@context": "https://schema.org",
        "@type": "Article",
        headline: article.headline || pageTitle,
        description: article.description || pageDescription,
        author: {
          "@type": "Organization",
          name: "TypeSprint Team",
          url: `${siteUrl}/about`,
        },
        publisher: {
          "@id": `${siteUrl}/#organization`,
        },
        datePublished: article.datePublished || "2024-12-01",
        dateModified:
          article.dateModified || new Date().toISOString().split("T")[0],
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": pageUrl,
        },
        image: pageImage,
        keywords: pageKeywords,
      });
    }

    // FAQ Schema
    if (faqs && faqs.length > 0) {
      structuredData.push({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqs.map(({ question, answer }) => ({
          "@type": "Question",
          name: question,
          acceptedAnswer: {
            "@type": "Answer",
            text: answer,
          },
        })),
      });
    }

    // HowTo Schema
    if (howTo) {
      structuredData.push({
        "@context": "https://schema.org",
        "@type": "HowTo",
        name: howTo.name || "How to Prepare for Government Exam Typing Tests",
        description:
          howTo.description ||
          "Step-by-step guide to master typing tests for SSC CGL, CSIR, and other government exams",
        totalTime: howTo.totalTime || "P30D",
        supply: howTo.supply || [
          {
            "@type": "HowToSupply",
            name: "Computer or Laptop",
          },
          {
            "@type": "HowToSupply",
            name: "Internet Connection",
          },
        ],
        step: howTo.steps || [
          {
            "@type": "HowToStep",
            name: "Learn Proper Finger Placement",
            text: "Master the QWERTY keyboard layout with correct finger positioning on home row keys.",
            position: 1,
          },
          {
            "@type": "HowToStep",
            name: "Practice Daily",
            text: "Spend 15-30 minutes daily practicing with TypeSprint's adaptive exercises.",
            position: 2,
          },
          {
            "@type": "HowToStep",
            name: "Focus on Accuracy",
            text: "Aim for 95%+ accuracy before increasing speed to build good habits.",
            position: 3,
          },
          {
            "@type": "HowToStep",
            name: "Take Mock Tests",
            text: "Simulate real exam conditions with timed 15-minute typing tests.",
            position: 4,
          },
        ],
      });
    }

    // Breadcrumb Schema
    if (breadcrumbs && breadcrumbs.length > 0) {
      structuredData.push({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: breadcrumbs.map((crumb, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: crumb.name,
          item: crumb.url ? `${siteUrl}${crumb.url}` : siteUrl,
        })),
      });
    }

    // Speakable Schema for Voice Search
    if (speakable) {
      structuredData.push({
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: pageTitle,
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: speakable,
        },
      });
    }

    return structuredData;
  };

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />
      <meta name="keywords" content={pageKeywords} />
      <meta name="author" content="TypeSprint Team" />
      <meta name="publisher" content="TypeSprint" />

      {/* Robots Meta */}
      {noindex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta
          name="robots"
          content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
        />
      )}

      {/* Canonical URL */}
      <link rel="canonical" href={pageUrl} />

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="TypeSprint" />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:url" content={pageUrl} />
      <meta property="og:image" content={pageImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:type" content="image/jpeg" />
      <meta property="og:image:alt" content={pageTitle} />
      <meta property="og:locale" content="en_US" />

      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@typesprint" />
      <meta name="twitter:creator" content="@typesprint" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDescription} />
      <meta name="twitter:image" content={pageImage} />
      <meta name="twitter:image:alt" content={pageTitle} />

      {/* Article Specific Meta (if article) */}
      {article && (
        <>
          <meta property="article:author" content="TypeSprint Team" />
          <meta
            property="article:publisher"
            content="https://www.facebook.com/typesprint"
          />
          {article.datePublished && (
            <meta
              property="article:published_time"
              content={article.datePublished}
            />
          )}
          {article.dateModified && (
            <meta
              property="article:modified_time"
              content={article.dateModified}
            />
          )}
          <meta property="article:section" content="Education" />
          <meta property="article:tag" content="Typing Tests" />
          <meta property="article:tag" content="Government Exams" />
        </>
      )}

      {/* Structured Data */}
      {generateStructuredData().map((data, index) => (
        <script key={index} type="application/ld+json">
          {JSON.stringify(data)}
        </script>
      ))}

      {/* Additional Performance and SEO Meta */}
      <meta name="theme-color" content="#0f172a" />
      <meta name="msapplication-TileColor" content="#0f172a" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta
        name="apple-mobile-web-app-status-bar-style"
        content="black-translucent"
      />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="format-detection" content="telephone=no" />

      {/* Security Headers */}
      <meta http-equiv="X-Content-Type-Options" content="nosniff" />
      <meta http-equiv="X-Frame-Options" content="DENY" />
      <meta http-equiv="X-XSS-Protection" content="1; mode=block" />
      <meta
        http-equiv="Referrer-Policy"
        content="strict-origin-when-cross-origin"
      />

      {/* Preload Critical Resources */}
      <link rel="preload" href="/src/main.jsx" as="script" crossorigin />
      <link rel="preload" href="/src/index.css" as="style" />

      {/* DNS Prefetch */}
      <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      <link rel="dns-prefetch" href="//www.google-analytics.com" />
      <link rel="dns-prefetch" href="//www.googletagmanager.com" />
    </Helmet>
  );
};

export default SEO;
