---
name: Loom
colors:
  primary: "#292A2E"
  secondary: "#101214"
  surface: "#000000"
  on-surface: "#FFFFFF"
typography:
  body-md:
    fontFamily: Charlie Display
    fontSize: 25.2692px
    fontWeight: 700
rounded:
  md: 44px
---

# Design System Inspired by Atlassian Loom

## 1. Visual Theme & Atmosphere

Atlassian Loom's design system embodies modern enterprise software with a professional yet approachable aesthetic. The interface prioritizes clarity and usability through generous whitespace, bold typography, and a refined color hierarchy anchored by a vibrant blue that conveys trust and action. The system balances minimalism with purposeful visual depth, employing subtle shadows and rounded containers to create an elegant, layered experience. The overall mood is sophisticated, forward-thinking, and collaborative—reflecting Loom's positioning as an AI-powered communication platform for distributed teams.

**Key Characteristics**
- Clean, spacious layouts with extensive whitespace
- Bold, confident typography hierarchy using Charlie Display and Charlie Text
- Strategic use of vibrant blue (`#1868DB`) for primary actions and attention
- Soft, generous border radius on interactive elements (up to `9999px` for buttons)
- Minimal shadow depth for subtle elevation without visual clutter
- Light, accessible color palette with neutral backgrounds
- Rounded card containers (`44px` radius) for content grouping
- Accent colors (purple, orange) for variety and semantic meaning

## 2. Color Palette & Roles

### Primary
- **Primary Blue** (`#1868DB`): Primary call-to-action buttons, links, interactive states, and brand accent. Used across navigation, CTAs, and highlighted content.
- **Dark Charcoal** (`#292A2E`): Primary text color across the interface. Default text for body copy, headings, and most UI elements.

### Accent Colors
- **Purple Accent** (`#BF63F3`): Secondary accent for highlights, badges, and promotional content.
- **Deep Purple** (`#48245D`): Dark accent for layered backgrounds and premium tier indicators.
- **Orange** (`#FF613D`): Tertiary accent for callouts, notifications, and differentiation.
- **Light Blue** (`#8FB8F6`): Soft highlight and secondary button states.

### Interactive
- **Primary CTA Blue** (`#1868DB`): Primary button backgrounds, active states, focus indicators.
- **Secondary Button Gray** (`#FFFFFF`): Secondary button backgrounds with shadow elevation.
- **Transparent State** (`#0000`): Transparent backgrounds for ghost buttons and overlay elements.

### Neutral Scale
- **Off-Black** (`#101214`): High-contrast text, dark mode variant, secondary headings.
- **Pure White** (`#FFFFFF`): Default backgrounds, card surfaces, light text on dark.
- **Dark Gray** (`#6C6F77`): Secondary text, helper text, disabled states.
- **Medium Gray** (`#7D818A`): Tertiary text, muted labels, borders.
- **Light Gray** (`#8C8F97`): Subtle dividers, placeholder text, deemphasized elements.
- **Pure Black** (`#000000`): Maximum contrast for accessibility, rare use.

### Surface & Borders
- **Light Blue Background** (`#E9F2FE`): Light surface for secondary sections, information backgrounds.
- **Light Purple Background** (`#F8EEFE`): Soft background for premium or feature-highlighted sections.
- **Extra Light Blue** (`#EFF0FF`): Minimal emphasis backgrounds, very subtle surfaces.
- **Blue Border Accent** (`#8FB8F6`): Premium card borders, highlight frames (used at 2-3px width).

### Semantic / Status
- **Warning** (`#FFA900`): Warning states, caution indicators, attention-required notices.

## 3. Typography Rules

### Font Family
- **Primary Display Font**: Charlie Display, serif-style; fallback stack: `Georgia, serif`
- **Primary Body Font**: Charlie Text, sans-serif style; fallback stack: `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`

### Hierarchy

