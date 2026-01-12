export interface ProjectWizardData {
  // Basic Information
  basicInfo: {
    name: {
      ar: string;
      en: string;
    };
    description: {
      ar: string;
      en: string;
    };
    locationLink: string; // Google Maps
    city: string;
    district: string;
    ownerName: string;
    contractorName: string;
    contractAttachment?: File; // Admin only
    developer: string;
    licenseNumber: string;
    totalArea: number;
    projectType: 'residential' | 'commercial' | 'mixed';
    status: 'planned' | 'under_construction' | 'completed' | 'sold_out';
    features: string[]; // Moved from separate section
  };

  // Land Pieces (New Section)
  landPieces: Array<{
    id: string;
    pieceNumber: string;
    deedNumber: string;
    type: 'commercial' | 'residential' | 'mixed';
    area: number;
    buildingCount: number;
    attachments: {
      deed?: File; // Admin/Specific role only
      constructionLicense?: File;
      completionCertificate?: File;
      electricityCertificate?: File;
      other?: File[];
    };
  }>;

  // Media
  media: {
    images: File[];
    videos: File[];
    virtualTour?: string;
    floorPlans: File[];
    brochures: File[];
  };

  // Unit Models (New Section)
  unitModels: Array<{
    id: string;
    name: string;
    type: 'retail' | 'mezzanine' | 'repetitive' | 'annex';
    unitType?: 'apartment' | 'office' | 'twin';
    twinRoles?: string;
    rooms: number;
    area: number;
    roofArea?: number;
    directions: string[];
    view: 'street' | 'sea' | 'garden' | 'landscape' | 'other';
    features: string[];
    basePrice: number;
    floorPricing: Array<{ floor: string; price: number }>;
    attachments: {
      deed?: File;
      sortingMinutes?: File;
      blueprint?: File;
      other?: File[];
    };
  }>;

  // Buildings (Modified)
  buildings: {
    buildings: Array<{
      id: string;
      number: string;
      nameAr: string;
      landPieceId: string; // Link to LandPiece
      totalUnits: number;
      models: string[]; // IDs of UnitModels
      floors: number;
    }>;
  };

  // Units
  units: {
    units: Array<{
      id: string;
      unitNumber: string;
      buildingId: string;
      modelId: string;
      floor: string;
      status: 'available' | 'reserved' | 'sold';
      price: number; // Inherited/Overridden from Model
    }>;
  };

  // Associations (Jamyat AlMullak)
  associations: {
    companyName: string;
    crNumber: string;
    headquarters: string;
    ownerName: string;
    ownerMobile: string;
    ownerIdNumber: string;
    proxyNumber?: string;
    attachments: {
      cr?: File;
      nationalAddress?: File;
      ownerId?: File;
      proxy?: File;
      taxNumber?: File;
      contract?: File;
    };
  };

  // Review & Publish
  review: {
    isReady: boolean;
    notes: string;
    publishDate?: Date;
    isPublished: boolean;
    assignedSalesAgent?: string;
    visibleBuildings?: string[];
  };
}

export interface WizardStep {
  id: number;
  title: {
    ar: string;
    en: string;
  };
  description: {
    ar: string;
    en: string;
  };
  component: React.ComponentType<any>;
  isCompleted: boolean;
  isRequired: boolean;
}

export interface StepProps {
  data: ProjectWizardData;
  onUpdate: (data: Partial<ProjectWizardData>) => void;
  onNext: () => void;
  onPrevious: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
  isSubmitting: boolean;
}
