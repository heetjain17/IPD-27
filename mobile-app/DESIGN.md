# Design System Strategy

## 1. Design Philosophy

This app is a location-based discovery platform, not a map app and not a media-heavy content app. The design should feel like a **smart, calm, high-trust exploration system** that helps users make decisions quickly.

The visual direction is built around these principles:

- **Clarity over decoration**: every visual element must earn its place.
- **System over style**: components should feel consistent across the entire app.
- **Content-led, not image-led**: the UI must work even when there are few or no images.
- **Signal-driven**: distance, rating, popularity, categories, and activity should be visible at a glance.
- **Distinct from map apps**: the map is a tool, not the identity of the app.
- **Premium but restrained**: polished surfaces, strong hierarchy, no excessive effects.
- **Accessible in both themes**: dark and light mode must feel equally intentional.

The app should feel like a curated discovery product with strong structure, not a generic travel app clone.

---

## 2. Core Design Identity

### Product Personality

- Calm
- Intelligent
- Curated
- Trustworthy
- Editorial
- Modern

### Visual Character

- Minimal but not empty
- Structured but not rigid
- Soft surfaces instead of heavy borders
- Strong typography instead of busy imagery
- Subtle emphasis instead of loud ornamentation

### What the UI should avoid

- Glassmorphism
- Neon-heavy visuals
- Overuse of gradients
- Heavy image dependence
- Map-only layouts
- Thin 1px borders used as separators
- Visual noise from too many accents

---

## 3. Theme System

The app uses a **dual theme system** with a shared semantic color model.

### Theme Rules

- All colors must come from design tokens.
- No hardcoded hex values in components.
- Dark and light modes should preserve the same hierarchy.
- Accent color should remain consistent across both modes.
- Surfaces should communicate elevation through tonal difference, not borders.

### Theme Behavior

- Dark mode is the default experience.
- Light mode should feel like a clean paper-like counterpart, not an inverted dark theme.
- Every component must work in both themes without layout changes.

---

## 4. Color Philosophy

The color palette should feel calm, functional, and slightly editorial.

### Color Strategy

- **Backgrounds**: neutral, low-saturation base.
- **Surfaces**: slightly offset from the background to create layering.
- **Primary accent**: used for actions, active states, and important discovery signals.
- **Secondary text**: muted but readable.
- **Status colors**: reserved for system feedback only.

### Suggested Accent Direction

Use a single confident accent color rather than multiple competing hues. The accent should be visible in buttons, active chips, selected tabs, key markers, and highlighted metrics.

### Avoid

- Random colorful UI blocks
- Excessive gradients
- Multiple competing brand colors
- Bright accent overload

---

## 5. Semantic Color Tokens

Use semantic tokens rather than component-specific colors.

### Dark Theme Tokens

- `background`: app canvas
- `surface`: primary content surface
- `surfaceRaised`: elevated panels
- `surfaceSubtle`: quiet grouped sections
- `primary`: main accent
- `primaryStrong`: stronger accent variant for emphasis
- `onBackground`: primary text on background
- `onSurface`: primary text on surfaces
- `onSurfaceMuted`: secondary text
- `outline`: subtle separators and boundaries
- `success`, `warning`, `error`: system states only

### Light Theme Tokens

- `background`: soft off-white canvas
- `surface`: white or near-white content surface
- `surfaceRaised`: slightly darker or warmer card surface
- `surfaceSubtle`: grouped sections
- `primary`: same accent family as dark theme
- `primaryStrong`: stronger accent variant
- `onBackground`: primary text on background
- `onSurface`: primary text on surfaces
- `onSurfaceMuted`: secondary text
- `outline`: subtle boundaries only

### Color Usage Rules

- Background colors define whole-screen areas.
- Surfaces define cards, panels, sheets, and grouped content.
- Accent colors define action and importance.
- Status colors never replace brand accent.

---

## 6. Suggested Theme Direction

The app should use a **Tactile Editorial System**.

### Why this theme fits the product

- Works without images
- Scales across many feature types
- Fits discovery, lists, details, search, and future personalization
- Feels different from Google Maps and Uber by emphasizing curation and information hierarchy rather than transport-style utility

### Visual language

- Rounded rectangles
- Layered tonal surfaces
- Strong typography hierarchy
- Compact but breathable spacing
- Lightweight icons and signal badges

---

## 7. Typography System

Typography is the main identity driver since the app should not depend on imagery.

