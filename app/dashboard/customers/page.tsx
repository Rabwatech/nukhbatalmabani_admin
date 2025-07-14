'use client';

import { motion } from 'framer-motion';
import { useDirection } from '@/context/DirectionContext';
import { useState, useEffect } from 'react';
import { Plus, User, Phone, Mail, MapPin, Building2, Calendar, FileText, Eye, Edit, Trash2, Filter, Search, ChevronDown, ChevronUp, CreditCard, Briefcase, Flag, UserPlus } from 'lucide-react';
import PageWrapper from '../components/PageWrapper';
import DataTable from '../components/shared/DataTable';
import StatusBadge from '../components/shared/StatusBadge';
import Modal from '../components/shared/Modal';
import FormField from '../components/shared/FormField';

export default function CustomersPage() {
  const { language, isRTL } = useDirection();
  const [activeTab, setActiveTab] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [activeDetailTab, setActiveDetailTab] = useState('info');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [projectFilter, setProjectFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [assignedFilter, setAssignedFilter] = useState('');
  const [isProjectInterestOpen, setIsProjectInterestOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState('');
  const [newCustomerId, setNewCustomerId] = useState('');

  // Generate a new customer ID when the modal opens
  useEffect(() => {
    if (showAddModal) {
      const randomNum = Math.floor(1000 + Math.random() * 9000);
      setNewCustomerId(`CUST-${randomNum}`);
    }
  }, [showAddModal]);

  // Mock data
  const customers = [
    {
      id: 'CUST-1001',
      name: language === 'ar' ? 'أحمد العتيبي' : 'Ahmed Al-Otaibi',
      nameEn: 'Ahmed Al-Otaibi',
      phone: '+966 50 123 4567',
      email: 'ahmed@example.com',
      status: 'interested',
      units: 0,
      nationalId: '1234567890',
      occupation: language === 'ar' ? 'مهندس' : 'Engineer',
      nationality: language === 'ar' ? 'سعودي' : 'Saudi',
      createdDate: '2024-01-15',
      assignedTo: language === 'ar' ? 'فاطمة الحربي' : 'Fatima Al-Harbi',
      address: language === 'ar' ? 'الرياض، حي الملقا، شارع الأمير سعود' : 'Riyadh, Al-Malqa District, Prince Saud St.',
      interactions: [
        {
          type: 'call',
          date: '2024-01-15',
          notes: language === 'ar' ? 'اتصال أولي لمناقشة الاهتمامات' : 'Initial call to discuss interests',
          staff: language === 'ar' ? 'فاطمة الحربي' : 'Fatima Al-Harbi'
        },
        {
          type: 'meeting',
          date: '2024-01-20',
          notes: language === 'ar' ? 'زيارة للمكتب لمشاهدة النماذج' : 'Office visit to see models',
          staff: language === 'ar' ? 'فاطمة الحربي' : 'Fatima Al-Harbi'
        }
      ],
      documents: [],
      notes: language === 'ar' ? 'مهتم بالوحدات السكنية في مجمع الأناقة' : 'Interested in residential units in Elegance Complex'
    },
    {
      id: 'CUST-1002',
      name: language === 'ar' ? 'فاطمة الحربي' : 'Fatima Al-Harbi',
      nameEn: 'Fatima Al-Harbi',
      phone: '+966 50 987 6543',
      email: 'fatima@example.com',
      status: 'booked',
      units: 1,
      nationalId: '0987654321',
      occupation: language === 'ar' ? 'طبيبة' : 'Doctor',
      nationality: language === 'ar' ? 'سعودية' : 'Saudi',
      createdDate: '2024-01-10',
      assignedTo: language === 'ar' ? 'أحمد العتيبي' : 'Ahmed Al-Otaibi',
      address: language === 'ar' ? 'جدة، حي الشاطئ، شارع الأمير فيصل' : 'Jeddah, Al-Shati District, Prince Faisal St.',
      interactions: [
        {
          type: 'call',
          date: '2024-01-10',
          notes: language === 'ar' ? 'اتصال أولي' : 'Initial call',
          staff: language === 'ar' ? 'أحمد العتيبي' : 'Ahmed Al-Otaibi'
        },
        {
          type: 'meeting',
          date: '2024-01-12',
          notes: language === 'ar' ? 'زيارة للموقع' : 'Site visit',
          staff: language === 'ar' ? 'أحمد العتيبي' : 'Ahmed Al-Otaibi'
        },
        {
          type: 'booking',
          date: '2024-01-18',
          notes: language === 'ar' ? 'حجز الوحدة B205' : 'Booked unit B205',
          staff: language === 'ar' ? 'أحمد العتيبي' : 'Ahmed Al-Otaibi'
        }
      ],
      documents: [
        {
          name: language === 'ar' ? 'استمارة الحجز' : 'Booking Form',
          date: '2024-01-18',
          type: 'pdf'
        }
      ],
      notes: language === 'ar' ? 'تفضل الطابق العلوي مع إطلالة' : 'Prefers upper floor with a view'
    },
    {
      id: 'CUST-1003',
      name: language === 'ar' ? 'خالد المطيري' : 'Khalid Al-Mutairi',
      nameEn: 'Khalid Al-Mutairi',
      phone: '+966 55 123 4567',
      email: 'khalid@example.com',
      status: 'contracted',
      units: 1,
      nationalId: '5678901234',
      occupation: language === 'ar' ? 'رجل أعمال' : 'Businessman',
      nationality: language === 'ar' ? 'سعودي' : 'Saudi',
      createdDate: '2023-12-05',
      assignedTo: language === 'ar' ? 'فاطمة الحربي' : 'Fatima Al-Harbi',
      address: language === 'ar' ? 'الرياض، حي العليا، شارع العروبة' : 'Riyadh, Olaya District, Al-Urubah Rd.',
      interactions: [
        {
          type: 'call',
          date: '2023-12-05',
          notes: language === 'ar' ? 'اتصال أولي' : 'Initial call',
          staff: language === 'ar' ? 'فاطمة الحربي' : 'Fatima Al-Harbi'
        },
        {
          type: 'meeting',
          date: '2023-12-10',
          notes: language === 'ar' ? 'زيارة للموقع' : 'Site visit',
          staff: language === 'ar' ? 'فاطمة الحربي' : 'Fatima Al-Harbi'
        },
        {
          type: 'booking',
          date: '2023-12-15',
          notes: language === 'ar' ? 'حجز الوحدة V15' : 'Booked unit V15',
          staff: language === 'ar' ? 'فاطمة الحربي' : 'Fatima Al-Harbi'
        },
        {
          type: 'contract',
          date: '2023-12-20',
          notes: language === 'ar' ? 'توقيع العقد' : 'Contract signed',
          staff: language === 'ar' ? 'أحمد العتيبي' : 'Ahmed Al-Otaibi'
        }
      ],
      documents: [
        {
          name: language === 'ar' ? 'استمارة الحجز' : 'Booking Form',
          date: '2023-12-15',
          type: 'pdf'
        },
        {
          name: language === 'ar' ? 'العقد' : 'Contract',
          date: '2023-12-20',
          type: 'pdf'
        }
      ],
      notes: language === 'ar' ? 'يفضل التواصل عبر الواتساب' : 'Prefers WhatsApp communication'
    },
    {
      id: 'CUST-1004',
      name: language === 'ar' ? 'نورا السالم' : 'Nora Al-Salem',
      nameEn: 'Nora Al-Salem',
      phone: '+966 55 987 6543',
      email: 'nora@example.com',
      status: 'owner',
      units: 2,
      nationalId: '9876543210',
      occupation: language === 'ar' ? 'مستثمرة' : 'Investor',
      nationality: language === 'ar' ? 'سعودية' : 'Saudi',
      createdDate: '2023-11-01',
      assignedTo: language === 'ar' ? 'خالد المطيري' : 'Khalid Al-Mutairi',
      address: language === 'ar' ? 'الدمام، حي الشاطئ، شارع الخليج' : 'Dammam, Al-Shati District, Gulf St.',
      interactions: [
        {
          type: 'call',
          date: '2023-11-01',
          notes: language === 'ar' ? 'اتصال أولي' : 'Initial call',
          staff: language === 'ar' ? 'خالد المطيري' : 'Khalid Al-Mutairi'
        },
        {
          type: 'meeting',
          date: '2023-11-05',
          notes: language === 'ar' ? 'زيارة للموقع' : 'Site visit',
          staff: language === 'ar' ? 'خالد المطيري' : 'Khalid Al-Mutairi'
        },
        {
          type: 'booking',
          date: '2023-11-10',
          notes: language === 'ar' ? 'حجز الوحدتين C302 و C303' : 'Booked units C302 and C303',
          staff: language === 'ar' ? 'خالد المطيري' : 'Khalid Al-Mutairi'
        },
        {
          type: 'contract',
          date: '2023-11-15',
          notes: language === 'ar' ? 'توقيع العقد' : 'Contract signed',
          staff: language === 'ar' ? 'أحمد العتيبي' : 'Ahmed Al-Otaibi'
        },
        {
          type: 'handover',
          date: '2023-12-01',
          notes: language === 'ar' ? 'تسليم المفاتيح' : 'Keys handover',
          staff: language === 'ar' ? 'فاطمة الحربي' : 'Fatima Al-Harbi'
        }
      ],
      documents: [
        {
          name: language === 'ar' ? 'استمارة الحجز' : 'Booking Form',
          date: '2023-11-10',
          type: 'pdf'
        },
        {
          name: language === 'ar' ? 'العقد' : 'Contract',
          date: '2023-11-15',
          type: 'pdf'
        },
        {
          name: language === 'ar' ? 'محضر التسليم' : 'Handover Report',
          date: '2023-12-01',
          type: 'pdf'
        }
      ],
      notes: language === 'ar' ? 'مستثمرة تبحث عن فرص إضافية' : 'Investor looking for additional opportunities'
    }
  ];

  // Mock projects data
  const projects = [
    {
      id: 1,
      name: language === 'ar' ? 'مجمع الأناقة' : 'Elegance Complex',
      units: [
        { id: 'A101', type: language === 'ar' ? 'شقة 3 غرف' : '3BR Apartment', paymentPlan: language === 'ar' ? 'أقساط ربع سنوية' : 'Quarterly Installments' },
        { id: 'A102', type: language === 'ar' ? 'شقة 2 غرف' : '2BR Apartment', paymentPlan: language === 'ar' ? 'دفعة كاملة' : 'Full Payment' },
        { id: 'A103', type: language === 'ar' ? 'شقة 4 غرف' : '4BR Apartment', paymentPlan: language === 'ar' ? 'أقساط شهرية' : 'Monthly Installments' }
      ]
    },
    {
      id: 2,
      name: language === 'ar' ? 'برج التجارة' : 'Trade Tower',
      units: [
        { id: 'B201', type: language === 'ar' ? 'مكتب صغير' : 'Small Office', paymentPlan: language === 'ar' ? 'دفعة كاملة' : 'Full Payment' },
        { id: 'B202', type: language === 'ar' ? 'مكتب متوسط' : 'Medium Office', paymentPlan: language === 'ar' ? 'أقساط سنوية' : 'Annual Installments' },
        { id: 'B203', type: language === 'ar' ? 'مكتب كبير' : 'Large Office', paymentPlan: language === 'ar' ? 'أقساط نصف سنوية' : 'Semi-Annual Installments' }
      ]
    },
    {
      id: 3,
      name: language === 'ar' ? 'قرية الهدوء' : 'Tranquil Village',
      units: [
        { id: 'V11', type: language === 'ar' ? 'فيلا صغيرة' : 'Small Villa', paymentPlan: language === 'ar' ? 'أقساط ربع سنوية' : 'Quarterly Installments' },
        { id: 'V12', type: language === 'ar' ? 'فيلا متوسطة' : 'Medium Villa', paymentPlan: language === 'ar' ? 'أقساط سنوية' : 'Annual Installments' },
        { id: 'V13', type: language === 'ar' ? 'فيلا كبيرة' : 'Large Villa', paymentPlan: language === 'ar' ? 'دفعة كاملة' : 'Full Payment' }
      ]
    }
  ];

  // Filter customers based on active tab and search term
  const filteredCustomers = customers.filter(customer => {
    // Filter by tab
    if (activeTab !== 'all' && getStatusKey(customer.status) !== activeTab) {
      return false;
    }

    // Filter by search term
    if (searchTerm && !customer.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !customer.phone.includes(searchTerm) && 
        !customer.email.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }

    // Filter by status
    if (statusFilter && getStatusKey(customer.status) !== statusFilter) {
      return false;
    }

    // Filter by assigned employee
    if (assignedFilter && customer.assignedTo !== assignedFilter) {
      return false;
    }

    // Filter by date (simple implementation)
    if (dateFilter) {
      const today = new Date();
      const customerDate = new Date(customer.createdDate);
      
      if (dateFilter === 'today' && 
          !(customerDate.getDate() === today.getDate() && 
            customerDate.getMonth() === today.getMonth() && 
            customerDate.getFullYear() === today.getFullYear())) {
        return false;
      }
      
      if (dateFilter === 'this-week') {
        const dayOfWeek = today.getDay();
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - dayOfWeek);
        
        if (customerDate < startOfWeek) {
          return false;
        }
      }
      
      if (dateFilter === 'this-month') {
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        
        if (customerDate < startOfMonth) {
          return false;
        }
      }
    }

    return true;
  });

  const getStatusKey = (status: string) => {
    switch (status) {
      case 'interested':
        return 'interested';
      case 'booked':
        return 'booked';
      case 'contracted':
        return 'contracted';
      case 'owner':
        return 'owner';
      default:
        return '';
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, { ar: string; en: string }> = {
      interested: { ar: 'مهتم', en: 'Interested' },
      booked: { ar: 'محجوز', en: 'Booked' },
      contracted: { ar: 'موقّع', en: 'Contracted' },
      owner: { ar: 'مالك', en: 'Owner' }
    };
    return labels[status]?.[language] || status;
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'interested':
        return 'info';
      case 'booked':
        return 'warning';
      case 'contracted':
        return 'success';
      case 'owner':
        return 'default';
      default:
        return 'default';
    }
  };

  const tabs = [
    { id: 'all', label: language === 'ar' ? 'جميع العملاء' : 'All Customers' },
    { id: 'interested', label: language === 'ar' ? 'مهتمين' : 'Interested' },
    { id: 'booked', label: language === 'ar' ? 'محجوز' : 'Booked' },
    { id: 'contracted', label: language === 'ar' ? 'موقّع' : 'Contracted' },
    { id: 'owner', label: language === 'ar' ? 'ملاك' : 'Owners' }
  ];

  const detailTabs = [
    { id: 'info', label: language === 'ar' ? 'المعلومات العامة' : 'General Info' },
    { id: 'interactions', label: language === 'ar' ? 'سجل التواصل' : 'Interaction Log' },
    { id: 'units', label: language === 'ar' ? 'الوحدات المرتبطة' : 'Linked Units' },
    { id: 'documents', label: language === 'ar' ? 'المستندات والعقود' : 'Documents & Contracts' },
    { id: 'notes', label: language === 'ar' ? 'ملاحظات الفريق' : 'Staff Notes' }
  ];

  const columns = [
    {
      key: 'name',
      label: language === 'ar' ? 'الاسم الكامل' : 'Full Name',
      sortable: true,
      render: (value: string, row: any) => (
        <div className="flex items-center space-x-3 rtl:space-x-reverse">
          <div className="w-10 h-10 bg-desert-gold/20 rounded-full flex items-center justify-center">
            <User className="h-5 w-5 text-desert-gold" />
          </div>
          <div>
            <div className="text-elegant-white font-medium">{value}</div>
            <div className="text-stone-gray text-sm">{row.id}</div>
          </div>
        </div>
      )
    },
    {
      key: 'contact',
      label: language === 'ar' ? 'معلومات الاتصال' : 'Contact Info',
      render: (_: any, row: any) => (
        <div>
          <div className="flex items-center space-x-2 rtl:space-x-reverse text-stone-gray">
            <Phone className="h-4 w-4 text-desert-gold" />
            <span>{row.phone}</span>
          </div>
          {row.email && (
            <div className="flex items-center space-x-2 rtl:space-x-reverse text-stone-gray mt-1">
              <Mail className="h-4 w-4 text-desert-gold" />
              <span>{row.email}</span>
            </div>
          )}
        </div>
      )
    },
    {
      key: 'status',
      label: language === 'ar' ? 'الحالة' : 'Status',
      render: (value: string) => (
        <StatusBadge 
          status={getStatusLabel(value)} 
          variant={getStatusVariant(value)} 
        />
      )
    },
    {
      key: 'units',
      label: language === 'ar' ? 'الوحدات' : 'Units',
      render: (value: number) => (
        <span className="text-elegant-white">{value}</span>
      )
    },
    {
      key: 'assignedTo',
      label: language === 'ar' ? 'المسؤول' : 'Assigned To',
      render: (value: string) => (
        <span className="text-stone-gray">{value}</span>
      )
    },
    {
      key: 'createdDate',
      label: language === 'ar' ? 'تاريخ الإضافة' : 'Created Date',
      render: (value: string) => (
        <span className="text-stone-gray">{value}</span>
      )
    }
  ];

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handleFilter = (filter: string) => {
    // This would handle more complex filtering
    console.log('Filter:', filter);
  };

  const handleView = (customer: any) => {
    setSelectedCustomer(customer);
    setShowDetailModal(true);
    setActiveDetailTab('info');
  };

  const handleEdit = (customer: any) => {
    setSelectedCustomer(customer);
    setShowAddModal(true);
  };

  const handleDelete = (customer: any) => {
    if (confirm(language === 'ar' ? 'هل أنت متأكد من حذف هذا العميل؟' : 'Are you sure you want to delete this customer?')) {
      console.log('Delete customer:', customer);
    }
  };

  const handleAddCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would handle the form submission
    console.log('Add customer form submitted');
    setShowAddModal(false);
  };

  const handleProjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedProject(e.target.value);
  };

  // Function to validate Absher ID (10 digits)
  const validateAbsherId = (value: string) => {
    return /^\d{10}$/.test(value);
  };

  return (
    <PageWrapper>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-elegant-white">
              {language === 'ar' ? 'إدارة العملاء' : 'Customer Management'}
            </h1>
            <p className="text-stone-gray mt-1">
              {language === 'ar' ? 'إدارة وتتبع العملاء المحتملين والحاليين' : 'Manage and track potential and current customers'}
            </p>
          </div>
          <motion.button
            onClick={() => setShowAddModal(true)}
            className="bg-desert-gold text-deep-black px-6 py-3 rounded-lg font-medium hover:bg-warm-sand transition-all duration-300 flex items-center space-x-2 rtl:space-x-reverse"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <UserPlus className="h-5 w-5" />
            <span>{language === 'ar' ? 'إضافة عميل جديد' : 'Add New Customer'}</span>
          </motion.button>
        </div>

        {/* Filter Bar */}
        <div className="bg-obsidian/50 backdrop-blur-sm rounded-xl p-6 border border-desert-gold/20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-stone-gray mb-2">
                {language === 'ar' ? 'الحالة' : 'Status'}
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full bg-stone-gray/10 border border-desert-gold/20 rounded-lg px-4 py-2 text-elegant-white focus:outline-none focus:border-desert-gold transition-colors duration-300"
              >
                <option value="" className="bg-obsidian">
                  {language === 'ar' ? 'جميع الحالات' : 'All Statuses'}
                </option>
                <option value="interested" className="bg-obsidian">
                  {language === 'ar' ? 'مهتم' : 'Interested'}
                </option>
                <option value="booked" className="bg-obsidian">
                  {language === 'ar' ? 'محجوز' : 'Booked'}
                </option>
                <option value="contracted" className="bg-obsidian">
                  {language === 'ar' ? 'موقّع' : 'Contracted'}
                </option>
                <option value="owner" className="bg-obsidian">
                  {language === 'ar' ? 'مالك' : 'Owner'}
                </option>
              </select>
            </div>

            {/* Project Filter */}
            <div>
              <label className="block text-sm font-medium text-stone-gray mb-2">
                {language === 'ar' ? 'المشروع' : 'Project'}
              </label>
              <select
                value={projectFilter}
                onChange={(e) => setProjectFilter(e.target.value)}
                className="w-full bg-stone-gray/10 border border-desert-gold/20 rounded-lg px-4 py-2 text-elegant-white focus:outline-none focus:border-desert-gold transition-colors duration-300"
              >
                <option value="" className="bg-obsidian">
                  {language === 'ar' ? 'جميع المشاريع' : 'All Projects'}
                </option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id} className="bg-obsidian">
                    {project.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Date Filter */}
            <div>
              <label className="block text-sm font-medium text-stone-gray mb-2">
                {language === 'ar' ? 'تاريخ الإضافة' : 'Creation Date'}
              </label>
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full bg-stone-gray/10 border border-desert-gold/20 rounded-lg px-4 py-2 text-elegant-white focus:outline-none focus:border-desert-gold transition-colors duration-300"
              >
                <option value="" className="bg-obsidian">
                  {language === 'ar' ? 'جميع التواريخ' : 'All Dates'}
                </option>
                <option value="today" className="bg-obsidian">
                  {language === 'ar' ? 'اليوم' : 'Today'}
                </option>
                <option value="this-week" className="bg-obsidian">
                  {language === 'ar' ? 'هذا الأسبوع' : 'This Week'}
                </option>
                <option value="this-month" className="bg-obsidian">
                  {language === 'ar' ? 'هذا الشهر' : 'This Month'}
                </option>
              </select>
            </div>

            {/* Assigned To Filter */}
            <div>
              <label className="block text-sm font-medium text-stone-gray mb-2">
                {language === 'ar' ? 'المسؤول' : 'Assigned To'}
              </label>
              <select
                value={assignedFilter}
                onChange={(e) => setAssignedFilter(e.target.value)}
                className="w-full bg-stone-gray/10 border border-desert-gold/20 rounded-lg px-4 py-2 text-elegant-white focus:outline-none focus:border-desert-gold transition-colors duration-300"
              >
                <option value="" className="bg-obsidian">
                  {language === 'ar' ? 'جميع الموظفين' : 'All Staff'}
                </option>
                <option value={language === 'ar' ? 'فاطمة الحربي' : 'Fatima Al-Harbi'} className="bg-obsidian">
                  {language === 'ar' ? 'فاطمة الحربي' : 'Fatima Al-Harbi'}
                </option>
                <option value={language === 'ar' ? 'أحمد العتيبي' : 'Ahmed Al-Otaibi'} className="bg-obsidian">
                  {language === 'ar' ? 'أحمد العتيبي' : 'Ahmed Al-Otaibi'}
                </option>
                <option value={language === 'ar' ? 'خالد المطيري' : 'Khalid Al-Mutairi'} className="bg-obsidian">
                  {language === 'ar' ? 'خالد المطيري' : 'Khalid Al-Mutairi'}
                </option>
              </select>
            </div>
          </div>
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

        {/* Customers Table */}
        <DataTable
          columns={columns}
          data={filteredCustomers}
          searchPlaceholder={language === 'ar' ? 'البحث عن عميل...' : 'Search customers...'}
          onSearch={handleSearch}
          onFilter={handleFilter}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        {/* Add/Edit Customer Modal */}
        <Modal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          title={selectedCustomer ? 
            (language === 'ar' ? 'تعديل بيانات العميل' : 'Edit Customer') : 
            (language === 'ar' ? 'إضافة عميل جديد' : 'Add New Customer')
          }
          size="xl"
        >
          <form onSubmit={handleAddCustomer} className="space-y-6">
            {/* General Information Section */}
            <div className="bg-stone-gray/10 rounded-lg p-6 border border-desert-gold/20">
              <h3 className="text-lg font-bold text-elegant-white mb-4">
                {language === 'ar' ? 'المعلومات العامة' : 'General Information'}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Customer ID */}
                <FormField label={language === 'ar' ? 'رقم العميل' : 'Customer ID'}>
                  <input
                    type="text"
                    value={selectedCustomer?.id || newCustomerId}
                    readOnly
                    className="w-full bg-stone-gray/10 border border-desert-gold/20 rounded-lg px-4 py-3 text-stone-gray focus:outline-none transition-colors duration-300 cursor-not-allowed"
                  />
                </FormField>

                {/* Full Name (Arabic) */}
                <FormField label={language === 'ar' ? 'الاسم الكامل (بالعربية)' : 'Full Name (Arabic)'} required>
                  <input
                    type="text"
                    defaultValue={selectedCustomer?.name || ''}
                    className="w-full bg-stone-gray/10 border border-desert-gold/20 rounded-lg px-4 py-3 text-elegant-white placeholder-stone-gray focus:outline-none focus:border-desert-gold transition-colors duration-300"
                    placeholder={language === 'ar' ? 'أدخل الاسم بالعربية' : 'Enter name in Arabic'}
                  />
                </FormField>

                {/* Full Name (English) */}
                <FormField label={language === 'ar' ? 'الاسم الكامل (بالإنجليزية)' : 'Full Name (English)'} required>
                  <input
                    type="text"
                    defaultValue={selectedCustomer?.nameEn || ''}
                    className="w-full bg-stone-gray/10 border border-desert-gold/20 rounded-lg px-4 py-3 text-elegant-white placeholder-stone-gray focus:outline-none focus:border-desert-gold transition-colors duration-300"
                    placeholder={language === 'ar' ? 'أدخل الاسم بالإنجليزية' : 'Enter name in English'}
                  />
                </FormField>

                {/* Absher ID */}
                <FormField 
                  label={language === 'ar' ? 'رقم الهوية (أبشر)' : 'Absher ID'} 
                  required
                  error={selectedCustomer?.nationalId && !validateAbsherId(selectedCustomer.nationalId) ? 
                    (language === 'ar' ? 'يجب أن يتكون من 10 أرقام فقط' : 'Must be 10 digits only') : undefined}
                >
                  <input
                    type="text"
                    defaultValue={selectedCustomer?.nationalId || ''}
                    pattern="[0-9]{10}"
                    maxLength={10}
                    className="w-full bg-stone-gray/10 border border-desert-gold/20 rounded-lg px-4 py-3 text-elegant-white placeholder-stone-gray focus:outline-none focus:border-desert-gold transition-colors duration-300"
                    placeholder={language === 'ar' ? 'أدخل رقم الهوية (10 أرقام)' : 'Enter Absher ID (10 digits)'}
                  />
                </FormField>

                {/* Nationality */}
                <FormField label={language === 'ar' ? 'الجنسية' : 'Nationality'} required>
                  <input
                    type="text"
                    defaultValue={selectedCustomer?.nationality || ''}
                    className="w-full bg-stone-gray/10 border border-desert-gold/20 rounded-lg px-4 py-3 text-elegant-white placeholder-stone-gray focus:outline-none focus:border-desert-gold transition-colors duration-300"
                    placeholder={language === 'ar' ? 'أدخل الجنسية' : 'Enter nationality'}
                  />
                </FormField>

                {/* Occupation */}
                <FormField label={language === 'ar' ? 'المهنة' : 'Occupation'}>
                  <input
                    type="text"
                    defaultValue={selectedCustomer?.occupation || ''}
                    className="w-full bg-stone-gray/10 border border-desert-gold/20 rounded-lg px-4 py-3 text-elegant-white placeholder-stone-gray focus:outline-none focus:border-desert-gold transition-colors duration-300"
                    placeholder={language === 'ar' ? 'أدخل المهنة' : 'Enter occupation'}
                  />
                </FormField>

                {/* Status */}
                <FormField label={language === 'ar' ? 'الحالة' : 'Status'} required>
                  <select
                    defaultValue={selectedCustomer?.status || 'interested'}
                    className="w-full bg-stone-gray/10 border border-desert-gold/20 rounded-lg px-4 py-3 text-elegant-white focus:outline-none focus:border-desert-gold transition-colors duration-300"
                  >
                    <option value="interested" className="bg-obsidian">
                      {language === 'ar' ? 'مهتم' : 'Interested'}
                    </option>
                    <option value="booked" className="bg-obsidian">
                      {language === 'ar' ? 'محجوز' : 'Booked'}
                    </option>
                    <option value="contracted" className="bg-obsidian">
                      {language === 'ar' ? 'موقّع' : 'Contracted'}
                    </option>
                    <option value="owner" className="bg-obsidian">
                      {language === 'ar' ? 'مالك' : 'Owner'}
                    </option>
                  </select>
                </FormField>

                {/* Assigned To */}
                <FormField label={language === 'ar' ? 'المسؤول' : 'Assigned To'} required>
                  <select
                    defaultValue={selectedCustomer?.assignedTo || ''}
                    className="w-full bg-stone-gray/10 border border-desert-gold/20 rounded-lg px-4 py-3 text-elegant-white focus:outline-none focus:border-desert-gold transition-colors duration-300"
                  >
                    <option value="" className="bg-obsidian">
                      {language === 'ar' ? 'اختر الموظف' : 'Select Employee'}
                    </option>
                    <option value={language === 'ar' ? 'فاطمة الحربي' : 'Fatima Al-Harbi'} className="bg-obsidian">
                      {language === 'ar' ? 'فاطمة الحربي' : 'Fatima Al-Harbi'}
                    </option>
                    <option value={language === 'ar' ? 'أحمد العتيبي' : 'Ahmed Al-Otaibi'} className="bg-obsidian">
                      {language === 'ar' ? 'أحمد العتيبي' : 'Ahmed Al-Otaibi'}
                    </option>
                    <option value={language === 'ar' ? 'خالد المطيري' : 'Khalid Al-Mutairi'} className="bg-obsidian">
                      {language === 'ar' ? 'خالد المطيري' : 'Khalid Al-Mutairi'}
                    </option>
                  </select>
                </FormField>
              </div>
            </div>

            {/* Contact Details Section */}
            <div className="bg-stone-gray/10 rounded-lg p-6 border border-desert-gold/20">
              <h3 className="text-lg font-bold text-elegant-white mb-4">
                {language === 'ar' ? 'معلومات الاتصال' : 'Contact Details'}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Phone Number */}
                <FormField label={language === 'ar' ? 'رقم الهاتف' : 'Phone Number'} required>
                  <input
                    type="tel"
                    defaultValue={selectedCustomer?.phone || ''}
                    className="w-full bg-stone-gray/10 border border-desert-gold/20 rounded-lg px-4 py-3 text-elegant-white placeholder-stone-gray focus:outline-none focus:border-desert-gold transition-colors duration-300"
                    placeholder="+966 5X XXX XXXX"
                  />
                </FormField>

                {/* Email */}
                <FormField label={language === 'ar' ? 'البريد الإلكتروني' : 'Email'}>
                  <input
                    type="email"
                    defaultValue={selectedCustomer?.email || ''}
                    className="w-full bg-stone-gray/10 border border-desert-gold/20 rounded-lg px-4 py-3 text-elegant-white placeholder-stone-gray focus:outline-none focus:border-desert-gold transition-colors duration-300"
                    placeholder="example@email.com"
                  />
                </FormField>

                {/* Residential Address */}
                <FormField label={language === 'ar' ? 'العنوان السكني' : 'Residential Address'} className="md:col-span-2">
                  <input
                    type="text"
                    defaultValue={selectedCustomer?.address || ''}
                    className="w-full bg-stone-gray/10 border border-desert-gold/20 rounded-lg px-4 py-3 text-elegant-white placeholder-stone-gray focus:outline-none focus:border-desert-gold transition-colors duration-300"
                    placeholder={language === 'ar' ? 'أدخل العنوان السكني الكامل' : 'Enter full residential address'}
                  />
                </FormField>
              </div>
            </div>

            {/* Project Purchase Interest Section */}
            <div className="bg-stone-gray/10 rounded-lg p-6 border border-desert-gold/20">
              <div 
                className="flex justify-between items-center cursor-pointer"
                onClick={() => setIsProjectInterestOpen(!isProjectInterestOpen)}
              >
                <h3 className="text-lg font-bold text-elegant-white">
                  {language === 'ar' ? 'اهتمامات الشراء' : 'Purchase Interest'}
                </h3>
                <button type="button" className="text-stone-gray hover:text-elegant-white transition-colors duration-200">
                  {isProjectInterestOpen ? 
                    <ChevronUp className="h-5 w-5" /> : 
                    <ChevronDown className="h-5 w-5" />
                  }
                </button>
              </div>
              
              {isProjectInterestOpen && (
                <div className="mt-4 space-y-6">
                  {/* Project Selection */}
                  <FormField label={language === 'ar' ? 'المشروع' : 'Project'}>
                    <select
                      value={selectedProject}
                      onChange={handleProjectChange}
                      className="w-full bg-stone-gray/10 border border-desert-gold/20 rounded-lg px-4 py-3 text-elegant-white focus:outline-none focus:border-desert-gold transition-colors duration-300"
                    >
                      <option value="" className="bg-obsidian">
                        {language === 'ar' ? 'اختر المشروع' : 'Select Project'}
                      </option>
                      {projects.map((project) => (
                        <option key={project.id} value={project.id} className="bg-obsidian">
                          {project.name}
                        </option>
                      ))}
                    </select>
                  </FormField>

                  {selectedProject && (
                    <>
                      {/* Unit Selection */}
                      <FormField label={language === 'ar' ? 'الوحدة' : 'Unit'}>
                        <select
                          className="w-full bg-stone-gray/10 border border-desert-gold/20 rounded-lg px-4 py-3 text-elegant-white focus:outline-none focus:border-desert-gold transition-colors duration-300"
                        >
                          <option value="" className="bg-obsidian">
                            {language === 'ar' ? 'اختر الوحدة' : 'Select Unit'}
                          </option>
                          {projects.find(p => p.id.toString() === selectedProject)?.units.map((unit) => (
                            <option key={unit.id} value={unit.id} className="bg-obsidian">
                              {unit.id} - {unit.type}
                            </option>
                          ))}
                        </select>
                      </FormField>

                      {/* Property Type */}
                      <FormField label={language === 'ar' ? 'نوع العقار' : 'Property Type'}>
                        <input
                          type="text"
                          value={selectedProject ? projects.find(p => p.id.toString() === selectedProject)?.units[0].type || '' : ''}
                          readOnly
                          className="w-full bg-stone-gray/10 border border-desert-gold/20 rounded-lg px-4 py-3 text-stone-gray focus:outline-none transition-colors duration-300 cursor-not-allowed"
                        />
                      </FormField>

                      {/* Payment Plan */}
                      <FormField label={language === 'ar' ? 'خطة الدفع' : 'Payment Plan'}>
                        <input
                          type="text"
                          value={selectedProject ? projects.find(p => p.id.toString() === selectedProject)?.units[0].paymentPlan || '' : ''}
                          readOnly
                          className="w-full bg-stone-gray/10 border border-desert-gold/20 rounded-lg px-4 py-3 text-stone-gray focus:outline-none transition-colors duration-300 cursor-not-allowed"
                        />
                      </FormField>

                      {/* Preferred Inspection Date */}
                      <FormField label={language === 'ar' ? 'تاريخ المعاينة المفضل' : 'Preferred Inspection Date'}>
                        <input
                          type="date"
                          className="w-full bg-stone-gray/10 border border-desert-gold/20 rounded-lg px-4 py-3 text-elegant-white focus:outline-none focus:border-desert-gold transition-colors duration-300"
                        />
                      </FormField>

                      {/* Customer Notes */}
                      <FormField label={language === 'ar' ? 'ملاحظات وتفضيلات العميل' : 'Customer Notes & Preferences'}>
                        <textarea
                          rows={4}
                          className="w-full bg-stone-gray/10 border border-desert-gold/20 rounded-lg px-4 py-3 text-elegant-white placeholder-stone-gray focus:outline-none focus:border-desert-gold transition-colors duration-300 resize-none"
                          placeholder={language === 'ar' ? 'أدخل ملاحظات أو تفضيلات العميل...' : 'Enter customer notes or preferences...'}
                        />
                      </FormField>
                    </>
                  )}
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-4 rtl:space-x-reverse pt-6">
              <motion.button
                type="button"
                onClick={() => setShowAddModal(false)}
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
                {selectedCustomer ? 
                  (language === 'ar' ? 'تحديث' : 'Update') : 
                  (language === 'ar' ? 'إضافة' : 'Add')
                }
              </motion.button>
            </div>
          </form>
        </Modal>

        {/* Customer Detail Modal */}
        <Modal
          isOpen={showDetailModal}
          onClose={() => setShowDetailModal(false)}
          title={selectedCustomer ? selectedCustomer.name : ''}
          size="xl"
        >
          {selectedCustomer && (
            <div className="space-y-6">
              {/* Tabs */}
              <div className="border-b border-desert-gold/20">
                <nav className="flex space-x-8 rtl:space-x-reverse overflow-x-auto">
                  {detailTabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveDetailTab(tab.id)}
                      className={`py-3 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors duration-200 ${
                        activeDetailTab === tab.id
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
              <div>
                {/* General Info Tab */}
                {activeDetailTab === 'info' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium text-stone-gray">
                          {language === 'ar' ? 'رقم العميل' : 'Customer ID'}
                        </h3>
                        <p className="text-elegant-white">{selectedCustomer.id}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-stone-gray">
                          {language === 'ar' ? 'الاسم الكامل (بالعربية)' : 'Full Name (Arabic)'}
                        </h3>
                        <p className="text-elegant-white">{selectedCustomer.name}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-stone-gray">
                          {language === 'ar' ? 'الاسم الكامل (بالإنجليزية)' : 'Full Name (English)'}
                        </h3>
                        <p className="text-elegant-white">{selectedCustomer.nameEn}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-stone-gray">
                          {language === 'ar' ? 'رقم الهوية' : 'National ID'}
                        </h3>
                        <p className="text-elegant-white">{selectedCustomer.nationalId}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-stone-gray">
                          {language === 'ar' ? 'الجنسية' : 'Nationality'}
                        </h3>
                        <p className="text-elegant-white">{selectedCustomer.nationality}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-stone-gray">
                          {language === 'ar' ? 'المهنة' : 'Occupation'}
                        </h3>
                        <p className="text-elegant-white">{selectedCustomer.occupation}</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium text-stone-gray">
                          {language === 'ar' ? 'رقم الهاتف' : 'Phone Number'}
                        </h3>
                        <p className="text-elegant-white">{selectedCustomer.phone}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-stone-gray">
                          {language === 'ar' ? 'البريد الإلكتروني' : 'Email'}
                        </h3>
                        <p className="text-elegant-white">{selectedCustomer.email || '-'}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-stone-gray">
                          {language === 'ar' ? 'العنوان' : 'Address'}
                        </h3>
                        <p className="text-elegant-white">{selectedCustomer.address || '-'}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-stone-gray">
                          {language === 'ar' ? 'الحالة' : 'Status'}
                        </h3>
                        <StatusBadge 
                          status={getStatusLabel(selectedCustomer.status)} 
                          variant={getStatusVariant(selectedCustomer.status)} 
                        />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-stone-gray">
                          {language === 'ar' ? 'تاريخ الإضافة' : 'Created Date'}
                        </h3>
                        <p className="text-elegant-white">{selectedCustomer.createdDate}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-stone-gray">
                          {language === 'ar' ? 'المسؤول' : 'Assigned To'}
                        </h3>
                        <p className="text-elegant-white">{selectedCustomer.assignedTo}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Interaction Log Tab */}
                {activeDetailTab === 'interactions' && (
                  <div className="space-y-4">
                    {selectedCustomer.interactions.length > 0 ? (
                      selectedCustomer.interactions.map((interaction: any, index: number) => (
                        <div 
                          key={index} 
                          className="bg-stone-gray/10 rounded-lg p-4 border border-desert-gold/20"
                        >
                          <div className="flex justify-between mb-2">
                            <div className="flex items-center space-x-2 rtl:space-x-reverse">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                interaction.type === 'call' ? 'bg-blue-500/20 text-blue-400' :
                                interaction.type === 'meeting' ? 'bg-green-500/20 text-green-400' :
                                interaction.type === 'booking' ? 'bg-yellow-500/20 text-yellow-400' :
                                interaction.type === 'contract' ? 'bg-purple-500/20 text-purple-400' :
                                'bg-stone-gray/20 text-stone-gray'
                              }`}>
                                {interaction.type === 'call' ? (language === 'ar' ? 'اتصال' : 'Call') :
                                 interaction.type === 'meeting' ? (language === 'ar' ? 'اجتماع' : 'Meeting') :
                                 interaction.type === 'booking' ? (language === 'ar' ? 'حجز' : 'Booking') :
                                 interaction.type === 'contract' ? (language === 'ar' ? 'عقد' : 'Contract') :
                                 interaction.type === 'handover' ? (language === 'ar' ? 'تسليم' : 'Handover') :
                                 interaction.type}
                              </span>
                              <span className="text-stone-gray text-sm">{interaction.date}</span>
                            </div>
                            <span className="text-stone-gray text-sm">{interaction.staff}</span>
                          </div>
                          <p className="text-elegant-white">{interaction.notes}</p>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-stone-gray">
                          {language === 'ar' ? 'لا توجد تفاعلات مسجلة' : 'No interactions recorded'}
                        </p>
                      </div>
                    )}

                    {/* Add Interaction Button */}
                    <div className="text-center">
                      <motion.button
                        type="button"
                        className="bg-desert-gold/20 text-desert-gold px-4 py-2 rounded-lg hover:bg-desert-gold/30 transition-colors duration-300 inline-flex items-center space-x-2 rtl:space-x-reverse"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Plus className="h-4 w-4" />
                        <span>{language === 'ar' ? 'إضافة تفاعل جديد' : 'Add New Interaction'}</span>
                      </motion.button>
                    </div>
                  </div>
                )}

                {/* Linked Units Tab */}
                {activeDetailTab === 'units' && (
                  <div className="space-y-4">
                    {selectedCustomer.units > 0 ? (
                      <div className="bg-stone-gray/10 rounded-lg p-4 border border-desert-gold/20">
                        <p className="text-elegant-white">
                          {language === 'ar' ? 'الوحدات المرتبطة ستظهر هنا' : 'Linked units will appear here'}
                        </p>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-stone-gray">
                          {language === 'ar' ? 'لا توجد وحدات مرتبطة' : 'No linked units'}
                        </p>
                      </div>
                    )}

                    {/* Link Unit Button */}
                    <div className="text-center">
                      <motion.button
                        type="button"
                        className="bg-desert-gold/20 text-desert-gold px-4 py-2 rounded-lg hover:bg-desert-gold/30 transition-colors duration-300 inline-flex items-center space-x-2 rtl:space-x-reverse"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Plus className="h-4 w-4" />
                        <span>{language === 'ar' ? 'ربط بوحدة' : 'Link to Unit'}</span>
                      </motion.button>
                    </div>
                  </div>
                )}

                {/* Documents Tab */}
                {activeDetailTab === 'documents' && (
                  <div className="space-y-4">
                    {selectedCustomer.documents.length > 0 ? (
                      selectedCustomer.documents.map((document: any, index: number) => (
                        <div 
                          key={index} 
                          className="bg-stone-gray/10 rounded-lg p-4 border border-desert-gold/20 flex justify-between items-center"
                        >
                          <div className="flex items-center space-x-3 rtl:space-x-reverse">
                            <FileText className="h-5 w-5 text-desert-gold" />
                            <div>
                              <p className="text-elegant-white">{document.name}</p>
                              <p className="text-stone-gray text-sm">{document.date}</p>
                            </div>
                          </div>
                          <motion.button
                            type="button"
                            className="text-stone-gray hover:text-desert-gold transition-colors duration-300"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Eye className="h-5 w-5" />
                          </motion.button>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-stone-gray">
                          {language === 'ar' ? 'لا توجد مستندات' : 'No documents'}
                        </p>
                      </div>
                    )}

                    {/* Upload Document Button */}
                    <div className="text-center">
                      <motion.button
                        type="button"
                        className="bg-desert-gold/20 text-desert-gold px-4 py-2 rounded-lg hover:bg-desert-gold/30 transition-colors duration-300 inline-flex items-center space-x-2 rtl:space-x-reverse"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Plus className="h-4 w-4" />
                        <span>{language === 'ar' ? 'رفع مستند' : 'Upload Document'}</span>
                      </motion.button>
                    </div>
                  </div>
                )}

                {/* Notes Tab */}
                {activeDetailTab === 'notes' && (
                  <div className="space-y-4">
                    <div className="bg-stone-gray/10 rounded-lg p-4 border border-desert-gold/20">
                      <p className="text-elegant-white">
                        {selectedCustomer.notes || (language === 'ar' ? 'لا توجد ملاحظات' : 'No notes')}
                      </p>
                    </div>

                    {/* Add Note Form */}
                    <div className="mt-4">
                      <textarea
                        rows={4}
                        className="w-full bg-stone-gray/10 border border-desert-gold/20 rounded-lg px-4 py-3 text-elegant-white placeholder-stone-gray focus:outline-none focus:border-desert-gold transition-colors duration-300 resize-none mb-4"
                        placeholder={language === 'ar' ? 'أضف ملاحظة جديدة...' : 'Add a new note...'}
                      />
                      <div className="flex justify-end">
                        <motion.button
                          type="button"
                          className="bg-desert-gold text-deep-black px-4 py-2 rounded-lg font-medium hover:bg-warm-sand transition-all duration-300 inline-flex items-center space-x-2 rtl:space-x-reverse"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Plus className="h-4 w-4" />
                          <span>{language === 'ar' ? 'إضافة ملاحظة' : 'Add Note'}</span>
                        </motion.button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-4 rtl:space-x-reverse pt-6 border-t border-desert-gold/20">
                <motion.button
                  type="button"
                  onClick={() => {
                    setShowDetailModal(false);
                    setSelectedCustomer(null);
                  }}
                  className="px-6 py-3 border border-desert-gold/20 text-stone-gray rounded-lg hover:bg-stone-gray/10 transition-all duration-300"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {language === 'ar' ? 'إغلاق' : 'Close'}
                </motion.button>
                <motion.button
                  type="button"
                  onClick={() => {
                    setShowDetailModal(false);
                    handleEdit(selectedCustomer);
                  }}
                  className="px-6 py-3 bg-desert-gold text-deep-black rounded-lg font-medium hover:bg-warm-sand transition-all duration-300"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {language === 'ar' ? 'تعديل' : 'Edit'}
                </motion.button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </PageWrapper>
  );
}