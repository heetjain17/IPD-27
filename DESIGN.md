# Design System Strategy: The Luminescent Curator

## 1. Overview & Creative North Star
The "Creative North Star" for this design system is **The Luminescent Curator**. 

In a world of cluttered discovery apps, we lean into high-contrast editorial sophistication. This system moves away from "standard app" layouts by treating the screen as a high-end digital gallery. We achieve a premium feel through **intentional asymmetry** and **tonal depth**. Rather than rigid grids, we use fluid containers and overlapping elements to create a sense of movement. The "Luminescent" aspect comes from the #D9FF50 (Lime Green) primary accent, which acts as a precision laser, guiding the user's eye through a void of deep blacks and soft, glass-like surfaces.

## 2. Colors: Tonal Architecture
The palette is built on a foundation of absolute black to allow photography and our primary accent to "pop" with maximum vibrance.

### The "No-Line" Rule
**Explicit Instruction:** Do not use 1px solid borders to define sections. Boundaries must be created via background shifts. Use `surface-container-low` (#131313) sitting on a `surface` (#0e0e0e) background to define a zone. If you feel the need for a line, use white space from our spacing scale instead.

### Surface Hierarchy & Nesting
Treat the UI as physical layers of smoked glass.
*   **Deepest Layer:** `surface-container-lowest` (#000000) - Used for the main app canvas.
*   **Base Content Layer:** `surface` (#0e0e0e) - Used for primary page sections.
*   **Card/Component Layer:** `surface-container` (#191a1a) - The default for interactive containers.
*   **Elevated/Active Layer:** `surface-container-highest` (#262626) - For elements that need to feel "closer" to the user, like active cards or modals.

### The Glass & Gradient Rule
To achieve a "bespoke" rather than "templated" look, use Glassmorphism for floating navigation bars or filter chips. Apply a 20-40px backdrop blur with a semi-transparent `surface-variant` (#262626 at 60% opacity). Use subtle linear gradients on primary buttons, transitioning from `primary` (#d7fd4e) to `primary-container` (#a6c913) at a 135-degree angle to give the accent a metallic, high-end sheen.

## 3. Typography: Editorial Authority
The typography system uses a pairing of **Manrope** for high-impact display and **Inter** for functional legibility.

*   **Display (Manrope):** Set with tight letter-spacing (-0.04em) and bold weights. These are your "Editorial Statements." Use `display-lg` (3.5rem) to break the grid, allowing text to overlap images.
*   **Headline & Title (Manrope/Inter):** Used to establish hierarchy within location cards. High-priority information uses `on-surface` (#ffffff), while secondary metadata uses `on-surface-variant` (#adaaaa).
*   **Body (Inter):** Fixed at a generous 1.6 line-height. Never use pure white for long-form body text; use `on-surface` (#ffffff) but ensure it sits on a `surface` tier that provides comfortable contrast.
*   **Labels (Inter):** Small, all-caps, with increased letter-spacing (0.05em) to denote categories or tags, creating a "technical/premium" aesthetic.

## 4. Elevation & Depth: Tonal Layering
We reject the standard drop shadow. Depth is a result of light and transparency, not "ink" on a page.

*   **The Layering Principle:** Stack `surface-container-low` on `background`. Place a `surface-container-highest` card on top of that. This creates "Soft Natural Lift."
*   **Ambient Shadows:** For floating elements (e.g., a "Find Near Me" FAB), use a shadow with a 40px blur, 0% spread, and 6% opacity of `surface-tint`. It should feel like an atmospheric glow, not a shadow.
*   **The Ghost Border Fallback:** If accessibility requires a container definition on a dark background, use a "Ghost Border." Apply `outline-variant` (#484848) at 15% opacity. It should be felt, not seen.
*   **Glassmorphism Depth:** Always use a 1px inner-glow (a stroke with 10% white opacity) on the top and left edges of glass elements to simulate light catching the edge of the lens.

## 5. Components: Minimalist Primitives

### Buttons
*   **Primary:** Background: `primary` gradient. Shape: `xl` (3rem) or `full` (9999px). Text: `on-primary` (#4d5f00). No border.
*   **Secondary:** Background: `surface-container-highest`. Text: `on-surface`. Shape: `xl`.
*   **Tertiary:** No background. Text: `primary`. Used for low-emphasis discovery actions.

### Cards & Discovery Lists
*   **Rule:** Forbid divider lines. Use `spacing-8` (2.75rem) to separate card entities.
*   **Design:** Cards should use `roundedness-lg` (2rem). Imagery should be full-bleed with a subtle `surface-container-lowest` gradient overlay at the bottom to ensure `title-lg` text remains legible.

### Input Fields
*   **Style:** Minimalist. No bottom line or box. Use `surface-container-low` as a subtle background block with `roundedness-md` (1.5rem). 
*   **Active State:** The background remains the same, but the `label-md` shifts to `primary` (#d7fd4e).

### Chips (Location Filters)
*   **Filter Chips:** Semi-transparent `surface-variant` with a backdrop blur. When active, the background flips to `primary` and the text to `on-primary`.

## 6. Do’s and Don’ts

### Do
*   **Do** use asymmetrical margins (e.g., 24px left, 40px right) for header text to create an editorial, non-templated feel.
*   **Do** allow high-quality location photography to be the "hero," with UI elements floating over it using glassmorphism.
*   **Do** use the `primary` accent sparingly. It is a beacon, not a paint bucket.

### Don't
*   **Don’t** use 100% opaque, high-contrast borders. It breaks the "Luminescent" immersion.
*   **Don’t** use standard "Material" or "Human Interface" blue for links. Stick strictly to the `primary` or `secondary` tokens.
*   **Don’t** crowd the layout. If a screen feels full, increase the spacing scale values (move from `10` to `16`). Premium equals breathing room.