### Typeface Pairing

Use a clean, modern sans-serif system with strong readability.

Recommended pairing:

- **Display / headings**: Manrope
- **Body / UI text**: Inter

Fallbacks:

- `system-ui`
- `-apple-system`
- `Segoe UI`
- `Roboto`
- `Arial`

### Typography Principles

- Headings should be confident and clear.
- Body text should be highly readable.
- Labels should be compact and functional.
- Numbers, distance, rating, and metadata should have strong visual presence.

### Type Scale

#### Display

- `displayXL`: large hero statements
- `displayLG`: section hero headings
- `displayMD`: screen titles

#### Heading

- `headingLG`: place titles, important sections
- `headingMD`: card titles, subsection titles
- `headingSM`: compact headers

#### Body

- `bodyLG`: detailed descriptions
- `bodyMD`: standard interface copy
- `bodySM`: supporting text, helper content

#### Label / Caption

- `labelMD`: chips, tags, metadata
- `labelSM`: tertiary information

### Typography Rules

- Use large headings only when the screen needs a clear focal point.
- Never let body text compete with titles.
- Use fewer font weights, not more.
- Prefer spacing and scale over decorative text styles.
- Keep line height generous for body content.

### Text Hierarchy Example

1. Screen title
2. Key metric or primary action
3. Section heading
4. Card title
5. Body description
6. Metadata and labels

---

## 8. Layout System

### Layout Principles

- Mobile-first
- Strong vertical rhythm
- Clear section grouping
- Predictable padding
- Breathable spacing between blocks
- No cluttered edge-to-edge density unless the screen specifically requires it

### Spacing Scale

Use a consistent spacing system such as:

- 4
- 8
- 12
- 16
- 20
- 24
- 32
- 40
- 48

### Layout Rules

- Use generous outer padding on most screens.
- Keep card spacing consistent.
- Group related content with surface changes, not borders.
- Let important elements breathe.
- Use vertical section stacks rather than dense grids by default.

### Structure Pattern

Most screens should follow this pattern:

- top header
- primary action or summary
- main content blocks
- supporting sections
- bottom action area or navigation

---

## 9. Elevation and Surface System

Depth should come from layering, not from flashy shadows.

### Surface Levels

- `canvas`: app background
- `surface-1`: primary content area
- `surface-2`: cards and panels
- `surface-3`: drawers, modals, active cards
- `surface-4`: temporary overlays and floating actions

### Surface Rules

- Use surface contrast to show hierarchy.
- Avoid strong borders.
- Shadows should be soft and minimal.
- Raised elements should feel tactile, not floating artificially.

### Card Behavior

- Cards should sit clearly on the page.
- The content inside the card should dominate, not the container.
- Avoid unnecessary ornamentation.

---

## 10. Shape System

### Corner Radius

Use a consistent rounded geometry across the app.

Suggested radius levels:

- `xs`: small elements
- `sm`: inputs and small controls
- `md`: standard cards
- `lg`: feature cards and bottom sheets
- `xl`: hero cards and major containers
- `full`: pills and chips

### Shape Principles

- Do not mix sharp and soft styles randomly.
- Inputs, buttons, and cards should feel like part of the same family.
- Use pills only for chips and compact controls.

---

## 11. Component System

Build once, reuse everywhere.

### Core Components

- `AppButton`
- `AppInput`
- `AppText`
- `AppCard`
- `AppChip`
- `AppIcon`
- `AppAvatar`
- `AppDivider` only if absolutely necessary
- `AppScreen`
- `AppSection`
- `AppListItem`
- `AppEmptyState`
- `AppErrorState`
- `AppSkeleton`
- `AppBottomSheet`
- `AppBadge`

### Button Styles

#### Primary Button

Used for the main action on a screen.

- solid accent background
- strong text contrast
- medium height
- rounded corners
- clear loading state

#### Secondary Button

Used for alternate actions.

- surface background
- subtle border or tonal contrast
- same shape family as primary

#### Tertiary Button

Used for low-emphasis actions.

- text-only or near-text-only
- minimal visual weight

### Input Styles

- Single style family for all inputs
- Use surface fill, not underlines
- Clear label and helper text
- Strong focus state
- Visible error state

### Chip Styles

- Used for tags, filters, categories, and quick actions
- Active state must be obvious through color and surface change
- Inactive state should remain readable and restrained

### Card Styles

