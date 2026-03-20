# Design System Specification: The Obsidian Pulse

## 1. Overview & Creative North Star
**Creative North Star: "The Neon Observatory"**
This design system moves away from the sterile, flat "SaaS dashboard" aesthetic in favor of a deep, cinematic environment. It is designed to feel like a high-end command center—where data isn't just displayed, but "glows" against an infinite obsidian void. 

To break the "template" look, we utilize **Intentional Asymmetry**. Dashboards should not be perfectly balanced; use varying column widths and "floating" data modules that overlap the background grid. This creates a sense of specialized, professional equipment rather than a generic webpage.

---

## 2. Colors & Surface Architecture
The palette is rooted in deep space neutrals, punctuated by high-chroma data accents.

### Core Palette (Material Convention)
*   **Surface:** `#0E1322` (The foundation)
*   **Primary:** `#D2BBFF` (Text/Icon accents) | **Primary Container:** `#7C3AED` (Action backgrounds)
*   **Secondary:** `#5DE6FF` (Highlight/Cyan)
*   **Tertiary:** `#FFAFD3` (Hot Pink Chart Accent)
*   **Error:** `#FFB4AB` | **Critical:** `#EF4444`

### The "No-Line" Rule
**Strict Mandate:** Prohibit the use of 1px solid borders for sectioning. Structural definition must be achieved through:
1.  **Tonal Shifts:** Placing a `surface-container-high` (`#25293A`) element against the `surface` background.
2.  **Negative Space:** Using the `spacing-8` (2rem) scale to create air between functional groups.

### The "Glass & Gradient" Rule
To add "soul," CTAs and Hero moments should utilize a **Pulse Gradient**: A linear transition from `primary_container` (#7C3AED) to a slightly desaturated version of `secondary` (#22D3EE) at a 135-degree angle. Floating menus must use **Backdrop Blur (12px)** with a 60% opacity on the surface color to create a "frosted obsidian" feel.

---

## 3. Typography: Editorial Authority
We use **Manrope** for its geometric precision and modern legibility.

*   **Display & Headlines:** Must use `primary_container` (#7C3AED). Use `display-lg` for hero metrics to create an "editorial" impact.
*   **Contrast Pairing:** Pair bold `headline-md` titles with `body-sm` in `on_surface_variant` (#CCC3D8) for metadata. This high-contrast scale creates a hierarchy of "Data vs. Context."
*   **The "Violet Header" Rule:** All major section headings must be Violet (#7C3AED) to anchor the brand identity across every page.

---

## 4. Elevation & Depth: Tonal Layering
Traditional shadows are too heavy for an obsidian UI. We use light to define height.

*   **The Layering Principle:** 
    *   **Level 0 (Floor):** `surface` (#0E1322) with a 5% opacity graph-paper grid.
    *   **Level 1 (Sections):** `surface_container_low` (#161B2B).
    *   **Level 2 (Cards):** `surface_container` (#1A1F2F) with a `12px` radius and a faint grid overlay.
*   **Ambient Glow:** For "floating" states (e.g., active modals), use a shadow with a `32px` blur, 8% opacity, tinted with `primary` (#D2BBFF). This mimics the light emitted from the screen rather than a physical shadow.
*   **The Ghost Border:** For accessibility on inputs, use `outline_variant` at 15% opacity. It should be felt, not seen.

---

## 5. Components & Interface Patterns

### Buttons (The Kinetic Trigger)
*   **Primary:** Background `primary_container` (#7C3AED). Text `on_primary_container`. `12px` (0.75rem) corner radius. On hover, add a subtle cyan outer glow.
*   **Secondary:** Ghost style. No background. `primary` text. `outline` at 20% opacity on hover.

### Cards & Data Modules
*   **Strict Rule:** No dividers. Use `spacing-4` (1rem) as a vertical gutter between list items. 
*   **Texture:** Cards must feature a "Faint Grid Overlay"—a repeating 20px grid pattern at 3% opacity to maintain the "Graph" aesthetic.

### Data Visualization
*   **The Logo Signature:** The 4-bar rising logo (Violet-Cyan-Green) defines the chart palette.
*   **Success/Critical:** Use `success` (#34D399) and `critical` (#EF4444) for status only.
*   **Chart Accents:** Use `tertiary` (Hot Pink) and `bright yellow` for secondary data series to ensure high contrast against the obsidian background.

### Input Fields
*   **Base:** `surface_container_lowest` (#090E1C).
*   **Active State:** The bottom border transforms into a 2px gradient line (Purple to Cyan). This replaces the standard "box glow."

---

## 6. Do’s and Don'ts

### Do:
*   **Do** allow elements to "bleed" off the edge of containers to suggest a larger data canvas.
*   **Do** use `primary_fixed_dim` (#D2BBFF) for icons to ensure they "pop" against dark surfaces.
*   **Do** use asymmetrical layouts (e.g., a 70/30 split) for dashboard views.

### Don’t:
*   **Don't** use pure black (#000000). It kills the depth provided by the obsidian tones.
*   **Don't** use 100% opaque white for body text. Use `on_surface_variant` (#CCC3D8) to reduce eye strain.
*   **Don't** use sharp 90-degree corners. Everything must adhere to the `0.75rem` (12px) radius to maintain a "premium-tech" softness.
*   **Don't** use standard "drop shadows." If it doesn't look like light is emitting from the component, don't use it.