| Role | Font | Size | Weight | Line Height | Letter Spacing | Notes |
|------|------|------|--------|-------------|-----------------|-------|
| Display XL (h1) | Charlie Display | 81.92px | 700 | 81.92px | 0px | Hero headlines; use sparingly |
| Display L (h1) | Charlie Display | 63.27px | 700 | 65.10px | 0px | Main page headings |
| Display M (h2) | Charlie Display | 44.15px | 700 | 50.47px | 0px | Section headings |
| Heading L (h3) | Charlie Display | 32.50px | 700 | 41.37px | 0px | Subsection titles |
| Heading M (h3) | Charlie Display | 25.27px | 700 | 33.68px | 0px | Card titles, feature headers |
| Heading S (h4) | Charlie Text | 12.62px | 700 | 18.36px | 0px | Label text, small headings |
| Body Large | Charlie Text | 26.65px | 400 | 40.62px | 0px | Large body copy, hero text |
| Body Regular | Charlie Text | 16.00px | 700 | 24.00px | 0px | Primary body, link text |
| Body Base | Charlie Text | 16.00px | 400 | 24.00px | 0px | Default paragraph text |
| Button | Charlie Text | 16.00px | 400 | 24.00px | 0px | Button labels |
| Small Text | Charlie Text | 15.00px | 400 | 22.50px | 0px | Supporting text, captions |
| Caption | Charlie Text | 12.62px | 400 | 18.36px | 0px | Fine print, metadata |
| Input | Charlie Text | 14.00px | 400 | 21.98px | 0px | Form input placeholder/value |

### Principles
- Display fonts use Charlie Display for maximum visual impact on headings and hero content
- Body text defaults to Charlie Text for readability and screen legibility
- Maintain consistent line-height ratios (1.2–1.5x font size) for visual rhythm
- Weight hierarchy: 700 for headings/labels, 400 for body and inputs
- Avoid mixing Display and Body fonts within a single component
- Font sizes scale predictably; use px values exactly as specified for consistency
- Letter spacing remains 0px across all roles for tightness and professionalism

## 4. Component Stylings

### Buttons

#### Primary Button
- **Background**: `#1868DB`
- **Text Color**: `#FFFFFF`
- **Font**: Charlie Text, 16px, weight 400
- **Padding**: `8px 16px`
- **Height**: `40px`
- **Border Radius**: `9999px`
- **Border**: none
- **Shadow**: `rgba(0, 0, 0, 0.03) 0px 4px 6.4px 0px, rgba(0, 0, 0, 0.05) 0px 3px 9.6px 0px, rgba(0, 0, 0, 0.07) 0px 8px 32px 0px, rgba(0, 0, 0, 0.1) 0px 32px 96px 0px`
- **Hover State**: Increase opacity to 0.9; shadow deepens to `rgba(0, 0, 0, 0.04) 0px 2px 6px 0px, rgba(0, 0, 0, 0.06) 0px 5px 18px 0px, rgba(0, 0, 0, 0.1) 0px 24px 83px 0px`
- **Active State**: Scale `0.98`; shadow reduces to small elevation
- **Disabled State**: Opacity `0.5`; cursor `not-allowed`

#### Secondary Button (Light)
- **Background**: `#FFFFFF`
- **Text Color**: `#292A2E`
- **Font**: Charlie Text, 16px, weight 400
- **Padding**: `8px 16px`
- **Height**: `40px`
- **Border Radius**: `9999px`
- **Border**: `1px solid #E9F2FE`
- **Shadow**: `rgba(0, 0, 0, 0.03) 0px 4px 6.4px 0px, rgba(0, 0, 0, 0.05) 0px 3px 9.6px 0px, rgba(0, 0, 0, 0.07) 0px 8px 32px 0px, rgba(0, 0, 0, 0.1) 0px 32px 96px 0px`
- **Hover State**: Background shifts to `#E9F2FE`; border becomes `1px solid #8FB8F6`
- **Active State**: Background `#D4E6FC`; shadow reduces

#### Ghost Button
- **Background**: transparent
- **Text Color**: `#292A2E`
- **Font**: Charlie Text, 16px, weight 400
- **Padding**: `8px 16px`
- **Height**: `40px`
- **Border Radius**: `9999px`
- **Border**: `1px solid transparent`
- **Shadow**: none
- **Hover State**: Background becomes `rgba(24, 104, 219, 0.1)`; border `1px solid #1868DB`
- **Active State**: Background `rgba(24, 104, 219, 0.2)`; text color darkens

