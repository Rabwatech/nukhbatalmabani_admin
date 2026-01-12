export type ProjectStatus = 'planned' | 'under_construction' | 'completed' | 'sold_out';

export interface Attachment {
    id: string;
    name: string;
    url: string;
    type: string;
}

export interface LandPiece {
    id: string;
    pieceNumber: string;
    type: 'commercial' | 'residential' | 'mixed';
    deedNumber: string; // 12 digits
    area: number;
    buildingCount: number;
    // Attachments
    deedAttachment?: Attachment; // Restricted access
    constructionLicense?: Attachment;
    completionCertificate?: Attachment;
    electricityCertificate?: Attachment;
    otherAttachments?: Attachment[];
}

export interface UnitModel {
    id: string;
    name: string;
    type: 'retail' | 'mezzanine' | 'repetitive' | 'annex';
    unitType?: 'apartment' | 'office' | 'twin';
    twinRoles?: string; // For TWIN type
    rooms: number;
    area: number;
    roofArea?: number; // For Annex

    // Description
    directions: ('southeast' | 'southwest' | 'northeast' | 'northwest')[];
    view: 'street' | 'sea' | 'garden' | 'landscape' | 'other';
    features: string[]; // Balcony, Maid room, etc.

    // Pricing
    basePrice: number;
    floorPricing: { floor: string; price: number }[];

    // Attachments
    deed?: Attachment;
    sortingMinutes?: Attachment;
    blueprint?: Attachment;
}

export interface Building {
    id: string;
    number: string;
    nameAr: string;
    landPieceId: string; // Link to LandPiece
    totalUnits: number;
    models: string[]; // IDs of UnitModels used in this building
}

export interface OwnerAssociation {
    id: string;
    companyName: string;
    crNumber: string;
    headquarters: string;
    ownerName: string;
    ownerMobile: string; // Absher
    ownerIdNumber: string;
    proxyNumber?: string;
    proxyDate?: string;

    // Attachments
    crAttachment?: Attachment;
    nationalAddress?: Attachment;
    ownerIdAttachment?: Attachment;
    proxyAttachment?: Attachment;
    taxNumber?: string;
    contractAttachment?: Attachment;
}

export interface Project {
    id: string;
    nameAr: string;
    descriptionAr: string;
    locationLink: string; // Google Maps
    ownerName: string;
    contractorName: string;
    contractAttachment?: Attachment; // Admin only

    landPieces: LandPiece[];
    buildings: Building[];
    unitModels: UnitModel[];

    // Features (moved from Building)
    features: string[]; // Gym, Lounge, Nursery, etc.

    status: ProjectStatus;
}

export type CustomerStatus = 'interested' | 'booked' | 'owner';
export type AccessMethod = 'marketer' | 'social_media' | 'website' | 'ad_campaign' | 'field_visit' | 'recommendation';

export interface Customer {
    id: string;
    accountNumber: string; // Auto-generated
    name: string;
    nameEn: string;
    phone: string;
    email: string;
    status: CustomerStatus; // interested, booked, owner

    // Personal Info
    nationalId: string;
    absherMobile: string; // New
    nationality: string;
    occupation?: string;
    isAramco?: boolean; // To trigger contract upload

    // Address
    address: string;

    // Access Info
    accessMethod: AccessMethod;
    recommenderName?: string; // If accessMethod is recommendation
    recommenderPhone?: string; // If accessMethod is recommendation

    // Proxy Info (Optional)
    proxy?: {
        name: string;
        phone: string;
        relation: string;
        actNumber: string;
    };

    // System Info
    assignedTo: string;
    createdDate: string;
    units: number;
    notes?: string;

    // Mock Data Arrays
    interactions?: any[];
    documents?: Attachment[];
}

export type DiscountType = 'percentage' | 'fixed_amount';
export type DiscountCategory = 'marketing' | 'employee' | 'admin' | 'seasonal';

export interface DiscountCode {
    id: string;
    code: string;
    type: DiscountType;
    value: number; // 10% or 5000 SAR
    category: DiscountCategory;
    validUntil: string;
    isActive: boolean;
    usageLimit?: number;
    usedCount: number;
}


export type BookingStatus = 'quote_sent' | 'booking_confirmed' | 'contract_signed' | 'cancelled';



export type MaintenanceCategory =
    | 'electricity'
    | 'plumbing'
    | 'paint'
    | 'tiles'
    | 'doors'
    | 'aluminum'
    | 'smart_system'
    | 'elevator'
    | 'other';

export interface MaintenanceSubCategory {
    id: string;
    categoryId: MaintenanceCategory;
    name: { ar: string; en: string };
    priority: 'normal' | 'urgent';
}

export type MaintenanceStatus = 'new' | 'in_progress' | 'completed' | 'closed' | 'rejected' | 'overdue';

export interface MaintenanceRequest {
    id: string;
    project: string;
    unit: string;
    category: MaintenanceCategory;
    subCategory: string; // ID or name
    status: MaintenanceStatus;
    priority: 'normal' | 'urgent';
    date: string;
    description: string;
    assignedTo?: string; // Employee or External Company
    preferredTime: string;
    reportedBy: 'owner' | 'delegate' | 'tenant';
    attachment?: string;
    history: { date: string; action: string; by: string }[];
    completionCode?: string; // For closing request
}

export interface Booking {
    id: string;
    bookingNumber: string;
    customerId: string;
    unitId: string; // Leads to Model -> Building -> Project

    // Pricing
    basePrice: number;
    finalPrice: number;
    discountCode?: string;
    discountAmount?: number;

    status: BookingStatus;
    bookingDate: string;
    expiryDate?: string; // For quotes

    // Payment
    paymentPlan: 'cash' | 'installments';
    downPayment?: number;

    notes?: string;
}

export type UserRole = 'admin' | 'editor' | 'reviewer' | 'accountant' | 'sales_manager';

export interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    phone: string;
    avatar?: string;
    jobTitle?: string;
    isActive: boolean;
    contractAttachment?: Attachment;
    joinedDate: string;
    permissions?: string[];
}
