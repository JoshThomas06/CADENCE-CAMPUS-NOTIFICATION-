---
name: Academic Signal & Event Dispatch
colors:
  surface: '#f2fbff'
  surface-dim: '#cddde3'
  surface-bright: '#f2fbff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#e7f6fd'
  surface-container: '#e1f0f7'
  surface-container-high: '#dbebf1'
  surface-container-highest: '#d6e5eb'
  on-surface: '#0f1e22'
  on-surface-variant: '#41484b'
  inverse-surface: '#253337'
  inverse-on-surface: '#e4f3fa'
  outline: '#71787c'
  outline-variant: '#c0c8cb'
  surface-tint: '#366574'
  primary: '#003643'
  on-primary: '#ffffff'
  primary-container: '#1b4d5c'
  on-primary-container: '#8ebdce'
  inverse-primary: '#9fcee0'
  secondary: '#a04028'
  on-secondary: '#ffffff'
  secondary-container: '#fe8769'
  on-secondary-container: '#74200a'
  tertiary: '#442c00'
  on-tertiary: '#ffffff'
  tertiary-container: '#614100'
  on-tertiary-container: '#eaaa35'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#baeafc'
  primary-fixed-dim: '#9fcee0'
  on-primary-fixed: '#001f28'
  on-primary-fixed-variant: '#1a4d5c'
  secondary-fixed: '#ffdad2'
  secondary-fixed-dim: '#ffb4a2'
  on-secondary-fixed: '#3c0700'
  on-secondary-fixed-variant: '#802913'
  tertiary-fixed: '#ffdeae'
  tertiary-fixed-dim: '#fdba45'
  on-tertiary-fixed: '#281900'
  on-tertiary-fixed-variant: '#604100'
  background: '#f2fbff'
  on-background: '#0f1e22'
  surface-variant: '#d6e5eb'
  slate-teal-deep: '#0E2D36'
  slate-teal-surface: '#F0F5F6'
  parchment-base: '#FBF9F4'
  parchment-card: '#FFFFFF'
  vintage-terracotta: '#C2593F'
  terracotta-soft: '#F9ECE8'
  antique-gold: '#D99B26'
  gold-subtle: '#FBF4E7'
  forest-stone: '#2E473B'
  critical-crimson: '#A82A2A'
  critical-tint: '#FDF0F0'
  border-subtle: '#DCE5E7'
typography:
  display-lg:
    fontFamily: Playfair Display
    fontSize: 3.5rem
    fontWeight: '600'
    lineHeight: 4rem
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Playfair Display
    fontSize: 2.25rem
    fontWeight: '600'
    lineHeight: 2.75rem
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Playfair Display
    fontSize: 2rem
    fontWeight: '600'
    lineHeight: 2.5rem
    letterSpacing: -0.015em
  headline-lg-mobile:
    fontFamily: Playfair Display
    fontSize: 1.5rem
    fontWeight: '600'
    lineHeight: 2rem
  headline-md:
    fontFamily: Playfair Display
    fontSize: 1.5rem
    fontWeight: '500'
    lineHeight: 2rem
  title-lg:
    fontFamily: Playfair Display
    fontSize: 1.25rem
    fontWeight: '600'
    lineHeight: 1.75rem
  title-md:
    fontFamily: Inter
    fontSize: 1.125rem
    fontWeight: '600'
    lineHeight: 1.5rem
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 1rem
    fontWeight: '400'
    lineHeight: 1.6rem
  body-md:
    fontFamily: Inter
    fontSize: 0.875rem
    fontWeight: '400'
    lineHeight: 1.4rem
  body-sm:
    fontFamily: Inter
    fontSize: 0.75rem
    fontWeight: '400'
    lineHeight: 1.15rem
  label-md:
    fontFamily: Inter
    fontSize: 0.8125rem
    fontWeight: '500'
    lineHeight: 1.2rem
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Inter
    fontSize: 0.6875rem
    fontWeight: '600'
    lineHeight: 1rem
    letterSpacing: 0.04em
  code-sm:
    fontFamily: Inter
    fontSize: 0.75rem
    fontWeight: '500'
    lineHeight: 1rem
    letterSpacing: 0.02em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-mobile: 1rem
  margin: 2.5rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

