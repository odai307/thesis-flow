---
name: Academic Precision
colors:
  surface: '#fbf8ff'
  surface-dim: '#dbd8e5'
  surface-bright: '#fbf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f5f2fe'
  surface-container: '#efecf9'
  surface-container-high: '#e9e6f3'
  surface-container-highest: '#e4e1ed'
  on-surface: '#1b1b23'
  on-surface-variant: '#454555'
  inverse-surface: '#303039'
  inverse-on-surface: '#f2effc'
  outline: '#767586'
  outline-variant: '#c6c5d7'
  surface-tint: '#4549dc'
  primary: '#1713b8'
  on-primary: '#ffffff'
  primary-container: '#3538cd'
  on-primary-container: '#bbbdff'
  inverse-primary: '#c0c1ff'
  secondary: '#555f73'
  on-secondary: '#ffffff'
  secondary-container: '#d6e0f8'
  on-secondary-container: '#596377'
  tertiary: '#6c1e00'
  on-tertiary: '#ffffff'
  tertiary-container: '#932c00'
  on-tertiary-container: '#ffaf95'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e1e0ff'
  primary-fixed-dim: '#c0c1ff'
  on-primary-fixed: '#04006d'
  on-primary-fixed-variant: '#2a2bc4'
  secondary-fixed: '#d9e3fb'
  secondary-fixed-dim: '#bdc7de'
  on-secondary-fixed: '#111c2d'
  on-secondary-fixed-variant: '#3d475a'
  tertiary-fixed: '#ffdbd0'
  tertiary-fixed-dim: '#ffb59d'
  on-tertiary-fixed: '#390c00'
  on-tertiary-fixed-variant: '#832600'
  background: '#fbf8ff'
  on-background: '#1b1b23'
  surface-variant: '#e4e1ed'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Inter
    fontSize: 30px
    fontWeight: '700'
    lineHeight: 38px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  section-header:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 28px
  body-base:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
  label-xs:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 18px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  sidebar-width: 280px
  sidebar-collapsed: 64px
  container-max: 1200px
  gutter: 24px
  margin-mobile: 16px
  stack-gap: 12px
  section-gap: 40px
---

## Brand & Style

The design system is engineered for the rigors of academic research and high-stakes document management. It balances the high-performance utility of a modern SaaS like Linear with the quiet, authoritative environment of a university library. The aesthetic is **Corporate Modern with Minimalist influences**, prioritizing cognitive clarity over decorative flair.

The target audience—graduate students, faculty, and research administrators—requires a workspace that reduces "interface noise." This is achieved through generous white space, a strictly structured layout, and a functional color system that provides immediate feedback on document status without overwhelming the user.

## Colors

The palette is anchored by a deep Indigo primary, signaling trust and intellectual rigor. Surfaces are kept pure white to mimic the paper-based nature of academic work, set against a subtle light-gray background to define the application boundaries.

Status colors are refined to be legible but not neon; they use slightly desaturated tones to maintain the calm atmosphere. 
- **Neutrals:** Use a 9-step gray scale. Text primary should be a deep slate (#101828) for maximum readability.
- **Borders:** Use a consistent light gray (#EAECF0) for subtle structural definition.

## Typography

This design system utilizes **Inter** for its neutral, highly legible character, particularly in technical and long-form text environments. 

Hierarchy is established through weight and scale rather than color. Page titles utilize tight tracking and bold weights to ground the view. For body text, a standard 16px base is used to ensure accessibility during long reading sessions. Use `label-xs` for metadata and sidebar category headers to create a clear structural distinction from content.

## Layout & Spacing

The layout follows a **Fixed-Fluid Hybrid** model. The primary navigation is a persistent, collapsible sidebar on the left. The main content area is capped at 1200px to maintain comfortable line lengths for academic reading.

- **Desktop:** 12-column grid within the content area. The sidebar pushes the content rather than overlaying it.
- **Mobile:** The sidebar collapses into a bottom navigation bar for high-frequency actions (Search, Home, Notifications) with a "More" drawer for secondary links. 
- **Rhythm:** Use a strict 4px/8px baseline grid. Components like cards and list items should use 12px or 16px internal padding to maintain the "uncluttered" feel.

## Elevation & Depth

To maintain a "flat but functional" SaaS aesthetic, this design system avoids heavy drop shadows. Depth is communicated via:

1.  **Low-Contrast Outlines:** All cards and inputs feature a 1px border (#EAECF0).
2.  **Ambient Shadows:** For floating elements like menus or active cards, use a single, highly diffused shadow: `0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)`.
3.  **Tonal Layering:** The background is #F9FAFB, while the primary interactive surfaces (cards, sidebars) are #FFFFFF. This subtle contrast is the primary driver of hierarchy.

## Shapes

The design system uses a **Rounded** profile (8px base) to soften the professional tone and make the application feel modern and accessible.

- **Base Radius (8px):** Applied to buttons, input fields, and standard cards.
- **Large Radius (12px):** Applied to large containers, modals, and main content wrappers.
- **Pill (Full):** Reserved exclusively for status badges and tags to distinguish them from interactive buttons.

## Components

### Buttons
- **Primary:** Solid Indigo (#3538CD) with white text. No gradients.
- **Secondary:** White background with a 1px gray border.
- **Ghost:** No background or border; Indigo text for actions, Gray text for navigation.

### Cards
Cards are the primary container. They must have a white background, an 8px corner radius, and a subtle 1px border. On hover, the border color should darken slightly to indicate interactivity.

### Status Badges
Pill-shaped with a light-tint background (10% opacity of the status color) and dark-tint text (the status color itself) for high contrast and accessibility.

### Inputs
Minimalist 1px gray borders. On `:focus`, the border transitions to Primary Indigo with a 3px soft indigo glow (box-shadow) to emphasize the active writing state.

### Data Tables
Tables should have no vertical lines. Use horizontal dividers only (#F2F4F7). The header row uses a light gray background (#F9FAFB) and uppercase `label-xs` typography.