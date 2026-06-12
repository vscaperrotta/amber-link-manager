---
name: Amber / Void v2
description: A focused link-saving tool for personal power users who value speed and findability over everything.
colors:
  # Dark theme
  obsidian-floor: "#111118"
  ink-surface: "#18181F"
  lifted-slate: "#21212E"
  quiet-divide: "#2C2C42"
  # Light theme
  pale-canvas: "#F5F5F7"
  clean-surface: "#FFFFFF"
  soft-elevation: "#EBEBEF"
  light-divide: "#DCDCE8"
  # Accent
  studio-amber: "#F5A623"
  amber-light: "#FFB84D"
  amber-deep: "#B46E14"
  amber-light-mode: "#E8950F"
  # Text — dark
  pure-ink: "#F2F2F6"
  muted-slate: "#B4B4C8"
  faded-stone: "#82829A"
  disabled-ink: "#3A3A52"
  # Text — light
  ink-on-light: "#0F0F12"
  secondary-on-light: "#3C3C58"
  tertiary-on-light: "#48486A"
  # Status
  status-green: "#50D282"
  status-red: "#EE5555"
  status-blue: "#5096F0"
typography:
  display:
    fontFamily: "Outfit, system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.01em"
  headline:
    fontFamily: "Outfit, system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 600
    lineHeight: 1.3
  title:
    fontFamily: "Outfit, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 600
    lineHeight: 1.5
  body:
    fontFamily: "Outfit, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Outfit, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: "0.02em"
  caption:
    fontFamily: "Outfit, system-ui, sans-serif"
    fontSize: "0.6875rem"
    fontWeight: 400
    lineHeight: 1.3
rounded:
  sm: "6px"
  md: "10px"
  lg: "14px"
  full: "9999px"
spacing:
  "2xs": "2px"
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  "2xl": "48px"
components:
  button-primary:
    backgroundColor: "{colors.studio-amber}"
    textColor: "{colors.obsidian-floor}"
    rounded: "{rounded.sm}"
    padding: "0 16px"
    height: "40px"
  tag-pill:
    backgroundColor: "{colors.lifted-slate}"
    textColor: "{colors.muted-slate}"
    rounded: "{rounded.sm}"
    padding: "1px 8px"
---

# Design System: Amber / Void v2

## 1. Overview

**Creative North Star: "The Curator's Studio"**

Void v2 is the visual language of a private workspace — a collector's studio kept deliberately spare. Every surface exists to hold the collection, not to compete with it. The darkness is not aesthetic posturing; it's environmental. Links are the content; the chrome is infrastructure.

The system is built on three materials: near-black depth (the studio walls), cool purple-slate surfaces (the shelves and tables), and a single amber accent (the indicator light, the focus glow, the one thing that tells you something is active or actionable). The amber earns its place by appearing rarely. Its rarity is the point.

**Key Characteristics:**
- Dark-first, with a faithful light mode that preserves all structural intent
- Single accent color used as signal, not decoration
- Rounded corners (6–14px) — precise without being clinical
- Tonal depth via stepped backgrounds, not decorative shadows
- Outfit exclusively — geometric warmth without editorial softness
- Motion is confirming, never entertaining
- WCAG AAA contrast throughout (body ≥7:1, large text ≥4.5:1)
- Generous whitespace — surfaces breathe

## 2. Colors: The Studio Palette

### Accent

- **Studio Amber** (`#F5A623` dark / `#E8950F` light): The only warm color in the system. Used on primary buttons, active nav states, focus rings, count indicators. Never decorative. At most 10% of any screen's visual area.
- **Amber Light** (`#FFB84D`): Hover state for primary amber.
- **Amber Deep** (`#B46E14`): Active/pressed state.

### Neutral — Dark Theme

| Token | Value | Role |
|-------|-------|------|
| `--bg-primary` | `#111118` | Page floor |
| `--bg-surface` | `#18181F` | Cards, panels, sidebar |
| `--bg-elevated` | `#21212E` | Inputs, dropdowns, selected items |
| `--border` | `#2C2C42` | Borders, dividers |
| `--text-primary` | `#F2F2F6` | Headings, body copy |
| `--text-secondary` | `#B4B4C8` | Labels, captions, secondary info |
| `--text-tertiary` | `#82829A` | Timestamps, domains, counts |
| `--text-disabled` | `#3A3A52` | Disabled states |

