/**
 * Presentation Themes & Color Palettes
 * Hex colors are specified without leading '#' for pptxgenjs compatibility where needed.
 */

const THEMES = {
  modern_dark: {
    id: "modern_dark",
    name: "Modern Dark",
    description: "Sleek deep navy background with cyan accents and high contrast text",
    bg: "0F172A",
    cardBg: "1E293B",
    primary: "38BDF8",
    secondary: "818CF8",
    accent: "06B6D4",
    textPrimary: "F8FAFC",
    textSecondary: "94A3B8",
    fontHeader: "Helvetica",
    fontBody: "Arial",
    cardBorder: "334155"
  },
  vibrant_neon: {
    id: "vibrant_neon",
    name: "Vibrant Neon",
    description: "Dynamic violet background with electric purple and pink highlights",
    bg: "180033",
    cardBg: "2D0D54",
    primary: "A855F7",
    secondary: "EC4899",
    accent: "F43F5E",
    textPrimary: "FFFFFF",
    textSecondary: "C084FC",
    fontHeader: "Trebuchet MS",
    fontBody: "Calibri",
    cardBorder: "4C1D95"
  },
  executive_navy: {
    id: "executive_navy",
    name: "Executive Navy",
    description: "Corporate dark slate with warm amber gold accent points",
    bg: "0F172A",
    cardBg: "1E293B",
    primary: "F59E0B",
    secondary: "3B82F6",
    accent: "10B981",
    textPrimary: "FFFFFF",
    textSecondary: "CBD5E1",
    fontHeader: "Georgia",
    fontBody: "Calibri",
    cardBorder: "334155"
  },
  minimal_clean: {
    id: "minimal_clean",
    name: "Minimalist Clean",
    description: "Crisp light background with charcoal typography and indigo accents",
    bg: "F8FAFC",
    cardBg: "FFFFFF",
    primary: "4F46E5",
    secondary: "0EA5E9",
    accent: "6366F1",
    textPrimary: "0F172A",
    textSecondary: "475569",
    fontHeader: "Helvetica",
    fontBody: "Arial",
    cardBorder: "E2E8F0"
  },
  emerald_bio: {
    id: "emerald_bio",
    name: "Emerald Bio",
    description: "Deep forest emerald backdrop with mint green energy accents",
    bg: "064E3B",
    cardBg: "065F46",
    primary: "34D399",
    secondary: "A7F3D0",
    accent: "10B981",
    textPrimary: "F0FDF4",
    textSecondary: "6EE7B7",
    fontHeader: "Trebuchet MS",
    fontBody: "Calibri",
    cardBorder: "047857"
  }
};

function getTheme(themeId) {
  return THEMES[themeId] || THEMES.modern_dark;
}

module.exports = {
  THEMES,
  getTheme
};
