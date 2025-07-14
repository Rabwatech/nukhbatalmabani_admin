'use client';

import { motion } from 'framer-motion';
import { useDirection } from '@/context/DirectionContext';
import { useState, useRef } from 'react';
import { Plus, Building2, MapPin, Calendar, Users, TrendingUp, Eye, Edit, Trash2, Filter, Search, Upload, X, Youtube, Drama as Panorama, Check, ArrowUp as Elevator, Car, Dumbbell, Waves, Church as Mosque, Home, Shield, Video, Wrench, Brush, Wind, Wifi, PlusCircle, Image, FileText, CreditCard, Settings } from 'lucide-react';
import PageWrapper from '../components/PageWrapper';
import DataTable from '../components/shared/DataTable';
import StatusBadge from '../components/shared/StatusBadge';
import Modal from '../components/shared/Modal';
import FormField from '../components/shared/FormField';

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
  const [activeTab, setActiveTab] = useState('list');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [projectImages, setProjectImages] = useState<File[]>([]);
  const [projectLicense, setProjectLicense] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [features, setFeatures] = useState<ProjectFeature[]>([]);
  const [newFeature, setNewFeature] = useState('');
  const [selectedPaymentPlan, setSelectedPaymentPlan] = useState('');
  const [bankName, setBankName] = useState('');
  const [services, setServices] = useState<ProjectService[]>([]);
  const [showServicesDropdown, setShowServicesDropdown] = useState(false);
  const [customServiceName, setCustomServiceName] = useState('');
  const [showCustomServiceInput, setShowCustomServiceInput] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const licenseFileInputRef = useRef<HTMLInputElement>(null);

  // Mock data
  const projects = [
    {
      id: 1,
      name: language === 'ar' ? 'مجمع الأناقة السكني' : 'Elegance Residential Complex',
      location: language === 'ar' ? 'الرياض، حي الملقا' : 'Riyadh, Al-Malqa',
      type: language === 'ar' ? 'سكني' : 'residential',
      status: language === 'ar' ? 'مكتمل' : 'ready',
      totalUnits: 150,
      soldUnits: 120,
      availableUnits: 30,
      startDate: '2023-01-15',
      deliveryDate: '2024-01-15',
      budget: '50,000,000',
      revenue: '45,000,000',
      manager: language === 'ar' ? 'أحمد العتيبي' : 'Ahmed Al-Otaibi',
      finishingLevel: language === 'ar' ? 'فاخر' : 'luxury',
      paymentPlan: language === 'ar' ? 'أقساط مع دفعة مقدمة' : 'installments',
      ownershipType: language === 'ar' ? 'تملك حر' : 'freehold',
      licenseNumber: 'LIC-2023-001',
      features: [
        language === 'ar' ? 'قريب من محطة المترو' : 'Close to metro station',
        language === 'ar' ? 'إطلالات بانورامية' : 'Panoramic views',
        language === 'ar' ? 'تصميم عائلي' : 'Family-friendly design'
      ]
    },
    {
      id: 2,
      name: language === 'ar' ? 'برج التجارة المركزي' : 'Central Trade Tower',
      location: language === 'ar' ? 'جدة، الكورنيش' : 'Jeddah, Corniche',
      type: language === 'ar' ? 'تجاري' : 'commercial',
      status: language === 'ar' ? 'قيد الإنشاء' : 'under-construction',
      totalUnits: 80,
      soldUnits: 45,
      availableUnits: 35,
      startDate: '2023-06-01',
      deliveryDate: '2024-12-01',
      budget: '75,000,000',
      revenue: '35,000,000',
      manager: language === 'ar' ? 'فاطمة الحربي' : 'Fatima Al-Harbi',
      finishingLevel: language === 'ar' ? 'سوبر لوكس' : 'super-lux',
      paymentPlan: language === 'ar' ? 'تمويل بنكي' : 'bank-financing',
      bankName: language === 'ar' ? 'البنك الأهلي، بنك الرياض' : 'NCB, Riyad Bank',
      ownershipType: language === 'ar' ? 'تملك حر' : 'freehold',
      licenseNumber: 'LIC-2023-002',
      features: [
        language === 'ar' ? 'مكاتب ذكية' : 'Smart offices',
        language === 'ar' ? 'مركز أعمال متكامل' : 'Integrated business center'
      ]
    },
    {
      id: 3,
      name: language === 'ar' ? 'قرية الهدوء' : 'Tranquil Village',
      location: language === 'ar' ? 'الدمام، الشاطئ' : 'Dammam, Beach',
      type: language === 'ar' ? 'سكني' : 'residential',
      status: language === 'ar' ? 'على الخريطة' : 'on-map',
      totalUnits: 60,
      soldUnits: 0,
      availableUnits: 60,
      startDate: '2024-03-01',
      deliveryDate: '2025-03-01',
      budget: '30,000,000',
      revenue: '0',
      manager: language === 'ar' ? 'خالد المطيري' : 'Khalid Al-Mutairi',
      finishingLevel: language === 'ar' ? 'عادي' : 'regular',
      paymentPlan: language === 'ar' ? 'دفعة واحدة' : 'one-time',
      ownershipType: language === 'ar' ? 'إيجار منتهي بالتمليك' : 'rent-to-own',
      licenseNumber: 'LIC-2023-003',
      features: [
        language === 'ar' ? 'إطلالة على البحر' : 'Sea view',
        language === 'ar' ? 'حدائق خاصة' : 'Private gardens'
      ]
    }
  ];

  // Available services
  const availableServices: ProjectService[] = [
    { id: 'elevators', name: language === 'ar' ? 'مصاعد' : 'Elevators', icon: Elevator },
    { id: 'parking', name: language === 'ar' ? 'مواقف سيارات' : 'Parking', icon: Car },
    { id: 'gym', name: language === 'ar' ? 'صالة رياضية' : 'Gym', icon: Dumbbell },
    { id: 'pool', name: language === 'ar' ? 'مسبح' : 'Swimming Pool', icon: Waves },
    { id: 'mosque', name: language === 'ar' ? 'مسجد' : 'Mosque', icon: Mosque },
    { id: 'smart-home', name: language === 'ar' ? 'نظام المنزل الذكي' : 'Smart Home System', icon: Home },
    { id: 'security', name: language === 'ar' ? 'أمن إلكتروني' : 'Electronic Security', icon: Shield },
    { id: 'surveillance', name: language === 'ar' ? 'مراقبة على مدار الساعة' : '24/7 Surveillance', icon: Video },
    { id: 'maintenance', name: language === 'ar' ? 'صيانة' : 'Maintenance', icon: Wrench },
    { id: 'cleaning', name: language === 'ar' ? 'خدمات تنظيف' : 'Cleaning Services', icon: Brush },
    { id: 'central-ac', name: language === 'ar' ? 'تكييف مركزي' : 'Central AC', icon: Wind },
    { id: 'internet', name: language === 'ar' ? 'إنترنت ألياف' : 'Fiber Internet', icon: Wifi },
  ];

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'ready':
      case 'مكتمل':
        return 'success';
      case 'under-construction':
      case 'قيد الإنشاء':
        return 'warning';
      case 'on-map':
      case 'على الخريطة':
        return 'info';
      case 'on-hold':
      case 'متوقف':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, { ar: string; en: string }> = {
      ready: { ar: 'مكتمل', en: 'Ready for Delivery' },
      'under-construction': { ar: 'قيد الإنشاء', en: 'Under Construction' },
      'on-map': { ar: 'على الخريطة', en: 'On Map' },
      'on-hold': { ar: 'متوقف', en: 'On Hold' }
    };
    return labels[status]?.[language] || status;
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, { ar: string; en: string }> = {
      residential: { ar: 'سكني', en: 'Residential' },
      commercial: { ar: 'تجاري', en: 'Commercial' },
      mixed: { ar: 'مختلط', en: 'Mixed Use' }
    };
    return labels[type]?.[language] || type;
  };

  const getFinishingLevelLabel = (level: string) => {
    const labels: Record<string, { ar: string; en: string }> = {
      'no-finishing': { ar: 'بدون تشطيب', en: 'No Finishing' },
      'half-finishing': { ar: 'نصف تشطيب', en: 'Half Finishing' },
      regular: { ar: 'عادي', en: 'Regular' },
      luxury: { ar: 'فاخر', en: 'Luxury' },
      'super-lux': { ar: 'سوبر لوكس', en: 'Super Lux' }
    };
    return labels[level]?.[language] || level;
  };

  const getPaymentPlanLabel = (plan: string) => {
    const labels: Record<string, { ar: string; en: string }> = {
      'one-time': { ar: 'دفعة واحدة', en: 'One-time Payment' },
      installments: { ar: 'أقساط مع دفعة مقدمة', en: 'Installments with Down Payment' },
      'bank-financing': { ar: 'تمويل بنكي', en: 'Bank Financing' }
    };
    return labels[plan]?.[language] || plan;
  };

  const getOwnershipTypeLabel = (type: string) => {
    const labels: Record<string, { ar: string; en: string }> = {
      freehold: { ar: 'تملك حر', en: 'Freehold' },
      'rent-to-own': { ar: 'إيجار منتهي بالتمليك', en: 'Rent-to-Own' },
      'long-term-lease': { ar: 'إيجار طويل الأمد', en: 'Long-Term Lease' },
      waqf: { ar: 'وقف', en: 'Endowment (Waqf)' }
    };
    return labels[type]?.[language] || type;
  };

  const tabs = [
    { id: 'list', label: language === 'ar' ? 'قائمة المشاريع' : 'Projects List' },
    { id: 'analytics', label: language === 'ar' ? 'التحليلات' : 'Analytics' },
    { id: 'units', label: language === 'ar' ? 'إدارة الوحدات' : 'Unit Management' }
  ];

  const columns = [
    {
      key: 'name',
      label: language === 'ar' ? 'اسم المشروع' : 'Project Name',
      sortable: true,
      render: (value: string) => (
        <span className="text-elegant-white font-medium">{value}</span>
      )
    },
    {
      key: 'location',
      label: language === 'ar' ? 'الموقع' : 'Location',
      render: (value: string) => (
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <MapPin className="h-4 w-4 text-desert-gold" />
          <span className="text-stone-gray">{value}</span>
        </div>
      )
    },
    {
      key: 'type',
      label: language === 'ar' ? 'النوع' : 'Type',
      render: (value: string) => (
        <StatusBadge 
          status={getTypeLabel(value)} 
          variant="info" 
          size="sm"
        />
      )
    },
    {
      key: 'status',
      label: language === 'ar' ? 'الحالة' : 'Status',
      render: (value: string) => (
        <StatusBadge
          status={typeof value === 'string' ? getStatusLabel(value) : value}
          variant={getStatusVariant(value)}
        />
      )
    },
    {
      key: 'totalUnits',
      label: language === 'ar' ? 'إجمالي الوحدات' : 'Total Units',
      render: (value: number) => (
        <span className="text-elegant-white">{value}</span>
      )
    },
    {
      key: 'soldUnits',
      label: language === 'ar' ? 'الوحدات المباعة' : 'Sold Units',
      render: (value: number, row: any) => (
        <div className="whitespace-nowrap">
          <span className="text-green-400 font-medium">{value}</span>
          <span className="text-stone-gray text-sm ml-1">
            ({Math.round((value / row.totalUnits) * 100)}%)
          </span>
        </div>
      )
    },
    {
      key: 'manager',
      label: language === 'ar' ? 'مدير المشروع' : 'Project Manager',
      render: (value: string) => (
        <span className="text-stone-gray">{value}</span>
      )
    }
  ];

  const filterOptions = [
    { value: 'residential', label: language === 'ar' ? 'سكني' : 'Residential' },
    { value: 'commercial', label: language === 'ar' ? 'تجاري' : 'Commercial' },
    { value: 'mixed', label: language === 'ar' ? 'مختلط' : 'Mixed Use' }
  ];

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
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
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    setProjectImages(prev => [...prev, ...imageFiles]);
  };

  const handleLicenseFile = (files: FileList | null) => {
    if (files && files.length > 0) {
      // Only accept PDF files
      if (files[0].type === 'application/pdf') {
        setProjectLicense(files[0]);
      } else {
        alert(language === 'ar' ? 'يرجى تحميل ملف PDF فقط' : 'Please upload PDF file only');
      }
    }
  };

  const removeImage = (index: number) => {
    setProjectImages(prev => prev.filter((_, i) => i !== index));
  };

  const removeLicense = () => {
    setProjectLicense(null);
  };

  const handleAddFeature = () => {
    if (newFeature.trim()) {
      setFeatures(prev => [...prev, { id: Date.now().toString(), text: newFeature.trim() }]);
      setNewFeature('');
    }
  };

  const removeFeature = (id: string) => {
    setFeatures(prev => prev.filter(feature => feature.id !== id));
  };

  const handlePaymentPlanChange = (plan: string) => {
    setSelectedPaymentPlan(plan);
    if (plan !== 'bank-financing') {
      setBankName('');
    }
  };

  const addService = (service: ProjectService) => {
    // Check if service already exists
    if (!services.some(s => s.id === service.id)) {
      setServices(prev => [...prev, { ...service, quantity: service.id === 'elevators' ? 1 : undefined }]);
    }
    setShowServicesDropdown(false);
  };

  const addCustomService = () => {
    if (customServiceName.trim()) {
      const newService: ProjectService = {
        id: `custom-${Date.now()}`,
        name: customServiceName,
        icon: Building2,
        isCustom: true
      };
      setServices(prev => [...prev, newService]);
      setCustomServiceName('');
      setShowCustomServiceInput(false);
    }
  };

  const updateServiceQuantity = (id: string, quantity: number) => {
    setServices(prev => 
      prev.map(service => 
        service.id === id ? { ...service, quantity } : service
      )
    );
  };

  const removeService = (id: string) => {
    setServices(prev => prev.filter(service => service.id !== id));
  };

  const handleView = (project: any) => {
    setSelectedProject(project);
  };

  const handleEdit = (project: any) => {
    setSelectedProject(project);
    
    // Set features from project
    if (project.features) {
      setFeatures(project.features.map((text: string) => ({ 
        id: Date.now() + Math.random().toString(), 
        text 
      })));
    }
    
    // Set payment plan
    setSelectedPaymentPlan(project.paymentPlan || '');
    
    // Set bank name if available
    if (project.bankName) {
      setBankName(project.bankName);
    }
    
    setShowCreateModal(true);
  };

  const handleDelete = (project: any) => {
    if (confirm(language === 'ar' ? 'هل أنت متأكد من حذف هذا المشروع؟' : 'Are you sure you want to delete this project?')) {
      console.log('Delete project:', project);
    }
  };

  return (
    <PageWrapper>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-elegant-white">
              {language === 'ar' ? 'المشاريع والوحدات' : 'Projects & Units'}
            </h1>
            <p className="text-stone-gray mt-1">
              {language === 'ar' ? 'إدارة المشاريع العقارية والوحدات' : 'Manage real estate projects and units'}
            </p>
          </div>
          <motion.button
            onClick={() => setShowCreateModal(true)}
            className="bg-desert-gold text-deep-black px-6 py-3 rounded-lg font-medium hover:bg-warm-sand transition-all duration-300 flex items-center space-x-2 rtl:space-x-reverse"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Plus className="h-5 w-5" />
            <span>{language === 'ar' ? 'مشروع جديد' : 'New Project'}</span>
          </motion.button>
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
                <p className="text-stone-gray text-sm">{language === 'ar' ? 'إجمالي المشاريع' : 'Total Projects'}</p>
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
                <p className="text-stone-gray text-sm">{language === 'ar' ? 'إجمالي الوحدات' : 'Total Units'}</p>
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
                <p className="text-stone-gray text-sm">{language === 'ar' ? 'الوحدات المباعة' : 'Sold Units'}</p>
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
                <p className="text-stone-gray text-sm">{language === 'ar' ? 'معدل البيع' : 'Sales Rate'}</p>
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
                    ? 'border-desert-gold text-desert-gold'
                    : 'border-transparent text-stone-gray hover:text-elegant-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="mt-6">
          {activeTab === 'list' && (
            <DataTable
              columns={columns}
              data={projects}
              searchPlaceholder={language === 'ar' ? 'البحث في المشاريع...' : 'Search projects...'}
              filterOptions={filterOptions}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}

          {activeTab === 'analytics' && (
            <div className="bg-obsidian/50 backdrop-blur-sm rounded-xl p-8 border border-desert-gold/20">
              <h2 className="text-2xl font-bold text-elegant-white mb-6">
                {language === 'ar' ? 'تحليلات المشاريع' : 'Project Analytics'}
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
                    <h3 className="text-lg font-bold text-elegant-white mb-4">{project.name}</h3>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-stone-gray">{language === 'ar' ? 'الميزانية:' : 'Budget:'}</span>
                        <span className="text-elegant-white">{project.budget} {language === 'ar' ? 'ريال' : 'SAR'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-stone-gray">{language === 'ar' ? 'الإيرادات:' : 'Revenue:'}</span>
                        <span className="text-green-400">{project.revenue} {language === 'ar' ? 'ريال' : 'SAR'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-stone-gray">{language === 'ar' ? 'معدل البيع:' : 'Sales Rate:'}</span>
                        <span className="text-desert-gold">{Math.round((project.soldUnits / project.totalUnits) * 100)}%</span>
                      </div>
                    </div>

                    <div className="mt-4 bg-stone-gray/20 rounded-full h-2">
                      <div 
                        className="bg-desert-gold h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(project.soldUnits / project.totalUnits) * 100}%` }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'units' && (
            <div className="bg-obsidian/50 backdrop-blur-sm rounded-xl p-8 border border-desert-gold/20">
              <h2 className="text-2xl font-bold text-elegant-white mb-6">
                {language === 'ar' ? 'إدارة الوحدات' : 'Unit Management'}
              </h2>
              
              <div className="text-center py-12">
                <Building2 className="h-16 w-16 text-desert-gold mx-auto mb-4" />
                <h3 className="text-xl font-bold text-elegant-white mb-2">
                  {language === 'ar' ? 'إدارة الوحدات' : 'Unit Management'}
                </h3>
                <p className="text-stone-gray mb-6">
                  {language === 'ar' ? 'إدارة تفصيلية لجميع الوحدات في المشاريع' : 'Detailed management of all units in projects'}
                </p>
                <motion.button
                  className="bg-desert-gold text-deep-black px-6 py-3 rounded-lg font-medium hover:bg-warm-sand transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {language === 'ar' ? 'إدارة الوحدات' : 'Manage Units'}
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
            setSelectedPaymentPlan('');
            setBankName('');
            setServices([]);
          }}
          title={selectedProject ? 
            (language === 'ar' ? 'تعديل المشروع' : 'Edit Project') : 
            (language === 'ar' ? 'مشروع جديد' : 'New Project')
          }
          size="xl"
        >
          <form className="space-y-6">
            {/* Project Info Section */}
            <div className="bg-obsidian/70 rounded-lg p-6 border border-desert-gold/20">
              <h3 className="text-xl font-bold text-desert-gold mb-6 flex items-center">
                <Building2 className="h-5 w-5 mr-2" />
                {language === 'ar' ? 'معلومات المشروع' : 'Project Info'}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField label={language === 'ar' ? 'اسم المشروع' : 'Project Name'} required>
                  <input
                    type="text"
                    defaultValue={selectedProject?.name || ''}
                    className="w-full bg-stone-gray/10 border border-desert-gold/20 rounded-lg px-4 py-3 text-elegant-white placeholder-stone-gray focus:outline-none focus:border-desert-gold transition-colors duration-300"
                    placeholder={language === 'ar' ? 'أدخل اسم المشروع' : 'Enter project name'}
                  />
                </FormField>

                <FormField label={language === 'ar' ? 'الموقع' : 'Location'} required>
                  <input
                    type="text"
                    defaultValue={selectedProject?.location || ''}
                    className="w-full bg-stone-gray/10 border border-desert-gold/20 rounded-lg px-4 py-3 text-elegant-white placeholder-stone-gray focus:outline-none focus:border-desert-gold transition-colors duration-300"
                    placeholder={language === 'ar' ? 'أدخل موقع المشروع' : 'Enter project location'}
                  />
                </FormField>

                <FormField label={language === 'ar' ? 'نوع المشروع' : 'Project Type'} required>
                  <select
                    defaultValue={selectedProject?.type || 'residential'}
                    className="w-full bg-stone-gray/10 border border-desert-gold/20 rounded-lg px-4 py-3 text-elegant-white focus:outline-none focus:border-desert-gold transition-colors duration-300"
                  >
                    <option value="residential" className="bg-obsidian">
                      {language === 'ar' ? 'سكني' : 'Residential'}
                    </option>
                    <option value="commercial" className="bg-obsidian">
                      {language === 'ar' ? 'تجاري' : 'Commercial'}
                    </option>
                    <option value="mixed" className="bg-obsidian">
                      {language === 'ar' ? 'مختلط' : 'Mixed Use'}
                    </option>
                  </select>
                </FormField>

                <FormField label={language === 'ar' ? 'إجمالي الوحدات' : 'Total Units'} required>
                  <input
                    type="number"
                    defaultValue={selectedProject?.totalUnits || ''}
                    className="w-full bg-stone-gray/10 border border-desert-gold/20 rounded-lg px-4 py-3 text-elegant-white placeholder-stone-gray focus:outline-none focus:border-desert-gold transition-colors duration-300"
                    placeholder="0"
                  />
                </FormField>

                <FormField label={language === 'ar' ? 'مدير المشروع' : 'Project Manager'} required>
                  <select
                    defaultValue=""
                    className="w-full bg-stone-gray/10 border border-desert-gold/20 rounded-lg px-4 py-3 text-elegant-white focus:outline-none focus:border-desert-gold transition-colors duration-300"
                  >
                    <option value="" className="bg-obsidian">
                      {language === 'ar' ? 'اختر مدير المشروع' : 'Select Project Manager'}
                    </option>
                    <option value="ahmed" className="bg-obsidian">
                      {language === 'ar' ? 'أحمد العتيبي' : 'Ahmed Al-Otaibi'}
                    </option>
                    <option value="fatima" className="bg-obsidian">
                      {language === 'ar' ? 'فاطمة الحربي' : 'Fatima Al-Harbi'}
                    </option>
                    <option value="khalid" className="bg-obsidian">
                      {language === 'ar' ? 'خالد المطيري' : 'Khalid Al-Mutairi'}
                    </option>
                  </select>
                </FormField>

                <FormField label={language === 'ar' ? 'وصف المشروع' : 'Project Description'} className="md:col-span-2">
                  <textarea
                    rows={4}
                    defaultValue={selectedProject?.description || ''}
                    className="w-full bg-stone-gray/10 border border-desert-gold/20 rounded-lg px-4 py-3 text-elegant-white placeholder-stone-gray focus:outline-none focus:border-desert-gold transition-colors duration-300 resize-none"
                    placeholder={language === 'ar' ? 'أدخل وصف المشروع...' : 'Enter project description...'}
                  />
                </FormField>
              </div>
            </div>

            {/* Legal & Status Section */}
            <div className="bg-obsidian/70 rounded-lg p-6 border border-desert-gold/20">
              <h3 className="text-xl font-bold text-desert-gold mb-6 flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                {language === 'ar' ? 'الوضع القانوني والحالة' : 'Legal & Status'}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField label={language === 'ar' ? 'حالة المشروع' : 'Project Status'} required>
                  <select
                    defaultValue={selectedProject?.status || 'on-map'}
                    className="w-full bg-stone-gray/10 border border-desert-gold/20 rounded-lg px-4 py-3 text-elegant-white focus:outline-none focus:border-desert-gold transition-colors duration-300"
                  >
                    <option value="on-map" className="bg-obsidian">
                      {language === 'ar' ? 'على الخريطة' : 'On Map'}
                    </option>
                    <option value="under-construction" className="bg-obsidian">
                      {language === 'ar' ? 'قيد الإنشاء' : 'Under Construction'}
                    </option>
                    <option value="ready" className="bg-obsidian">
                      {language === 'ar' ? 'مكتمل' : 'Ready for Delivery'}
                    </option>
                    <option value="on-hold" className="bg-obsidian">
                      {language === 'ar' ? 'متوقف' : 'On Hold'}
                    </option>
                  </select>
                </FormField>

                <FormField label={language === 'ar' ? 'تاريخ التسليم المتوقع' : 'Estimated Delivery Date'} required>
                  <input
                    type="date"
                    defaultValue={selectedProject?.deliveryDate || ''}
                    className="w-full bg-stone-gray/10 border border-desert-gold/20 rounded-lg px-4 py-3 text-elegant-white focus:outline-none focus:border-desert-gold transition-colors duration-300"
                  />
                </FormField>

                <FormField label={language === 'ar' ? 'رقم ترخيص المشروع' : 'Project License Number'}>
                  <input
                    type="text"
                    defaultValue={selectedProject?.licenseNumber || ''}
                    className="w-full bg-stone-gray/10 border border-desert-gold/20 rounded-lg px-4 py-3 text-elegant-white placeholder-stone-gray focus:outline-none focus:border-desert-gold transition-colors duration-300"
                    placeholder={language === 'ar' ? 'أدخل رقم الترخيص' : 'Enter license number'}
                  />
                </FormField>

                <FormField label={language === 'ar' ? 'ملف الترخيص (PDF)' : 'License File (PDF)'}>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <input
                        type="file"
                        accept=".pdf"
                        ref={licenseFileInputRef}
                        onChange={(e) => handleLicenseFile(e.target.files)}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => licenseFileInputRef.current?.click()}
                        className="bg-stone-gray/20 text-elegant-white px-4 py-2 rounded-lg font-medium hover:bg-stone-gray/30 transition-all duration-300 flex items-center space-x-2 rtl:space-x-reverse"
                      >
                        <Upload className="h-4 w-4" />
                        <span>{language === 'ar' ? 'تحميل ملف' : 'Upload File'}</span>
                      </button>
                    </div>
                    
                    {projectLicense && (
                      <div className="flex items-center justify-between bg-stone-gray/10 rounded-lg p-2">
                        <span className="text-elegant-white truncate">{projectLicense.name}</span>
                        <button
                          type="button"
                          onClick={removeLicense}
                          className="text-stone-gray hover:text-red-400 transition-colors duration-200"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                    
                    {!projectLicense && (
                      <p className="text-yellow-400 text-sm">
                        {language === 'ar' ? 'يُنصح بتحميل ملف الترخيص' : 'License file upload is recommended'}
                      </p>
                    )}
                  </div>
                </FormField>

                <FormField label={language === 'ar' ? 'تاريخ البداية' : 'Start Date'} required>
                  <input
                    type="date"
                    defaultValue={selectedProject?.startDate || ''}
                    className="w-full bg-stone-gray/10 border border-desert-gold/20 rounded-lg px-4 py-3 text-elegant-white focus:outline-none focus:border-desert-gold transition-colors duration-300"
                  />
                </FormField>
              </div>
            </div>

            {/* Construction Details Section */}
            <div className="bg-obsidian/70 rounded-lg p-6 border border-desert-gold/20">
              <h3 className="text-xl font-bold text-desert-gold mb-6 flex items-center">
                <Building2 className="h-5 w-5 mr-2" />
                {language === 'ar' ? 'تفاصيل البناء' : 'Construction Details'}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField label={language === 'ar' ? 'مستوى التشطيب' : 'Finishing Level'} required>
                  <select
                    defaultValue={selectedProject?.finishingLevel || 'regular'}
                    className="w-full bg-stone-gray/10 border border-desert-gold/20 rounded-lg px-4 py-3 text-elegant-white focus:outline-none focus:border-desert-gold transition-colors duration-300"
                  >
                    <option value="no-finishing" className="bg-obsidian">
                      {language === 'ar' ? 'بدون تشطيب' : 'No Finishing'}
                    </option>
                    <option value="half-finishing" className="bg-obsidian">
                      {language === 'ar' ? 'نصف تشطيب' : 'Half Finishing'}
                    </option>
                    <option value="regular" className="bg-obsidian">
                      {language === 'ar' ? 'عادي' : 'Regular'}
                    </option>
                    <option value="luxury" className="bg-obsidian">
                      {language === 'ar' ? 'فاخر' : 'Luxury'}
                    </option>
                    <option value="super-lux" className="bg-obsidian">
                      {language === 'ar' ? 'سوبر لوكس' : 'Super Lux'}
                    </option>
                  </select>
                </FormField>

                <FormField label={language === 'ar' ? 'الضمانات المقدمة' : 'Warranties Provided'}>
                  <textarea
                    rows={3}
                    defaultValue={selectedProject?.warranties || ''}
                    className="w-full bg-stone-gray/10 border border-desert-gold/20 rounded-lg px-4 py-3 text-elegant-white placeholder-stone-gray focus:outline-none focus:border-desert-gold transition-colors duration-300 resize-none"
                    placeholder={language === 'ar' ? 'أدخل الضمانات المقدمة (كل ضمان في سطر)' : 'Enter warranties (one per line)'}
                  />
                  <p className="text-stone-gray text-xs mt-1">
                    {language === 'ar' ? 'مثال: ضمان 10 سنوات على النظام الكهربائي' : 'Example: 10-Year Warranty on Electrical System'}
                  </p>
                </FormField>
              </div>
            </div>

            {/* Payment & Ownership Section */}
            <div className="bg-obsidian/70 rounded-lg p-6 border border-desert-gold/20">
              <h3 className="text-xl font-bold text-desert-gold mb-6 flex items-center">
                <CreditCard className="h-5 w-5 mr-2" />
                {language === 'ar' ? 'الدفع والملكية' : 'Payment & Ownership'}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField label={language === 'ar' ? 'خطة الدفع' : 'Payment Plan'} required>
                  <div className="space-y-3">
                    <label className="flex items-center space-x-2 rtl:space-x-reverse">
                      <input
                        type="radio"
                        name="paymentPlan"
                        value="one-time"
                        checked={selectedPaymentPlan === 'one-time'}
                        onChange={() => handlePaymentPlanChange('one-time')}
                        className="text-desert-gold focus:ring-desert-gold"
                      />
                      <span className="text-elegant-white">
                        {language === 'ar' ? 'دفعة واحدة' : 'One-time Payment'}
                      </span>
                    </label>
                    
                    <label className="flex items-center space-x-2 rtl:space-x-reverse">
                      <input
                        type="radio"
                        name="paymentPlan"
                        value="installments"
                        checked={selectedPaymentPlan === 'installments'}
                        onChange={() => handlePaymentPlanChange('installments')}
                        className="text-desert-gold focus:ring-desert-gold"
                      />
                      <span className="text-elegant-white">
                        {language === 'ar' ? 'أقساط مع دفعة مقدمة' : 'Installments with Down Payment'}
                      </span>
                    </label>
                    
                    <label className="flex items-center space-x-2 rtl:space-x-reverse">
                      <input
                        type="radio"
                        name="paymentPlan"
                        value="bank-financing"
                        checked={selectedPaymentPlan === 'bank-financing'}
                        onChange={() => handlePaymentPlanChange('bank-financing')}
                        className="text-desert-gold focus:ring-desert-gold"
                      />
                      <span className="text-elegant-white">
                        {language === 'ar' ? 'تمويل بنكي' : 'Bank Financing'}
                      </span>
                    </label>
                  </div>
                </FormField>

                {selectedPaymentPlan === 'bank-financing' && (
                  <FormField label={language === 'ar' ? 'اسم البنك/البنوك' : 'Bank Name(s)'}>
                    <input
                      type="text"
                      value={bankName}
                      onChange={(e) => setBankName(e.target.value)}
                      className="w-full bg-stone-gray/10 border border-desert-gold/20 rounded-lg px-4 py-3 text-elegant-white placeholder-stone-gray focus:outline-none focus:border-desert-gold transition-colors duration-300"
                      placeholder={language === 'ar' ? 'أدخل أسماء البنوك المعتمدة' : 'Enter approved bank names'}
                    />
                  </FormField>
                )}

                <FormField label={language === 'ar' ? 'نوع الملكية' : 'Ownership Type'} required>
                  <select
                    defaultValue={selectedProject?.ownershipType || 'freehold'}
                    className="w-full bg-stone-gray/10 border border-desert-gold/20 rounded-lg px-4 py-3 text-elegant-white focus:outline-none focus:border-desert-gold transition-colors duration-300"
                  >
                    <option value="freehold" className="bg-obsidian">
                      {language === 'ar' ? 'تملك حر' : 'Freehold'}
                    </option>
                    <option value="rent-to-own" className="bg-obsidian">
                      {language === 'ar' ? 'إيجار منتهي بالتمليك' : 'Rent-to-Own'}
                    </option>
                    <option value="long-term-lease" className="bg-obsidian">
                      {language === 'ar' ? 'إيجار طويل الأمد' : 'Long-Term Lease'}
                    </option>
                    <option value="waqf" className="bg-obsidian">
                      {language === 'ar' ? 'وقف' : 'Endowment (Waqf)'}
                    </option>
                  </select>
                </FormField>
              </div>
            </div>

            {/* Attachments & Media Section */}
            <div className="bg-obsidian/70 rounded-lg p-6 border border-desert-gold/20">
              <h3 className="text-xl font-bold text-desert-gold mb-6 flex items-center">
                <Image className="h-5 w-5 mr-2" />
                {language === 'ar' ? 'المرفقات والوسائط' : 'Attachments & Media'}
              </h3>
              
              <div className="space-y-6">
                <FormField label={language === 'ar' ? 'صور المشروع' : 'Project Images'}>
                  <div
                    className={`border-2 border-dashed rounded-lg p-6 text-center transition-all duration-300 ${
                      dragActive 
                        ? 'border-desert-gold bg-desert-gold/10' 
                        : 'border-desert-gold/30 hover:border-desert-gold/50'
                    }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    <Upload className="h-8 w-8 text-desert-gold mx-auto mb-3" />
                    <p className="text-stone-gray mb-2">
                      {language === 'ar' ? 'اسحب وأفلت الصور هنا' : 'Drag and drop images here'}
                    </p>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      ref={fileInputRef}
                      onChange={(e) => handleProjectImages(e.target.files ? Array.from(e.target.files) : [])}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-desert-gold/20 text-desert-gold px-4 py-2 rounded-lg hover:bg-desert-gold/30 transition-colors duration-200"
                    >
                      {language === 'ar' ? 'اختر الصور' : 'Choose Images'}
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField label={language === 'ar' ? 'رابط فيديو يوتيوب' : 'YouTube Video Link'}>
                    <div className="relative">
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <Youtube className="h-5 w-5 text-stone-gray" />
                      </div>
                      <input
                        type="url"
                        defaultValue={selectedProject?.youtubeLink || ''}
                        className="w-full bg-stone-gray/10 border border-desert-gold/20 rounded-lg pr-10 px-4 py-3 text-elegant-white placeholder-stone-gray focus:outline-none focus:border-desert-gold transition-colors duration-300"
                        placeholder="https://www.youtube.com/watch?v=..."
                      />
                    </div>
                  </FormField>

                  <FormField label={language === 'ar' ? 'رابط جولة 360 درجة' : '360° Tour Link'}>
                    <div className="relative">
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <Panorama className="h-5 w-5 text-stone-gray" />
                      </div>
                      <input
                        type="url"
                        defaultValue={selectedProject?.tourLink || ''}
                        className="w-full bg-stone-gray/10 border border-desert-gold/20 rounded-lg pr-10 px-4 py-3 text-elegant-white placeholder-stone-gray focus:outline-none focus:border-desert-gold transition-colors duration-300"
                        placeholder="https://..."
                      />
                    </div>
                  </FormField>
                </div>
              </div>
            </div>

            {/* Services & Features Section */}
            <div className="bg-obsidian/70 rounded-lg p-6 border border-desert-gold/20">
              <h3 className="text-xl font-bold text-desert-gold mb-6 flex items-center">
                <Settings className="h-5 w-5 mr-2" />
                {language === 'ar' ? 'الخدمات والمميزات' : 'Services & Features'}
              </h3>
              
              <div className="space-y-6">
                {/* Project Features */}
                <FormField label={language === 'ar' ? 'مميزات المشروع' : 'Project Features'}>
                  <div className="space-y-4">
                    <div className="flex">
                      <input
                        type="text"
                        value={newFeature}
                        onChange={(e) => setNewFeature(e.target.value)}
                        className="flex-1 bg-stone-gray/10 border border-desert-gold/20 rounded-r-none rounded-lg px-4 py-3 text-elegant-white placeholder-stone-gray focus:outline-none focus:border-desert-gold transition-colors duration-300"
                        placeholder={language === 'ar' ? 'أضف ميزة جديدة...' : 'Add new feature...'}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddFeature())}
                      />
                      <button
                        type="button"
                        onClick={handleAddFeature}
                        className="bg-desert-gold text-deep-black px-4 py-3 rounded-l-none rounded-lg font-medium hover:bg-warm-sand transition-all duration-300"
                      >
                        {language === 'ar' ? 'إضافة' : 'Add'}
                      </button>
                    </div>
                    
                    {features.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {features.map((feature) => (
                          <div 
                            key={feature.id}
                            className="bg-stone-gray/10 border border-desert-gold/30 rounded-full px-3 py-1 flex items-center space-x-2 rtl:space-x-reverse"
                          >
                            <Check className="h-4 w-4 text-desert-gold" />
                            <span className="text-elegant-white text-sm">{feature.text}</span>
                            <button
                              type="button"
                              onClick={() => removeFeature(feature.id)}
                              className="text-stone-gray hover:text-red-400 transition-colors duration-200"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-stone-gray text-sm italic">
                        {language === 'ar' ? 'لا توجد ميزات مضافة بعد' : 'No features added yet'}
                      </p>
                    )}
                  </div>
                </FormField>

                {/* Project Services */}
                <div>
                  <h4 className="text-lg font-bold text-elegant-white mb-4">
                    {language === 'ar' ? 'خدمات المشروع' : 'Project Services'}
                  </h4>
                  
                  <div className="relative mb-4">
                    <button
                      type="button"
                      onClick={() => setShowServicesDropdown(!showServicesDropdown)}
                      className="bg-desert-gold text-deep-black px-4 py-2 rounded-lg font-medium hover:bg-warm-sand transition-all duration-300 flex items-center space-x-2 rtl:space-x-reverse"
                    >
                      <Plus className="h-4 w-4" />
                      <span>{language === 'ar' ? 'إضافة خدمة' : 'Add Service'}</span>
                    </button>
                    
                    {showServicesDropdown && (
                      <div className="absolute z-10 mt-2 w-64 bg-obsidian border border-desert-gold/20 rounded-lg shadow-xl">
                        <div className="p-2">
                          <input
                            type="text"
                            placeholder={language === 'ar' ? 'بحث...' : 'Search...'}
                            className="w-full bg-stone-gray/10 border border-desert-gold/20 rounded-lg px-3 py-2 text-elegant-white placeholder-stone-gray focus:outline-none focus:border-desert-gold transition-colors duration-300 mb-2"
                          />
                          
                          <div className="max-h-60 overflow-y-auto">
                            {availableServices
                              .filter(service => !services.some(s => s.id === service.id))
                              .map(service => (
                                <button
                                  key={service.id}
                                  type="button"
                                  onClick={() => addService(service)}
                                  className="w-full text-left flex items-center space-x-2 rtl:space-x-reverse px-3 py-2 hover:bg-stone-gray/10 rounded-lg transition-colors duration-200"
                                >
                                  <service.icon className="h-5 w-5 text-desert-gold" />
                                  <span className="text-elegant-white">{service.name}</span>
                                </button>
                              ))}
                            
                            {!showCustomServiceInput && (
                              <button
                                type="button"
                                onClick={() => setShowCustomServiceInput(true)}
                                className="w-full text-left flex items-center space-x-2 rtl:space-x-reverse px-3 py-2 hover:bg-stone-gray/10 rounded-lg transition-colors duration-200 text-desert-gold"
                              >
                                <PlusCircle className="h-5 w-5" />
                                <span>{language === 'ar' ? 'إضافة خدمة مخصصة' : 'Add Custom Service'}</span>
                              </button>
                            )}
                          </div>
                          
                          {showCustomServiceInput && (
                            <div className="mt-2 p-2 border-t border-desert-gold/20">
                              <input
                                type="text"
                                value={customServiceName}
                                onChange={(e) => setCustomServiceName(e.target.value)}
                                placeholder={language === 'ar' ? 'اسم الخدمة المخصصة' : 'Custom service name'}
                                className="w-full bg-stone-gray/10 border border-desert-gold/20 rounded-lg px-3 py-2 text-elegant-white placeholder-stone-gray focus:outline-none focus:border-desert-gold transition-colors duration-300 mb-2"
                              />
                              <div className="flex space-x-2 rtl:space-x-reverse">
                                <button
                                  type="button"
                                  onClick={addCustomService}
                                  disabled={!customServiceName.trim()}
                                  className="bg-desert-gold text-deep-black px-3 py-1 rounded-lg font-medium hover:bg-warm-sand transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                                >
                                  {language === 'ar' ? 'إضافة' : 'Add'}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setShowCustomServiceInput(false);
                                    setCustomServiceName('');
                                  }}
                                  className="bg-stone-gray/20 text-stone-gray px-3 py-1 rounded-lg font-medium hover:bg-stone-gray/30 transition-all duration-300 text-sm"
                                >
                                  {language === 'ar' ? 'إلغاء' : 'Cancel'}
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {services.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {services.map((service) => (
                        <div
                          key={service.id}
                          className="bg-stone-gray/10 border border-desert-gold/20 rounded-lg p-3 flex items-center justify-between"
                        >
                          <div className="flex items-center space-x-3 rtl:space-x-reverse">
                            <div className="w-8 h-8 bg-desert-gold/20 rounded-full flex items-center justify-center">
                              <service.icon className="h-4 w-4 text-desert-gold" />
                            </div>
                            <span className="text-elegant-white">{service.name}</span>
                          </div>
                          
                          <div className="flex items-center space-x-2 rtl:space-x-reverse">
                            {service.id === 'elevators' && (
                              <input
                                type="number"
                                value={service.quantity || 1}
                                onChange={(e) => updateServiceQuantity(service.id, parseInt(e.target.value) || 1)}
                                min="1"
                                className="w-12 bg-stone-gray/20 border border-desert-gold/20 rounded-lg px-2 py-1 text-elegant-white text-center"
                              />
                            )}
                            <button
                              type="button"
                              onClick={() => removeService(service.id)}
                              className="text-stone-gray hover:text-red-400 transition-colors duration-200"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-stone-gray text-sm italic">
                      {language === 'ar' ? 'لا توجد خدمات مضافة بعد' : 'No services added yet'}
                    </p>
                  )}
                </div>
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
                {language === 'ar' ? 'إلغاء' : 'Cancel'}
              </motion.button>
              <motion.button
                type="submit"
                className="px-6 py-3 bg-desert-gold text-deep-black rounded-lg font-medium hover:bg-warm-sand transition-all duration-300"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {selectedProject ? 
                  (language === 'ar' ? 'تحديث' : 'Update') : 
                  (language === 'ar' ? 'إنشاء المشروع' : 'Create Project')
                }
              </motion.button>
            </div>
          </form>
        </Modal>
      </div>
    </PageWrapper>
  );
}