- Cards are the main content container
- Use them for places, lists, summaries, and details
- Every card should support a title, metadata, and optional action row

---

## 12. Content Presentation Without Images

Because the app may not always have rich media, the interface must work through structure and typography.

### Use these instead of images

- Strong titles
- Tags and chips
- Ratings and counts
- Distance and time labels
- Status indicators
- Short summaries
- Category hierarchy
- Compact metadata rows

### Content hierarchy on place cards

1. Place name
2. Rating / distance / category
3. Short description or vibe
4. Tags
5. Secondary actions

### Important

Do not make the app depend on photography for visual appeal. The system should still feel complete with text-only cards.

---

## 13. Navigation and Screen Structure

The app must feel like a product with multiple feature families, not a map tool.

### Navigation principles

- Use a stable bottom navigation structure for major areas.
- Use stacks for deeper flows.
- Use bottom sheets for quick filters and contextual actions.
- Use full screens for detail, auth, and high-focus tasks.

### Recommended sections

- Discover
- Search
- Saved
- Activity or Insights
- Profile

This keeps the app broader than a map experience and supports future expansion.

---

## 14. Discovery UI Principles

Discovery screens should prioritize decision-making.

### Show first

- Name
- Category
- Distance
- Activity signal or popularity
- Rating

### Show later

- Long descriptions
- Secondary metadata
- Deep details

### Discovery layout style

- Vertical lists for comparison
- Cards with dense but readable metadata
- Strong filters at the top
- Reusable quick actions

---

## 15. Dark Mode Rules

Dark mode should feel like the primary experience.

### Requirements

- Use deep, neutral backgrounds
- Use surfaces that are slightly lighter than the canvas
- Avoid pure black overload on every surface
- Keep accent visible without glowing too loudly
- Text contrast must remain high

### Dark Mode Look and Feel

- Focused
- Sophisticated
- Calm
- High contrast
- Low strain

---

## 16. Light Mode Rules

Light mode should not feel like a different product.

### Requirements

- Use warm or neutral off-white surfaces
- Preserve the same hierarchy as dark mode
- Avoid harsh pure-white glare across the whole interface
- Keep accent and spacing identical to dark mode
- Text and metadata must stay readable at all times

### Light Mode Look and Feel

- Clean
- Open
- Calm
- Structured
- Comfortable for long sessions

---

## 17. Color Usage by Meaning

### Accent Color

Use for:

- primary buttons
- active tabs
- selected chips
- key highlights
- important labels
- active indicators

### Surface Colors

Use for:

- screens
- cards
- sheets
- grouped content
- list blocks

### Text Colors

Use for:

- titles
- body copy
- metadata
- disabled labels
- helper text

### Status Colors

Use for:

- success messages
- warnings
- errors
- connection issues
- empty-state hints

Never use status colors as brand colors.

---

## 18. Interaction States

Every component should support clear states.

### Required states

- default
- pressed
- focused
- loading
- disabled
- selected
- error
- success

### State Rules

- Selected states should be obvious.
- Pressed states should feel tactile.
- Loading states should preserve layout.
- Disabled states should remain readable.
- Error states should be visible but not aggressive.

---

## 19. Motion System

Motion should support understanding, not distract from it.

### Motion Principles

- Fast and subtle
- Short transitions
- Avoid exaggerated bounce
- Use motion to confirm interactions and shift hierarchy

### Good Motion Use Cases

- screen transitions
- chip selection
- modal appearance
- loading state changes
- expanding detail sections

### Avoid

- unnecessary parallax
- flashy animations
- motion on every single component

---

## 20. Accessibility Rules

Accessibility is part of the design system, not an extra.

### Requirements

- Text must maintain sufficient contrast
- Touch targets must be large enough
- Controls must be distinguishable without color alone
- Focus states must be visible
- Error messages must be clear and actionable
- The app must remain usable with text-only content

---

## 21. Screen Design Rules

### Home / Explore

- Clear section heading
- Search entry point
- Filter chips
- Ranked place cards
- Signals like rating, distance, and activity

### Place Detail

- Strong place title
- Key metadata near the top
- Description and tags below
- Media optional, not required
- Reviews and related places as supporting sections

### Auth Screens

- Minimal layout
- Focus on form clarity
- No unnecessary decoration
- Keyboard-aware containers

### Saved / Profile Screens

- Simple structure
- Strong labels
- Summary cards and lists

---

## 22. Design Tokens

All components must use the token system.

### Token Categories

