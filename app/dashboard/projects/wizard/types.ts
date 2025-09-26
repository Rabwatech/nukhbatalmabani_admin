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
    location: {
      ar: string;
      en: string;
    };
    city: string;
    district: string;
    address: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
    developer: string;
    licenseNumber: string;
    totalArea: number;
    landArea: number;
    projectType: 'residential' | 'commercial' | 'mixed';
    status: 'planning' | 'under_construction' | 'completed' | 'sold_out';
  };

  // Media
  media: {
    images: File[];
    videos: File[];
    virtualTour?: string;
    floorPlans: File[];
    brochures: File[];
  };

  // Buildings
  buildings: {
    buildings: Array<{
      id: string;
      name: {
        ar: string;
        en: string;
      };
      floors: number;
      unitsPerFloor: number;
      totalUnits: number;
      buildingType: 'residential' | 'commercial' | 'mixed';
      features: string[];
    }>;
  };

  // Units
  units: {
    unitTypes: Array<{
      id: string;
      name: {
        ar: string;
        en: string;
      };
      size: number;
      rooms: number;
      bathrooms: number;
      balconies: number;
      floor: number;
      buildingId: string;
      price: number;
      currency: 'SAR' | 'USD' | 'EUR';
      unitNumber: string;
      direction: 'north' | 'south' | 'east' | 'west';
      view: 'city' | 'sea' | 'garden' | 'other';
      features: string[];
      status: 'available' | 'reserved' | 'sold';
    }>;
  };

  // Features & Amenities
  features: {
    amenities: Array<{
      id: string;
      name: {
        ar: string;
        en: string;
      };
      description: {
        ar: string;
        en: string;
      };
      category: 'security' | 'recreation' | 'commercial' | 'transportation' | 'other';
      icon: string;
      isAvailable: boolean;
    }>;
    services: Array<{
      id: string;
      name: {
        ar: string;
        en: string;
      };
      description: {
        ar: string;
        en: string;
      };
      price: number;
      currency: 'SAR' | 'USD' | 'EUR';
      billingCycle: 'monthly' | 'yearly' | 'one_time';
      isIncluded: boolean;
    }>;
  };

  // Pricing
  pricing: {
    paymentPlans: Array<{
      id: string;
      name: {
        ar: string;
        en: string;
      };
      description: {
        ar: string;
        en: string;
      };
      downPayment: number;
      installments: number;
      installmentAmount: number;
      totalAmount: number;
      currency: 'SAR' | 'USD' | 'EUR';
      isActive: boolean;
    }>;
    pricePerSqm: number;
    currency: 'SAR' | 'USD' | 'EUR';
    priceRange: {
      min: number;
      max: number;
    };
  };

  // Associations
  associations: {
    ownersAssociation: {
      isRequired: boolean;
      monthlyFee: number;
      currency: 'SAR' | 'USD' | 'EUR';
      services: string[];
      rules: string[];
    };
    managementCompany?: {
      name: string;
      contactInfo: {
        phone: string;
        email: string;
        address: string;
      };
      services: string[];
    };
  };

  // Review & Publish
  review: {
    isReady: boolean;
    notes: string;
    publishDate?: Date;
    isPublished: boolean;
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
