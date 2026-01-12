import { z } from 'zod';

// Helper for potentially File objects (client-side) or mock
// Since Zod runs on client, instanceOf(File) is valid.
const fileSchema = z.any().optional(); // Relaxed for now, or z.instanceof(File)

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
  locationLink: z.string().url('Must be a valid URL'),
  city: z.string().min(1, 'City is required'),
  district: z.string().min(1, 'District is required'),
  ownerName: z.string().min(1, 'Owner name is required'),
  contractorName: z.string().min(1, 'Contractor name is required'),
  contractAttachment: fileSchema,
  developer: z.string().min(1, 'Developer is required'),
  licenseNumber: z.string().min(1, 'License number is required'),
  totalArea: z.number().min(1, 'Total area must be greater than 0'),
  projectType: z.enum(['residential', 'commercial', 'mixed']),
  status: z.enum(['planned', 'under_construction', 'completed', 'sold_out']),
  features: z.array(z.string()).optional(),
});

// Land Pieces Validation
const landPieceSchema = z.object({
  id: z.string(),
  pieceNumber: z.string().min(1, 'Piece number is required'),
  deedNumber: z.string().min(1, 'Deed number is required'),
  type: z.enum(['commercial', 'residential', 'mixed']),
  area: z.number().min(0),
  buildingCount: z.number().min(0),
  attachments: z.object({
    deed: fileSchema,
    constructionLicense: fileSchema,
    completionCertificate: fileSchema,
    electricityCertificate: fileSchema,
    other: z.array(fileSchema).optional(),
  }),
});

const landPiecesSchema = z.array(landPieceSchema);

// Media Validation (unchanged mostly)
const mediaSchema = z.object({
  images: z.array(fileSchema).min(1, 'At least one image is required'),
  videos: z.array(fileSchema).optional(),
  virtualTour: z.string().url().optional().or(z.literal('')),
  floorPlans: z.array(fileSchema).optional(),
  brochures: z.array(fileSchema).optional(),
});

// Unit Models Validation
const unitModelSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Model name is required'),
  type: z.enum(['retail', 'mezzanine', 'repetitive', 'annex']),
  unitType: z.enum(['apartment', 'office', 'twin']).optional(),
  twinRoles: z.string().optional(),
  rooms: z.number().min(0),
  area: z.number().min(0),
  roofArea: z.number().optional(),
  directions: z.array(z.string()),
  view: z.enum(['street', 'sea', 'garden', 'landscape', 'other']),
  features: z.array(z.string()),
  basePrice: z.number().min(0),
  floorPricing: z.array(z.object({
    floor: z.string(),
    price: z.number(),
  })),
  attachments: z.object({
    deed: fileSchema,
    sortingMinutes: fileSchema,
    blueprint: fileSchema,
    other: z.array(fileSchema).optional(),
  }),
});

const unitModelsSchema = z.array(unitModelSchema);

// Buildings Validation
const buildingSchema = z.object({
  id: z.string(),
  number: z.string().min(1, 'Building number is required'),
  nameAr: z.string(), // Auto-generated or manual?
  landPieceId: z.string().min(1, 'Land Piece is required'),
  totalUnits: z.number().min(0),
  models: z.array(z.string()).min(1, 'At least one model is required'),
  floors: z.number().min(1),
});

const buildingsSchema = z.object({
  buildings: z.array(buildingSchema),
});

// Units Validation
const unitSchema = z.object({
  id: z.string(),
  unitNumber: z.string(),
  buildingId: z.string(),
  modelId: z.string(),
  floor: z.string(),
  status: z.enum(['available', 'reserved', 'sold']),
  price: z.number().min(0),
});

const unitsSchema = z.object({
  units: z.array(unitSchema),
});

// Associations Validation
const associationsSchema = z.object({
  companyName: z.string().min(1, 'Company name is required'),
  crNumber: z.string().min(1, 'CR Number is required'),
  headquarters: z.string().min(1, 'Headquarters is required'),
  ownerName: z.string().min(1, 'Owner name is required'),
  ownerMobile: z.string().min(1, 'Owner mobile is required'),
  ownerIdNumber: z.string().min(1, 'Owner ID is required'),
  proxyNumber: z.string().optional(),
  attachments: z.object({
    cr: fileSchema,
    nationalAddress: fileSchema,
    ownerId: fileSchema,
    proxy: fileSchema,
    taxNumber: fileSchema,
    contract: fileSchema,
  }),
});

// Review Validation
const reviewSchema = z.object({
  isReady: z.boolean(),
  notes: z.string().optional(),
  publishDate: z.date().optional(),
  isPublished: z.boolean(),
  assignedSalesAgent: z.string().optional(),
  visibleBuildings: z.array(z.string()).optional(),
});

// Main Project Wizard Schema
export const projectWizardSchema = z.object({
  basicInfo: basicInfoSchema,
  landPieces: landPiecesSchema,
  media: mediaSchema,
  unitModels: unitModelsSchema,
  buildings: buildingsSchema,
  units: unitsSchema,
  associations: associationsSchema,
  review: reviewSchema,
});

// Export individual schemas
export {
  basicInfoSchema,
  landPiecesSchema,
  mediaSchema,
  unitModelsSchema,
  buildingsSchema,
  unitsSchema,
  associationsSchema,
  reviewSchema,
};

// Step-specific validation schemas
// Note: Steps might need to be re-numbered/configured
export const stepValidationSchemas = {
  1: basicInfoSchema,
  2: landPiecesSchema,
  3: unitModelsSchema,
  4: mediaSchema,
  5: buildingsSchema,
  6: unitsSchema,
  7: associationsSchema,
  8: reviewSchema,
};

// Validation helper functions
// Map step IDs to their corresponding data keys in ProjectWizardData
export const stepDataKeys: Record<number, string> = {
  1: 'basicInfo',
  2: 'landPieces',
  3: 'unitModels',
  4: 'media',
  5: 'buildings',
  6: 'units',
  7: 'associations',
  8: 'review',
};

export const validateStep = (step: number, data: any) => {
  const schema = stepValidationSchemas[step as keyof typeof stepValidationSchemas];
  const dataKey = stepDataKeys[step];

  if (!schema) {
    // If no specific schema, skip validation
    return true;
  }

  // Validate only the subset of data relevant to this step
  if (dataKey) {
    return schema.parse(data[dataKey]);
  }

  // Fallback (should not happen with current config)
  return schema.parse(data);
};

export const validateAllSteps = (data: any) => {
  return projectWizardSchema.parse(data);
};
