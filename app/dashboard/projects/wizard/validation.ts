import { z } from 'zod';

// Basic Info Validation
const basicInfoSchema = z.object({
  name: z.object({
    ar: z.string().min(1, 'Arabic name is required'),
    en: z.string().min(1, 'English name is required'),
  }),
  description: z.object({
    ar: z.string().min(10, 'Arabic description must be at least 10 characters'),
    en: z.string().min(10, 'English description must be at least 10 characters'),
  }),
  location: z.object({
    ar: z.string().min(1, 'Arabic location is required'),
    en: z.string().min(1, 'English location is required'),
  }),
  city: z.string().min(1, 'City is required'),
  district: z.string().min(1, 'District is required'),
  address: z.string().min(1, 'Address is required'),
  coordinates: z.object({
    lat: z.number().min(-90).max(90),
    lng: z.number().min(-180).max(180),
  }).optional(),
  developer: z.string().min(1, 'Developer is required'),
  licenseNumber: z.string().min(1, 'License number is required'),
  totalArea: z.number().min(1, 'Total area must be greater than 0'),
  landArea: z.number().min(1, 'Land area must be greater than 0'),
  projectType: z.enum(['residential', 'commercial', 'mixed']),
  status: z.enum(['planning', 'under_construction', 'completed', 'sold_out']),
});

// Media Validation
const mediaSchema = z.object({
  images: z.array(z.instanceof(File)).min(1, 'At least one image is required'),
  videos: z.array(z.instanceof(File)).optional(),
  virtualTour: z.string().url().optional(),
  floorPlans: z.array(z.instanceof(File)).optional(),
  brochures: z.array(z.instanceof(File)).optional(),
});

// Buildings Validation
const buildingSchema = z.object({
  id: z.string(),
  name: z.object({
    ar: z.string().min(1, 'Arabic building name is required'),
    en: z.string().min(1, 'English building name is required'),
  }),
  floors: z.number().min(1, 'Number of floors must be at least 1'),
  unitsPerFloor: z.number().min(1, 'Units per floor must be at least 1'),
  totalUnits: z.number().min(1, 'Total units must be at least 1'),
  buildingType: z.enum(['residential', 'commercial', 'mixed']),
  features: z.array(z.string()),
});

const buildingsSchema = z.object({
  buildings: z.array(buildingSchema).min(1, 'At least one building is required'),
});

// Units Validation
const unitTypeSchema = z.object({
  id: z.string(),
  name: z.object({
    ar: z.string().min(1, 'Arabic unit name is required'),
    en: z.string().min(1, 'English unit name is required'),
  }),
  size: z.number().min(1, 'Unit size must be greater than 0'),
  rooms: z.number().min(0, 'Room count cannot be negative'),
  bathrooms: z.number().min(0, 'Bathroom count cannot be negative'),
  balconies: z.number().min(0, 'Balcony count cannot be negative'),
  floor: z.number().min(0, 'Floor number cannot be negative'),
  buildingId: z.string().min(1, 'Building ID is required'),
  price: z.number().min(0, 'Price cannot be negative'),
  currency: z.enum(['SAR', 'USD', 'EUR']),
  unitNumber: z.string().min(1, 'Unit number is required'),
  direction: z.enum(['north', 'south', 'east', 'west']),
  view: z.enum(['city', 'sea', 'garden', 'other']),
  features: z.array(z.string()),
  status: z.enum(['available', 'reserved', 'sold']),
});

const unitsSchema = z.object({
  unitTypes: z.array(unitTypeSchema).min(1, 'At least one unit type is required'),
});

// Features Validation
const amenitySchema = z.object({
  id: z.string(),
  name: z.object({
    ar: z.string().min(1, 'Arabic amenity name is required'),
    en: z.string().min(1, 'English amenity name is required'),
  }),
  description: z.object({
    ar: z.string().min(1, 'Arabic amenity description is required'),
    en: z.string().min(1, 'English amenity description is required'),
  }),
  category: z.enum(['security', 'recreation', 'commercial', 'transportation', 'other']),
  icon: z.string().min(1, 'Icon is required'),
  isAvailable: z.boolean(),
});

