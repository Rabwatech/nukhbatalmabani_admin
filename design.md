Theme-Ligh-Dark

Theme Modes: Light & Dark

- **Theme Support:**  
  - The design system supports both light and dark modes, switchable via a theme toggle (see `ThemeProvider` in your codebase).
  - All components, backgrounds, text, and borders adapt their colors based on the active theme.

- **Light Mode:**  
  - **Backgrounds:** `bg-white`, `bg-gray-50`
  - **Text:** `text-gray-900` for primary, `text-gray-600` for secondary
  - **Cards/Modals:** White background, subtle shadow, light borders
  - **Inputs:** `bg-gray-50`, `border-gray-200`, dark text
  - **Buttons:** Primary color backgrounds, white text

- **Dark Mode:**  
  - **Backgrounds:** `bg-gray-900`, `bg-gray-800`
  - **Text:** `text-white` for primary, `text-gray-300` for secondary
  - **Cards/Modals:** `bg-gray-800`, `border-gray-700`, subtle shadow
  - **Inputs:** `bg-gray-800`, `border-gray-700`, light text
  - **Buttons:** Primary color backgrounds, dark text or white text depending on contrast

- **Accent & Status Colors:**  
  - Accent colors (e.g., `primary-blue`, `accent-green`, `accent-red`) are adjusted for sufficient contrast in both modes.
  - Status badges and alerts use theme-aware backgrounds and text for visibility.

- **Transitions:**  
  - Smooth transitions (`transition-colors duration-300`) are used when switching between modes for a polished user experience.

- **Accessibility:**  
  - Both modes maintain sufficient color contrast for readability and accessibility.
  - Focus states and interactive elements remain visible and clear in both themes.

---

## Usage

- **Replicate this system for all maintenance portal screens and modals.**
- **Always use the shared FormField, DataTable, Modal, and StatusBadge components.**
- **Maintain spacing, color, and typography as described.**
- **Test on all device sizes and in both light and dark modes for perfect responsiveness and accessibility.**