This design system synthesizes the storied prestige of collegiate heritage with high-throughput event streaming technology. Crafted for campus dispatchers, department chairs, faculty, and students, the visual language balances calm intellectual gravity with urgent, life-safety clarity. 

The aesthetic marries **Editorial Traditionalism** with **Modern Glassmorphic Utility**. Inspired by collegiate oil paintings—where deep shaded limestone architecture meets warm foliage and dappled amber light—the system uses deep slate teal foundations punctuated by sharp terracotta and luminous sunlit gold. This avoids the clinical detachment of standard SaaS dashboards while rejecting the sensory overload of conventional emergency broadcast tools. 

Key attributes:
- **Authoritative & Scholarly:** Grounded in collegiate structure, classical typographic rhythm, and balanced proportions.
- **Mission-Critical Clarity:** Microservices events, alert dispatches, and audit logs are presented with crisp tabular precision.
- **Atmospheric Depth:** Layered translucent glass panels, luminous status indicators, and warm parchment container surfaces build spatial depth without visual noise.

## Colors

The color palette directly references the impressionistic palette of campus stone, foliage, and sunlight:
- **Primary (`#1B4D5C`):** Collegiate Slate Teal. Serves as the bedrock for primary navigation, critical interactive states, high-level headers, and key focal anchors.
- **Secondary (`#C2593F`):** Vintage Terracotta / Warm Rust. Utilized for priority alerts (`HIGH`, `VENUE_CHANGED`, `CANCELLED`), callout badges, and active state indicators that require attention without invoking full crisis mode.
- **Tertiary (`#D99B26`):** Antique Amber Gold. Signifies transitional states, pending dispatches, academic notices, and activity heatmaps.
- **Neutral (`#253338`):** Deep Forest Stone Slate. Provides high-contrast, fatigue-free body reading and deep neutral structure.

### Semantic Priority & Lifecycle Mapping
- **CRITICAL / Emergency (`CAMPUS_EMERGENCY`):** `#A82A2A` Crimson on `#FDF0F0` tinted surface. Full priority override with subtle pulsing ring.
- **URGENT / High Academic (`EXAM_POSTPONED`, `CLASS_CANCELLED`):** `#C2593F` Terracotta on `#F9ECE8` base.
- **HIGH (`VENUE_CHANGED`):** `#D99B26` Antique Gold on `#FBF4E7` base.
- **NORMAL (`NEW_EVENT`, Informational):** `#1B4D5C` Slate Teal on `#F0F5F6` base.
- **Backgrounds:** The primary viewport uses `#FBF9F4` (Parchment Base), paired with `#FFFFFF` cards and frosted `#F0F5F6` glass panels.

## Typography

The typographic hierarchy establishes clear roles between historical collegiate presence and high-density operational telemetry:

- **Display & Headings (Playfair Display):** Conveys editorial prestige, institutional authority, and human warmth. Used exclusively for top-level campus stream titles, incident summaries, modal headers, and hero status blocks.
- **Data, Navigation & Body (Inter):** Neutral, hyper-legible, and robust. Powers data grids, real-time WebSocket event logs, microservice queue metrics, user role menus, and system status indicators.
- **Labels & Micro-copy:** Rendered with elevated tracking (`0.04em`) in medium-to-semibold Inter weights for instantaneous scannability across emergency priority classifications and timestamps.

## Layout & Spacing

The layout utilizes a structured 12-column fluid grid system on desktop that gracefully collapses to an 8-column layout on tablet devices and a single fluid column on mobile.

- **Desktop (1200px+):** Outer margins of `2.5rem` (`space-xl`), gutters of `1.5rem` (`gutter`). Supports split-pane operations: dedicated left-hand navigation/role control, central live notification stream, and a right-hand rail displaying microservice delivery telemetry and the GitHub-style event activity heatmap.
- **Tablet (768px - 1199px):** Outer margins of `1.5rem`, gutters of `1rem`. Right-hand health telemetry collapses into a secondary contextual drawer.
- **Mobile (< 768px):** Outer margins and gutters set to `1rem`. Top sticky emergency alert banner takes layout precedence, with navigation docked to an accessible lower glass bar.
- **Component Rhythms:** Internal padding for cards strictly adheres to `space-md` (16px) or `space-lg` (24px) to retain an airy, readable editorial proportion.

