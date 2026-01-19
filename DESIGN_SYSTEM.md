# 🏛️ Nokhbat Almabani Design System

## Overview

This design system provides a comprehensive set of design tokens, components, and guidelines to ensure consistency across all Nokhbat Almabani projects. The system is built on a sophisticated color palette inspired by desert landscapes and architectural elegance, with full RTL (Right-to-Left) support for Arabic and English languages.

---

## 🎨 Color Palette

### Primary Colors

| Color Name        | Hex Value | Usage                    | Description                                  |
| ----------------- | --------- | ------------------------ | -------------------------------------------- |
| **Deep Black**    | `#131310` | Primary background, text | Main dark background color                   |
| **Desert Gold**   | `#C7B694` | Primary accent, buttons  | Signature gold color for CTAs and highlights |
| **Elegant White** | `#F1F1EE` | Primary text, cards      | Main text color and card backgrounds         |
| **Stone Gray**    | `#6F6F6C` | Secondary text, borders  | Secondary text and subtle borders            |
| **Obsidian**      | `#1D1D1B` | Dark surfaces, modals    | Dark surfaces and modal backgrounds          |

### Secondary Colors

| Color Name         | Hex Value | Usage           | Description                      |
| ------------------ | --------- | --------------- | -------------------------------- |
| **Warm Sand**      | `#D5C6A2` | Hover states    | Lighter gold for hover effects   |
| **Concrete Gray**  | `#A3A29F` | Disabled states | Muted gray for disabled elements |
| **Heritage Beige** | `#C5B89F` | Subtle accents  | Warm beige for subtle highlights |
| **Elite Black**    | `#1C1C1C` | Darker surfaces | Darker variant for depth         |

### Color Usage Guidelines

```css
/* Primary Actions */
.btn-primary {
  background-color: #c7b694; /* desert-gold */
  color: #131310; /* deep-black */
}

/* Secondary Actions */
.btn-secondary {
  background-color: rgba(111, 111, 108, 0.2); /* stone-gray/20 */
  color: #f1f1ee; /* elegant-white */
}

/* Text Hierarchy */
.text-primary {
  color: #f1f1ee;
} /* elegant-white */
.text-secondary {
  color: #6f6f6c;
} /* stone-gray */
.text-accent {
  color: #c7b694;
} /* desert-gold */

/* Backgrounds */
.bg-primary {
  background-color: #131310;
} /* deep-black */
.bg-card {
  background-color: #1d1d1b;
} /* obsidian */
.bg-surface {
  background-color: rgba(111, 111, 108, 0.1);
} /* stone-gray/10 */
```

---

## 🔤 Typography

### Font Family

- **Primary**: `Noto Kufi Arabic` - For Arabic text
- **Fallback**: `system-ui, arial` - For English text and fallbacks

### Font Weights

| Weight   | Value | Usage                   |
| -------- | ----- | ----------------------- |
| Regular  | `400` | Body text, descriptions |
| Medium   | `500` | Subheadings, labels     |
| SemiBold | `600` | Section headings        |
| Bold     | `700` | Main headings, CTAs     |

### Typography Scale

```css
/* Headings */
.text-h1 {
  font-size: 2.5rem;
  font-weight: 700;
  line-height: 1.2;
}
.text-h2 {
  font-size: 2rem;
  font-weight: 600;
  line-height: 1.3;
}
.text-h3 {
  font-size: 1.5rem;
  font-weight: 600;
  line-height: 1.4;
}
.text-h4 {
  font-size: 1.25rem;
  font-weight: 500;
  line-height: 1.4;
}

/* Body Text */
.text-body-lg {
  font-size: 1.125rem;
  font-weight: 400;
  line-height: 1.6;
}
.text-body {
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5;
}
.text-body-sm {
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.5;
}

/* Labels */
.text-label {
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 1.4;
}
.text-caption {
  font-size: 0.75rem;
  font-weight: 400;
  line-height: 1.4;
}
```

---

## 📐 Spacing System

### Base Unit

- **Base**: `4px` (0.25rem)
- **Scale**: 4px increments

### Spacing Scale

