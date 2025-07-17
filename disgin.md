# MDC Profile: Admin Panel Customer Page Design System

## 1. Overall Design Language
- **Theme:** Modern, clean, and professional with a dark background (`bg-obsidian`, `bg-stone-gray/10`), gold accents (`desert-gold`), and white/gray text.
- **Typography:** 
  - Headings: Bold, large, and white (`text-elegant-white`, `font-bold`).
  - Labels: Small, medium weight, stone-gray (`text-stone-gray`, `text-sm`, `font-medium`).
  - Body: White or stone-gray, with clear hierarchy.
- **Borders & Rounding:** 
  - All cards, modals, and input fields have rounded corners (`rounded-lg` or `rounded-xl`).
  - Subtle borders using gold with opacity (`border-desert-gold/20`).
- **Spacing:** 
  - Generous padding (`p-4`, `p-6`) and gaps (`gap-4`, `gap-6`) between elements.
  - Consistent vertical rhythm (`space-y-4`, `space-y-6`).

---

## 2. Structure & Layout
- **Header:** 
  - Flexbox layout, responsive between column and row.
  - Title left-aligned (or right in RTL), subtitle below.
  - Action button (e.g., "Add Customer") on the opposite side, styled as a primary button.

- **Filter Bar:** 
  - Card-style container with background blur and border.
  - Grid layout for filters: `grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4`.
  - Each filter uses a label above a styled select/input.

- **Tabs:** 
  - Horizontal navigation with underline for active tab.
  - Responsive overflow for many tabs.

- **Data Table:** 
  - Uses a shared DataTable component.
  - Table headers: uppercase, small, stone-gray.
  - Table rows: hover effect, alternating backgrounds.
  - Action icons: always in a flex row, with hover color transitions.

- **Modals/Popups:** 
  - Modal background: dark, with border and rounded corners.
  - Modal header: bold, white, with close icon.
  - Modal content: padded, with sections separated by background and border.
  - Forms: grid-based, two columns on desktop, one on mobile.
  - Section headers: gold, bold, with spacing above.
  - Action buttons: right-aligned, primary and secondary styles.

---

## 3. Form & Input Styles
- **FormField Component:** 
  - Label above input, right-aligned in Arabic.
  - Required asterisk in red.
  - Error message below input in red.
- **Inputs/Selects/Textareas:** 
  - Full width, background `bg-stone-gray/10`, border `border-desert-gold/20`, rounded, padding `px-4 py-3`.
  - Placeholder: stone-gray.
  - Focus: border color changes to gold.
  - Disabled/read-only: gray text, cursor-not-allowed.
- **Dropdowns:** 
  - Custom arrow, same border and background as inputs.
  - Option backgrounds: `bg-obsidian`.

---

## 4. Buttons & Icons
- **Primary Button:** 
  - `bg-desert-gold text-deep-black px-6 py-3 rounded-lg font-medium hover:bg-warm-sand transition-all duration-300`
- **Secondary Button:** 
  - `border border-desert-gold/20 text-stone-gray rounded-lg hover:bg-stone-gray/10`
- **Icon Buttons:** 
  - `p-2 text-stone-gray hover:text-desert-gold hover:bg-desert-gold/10 rounded-lg transition-all duration-200`
- **Action Icons:** 
  - Use Lucide icons, 20px, consistent spacing (`space-x-2 rtl:space-x-reverse`).

---

## 5. Responsiveness
- **Grid Layouts:** 
  - Use `grid-cols-1` on mobile, `md:grid-cols-2`, `lg:grid-cols-4` for filters and forms.
- **Flex Layouts:** 
  - Headers and action bars use `flex-col sm:flex-row` for stacking on small screens.
- **Tables:** 
  - `overflow-x-auto` for horizontal scrolling on small screens.
- **Modals:** 
  - `max-w-md`, `max-w-2xl`, `max-w-4xl`, etc., for different modal sizes.
- **Padding & Gaps:** 
  - Use responsive padding and gap utilities to ensure comfortable spacing on all devices.

---

## 6. Color Palette
- **Backgrounds:** 
  - `bg-obsidian`, `bg-stone-gray/10`
- **Accents:** 
  - `desert-gold` for highlights, borders, and primary actions.
- **Text:** 
  - `text-elegant-white`, `text-stone-gray`
- **Status Badges:** 
  - Use color-coded badges for status (info, warning, success, error).

---

## 7. Accessibility & RTL
- **RTL Support:** 
  - All layouts, paddings, and spacings use `rtl:space-x-reverse` and `isRTL` context.
- **Labels:** 
  - Always associated with inputs for accessibility.
- **Contrast:** 
  - Sufficient contrast between text and backgrounds.

---

## 8. Sectioning & Hierarchy
- **Section Headers:** 
  - Gold, bold, spaced above content.
- **Cards/Sections:** 
  - Use background, border, and padding to visually separate sections.

---

## 9. Device Adaptivity
- **Mobile:** 
  - Single-column layouts, full-width buttons, scrollable tables.
- **Tablet:** 
  - Two-column grids for forms and filters.
- **Desktop/Laptop:** 
  - Multi-column grids, side-by-side layouts.
- **Large Monitors:** 
  - Max-width containers, increased spacing, larger modals.

---

## Usage

- **Replicate this system for all admin panel screens and modals.**
- **Always use the shared FormField, DataTable, Modal, and StatusBadge components.**
- **Maintain spacing, color, and typography as described.**
- **Test on all device sizes for perfect responsiveness.**

---

**This MDC profile can be used as a reference for AI or developers to ensure all new features and screens match the established design system, providing a seamless, professional, and accessible user experience across all devices.**
