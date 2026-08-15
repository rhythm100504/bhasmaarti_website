import type { Metadata } from "next";
import { Cinzel, Inter } from "next/font/google";
import { AppColors, AppTypography, AppTheme } from "@/theme/design-tokens";
import "./globals.css";

const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-cinzel",
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  title: "BhasmaArti.com — Experience the Divine Presence of Mahakal, Anytime. Anywhere.",
  description: "The premier digital devotional platform dedicated to Shri Mahakaleshwar Jyotirlinga, Ujjain. Access Bhasma Aarti archives, devotional content, festival coverage, and temple information.",
  keywords: [
    "Bhasma Aarti Online",
    "Mahakal Aarti",
    "Mahakaleshwar Temple",
    "Mahakal Darshan",
    "Mahakal Ujjain",
    "Bhasma Aarti Video",
    "Mahakaleshwar Jyotirlinga",
    "Ujjain Temple",
    "Shiv Temple Ujjain"
  ],
  openGraph: {
    title: "BhasmaArti.com — Experience the Divine Presence of Mahakal",
    description: "Bhasma Aarti archives, devotional content & temple information for Shri Mahakaleshwar Jyotirlinga",
    type: "website",
    url: "https://bhasmarti.com",
  },
  twitter: {
    card: "summary_large_image",
    title: "BhasmaArti.com — Experience the Divine Presence of Mahakal",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cssVariables = `
    :root {
      --bg-primary: ${AppColors.bgPrimary};
      --bg-secondary: ${AppColors.bgSecondary};
      --accent-saffron: ${AppColors.accentSaffron};
      --accent-gold: ${AppColors.accentGold};
      --text-primary: ${AppColors.textPrimary};
      --text-secondary: ${AppColors.textSecondary};
      --glass-bg: ${AppColors.glassBg};
      --glass-border: ${AppColors.glassBorder};
      --saffron-glow: ${AppColors.saffronGlow};

      --font-heading: ${AppTypography.fontHeading}, ${AppTypography.fontFallbackHeading};
      --font-body: ${AppTypography.fontBody}, ${AppTypography.fontFallbackBody};

      --transition-normal: ${AppTheme.transitionNormal};
      --transition-fast: ${AppTheme.transitionFast};

      --radius-sm: ${AppTheme.borderRadius.small};
      --radius-md: ${AppTheme.borderRadius.medium};
      --radius-lg: ${AppTheme.borderRadius.large};
      --radius-round: ${AppTheme.borderRadius.round};
      --radius-pill: ${AppTheme.borderRadius.pill};
    }
  `;

  return (
    <html lang="en" className={`${cinzel.variable} ${inter.variable}`}>
      <head>
        <style dangerouslySetInnerHTML={{ __html: cssVariables }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