- colors
- typography
- spacing
- radius
- elevation
- opacity
- icon sizes
- motion duration

### Token Rules

- Tokens must be centralized.
- No component should own its own visual language.
- New visual patterns must be added to the system, not improvised in screens.

---

## 23. Do / Don’t

### Do

- Do keep content and structure first
- Do use one accent consistently
- Do make components reusable
- Do support both themes equally
- Do emphasize information hierarchy
- Do keep the app visually calm
- Do design for text-only scenarios

### Don’t

- Don’t depend on images for identity
- Don’t use glassmorphism
- Don’t use excessive borders
- Don’t mix too many colors
- Don’t create one-off components for each screen
- Don’t make the map the whole product identity
- Don’t overload the UI with animations

---

## 24. Final Product Feel

The app should feel like a curated discovery platform that is:

- easy to scan
- pleasant to use
- distinct from map/navigation apps
- structured enough for many future features
- visually strong even without photos

The identity should come from **typography, hierarchy, spacing, and signal design**, not from heavy imagery or decorative effects.

---

## 25. Implementation Plan (Frontend Execution)

This section converts the design system into an actionable frontend plan.

### Phase 1 — Foundations

- [ ] Setup theme provider (already present)
- [ ] Connect color tokens to styling system (NativeWind or StyleSheet)
- [ ] Define spacing scale constants
- [ ] Define typography scale (font sizes, weights, line heights)
- [ ] Create base `AppScreen` wrapper (safe area + padding)

### Phase 2 — Core Primitives

Build these first and do not move forward until they are stable:

- [ ] AppText
- [ ] AppButton (primary, secondary, tertiary)
- [ ] AppInput
- [ ] AppCard
- [ ] AppChip
- [ ] AppIconButton
- [ ] AppSection (title + spacing wrapper)

Rules:

- No screen should implement its own styling
- All UI must be composed from these primitives

### Phase 3 — Layout & Behavior Utilities

- [ ] Keyboard-aware container
- [ ] Scroll container with consistent padding
- [ ] Bottom sheet component
- [ ] Loading skeleton component
- [ ] Empty state component
- [ ] Error state component

### Phase 4 — Navigation Structure

- [ ] Setup navigation (stack + tabs)

- [ ] Define main sections:
  - Explore
  - Search
  - Saved
  - Profile

- [ ] Define route structure clearly

### Phase 5 — Screen Implementation Order

Build screens in this order:

1. Auth Screens
   - Login
   - Register

2. Explore Screen
   - List of places
   - Filter chips
   - Search entry

3. Place Detail Screen
   - Title
   - Metadata
   - Description
   - Tags

4. Filters Bottom Sheet

5. Media + Reviews Sections

6. Saved / Profile Screens

### Phase 6 — State & Data Integration

- [ ] API service layer (fetch wrapper)
- [ ] Auth state (token handling)
- [ ] Query hooks (React Query or custom)
- [ ] Error + loading handling

### Phase 7 — Polish

- [ ] Interaction states (pressed, loading, disabled)
- [ ] Accessibility checks
- [ ] Dark/light parity testing
- [ ] Spacing consistency audit

---

## 26. Component Naming Conventions

Use consistent naming to avoid chaos:

- Primitive: `AppButton`, `AppInput`
- Composite: `PlaceCard`, `ReviewCard`
- Layout: `Screen`, `Section`
- State: `EmptyState`, `ErrorState`, `LoadingState`

Avoid:

- `CustomButton1`
- `NewCard`
- `TempComponent`

---

## 27. Folder Structure (Frontend)

```text
app/
  screens/
    auth/
    explore/
    place/
    profile/
  components/
    primitives/
    composed/
  theme/
  hooks/
  services/
  utils/
  types/
```

---

## 28. Final Execution Rule

If a screen requires a new style:

→ Do NOT implement it inside the screen
→ Add it to the design system first

This ensures:

- consistency
- scalability
- maintainability

---

## 29. Definition of Done (Design)

A feature is only complete when:

- [ ] Uses only system components
- [ ] Works in dark and light mode
- [ ] Handles loading, error, empty states
- [ ] Has consistent spacing
- [ ] Has proper typography hierarchy
- [ ] Has no hardcoded colors or styles

---

## 30. Final Principle

The system should be strong enough that:

- You can build new screens without redesigning anything
- The UI still looks complete without images
- Every screen feels like part of the same product

If that is not true, the system is incomplete.