**Contrast ratios — dark theme (against `--bg-surface` `#18181F`):**
- `--text-primary` `#F2F2F6`: ~15.6:1 ✓ AAA
- `--text-secondary` `#B4B4C8`: ~8.1:1 ✓ AAA
- `--text-tertiary` `#82829A`: ~4.6:1 → passes AA; restricted to supplementary metadata only (timestamps, domain names). See AAA note below.

### Neutral — Light Theme

| Token | Value | Role |
|-------|-------|------|
| `--bg-primary` | `#F5F5F7` | Page floor |
| `--bg-surface` | `#FFFFFF` | Cards, panels |
| `--bg-elevated` | `#EBEBEF` | Inputs, selected items |
| `--border` | `#DCDCE8` | Borders, dividers |
| `--text-primary` | `#0F0F12` | Headings, body copy |
| `--text-secondary` | `#3C3C58` | Labels, captions |
| `--text-tertiary` | `#48486A` | Timestamps, domains, counts |
| `--text-disabled` | `#C0C0D0` | Disabled states |

**Contrast ratios — light theme:**
- `--text-primary` on white: ~19.2:1 ✓ AAA
- `--text-secondary` on white: ~9.7:1 ✓ AAA  
- `--text-secondary` on `--bg-elevated`: ~8.1:1 ✓ AAA
- `--text-tertiary` on white: ~8.7:1 ✓ AAA
- `--text-tertiary` on `--bg-elevated`: ~7.3:1 ✓ AAA

### Status

| Token | Dark | Light |
|-------|------|-------|
| `--status-active` | `#50D282` | `#1E9E58` |
| `--status-error` | `#EE5555` | `#C03030` |
| `--status-info` | `#5096F0` | `#2060C8` |

### Named Rules

**The One Voice Rule.** Studio Amber ≤10% of any screen. If amber is a background, gradient, fill, or decoration — stop.

**The Purple Tint Rule.** Dark backgrounds carry a subtle purple-slate undertone. Never substitute neutral HSL grays — the cool undertone makes amber pop.

**The AAA Contrast Rule.** Body text ≥7:1. Large text (≥18px or bold ≥14px) ≥4.5:1. Placeholder text same as body. `--text-tertiary` in dark mode (~4.6:1) is intentionally below AAA body threshold; restrict to non-critical metadata only.

## 3. Typography

**Display / Body Font:** Outfit (Google Fonts — 400, 600, 700; system-ui fallback)  
**Mono Font:** Geist Mono / JetBrains Mono (URL display, code only)

### Hierarchy

| Role | Weight | Size | Line Height | Use |
|------|--------|------|-------------|-----|
| Display | 700 | 1.5rem / 24px | 1.2 | Section titles, modal headings, counts |
| Headline | 600 | 1.25rem / 20px | 1.3 | Card titles (featured), panel headers |
| Title | 600 | 1rem / 16px | 1.5 | Secondary headings, form labels |
| Body | 400 | 1rem / 16px | 1.5 | Descriptions, prose. Cap at 65ch. |
| Label | 500 | 0.75rem / 12px | 1.2 | Tag pills (uppercase), button text |
| Caption | 400 | 0.6875rem / 11px | 1.3 | Timestamps, domains, counts |

**The Weight Ceiling Rule.** Body is 400. UI labels 500–600. Bold (700) only for display headings and primary button labels.

**The Mono Contract.** Geist Mono only for actual technical strings: URLs in inputs, UUIDs. Never for UI labels.

## 4. Elevation

Tonal layering is the primary vocabulary; shadows are functional and state-driven only.

Three background layers create all structural depth:
1. **Floor** (`--bg-primary`) — the page body
2. **Surface** (`--bg-surface`) — panels, cards, sidebar
3. **Elevated** (`--bg-elevated`) — inputs, dropdowns, hover states

### Shadow Vocabulary

