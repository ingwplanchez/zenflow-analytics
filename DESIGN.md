---
name: Productivity Intelligence
colors:
  surface: '#0b1326'
  surface-dim: '#0b1326'
  surface-bright: '#31394d'
  surface-container-lowest: '#060e20'
  surface-container-low: '#131b2e'
  surface-container: '#171f33'
  surface-container-high: '#222a3d'
  surface-container-highest: '#2d3449'
  on-surface: '#dae2fd'
  on-surface-variant: '#bbcac6'
  inverse-surface: '#dae2fd'
  inverse-on-surface: '#283044'
  outline: '#859490'
  outline-variant: '#3c4947'
  surface-tint: '#4fdbc8'
  primary: '#4fdbc8'
  on-primary: '#003731'
  primary-container: '#14b8a6'
  on-primary-container: '#00423b'
  inverse-primary: '#006b5f'
  secondary: '#c0c1ff'
  on-secondary: '#1000a9'
  secondary-container: '#3131c0'
  on-secondary-container: '#b0b2ff'
  tertiary: '#4edea3'
  on-tertiary: '#003824'
  tertiary-container: '#16bb83'
  on-tertiary-container: '#00442c'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#71f8e4'
  primary-fixed-dim: '#4fdbc8'
  on-primary-fixed: '#00201c'
  on-primary-fixed-variant: '#005048'
  secondary-fixed: '#e1e0ff'
  secondary-fixed-dim: '#c0c1ff'
  on-secondary-fixed: '#07006c'
  on-secondary-fixed-variant: '#2f2ebe'
  tertiary-fixed: '#6ffbbe'
  tertiary-fixed-dim: '#4edea3'
  on-tertiary-fixed: '#002113'
  on-tertiary-fixed-variant: '#005236'
  background: '#0b1326'
  on-background: '#dae2fd'
  surface-variant: '#2d3449'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: '1.4'
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.6'
  body-sm:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: '1.5'
  label-caps:
    fontFamily: JetBrains Mono
    fontSize: 11px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.05em
  data-lg:
    fontFamily: JetBrains Mono
    fontSize: 20px
    fontWeight: '500'
    lineHeight: '1'
  headline-md-mobile:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: '1.3'
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 4px
  gutter: 16px
  margin-page: 24px
  card-padding: 20px
  sidebar-width: 260px
---

## Brand & Style
This design system is engineered for high-performance personal productivity intelligence. The brand personality is rooted in **Precision, Intelligence, and Focus**. It targets power users who require high data density without cognitive overload. 

The aesthetic is **Modern Developer-Centric**, blending a sleek dark-mode foundation with functional glassmorphism and surgical color accents. It evokes an emotional response of "controlled mastery"—the feeling of being in the cockpit of one's own performance data. The UI prioritizes utility and clarity, utilizing subtle borders and distinct card-based modularity to organize complex information streams.

## Colors
The palette is built on a "Deep Slate" and "Charcoal" foundation to maximize contrast for data visualization while minimizing eye fatigue.

- **Primary (Teal - #14B8A6):** Used for throughput, active states, and primary CTA buttons. It represents movement and flow.
- **Secondary (Indigo - #6366F1):** Reserved for trends, historical data lines, and sophisticated transitions.
- **Tertiary (Emerald - #10B981):** Specific to insights, positive growth metrics, and "complete" statuses.
- **Neutral:** A range of slates (from #020617 to #1E293B) provides the structural framework, creating a deep, immersive environment.

## Typography
We utilize **Inter** as the primary typeface for its exceptional legibility at small sizes and high-density layouts. For data-specific elements (metrics, timestamps, and code snippets), we introduce **JetBrains Mono** to provide a technical, "dev-tool" rigor.

Large display headings use tighter tracking to maintain a compact feel, while labels are often presented in all-caps JetBrains Mono to clearly distinguish metadata from content.

## Layout & Spacing
The layout follows a **Streamlit-inspired sidebar-and-canvas model**. It uses a 12-column fluid grid for the main content area, allowing for modular "bricks" of data.

- **Sidebar:** Fixed at 260px, containing navigation and global filters. On mobile, this collapses into a bottom-sheet or drawer.
- **Rhythm:** A 4px baseline grid ensures tight, mathematical alignment. 
- **Density:** Components use "Compact" spacing by default, allowing more information to be visible above the fold. Gutters are kept at a crisp 16px to maintain separation without wasting screen real estate.

## Elevation & Depth
Depth is created through **Tonal Layering** rather than traditional heavy shadows.

- **Level 0 (Canvas):** The deepest background (#020617).
- **Level 1 (Cards/Sidebar):** Raised slightly (#0F172A) with a subtle 1px border (#1E293B).
- **Level 2 (Popovers/Tooltips):** Floating elements use a semi-transparent blur (Backdrop Filter: 12px) to maintain context of the data beneath.
- **Interactions:** Hover states on cards should trigger a subtle primary-colored top-border or a glow effect (0px 0px 15px rgba(20, 184, 166, 0.1)) rather than a lift, keeping the UI feeling "bolted down" and stable.

## Shapes
In line with the technical and professional aesthetic, shapes are kept intentionally disciplined. A **Soft (0.25rem)** roundedness is the standard for cards and inputs, providing a modern feel without becoming "bubbly." 

- **Standard Radius:** 4px (0.25rem) for most components.
- **Large Radius:** 8px (0.5rem) for containers and main dashboard cards.
- **Interactive:** Small buttons and tags use the 4px radius to maintain a sharp, precise profile.

## Components

- **Cards:** The core container. Features a subtle 1px border (#1E293B). Headers within cards should have a "Label-Caps" title and an optional icon slot.
- **Buttons:** 
  - *Primary:* Solid Teal (#14B8A6) with Slate text.
  - *Secondary:* Ghost style with a Slate border and Teal hover text.
- **Inputs:** Darker background than the card (#020617) with a 1px border. Focus state turns the border Teal.
- **Metrics/KPIs:** Large numbers in JetBrains Mono, paired with a small trend indicator (Indigo for neutral-up, Emerald for positive-up).
- **Charts:** Use a custom theme with no grid lines (except for the zero-axis). Line charts should use Secondary Indigo with a subtle gradient fill below the line.
- **Chips/Status:** Low-profile, using background tints of the accent colors (e.g., 10% Teal background with 100% Teal text).
- **Data Tables:** Zebra striping is avoided. Instead, use thin #1E293B horizontal dividers. Row hover should use a slight brightness increase.