"use client";

import { motion } from "framer-motion";
import { useDirection } from "@/context/DirectionContext";
import { useState, useRef } from "react";
import {
  Plus,
  Building2,
  MapPin,
  Calendar,
  Users,
  TrendingUp,
  Eye,
  Edit,
  Trash2,
  Filter,
  Search,
  Upload,
  X,
  Youtube,
  Drama as Panorama,
  Check,
  ArrowUp as Elevator,
  Car,
  Dumbbell,
  Waves,
  Church as Mosque,
  Home,
  Shield,
  Video,
  Wrench,
  Brush,
  Wind,
  Wifi,
  PlusCircle,
  Image,
  FileText,
  CreditCard,
  Settings,
  Clock,
} from "lucide-react";
import PageWrapper from "@/components/PageWrapper";
import DataTable from "@/components/shared/DataTable";
import StatusBadge from "@/components/shared/StatusBadge";
import Modal from "@/components/shared/Modal";
import FormField from "@/components/shared/FormField";
import { useRouter } from "next/navigation";
import SelectContext from "@/components/ui/select-context";
import UploadLabel from "@/components/ui/UploadLabel";
import * as XLSX from "xlsx";

interface ProjectFeature {
  id: string;
  text: string;
}

interface ProjectService {
  id: string;
  name: string;
  icon: any;
  quantity?: number;
  isCustom?: boolean;
}