| Token | Value | Use |
|-------|-------|-----|
| `--shadow-focus` | `0 0 0 2px rgba(244,161,53,.60)` | Keyboard focus on interactive elements |
| `--shadow-amber` | `0 0 0 2px rgba(244,161,53,.30)` | Softer focus ring (focused-but-valid inputs) |
| `--shadow-card` | `0 2px 8px rgba(0,0,0,.40)` dark / `.06` light | Card hover lift state |
| `--shadow-sm` | `0 1px 4px rgba(0,0,0,.55)` dark | Floating element separation |
| `--shadow-md` | `0 4px 20px rgba(0,0,0,.60)` dark | Modals, dialogs, menus |
| `--shadow-lg` | `0 8px 36px rgba(0,0,0,.70)` dark | Full-screen overlays |

**The Flat-By-Default Rule.** Every surface is flat at rest. No resting card shadows. A 1px border (`--border`) handles panel separation. Shadows belong to interaction states (focus, hover, open) and overlays.

## 5. Spacing Scale

| Token | Value | Typical use |
|-------|-------|-------------|
| `--space-2xs` | 0.125rem / 2px | Internal micro-gaps |
| `--space-xs` | 0.25rem / 4px | Icon + label gap, tight inline gaps |
| `--space-sm` | 0.5rem / 8px | Between related elements, tag gap |
| `--space-md` | 1rem / 16px | Standard component internal padding |
| `--space-lg` | 1.5rem / 24px | Section gaps, grid gap |
| `--space-xl` | 2rem / 32px | Page padding, content area padding |
| `--space-2xl` | 3rem / 48px | Section-to-section gaps |

## 6. Components

### Buttons

- **Primary:** Studio Amber bg + Obsidian Floor text (`#0F0F12`). **Dark text on amber always.** 700 weight. 40px height.
- **Secondary:** `--bg-elevated` bg + `--text-primary` text + `--border`. For present-but-not-emphasized actions.
- **Ghost:** Transparent + `--text-secondary`. Hover: amber-muted tint + text lifts to primary. Nav and toolbars.
- **Danger:** `--status-error` bg + white text. Destructive confirmations only.
- **Disabled:** All variants at 40% opacity. `cursor: not-allowed`.
- **Focus:** `--shadow-focus` on all variants.

### Tag Pills

Uppercase labels. Compact, filing-label aesthetic.

- Background: `--bg-elevated`. Border: `--border` (1px). Radius: `--radius-sm`.
- Text: `--text-secondary`, 0.75rem, uppercase, 500 weight.
- Tight padding: 1px vertical, 8px horizontal.

### Inputs / Fields

- Background: `--bg-elevated`. Border: `--border`. Height: 40px. Radius: `--radius-sm`.
- Focus: border → `--border-focus` (amber). Ring → `--shadow-amber`.
- Placeholder: `--text-secondary` (≥7:1 against `--bg-elevated`).
- URL variant: Geist Mono at 13px.

### Navigation (Sidebar)

- Default: transparent + `--text-secondary` + 400 weight.
- Hover: `--accent-muted` bg + `--text-primary` + 600 weight.
- Active: `--accent-muted` bg + `--accent` text + 600 weight + count in amber.
- Collapsed state: 70px, icons only.

### Cards / Link Items

Grid cards are the main display unit.

- Background: `--bg-surface`. Border: `--border` (1px). Radius: `--radius-lg`.
- Hover: `--border-focus` border + `--shadow-card` + `translateY(-3px)`. Transition: 180ms cubic-bezier(0.16, 1, 0.3, 1).
- Actions: hidden at rest (`opacity: 0`), revealed on hover/focus (`opacity: 1`).
- **Featured card (first in grid):** `grid-column: span 2`. Title at 1rem (not truncated to 1 line). More internal padding.
- Nested cards: forbidden.

### Grid Layout

```
grid-template-columns: repeat(auto-fill, minmax(240px, 1fr))
gap: var(--space-lg)           // 24px
```

First card spans 2 columns when there are multiple items — creates visual hierarchy without manual data changes.

## 7. Motion

- Default: 150–200ms ease-out. Card hover: 180ms `cubic-bezier(0.16, 1, 0.3, 1)` (expo-out feel).
- Stagger entrance: `animation-delay: nth-child × 30ms` up to 20 items.
- `prefers-reduced-motion: reduce`: all transforms become instant; cross-fades only.

