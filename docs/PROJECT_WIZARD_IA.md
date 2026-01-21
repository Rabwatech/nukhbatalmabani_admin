# Project Wizard - Information Architecture
## Complete Documentation for Project Creation Flow

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Wizard Structure](#wizard-structure)
3. [Step 1: Basic Information](#step-1-basic-information)
4. [Step 2: Land Pieces](#step-2-land-pieces)
5. [Step 3: Unit Models](#step-3-unit-models)
6. [Step 4: Media & Visual Content](#step-4-media--visual-content)
7. [Step 5: Buildings Configuration](#step-5-buildings-configuration)
8. [Step 6: Units Inventory](#step-6-units-inventory)
9. [Step 7: Owner Associations](#step-7-owner-associations)
10. [Step 8: Review & Publish](#step-8-review--publish)
11. [Data Flow & Dependencies](#data-flow--dependencies)
12. [Validation Rules](#validation-rules)
13. [Technical Implementation](#technical-implementation)

---

## 🏗️ Overview

The **Project Wizard** is an 8-step guided workflow for creating comprehensive real estate project listings in the Nokhbat Almabani admin panel. It captures all project data from basic information to individual units, creating a fully structured project ready for sales operations.

### Key Features
- **Bilingual Support**: All fields support Arabic and English
- **Step-by-Step Guidance**: Progressive disclosure of information
- **Data Persistence**: Auto-save and draft management
- **Validation**: Real-time validation with Zod schemas
- **Card-Based Entry**: Repeatable items (land pieces, buildings, units) use individual expandable cards
- **Drag & Drop Uploads**: File attachments throughout the wizard

### Access Path
```
/dashboard/projects → "Create New Project" → Project Wizard
```

---

## 🔄 Wizard Structure

### Step Navigation

| Step | ID | Title (AR) | Title (EN) | Required | Dependencies |
|------|----|-----------  |------------|----------|--------------|
| 1 | `basicInfo` | المعلومات الأساسية | Basic Information | ✅ Yes | None |
| 2 | `landPieces` | قطع الأراضي | Land Pieces | ✅ Yes | None |
| 3 | `unitModels` | نماذج الوحدات | Unit Models | ✅ Yes | None |
| 4 | `media` | الوسائط والصور | Media & Visual Content | ⚠️ Partial | None |
| 5 | `buildings` | تكوين المباني | Buildings Configuration | ✅ Yes | Step 2, Step 3 |
| 6 | `units` | إدارة الوحدات | Units Inventory | ✅ Yes | Step 3, Step 5 |
| 7 | `associations` | جمعية الملاك | Owner Associations | ❌ Optional | None |
| 8 | `review` | المراجعة والنشر | Review & Publish | ✅ Yes | All Steps |

### Navigation Behavior
- **Free Navigation**: Users can click on any step indicator to jump to that step
- **Previous/Next Buttons**: Standard sequential navigation
- **Validation**: Currently bypassed for design review (can be enabled)
- **Auto-Save**: Draft saved every 30 seconds

---

## 📝 Step 1: Basic Information

**Component**: `StepBasicInfo.tsx`  
**Data Key**: `basicInfo`

### Purpose
Capture fundamental project details including name, location, ownership, and classification.

### Fields

#### Project Name (Required)
| Field Path | Arabic Label | English Label | Type | Validation |
|------------|--------------|---------------|------|------------|
| `basicInfo.name.ar` | اسم المشروع (عربي) | Project Name (Arabic) | Text Input | Min 1 character |
| `basicInfo.name.en` | اسم المشروع (إنجليزي) | Project Name (English) | Text Input | Min 1 character |

#### Project Description (Required)
| Field Path | Arabic Label | English Label | Type | Validation |
|------------|--------------|---------------|------|------------|
| `basicInfo.description.ar` | وصف المشروع (عربي) | Project Description (Arabic) | Textarea (4 rows) | Min 10 characters |
| `basicInfo.description.en` | وصف المشروع (إنجليزي) | Project Description (English) | Textarea (4 rows) | Min 10 characters |

#### Location
| Field Path | Arabic Label | English Label | Type | Validation |
|------------|--------------|---------------|------|------------|
| `basicInfo.locationLink` | رابط الموقع (Google Maps) | Location Link (Google Maps) | Text Input (URL) | Valid URL |
| `basicInfo.city` | المدينة | City | Text Input | Required |
| `basicInfo.district` | الحي | District | Text Input | Required |

#### Ownership & Development
| Field Path | Arabic Label | English Label | Type | Validation |
|------------|--------------|---------------|------|------------|
| `basicInfo.ownerName` | اسم المالك | Owner Name | Text Input | Required |
| `basicInfo.contractorName` | اسم المقاول | Contractor Name | Text Input | Required |
| `basicInfo.developer` | المطور | Developer | Text Input | Required |
| `basicInfo.licenseNumber` | رقم الترخيص | License Number | Text Input | Required |

#### Project Specifications
| Field Path | Arabic Label | English Label | Type | Validation |
|------------|--------------|---------------|------|------------|
| `basicInfo.totalArea` | المساحة الإجمالية (م²) | Total Area (m²) | Number Input | Min 1 |
| `basicInfo.projectType` | نوع المشروع | Project Type | Select | Required |
| `basicInfo.status` | حالة المشروع | Project Status | Select | Required |

##### Project Type Options
| Value | Arabic | English |
|-------|--------|---------|
| `residential` | سكني | Residential |
| `commercial` | تجاري | Commercial |
| `mixed` | مختلط | Mixed |

##### Project Status Options
| Value | Arabic | English |
|-------|--------|---------|
| `planned` | مخطط | Planned |
| `under_construction` | قيد الإنشاء | Under Construction |
| `completed` | مكتمل | Completed |
| `sold_out` | مباع بالكامل | Sold Out |

#### Features & Services
| Field Path | Arabic Label | English Label | Type | Validation |
|------------|--------------|---------------|------|------------|
| `basicInfo.features` | المميزات والخدمات | Features & Services | Textarea (5 rows) | Optional, Array of strings |

**Note**: Features are entered one per line and stored as an array of strings.

### UI/UX Notes
- Gradient header with Building2 icon
- Two-column grid layout for paired fields
- RTL/LTR direction support per language field

---

## 🗺️ Step 2: Land Pieces

**Component**: `StepLandPieces.tsx`  
**Data Key**: `landPieces`

### Purpose
Define the land parcels that make up the project. Each project can have multiple land pieces, each with its own deed and specifications.

### Card Structure
Each land piece is displayed in an expandable card with Edit/Save/Delete functionality.

### Fields Per Land Piece

| Field Path | Arabic Label | English Label | Type | Validation |
|------------|--------------|---------------|------|------------|
| `landPieces[n].id` | - | - | Auto-generated | `land-{timestamp}` |
| `landPieces[n].pieceNumber` | رقم القطعة | Piece Number | Text Input | Required |
| `landPieces[n].deedNumber` | رقم الصك | Deed Number | Text Input | Required |
| `landPieces[n].type` | النوع | Type | Select | Required |
| `landPieces[n].area` | المساحة (م²) | Area (m²) | Number Input | Min 0 |
| `landPieces[n].buildingCount` | عدد المباني | Building Count | Number Input | Min 0 |

#### Land Piece Type Options
| Value | Arabic | English |
|-------|--------|---------|
| `residential` | سكني | Residential |
| `commercial` | تجاري | Commercial |
| `mixed` | مختلط | Mixed |

### Attachments (Per Land Piece)
| Attachment Key | Arabic Label | English Label | Access |
|----------------|--------------|---------------|--------|
| `deed` | الصك | Deed | Admin-only |
| `constructionLicense` | رخصة البناء | Construction License | All |
| `completionCertificate` | شهادة الإنجاز | Completion Certificate | All |
| `electricityCertificate` | شهادة الكهرباء | Electricity Certificate | All |
| `other` | مرفقات أخرى | Other Attachments | All |

### UI/UX Notes
- Cards are collapsed by default showing summary (Piece No., Deed No., Type, Area)
- Click Edit (✏️) to expand and edit
- Click Save (حفظ) to collapse card
- Click Delete (🗑️) to remove the land piece
- "Add New Land Piece" button at bottom creates a new card in edit mode

### Data Structure
```typescript
interface LandPiece {
  id: string;
  pieceNumber: string;
  deedNumber: string;
  type: 'commercial' | 'residential' | 'mixed';
  area: number;
  buildingCount: number;
  attachments: {
    deed?: File;
    constructionLicense?: File;
    completionCertificate?: File;
    electricityCertificate?: File;
    other?: File[];
  };
}
```

---

## 🏠 Step 3: Unit Models

**Component**: `StepUnitModels.tsx`  
**Data Key**: `unitModels`

### Purpose
Define reusable unit templates (models) that can be applied to multiple units across buildings. This centralizes pricing and specifications.

### Card Structure
Each model is displayed in an expandable card with Edit/Save/Delete functionality.

### Fields Per Unit Model

#### Basic Information
| Field Path | Arabic Label | English Label | Type | Validation |
|------------|--------------|---------------|------|------------|
| `unitModels[n].id` | - | - | Auto-generated | `model-{timestamp}` |
| `unitModels[n].name` | اسم النموذج | Model Name | Text Input | Required |
| `unitModels[n].type` | التصنيف | Classification | Select | Required |
| `unitModels[n].unitType` | نوع الوحدة | Unit Type | Select | Optional |

##### Model Classification Options
| Value | Arabic | English |
|-------|--------|---------|
| `retail` | تجاري (Retail) | Retail |
| `mezzanine` | ميزانين | Mezzanine |
| `repetitive` | متكرر | Repetitive |
| `annex` | ملحق | Annex |

##### Unit Type Options
| Value | Arabic | English |
|-------|--------|---------|
| `apartment` | شقة | Apartment |
| `office` | مكتب | Office |
| `twin` | توين | Twin |

#### Specifications
| Field Path | Arabic Label | English Label | Type | Validation |
|------------|--------------|---------------|------|------------|
| `unitModels[n].rooms` | عدد الغرف | Rooms | Number Input | Min 0 |
| `unitModels[n].area` | المساحة (م²) | Area (m²) | Number Input | Min 0 |
| `unitModels[n].roofArea` | مساحة السطح (م²) | Roof Area (m²) | Number Input | Optional, Min 0 |
| `unitModels[n].twinRoles` | أدوار التوين | Twin Roles | Text Input | Optional (for Twin type) |

#### Pricing
| Field Path | Arabic Label | English Label | Type | Validation |
|------------|--------------|---------------|------|------------|
| `unitModels[n].basePrice` | السعر الأساسي | Base Price | Number Input (SAR) | Min 0 |
| `unitModels[n].floorPricing` | تسعير الأدوار | Floor Pricing | Array of {floor, price} | Optional |

#### Features
| Field Path | Arabic Label | English Label | Type | Validation |
|------------|--------------|---------------|------|------------|
| `unitModels[n].features` | مميزات النموذج | Model Features | Text Input (comma-separated) | Optional, Array |
| `unitModels[n].directions` | الاتجاهات | Directions | Multi-select | Optional |
| `unitModels[n].view` | الإطلالة | View | Select | Optional |

##### View Options
| Value | Arabic | English |
|-------|--------|---------|
| `street` | شارع | Street |
| `sea` | بحر | Sea |
| `garden` | حديقة | Garden |
| `landscape` | منظر طبيعي | Landscape |
| `other` | أخرى | Other |

### Data Structure
```typescript
interface UnitModel {
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
  floorPricing: { floor: string; price: number }[];
  attachments: {
    deed?: File;
    sortingMinutes?: File;
    blueprint?: File;
    other?: File[];
  };
}
```

### UI/UX Notes
- Base price displayed with SAR icon
- Features entered as comma-separated values
- Collapsed view shows: Model Name, Type, Base Price, Area

---

## 📸 Step 4: Media & Visual Content

**Component**: `StepMedia.tsx`  
**Data Key**: `media`

### Purpose
Upload and manage visual assets for the project including images, videos, floor plans, and marketing materials.

### Fields

| Field Path | Arabic Label | English Label | Type | Validation | Required |
|------------|--------------|---------------|------|------------|----------|
| `media.images` | صور المشروع | Project Images | File Upload (Multiple) | At least 1 | ✅ Yes |
| `media.videos` | فيديوهات المشروع | Project Videos | File Upload (Multiple) | - | ❌ No |
| `media.virtualTour` | جولة افتراضية (رابط) | Virtual Tour (URL) | Text Input (URL) | Valid URL or empty | ❌ No |
| `media.floorPlans` | المخططات المعمارية | Floor Plans | File Upload (Multiple) | - | ❌ No |
| `media.brochures` | الكتيبات والبروشورات | Brochures & Catalogs | File Upload (Multiple) | - | ❌ No |

### File Upload Configuration

| Media Type | Accept | Max Size | Multiple |
|------------|--------|----------|----------|
| Images | `image/*` | 10 MB | ✅ Yes |
| Videos | `video/*` | 100 MB | ✅ Yes |
| Floor Plans | `.pdf,.jpg,.jpeg,.png` | 10 MB | ✅ Yes |
| Brochures | `.pdf` | 10 MB | ✅ Yes |

### Data Structure
```typescript
interface Media {
  images: File[];
  videos: File[];
  virtualTour?: string;
  floorPlans: File[];
  brochures: File[];
}
```

### UI/UX Notes
- Drag & drop file upload areas
- Preview thumbnails for uploaded images
- File list with remove button (X)
- Gradient header with Image icon

---

## 🏢 Step 5: Buildings Configuration

**Component**: `StepBuildings.tsx`  
**Data Key**: `buildings.buildings`

### Purpose
Configure buildings within the project, linking each building to a land piece and specifying which unit models are available.

### Dependencies
- **Step 2 (Land Pieces)**: Available land pieces for selection
- **Step 3 (Unit Models)**: Available models for assignment

### Card Structure
Each building is displayed in an expandable card with Edit/Save/Delete functionality.

### Fields Per Building

| Field Path | Arabic Label | English Label | Type | Validation |
|------------|--------------|---------------|------|------------|
| `buildings.buildings[n].id` | - | - | Auto-generated | `building-{timestamp}` |
| `buildings.buildings[n].number` | رقم المبنى | Building Number | Text Input | Required |
| `buildings.buildings[n].nameAr` | اسم المبنى (اختياري) | Building Name (Optional) | Text Input | Optional |
| `buildings.buildings[n].landPieceId` | قطعة الأرض | Land Piece | Select (from Step 2) | Required |
| `buildings.buildings[n].floors` | عدد الطوابق | Floors | Number Input | Min 1 |
| `buildings.buildings[n].totalUnits` | إجمالي الوحدات | Total Units | Number Input | Min 1 |
| `buildings.buildings[n].models` | نماذج الوحدات في هذا المبنى | Unit Models in This Building | Checkbox list (from Step 3) | At least 1 |

### Data Structure
```typescript
interface Building {
  id: string;
  number: string;
  nameAr: string;
  landPieceId: string;      // References landPieces[n].id
  totalUnits: number;
  models: string[];          // Array of unitModels[n].id
  floors: number;
}

// Wrapper object
interface BuildingsData {
  buildings: Building[];
}
```

### UI/UX Notes
- Land piece dropdown shows: `{pieceNumber} ({deedNumber})`
- Unit models shown as checkbox grid
- Warning if no land pieces added (directs to Step 2)
- Warning if no models added (directs to Step 3)
- Collapsed view shows: Building No., Land Piece, Total Units, Models (as badges)

---

## 🏠 Step 6: Units Inventory

**Component**: `StepUnits.tsx`  
**Data Key**: `units.units`

### Purpose
Create individual unit records, linking each to a building and model. Prices can be inherited from the model or overridden.

### Dependencies
- **Step 3 (Unit Models)**: Available models for selection
- **Step 5 (Buildings)**: Available buildings for assignment
- Buildings define which models are available (filtered list)

### Card Structure
Each unit is displayed in an expandable card with Edit/Save/Delete functionality.

### Fields Per Unit

| Field Path | Arabic Label | English Label | Type | Validation |
|------------|--------------|---------------|------|------------|
| `units.units[n].id` | - | - | Auto-generated | `unit-{timestamp}` |
| `units.units[n].unitNumber` | رقم الوحدة | Unit Number | Text Input | Required |
| `units.units[n].buildingId` | المبنى | Building | Select (from Step 5) | Required |
| `units.units[n].modelId` | نموذج الوحدة | Unit Model | Select (filtered by building) | Required |
| `units.units[n].floor` | الطابق | Floor | Number Input | Required |
| `units.units[n].status` | الحالة | Status | Select | Required |
| `units.units[n].price` | السعر | Price | Number Input (SAR) | Min 0 |

#### Unit Status Options
| Value | Arabic | English |
|-------|--------|---------|
| `available` | متاح | Available |
| `reserved` | محجوز | Reserved |
| `sold` | مباع | Sold |

### Price Auto-Fill Logic
When a model is selected:
1. If `price` is 0 or empty, auto-fill with `model.basePrice`
2. User can override the price after auto-fill

### Data Structure
```typescript
interface Unit {
  id: string;
  unitNumber: string;
  buildingId: string;       // References buildings.buildings[n].id
  modelId: string;          // References unitModels[n].id
  floor: number | string;
  status: 'available' | 'reserved' | 'sold';
  price: number;
}

// Wrapper object
interface UnitsData {
  units: Unit[];
}
```

### UI/UX Notes
- Model dropdown filtered based on selected building's `models` array
- Model dropdown disabled until building is selected
- Warning: "No models for this building" if building has no linked models
- Collapsed view shows: Unit No., Building, Model, Price

---

## 👥 Step 7: Owner Associations

**Component**: `StepAssociations.tsx`  
**Data Key**: `associations`

### Purpose
Define the owner association (جمعية الملاك) that will manage the property after sale. This includes company registration and legal representative information.

### Fields

#### Company Details
| Field Path | Arabic Label | English Label | Type | Validation |
|------------|--------------|---------------|------|------------|
| `associations.companyName` | اسم شركة الجمعية | Association Company Name | Text Input | Required* |
| `associations.crNumber` | رقم السجل التجاري | CR Number | Text Input | Required* |
| `associations.headquarters` | المقر الرئيسي | Headquarters | Text Input | Required* |

#### Owner Details
| Field Path | Arabic Label | English Label | Type | Validation |
|------------|--------------|---------------|------|------------|
| `associations.ownerName` | اسم المالك | Owner Name | Text Input | Required* |
| `associations.ownerMobile` | رقم الجوال (أبشر) | Mobile Number (Absher) | Text Input | Required* |
| `associations.ownerIdNumber` | رقم الهوية | ID Number | Text Input | Required* |
| `associations.proxyNumber` | رقم الوكالة (اختياري) | Proxy Number (Optional) | Text Input | Optional |

*Note: Fields marked as Required* are required in the schema but the step itself is optional.

### Attachments

| Attachment Key | Arabic Label | English Label | File Type |
|----------------|--------------|---------------|-----------|
| `associations.attachments.cr` | السجل التجاري | Commercial Record | PDF, JPG, PNG |
| `associations.attachments.nationalAddress` | العنوان الوطني | National Address | PDF, JPG, PNG |
| `associations.attachments.ownerId` | هوية المالك | Owner ID | PDF, JPG, PNG |
| `associations.attachments.proxy` | الوكالة (إن وجدت) | Proxy (If any) | PDF, JPG, PNG |
| `associations.attachments.taxNumber` | الرقم الضريبي | Tax Number | PDF, JPG, PNG |
| `associations.attachments.contract` | العقد | Contract | PDF, JPG, PNG |

### Data Structure
```typescript
interface Associations {
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
}
```

### UI/UX Notes
- Two-card layout: Company info card + Attachments card
- Attachments displayed in 2-column grid
- Single file upload per attachment type
- Users icon in header

---

## ✅ Step 8: Review & Publish

**Component**: `StepReview.tsx`  
**Data Key**: `review`

### Purpose
Review all entered data, verify completion status, and publish the project.

### Completion Status Tracking

| Section | Data Check | Required |
|---------|-----------|----------|
| Basic Information | `name.ar && name.en` | ✅ Yes |
| Land Pieces | `landPieces.length > 0` | ✅ Yes |
| Unit Models | `unitModels.length > 0` | ✅ Yes |
| Media | Always `true` | ❌ No |
| Buildings | `buildings.buildings.length > 0` | ✅ Yes |
| Units | `units.units.length > 0` | ✅ Yes |
| Associations | Always `true` | ❌ No |

### Progress Calculation
```
percentage = (completedRequiredSteps / totalRequiredSteps) * 100
```

### Review Cards Display
Each section shows:
- **Icon**: Section-appropriate icon
- **Status Badge**: Complete (green) / Incomplete (red)
- **Summary**: Key data preview

| Section | Icon | Summary Content |
|---------|------|-----------------|
| Basic Information | Building2 | Name (AR/EN), City - District |
| Land Pieces | Map | Count of pieces |
| Unit Models | Layers | Count of models |
| Media | Image | Count of images |
| Buildings | Building2 | Count of buildings |
| Units | Home | Count of units |
| Associations | Users | Company name or "Not specified" |

### Publishing Controls

| Field Path | Arabic Label | English Label | Type | Default |
|------------|--------------|---------------|------|---------|
| `review.isReady` | جاهز للنشر | Ready to Publish | Switch | `false` |
| `review.notes` | ملاحظات إضافية | Additional Notes | Textarea (3 rows) | Empty |
| `review.publishDate` | تاريخ النشر | Publish Date | Date Picker | Optional |
| `review.isPublished` | منشور | Published | Boolean | `false` |
| `review.assignedSalesAgent` | مندوب المبيعات | Assigned Sales Agent | Select | Optional |
| `review.visibleBuildings` | المباني المرئية | Visible Buildings | Multi-select | Optional |

### Data Structure
```typescript
interface Review {
  isReady: boolean;
  notes?: string;
  publishDate?: Date;
  isPublished: boolean;
  assignedSalesAgent?: string;
  visibleBuildings?: string[];
}
```

### UI/UX Notes
- Large progress bar at top showing completion percentage
- 2-column grid of section summary cards
- Color-coded status (green/red) for completion
- Publishing section with switch toggle

---

## 🔗 Data Flow & Dependencies

### Entity Relationship Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        PROJECT                              │
│  Step 1: Basic Information                                  │
│  - name (AR/EN)                                             │
│  - location, city, district                                 │
│  - owner, contractor, developer                             │
│  - project type, status, features                           │
└────────────────────────┬────────────────────────────────────┘
                         │
         ┌───────────────┼───────────────┐
         │               │               │
         ▼               ▼               ▼
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│   LAND PIECES   │ │   UNIT MODELS   │ │      MEDIA      │
│   Step 2        │ │   Step 3        │ │   Step 4        │
│ - pieceNumber   │ │ - name          │ │ - images[]      │
│ - deedNumber    │ │ - type          │ │ - videos[]      │
│ - type          │ │ - basePrice     │ │ - floorPlans[]  │
│ - area          │ │ - area          │ │ - brochures[]   │
│ - buildingCount │ │ - features      │ │ - virtualTour   │
└────────┬────────┘ └────────┬────────┘ └─────────────────┘
         │                   │
         │   ┌───────────────┤
         │   │               │
         ▼   ▼               │
    ┌─────────────────┐      │
    │    BUILDINGS    │      │
    │    Step 5       │      │
    │ - number        │◄─────┘ (models[] references unitModels)
    │ - landPieceId   │◄─────── (references landPieces)
    │ - models[]      │
    │ - floors        │
    └────────┬────────┘
             │
             ▼
    ┌─────────────────┐
    │      UNITS      │
    │    Step 6       │
    │ - unitNumber    │
    │ - buildingId    │◄─────── (references buildings)
    │ - modelId       │◄─────── (references unitModels)
    │ - floor         │
    │ - status        │
    │ - price         │
    └─────────────────┘

┌─────────────────┐   ┌─────────────────┐
│  ASSOCIATIONS   │   │     REVIEW      │
│    Step 7       │   │    Step 8       │
│ - companyName   │   │ - isReady       │
│ - crNumber      │   │ - notes         │
│ - ownerName     │   │ - publishDate   │
│ - attachments   │   │ - isPublished   │
└─────────────────┘   └─────────────────┘
```

### Dependency Matrix

| Uses ▼ | Land Pieces | Unit Models | Buildings | Units |
|--------|-------------|-------------|-----------|-------|
| **Land Pieces** | - | ❌ | ❌ | ❌ |
| **Unit Models** | ❌ | - | ❌ | ❌ |
| **Buildings** | ✅ `landPieceId` | ✅ `models[]` | - | ❌ |
| **Units** | ❌ | ✅ `modelId` | ✅ `buildingId` | - |

---

## ✔️ Validation Rules

### Step 1: Basic Information
```typescript
{
  name: { ar: min(1), en: min(1) },
  description: { ar: min(10), en: min(10) },
  locationLink: url(),
  city: min(1),
  district: min(1),
  ownerName: min(1),
  contractorName: min(1),
  developer: min(1),
  licenseNumber: min(1),
  totalArea: min(1),
  projectType: enum(['residential', 'commercial', 'mixed']),
  status: enum(['planned', 'under_construction', 'completed', 'sold_out']),
  features: array().optional()
}
```

### Step 2: Land Pieces
```typescript
array([{
  pieceNumber: min(1),
  deedNumber: min(1),
  type: enum(['commercial', 'residential', 'mixed']),
  area: min(0),
  buildingCount: min(0)
}])
```

### Step 3: Unit Models
```typescript
array([{
  name: min(1),
  type: enum(['retail', 'mezzanine', 'repetitive', 'annex']),
  unitType: enum(['apartment', 'office', 'twin']).optional(),
  rooms: min(0),
  area: min(0),
  basePrice: min(0),
  view: enum(['street', 'sea', 'garden', 'landscape', 'other'])
}])
```

### Step 4: Media
```typescript
{
  images: array().min(1),  // At least 1 image required
  virtualTour: url().optional()
}
```

### Step 5: Buildings
```typescript
{ buildings: array([{
  number: min(1),
  landPieceId: min(1),
  totalUnits: min(0),
  models: array().min(1),
  floors: min(1)
}]) }
```

### Step 6: Units
```typescript
{ units: array([{
  unitNumber: string(),
  buildingId: string(),
  modelId: string(),
  floor: string(),
  status: enum(['available', 'reserved', 'sold']),
  price: min(0)
}]) }
```

### Step 7: Associations
```typescript
{
  companyName: min(1),
  crNumber: min(1),
  headquarters: min(1),
  ownerName: min(1),
  ownerMobile: min(1),
  ownerIdNumber: min(1),
  proxyNumber: optional()
}
```

### Step 8: Review
```typescript
{
  isReady: boolean(),
  notes: optional(),
  publishDate: date().optional(),
  isPublished: boolean()
}
```

---

## 🔧 Technical Implementation

### Key Files

| File | Purpose |
|------|---------|
| `ProjectWizard.tsx` | Main wizard container, navigation, form provider |
| `wizard/types.ts` | TypeScript interfaces for all data |
| `wizard/store.ts` | Zustand store for state persistence |
| `wizard/validation.ts` | Zod schemas for validation |
| `wizard/StepBasicInfo.tsx` | Step 1 component |
| `wizard/StepLandPieces.tsx` | Step 2 component |
| `wizard/StepUnitModels.tsx` | Step 3 component |
| `wizard/StepMedia.tsx` | Step 4 component |
| `wizard/StepBuildings.tsx` | Step 5 component |
| `wizard/StepUnits.tsx` | Step 6 component |
| `wizard/StepAssociations.tsx` | Step 7 component |
| `wizard/StepReview.tsx` | Step 8 component |

### State Management

```typescript
// Zustand Store with Persistence
interface ProjectWizardStore {
  projectData: ProjectWizardData;
  currentStep: number;
  completedSteps: number[];
  
  updateProjectData: (data: Partial<ProjectWizardData>) => void;
  setCurrentStep: (step: number) => void;
  markStepComplete: (step: number) => void;
  saveDraft: (data: ProjectWizardData) => void;
  loadDraft: () => ProjectWizardData | null;
  resetWizard: () => void;
}
```

### Form Management

- **Library**: React Hook Form
- **Validation**: Zod resolver
- **Mode**: `onChange` - validates on every change
- **Provider**: `FormProvider` wraps all steps

### Auto-Save

```javascript
// Auto-save draft every 30 seconds
useEffect(() => {
  const interval = setInterval(() => {
    if (Object.keys(methods.formState.dirtyFields).length > 0) {
      saveDraft(methods.getValues());
    }
  }, 30000);
  return () => clearInterval(interval);
}, []);
```

### Step Component Pattern

Each step component receives:
```typescript
interface StepProps {
  data: ProjectWizardData;
  onUpdate: (data: Partial<ProjectWizardData>) => void;
  onNext: () => void;
  onPrevious: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
  isSubmitting: boolean;
}
```

---

## 📱 Responsive Design

### Breakpoints

| Screen | Layout | Columns |
|--------|--------|---------|
| Mobile | Single column | 1 |
| Tablet (md) | Two columns | 2 |
| Desktop (lg+) | Two columns | 2 |

### Card Behavior

- **Desktop**: Side-by-side display of cards
- **Mobile**: Full-width stacked cards
- **Edit Mode**: Card expands to show all fields
- **View Mode**: Card shows summary only

---

*Document Version: 1.0*  
*Last Updated: January 2026*  
*Component Path: `/app/dashboard/projects/wizard/*`*