export default function ProjectsPage() {
  const { language } = useDirection();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("list");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [projectImages, setProjectImages] = useState<File[]>([]);
  const [projectLicense, setProjectLicense] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [features, setFeatures] = useState<ProjectFeature[]>([]);
  const [newFeature, setNewFeature] = useState("");
  const [selectedPaymentPlan, setSelectedPaymentPlan] = useState("");
  const [bankName, setBankName] = useState("");
  const [services, setServices] = useState<ProjectService[]>([]);
  const [showServicesDropdown, setShowServicesDropdown] = useState(false);
  const [customServiceName, setCustomServiceName] = useState("");
  const [showCustomServiceInput, setShowCustomServiceInput] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const licenseFileInputRef = useRef<HTMLInputElement>(null);

  // Bulk Unit Creation System States
  const [showBulkUnitModal, setShowBulkUnitModal] = useState(false);
  const [showProjectSelectionModal, setShowProjectSelectionModal] =
    useState(false);
  const [selectedProjectForBulk, setSelectedProjectForBulk] =
    useState<any>(null);
  const [bulkProjects, setBulkProjects] = useState<any[]>([]);
  const [bulkProjectError, setBulkProjectError] = useState("");
  const [bulkUnitForm, setBulkUnitForm] = useState({
    designName: "",
    numberOfCopies: 1,
    area: "",
    rooms: "",
    bathrooms: "",
    startingPrice: "",
    floorStart: 1,
    floorEnd: 1,
    orientation: "north",
    view: "front",
    description: "",
    unitPrefix: "A",
  });
  const [previewUnits, setPreviewUnits] = useState<any[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [excelFile, setExcelFile] = useState<File | null>(null);
  const [showExcelUpload, setShowExcelUpload] = useState(false);
  const [excelPreviewData, setExcelPreviewData] = useState<
    Array<{
      project_name: string;
      code: string;
      designName: string;
      area: number;
      floor: number;
      rooms: number;
      bathrooms: number;
      view: string;
      orientation: string;
      price: number;
      status: string;
      project_id?: number;
    }>
  >([]);
  const [savedTemplates, setSavedTemplates] = useState<any[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);

  // Smart Unit Entry Form States
  const [projectFloors, setProjectFloors] = useState<any>([]);
  const [availableTemplates, setAvailableTemplates] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState("");

  // Unit Configuration Form
  const [unitConfig, setUnitConfig] = useState({
    designName: "",
    numberOfUnits: 1,
    area: "",
    rooms: "",
    bathrooms: "",
    startingPrice: "",
    unitPrefix: "A",
    description: "",
    direction: "north",
    view: "city",
    autoFillAll: false,
  });

  // Floor Distribution
  const floorDistribution = useRef<Record<number, number>>({});
  const [generatedUnits, setGeneratedUnits] = useState<any[]>([]);
  const [duplicateCodes, setDuplicateCodes] = useState<string[]>([]);

  // Mock data
  const projects = [
    {
      id: 1,
      name:
        language === "ar"
          ? "مجمع الأناقة السكني"
          : "Elegance Residential Complex",
      location: language === "ar" ? "الرياض، حي الملقا" : "Riyadh, Al-Malqa",
      type: language === "ar" ? "سكني" : "residential",
      status: language === "ar" ? "مكتمل" : "ready",
      totalUnits: 150,
      soldUnits: 120,
      availableUnits: 30,
      startDate: "2023-01-15",
      deliveryDate: "2024-01-15",
      budget: "50,000,000",
      revenue: "45,000,000",
      manager: language === "ar" ? "أحمد العتيبي" : "Ahmed Al-Otaibi",
      finishingLevel: language === "ar" ? "فاخر" : "luxury",
      paymentPlan: language === "ar" ? "أقساط مع دفعة مقدمة" : "installments",
      ownershipType: language === "ar" ? "تملك حر" : "freehold",
      licenseNumber: "LIC-2023-001",
      features: [
        language === "ar" ? "قريب من محطة المترو" : "Close to metro station",
        language === "ar" ? "إطلالات بانورامية" : "Panoramic views",
        language === "ar" ? "تصميم عائلي" : "Family-friendly design",
      ],
    },
    {
      id: 2,
      name: language === "ar" ? "برج التجارة المركزي" : "Central Trade Tower",
      location: language === "ar" ? "جدة، الكورنيش" : "Jeddah, Corniche",
      type: language === "ar" ? "تجاري" : "commercial",
      status: language === "ar" ? "قيد الإنشاء" : "under-construction",
      totalUnits: 80,
      soldUnits: 45,
      availableUnits: 35,
      startDate: "2023-06-01",
      deliveryDate: "2024-12-01",
      budget: "75,000,000",
      revenue: "35,000,000",
      manager: language === "ar" ? "فاطمة الحربي" : "Fatima Al-Harbi",
      finishingLevel: language === "ar" ? "سوبر لوكس" : "super-lux",
      paymentPlan: language === "ar" ? "تمويل بنكي" : "bank-financing",
      bankName:
        language === "ar" ? "البنك الأهلي، بنك الرياض" : "NCB, Riyad Bank",
      ownershipType: language === "ar" ? "تملك حر" : "freehold",
      licenseNumber: "LIC-2023-002",
      features: [
        language === "ar" ? "مكاتب ذكية" : "Smart offices",
        language === "ar" ? "مركز أعمال متكامل" : "Integrated business center",
      ],
    },
    {
      id: 3,
      name: language === "ar" ? "قرية الهدوء" : "Tranquil Village",
      location: language === "ar" ? "الدمام، الشاطئ" : "Dammam, Beach",
      type: language === "ar" ? "سكني" : "residential",
      status: language === "ar" ? "على الخريطة" : "on-map",
      totalUnits: 60,
      soldUnits: 0,
      availableUnits: 60,
      startDate: "2024-03-01",
      deliveryDate: "2025-03-01",
      budget: "30,000,000",
      revenue: "0",
      manager: language === "ar" ? "خالد المطيري" : "Khalid Al-Mutairi",
      finishingLevel: language === "ar" ? "عادي" : "regular",
      paymentPlan: language === "ar" ? "دفعة واحدة" : "one-time",
      ownershipType: language === "ar" ? "إيجار منتهي بالتمليك" : "rent-to-own",
      licenseNumber: "LIC-2023-003",
      features: [
        language === "ar" ? "إطلالة على البحر" : "Sea view",
        language === "ar" ? "حدائق خاصة" : "Private gardens",
      ],
    },
  ];

  // Available services
  const availableServices: ProjectService[] = [
    {
      id: "elevators",
      name: language === "ar" ? "مصاعد" : "Elevators",
      icon: Elevator,
    },
    {
      id: "parking",
      name: language === "ar" ? "مواقف سيارات" : "Parking",
      icon: Car,
    },
    {
      id: "gym",
      name: language === "ar" ? "صالة رياضية" : "Gym",
      icon: Dumbbell,
    },
    {
      id: "pool",
      name: language === "ar" ? "مسبح" : "Swimming Pool",
      icon: Waves,
    },
    { id: "mosque", name: language === "ar" ? "مسجد" : "Mosque", icon: Mosque },
    {
      id: "smart-home",
      name: language === "ar" ? "نظام المنزل الذكي" : "Smart Home System",
      icon: Home,
    },
    {
      id: "security",
      name: language === "ar" ? "أمن إلكتروني" : "Electronic Security",
      icon: Shield,
    },
    {
      id: "surveillance",
      name: language === "ar" ? "مراقبة على مدار الساعة" : "24/7 Surveillance",
      icon: Video,
    },
    {
      id: "maintenance",
      name: language === "ar" ? "صيانة" : "Maintenance",
      icon: Wrench,
    },
    {
      id: "cleaning",
      name: language === "ar" ? "خدمات تنظيف" : "Cleaning Services",
      icon: Brush,
    },
    {
      id: "central-ac",
      name: language === "ar" ? "تكييف مركزي" : "Central AC",
      icon: Wind,
    },
    {
      id: "internet",
      name: language === "ar" ? "إنترنت ألياف" : "Fiber Internet",
      icon: Wifi,
    },
  ];

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "ready":
      case "مكتمل":
        return "success";
      case "under-construction":
      case "قيد الإنشاء":
        return "warning";
      case "on-map":
      case "على الخريطة":
        return "info";
      case "on-hold":
      case "متوقف":
        return "error";
      default:
        return "default";
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, { ar: string; en: string }> = {
      ready: { ar: "مكتمل", en: "Ready for Delivery" },
      "under-construction": { ar: "قيد الإنشاء", en: "Under Construction" },
      "on-map": { ar: "على الخريطة", en: "On Map" },
      "on-hold": { ar: "متوقف", en: "On Hold" },
    };
    return labels[status]?.[language] || status;
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, { ar: string; en: string }> = {
      residential: { ar: "سكني", en: "Residential" },
      commercial: { ar: "تجاري", en: "Commercial" },
      mixed: { ar: "مختلط", en: "Mixed Use" },
    };
    return labels[type]?.[language] || type;
  };

  const getFinishingLevelLabel = (level: string) => {
    const labels: Record<string, { ar: string; en: string }> = {
      "no-finishing": { ar: "بدون تشطيب", en: "No Finishing" },
      "half-finishing": { ar: "نصف تشطيب", en: "Half Finishing" },
      regular: { ar: "عادي", en: "Regular" },
      luxury: { ar: "فاخر", en: "Luxury" },
      "super-lux": { ar: "سوبر لوكس", en: "Super Lux" },
    };
    return labels[level]?.[language] || level;
  };

  const getPaymentPlanLabel = (plan: string) => {
    const labels: Record<string, { ar: string; en: string }> = {
      "one-time": { ar: "دفعة واحدة", en: "One-time Payment" },
      installments: {
        ar: "أقساط مع دفعة مقدمة",
        en: "Installments with Down Payment",
      },
      "bank-financing": { ar: "تمويل بنكي", en: "Bank Financing" },
    };
    return labels[plan]?.[language] || plan;
  };

  const getOwnershipTypeLabel = (type: string) => {
    const labels: Record<string, { ar: string; en: string }> = {
      freehold: { ar: "تملك حر", en: "Freehold" },
      "rent-to-own": { ar: "إيجار منتهي بالتمليك", en: "Rent-to-Own" },
      "long-term-lease": { ar: "إيجار طويل الأمد", en: "Long-Term Lease" },
      waqf: { ar: "وقف", en: "Endowment (Waqf)" },
    };
    return labels[type]?.[language] || type;
  };

  const tabs = [
    {
      id: "list",
      label: language === "ar" ? "قائمة المشاريع" : "Projects List",
    },
    { id: "analytics", label: language === "ar" ? "التحليلات" : "Analytics" },
    {
      id: "units",
      label: language === "ar" ? "إدارة الوحدات" : "Unit Management",
    },
  ];

  const columns = [
    {
      key: "name",
      label: language === "ar" ? "اسم المشروع" : "Project Name",
      sortable: true,
      render: (value: string) => (
        <span className="text-elegant-white font-medium">{value}</span>
      ),
    },
    {
      key: "location",
      label: language === "ar" ? "الموقع" : "Location",
      render: (value: string) => (
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <MapPin className="h-4 w-4 text-desert-gold" />
          <span className="text-stone-gray">{value}</span>
        </div>
      ),
    },
    {
      key: "type",
      label: language === "ar" ? "النوع" : "Type",
      render: (value: string) => (
        <StatusBadge status={getTypeLabel(value)} variant="info" size="sm" />
      ),
    },
    {
      key: "status",
      label: language === "ar" ? "الحالة" : "Status",
      render: (value: string) => (
        <StatusBadge
          status={typeof value === "string" ? getStatusLabel(value) : value}
          variant={getStatusVariant(value)}
        />
      ),
    },
    {
      key: "totalUnits",
      label: language === "ar" ? "إجمالي الوحدات" : "Total Units",
      render: (value: number) => (
        <span className="text-elegant-white">{value}</span>
      ),
    },
    {
      key: "soldUnits",
      label: language === "ar" ? "الوحدات المباعة" : "Sold Units",
      render: (value: number, row: any) => (
        <div className="whitespace-nowrap">
          <span className="text-green-400 font-medium">{value}</span>
          <span className="text-stone-gray text-sm ml-1">
            ({Math.round((value / row.totalUnits) * 100)}%)
          </span>
        </div>
      ),
    },
    {
      key: "manager",
      label: language === "ar" ? "مدير المشروع" : "Project Manager",
      render: (value: string) => (
        <span className="text-stone-gray">{value}</span>
      ),
    },
  ];

  const filterOptions = [
    { value: "residential", label: language === "ar" ? "سكني" : "Residential" },
    { value: "commercial", label: language === "ar" ? "تجاري" : "Commercial" },
    { value: "mixed", label: language === "ar" ? "مختلط" : "Mixed Use" },
  ];

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleProjectImages(Array.from(e.dataTransfer.files));
    }
  };

  const handleProjectImages = (files: File[]) => {
    // Filter for image files only
    const imageFiles = files.filter((file) => file.type.startsWith("image/"));
    setProjectImages((prev) => [...prev, ...imageFiles]);
  };

  const handleLicenseFile = (files: FileList | null) => {
    if (files && files.length > 0) {
      // Only accept PDF files
      if (files[0].type === "application/pdf") {
        setProjectLicense(files[0]);
      } else {
        alert(
          language === "ar"
            ? "يرجى تحميل ملف PDF فقط"
            : "Please upload PDF file only"
        );
      }
    }
  };

  const removeImage = (index: number) => {
    setProjectImages((prev) => prev.filter((_, i) => i !== index));
  };

  const removeLicense = () => {
    setProjectLicense(null);
  };

  const handleAddFeature = () => {
    if (newFeature.trim()) {
      setFeatures((prev) => [
        ...prev,
        { id: Date.now().toString(), text: newFeature.trim() },
      ]);
      setNewFeature("");
    }
  };

  const removeFeature = (id: string) => {
    setFeatures((prev) => prev.filter((feature) => feature.id !== id));
  };

  const handlePaymentPlanChange = (plan: string) => {
    setSelectedPaymentPlan(plan);
    if (plan !== "bank-financing") {
      setBankName("");
    }
  };

  const addService = (service: ProjectService) => {
    // Check if service already exists
    if (!services.some((s) => s.id === service.id)) {
      setServices((prev) => [
        ...prev,
        { ...service, quantity: service.id === "elevators" ? 1 : undefined },
      ]);
    }
    setShowServicesDropdown(false);
  };

  const addCustomService = () => {
    if (customServiceName.trim()) {
      const newService: ProjectService = {
        id: `custom-${Date.now()}`,
        name: customServiceName,
        icon: Building2,
        isCustom: true,
      };
      setServices((prev) => [...prev, newService]);
      setCustomServiceName("");
      setShowCustomServiceInput(false);
    }
  };

  const updateServiceQuantity = (id: string, quantity: number) => {
    setServices((prev) =>
      prev.map((service) =>
        service.id === id ? { ...service, quantity } : service
      )
    );
  };

  const removeService = (id: string) => {
    setServices((prev) => prev.filter((service) => service.id !== id));
  };

  // Bulk Unit Creation Helper Functions
  const generateUnitCode = (
    projectCode: string,
    prefix: string,
    index: number
  ) => {
    return `${projectCode}-${prefix}${index}`;
  };

  const generatePreviewUnits = () => {
    const units = [];
    const projectCode = selectedProject?.project_code || "PRJ-001";

    for (let i = 1; i <= bulkUnitForm.numberOfCopies; i++) {
      const floorNumber =
        Math.floor(
          (i - 1) /
            Math.ceil(
              bulkUnitForm.numberOfCopies /
                (bulkUnitForm.floorEnd - bulkUnitForm.floorStart + 1)
            )
        ) + bulkUnitForm.floorStart;

      units.push({
        id: `preview-${i}`,
        code: generateUnitCode(projectCode, bulkUnitForm.unitPrefix, i),
        designName: bulkUnitForm.designName,
        area: parseFloat(bulkUnitForm.area) || 0,
        floor: floorNumber,
        rooms: parseInt(bulkUnitForm.rooms) || 0,
        bathrooms: parseInt(bulkUnitForm.bathrooms) || 0,
        price: parseFloat(bulkUnitForm.startingPrice) || 0,
        orientation: bulkUnitForm.orientation,
        view: bulkUnitForm.view,
        status: "available",
        description: bulkUnitForm.description,
      });
    }

    setPreviewUnits(units);
    setShowPreview(true);
  };

  const saveTemplate = () => {
    const template = {
      id: Date.now().toString(),
      name: bulkUnitForm.designName,
      ...bulkUnitForm,
    };
    setSavedTemplates((prev) => [...prev, template]);
    alert(
      language === "ar" ? "تم حفظ القالب بنجاح" : "Template saved successfully"
    );
  };

  const loadTemplate = (template: any) => {
    setBulkUnitForm(template);
    setSelectedTemplate(template);
  };

  const handleExcelUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      let data: any[] = [];
      let headers: string[] = [];
      try {
        const binary = e.target?.result;
        let workbook;
        if (file.name.endsWith(".csv")) {
          workbook = XLSX.read(binary, { type: "string" });
        } else {
          workbook = XLSX.read(binary, { type: "array" });
        }
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        data = XLSX.utils.sheet_to_json(sheet, { defval: "" });
        headers = Object.keys(data[0] || {});
      } catch (err) {
        setBulkProjectError(
          language === "ar"
            ? "ملف غير صالح أو صيغة غير مدعومة"
            : "Invalid or unsupported file format"
        );
        setShowExcelUpload(true);
        return;
      }
      if (!headers.includes("project_name")) {
        setBulkProjectError(
          language === "ar"
            ? "ملف Excel يجب أن يحتوي على عمود project_name"
            : "Excel file must contain a project_name column"
        );
        setShowExcelUpload(true);
        return;
      }
      // Map data
      const mapped = data.map((row: any) => ({
        project_name: (row["project_name"] || "").toString().trim(),
        code: (row["Unit Code"] || row["code"] || "").toString().trim(),
        designName: (row["Design Name"] || row["designName"] || "")
          .toString()
          .trim(),
        area: parseFloat(row["Area"] || row["area"] || "0") || 0,
        floor: parseInt(row["Floor"] || row["floor"] || "0") || 0,
        rooms: parseInt(row["Rooms"] || row["rooms"] || "0") || 0,
        bathrooms: parseInt(row["Baths"] || row["bathrooms"] || "0") || 0,
        view: (row["View"] || row["view"] || "").toString().trim(),
        orientation: (row["Orientation"] || row["orientation"] || "")
          .toString()
          .trim(),
        price: parseFloat(row["Price"] || row["price"] || "0") || 0,
        status: (row["Status"] || row["status"] || "available")
          .toString()
          .trim(),
        project_id: undefined as number | undefined,
      }));
      // Validate project_name for all rows
      const allProjects = [
        {
          id: 1,
          name:
            language === "ar"
              ? "مجمع الأناقة السكني"
              : "Elegance Residential Complex",
        },
        {
          id: 2,
          name:
            language === "ar" ? "برج التجارة المركزي" : "Central Trade Tower",
        },
        { id: 3, name: language === "ar" ? "قرية الهدوء" : "Tranquil Village" },
      ];
      for (const row of mapped) {
        const match = allProjects.find((p) => p.name === row.project_name);
        if (!match) {
          setBulkProjectError(
            language === "ar"
              ? "اسم المشروع غير معروف. يرجى التأكد من مطابقته تماماً للاسم في النظام."
              : "Project name not recognized. Please make sure it exactly matches the project name in the system."
          );
          setShowExcelUpload(true);
          return;
        }
        row.project_id = match.id;
      }
      setBulkProjectError("");
      setExcelPreviewData(mapped);
      setShowExcelUpload(true);
    };
    if (file.name.endsWith(".csv")) {
      reader.readAsText(file);
    } else {
      reader.readAsArrayBuffer(file);
    }
  };

  const confirmBulkUnits = () => {
    // Here you would typically save to backend
    console.log("Saving bulk units:", previewUnits);
    alert(
      language === "ar"
        ? `تم إنشاء ${previewUnits.length} وحدة بنجاح`
        : `Successfully created ${previewUnits.length} units`
    );
    setShowBulkUnitModal(false);
    setShowPreview(false);
    setPreviewUnits([]);
    setBulkUnitForm({
      designName: "",
      numberOfCopies: 1,
      area: "",
      rooms: "",
      bathrooms: "",
      startingPrice: "",
      floorStart: 1,
      floorEnd: 1,
      orientation: "north",
      view: "front",
      description: "",
      unitPrefix: "A",
    });
  };

  const confirmExcelImport = () => {
    // Here you would typically save to backend
    console.log("Importing Excel units:", excelPreviewData);
    alert(
      language === "ar"
        ? `تم استيراد ${excelPreviewData.length} وحدة بنجاح`
        : `Successfully imported ${excelPreviewData.length} units`
    );
    setShowExcelUpload(false);
    setExcelPreviewData([]);
    setExcelFile(null);
  };

  const removePreviewUnit = (id: string) => {
    setPreviewUnits((prev) => prev.filter((unit) => unit.id !== id));
  };

  const removeExcelUnit = (index: number) => {
    setExcelPreviewData((prev) => prev.filter((_, i) => i !== index));
  };

  const handleView = (project: any) => {
    setSelectedProject(project);
  };

  const handleEdit = (project: any) => {
    setSelectedProject(project);

    // Set features from project
    if (project.features) {
      setFeatures(
        project.features.map((text: string) => ({
          id: Date.now() + Math.random().toString(),
          text,
        }))
      );
    }

    // Set payment plan
    setSelectedPaymentPlan(project.paymentPlan || "");

    // Set bank name if available
    if (project.bankName) {
      setBankName(project.bankName);
    }

    setShowCreateModal(true);
  };

  const handleDelete = (project: any) => {
    if (
      confirm(
        language === "ar"
          ? "هل أنت متأكد من حذف هذا المشروع؟"
          : "Are you sure you want to delete this project?"
      )
    ) {
      console.log("Delete project:", project);
    }
  };

  // Fetch projects for bulk modal
  const fetchBulkProjects = async () => {
    // Mock API call
    setTimeout(() => {
      setBulkProjects([
        {
          id: 1,
          name:
            language === "ar"
              ? "مجمع الأناقة السكني"
              : "Elegance Residential Complex",
        },
        {
          id: 2,
          name:
            language === "ar" ? "برج التجارة المركزي" : "Central Trade Tower",
        },
        { id: 3, name: language === "ar" ? "قرية الهدوء" : "Tranquil Village" },
      ]);
    }, 500);
  };

  // Add Bulk Units button handler
  const handleAddBulkUnits = () => {
    setShowProjectSelectionModal(true);
    fetchBulkProjects();
  };

  const [dragActiveExcel, setDragActiveExcel] = useState(false);

  return (
    <PageWrapper>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-elegant-white">
              {language === "ar" ? "المشاريع والوحدات" : "Projects & Units"}
            </h1>
            <p className="text-stone-gray mt-1">
              {language === "ar"
                ? "إدارة المشاريع العقارية والوحدات"
                : "Manage real estate projects and units"}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <motion.button
              onClick={() => router.push("/dashboard/projects/create")}
              className="bg-heritage-beige text-elite-black px-6 py-3 rounded-lg font-medium hover:bg-heritage-beige/90 transition-all duration-300 flex items-center space-x-2 rtl:space-x-reverse"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Plus className="h-5 w-5" />
              <span>
                {language === "ar"
                  ? "مشروع جديد (معالج)"
                  : "New Project (Wizard)"}
              </span>
            </motion.button>
            <motion.button
              onClick={() => setShowCreateModal(true)}
              className="bg-desert-gold text-deep-black px-6 py-3 rounded-lg font-medium hover:bg-warm-sand transition-all duration-300 flex items-center space-x-2 rtl:space-x-reverse"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Plus className="h-5 w-5" />
              <span>
                {language === "ar"
                  ? "مشروع جديد (نموذج)"
                  : "New Project (Form)"}
              </span>
            </motion.button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-obsidian/50 backdrop-blur-sm rounded-lg p-6 border border-desert-gold/20"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-stone-gray text-sm">
                  {language === "ar" ? "إجمالي المشاريع" : "Total Projects"}
                </p>
                <p className="text-2xl font-bold text-elegant-white">3</p>
              </div>
              <div className="p-3 bg-blue-500/20 rounded-lg">
                <Building2 className="h-6 w-6 text-blue-500" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-obsidian/50 backdrop-blur-sm rounded-lg p-6 border border-desert-gold/20"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-stone-gray text-sm">
                  {language === "ar" ? "إجمالي الوحدات" : "Total Units"}
                </p>
                <p className="text-2xl font-bold text-elegant-white">290</p>
              </div>
              <div className="p-3 bg-green-500/20 rounded-lg">
                <Users className="h-6 w-6 text-green-500" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-obsidian/50 backdrop-blur-sm rounded-lg p-6 border border-desert-gold/20"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-stone-gray text-sm">
                  {language === "ar" ? "الوحدات المباعة" : "Sold Units"}
                </p>
                <p className="text-2xl font-bold text-elegant-white">165</p>
              </div>
              <div className="p-3 bg-yellow-500/20 rounded-lg">
                <TrendingUp className="h-6 w-6 text-yellow-500" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-obsidian/50 backdrop-blur-sm rounded-lg p-6 border border-desert-gold/20"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-stone-gray text-sm">
                  {language === "ar" ? "معدل البيع" : "Sales Rate"}
                </p>
                <p className="text-2xl font-bold text-elegant-white">57%</p>
              </div>
              <div className="p-3 bg-purple-500/20 rounded-lg">
                <Calendar className="h-6 w-6 text-purple-500" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Tabs */}
        <div className="border-b border-desert-gold/20">
          <nav className="flex space-x-8 rtl:space-x-reverse">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-3 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors duration-200 ${
                  activeTab === tab.id
                    ? "border-desert-gold text-desert-gold"
                    : "border-transparent text-stone-gray hover:text-elegant-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="mt-6">
          {activeTab === "list" && (
            <DataTable
              columns={columns}
              data={projects}
              searchPlaceholder={
                language === "ar"
                  ? "البحث في المشاريع..."
                  : "Search projects..."
              }
              filterOptions={filterOptions}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onRowClick={(row) => {
                // row.id is the project id
                router.push(`/dashboard/projects/${row.id}`);
              }}
            />
          )}

          {activeTab === "analytics" && (
            <div className="bg-obsidian/50 backdrop-blur-sm rounded-xl p-8 border border-desert-gold/20">
              <h2 className="text-2xl font-bold text-elegant-white mb-6">
                {language === "ar" ? "تحليلات المشاريع" : "Project Analytics"}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project, index) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-stone-gray/10 rounded-lg p-6"
                  >
                    <h3 className="text-lg font-bold text-elegant-white mb-4">
                      {project.name}
                    </h3>

                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-stone-gray">
                          {language === "ar" ? "الميزانية:" : "Budget:"}
                        </span>
                        <span className="text-elegant-white">
                          {project.budget} {language === "ar" ? "ريال" : "SAR"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-stone-gray">
                          {language === "ar" ? "الإيرادات:" : "Revenue:"}
                        </span>
                        <span className="text-green-400">
                          {project.revenue} {language === "ar" ? "ريال" : "SAR"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-stone-gray">
                          {language === "ar" ? "معدل البيع:" : "Sales Rate:"}
                        </span>
                        <span className="text-desert-gold">
                          {Math.round(
                            (project.soldUnits / project.totalUnits) * 100
                          )}
                          %
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 bg-stone-gray/20 rounded-full h-2">
                      <div
                        className="bg-desert-gold h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${
                            (project.soldUnits / project.totalUnits) * 100
                          }%`,
                        }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "units" && (
            <div className="bg-obsidian/50 backdrop-blur-sm rounded-xl p-8 border border-desert-gold/20">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <h2 className="text-2xl font-bold text-elegant-white">
                  {language === "ar" ? "إدارة الوحدات" : "Unit Management"}
                </h2>
                <div className="flex flex-col sm:flex-row gap-3">
                  <motion.button
                    onClick={handleAddBulkUnits}
                    className="bg-desert-gold text-deep-black px-4 py-2 rounded-lg font-medium hover:bg-warm-sand transition-all duration-300 flex items-center space-x-2 rtl:space-x-reverse"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Plus className="h-4 w-4" />
                    <span>
                      {language === "ar"
                        ? "إضافة وحدات بشكل جماعي"
                        : "Add Bulk Units"}
                    </span>
                  </motion.button>

                  <motion.button
                    onClick={() => setShowExcelUpload(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-all duration-300 flex items-center space-x-2 rtl:space-x-reverse"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Upload className="h-4 w-4" />
                    <span>
                      {language === "ar" ? "استيراد ملف Excel" : "Upload Excel"}
                    </span>
                  </motion.button>
                </div>
              </div>

              {/* Project Selection */}
              <div className="mb-6">
                <label className="block text-elegant-white font-medium mb-2">
                  {language === "ar" ? "اختر المشروع:" : "Select Project:"}
                </label>
                <SelectContext
                  options={projects.map((project) => ({
                    value: project.id.toString(),
                    label: { ar: project.name, en: project.name },
                  }))}
                  value={""}
                  onChange={() => {}}
                  placeholder={
                    language === "ar"
                      ? "اختر مشروع لإدارة وحداته"
                      : "Select a project to manage its units"
                  }
                  language={language}
                />
              </div>

              {/* Units Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-stone-gray/10 rounded-lg p-4 border border-desert-gold/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-stone-gray text-sm">
                        {language === "ar" ? "إجمالي الوحدات" : "Total Units"}
                      </p>
                      <p className="text-xl font-bold text-elegant-white">0</p>
                    </div>
                    <div className="p-2 bg-blue-500/20 rounded-lg">
                      <Building2 className="h-5 w-5 text-blue-500" />
                    </div>
                  </div>
                </div>

                <div className="bg-stone-gray/10 rounded-lg p-4 border border-desert-gold/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-stone-gray text-sm">
                        {language === "ar" ? "متاح للبيع" : "Available"}
                      </p>
                      <p className="text-xl font-bold text-green-400">0</p>
                    </div>
                    <div className="p-2 bg-green-500/20 rounded-lg">
                      <Check className="h-5 w-5 text-green-500" />
                    </div>
                  </div>
                </div>

                <div className="bg-stone-gray/10 rounded-lg p-4 border border-desert-gold/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-stone-gray text-sm">
                        {language === "ar" ? "محجوز" : "Reserved"}
                      </p>
                      <p className="text-xl font-bold text-yellow-400">0</p>
                    </div>
                    <div className="p-2 bg-yellow-500/20 rounded-lg">
                      <Clock className="h-5 w-5 text-yellow-500" />
                    </div>
                  </div>
                </div>

                <div className="bg-stone-gray/10 rounded-lg p-4 border border-desert-gold/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-stone-gray text-sm">
                        {language === "ar" ? "مباع" : "Sold"}
                      </p>
                      <p className="text-xl font-bold text-red-400">0</p>
                    </div>
                    <div className="p-2 bg-red-500/20 rounded-lg">
                      <TrendingUp className="h-5 w-5 text-red-500" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Units Table Placeholder */}
              <div className="text-center py-12">
                <Building2 className="h-16 w-16 text-desert-gold mx-auto mb-4" />
                <h3 className="text-xl font-bold text-elegant-white mb-2">
                  {language === "ar" ? "لا توجد وحدات بعد" : "No Units Yet"}
                </h3>
                <p className="text-stone-gray mb-6">
                  {language === "ar"
                    ? "ابدأ بإضافة وحدات للمشروع المحدد"
                    : "Start by adding units to the selected project"}
                </p>
                <motion.button
                  onClick={() => setShowBulkUnitModal(true)}
                  className="bg-desert-gold text-deep-black px-6 py-3 rounded-lg font-medium hover:bg-warm-sand transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {language === "ar" ? "إضافة وحدات" : "Add Units"}
                </motion.button>
              </div>
            </div>
          )}
        </div>

        {/* Create Project Modal */}
        <Modal
          isOpen={showCreateModal}
          onClose={() => {
            setShowCreateModal(false);
            setSelectedProject(null);
            setProjectImages([]);
            setProjectLicense(null);
            setFeatures([]);
            setSelectedPaymentPlan("");
            setBankName("");
            setServices([]);
          }}
          title={
            selectedProject
              ? language === "ar"
                ? "تعديل المشروع"
                : "Edit Project"
              : language === "ar"
              ? "مشروع جديد"
              : "New Project"
          }
          size="xl"
        >
          <form className="space-y-8">
            {/* 🧱 Basic Info Section */}
            <div className="bg-obsidian/70 rounded-lg p-6 border border-desert-gold/20">
              <h3 className="text-xl font-bold text-desert-gold mb-6 flex items-center">
                <Building2 className="h-5 w-5 mr-2" />
                {language === "ar" ? "🧱 المعلومات الأساسية" : "🧱 Basic Info"}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  label={
                    language === "ar"
                      ? "اسم المشروع (بالعربية)"
                      : "Project Name (Arabic)"
                  }
                  required
                >
                  <input
                    type="text"
                    name="project_name_ar"
                    defaultValue={selectedProject?.name_ar || ""}
                    className="w-full bg-stone-gray/10 border border-desert-gold/20 rounded-lg px-4 py-3 text-elegant-white placeholder-stone-gray focus:outline-none focus:border-desert-gold transition-colors duration-300"
                    placeholder={
                      language === "ar"
                        ? "اسم المشروع (بالعربية)"
                        : "Project Name (Arabic)"
                    }
                  />
                </FormField>

                <FormField
                  label={
                    language === "ar"
                      ? "اسم المشروع (بالإنجليزية)"
                      : "Project Name (English)"
                  }
                  required
                >
                  <input
                    type="text"
                    name="project_name_en"
                    defaultValue={selectedProject?.name_en || ""}
                    className="w-full bg-stone-gray/10 border border-desert-gold/20 rounded-lg px-4 py-3 text-elegant-white placeholder-stone-gray focus:outline-none focus:border-desert-gold transition-colors duration-300"
                    placeholder={
                      language === "ar"
                        ? "Project Name (English)"
                        : "Project Name (English)"
                    }
                  />
                </FormField>

                <FormField
                  label={language === "ar" ? "رمز المشروع" : "Project Code"}
                >
                  <input
                    type="text"
                    name="project_code"
                    defaultValue={selectedProject?.project_code || ""}
                    className="w-full bg-stone-gray/10 border border-desert-gold/20 rounded-lg px-4 py-3 text-elegant-white placeholder-stone-gray focus:outline-none focus:border-desert-gold transition-colors duration-300"
                    placeholder={
                      language === "ar"
                        ? "رمز المشروع (مثل PRJ-001)"
                        : "Project Code (e.g., PRJ-001)"
                    }
                  />
                </FormField>

                <FormField
                  label={language === "ar" ? "المدينة" : "City"}
                  required
                >
                  <SelectContext
                    options={[
                      {
                        value: "riyadh",
                        label: { ar: "الرياض", en: "Riyadh" },
                      },
                      { value: "jeddah", label: { ar: "جدة", en: "Jeddah" } },
                      {
                        value: "dammam",
                        label: { ar: "الدمام", en: "Dammam" },
                      },
                      {
                        value: "makkah",
                        label: { ar: "مكة المكرمة", en: "Makkah" },
                      },
                    ]}
                    value={""}
                    onChange={() => {}}
                    placeholder={
                      language === "ar" ? "اختر المدينة" : "Select City"
                    }
                    language={language}
                  />
                </FormField>

                <FormField
                  label={language === "ar" ? "المنطقة / الحي" : "District"}
                  required
                >
                  <input
                    type="text"
                    name="district"
                    defaultValue={selectedProject?.district || ""}
                    className="w-full bg-stone-gray/10 border border-desert-gold/20 rounded-lg px-4 py-3 text-elegant-white placeholder-stone-gray focus:outline-none focus:border-desert-gold transition-colors duration-300"
                    placeholder={
                      language === "ar"
                        ? "المنطقة / الحي"
                        : "District / Neighborhood"
                    }
                  />
                </FormField>

                <FormField
                  label={language === "ar" ? "العنوان الكامل" : "Full Address"}
                  className="md:col-span-2"
                >
                  <input
                    type="text"
                    name="address"
                    defaultValue={selectedProject?.address || ""}
                    className="w-full bg-stone-gray/10 border border-desert-gold/20 rounded-lg px-4 py-3 text-elegant-white placeholder-stone-gray focus:outline-none focus:border-desert-gold transition-colors duration-300"
                    placeholder={
                      language === "ar"
                        ? "العنوان الكامل للموقع"
                        : "Complete address of the location"
                    }
                  />
                </FormField>
              </div>
            </div>

            {/* 📎 Ownership & Document Details Section */}
            <div className="bg-obsidian/70 rounded-lg p-6 border border-desert-gold/20">
              <h3 className="text-xl font-bold text-desert-gold mb-6 flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                {language === "ar"
                  ? "📎 الملكية وتفاصيل الوثائق"
                  : "📎 Ownership & Document Details"}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  label={language === "ar" ? "رقم المخطط" : "Plan Number"}
                >
                  <input
                    type="text"
                    name="plan_number"
                    defaultValue={selectedProject?.plan_number || ""}
                    className="w-full bg-stone-gray/10 border border-desert-gold/20 rounded-lg px-4 py-3 text-elegant-white placeholder-stone-gray focus:outline-none focus:border-desert-gold transition-colors duration-300"
                    placeholder={
                      language === "ar" ? "رقم المخطط" : "Plan Number"
                    }
                  />
                </FormField>

                <FormField
                  label={language === "ar" ? "رقم القطعة" : "Piece Number"}
                >
                  <input
                    type="text"
                    name="piece_number"
                    defaultValue={selectedProject?.piece_number || ""}
                    className="w-full bg-stone-gray/10 border border-desert-gold/20 rounded-lg px-4 py-3 text-elegant-white placeholder-stone-gray focus:outline-none focus:border-desert-gold transition-colors duration-300"
                    placeholder={
                      language === "ar" ? "رقم القطعة" : "Piece Number"
                    }
                  />
                </FormField>

                <FormField
                  label={language === "ar" ? "رقم الصك" : "Deed Number"}
                >
                  <input
                    type="text"
                    name="deed_number"
                    defaultValue={selectedProject?.deed_number || ""}
                    className="w-full bg-stone-gray/10 border border-desert-gold/20 rounded-lg px-4 py-3 text-elegant-white placeholder-stone-gray focus:outline-none focus:border-desert-gold transition-colors duration-300"
                    placeholder={language === "ar" ? "رقم الصك" : "Deed Number"}
                  />
                </FormField>

                <FormField
                  label={language === "ar" ? "مكان الإصدار" : "Issuing Place"}
                >
                  <input
                    type="text"
                    name="issuing_place"
                    defaultValue={selectedProject?.issuing_place || ""}
                    className="w-full bg-stone-gray/10 border border-desert-gold/20 rounded-lg px-4 py-3 text-elegant-white placeholder-stone-gray focus:outline-none focus:border-desert-gold transition-colors duration-300"
                    placeholder={
                      language === "ar" ? "مكان الإصدار" : "Issuing Place"
                    }
                  />
                </FormField>

                <FormField
                  label={language === "ar" ? "تاريخ الإصدار" : "Issuing Date"}
                >
                  <input
                    type="date"
                    name="issuing_date"
                    defaultValue={selectedProject?.issuing_date || ""}
                    className="w-full bg-stone-gray/10 border border-desert-gold/20 rounded-lg px-4 py-3 text-elegant-white focus:outline-none focus:border-desert-gold transition-colors duration-300"
                  />
                </FormField>

                <FormField label={language === "ar" ? "الجهة" : "Organization"}>
                  <input
                    type="text"
                    name="organization"
                    defaultValue={selectedProject?.organization || ""}
                    className="w-full bg-stone-gray/10 border border-desert-gold/20 rounded-lg px-4 py-3 text-elegant-white placeholder-stone-gray focus:outline-none focus:border-desert-gold transition-colors duration-300"
                    placeholder={language === "ar" ? "الجهة" : "Organization"}
                  />
                </FormField>
              </div>
            </div>

            {/* 🧩 Additional Info Section */}
            <div className="bg-obsidian/70 rounded-lg p-6 border border-desert-gold/20">
              <h3 className="text-xl font-bold text-desert-gold mb-6 flex items-center">
                <Settings className="h-5 w-5 mr-2" />
                {language === "ar" ? "🧩 معلومات إضافية" : "🧩 Additional Info"}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  label={
                    language === "ar" ? "شركة الإنشاء" : "Contractor Company"
                  }
                >
                  <input
                    type="text"
                    name="contractor_company"
                    defaultValue={selectedProject?.contractor_company || ""}
                    className="w-full bg-stone-gray/10 border border-desert-gold/20 rounded-lg px-4 py-3 text-elegant-white placeholder-stone-gray focus:outline-none focus:border-desert-gold transition-colors duration-300"
                    placeholder={
                      language === "ar"
                        ? "اسم شركة الإنشاء (اختياري)"
                        : "Contractor Company Name (Optional)"
                    }
                  />
                </FormField>

                <FormField
                  label={language === "ar" ? "حالة المشروع" : "Project Status"}
                  required
                >
                  <SelectContext
                    options={[
                      {
                        value: "ready",
                        label: { ar: "جاهز للبيع ✅", en: "Ready for Sale ✅" },
                      },
                      {
                        value: "sold",
                        label: {
                          ar: "تم البيع بالكامل 🏁",
                          en: "Fully Sold 🏁",
                        },
                      },
                      {
                        value: "under-construction",
                        label: {
                          ar: "قيد الإنشاء 🔨",
                          en: "Under Construction 🔨",
                        },
                      },
                      {
                        value: "on-hold",
                        label: { ar: "متوقف ⏸️", en: "On Hold ⏸️" },
                      },
                    ]}
                    value={selectedProject?.status || "ready"}
                    onChange={() => {}}
                    placeholder={
                      language === "ar"
                        ? "اختر حالة المشروع"
                        : "Select Project Status"
                    }
                    language={language}
                  />
                </FormField>

                <FormField
                  label={
                    language === "ar" ? "مندوب المشروع" : "Sales Representative"
                  }
                  required
                >
                  <SelectContext
                    options={[
                      {
                        value: "unassigned",
                        label: {
                          ar: "اختر مندوب المشروع",
                          en: "Select Sales Representative",
                        },
                      },
                      {
                        value: "ahmed",
                        label: { ar: "أحمد العتيبي", en: "Ahmed Al-Otaibi" },
                      },
                      {
                        value: "fatima",
                        label: { ar: "فاطمة الحربي", en: "Fatima Al-Harbi" },
                      },
                      {
                        value: "khalid",
                        label: { ar: "خالد المطيري", en: "Khalid Al-Mutairi" },
                      },
                    ]}
                    value={selectedProject?.sales_rep || ""}
                    onChange={() => {}}
                    placeholder={
                      language === "ar"
                        ? "اختر مندوب المشروع"
                        : "Select Sales Representative"
                    }
                    language={language}
                  />
                </FormField>

                <FormField
                  label={
                    language === "ar" ? "وصف المشروع" : "Project Description"
                  }
                  className="md:col-span-2"
                >
                  <textarea
                    name="project_description"
                    rows={4}
                    defaultValue={selectedProject?.description || ""}
                    className="w-full bg-stone-gray/10 border border-desert-gold/20 rounded-lg px-4 py-3 text-elegant-white placeholder-stone-gray focus:outline-none focus:border-desert-gold transition-colors duration-300 resize-none"
                    placeholder={
                      language === "ar"
                        ? "وصف موجز للمشروع"
                        : "Brief project description"
                    }
                  />
                </FormField>

                <FormField
                  label={
                    language === "ar" ? "ملاحظات داخلية" : "Internal Notes"
                  }
                  className="md:col-span-2"
                >
                  <textarea
                    name="internal_notes"
                    rows={3}
                    defaultValue={selectedProject?.internal_notes || ""}
                    className="w-full bg-stone-gray/10 border border-desert-gold/20 rounded-lg px-4 py-3 text-elegant-white placeholder-stone-gray focus:outline-none focus:border-desert-gold transition-colors duration-300 resize-none"
                    placeholder={
                      language === "ar"
                        ? "ملاحظات داخلية (للإدارة)"
                        : "Internal notes (for management)"
                    }
                  />
                </FormField>
              </div>
            </div>

            {/* 📷 Media Upload Section */}
            <div className="bg-obsidian/70 rounded-lg p-6 border border-desert-gold/20">
              <h3 className="text-xl font-bold text-desert-gold mb-6 flex items-center">
                <Image className="h-5 w-5 mr-2" />
                {language === "ar" ? "📷 رفع الوسائط" : "📷 Media Upload"}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  label={language === "ar" ? "صور المشروع" : "Project Images"}
                >
                  <div
                    className={`border-2 border-dashed rounded-lg p-6 text-center transition-all duration-300 ${
                      dragActive
                        ? "border-desert-gold bg-desert-gold/10"
                        : "border-desert-gold/30 hover:border-desert-gold/50"
                    }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    <Upload className="h-8 w-8 text-desert-gold mx-auto mb-3" />
                    <p className="text-stone-gray mb-2">
                      {language === "ar"
                        ? "اسحب وأفلت الصور هنا"
                        : "Drag and drop images here"}
                    </p>
                    <input
                      type="file"
                      name="project_images"
                      accept="image/*"
                      multiple
                      ref={fileInputRef}
                      onChange={(e) =>
                        handleProjectImages(
                          e.target.files ? Array.from(e.target.files) : []
                        )
                      }
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-desert-gold/20 text-desert-gold px-4 py-2 rounded-lg hover:bg-desert-gold/30 transition-colors duration-200"
                    >
                      {language === "ar" ? "اختر الصور" : "Choose Images"}
                    </button>
                  </div>

                  {projectImages.length > 0 && (
                    <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {projectImages.map((image, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={URL.createObjectURL(image)}
                            alt={`Project image ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-1 right-1 bg-deep-black/70 text-red-400 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </FormField>

                <div className="space-y-6">
                  <FormField
                    label={language === "ar" ? "صورة المخطط" : "Plan Image"}
                  >
                    <UploadLabel
                      htmlFor="plan-image"
                      label={
                        language === "ar"
                          ? "رفع صورة المخطط"
                          : "Upload Plan Image"
                      }
                      withBorder
                    />
                  </FormField>

                  <FormField
                    label={language === "ar" ? "شعار المشروع" : "Project Logo"}
                  >
                    <div className="border-2 border-dashed border-desert-gold/30 rounded-lg p-4 text-center hover:border-desert-gold/50 transition-colors duration-300">
                      <input
                        type="file"
                        name="logo_image"
                        accept="image/*"
                        className="hidden"
                        id="logo-image"
                      />
                      <label htmlFor="logo-image" className="cursor-pointer">
                        <Upload className="h-6 w-6 text-desert-gold mx-auto mb-2" />
                        <p className="text-stone-gray text-sm">
                          {language === "ar"
                            ? "رفع شعار المشروع"
                            : "Upload Project Logo"}
                        </p>
                      </label>
                    </div>
                  </FormField>
                </div>
              </div>
            </div>

            {/* 📊 Project Metrics Section */}
            <div className="bg-obsidian/70 rounded-lg p-6 border border-desert-gold/20">
              <h3 className="text-xl font-bold text-desert-gold mb-6 flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                {language === "ar" ? "📊 مقاييس المشروع" : "📊 Project Metrics"}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  label={language === "ar" ? "عدد المباني" : "Building Count"}
                >
                  <input
                    type="number"
                    name="building_count"
                    defaultValue={selectedProject?.building_count || ""}
                    className="w-full bg-stone-gray/10 border border-desert-gold/20 rounded-lg px-4 py-3 text-elegant-white placeholder-stone-gray focus:outline-none focus:border-desert-gold transition-colors duration-300"
                    placeholder={
                      language === "ar" ? "عدد المباني" : "Number of Buildings"
                    }
                    min="0"
                  />
                </FormField>

                <FormField
                  label={
                    language === "ar"
                      ? "عدد الأدوار لكل مبنى"
                      : "Floors Per Building"
                  }
                >
                  <input
                    type="number"
                    name="floors_per_building"
                    defaultValue={selectedProject?.floors_per_building || ""}
                    className="w-full bg-stone-gray/10 border border-desert-gold/20 rounded-lg px-4 py-3 text-elegant-white placeholder-stone-gray focus:outline-none focus:border-desert-gold transition-colors duration-300"
                    placeholder={
                      language === "ar"
                        ? "عدد الأدوار لكل مبنى"
                        : "Number of Floors per Building"
                    }
                    min="0"
                  />
                </FormField>

                <FormField
                  label={language === "ar" ? "أقل سعر" : "Minimum Unit Price"}
                >
                  <input
                    type="number"
                    name="min_unit_price"
                    defaultValue={selectedProject?.min_unit_price || ""}
                    className="w-full bg-stone-gray/10 border border-desert-gold/20 rounded-lg px-4 py-3 text-elegant-white placeholder-stone-gray focus:outline-none focus:border-desert-gold transition-colors duration-300"
                    placeholder={
                      language === "ar" ? "أقل سعر" : "Minimum Price"
                    }
                    min="0"
                  />
                </FormField>

                <FormField
                  label={language === "ar" ? "سعر البيع" : "Average Unit Price"}
                >
                  <input
                    type="number"
                    name="avg_unit_price"
                    defaultValue={selectedProject?.avg_unit_price || ""}
                    className="w-full bg-stone-gray/10 border border-desert-gold/20 rounded-lg px-4 py-3 text-elegant-white placeholder-stone-gray focus:outline-none focus:border-desert-gold transition-colors duration-300"
                    placeholder={
                      language === "ar" ? "سعر البيع" : "Average Price"
                    }
                    min="0"
                  />
                </FormField>
              </div>
            </div>

            <div className="flex justify-end space-x-4 rtl:space-x-reverse pt-6">
              <motion.button
                type="button"
                onClick={() => {
                  setShowCreateModal(false);
                  setSelectedProject(null);
                }}
                className="px-6 py-3 border border-desert-gold/20 text-stone-gray rounded-lg hover:bg-stone-gray/10 transition-all duration-300"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {language === "ar" ? "إلغاء" : "Cancel"}
              </motion.button>
              <motion.button
                type="submit"
                className="px-6 py-3 bg-desert-gold text-deep-black rounded-lg font-medium hover:bg-warm-sand transition-all duration-300"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {language === "ar" ? "حفظ" : "Save"}
              </motion.button>
            </div>
          </form>
        </Modal>

        {/* Bulk Unit Creation Modal */}
        <Modal
          isOpen={showBulkUnitModal}
          onClose={() => {
            setShowBulkUnitModal(false);
            setShowPreview(false);
            setPreviewUnits([]);
            setBulkUnitForm({
              designName: "",
              numberOfCopies: 1,
              area: "",
              rooms: "",
              bathrooms: "",
              startingPrice: "",
              floorStart: 1,
              floorEnd: 1,
              orientation: "north",
              view: "front",
              description: "",
              unitPrefix: "A",
            });
          }}
          title={
            language === "ar"
              ? "نظام الإدخال الذكي للوحدات"
              : "Bulk Unit Creation System"
          }
          size="xl"
        >
          {!showPreview ? (
            <div className="space-y-8">
              {/* Template Selection */}
              {savedTemplates.length > 0 && (
                <div className="bg-obsidian/70 rounded-xl p-6 border border-desert-gold/20">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-bold text-desert-gold flex items-center">
                      <FileText className="h-5 w-5 mr-2" />
                      {language === "ar"
                        ? "القوالب المحفوظة"
                        : "Saved Templates"}
                    </h4>
                    <span className="text-stone-gray text-sm">
                      {language === "ar"
                        ? `${savedTemplates.length} قالب`
                        : `${savedTemplates.length} templates`}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {savedTemplates.map((template) => (
                      <button
                        key={template.id}
                        onClick={() => loadTemplate(template)}
                        className={`p-4 rounded-xl border transition-all duration-300 t-left hover:scale-105 ${
                          selectedTemplate?.id === template.id
                            ? "border-desert-gold bg-desert-gold/10 shadow-lg"
                            : "border-desert-gold/20 over:border-desert-gold/40 bg-stone-gray/5"
                        }`}
                      >
                        <div className="font-semibold text-elegant-white mb-1">
                          {template.name}
                        </div>
                        <div className="text-sm text-stone-gray space-y-1">
                          <div>
                            {language === "ar"
                              ? `${template.numberOfCopies} وحدة`
                              : `${template.numberOfCopies} units`}
                          </div>
                          <div>
                            {template.area} m² • {template.rooms}/
                            {template.bathrooms}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Bulk Unit Form */}
              <div className="bg-obsidian/70 rounded-xl p-8 border border-desert-gold/20">
                <div className="flex items-center mb-6">
                  <div className="p-3 bg-desert-gold/20 rounded-lg mr-4">
                    <Building2 className="h-6 w-6 text-desert-gold" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-desert-gold">
                      {language === "ar" ? "تفاصيل الوحدة" : "Unit Details"}
                    </h4>
                    <p className="text-stone-gray text-sm">
                      {language === "ar"
                        ? "أدخل تفاصيل الوحدة التي تريد إنشاء نسخ منها : Enter details of the unit you want to create copies of"
                        : "Enter details of the unit you want to create copies of"}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Basic Information */}
                  <div className="space-y-6">
                    <h5 className="text-lg font-semibold text-elegant-white border-b border-desert-gold/20 pb-2">
                      {language === "ar"
                        ? "المعلومات الأساسية"
                        : "Basic Information"}
                    </h5>

                    <FormField
                      label={language === "ar" ? "اسم التصميم" : "Design Name"}
                      required
                    >
                      <input
                        type="text"
                        value={bulkUnitForm.designName}
                        onChange={(e) =>
                          setBulkUnitForm((prev) => ({
                            ...prev,
                            designName: e.target.value,
                          }))
                        }
                        className="w-full bg-stone-gray/10 border border-desert-gold/20 rounded-lg px-4 py-3 text-elegant-white placeholder-stone-gray focus:outline-none focus:border-desert-gold transition-colors duration-300"
                        placeholder={
                          language === "ar"
                            ? "مثال: شقة 5 غرف نوم"
                            : "e.g., 5 Bedroom Apartment"
                        }
                      />
                    </FormField>

                    <FormField
                      label={
                        language === "ar" ? "عدد النسخ" : "Number of Copies"
                      }
                      required
                    >
                      <input
                        type="number"
                        value={bulkUnitForm.numberOfCopies}
                        onChange={(e) =>
                          setBulkUnitForm((prev) => ({
                            ...prev,
                            numberOfCopies: parseInt(e.target.value) || 1,
                          }))
                        }
                        className="w-full bg-stone-gray/10 border border-desert-gold/20 rounded-lg px-4 py-3 text-elegant-white placeholder-stone-gray focus:outline-none focus:border-desert-gold transition-colors duration-300"
                        placeholder="40"
                        min="1"
                      />
                    </FormField>

                    <FormField
                      label={language === "ar" ? "المساحة (م²)" : "Area (m²)"}
                      required
                    >
                      <input
                        type="number"
                        value={bulkUnitForm.area}
                        onChange={(e) =>
                          setBulkUnitForm((prev) => ({
                            ...prev,
                            area: e.target.value,
                          }))
                        }
                        className="w-full bg-stone-gray/10 border border-desert-gold/20 rounded-lg px-4 py-3 text-elegant-white placeholder-stone-gray focus:outline-none focus:border-desert-gold transition-colors duration-300"
                        placeholder="180"
                        min="0"
                      />
                    </FormField>

                    <FormField
                      label={
                        language === "ar"
                          ? "الغرف / الحمامات"
                          : "Rooms / Bathrooms"
                      }
                    >
                      <div className="flex space-x-3 rtl:space-x-reverse">
                        <div className="flex-1">
                          <label className="block text-stone-gray text-sm mb-2">
                            {language === "ar" ? "الغرف" : "Rooms"}
                          </label>
                          <input
                            type="number"
                            value={bulkUnitForm.rooms}
                            onChange={(e) =>
                              setBulkUnitForm((prev) => ({
                                ...prev,
                                rooms: e.target.value,
                              }))
                            }
                            className="w-full bg-stone-gray/10 border border-desert-gold/20 rounded-lg px-4 py-3 text-elegant-white placeholder-stone-gray focus:outline-none focus:border-desert-gold transition-colors duration-300"
                            placeholder="5"
                            min="0"
                          />
                        </div>
                        <div className="flex-1">
                          <label className="block text-stone-gray text-sm mb-2">
                            {language === "ar" ? "الحمامات" : "Bathrooms"}
                          </label>
                          <input
                            type="number"
                            value={bulkUnitForm.bathrooms}
                            onChange={(e) =>
                              setBulkUnitForm((prev) => ({
                                ...prev,
                                bathrooms: e.target.value,
                              }))
                            }
                            className="w-full bg-stone-gray/10 border border-desert-gold/20 rounded-lg px-4 py-3 text-elegant-white placeholder-stone-gray focus:outline-none focus:border-desert-gold transition-colors duration-300"
                            placeholder="4"
                            min="0"
                          />
                        </div>
                      </div>
                    </FormField>
                  </div>

                  {/* Advanced Settings */}
                  <div className="space-y-6">
                    <h5 className="text-lg font-semibold text-elegant-white border-b border-desert-gold/20 pb-2">
                      {language === "ar"
                        ? "الإعدادات المتقدمة"
                        : "Advanced Settings"}
                    </h5>

                    <FormField
                      label={
                        language === "ar" ? "السعر الابتدائي" : "Starting Price"
                      }
                    >
                      <div className="relative">
                        <input
                          type="number"
                          value={bulkUnitForm.startingPrice}
                          onChange={(e) =>
                            setBulkUnitForm((prev) => ({
                              ...prev,
                              startingPrice: e.target.value,
                            }))
                          }
                          className="w-full bg-stone-gray/10 border border-desert-gold/20 ounded-lg pl-12r-4 py-3 text-elegant-white placeholder-stone-gray focus:outline-none focus:border-desert-gold transition-colors duration-300"
                          placeholder="500000"
                          min="0"
                        />
                        <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-stone-gray">
                          {language === "ar" ? "ر.س" : "SAR"}
                        </span>
                      </div>
                    </FormField>

                    <FormField
                      label={
                        language === "ar"
                          ? "توزيع الأدوار"
                          : "Floor Distribution"
                      }
                    >
                      <div className="space-y-3">
                        <div className="flex space-x-3 rtl:space-x-reverse">
                          <div className="flex-1">
                            <label className="block text-stone-gray text-sm mb-2">
                              {language === "ar" ? "من دور" : "From Floor"}
                            </label>
                            <input
                              type="number"
                              value={bulkUnitForm.floorStart}
                              onChange={(e) =>
                                setBulkUnitForm((prev) => ({
                                  ...prev,
                                  floorStart: parseInt(e.target.value) || 1,
                                }))
                              }
                              className="w-full bg-stone-gray/10 border border-desert-gold/20 rounded-lg px-4 py-3 text-elegant-white placeholder-stone-gray focus:outline-none focus:border-desert-gold transition-colors duration-300"
                              placeholder="1"
                              min="1"
                            />
                          </div>
                          <div className="flex-1">
                            <label className="block text-stone-gray text-sm mb-2">
                              {language === "ar" ? "إلى دور" : "To Floor"}
                            </label>
                            <input
                              type="number"
                              value={bulkUnitForm.floorEnd}
                              onChange={(e) =>
                                setBulkUnitForm((prev) => ({
                                  ...prev,
                                  floorEnd: parseInt(e.target.value) || 1,
                                }))
                              }
                              className="w-full bg-stone-gray/10 border border-desert-gold/20 rounded-lg px-4 py-3 text-elegant-white placeholder-stone-gray focus:outline-none focus:border-desert-gold transition-colors duration-300"
                              placeholder="5"
                              min="1"
                            />
                          </div>
                        </div>
                        <div className="text-xs text-stone-gray bg-stone-gray/10 rounded-lg p-2">
                          {language === "ar"
                            ? "سيتم توزيع الوحدات تلقائياً على الأدوار المحددة : l be automatically distributed across the specified floors"
                            : "Units will be automatically distributed across the specified floors"}
                        </div>
                      </div>
                    </FormField>

                    <FormField
                      label={language === "ar" ? "الاتجاه" : "Orientation"}
                    >
                      <SelectContext
                        options={[
                          {
                            value: "north",
                            label: { ar: "شمال", en: "North" },
                          },
                          {
                            value: "south",
                            label: { ar: "جنوب", en: "South" },
                          },
                          { value: "east", label: { ar: "شرق", en: "East" } },
                          { value: "west", label: { ar: "غرب", en: "West" } },
                        ]}
                        value={bulkUnitForm.orientation}
                        onChange={(value) =>
                          setBulkUnitForm((prev) => ({
                            ...prev,
                            orientation: value,
                          }))
                        }
                        placeholder={
                          language === "ar"
                            ? "اختر الاتجاه"
                            : "Select Orientation"
                        }
                        language={language}
                      />
                    </FormField>

                    <FormField label={language === "ar" ? "الإطلالة" : "View"}>
                      <SelectContext
                        options={[
                          {
                            value: "front",
                            label: { ar: "أمامي", en: "Front" },
                          },
                          { value: "back", label: { ar: "خلفي", en: "Back" } },
                          { value: "side", label: { ar: "جانبي", en: "Side" } },
                        ]}
                        value={bulkUnitForm.view}
                        onChange={(value) =>
                          setBulkUnitForm((prev) => ({ ...prev, view: value }))
                        }
                        placeholder={
                          language === "ar" ? "اختر الإطلالة" : "Select View"
                        }
                        language={language}
                      />
                    </FormField>

                    <FormField
                      label={
                        language === "ar"
                          ? "بادئة رمز الوحدة"
                          : "Unit Code Prefix"
                      }
                    >
                      <input
                        type="text"
                        value={bulkUnitForm.unitPrefix}
                        onChange={(e) =>
                          setBulkUnitForm((prev) => ({
                            ...prev,
                            unitPrefix: e.target.value,
                          }))
                        }
                        className="w-full bg-stone-gray/10 border border-desert-gold/20 rounded-lg px-4 py-3 text-elegant-white placeholder-stone-gray focus:outline-none focus:border-desert-gold transition-colors duration-300"
                        placeholder="A"
                        maxLength={3}
                      />
                      <p className="text-xs text-stone-gray mt-1">
                        {language === "ar"
                          ? "مثال: A سينتج PRJ-01-A101-A2"
                          : "Example: A will produce PRJ-1-A1, PRJ-001-A2"}
                      </p>
                    </FormField>
                  </div>
                </div>

                {/* Description */}
                <div className="mt-8">
                  <FormField
                    label={language === "ar" ? "الوصف" : "Description"}
                  >
                    <textarea
                      value={bulkUnitForm.description}
                      onChange={(e) =>
                        setBulkUnitForm((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                      rows={3}
                      className="w-full bg-stone-gray/10 border border-desert-gold/20 rounded-lg px-4 py-3 text-elegant-white placeholder-stone-gray focus:outline-none focus:border-desert-gold transition-colors duration-300"
                      placeholder={
                        language === "ar"
                          ? "معلومات إضافية (مثل جودة التشطيب، المميزات الخاصة)"
                          : "Additional info (e.g., finishing quality, special features)"
                      }
                    />
                  </FormField>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6">
                <div className="flex space-x-3 rtl:space-x-reverse">
                  <motion.button
                    onClick={saveTemplate}
                    disabled={!bulkUnitForm.designName}
                    className="px-6 py-3 border border-desert-gold/20 stone-gray rounded-lg hover:bg-stone-gray/10 transition-all duration-300 disabled:opacity-50 isabled:cursor-not-allowed flex items-center space-x-2 rtl:space-x-reverse"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <FileText className="h-4 w-4" />
                    <span>
                      {language === "ar" ? "حفظ كقالب" : "Save as Template"}
                    </span>
                  </motion.button>
                </div>

                <div className="flex space-x-3 rtl:space-x-reverse">
                  <motion.button
                    onClick={() => setShowBulkUnitModal(false)}
                    className="px-6 py-3 border border-desert-gold/20 stone-gray rounded-lg hover:bg-stone-gray/10 transition-all duration-300"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {language === "ar" ? "إلغاء" : "Cancel"}
                  </motion.button>
                  <motion.button
                    onClick={generatePreviewUnits}
                    disabled={!bulkUnitForm.designName || !bulkUnitForm.area}
                    className="px-8 y-3 bg-desert-gold text-deep-black rounded-lg font-medium hover:bg-warm-sand transition-all duration-300 disabled:opacity-50 isabled:cursor-not-allowed flex items-center space-x-2 rtl:space-x-reverse"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Eye className="h-4 w-4" />
                    <span>
                      {language === "ar" ? "معاينة الوحدات" : "Preview Units"}
                    </span>
                  </motion.button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Preview Header */}
              <div className="bg-obsidian/70 rounded-xl p-6 border border-desert-gold/20">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="p-3 bg-green-500/20 rounded-lg mr-4">
                      <Check className="h-6 w-6 text-green-500" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-desert-gold">
                        {language === "ar" ? "معاينة الوحدات" : "Units Preview"}
                      </h4>
                      <p className="text-stone-gray">
                        {language === "ar"
                          ? `سيتم إنشاء ${previewUnits.length} وحدة`
                          : `${previewUnits.length} units will be created`}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-elegant-white">
                      {previewUnits.length}
                    </div>
                    <div className="text-sm text-stone-gray">
                      {language === "ar" ? "وحدة" : "units"}
                    </div>
                  </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                  <div className="bg-stone-gray/10 rounded-lg p-3 text-center">
                    <div className="text-lg font-bold text-elegant-white">
                      {bulkUnitForm.area || 0}
                    </div>
                    <div className="text-xs text-stone-gray">
                      {language === "ar" ? "م²" : "m²"}
                    </div>
                  </div>
                  <div className="bg-stone-gray/10 rounded-lg p-3 text-center">
                    <div className="text-lg font-bold text-elegant-white">
                      {bulkUnitForm.rooms || 0}
                    </div>
                    <div className="text-xs text-stone-gray">
                      {language === "ar" ? "غرف" : "Rooms"}
                    </div>
                  </div>
                  <div className="bg-stone-gray/10 rounded-lg p-3 text-center">
                    <div className="text-lg font-bold text-elegant-white">
                      {bulkUnitForm.bathrooms || 0}
                    </div>
                    <div className="text-xs text-stone-gray">
                      {language === "ar" ? "حمامات" : "Baths"}
                    </div>
                  </div>
                  <div className="bg-stone-gray/10 rounded-lg p-3 text-center">
                    <div className="text-lg font-bold text-elegant-white">
                      {parseFloat(
                        bulkUnitForm.startingPrice || "0"
                      ).toLocaleString()}
                    </div>
                    <div className="text-xs text-stone-gray">
                      {language === "ar" ? "ريال" : "SAR"}
                    </div>
                  </div>
                </div>
              </div>

              {/* Preview Table */}
              <div className="bg-obsidian/70 rounded-xl border border-desert-gold/20 overflow-hidden">
                <div className="p-4 order-b border-desert-gold/20 bg-stone-gray/10">
                  <h5 className="text-lg font-semibold text-elegant-white">
                    {language === "ar" ? "قائمة الوحدات" : "Units List"}
                  </h5>
                </div>
                <div className="overflow-x-auto max-h-96">
                  <table className="w-full">
                    <thead className="bg-stone-gray/5 sticky top-0">
                      <tr>
                        <th className="px-4 py-3 text-left text-elegant-white font-medium text-sm">
                          {language === "ar" ? "الرمز" : "Code"}
                        </th>
                        <th className="px-4 py-3 text-left text-elegant-white font-medium text-sm">
                          {language === "ar" ? "المساحة" : "Area"}
                        </th>
                        <th className="px-4 py-3 text-left text-elegant-white font-medium text-sm">
                          {language === "ar" ? "الدور" : "Floor"}
                        </th>
                        <th className="px-4 py-3 text-left text-elegant-white font-medium text-sm">
                          {language === "ar" ? "الغرف" : "Rooms"}
                        </th>
                        <th className="px-4 py-3 text-left text-elegant-white font-medium text-sm">
                          {language === "ar" ? "الحمامات" : "Baths"}
                        </th>
                        <th className="px-4 py-3 text-left text-elegant-white font-medium text-sm">
                          {language === "ar" ? "السعر" : "Price"}
                        </th>
                        <th className="px-4 py-3 text-left text-elegant-white font-medium text-sm">
                          {language === "ar" ? "الحالة" : "Status"}
                        </th>
                        <th className="px-4 py-3 text-left text-elegant-white font-medium text-sm">
                          {language === "ar" ? "إجراءات" : "Actions"}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {previewUnits.map((unit, index) => (
                        <tr
                          key={unit.id}
                          className={`border-t border-desert-gold/10 ${
                            index % 2 === 0 ? "bg-stone-gray/5" : ""
                          }`}
                        >
                          <td className="px-4 py-3 text-elegant-white font-medium text-sm">
                            {unit.code}
                          </td>
                          <td className="px-4 py-3 text-stone-gray text-sm">
                            {unit.area} m²
                          </td>
                          <td className="px-4 py-3 text-stone-gray text-sm">
                            {unit.floor}
                          </td>
                          <td className="px-4 py-3 text-stone-gray text-sm">
                            {unit.rooms}
                          </td>
                          <td className="px-4 py-3 text-stone-gray text-sm">
                            {unit.bathrooms}
                          </td>
                          <td className="px-4 py-3 text-stone-gray text-sm">
                            {unit.price.toLocaleString()} SAR
                          </td>
                          <td className="px-4 py-3">
                            <StatusBadge
                              status={language === "ar" ? "متاح" : "Available"}
                              variant="success"
                              size="sm"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <button
                              onClick={() => removePreviewUnit(unit.id)}
                              className="text-red-400 hover:text-red-300 transition-colors duration-200 p-1 unded hover:bg-red-400/10"
                              title={
                                language === "ar" ? "حذف الوحدة" : "Remove Unit"
                              }
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6">
                <div className="text-stone-gray text-sm">
                  {language === "ar"
                    ? `إجمالي الوحدات: ${previewUnits.length} وحدة`
                    : `Total Units: ${previewUnits.length} units`}
                </div>

                <div className="flex space-x-3 rtl:space-x-reverse">
                  <motion.button
                    onClick={() => setShowPreview(false)}
                    className="px-6 py-3 border border-desert-gold/20 stone-gray rounded-lg hover:bg-stone-gray/10 transition-all duration-300 flex items-center space-x-2 rtl:space-x-reverse"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <X className="h-4 w-4" />
                    <span>{language === "ar" ? "رجوع" : "Back"}</span>
                  </motion.button>
                  <motion.button
                    onClick={confirmBulkUnits}
                    disabled={previewUnits.length === 0}
                    className="px-8 y-3 bg-desert-gold text-deep-black rounded-lg font-medium hover:bg-warm-sand transition-all duration-300 disabled:opacity-50 isabled:cursor-not-allowed flex items-center space-x-2 rtl:space-x-reverse"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Check className="h-4 w-4" />
                    <span>
                      {language === "ar" ? "تأكيد الإنشاء" : "Confirm Creation"}
                    </span>
                  </motion.button>
                </div>
              </div>
            </div>
          )}
        </Modal>

        <Modal
          isOpen={showProjectSelectionModal}
          onClose={() => {
            setShowProjectSelectionModal(false);
            setSelectedProjectForBulk(null);
            setBulkProjectError("");
          }}
          title={
            language === "ar"
              ? "اختر المشروع للوحدات الجديدة"
              : "Select Project for New Units"
          }
          size="lg"
        >
          <div className="space-y-6">
            <div className="bg-obsidian/70 rounded-xl p-6 border border-desert-gold/20">
              <div className="flex items-center mb-4">
                <div className="p-3 bg-desert-gold/20 rounded-lg mr-4">
                  <Building2 className="h-6 w-6 text-desert-gold" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-desert-gold">
                    {language === "ar" ? "اختر المشروع" : "Select Project"}
                  </h4>
                  <p className="text-stone-gray text-sm">
                    {language === "ar"
                      ? "يجب اختيار مشروع قبل إنشاء الوحدات"
                      : "You must select a project before creating units"}
                  </p>
                </div>
              </div>

              <FormField
                label={language === "ar" ? "المشروع" : "Project"}
                required
              >
                <SelectContext
                  options={[
                    {
                      value: "unassigned",
                      label: { ar: "اختر مشروعاً", en: "Select a project" },
                    },
                    ...bulkProjects.map((project) => ({
                      value: project.id.toString(),
                      label: { ar: project.name, en: project.name },
                    })),
                  ]}
                  value={selectedProjectForBulk?.id?.toString() || ""}
                  onChange={(value) => {
                    const proj = bulkProjects.find(
                      (p) => p.id === parseInt(value)
                    );
                    setSelectedProjectForBulk(proj || null);
                    setBulkProjectError("");
                  }}
                  placeholder={
                    language === "ar" ? "اختر مشروعاً" : "Select a project"
                  }
                  language={language}
                />
              </FormField>

              {bulkProjectError && (
                <div className="mt-4 p-3 bg-red-500 rounded-lg border border-red-500">
                  <p className="text-red-400 text-sm">{bulkProjectError}</p>
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-3 rtl:space-x-reverse">
              <motion.button
                onClick={() => {
                  setShowProjectSelectionModal(false);
                  setSelectedProjectForBulk(null);
                  setBulkProjectError("");
                }}
                className="px-6 py-3 border border-desert-gold/20 stone-gray rounded-lg hover:bg-stone-gray/10 transition-all duration-300"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {language === "ar" ? "إلغاء" : "Cancel"}
              </motion.button>
              <motion.button
                onClick={() => {
                  if (selectedProjectForBulk) {
                    setShowProjectSelectionModal(false);
                    setShowBulkUnitModal(true);
                  } else {
                    setBulkProjectError(
                      language === "ar"
                        ? "يرجى اختيار مشروع: "
                        : "Please select a project"
                    );
                  }
                }}
                disabled={!selectedProjectForBulk}
                className="px-6 py-3 bg-desert-gold text-deep-black rounded-lg font-medium hover:bg-warm-sand transition-all duration-300 disabled:opacity-50 isabled:cursor-not-allowed"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {language === "ar" ? "متابعة" : "Continue"}
              </motion.button>
            </div>
          </div>
        </Modal>

        {/* Excel Upload Modal */}
        <Modal
          isOpen={showExcelUpload}
          onClose={() => {
            setShowExcelUpload(false);
            setExcelPreviewData([]);
            setExcelFile(null);
          }}
          title={language === "ar" ? "استيراد ملف Excel" : "Excel Import"}
          size="xl"
        >
          <div className="space-y-8">
            {/* Excel Upload Instructions */}
            <div className="bg-obsidian/70 rounded-xl p-6 border border-desert-gold/20">
              <div className="flex items-center mb-4">
                <div className="p-3 bg-blue-500/20 rounded-lg mr-4">
                  <Upload className="h-6 w-6 text-blue-500" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-desert-gold">
                    {language === "ar"
                      ? "تنسيق الملف المطلوب"
                      : "Required File Format"}
                  </h4>
                  <p className="text-stone-gray text-sm">
                    {language === "ar"
                      ? "يجب أن يحتوي الملف على الأعمدة التالية:"
                      : "The file must contain the following columns:"}
                  </p>
                </div>
              </div>
              <div className="bg-stone-gray/10 rounded-lg p-4 border border-desert-gold/20">
                <code className="text-elegant-white text-sm font-mono">
                  project_name, Unit Code, Design Name, Area, Floor, Rooms,
                  Baths, View, Orientation, Price, Status
                </code>
              </div>
              <div className="mt-4 p-3 bg-yellow-500/10 rounded-lg border border-yellow-500">
                <p className="text-yellow-400 text-sm">
                  {language === "ar"
                    ? "ملاحظة: تأكد من أن الملف بصيغة CSV أو Excel وأن الأعمدة بالترتيب الصحيح"
                    : "Note: Ensure the file is in CSV or Excel format with columns in the correct order"}
                </p>
              </div>
            </div>

            {/* File Upload */}
            <div className="bg-obsidian/70 rounded-xl p-8 border border-desert-gold/20">
              <div className="flex items-center mb-6">
                <div className="p-3 bg-desert-gold/20 rounded-lg mr-4">
                  <FileText className="h-6 w-6 text-desert-gold" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-desert-gold">
                    {language === "ar" ? "رفع الملف" : "Upload File"}
                  </h4>
                  <p className="text-stone-gray text-sm">
                    {language === "ar"
                      ? "اختر ملف Excel أو CSV يحتوي على بيانات الوحدات"
                      : "Select an Excel or CSV file containing unit data"}
                  </p>
                </div>
              </div>

              <FormField
                label={
                  language === "ar" ? "اختر ملف Excel" : "Select Excel File"
                }
              >
                <div
                  className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors duration-300 ${
                    dragActiveExcel
                      ? "border-desert-gold bg-desert-gold/10"
                      : "border-desert-gold/30 hover:border-desert-gold/50"
                  }`}
                  onDragEnter={(e) => {
                    e.preventDefault();
                    setDragActiveExcel(true);
                  }}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragActiveExcel(true);
                  }}
                  onDragLeave={(e) => {
                    e.preventDefault();
                    setDragActiveExcel(false);
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    setDragActiveExcel(false);
                    const file = e.dataTransfer.files?.[0];
                    if (file) {
                      setExcelFile(file);
                      handleExcelUpload(file);
                    }
                  }}
                  aria-label={
                    language === "ar"
                      ? "منطقة رفع ملف Excel"
                      : "Excel file drop area"
                  }
                  tabIndex={0}
                >
                  <Upload className="h-12 w-12 text-desert-gold mx-auto mb-4" />
                  <p className="text-stone-gray mb-2 text-lg">
                    {language === "ar"
                      ? "اسحب وأفلت ملف Excel هنا"
                      : "Drag and drop Excel file here"}
                  </p>
                  <p className="text-stone-gray text-sm mb-4">
                    {language === "ar"
                      ? "أو انقر لاختيار الملف من جهازك"
                      : "Or click to select file from your device"}
                  </p>
                  <input
                    type="file"
                    accept=".csv,.xlsx,.xls"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setExcelFile(file);
                        handleExcelUpload(file);
                      }
                    }}
                    className="hidden"
                    id="excel-upload"
                  />
                  <label
                    htmlFor="excel-upload"
                    className="cursor-pointer bg-desert-gold text-deep-black px-6 py-3 rounded-lg font-medium hover:bg-warm-sand transition-all duration-300 flex items-center justify-center gap-2 mx-auto"
                  >
                    <Upload className="h-4 w-4" />
                    <span>
                      {language === "ar" ? "اختر الملف" : "Choose File"}
                    </span>
                  </label>
                  {excelFile && (
                    <div className="mt-4 text-green-400 font-medium text-sm">
                      {excelFile.name}
                    </div>
                  )}
                </div>
              </FormField>

              {excelFile && (
                <div className="mt-4 p-4 bg-green-500/10 rounded-lg border border-green-500">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Check className="h-5 w-5 text-green-500 mr-2" />
                      <span className="text-green-400 font-medium">
                        {excelFile.name}
                      </span>
                    </div>
                    <span className="text-stone-gray text-sm">
                      {Math.round(excelFile.size / 1024 / 1024)} MB
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Excel Preview */}
            {excelPreviewData.length > 0 && (
              <div className="bg-obsidian/70 rounded-xl border border-desert-gold/20 overflow-hidden">
                <div className="p-6 order-b border-desert-gold/20 bg-stone-gray/10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div className="p-3 bg-green-500/20 rounded-lg mr-4">
                        <Check className="h-6 w-6 text-green-500" />
                      </div>
                      <div>
                        <h4 className="text-xl font-bold text-desert-gold">
                          {language === "ar"
                            ? "معاينة البيانات"
                            : "Data Preview"}
                        </h4>
                        <p className="text-stone-gray text-sm">
                          {language === "ar"
                            ? `${excelPreviewData.length} وحدة للاستيراد`
                            : `${excelPreviewData.length} units to import`}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-elegant-white">
                        {excelPreviewData.length}
                      </div>
                      <div className="text-sm text-stone-gray">
                        {language === "ar" ? "وحدة" : "units"}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="overflow-x-auto max-h-96">
                  <table className="w-full">
                    <thead className="bg-stone-gray/5 sticky top-0">
                      <tr>
                        <th className="px-4 py-3 text-left text-elegant-white font-medium text-sm">
                          {language === "ar" ? "الرمز" : "Code"}
                        </th>
                        <th className="px-4 py-3 text-left text-elegant-white font-medium text-sm">
                          {language === "ar" ? "الاسم" : "Name"}
                        </th>
                        <th className="px-4 py-3 text-left text-elegant-white font-medium text-sm">
                          {language === "ar" ? "المساحة" : "Area"}
                        </th>
                        <th className="px-4 py-3 text-left text-elegant-white font-medium text-sm">
                          {language === "ar" ? "الدور" : "Floor"}
                        </th>
                        <th className="px-4 py-3 text-left text-elegant-white font-medium text-sm">
                          {language === "ar" ? "الغرف" : "Rooms"}
                        </th>
                        <th className="px-4 py-3 text-left text-elegant-white font-medium text-sm">
                          {language === "ar" ? "الحمامات" : "Baths"}
                        </th>
                        <th className="px-4 py-3 text-left text-elegant-white font-medium text-sm">
                          {language === "ar" ? "السعر" : "Price"}
                        </th>
                        <th className="px-4 py-3 text-left text-elegant-white font-medium text-sm">
                          {language === "ar" ? "إجراءات" : "Actions"}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {excelPreviewData.slice(0, 10).map((unit, index) => (
                        <tr
                          key={index}
                          className={`border-t border-desert-gold/10 ${
                            index % 2 === 0 ? "bg-stone-gray/5" : ""
                          }`}
                        >
                          <td className="px-4 py-3 text-elegant-white font-medium">
                            {unit.code}
                          </td>
                          <td className="px-4 py-3 text-stone-gray">
                            {unit.designName}
                          </td>
                          <td className="px-4 py-3 text-stone-gray">
                            {unit.area} m²
                          </td>
                          <td className="px-4 py-3 text-stone-gray">
                            {unit.floor}
                          </td>
                          <td className="px-4 py-3 text-stone-gray">
                            {unit.rooms}
                          </td>
                          <td className="px-4 py-3 text-stone-gray">
                            {unit.bathrooms}
                          </td>
                          <td className="px-4 py-3 text-stone-gray">
                            {unit.price.toLocaleString()} SAR
                          </td>
                          <td className="px-4 py-3">
                            <button
                              onClick={() => removeExcelUnit(index)}
                              className="text-red-400 hover:text-red-300 transition-colors duration-200"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {excelPreviewData.length > 10 && (
                  <div className="p-4 border-t border-desert-gold/20 text-center">
                    <p className="text-stone-gray text-sm">
                      {language === "ar"
                        ? `و ${excelPreviewData.length - 10} وحدة إضافية...`
                        : `And ${excelPreviewData.length - 10} more units...`}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6">
              <div className="text-stone-gray text-sm">
                {excelPreviewData.length > 0
                  ? language === "ar"
                    ? `إجمالي الوحدات: ${excelPreviewData.length} وحدة`
                    : `Total Units: ${excelPreviewData.length} units`
                  : language === "ar"
                  ? "لميتم اختيار ملف بعد"
                  : "No file selected yet"}
              </div>

              <div className="flex space-x-3 rtl:space-x-reverse">
                <motion.button
                  onClick={() => {
                    setShowExcelUpload(false);
                    setExcelPreviewData([]);
                    setExcelFile(null);
                  }}
                  className="px-6 py-3 border border-desert-gold/20 stone-gray rounded-lg hover:bg-stone-gray/10 transition-all duration-300"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {language === "ar" ? "إلغاء" : "Cancel"}
                </motion.button>
                <motion.button
                  onClick={confirmExcelImport}
                  disabled={excelPreviewData.length === 0}
                  className="px-8 y-3 bg-desert-gold text-deep-black rounded-lg font-medium hover:bg-warm-sand transition-all duration-300 disabled:opacity-50 isabled:cursor-not-allowed flex items-center space-x-2 rtl:space-x-reverse"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Upload className="h-4 w-4" />
                  <span>
                    {language === "ar" ? "تأكيد الاستيراد" : "Confirm Import"}
                  </span>
                </motion.button>
              </div>
            </div>
          </div>
        </Modal>
      </div>
    </PageWrapper>
  );
}