#### Icon Button
- **Background**: transparent
- **Text Color**: `#292A2E`
- **Width/Height**: `40px` (square or circular)
- **Border Radius**: `6px` (for grid buttons) or `9999px` (for circular)
- **Padding**: `0px`
- **Shadow**: none
- **Hover State**: Background `rgba(0, 0, 0, 0.05)`

### Cards & Containers

#### Standard Card
- **Background**: `#FFFFFF`
- **Text Color**: `#292A2E`
- **Padding**: `36px` (content spacing)
- **Border Radius**: `44px`
- **Border**: none
- **Shadow**: `rgba(0, 0, 0, 0.04) 0px 2px 6px 0px, rgba(0, 0, 0, 0.06) 0px 5px 18px 0px, rgba(0, 0, 0, 0.1) 0px 24px 83px 0px`
- **Hover State**: Shadow deepens to `rgba(0, 0, 0, 0.25) 0px 15px 50px 0px`; slight lift effect

#### Premium Card (Highlighted/Featured)
- **Background**: `#CFE1FD` (light blue)
- **Text Color**: `#292A2E`
- **Padding**: `70px`
- **Border Radius**: `44px`
- **Border**: `3px solid #8FB8F6`
- **Shadow**: none
- **Use Case**: "Most Popular" pricing tier, feature highlights

#### Secondary Card (Light Background)
- **Background**: `#E9F2FE`
- **Text Color**: `#292A2E`
- **Padding**: `36px`
- **Border Radius**: `44px`
- **Border**: none
- **Shadow**: `rgba(0, 0, 0, 0) 0px 0px 0px 0px` (minimal)
- **Use Case**: Secondary feature sections, light information displays

#### Purple Accent Card
- **Background**: `#F8EEFE`
- **Text Color**: `#292A2E`
- **Padding**: `36px`
- **Border Radius**: `44px`
- **Border**: none
- **Shadow**: none
- **Use Case**: Upsell content, premium messaging

### Inputs & Forms

#### Text Input
- **Background**: `#FFFFFF`
- **Text Color**: `#292A2E`
- **Font**: Charlie Text, 14px, weight 400
- **Padding**: `12px 16px`
- **Height**: `48px`
- **Border Radius**: `14px`
- **Border**: `1px solid #7D818A`
- **Placeholder Color**: `#8C8F97` (opacity 0.7)
- **Focus State**: Border becomes `2px solid #1868DB`; box-shadow `0px 0px 0px 3px rgba(24, 104, 219, 0.1)`
- **Disabled State**: Background `#F8EEFE`; border `1px solid #8C8F97`; opacity `0.5`

#### Select / Dropdown Input
- **Background**: `#FFFFFF`
- **Text Color**: `#292A2E`
- **Font**: Charlie Text, 14px, weight 400
- **Padding**: `12px 16px`
- **Height**: `48px`
- **Border Radius**: `14px`
- **Border**: `1px solid #7D818A`
- **Focus State**: Border `2px solid #1868DB`; box-shadow `0px 0px 0px 3px rgba(24, 104, 219, 0.1)`
- **Dropdown Icon**: Position right; color `#6C6F77`

#### Checkbox / Radio
- **Size**: `20px × 20px`
- **Border Radius**: `4px` (checkbox), `10px` (radio)
- **Border**: `2px solid #7D818A`
- **Checked Background**: `#1868DB`
- **Checked Border**: `2px solid #1868DB`
- **Focus State**: Box-shadow `0px 0px 0px 3px rgba(24, 104, 219, 0.1)`

### Navigation

#### Header Navigation
- **Background**: `#FFFFFF`
- **Height**: `90px`
- **Text Color**: `#292A2E`
- **Font**: Charlie Text, 16px, weight 400
- **Horizontal Padding**: `36px` (left/right)
- **Shadow**: `rgba(0, 0, 0, 0.04) 0px 2px 6px 0px` (subtle bottom border effect)
- **Link Color**: `#292A2E`
- **Link Hover Color**: `#1868DB`
- **Active Link**: Text color `#1868DB`; bottom border `3px solid #1868DB`

#### Breadcrumb
- **Font**: Charlie Text, 14px, weight 400
- **Text Color**: `#7D818A`
- **Separator**: `/` in `#8C8F97`
- **Active Item Color**: `#292A2E`
- **Link Hover**: Color `#1868DB`; underline appears

