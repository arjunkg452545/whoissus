---
name: Cyber-Brutalist Party Core
colors:
  surface: '#121317'
  surface-dim: '#121317'
  surface-bright: '#38393e'
  surface-container-lowest: '#0d0e12'
  surface-container-low: '#1a1b20'
  surface-container: '#1f1f24'
  surface-container-high: '#292a2e'
  surface-container-highest: '#343439'
  on-surface: '#e3e2e8'
  on-surface-variant: '#c4c9ac'
  inverse-surface: '#e3e2e8'
  inverse-on-surface: '#2f3035'
  outline: '#8e9379'
  outline-variant: '#444933'
  surface-tint: '#abd600'
  primary: '#ffffff'
  on-primary: '#283500'
  primary-container: '#c3f400'
  on-primary-container: '#556d00'
  inverse-primary: '#506600'
  secondary: '#ffb1c4'
  on-secondary: '#65002e'
  secondary-container: '#ff4a8d'
  on-secondary-container: '#590028'
  tertiary: '#ffffff'
  on-tertiary: '#003640'
  tertiary-container: '#acedff'
  on-tertiary-container: '#006e81'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#c3f400'
  primary-fixed-dim: '#abd600'
  on-primary-fixed: '#161e00'
  on-primary-fixed-variant: '#3c4d00'
  secondary-fixed: '#ffd9e1'
  secondary-fixed-dim: '#ffb1c4'
  on-secondary-fixed: '#3f001a'
  on-secondary-fixed-variant: '#8f0044'
  tertiary-fixed: '#acedff'
  tertiary-fixed-dim: '#4cd7f6'
  on-tertiary-fixed: '#001f26'
  on-tertiary-fixed-variant: '#004e5c'
  background: '#121317'
  on-background: '#e3e2e8'
  surface-variant: '#343439'
typography:
  display-hero:
    fontFamily: syne
    fontSize: 56px
    fontWeight: '800'
    lineHeight: 60px
    letterSpacing: -0.03em
  display-hero-mobile:
    fontFamily: syne
    fontSize: 40px
    fontWeight: '800'
    lineHeight: 44px
    letterSpacing: -0.03em
  headline-lg:
    fontFamily: syne
    fontSize: 36px
    fontWeight: '800'
    lineHeight: 42px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: syne
    fontSize: 28px
    fontWeight: '800'
    lineHeight: 34px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: syne
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 30px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: syne
    fontSize: 20px
    fontWeight: '700'
    lineHeight: 26px
    letterSpacing: 0em
  body-lg:
    fontFamily: plusJakartaSans
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 26px
    letterSpacing: -0.01em
  body-md:
    fontFamily: plusJakartaSans
    fontSize: 15px
    fontWeight: '500'
    lineHeight: 22px
    letterSpacing: 0em
  body-sm:
    fontFamily: plusJakartaSans
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 18px
    letterSpacing: 0.01em
  label-lg:
    fontFamily: syne
    fontSize: 14px
    fontWeight: '800'
    lineHeight: 18px
    letterSpacing: 0.04em
  label-md:
    fontFamily: syne
    fontSize: 12px
    fontWeight: '800'
    lineHeight: 16px
    letterSpacing: 0.06em
  label-pill:
    fontFamily: syne
    fontSize: 11px
    fontWeight: '800'
    lineHeight: 14px
    letterSpacing: 0.08em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  space-xxs: 0.25rem
  space-xs: 0.5rem
  space-sm: 0.75rem
  space-md: 1rem
  space-lg: 1.25rem
  space-xl: 1.5rem
  space-2xl: 2rem
  space-3xl: 2.5rem
  space-4xl: 3.5rem
  gutter-mobile: 1rem
  margin-mobile: 1rem
  gutter-desktop: 1.5rem
  margin-desktop: 2rem
---

## Brand & Style

This design system blends **Neo-Brutalism** with a high-voltage **Cyber-Y2K** club energy, engineered specifically for high-speed social deduction and party games on mobile screens. Built for Gen Z and Gen Alpha users, the aesthetic discards subtle skeuomorphism and timid neutrals in favor of raw structural silhouettes, sticker-bomb layouts, physical tactile feedback, and sensory saturation.

### Key Tenets
- **Defiant Contrast:** Pure structural boundaries, chunky 3px–4px deep ink outlines, and zero-blur hard offset shadows replicate printed sticker sheets and arcade machine interfaces.
- **Electric Hysteria:** Shocking acid hues disrupt deep backgrounds to command attention instantly during fast-paced party rounds, voting frenzies, and rapid-fire accusation phases.
- **Physical & Snappy:** Every surface looks click-able and punchy. Interactions compress surfaces flat against their drop shadows to evoke arcade tactile switches and collectable vinyl badges.

## Colors

The system uses a darkened stage dominated by Deep Ink to let neon signifiers explode visually. The dark palette prevents eye strain during late-night party play while preserving razor-sharp border definition.

### Palette Architecture
- **Primary Accent (`#CCFF00` - Acid Lime Green):** The core active accent. Used for primary calls to action, timer alerts, winner callouts, and "Not Sus" confirmations.
- **Secondary Accent (`#FF007F` - Electric Cyber Magenta):** High-tension alert hue. Applied to voting states, countdown warnings, traitor reveals, and high-impact accusations.
- **Tertiary Accent (`#06B6D4` - Bubblegum Cyan):** Supporting cyber pop. Used for player tags, live lobby counters, auxiliary toggles, and chat bubbles.
- **Warning / Chaos Accent (`#FF5722` - Bright Safety Orange):** Sudden-death events, urgent prompts, voting deadlocks, and critical alerts.
- **Neutral Base (`#0B0C10` - Deep Ink):** Serves as canvas dark tone, chunky outlines, structural dividers, and hard drop-shadows.
- **Surface Tone (`#171923` - Dark Slate):** Secondary container backgrounds to lift interactive cards off the pure ink canvas.
- **Text & High-Contrast Light (`#F4F4F9` - Electric Off-White):** High-legibility text, primary inverse button fills, and sticker borders.