## 8. Do's and Don'ts

### Do:
- Use Studio Amber exclusively for interactive signals.
- Keep Outfit as the sole display font; Geist Mono for technical strings only.
- Use tonal layering (`--bg-primary` → `--bg-surface` → `--bg-elevated`) for all structural depth.
- Keep primary button text in `#0F0F12` on amber — always dark on amber.
- Verify all body copy ≥7:1. Large text ≥4.5:1. Placeholder ≥7:1.
- Use `prefers-reduced-motion` for every transition.
- Keep the purple-slate undertone in dark backgrounds.
- Treat light mode as first-class — all AAA ratios hold in both themes.
- Use `--border` for panel separation. Never a resting shadow.

### Don't:
- Use amber as a background for body text (amber is only a bg for `#0F0F12` primary button text).
- Use `border-left`/`border-right` >1px as a colored stripe accent.
- Use gradient text (`background-clip: text`).
- Add glassmorphism.
- Add shadows to resting surfaces.
- Use gradient fills on buttons.
- Use `--text-tertiary` for body copy or interactive labels — supplementary metadata only.
- Add a second font.
- Animate layout properties (padding, width) — animate transform and opacity.

---

## 9. Cross-Platform Design System (Flutter)

This section maps Void v2 tokens to Flutter's `ThemeData` and `ColorScheme` so both clients share the same visual language.

### 9.1 Color Token → Dart Constant

Define in `lib/core/theme/void_colors.dart`:

```dart
abstract class VoidColors {
  // ── Dark theme ──────────────────────────────────────────
  static const darkFloor       = Color(0xFF111118); // --bg-primary
  static const darkSurface     = Color(0xFF18181F); // --bg-surface
  static const darkElevated    = Color(0xFF21212E); // --bg-elevated
  static const darkBorder      = Color(0xFF2C2C42); // --border

  static const darkTextPrimary   = Color(0xFFF2F2F6); // --text-primary
  static const darkTextSecondary = Color(0xFFB4B4C8); // --text-secondary
  static const darkTextTertiary  = Color(0xFF82829A); // --text-tertiary
  static const darkTextDisabled  = Color(0xFF3A3A52); // --text-disabled

  // ── Light theme ─────────────────────────────────────────
  static const lightFloor      = Color(0xFFF5F5F7); // --bg-primary
  static const lightSurface    = Color(0xFFFFFFFF); // --bg-surface
  static const lightElevated   = Color(0xFFEBEBEF); // --bg-elevated
  static const lightBorder     = Color(0xFFDCDCE8); // --border

  static const lightTextPrimary   = Color(0xFF0F0F12); // --text-primary
  static const lightTextSecondary = Color(0xFF3C3C58); // --text-secondary
  static const lightTextTertiary  = Color(0xFF48486A); // --text-tertiary
  static const lightTextDisabled  = Color(0xFFC0C0D0); // --text-disabled

  // ── Accent ───────────────────────────────────────────────
  static const amberDark  = Color(0xFFF5A623); // --accent (dark mode)
  static const amberLight = Color(0xFFE8950F); // --accent (light mode)
  static const amberBright = Color(0xFFFFB84D); // --accent-light (hover)
  static const amberDeep  = Color(0xFFB46E14); // --accent-dark (pressed)
  static const amberMutedDark  = Color(0x25F5A623); // --accent-muted dark
  static const amberMutedLight = Color(0x1AD48700); // --accent-muted light

  // ── Status ───────────────────────────────────────────────
  static const greenDark  = Color(0xFF50D282);
  static const greenLight = Color(0xFF1E9E58);
  static const redDark    = Color(0xFFEE5555);
  static const redLight   = Color(0xFFC03030);
  static const blueDark   = Color(0xFF5096F0);
  static const blueLight  = Color(0xFF2060C8);
}
```

### 9.2 Flutter ColorScheme Mapping