| Token      | Value  | Usage                               |
| ---------- | ------ | ----------------------------------- |
| `space-1`  | `4px`  | Tight spacing, icon padding         |
| `space-2`  | `8px`  | Small gaps, form field spacing      |
| `space-3`  | `12px` | Medium gaps, button padding         |
| `space-4`  | `16px` | Standard spacing, card padding      |
| `space-6`  | `24px` | Large gaps, section spacing         |
| `space-8`  | `32px` | Extra large gaps, page sections     |
| `space-12` | `48px` | Major spacing, component separation |
| `space-16` | `64px` | Hero spacing, large sections        |

---

## 🎯 Border Radius

| Token         | Value  | Usage                           |
| ------------- | ------ | ------------------------------- |
| `rounded-sm`  | `4px`  | Small elements, badges          |
| `rounded`     | `8px`  | Standard elements, buttons      |
| `rounded-lg`  | `12px` | Cards, modals                   |
| `rounded-xl`  | `16px` | Large cards, containers         |
| `rounded-2xl` | `24px` | Hero sections, major containers |

---

## 🌟 Shadows & Effects

### Box Shadows

```css
/* Subtle shadows */
.shadow-sm {
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}
.shadow {
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
}
.shadow-md {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}
.shadow-lg {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

/* Custom shadows */
.shadow-glow {
  box-shadow: 0 0 20px rgba(199, 182, 148, 0.5);
}
.shadow-glow-intense {
  box-shadow: 0 0 40px rgba(199, 182, 148, 0.8);
}
```

### Glassmorphism

```css
.glass {
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  background: rgba(19, 19, 16, 0.8);
  border: 1px solid rgba(199, 182, 148, 0.2);
}
```

---

## 🎭 Animations

### Keyframe Animations

```css
/* Float animation */
@keyframes float {
  0%,
  100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

/* Glow animation */
@keyframes glow {
  0%,
  100% {
    box-shadow: 0 0 20px rgba(199, 182, 148, 0.5);
  }
  50% {
    box-shadow: 0 0 40px rgba(199, 182, 148, 0.8);
  }
}

/* Slide animations */
@keyframes slideInFromRight {
  from {
    opacity: 0;
    transform: translateX(100px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideInFromLeft {
  from {
    opacity: 0;
    transform: translateX(-100px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
```

### Animation Classes

```css
.animate-float {
  animation: float 6s ease-in-out infinite;
}
.animate-glow {
  animation: glow 2s ease-in-out infinite;
}
.animate-slide-in-right {
  animation: slideInFromRight 0.6s ease-out;
}
.animate-slide-in-left {
  animation: slideInFromLeft 0.6s ease-out;
}
```

---

## 🧩 Component Patterns

### Buttons

#### Primary Button

```tsx
<Button className="bg-desert-gold text-deep-black hover:bg-warm-sand">
  Primary Action
</Button>
```

#### Secondary Button

```tsx
<Button
  variant="outline"
  className="border-stone-gray/30 bg-obsidian/50 text-elegant-white"
>
  Secondary Action
</Button>
```

#### Ghost Button

```tsx
<Button variant="ghost" className="text-elegant-white hover:bg-stone-gray/20">
  Ghost Action
</Button>
```

### Cards

#### Standard Card

```tsx
<div className="bg-obsidian/70 border border-desert-gold/20 rounded-xl p-6">
  <h3 className="text-lg font-semibold text-desert-gold mb-4">Card Title</h3>
  <p className="text-elegant-white/80">Card content goes here</p>
</div>
```

#### Glass Card

```tsx
<div className="glass rounded-xl p-6">
  <h3 className="text-lg font-semibold text-elegant-white mb-4">Glass Card</h3>
  <p className="text-elegant-white/80">Transparent card content</p>
</div>
```

### Form Fields

#### Input Field

```tsx
<FormField label="Field Label" required>
  <input
    type="text"
    className="w-full bg-stone-gray/10 border border-desert-gold/20 rounded-lg px-4 py-3 text-elegant-white placeholder-stone-gray focus:outline-none focus:border-desert-gold transition-colors duration-300"
    placeholder="Enter value"
  />
</FormField>
```

#### Select Field