#### Dropdown Menu
- **Background**: `#FFFFFF`
- **Border Radius**: `12px`
- **Border**: `1px solid #E9F2FE`
- **Shadow**: `rgba(0, 0, 0, 0.04) 0px 2px 6px 0px, rgba(0, 0, 0, 0.06) 0px 5px 18px 0px, rgba(0, 0, 0, 0.1) 0px 24px 83px 0px`
- **Item Padding**: `12px 16px`
- **Item Font**: Charlie Text, 14px, weight 400
- **Item Color**: `#292A2E`
- **Item Hover**: Background `#F8EEFE`; color `#1868DB`
- **Divider**: `1px solid #E9F2FE`; margin `8px 0px`
- **Z-index**: `30`

### Badges & Tags

#### Primary Badge
- **Background**: `#1868DB`
- **Text Color**: `#FFFFFF`
- **Font**: Charlie Text, 12px, weight 700
- **Padding**: `4px 12px`
- **Border Radius**: `12px`
- **Border**: none

#### Secondary Badge
- **Background**: `#E9F2FE`
- **Text Color**: `#1868DB`
- **Font**: Charlie Text, 12px, weight 700
- **Padding**: `4px 12px`
- **Border Radius**: `12px`
- **Border**: `1px solid #8FB8F6`

#### Warning Badge
- **Background**: `#FFA900`
- **Text Color**: `#FFFFFF`
- **Font**: Charlie Text, 12px, weight 700
- **Padding**: `4px 12px`
- **Border Radius**: `12px`
- **Border**: none

## 5. Layout Principles

### Spacing System
- **Base Unit**: 4px (all spacing multiples derive from this)
- **Scale**: 4px, 8px, 12px, 16px, 24px, 32px, 36px, 40px, 56px, 64px, 72px, 92px, 112px
- **Component Padding**: 8px (compact), 16px (standard), 24px (comfortable), 36px (generous)
- **Section Margins**: 32px (nested sections), 56px (related content blocks), 72px (major sections), 92px–112px (page-level breaks)
- **Gap Between Elements**: 4px (tight), 8px (compact), 16px (standard), 24px (breathing room), 56px (major grouping)

### Grid & Container
- **Max Width**: 1440px (standard container for full-width layouts)
- **Column Strategy**: 12-column grid; use thirds, halves, and quarters for flexible layouts
- **Padding**: 36px left/right on desktop; 24px on tablet; 16px on mobile
- **Section Pattern**: Hero (full width) → Content Container (max 1440px) → Cards/Components (nested)

### Whitespace Philosophy
Generous whitespace is core to the Loom aesthetic. Maintain at least 24px padding around major content blocks and 56px–72px between logical sections. Avoid cramped layouts; prioritize breathing room over density. Use whitespace to guide focus to key actions (primary buttons, pricing tiers, feature callouts).

### Border Radius Scale
- `6px`: Small interactive elements (icon buttons, compact inputs)
- `12px`: Dropdowns, medium modals, secondary containers
- `14px`: Form inputs (text, select)
- `44px`: Cards, panels, major containers (primary)
- `41.69px`: Rounded images, media containers
- `9999px`: Pill-shaped buttons, chat bubbles, full-circle elements

### Border Widths
- **Thin**: `1px` (input borders, dividers, subtle card outlines)
- **Medium**: `2px` (focused input borders, active state indicators)
- **Thick**: `3px` (premium card border, strong highlights)

## 6. Depth & Elevation

| Level | Treatment | Use |
|-------|-----------|-----|
| None (Flat) | No shadow; `box-shadow: none` | Backgrounds, text layers, disabled states |
| Small | `rgba(0, 0, 0, 0.04) 0px 2px 6px 0px, rgba(0, 0, 0, 0.06) 0px 5px 18px 0px, rgba(0, 0, 0, 0.1) 0px 24px 83px 0px` | Standard cards, secondary buttons, subtle elevation |
| Medium | `rgba(0, 0, 0, 0.03) 0px 4px 6.4px 0px, rgba(0, 0, 0, 0.05) 0px 3px 9.6px 0px, rgba(0, 0, 0, 0.07) 0px 8px 32px 0px, rgba(0, 0, 0, 0.1) 0px 32px 96px 0px` | Primary buttons, floating elements, interactive hover states |
| Large | `rgba(0, 0, 0, 0.25) 0px 15px 50px 0px` | Card hover states, modals, popovers |
| Extra Large | `rgba(0, 0, 0, 0.04) 0px 2px 6px 0px, rgba(0, 0, 0, 0.06) 0px 5px 18px 0px, rgba(0, 0, 0, 0.1) 0px 24px 83px 0px` | Deep modals, toasts, dialogs |