## Typography

The typography strategy builds on deliberate visual tension: **Syne** delivers chunky, hyper-expressive, slightly rebellious character for all display surfaces and voting titles, while **Plus Jakarta Sans** ensures immediate readability for rapid chat messages, player clues, and game rules.

- Use **All-Caps** for `label-lg`, `label-md`, and `label-pill` tokens to reinforce arcade poster semantics.
- Display tokens (`display-hero`, `headline-lg`) feature tight negative tracking (`-0.02em` to `-0.03em`) to lock character glyphs into unified visual bricks.
- Body text remains grounded, legible, and unstylized to guarantee zero friction under fast game timers.

## Layout & Spacing

The layout is built for fluid mobile-first thumb interaction, constraining single-screen game stages to full vertical viewports (`100dvh`) without vertical scrolling wherever possible.

- **Grid Framework:** Fluid 4-column layout on mobile, transitioning to an 8-column layout on tablets and centered 12-column max-width wrapper (`480px` for mobile app simulations, `840px` for full desktop lobby views).
- **Rhythm & Padding:** All interactive click-targets sit on an 8px modular baseline, maintaining a minimum touch target size of `48px x 48px`.
- **Card Clustering:** Use tight internal padding (`space-md`) paired with generous outer stage margins (`space-xl`) to establish self-contained mini-stages for each player tile or voting booth.

## Elevation & Depth

This system discards Gaussian blurs, soft drop shadows, and delicate gradients. Depth is mechanical, physical, and graphic.

### Hard-Offset Shadow Scale
1. **Flat (Level 0):** `box-shadow: none;` — Canvas floor and recessed input fields.
2. **Standard Badge / Chip (Level 1):** `box-shadow: 2px 2px 0px #0B0C10;` — Interactive pills, tags, voting buttons.
3. **Card / Primary Tile (Level 2):** `box-shadow: 4px 4px 0px #0B0C10;` — Active player tiles, popups, message bubbles.
4. **Floating Modal / Hero Banner (Level 3):** `box-shadow: 6px 6px 0px #0B0C10;` — Suspect reveal modal, victory overlays, bottom sheets.

### Active & Pressed States
All interactive surfaces shift `transform: translate(2px, 2px)` on hover and `transform: translate(4px, 4px)` with `box-shadow: 0px 0px 0px #0B0C10` on active/tap down. This instant snap provides a tactile mechanical switch feel.

## Shapes

The geometric signature balances solid, slightly rounded structural boxes with hyper-rounded, elliptical sticker pills.

- **Cards & Modules:** Utilize `rounded-lg` (`1rem` / `16px`) to soften Neo-Brutalist corners and maintain a friendly, casual gaming atmosphere.
- **Pills & Status Badges:** Fully circular (`rounded-full` / `9999px`) to create high-contrast juxtaposition against rectangular player containers.
- **Border Architecture:** Chunky `3px` solid `#0B0C10` for standard UI elements (inputs, badges, chips) scaling up to `4px` solid `#0B0C10` for major cards, modals, and primary action buttons.
- **Sticker Rotations:** Secondary player avatars and status badges can incorporate slight mechanical tilt classes (`-2deg` to `+3deg`) to reinforce the playful Y2K sticker aesthetic.

## Components

### Buttons
- **Primary Action (Vibrant Punch):** Filled with Acid Lime Green (`#CCFF00`), text in Deep Ink (`#0B0C10`), 3px black border, 4px hard shadow (`4px 4px 0px #0B0C10`). Uppercase Syne 800.
- **Destructive / Accuse Button:** Filled with Electric Cyber Magenta (`#FF007F`), text in Electric Off-White (`#F4F4F9`), 3px black border, 4px hard shadow.
- **Secondary Ghost:** Filled with `#171923`, text in `#F4F4F9`, 3px border in `#CCFF00`, 3px offset shadow in `#CCFF00`.
- **Interaction:** On tap/click, button translates `+4px` on both axes, eliminating the shadow for an arcade switch sensation.

### Player & Suspect Cards
- Solid background fill in `#171923` or `#F4F4F9` with a 3px Deep Ink border and a 4px Deep Ink drop shadow.
- Top-right corner houses an absolute-positioned status badge ("SUSPECT", "SAFE", "VOTED") tilted by `-3deg`.
- Active accused state pulses with an animated 4px outer border alternating between `#FF007F` and `#CCFF00`.

### Status Chips & Pills
- Elliptical `9999px` border radius with a 2px Deep Ink border and a 2px offset drop shadow.
- Vivid neon fills matching state context (`#CCFF00` for active/ready, `#FF007F` for accused, `#06B6D4` for room codes). Text styled in `label-pill`.

### Input Fields (Room Codes & Chat)
- Background `#0B0C10` with text in `#F4F4F9`.
- Bold 3px border in `#F4F4F9` shifting to `#CCFF00` on focus.
- Zero interior blur; sharp uppercase tracking for room codes.

### Voting Checkboxes & Radio Badges
- Replaced by chunky avatar selection tiles. Tapping a player stamps an oversized checkmark badge with a 3px border directly onto their avatar tile accompanied by a punchy micro-scale animation (`scale: 1.05`).

### Countdown Timers & Panic Indicators
- High-impact digital ticker styled in `headline-lg` surrounded by an Electric Magenta banner with alternating hazard stripes (`#FF007F` and `#0B0C10`) that kick in when the round timer dips below 10 seconds.