```tsx
<FormField label="Select Field" required>
  <SelectContext
    options={options}
    value={value}
    onChange={setValue}
    placeholder="Select option"
    language={language}
  />
</FormField>
```

---

## 🌍 RTL Support

### Direction Context

```tsx
// Use the direction context for RTL support
const { language, isRTL } = useDirection();

// Apply RTL classes conditionally
<div
  className={`flex items-center space-x-4 ${
    isRTL ? "rtl:space-x-reverse" : ""
  }`}
>
  <Icon className="h-5 w-5" />
  <span>Text</span>
</div>;
```

### RTL-Specific Classes

```css
/* RTL spacing utilities */
.rtl:space-x-reverse {
  --tw-space-x-reverse: 1;
}
.rtl:space-x-4 > :not([hidden]) ~ :not([hidden]) {
  --tw-space-x-reverse: 1;
  margin-right: calc(1rem * var(--tw-space-x-reverse));
  margin-left: calc(1rem * calc(1 - var(--tw-space-x-reverse)));
}

/* RTL text alignment */
.text-right-rtl {
  text-align: right;
}
.text-left-rtl {
  text-align: left;
}
```

---

## 📱 Responsive Design

### Breakpoints

| Breakpoint | Min Width | Usage         |
| ---------- | --------- | ------------- |
| `sm`       | `640px`   | Small tablets |
| `md`       | `768px`   | Tablets       |
| `lg`       | `1024px`  | Laptops       |
| `xl`       | `1280px`  | Desktops      |
| `2xl`      | `1536px`  | Large screens |

### Responsive Patterns

```tsx
// Grid layouts
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* Content */}
</div>

// Responsive text
<h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-elegant-white">
  Responsive Heading
</h1>

// Responsive spacing
<div className="p-4 md:p-6 lg:p-8">
  {/* Content */}
</div>
```

---

## 🎨 Design Tokens

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-deep-black: #131310;
  --color-desert-gold: #c7b694;
  --color-elegant-white: #f1f1ee;
  --color-stone-gray: #6f6f6c;
  --color-obsidian: #1d1d1b;

  /* Spacing */
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-6: 1.5rem;
  --space-8: 2rem;

  /* Typography */
  --font-family-primary: "Noto Kufi Arabic", sans-serif;
  --font-size-xs: 0.75rem;
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;
  --font-size-xl: 1.25rem;

  /* Border radius */
  --radius-sm: 0.25rem;
  --radius: 0.5rem;
  --radius-lg: 0.75rem;
  --radius-xl: 1rem;
}
```

---

## 🛠️ Implementation Guidelines

### 1. Color Usage

- Always use semantic color names instead of hex values
- Use opacity modifiers for transparency (e.g., `stone-gray/20`)
- Maintain contrast ratios for accessibility

### 2. Typography

- Use the defined font weights and sizes
- Maintain proper line heights for readability
- Support both Arabic and English text

### 3. Spacing

- Use the 4px base unit system
- Be consistent with spacing patterns
- Use responsive spacing utilities

### 4. Components

- Follow the established component patterns
- Use semantic HTML elements
- Implement proper accessibility attributes

### 5. RTL Support

- Always consider RTL layouts
- Use the direction context for language-specific behavior
- Test with both Arabic and English content

---

## 📚 Resources

### Tools

- **Tailwind CSS**: Primary utility framework
- **Framer Motion**: Animation library
- **Radix UI**: Accessible component primitives
- **Class Variance Authority**: Component variant management

### Design Principles

1. **Consistency**: Maintain visual and functional consistency
2. **Accessibility**: Ensure WCAG 2.1 AA compliance
3. **Performance**: Optimize for fast loading and smooth interactions
4. **Scalability**: Design for growth and maintenance
5. **Cultural Sensitivity**: Respect Arabic and English language requirements

---

## 🔄 Version History

- **v1.0.0** - Initial design system implementation
- **v1.1.0** - Added RTL support and enhanced typography
- **v1.2.0** - Implemented glassmorphism effects and animations
- **v1.3.0** - Enhanced component patterns and responsive design

---

_This design system is maintained by the Nokhbat Almabani development team. For questions or contributions, please contact the design team._