**Shadow Philosophy**: Shadows use layered multiple box-shadows for depth realism. Each layer represents a different light source distance, creating natural, non-harsh elevation. High-alpha values (0.1) at greater offsets suggest distant light; low-alpha values at close offsets suggest near diffusion. Avoid single-layer shadows; always use the multi-layer approach for consistency.

### Opacity Levels
- `0.00` (0%): Fully transparent; invisible elements, hidden states
- `0.13` (13%): Subtle hover/focus indicator; semi-transparent overlays
- `0.20` (20%): Light opacity for disabled text, muted labels
- `0.30` (30%): Medium opacity; secondary text, tooltips
- `0.70` (70%): Near-solid; emphasis without full strength
- `0.97` (97%): Nearly opaque; very slight transparency for layered effects

### Z-index / Layering
- **Base Layer**: `z-index: 1` — Default content layer (cards, text, standard components)
- **Dropdown Layer**: `z-index: 10` — Dropdowns, popovers, tooltip layers
- **Sticky Layer**: `z-index: 20` — Sticky headers, fixed navigation, persistent elements
- **Modal/Overlay Layer**: `z-index: 30` — Modals, dialogs, full-screen overlays
- **Toast/Alert Layer**: `z-index: 40` — Toast notifications, alerts (highest interactive priority)

## 7. Do's and Don'ts

### Do
- **Do** use the Charlie Display font family for all headings (h1–h4) to create visual hierarchy and brand consistency
- **Do** apply the primary blue (`#1868DB`) exclusively to primary call-to-action buttons and high-priority interactions
- **Do** maintain 36px–72px spacing between major content sections for visual breathing room
- **Do** use the multi-layer shadow system for all elevated components (cards, buttons on hover, modals) to create realistic depth
- **Do** apply `border-radius: 9999px` to all primary button variants for the signature pill shape
- **Do** use 12-column grid layouts and ensure max-width containers are 1440px for desktop consistency
- **Do** default to `#292A2E` for primary text and `#FFFFFF` for default backgrounds
- **Do** apply border-radius `44px` to all major card and panel components
- **Do** ensure form inputs use `border-radius: 14px` and `height: 48px` for touch-friendly sizing
- **Do** group related actions (buttons, navigation) with consistent 16px gaps

### Don't
- **Don't** use Charlie Text font for headings; reserve it for body copy and UI labels only
- **Don't** apply drop shadows to text elements; use color contrast instead
- **Don't** exceed `border-radius: 9999px` on non-button elements without design review
- **Don't** use colors outside the defined palette; stick to the 17 extracted colors
- **Don't** place more than 3 call-to-action buttons in a single section; prioritize with color and hierarchy
- **Don't** use opacity below 0.20 for text; it violates WCAG accessibility standards
- **Don't** nest containers with more than 2 levels of `box-shadow` depth; keep elevation subtle
- **Don't** use single-layer box-shadows; always apply the multi-layer system from the shadow reference
- **Don't** set `font-weight: 400` on headings; headings are always weight 700
- **Don't** use custom spacing values; stick to the predefined scale (multiples of 4px–12px and semantic values like 36px, 56px, 72px)

## 8. Responsive Behavior

### Breakpoints

| Name | Width | Key Changes |
|------|-------|-------------|
| Mobile | 320px–479px | Full-width containers; 16px padding; single-column layout; 16px font-size for body text |
| Tablet | 480px–1023px | 24px padding; 2-column grid where applicable; 40px margin between sections |
| Desktop | 1024px–1440px | 36px padding; full 12-column grid; 56px–72px section margins |
| Large Desktop | 1440px+ | Max-width container 1440px; 36px side padding; extended whitespace |