## Elevation & Depth

Visual hierarchy leverages crisp tonal layering, frosted parchment glassmorphism, and subtle ambient shadows tinted with collegiate slate teal.

- **Level 0 (Canvas Base):** Solid `#FBF9F4` matte parchment surface.
- **Level 1 (Default Containers & List Items):** `#FFFFFF` surfaces with subtle, crisp borders (`1px solid #DCE5E7`) and an ambient tinted drop shadow: `0 2px 6px rgba(27, 77, 92, 0.04)`.
- **Level 2 (Interactive Cards & Floating Nav):** Translucent backdrop-filter surface (`rgba(255, 255, 255, 0.88)` with `12px` blur), framed by `1px solid rgba(220, 229, 231, 0.8)`. Shadow: `0 8px 24px rgba(27, 77, 92, 0.08)`.
- **Level 3 (Toasts & VisionOS-Inspired Floating Alerts):** Dynamic floating banners utilizing double-rim refraction: `0 12px 32px rgba(14, 45, 54, 0.12)`, `inset 0 1px 0 rgba(255, 255, 255, 0.6)`. Backdrops blur campus content up to `16px`.
- **Glowing Status Rings:** Operational status and priority beacons feature concentric, low-opacity glowing auras (e.g., active WebSocket stream emits `box-shadow: 0 0 0 3px rgba(27, 77, 92, 0.15)`).

## Shapes

The design uses a cohesive **Rounded** shape language (`roundedness: 2`):
- Standard components (buttons, input fields, notification item cards, status badges) utilize a base radius of `0.5rem` (8px).
- Modal windows, large toast containers, and elevated dashboard cards utilize `1rem` (16px).
- Overarching hero modules and floating dock controls step up to `1.5rem` (24px).
- Status indicator dots, user profile markers, and capsule filter chips retain full pill borders (`9999px`) to cleanly segment categorical filters.

## Components

### Buttons
- **Primary:** Background in `#1B4D5C` (Slate Teal), text in `#FFFFFF`, with `0.5rem` border radius. On hover, background shifts to `#0E2D36` with a `0 4px 12px rgba(27, 77, 92, 0.2)` shadow.
- **Secondary / Ghost:** Transparent background, `1px solid #1B4D5C`, text in `#1B4D5C`. Hover fills with `#F0F5F6`.
- **Emergency Dispatch (Destructive):** High-impact `#C2593F` (Terracotta) or `#A82A2A` (Critical Crimson) fill, crisp white typography, paired with an affirmative two-step confirmation ring.

### Layered Notification Cards & Toasts
- Floating dynamic toasts inspired by visionOS alert capsules. Composed of translucent white card surfaces (`backdrop-filter: blur(16px)`), a 3px vertical accent border corresponding to priority (`CRITICAL` = crimson, `URGENT` = terracotta, `NORMAL` = slate teal), timestamp in `label-sm`, and Playfair Display title. Action controls (`[View Details]`, `[Acknowledge]`) sit flush right.

### Activity Heatmaps (Event Dispatch Tracker)
- GitHub-style event activity matrices tracking hourly and weekly campus alert dispatches. Cells utilize rounded `2px` corners and step through a 4-tier slate teal/gold progression: empty (`#E7EEF0`), low (`#95B7C0`), medium (`#1B4D5C`), high/emergency spike (`#D99B26` or `#C2593F`).

### Glowing Status Rings & Chips
- Status indicators combine an 8px circular pip with an outer glowing ripple. 
- Badges use uppercase `label-sm` font with a pill shape (`9999px`), rendered in soft background tones (e.g., `#F9ECE8` for cancelled classes, `#FBF4E7` for venue shifts).

### Input Fields & Controls
- Form inputs feature `#FFFFFF` fill with `1px solid #DCE5E7` border. Focus shifts to a `2px` slate teal outline with a soft ambient aura (`box-shadow: 0 0 0 3px rgba(27, 77, 92, 0.12)`). Checkboxes and radio buttons employ slate teal fill when checked, set with smooth micro-transitions.

### Role Context Switcher
- Persistent segmented pill control supporting `ADMIN`, `FACULTY`, and `STUDENT` contexts. The active context slides smoothly across positions on a translucent `#F0F5F6` track with a white floating pill card.