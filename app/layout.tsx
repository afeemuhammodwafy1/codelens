import type { Metadata } from "next";
import "./globals.css";

const siteUrl = "https://wafy-codelens.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "WafyCodeLens | GitHub Repository Analyzer",
    template: "%s | WafyCodeLens",
  },
  description:
    "Analyze public GitHub repositories in seconds. Explore code quality, security signals, documentation, testing structure, maintainability, languages, and repository health with WafyCodeLens.",
  keywords: [
    "GitHub repository analyzer",
    "GitHub code analyzer",
    "repository analysis tool",
    "code quality analyzer",
    "GitHub security scanner",
    "GitHub project analyzer",
    "developer tools",
    "software engineering",
    "WafyCodeLens",
  ],
  authors: [{ name: "Afee Muhammod Wafy", url: "https://amwafy.xyz" }],
  creator: "Afee Muhammod Wafy",
  publisher: "Afee Muhammod Wafy",
  applicationName: "WafyCodeLens",
  category: "Developer Tools",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "WafyCodeLens",
    title: "WafyCodeLens | GitHub Repository Analyzer",
    description:
      "Understand public GitHub repositories faster with code-quality checks, security signals, documentation analysis, testing insights, and maintainability scoring.",
    locale: "en_US",
  },
  twitter: {
    card: "summary",
    title: "WafyCodeLens | GitHub Repository Analyzer",
    description:
      "Analyze public GitHub repositories for code quality, security signals, documentation, testing, and maintainability.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: { icon: "/favicon.svg" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "WafyCodeLens",
      url: siteUrl,
      applicationCategory: "DeveloperApplication",
      operatingSystem: "Web",
      description:
        "A GitHub repository analyzer for exploring code quality, security signals, documentation, testing structure, and maintainability.",
      creator: {
        "@type": "Person",
        name: "Afee Muhammod Wafy",
        url: "https://amwafy.xyz",
      },
      featureList: [
        "GitHub repository analysis",
        "Code quality heuristics",
        "Basic security checks",
        "Documentation analysis",
        "Testing structure analysis",
        "Maintainability scoring",
        "Language breakdown",
        "Repository statistics",
      ],
    },
    {
      "@type": "Person",
      name: "Afee Muhammod Wafy",
      url: "https://amwafy.xyz",
      jobTitle: "Software Developer",
      description:
        "Creator of WafyCodeLens and other web applications, developer tools, security experiments, and API-based projects.",
      sameAs: ["https://github.com/amwafy", "https://amwafy.xyz"],
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