```dart
// Dark
ColorScheme.dark(
  background:   VoidColors.darkFloor,       // --bg-primary
  surface:      VoidColors.darkSurface,     // --bg-surface
  surfaceVariant: VoidColors.darkElevated,  // --bg-elevated
  outline:      VoidColors.darkBorder,      // --border
  primary:      VoidColors.amberDark,       // --accent
  onPrimary:    Color(0xFF0F0F12),          // dark text on amber
  onBackground: VoidColors.darkTextPrimary, // --text-primary
  onSurface:    VoidColors.darkTextPrimary,
  secondary:    VoidColors.darkTextSecondary,
  onSecondary:  VoidColors.darkFloor,
  error:        VoidColors.redDark,
  onError:      Colors.white,
)

// Light
ColorScheme.light(
  background:   VoidColors.lightFloor,
  surface:      VoidColors.lightSurface,
  surfaceVariant: VoidColors.lightElevated,
  outline:      VoidColors.lightBorder,
  primary:      VoidColors.amberLight,
  onPrimary:    Color(0xFF0F0F12),
  onBackground: VoidColors.lightTextPrimary,
  onSurface:    VoidColors.lightTextPrimary,
  secondary:    VoidColors.lightTextSecondary,
  onSecondary:  VoidColors.lightFloor,
  error:        VoidColors.redLight,
  onError:      Colors.white,
)
```

### 9.3 Typography → Flutter TextTheme

Font: `GoogleFonts.outfit(...)` via `google_fonts` package.

```dart
TextTheme voidTextTheme(Color primary, Color secondary, Color tertiary) =>
  TextTheme(
    // Display (700, 24px)   → displaySmall
    displaySmall: GoogleFonts.outfit(
      fontSize: 24, fontWeight: FontWeight.w700,
      height: 1.2, letterSpacing: -0.24, color: primary,
    ),
    // Headline (600, 20px)  → headlineSmall
    headlineSmall: GoogleFonts.outfit(
      fontSize: 20, fontWeight: FontWeight.w600,
      height: 1.3, color: primary,
    ),
    // Title (600, 16px)     → titleMedium
    titleMedium: GoogleFonts.outfit(
      fontSize: 16, fontWeight: FontWeight.w600,
      height: 1.5, color: primary,
    ),
    // Body (400, 16px)      → bodyMedium
    bodyMedium: GoogleFonts.outfit(
      fontSize: 16, fontWeight: FontWeight.w400,
      height: 1.5, color: primary,
    ),
    // Label (500, 12px)     → labelSmall
    labelSmall: GoogleFonts.outfit(
      fontSize: 12, fontWeight: FontWeight.w500,
      height: 1.2, letterSpacing: 0.24, color: secondary,
    ),
    // Caption (400, 11px)   → bodySmall
    bodySmall: GoogleFonts.outfit(
      fontSize: 11, fontWeight: FontWeight.w400,
      height: 1.3, color: tertiary,
    ),
  );
```

### 9.4 Spacing → Flutter Constants

```dart
abstract class VoidSpacing {
  static const s2xs = 2.0;  // --space-2xs
  static const sXs  = 4.0;  // --space-xs
  static const sSm  = 8.0;  // --space-sm
  static const sMd  = 16.0; // --space-md
  static const sLg  = 24.0; // --space-lg
  static const sXl  = 32.0; // --space-xl
  static const s2xl = 48.0; // --space-2xl
}
```

### 9.5 Border Radius → Flutter Constants

```dart
abstract class VoidRadius {
  static const sm   = Radius.circular(6);   // --radius-sm
  static const md   = Radius.circular(10);  // --radius-md
  static const lg   = Radius.circular(14);  // --radius-lg
  static const full = Radius.circular(9999);

  static final smBorder   = BorderRadius.circular(6);
  static final mdBorder   = BorderRadius.circular(10);
  static final lgBorder   = BorderRadius.circular(14);
}
```

### 9.6 Flutter Component Specs

**Primary Button:**
```dart
ElevatedButton(
  style: ElevatedButton.styleFrom(
    backgroundColor: VoidColors.amberDark,    // or amberLight in light
    foregroundColor: Color(0xFF0F0F12),        // always dark on amber
    textStyle: GoogleFonts.outfit(fontSize: 14, fontWeight: FontWeight.w700),
    minimumSize: Size(double.infinity, 40),
    shape: RoundedRectangleBorder(borderRadius: VoidRadius.smBorder),
    elevation: 0,
  ),
)
```

