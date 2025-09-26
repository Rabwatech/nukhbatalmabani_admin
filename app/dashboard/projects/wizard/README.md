# Nukhbat Almabani Project Wizard

## Overview

This is a comprehensive multi-step wizard for creating real estate projects in the Nukhbat Almabani admin panel. The wizard replaces the old monolithic form with a user-friendly, step-by-step interface.

## Features

### ✅ Implemented

- **Step 1: Basic Information** - Complete with bilingual support (Arabic/English)
- **Multi-step navigation** with progress tracking
- **Auto-save functionality** every 30 seconds
- **Form validation** using Zod schemas
- **RTL support** for Arabic language
- **Responsive design** for mobile and desktop
- **Draft management** with localStorage persistence
- **State management** using Zustand

### 🚧 Coming Soon

- **Step 2: Media & Visual Content** - File upload system
- **Step 3: Buildings Configuration** - Building and floor management
- **Step 4: Unit Management** - Unit configuration with Excel import/export
- **Step 5: Features & Amenities** - Feature management system
- **Step 6: Investment & Pricing** - Pricing strategies and payment plans
- **Step 7: Owners Associations** - Association management
- **Step 8: Review & Publish** - Final review and publishing workflow

## Architecture

### File Structure

```
wizard/
├── ProjectWizard.tsx          # Main wizard component
├── types.ts                   # TypeScript interfaces
├── validation.ts              # Zod validation schemas
├── store.ts                   # Zustand state management
├── StepBasicInfo.tsx          # Step 1: Basic Information
├── StepMedia.tsx              # Step 2: Media (placeholder)
├── StepBuildings.tsx          # Step 3: Buildings (placeholder)
├── StepUnits.tsx              # Step 4: Units (placeholder)
├── StepFeatures.tsx           # Step 5: Features (placeholder)
├── StepPricing.tsx            # Step 6: Pricing (placeholder)
├── StepAssociations.tsx       # Step 7: Associations (placeholder)
├── StepReview.tsx             # Step 8: Review (placeholder)
└── README.md                  # This file
```

### Key Components

#### ProjectWizard.tsx

- Main wizard container with navigation
- Progress tracking and step management
- Auto-save functionality
- Form submission handling

#### types.ts

- Comprehensive TypeScript interfaces for all wizard data
- Bilingual field support
- Validation-ready data structures

#### validation.ts

- Zod schemas for each step
- Step-by-step validation
- Error handling and user feedback

#### store.ts

- Zustand store for wizard state
- Draft management with localStorage
- Step completion tracking

## Usage

### Accessing the Wizard

1. Navigate to `/dashboard/projects`
2. Click "مشروع جديد (معالج)" / "New Project (Wizard)" button
3. The wizard will open at `/dashboard/projects/create`

### Navigation

- Use the step indicators at the top to jump between steps
- Previous/Next buttons for sequential navigation
- Progress bar shows completion status
- Auto-save every 30 seconds

### Data Persistence

- Drafts are automatically saved to localStorage
- Drafts expire after 30 days
- Manual save button available
- Data persists between browser sessions

## Technical Details

### Dependencies

- **React Hook Form** - Form management and validation
- **Zod** - Schema validation
- **Zustand** - State management
- **Framer Motion** - Animations and transitions
- **Tailwind CSS** - Styling

### Browser Support

- Chrome (last 2 versions)
- Safari (last 2 versions)
- Edge (last 2 versions)
- Firefox (last 2 versions)

### Performance Features

- Lazy loading of step components
- Optimized re-renders with React Hook Form
- Efficient state updates with Zustand
- Minimal bundle size impact

## Customization

### Adding New Steps

1. Create new step component in `wizard/` directory
2. Add step to `STEPS` array in `ProjectWizard.tsx`
3. Update types in `types.ts`
4. Add validation schema in `validation.ts`
5. Update store actions if needed

### Modifying Existing Steps

1. Edit the step component file
2. Update corresponding types and validation
3. Test with different data scenarios

### Styling

- Uses Tailwind CSS with custom color scheme
- Heritage Beige (#C5B89F) as primary color
- Elite Black (#1C1C1C) for text
- Responsive design with mobile-first approach

## Future Enhancements

### Phase 2: Media Management

- Drag & drop file upload
- Image optimization and compression
- Video upload and processing
- Document management system

### Phase 3: Building & Unit Management

- Visual building configuration
- Floor plan editor
- Unit grid management
- Excel import/export functionality

### Phase 4: Advanced Features

- Google Maps integration
- Real-time collaboration
- Advanced analytics
- Mobile app integration

## Troubleshooting

### Common Issues

#### Form Validation Errors

- Check that all required fields are filled
- Ensure data types match expected formats
- Review validation schemas in `validation.ts`

#### Draft Loading Issues

- Clear browser localStorage if drafts are corrupted
- Check browser console for errors
- Verify Zustand store configuration

#### RTL Layout Problems

- Ensure `DirectionContext` is properly configured
- Check CSS direction properties
- Verify Arabic text rendering

### Debug Mode

Enable debug logging by setting `console.log` statements in the store actions.

## Contributing

When adding new features:

1. Follow the existing code structure
2. Maintain bilingual support
3. Add proper TypeScript types
4. Include validation schemas
5. Test with both Arabic and English
6. Ensure mobile responsiveness

## License

This project is part of the Nukhbat Almabani real estate management system.
