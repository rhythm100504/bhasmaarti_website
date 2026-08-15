/**
 * Centralized Design System Tokens for BhasmaArti.com
 * Update these variables to easily change the theme, colors, and typography across the entire site.
 */

export const AppColors = {
  // Brand Backgrounds
  bgPrimary: "#0A0A0A",
  bgSecondary: "#141414",

  // Brand Accent Colors (Saffron & Gold)
  accentSaffron: "#E66A00",
  accentGold: "#D4A017",

  // Typography Text Colors
  textPrimary: "#F4F1EA",
  textSecondary: "#B3B3B3",

  // Glassmorphic Overlays & Borders
  glassBg: "rgba(255, 255, 255, 0.05)",
  glassBorder: "rgba(212, 160, 23, 0.2)",
  saffronGlow: "rgba(230, 106, 0, 0.15)",
};

// Alias matching your spelling
export const AppColour = AppColors;

export const AppTypography = {
  // Font Families (Next.js CSS variable links + Fallbacks)
  fontHeading: "var(--font-cinzel)",
  fontFallbackHeading: "'Playfair Display', serif",

  fontBody: "var(--font-inter)",
  fontFallbackBody: "'Poppins', sans-serif",
};

export const AppTheme = {
  // Animations
  transitionNormal: "0.3s ease",
  transitionFast: "0.2s ease",

  // Borders
  borderRadius: {
    small: "4px",
    medium: "8px",
    large: "12px",
    round: "50%",
    pill: "2rem",
  },
};