**Tag Pill:**
```dart
Container(
  decoration: BoxDecoration(
    color: VoidColors.darkElevated,
    border: Border.all(color: VoidColors.darkBorder),
    borderRadius: VoidRadius.smBorder,
  ),
  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 1),
  child: Text(
    tag.toUpperCase(),
    style: GoogleFonts.outfit(
      fontSize: 11, fontWeight: FontWeight.w500,
      color: VoidColors.darkTextSecondary,
      letterSpacing: 0.22,
    ),
  ),
)
```

**Link Card:**
```dart
Card(
  elevation: 0,
  color: VoidColors.darkSurface,
  shape: RoundedRectangleBorder(
    borderRadius: VoidRadius.lgBorder,
    side: BorderSide(color: VoidColors.darkBorder),
  ),
  child: InkWell(
    borderRadius: VoidRadius.lgBorder,
    onTap: ...,
    child: Padding(
      padding: const EdgeInsets.all(VoidSpacing.sMd),
      child: ...,
    ),
  ),
)
```

**FAB (save action):**
```dart
FloatingActionButton(
  backgroundColor: VoidColors.amberDark,
  foregroundColor: Color(0xFF0F0F12),
  elevation: 4,
  // Glow shadow to match: rgba(245,166,35,0.5) 0 4px 16px
  // Use BoxDecoration on a wrapper if custom shadow needed
)
```

### 9.7 Flutter ThemeData Assembly

```dart
ThemeData voidThemeDark() => ThemeData(
  brightness: Brightness.dark,
  colorScheme: ColorScheme.dark(/* see 9.2 */),
  textTheme: voidTextTheme(
    VoidColors.darkTextPrimary,
    VoidColors.darkTextSecondary,
    VoidColors.darkTextTertiary,
  ),
  scaffoldBackgroundColor: VoidColors.darkFloor,
  cardColor: VoidColors.darkSurface,
  dividerColor: VoidColors.darkBorder,
  fontFamily: GoogleFonts.outfit().fontFamily,
  useMaterial3: true,
);

ThemeData voidThemeLight() => ThemeData(
  brightness: Brightness.light,
  colorScheme: ColorScheme.light(/* see 9.2 */),
  textTheme: voidTextTheme(
    VoidColors.lightTextPrimary,
    VoidColors.lightTextSecondary,
    VoidColors.lightTextTertiary,
  ),
  scaffoldBackgroundColor: VoidColors.lightFloor,
  cardColor: VoidColors.lightSurface,
  dividerColor: VoidColors.lightBorder,
  fontFamily: GoogleFonts.outfit().fontFamily,
  useMaterial3: true,
);
```

---

## 10. Contrast Audit Summary

| Context | Token | Background | Ratio | WCAG |
|---------|-------|------------|-------|------|
| Dark | `--text-primary` `#F2F2F6` | `--bg-surface` `#18181F` | 15.6:1 | ✓ AAA |
| Dark | `--text-secondary` `#B4B4C8` | `--bg-surface` | 8.1:1 | ✓ AAA |
| Dark | `--text-secondary` `#B4B4C8` | `--bg-elevated` | 7.3:1 | ✓ AAA |
| Dark | `--text-tertiary` `#82829A` | `--bg-surface` | ~4.6:1 | ✓ AA — metadata only |
| Dark | `--accent` `#F5A623` | `--bg-primary` | ~11:1 | ✓ AAA |
| Light | `--text-primary` `#0F0F12` | `--bg-surface` `#FFF` | 19.2:1 | ✓ AAA |
| Light | `--text-secondary` `#3C3C58` | `--bg-surface` | 9.7:1 | ✓ AAA |
| Light | `--text-secondary` `#3C3C58` | `--bg-elevated` | 8.1:1 | ✓ AAA |
| Light | `--text-tertiary` `#48486A` | `--bg-surface` | 8.7:1 | ✓ AAA |
| Light | `--text-tertiary` `#48486A` | `--bg-elevated` | 7.3:1 | ✓ AAA |
| Both | Primary btn: `#0F0F12` | `--accent` | >10:1 | ✓ AAA |
