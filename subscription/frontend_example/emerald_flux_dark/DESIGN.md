# Design System Specification: Obsidian Emerald

## 1. Overview & Creative North Star: "The Bioluminescent Gallery"

This design system is not a utility; it is a dark-room experience. Our Creative North Star is **The Bioluminescent Gallery**. Imagine a high-end, darkened exhibition space where the only light source comes from the art itself and subtle, glowing accents.

To move beyond the "standard dark mode" aesthetic, we utilize **Tonal Layering** and **Luminescent Accents**. We reject the rigid, boxed-in nature of traditional web grids in favor of a fluid, editorial layout that feels like a single, continuous surface. By prioritizing negative space and eliminating structural lines, we create an interface that feels expensive, quiet, and intentional.

---

### 2. Color & Surface Architecture

The palette is anchored in deep charcoals and an electric, organic green. 

#### The "No-Line" Rule
**Explicit Instruction:** Designers are prohibited from using 1px solid borders for sectioning. Boundaries must be defined solely through background color shifts. A `surface-container-low` section sitting on a `surface` background is the only way to define a container.

#### Surface Hierarchy & Nesting
Instead of a flat grid, treat the UI as a series of physical layers.
- **Base Layer:** `surface` (#121415) - The foundation.
- **Sectioning:** `surface-container-low` (#1A1C1D) - Use for large structural blocks.
- **Interactive Cards:** `surface-container` (#1E2021) - The default for clickable content.
- **Prominent Elevators:** `surface-container-high` (#282A2B) - For modals and flyouts.

#### The "Glass & Gradient" Rule
To add visual "soul," use Glassmorphism for floating elements (e.g., Navigation bars or hover states). 
- **Effect:** Apply `surface-container` at 70% opacity with a `24px` backdrop-blur.
- **Signature Texture:** Primary CTAs should not be flat. Apply a subtle linear gradient: `primary` (#45E17C) to `primary-container` (#07C160) at a 135-degree angle. This mimics the depth of a polished gemstone.

---

### 3. Typography: Editorial Authority

We use a dual-font strategy to balance high-fashion editorial with technical precision.

*   **Display & Headlines (Manrope):** Use these for storytelling. The wide apertures and geometric shapes of Manrope feel modern and authoritative.
    *   *Display-LG (3.5rem):* Use for hero moments only.
    *   *Headline-MD (1.75rem):* Use for section headers with generous leading.
*   **Body & Labels (Inter):** The workhorse. Inter provides maximum legibility at small sizes.
    *   *Body-LG (1rem):* Standard reading text.
    *   *Label-MD (0.75rem):* Used for secondary metadata in `on-surface-variant`.

**Hierarchy Tip:** Convey importance through scale and weight, never through color alone. High-contrast typography is the backbone of this system.

---

### 4. Elevation & Depth

We move away from the "drop shadow" era into the **Ambient Light** era.

*   **The Layering Principle:** Place a `surface-container-lowest` card on a `surface-container-low` section to create a soft, natural "recessed" look. Depth is achieved by stacking values, not adding shadows.
*   **Ambient Shadows:** For floating modals, use a shadow with a 40px blur, 0% spread, and 6% opacity. The shadow color should be tinted with our primary green (`#00210B`) to simulate the glow of the interface reflecting off the surface.
*   **The "Ghost Border" Fallback:** If a border is required for accessibility, use `outline-variant` at **15% opacity**. It should be felt, not seen.
*   **Roundedness:** Maintain the fluid aesthetic with a strict scale:
    *   **8px (DEFAULT):** Standard cards and input fields.
    *   **12px (MD):** Larger containers and featured sections.
    *   **Full (9999px):** Chips and Pill-buttons.

---

### 5. Component Guidelines

#### Buttons (The Glowing Core)
*   **Primary:** Gradient fill (`primary` to `primary-container`). Text: `on-primary` (#003917). No border.
*   **Secondary:** Ghost style. `surface-container-high` background. Text: `primary`.
*   **Tertiary:** No background. `label-md` bold text with a 2px underline in `primary` on hover.

#### Cards & Lists
*   **Strict Rule:** No dividers. Use `24px` or `32px` of vertical white space to separate list items. 
*   **Hover State:** Shift the background from `surface-container` to `surface-container-high`. Do not move the element (no "lift" animation); let the color transition do the work.

#### Input Fields
*   **Resting:** `surface-container-lowest` background with an 8px radius. 
*   **Focus:** Transition the background to `surface-container` and add a 1px "Ghost Border" at 40% opacity using the `primary` color.

#### Signature Component: The "Flux Tracker"
Use a progress indicator that utilizes a blurred glow (`primary` with a 4px outer glow) to represent active states. This reinforces the bioluminescent theme.

---

### 6. Do’s and Don’ts

#### Do
*   **Do** use asymmetrical margins (e.g., 5% left, 10% right) in editorial sections to break the "template" feel.
*   **Do** use `secondary-text` (#86868B) for all non-essential metadata to let the primary content breathe.
*   **Do** embrace negative space. If a layout feels crowded, remove a container before you reduce font size.

#### Don't
*   **Don't** use pure white (#FFFFFF). Use `on-background` (#E2E2E3) for high-contrast text to reduce eye strain.
*   **Don't** use 100% opaque borders. They create "visual noise" that kills the fluid aesthetic.
*   **Don't** use standard Material shadows. They are too grey and "muddy" for this high-end emerald palette.