### Touch Targets
- **Minimum Interactive Size**: 44px × 44px (buttons, icon buttons, links)
- **Recommended Size**: 48px × 48px (form inputs, large touch buttons)
- **Comfortable Spacing**: 16px gap between interactive elements on mobile; 24px on tablet/desktop
- **Text Link Padding**: 8px vertical, 4px horizontal for comfortable tapping

### Collapsing Strategy
- **Hero Section**: Full-width on mobile (no container max-width); 56px padding becomes 24px; heading font-size reduces from 81.92px to 44px
- **Cards Grid**: 1 column on mobile, 2 on tablet, 3 on desktop; padding reduces from 36px to 24px on mobile
- **Navigation**: Hamburger menu (icon button) on mobile; full horizontal nav reappears at 1024px breakpoint
- **Buttons**: Secondary buttons stack vertically on mobile (full width `width: 100%`); appear inline at 768px+
- **Spacing**: Section margins reduce by 50% on mobile (72px becomes 36px; 56px becomes 28px)
- **Typography**: Display L (63.27px) reduces to 44.15px on tablet; 32.5px on mobile for legibility

## 9. Agent Prompt Guide

### Quick Color Reference
- **Primary CTA**: Primary Blue (`#1868DB`)
- **Background (Default)**: Pure White (`#FFFFFF`)
- **Heading Text**: Dark Charcoal (`#292A2E`)
- **Body Text**: Dark Charcoal (`#292A2E`)
- **Secondary Text**: Dark Gray (`#6C6F77`)
- **Disabled/Muted**: Medium Gray (`#7D818A`)
- **Light Backgrounds**: Light Blue (`#E9F2FE`) or Light Purple (`#F8EEFE`)
- **Borders**: Medium Gray (`#7D818A`) or Light Blue (`#8FB8F6`)
- **Accent (Secondary)**: Purple (`#BF63F3`)
- **Warning**: Orange (`#FFA900`)

### Iteration Guide
1. **Typography**: All headings use Charlie Display at specified px sizes (81.92px, 63.27px, 44.15px, 32.5px, 25.27px); body text is Charlie Text 16px weight 400. Never mix fonts within a component.
2. **Button Styling**: Primary buttons are always `#1868DB` with `border-radius: 9999px`, padding `8px 16px`, height `40px`, and multi-layer shadow from the Medium elevation table. Secondary buttons are white with subtle border. Ghost buttons are transparent with dark text.
3. **Card Borders & Radius**: All major containers use `border-radius: 44px` minimum. Standard cards have white background (`#FFFFFF`) with Small shadow. Premium/featured cards have light blue background (`#CFE1FD`) with `3px solid #8FB8F6` border.
4. **Spacing**: Use the predefined scale (8px, 16px, 24px, 36px, 56px, 72px). Section margins are 56px–72px apart. Component padding inside cards is 36px. Gaps between inline elements are 16px.
5. **Forms**: Text inputs are 48px height, `border-radius: 14px`, with `1px solid #7D818A` border. On focus, border becomes `2px solid #1868DB` and add `box-shadow: 0px 0px 0px 3px rgba(24, 104, 219, 0.1)`.
6. **Colors**: Do not invent colors; use only the 17 extracted palette. Primary actions are `#1868DB`. Text is `#292A2E`. Backgrounds are `#FFFFFF`, `#E9F2FE`, or `#F8EEFE`. Borders use `#7D818A` or `#8FB8F6`.
7. **Elevation & Shadows**: Never use a single box-shadow. Apply the multi-layer system: Small, Medium, Large, or Extra Large from the Depth & Elevation table. Cards default to Small; buttons on hover use Medium; modals use Large.
8. **Responsive**: At 480px, switch to mobile layout (single column, 24px padding, reduced heading sizes, hamburger menu). At 1024px+, expand to multi-column with full navigation. Max container width is 1440px.
9. **Accessibility**: Maintain text contrast ratios of 4.5:1 minimum. Use opacity 0.20+ for secondary text. Ensure all interactive elements meet 44px × 44px minimum size. Apply focus states with blue border/shadow.
10. **Navigation**: Header is always 90px tall, white background, with 36px horizontal padding. Links are 16px weight 400 in dark charcoal; hover state becomes `#1868DB`. Active links show `#1868DB` text with `3px solid #1868DB` bottom border.