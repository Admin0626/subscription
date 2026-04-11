# Design System Document: The Fluid Minimalist

## 1. Overview & Creative North Star
The "Fluid Minimalist" is our design system’s response to the ubiquity of WeChat Mini Programs. While most apps in this ecosystem rely on rigid grids and heavy borders, this system adopts the **"Digital Curator"** philosophy. 

Our North Star is **intentionality through subtraction.** We break the "template" look by utilizing generous white space (negative space) as a structural element rather than a void. By moving away from traditional boxes and adopting tonal layering, we create an interface that feels like a premium editorial spread—sophisticated, breathable, and calm.

## 2. Colors: Tonal Architecture
The palette is rooted in the WeChat ecosystem but elevated through a Material 3-inspired tonal range. We move beyond flat green to a system of depth.

### The "No-Line" Rule
**Explicit Instruction:** Designers are prohibited from using 1px solid borders for sectioning content. Boundaries must be defined through background color shifts. Use `surface_container_low` for sections sitting on a `surface` background. The eye should perceive change through tone, not a "stroke."

### Surface Hierarchy & Nesting
Treat the UI as physical layers of fine paper. 
*   **Base:** `surface` (#f9f9fb)
*   **Sections:** `surface_container_low` (#f3f3f5)
*   **Interactive Cards:** `surface_container_lowest` (#ffffff)
*   **Floating Elements:** Use `surface_bright` with Glassmorphism (80% opacity + 20px backdrop blur).

### Signature Textures
Main CTAs and Hero sections should not be flat. Use a subtle linear gradient (135°) from `primary` (#006d33) to `primary_container` (#07c160). This adds a "soul" to the primary touchpoints that standard hex codes cannot provide.

## 3. Typography: Editorial Hierarchy
We use **Inter** for its mathematical precision. The hierarchy is designed to lead the eye through an editorial flow rather than a list of data.

*   **Display (lg/md/sm):** Reserved for hero moments. Use `display-md` (2.75rem) for high-impact welcome screens.
*   **Headline (lg/md/sm):** Your primary navigational anchors. Use `headline-sm` (1.5rem) for section titles to establish authority without crowding the screen.
*   **Body (lg/md):** The workhorse. `body-lg` (1rem) for primary content, ensuring high legibility for the diverse WeChat user base.
*   **Label (md/sm):** Used for micro-copy and metadata. Keep these tight and always in `on_surface_variant` to maintain hierarchy.

**Rule:** Always pair a `headline-sm` with a `body-md` to create high-contrast groupings. The large gap in size creates the "premium" feel.

## 4. Elevation & Depth: The Layering Principle
We reject the standard "drop shadow." We create depth through light and environment.

*   **Tonal Layering:** To lift a card, place a `surface_container_lowest` (White) element on a `surface_container_low` background. This provides a natural, soft lift.
*   **Ambient Shadows:** If a floating action requires a shadow, it must be diffused.
    *   *Blur:* 24px - 32px
    *   *Opacity:* 4-6%
    *   *Color:* Tinted with `on_surface` (#1a1c1d) to mimic natural light, never pure black.
*   **The Ghost Border:** If a border is required for accessibility, use `outline_variant` at **15% opacity**. It should be felt, not seen.
*   **Glassmorphism:** Navigation bars and sticky headers must use `surface` at 85% opacity with a `backdrop-filter: blur(15px)`. This integrates the content as it scrolls under the header.

## 5. Components

### Buttons
*   **Primary:** Rounded `md` (0.75rem). Gradient background (`primary` to `primary_container`). White text.
*   **Secondary:** No background. `outline` at 20% opacity. `primary` text color.
*   **Tertiary:** No background or border. `primary` text. Used for low-emphasis actions.

### Cards & Lists
*   **Forbid Divider Lines.** Use `16px` or `24px` of vertical white space to separate list items.
*   **Cards:** Use `md` (12px) border radius. Use the "Layering Principle" (White on light gray) instead of shadows for standard cards.

### Input Fields
*   **State:** Default state uses `surface_container_high` as a background.
*   **Focus:** Transition background to `surface_container_lowest` and add a 1px `primary` Ghost Border (20% opacity).

### Specialized Mini Program Components
*   **The Service Plate:** A large, nested `surface_container_highest` container used to group related Mini Program services, creating a "dashboard" feel within a scrollable page.
*   **Progressive Loading Shimmers:** Use a gradient animation from `surface_container` to `surface_container_high` for a premium skeleton screen experience.

## 6. Do’s and Don’ts

### Do:
*   **Embrace the Edge:** Use the `16px` side padding religiously to create a consistent vertical "spine" for the app.
*   **Use Asymmetry:** Place headline text on the left with significant white space on the right to create an editorial look.
*   **Prioritize Breathing Room:** If in doubt, add 8px more padding.

### Don’t:
*   **Don't Use Pure Black:** Never use #000000. Use `on_surface` (#1a1c1d) for all text to keep the "Soft Minimalist" vibe.
*   **Don't Use Standard Grids:** Avoid the 4-column icon grid common in WeChat. Try a 2-column staggered layout or a horizontal scroll to break the template feel.
*   **No Heavy Borders:** Never use a 100% opaque border to separate content sections. Use background tonal shifts.