const serviceSchema = z.object({
  id: z.string(),
  name: z.object({
    ar: z.string().min(1, 'Arabic service name is required'),
    en: z.string().min(1, 'English service name is required'),
  }),
  description: z.object({
    ar: z.string().min(1, 'Arabic service description is required'),
    en: z.string().min(1, 'English service description is required'),
  }),
  price: z.number().min(0, 'Service price cannot be negative'),
  currency: z.enum(['SAR', 'USD', 'EUR']),
  billingCycle: z.enum(['monthly', 'yearly', 'one_time']),
  isIncluded: z.boolean(),
});

const featuresSchema = z.object({
  amenities: z.array(amenitySchema),
  services: z.array(serviceSchema),
});

// Pricing Validation
const paymentPlanSchema = z.object({
  id: z.string(),
  name: z.object({
    ar: z.string().min(1, 'Arabic payment plan name is required'),
    en: z.string().min(1, 'English payment plan name is required'),
  }),
  description: z.object({
    ar: z.string().min(1, 'Arabic payment plan description is required'),
    en: z.string().min(1, 'English payment plan description is required'),
  }),
  downPayment: z.number().min(0, 'Down payment cannot be negative'),
  installments: z.number().min(1, 'Installments must be at least 1'),
  installmentAmount: z.number().min(0, 'Installment amount cannot be negative'),
  totalAmount: z.number().min(0, 'Total amount cannot be negative'),
  currency: z.enum(['SAR', 'USD', 'EUR']),
  isActive: z.boolean(),
});

const pricingSchema = z.object({
  paymentPlans: z.array(paymentPlanSchema).min(1, 'At least one payment plan is required'),
  pricePerSqm: z.number().min(0, 'Price per square meter cannot be negative'),
  currency: z.enum(['SAR', 'USD', 'EUR']),
  priceRange: z.object({
    min: z.number().min(0, 'Minimum price cannot be negative'),
    max: z.number().min(0, 'Maximum price cannot be negative'),
  }),
});

// Associations Validation
const ownersAssociationSchema = z.object({
  isRequired: z.boolean(),
  monthlyFee: z.number().min(0, 'Monthly fee cannot be negative'),
  currency: z.enum(['SAR', 'USD', 'EUR']),
  services: z.array(z.string()),
  rules: z.array(z.string()),
});

const managementCompanySchema = z.object({
  name: z.string().min(1, 'Management company name is required'),
  contactInfo: z.object({
    phone: z.string().min(1, 'Phone number is required'),
    email: z.string().email('Valid email is required'),
    address: z.string().min(1, 'Address is required'),
  }),
  services: z.array(z.string()),
});

const associationsSchema = z.object({
  ownersAssociation: ownersAssociationSchema,
  managementCompany: managementCompanySchema.optional(),
});

// Review Validation
const reviewSchema = z.object({
  isReady: z.boolean(),
  notes: z.string().optional(),
  publishDate: z.date().optional(),
  isPublished: z.boolean(),
});

// Main Project Wizard Schema
export const projectWizardSchema = z.object({
  basicInfo: basicInfoSchema,
  media: mediaSchema,
  buildings: buildingsSchema,
  units: unitsSchema,
  features: featuresSchema,
  pricing: pricingSchema,
  associations: associationsSchema,
  review: reviewSchema,
});

// Export individual schemas
export {
  basicInfoSchema,
  mediaSchema,
  buildingsSchema,
  unitsSchema,
  featuresSchema,
  pricingSchema,
  associationsSchema,
  reviewSchema,
};

// Step-specific validation schemas
export const stepValidationSchemas = {
  1: basicInfoSchema,
  2: mediaSchema,
  3: buildingsSchema,
  4: unitsSchema,
  5: featuresSchema,
  6: pricingSchema,
  7: associationsSchema,
  8: reviewSchema,
};

// Validation helper functions
export const validateStep = (step: number, data: any) => {
  const schema = stepValidationSchemas[step as keyof typeof stepValidationSchemas];
  if (!schema) {
    throw new Error(`No validation schema found for step ${step}`);
  }
  return schema.parse(data);
};

export const validateAllSteps = (data: any) => {
  return projectWizardSchema.parse(data);
};
