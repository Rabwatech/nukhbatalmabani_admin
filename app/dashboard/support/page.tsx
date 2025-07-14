'use client';

import { motion } from 'framer-motion';
import { useDirection } from '@/context/DirectionContext';
import { useState } from 'react';
import { Plus, Upload, Star, Clock, User, CheckCircle, AlertCircle, PenTool as Tool, MessageSquare, Camera, Send } from 'lucide-react';
import PageWrapper from '../components/PageWrapper';
import DataTable from '../components/shared/DataTable';
import StatusBadge from '../components/shared/StatusBadge';
import Modal from '../components/shared/Modal';
import FormField from '../components/shared/FormField';

export default function SupportPage() {
  const { language } = useDirection();
  const [activeTab, setActiveTab] = useState('requests');
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [dragActive, setDragActive] = useState(false);

  // Mock data
  const maintenanceRequests = [
    {
      id: 1,
      ticketNumber: 'MT-2024-001',
      client: language === 'ar' ? 'أحمد العتيبي' : 'Ahmed Al-Otaibi',
      unit: 'A101',
      project: language === 'ar' ? 'مجمع الأناقة' : 'Elegance Complex',
      issueType: language === 'ar' ? 'سباكة' : 'Plumbing',
      description: language === 'ar' ? 'تسريب في الحمام الرئيسي' : 'Leak in main bathroom',
      status: 'new',
      priority: 'high',
      createdDate: '2024-01-20',
      assignedTo: language === 'ar' ? 'محمد الفني' : 'Mohammed Tech'
    },
    {
      id: 2,
      ticketNumber: 'MT-2024-002',
      client: language === 'ar' ? 'فاطمة الحربي' : 'Fatima Al-Harbi',
      unit: 'B205',
      project: language === 'ar' ? 'برج التجارة' : 'Trade Tower',
      issueType: language === 'ar' ? 'كهرباء' : 'Electrical',
      description: language === 'ar' ? 'انقطاع الكهرباء في المطبخ' : 'Power outage in kitchen',
      status: 'in-progress',
      priority: 'medium',
      createdDate: '2024-01-18',
      assignedTo: language === 'ar' ? 'علي الكهربائي' : 'Ali Electrician'
    },
    {
      id: 3,
      ticketNumber: 'MT-2024-003',
      client: language === 'ar' ? 'خالد المطيري' : 'Khalid Al-Mutairi',
      unit: 'V15',
      project: language === 'ar' ? 'قرية الهدوء' : 'Tranquil Village',
      issueType: language === 'ar' ? 'تكييف' : 'AC',
      description: language === 'ar' ? 'التكييف لا يعمل بكفاءة' : 'AC not working efficiently',
      status: 'resolved',
      priority: 'low',
      createdDate: '2024-01-15',
      assignedTo: language === 'ar' ? 'سعد التكييف' : 'Saad AC Tech'
    }
  ];

  const supportTickets = [
    {
      id: 1,
      ticketNumber: 'ST-2024-001',
      client: language === 'ar' ? 'نورا السالم' : 'Nora Al-Salem',
      subject: language === 'ar' ? 'استفسار عن الضمان' : 'Warranty inquiry',
      category: language === 'ar' ? 'عام' : 'General',
      status: 'open',
      priority: 'medium',
      createdDate: '2024-01-22',
      lastUpdate: '2024-01-22'
    },
    {
      id: 2,
      ticketNumber: 'ST-2024-002',
      client: language === 'ar' ? 'سعد الدوسري' : 'Saad Al-Dosari',
      subject: language === 'ar' ? 'طلب تغيير في التشطيبات' : 'Request for finishing changes',
      category: language === 'ar' ? 'تشطيبات' : 'Finishing',
      status: 'closed',
      priority: 'low',
      createdDate: '2024-01-20',
      lastUpdate: '2024-01-21'
    }
  ];

  const serviceReports = [
    {
      id: 1,
      ticketNumber: 'MT-2024-003',
      technician: language === 'ar' ? 'سعد التكييف' : 'Saad AC Tech',
      client: language === 'ar' ? 'خالد المطيري' : 'Khalid Al-Mutairi',
      serviceDate: '2024-01-16',
      workDone: language === 'ar' ? 'تنظيف وصيانة وحدة التكييف' : 'Cleaned and serviced AC unit',
      rating: 5,
      feedback: language === 'ar' ? 'خدمة ممتازة وسريعة' : 'Excellent and fast service'
    },
    {
      id: 2,
      ticketNumber: 'MT-2024-001',
      technician: language === 'ar' ? 'محمد الفني' : 'Mohammed Tech',
      client: language === 'ar' ? 'أحمد العتيبي' : 'Ahmed Al-Otaibi',
      serviceDate: '2024-01-21',
      workDone: language === 'ar' ? 'إصلاح التسريب وتغيير الأنابيب' : 'Fixed leak and replaced pipes',
      rating: 4,
      feedback: language === 'ar' ? 'جيد جداً' : 'Very good'
    }
  ];

  const getRequestStatusVariant = (status: string) => {
    switch (status) {
      case 'new':
        return 'info';
      case 'in-progress':
        return 'warning';
      case 'resolved':
        return 'success';
      case 'closed':
        return 'default';
      default:
        return 'default';
    }
  };

  const getRequestStatusLabel = (status: string) => {
    const labels: Record<string, { ar: string; en: string }> = {
      new: { ar: 'جديد', en: 'New' },
      'in-progress': { ar: 'قيد التنفيذ', en: 'In Progress' },
      resolved: { ar: 'تم الحل', en: 'Resolved' },
      closed: { ar: 'مغلق', en: 'Closed' }
    };
    return labels[status]?.[language] || status;
  };

  const getPriorityVariant = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'success';
      default:
        return 'default';
    }
  };

  const getPriorityLabel = (priority: string) => {
    const labels: Record<string, { ar: string; en: string }> = {
      high: { ar: 'عالية', en: 'High' },
      medium: { ar: 'متوسطة', en: 'Medium' },
      low: { ar: 'منخفضة', en: 'Low' }
    };
    return labels[priority]?.[language] || priority;
  };

  const tabs = [
    { id: 'requests', label: language === 'ar' ? 'طلبات الصيانة' : 'Maintenance Requests' },
    { id: 'tickets', label: language === 'ar' ? 'تذاكر الدعم' : 'Support Tickets' },
    { id: 'reports', label: language === 'ar' ? 'تقارير الخدمة' : 'Service Reports' },
    { id: 'ratings', label: language === 'ar' ? 'تقييمات العملاء' : 'Customer Ratings' }
  ];

  const requestColumns = [
    {
      key: 'ticketNumber',
      label: language === 'ar' ? 'رقم التذكرة' : 'Ticket Number',
      sortable: true,
      render: (value: string) => (
        <span className="text-desert-gold font-medium">{value}</span>
      )
    },
    {
      key: 'client',
      label: language === 'ar' ? 'العميل' : 'Client',
      sortable: true
    },
    {
      key: 'unit',
      label: language === 'ar' ? 'الوحدة' : 'Unit',
      render: (value: string, row: any) => (
        <div>
          <div className="text-elegant-white font-medium">{value}</div>
          <div className="text-stone-gray text-sm">{row.project}</div>
        </div>
      )
    },
    {
      key: 'issueType',
      label: language === 'ar' ? 'نوع المشكلة' : 'Issue Type',
      render: (value: string) => (
        <span className="text-stone-gray">{value}</span>
      )
    },
    {
      key: 'priority',
      label: language === 'ar' ? 'الأولوية' : 'Priority',
      render: (value: string) => (
        <StatusBadge 
          status={getPriorityLabel(value)} 
          variant={getPriorityVariant(value)} 
          size="sm"
        />
      )
    },
    {
      key: 'status',
      label: language === 'ar' ? 'الحالة' : 'Status',
      render: (value: string) => (
        <StatusBadge 
          status={getRequestStatusLabel(value)} 
          variant={getRequestStatusVariant(value)} 
        />
      )
    },
    {
      key: 'assignedTo',
      label: language === 'ar' ? 'المكلف' : 'Assigned To',
      render: (value: string) => (
        <span className="text-stone-gray">{value}</span>
      )
    }
  ];

  const ticketColumns = [
    {
      key: 'ticketNumber',
      label: language === 'ar' ? 'رقم التذكرة' : 'Ticket Number',
      sortable: true,
      render: (value: string) => (
        <span className="text-desert-gold font-medium">{value}</span>
      )
    },
    {
      key: 'client',
      label: language === 'ar' ? 'العميل' : 'Client',
      sortable: true
    },
    {
      key: 'subject',
      label: language === 'ar' ? 'الموضوع' : 'Subject',
      render: (value: string) => (
        <span className="text-elegant-white">{value}</span>
      )
    },
    {
      key: 'category',
      label: language === 'ar' ? 'الفئة' : 'Category',
      render: (value: string) => (
        <span className="text-stone-gray">{value}</span>
      )
    },
    {
      key: 'priority',
      label: language === 'ar' ? 'الأولوية' : 'Priority',
      render: (value: string) => (
        <StatusBadge 
          status={getPriorityLabel(value)} 
          variant={getPriorityVariant(value)} 
          size="sm"
        />
      )
    },
    {
      key: 'status',
      label: language === 'ar' ? 'الحالة' : 'Status',
      render: (value: string) => (
        <StatusBadge 
          status={value === 'open' ? (language === 'ar' ? 'مفتوح' : 'Open') : (language === 'ar' ? 'مغلق' : 'Closed')} 
          variant={value === 'open' ? 'warning' : 'success'} 
        />
      )
    }
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
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      console.log('File dropped:', e.dataTransfer.files[0]);
    }
  };

  const handleView = (item: any) => {
    setSelectedTicket(item);
  };

  const handleEdit = (item: any) => {
    setSelectedTicket(item);
    setShowRequestModal(true);
  };

  const handleDelete = (item: any) => {
    if (confirm(language === 'ar' ? 'هل أنت متأكد من الحذف؟' : 'Are you sure you want to delete?')) {
      console.log('Delete item:', item);
    }
  };

  return (
    <PageWrapper>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-elegant-white">
              {language === 'ar' ? 'خدمة ما بعد البيع' : 'After-Sales Support'}
            </h1>
            <p className="text-stone-gray mt-1">
              {language === 'ar' ? 'إدارة طلبات الصيانة والدعم الفني' : 'Manage maintenance requests and technical support'}
            </p>
          </div>
          <div className="flex space-x-3 rtl:space-x-reverse">
            <motion.button
              onClick={() => setShowReportModal(true)}
              className="bg-stone-gray/20 text-elegant-white px-6 py-3 rounded-lg font-medium hover:bg-stone-gray/30 transition-all duration-300 flex items-center space-x-2 rtl:space-x-reverse"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <CheckCircle className="h-5 w-5" />
              <span>{language === 'ar' ? 'تقرير خدمة' : 'Service Report'}</span>
            </motion.button>
            <motion.button
              onClick={() => setShowRequestModal(true)}
              className="bg-desert-gold text-deep-black px-6 py-3 rounded-lg font-medium hover:bg-warm-sand transition-all duration-300 flex items-center space-x-2 rtl:space-x-reverse"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Plus className="h-5 w-5" />
              <span>{language === 'ar' ? 'طلب جديد' : 'New Request'}</span>
            </motion.button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-desert-gold/20">
          <nav className="flex space-x-8 rtl:space-x-reverse overflow-x-auto">
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
          {activeTab === 'requests' && (
            <DataTable
              columns={requestColumns}
              data={maintenanceRequests}
              searchPlaceholder={language === 'ar' ? 'البحث في طلبات الصيانة...' : 'Search maintenance requests...'}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}

          {activeTab === 'tickets' && (
            <DataTable
              columns={ticketColumns}
              data={supportTickets}
              searchPlaceholder={language === 'ar' ? 'البحث في تذاكر الدعم...' : 'Search support tickets...'}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}

          {activeTab === 'reports' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-elegant-white">
                  {language === 'ar' ? 'تقارير الخدمة' : 'Service Reports'}
                </h2>
                <motion.button
                  onClick={() => setShowReportModal(true)}
                  className="bg-desert-gold text-deep-black px-4 py-2 rounded-lg font-medium hover:bg-warm-sand transition-all duration-300 flex items-center space-x-2 rtl:space-x-reverse"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Plus className="h-4 w-4" />
                  <span>{language === 'ar' ? 'تقرير جديد' : 'New Report'}</span>
                </motion.button>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {serviceReports.map((report, index) => (
                  <motion.div
                    key={report.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-obsidian/50 backdrop-blur-sm rounded-lg p-6 border border-desert-gold/20"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-elegant-white">{report.ticketNumber}</h3>
                        <p className="text-stone-gray">{report.client}</p>
                      </div>
                      <div className="flex items-center space-x-1 rtl:space-x-reverse">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`h-4 w-4 ${i < report.rating ? 'text-yellow-400 fill-current' : 'text-stone-gray'}`} 
                          />
                        ))}
                      </div>
                    </div>
                    
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center space-x-2 rtl:space-x-reverse">
                        <User className="h-4 w-4 text-desert-gold" />
                        <span className="text-stone-gray">{report.technician}</span>
                      </div>
                      <div className="flex items-center space-x-2 rtl:space-x-reverse">
                        <Clock className="h-4 w-4 text-desert-gold" />
                        <span className="text-stone-gray">{report.serviceDate}</span>
                      </div>
                      <div className="flex items-start space-x-2 rtl:space-x-reverse">
                        <Tool className="h-4 w-4 text-desert-gold mt-1" />
                        <span className="text-elegant-white">{report.workDone}</span>
                      </div>
                    </div>

                    <div className="bg-stone-gray/10 rounded-lg p-3">
                      <p className="text-stone-gray text-sm italic">"{report.feedback}"</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'ratings' && (
            <div className="bg-obsidian/50 backdrop-blur-sm rounded-xl p-8 border border-desert-gold/20">
              <h2 className="text-2xl font-bold text-elegant-white mb-6">
                {language === 'ar' ? 'تقييمات العملاء' : 'Customer Ratings'}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-stone-gray/10 rounded-lg p-6 text-center">
                  <Star className="h-8 w-8 text-yellow-400 mx-auto mb-3 fill-current" />
                  <h3 className="text-lg font-bold text-elegant-white mb-2">
                    {language === 'ar' ? 'متوسط التقييم' : 'Average Rating'}
                  </h3>
                  <p className="text-3xl font-bold text-yellow-400">4.5</p>
                  <p className="text-stone-gray text-sm">{language === 'ar' ? 'من 5 نجوم' : 'out of 5 stars'}</p>
                </div>
                
                <div className="bg-stone-gray/10 rounded-lg p-6 text-center">
                  <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-3" />
                  <h3 className="text-lg font-bold text-elegant-white mb-2">
                    {language === 'ar' ? 'الخدمات المكتملة' : 'Completed Services'}
                  </h3>
                  <p className="text-3xl font-bold text-green-500">156</p>
                  <p className="text-stone-gray text-sm">{language === 'ar' ? 'هذا الشهر' : 'this month'}</p>
                </div>
                
                <div className="bg-stone-gray/10 rounded-lg p-6 text-center">
                  <MessageSquare className="h-8 w-8 text-blue-500 mx-auto mb-3" />
                  <h3 className="text-lg font-bold text-elegant-white mb-2">
                    {language === 'ar' ? 'معدل الرضا' : 'Satisfaction Rate'}
                  </h3>
                  <p className="text-3xl font-bold text-blue-500">94%</p>
                  <p className="text-stone-gray text-sm">{language === 'ar' ? 'عملاء راضون' : 'satisfied customers'}</p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-bold text-elegant-white">
                  {language === 'ar' ? 'آخر التقييمات' : 'Recent Ratings'}
                </h3>
                
                {serviceReports.map((report, index) => (
                  <motion.div
                    key={report.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-stone-gray/10 rounded-lg p-4 flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-4 rtl:space-x-reverse">
                      <div className="w-10 h-10 bg-desert-gold rounded-full flex items-center justify-center">
                        <span className="text-deep-black font-bold">{report.client.charAt(0)}</span>
                      </div>
                      <div>
                        <h4 className="text-elegant-white font-medium">{report.client}</h4>
                        <p className="text-stone-gray text-sm">{report.serviceDate}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <div className="flex items-center space-x-1 rtl:space-x-reverse">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`h-4 w-4 ${i < report.rating ? 'text-yellow-400 fill-current' : 'text-stone-gray'}`} 
                          />
                        ))}
                      </div>
                      <span className="text-elegant-white font-medium">{report.rating}/5</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* New Request Modal */}
        <Modal
          isOpen={showRequestModal}
          onClose={() => setShowRequestModal(false)}
          title={language === 'ar' ? 'طلب صيانة جديد' : 'New Maintenance Request'}
          size="lg"
        >
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField label={language === 'ar' ? 'العميل' : 'Client'} required>
                <select className="w-full bg-stone-gray/10 border border-desert-gold/20 rounded-lg px-4 py-3 text-elegant-white focus:outline-none focus:border-desert-gold transition-colors duration-300">
                  <option value="" className="bg-obsidian">
                    {language === 'ar' ? 'اختر العميل' : 'Select Client'}
                  </option>
                  <option value="1" className="bg-obsidian">
                    {language === 'ar' ? 'أحمد العتيبي' : 'Ahmed Al-Otaibi'}
                  </option>
                  <option value="2" className="bg-obsidian">
                    {language === 'ar' ? 'فاطمة الحربي' : 'Fatima Al-Harbi'}
                  </option>
                </select>
              </FormField>

              <FormField label={language === 'ar' ? 'الوحدة' : 'Unit'} required>
                <select className="w-full bg-stone-gray/10 border border-desert-gold/20 rounded-lg px-4 py-3 text-elegant-white focus:outline-none focus:border-desert-gold transition-colors duration-300">
                  <option value="" className="bg-obsidian">
                    {language === 'ar' ? 'اختر الوحدة' : 'Select Unit'}
                  </option>
                  <option value="a101" className="bg-obsidian">A101 - {language === 'ar' ? 'مجمع الأناقة' : 'Elegance Complex'}</option>
                  <option value="b205" className="bg-obsidian">B205 - {language === 'ar' ? 'برج التجارة' : 'Trade Tower'}</option>
                </select>
              </FormField>

              <FormField label={language === 'ar' ? 'نوع المشكلة' : 'Issue Type'} required>
                <select className="w-full bg-stone-gray/10 border border-desert-gold/20 rounded-lg px-4 py-3 text-elegant-white focus:outline-none focus:border-desert-gold transition-colors duration-300">
                  <option value="" className="bg-obsidian">
                    {language === 'ar' ? 'اختر نوع المشكلة' : 'Select Issue Type'}
                  </option>
                  <option value="plumbing" className="bg-obsidian">
                    {language === 'ar' ? 'سباكة' : 'Plumbing'}
                  </option>
                  <option value="electrical" className="bg-obsidian">
                    {language === 'ar' ? 'كهرباء' : 'Electrical'}
                  </option>
                  <option value="ac" className="bg-obsidian">
                    {language === 'ar' ? 'تكييف' : 'AC'}
                  </option>
                  <option value="general" className="bg-obsidian">
                    {language === 'ar' ? 'عام' : 'General'}
                  </option>
                </select>
              </FormField>

              <FormField label={language === 'ar' ? 'الأولوية' : 'Priority'} required>
                <select className="w-full bg-stone-gray/10 border border-desert-gold/20 rounded-lg px-4 py-3 text-elegant-white focus:outline-none focus:border-desert-gold transition-colors duration-300">
                  <option value="low" className="bg-obsidian">
                    {language === 'ar' ? 'منخفضة' : 'Low'}
                  </option>
                  <option value="medium" className="bg-obsidian">
                    {language === 'ar' ? 'متوسطة' : 'Medium'}
                  </option>
                  <option value="high" className="bg-obsidian">
                    {language === 'ar' ? 'عالية' : 'High'}
                  </option>
                </select>
              </FormField>

              <FormField label={language === 'ar' ? 'المكلف بالمهمة' : 'Assign To'}>
                <select className="w-full bg-stone-gray/10 border border-desert-gold/20 rounded-lg px-4 py-3 text-elegant-white focus:outline-none focus:border-desert-gold transition-colors duration-300">
                  <option value="" className="bg-obsidian">
                    {language === 'ar' ? 'اختر الفني' : 'Select Technician'}
                  </option>
                  <option value="mohammed" className="bg-obsidian">
                    {language === 'ar' ? 'محمد الفني' : 'Mohammed Tech'}
                  </option>
                  <option value="ali" className="bg-obsidian">
                    {language === 'ar' ? 'علي الكهربائي' : 'Ali Electrician'}
                  </option>
                  <option value="saad" className="bg-obsidian">
                    {language === 'ar' ? 'سعد التكييف' : 'Saad AC Tech'}
                  </option>
                </select>
              </FormField>
            </div>

            <FormField label={language === 'ar' ? 'وصف المشكلة' : 'Issue Description'} required>
              <textarea
                rows={4}
                className="w-full bg-stone-gray/10 border border-desert-gold/20 rounded-lg px-4 py-3 text-elegant-white placeholder-stone-gray focus:outline-none focus:border-desert-gold transition-colors duration-300 resize-none"
                placeholder={language === 'ar' ? 'اشرح المشكلة بالتفصيل...' : 'Describe the issue in detail...'}
              />
            </FormField>

            {/* File Upload Area */}
            <div>
              <label className="block text-sm font-medium text-elegant-white mb-2">
                {language === 'ar' ? 'صور المشكلة (اختياري)' : 'Issue Photos (Optional)'}
              </label>
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
                <Camera className="h-8 w-8 text-desert-gold mx-auto mb-3" />
                <p className="text-stone-gray mb-2">
                  {language === 'ar' ? 'اسحب وأفلت الصور هنا' : 'Drag and drop photos here'}
                </p>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  id="photos-upload"
                />
                <label
                  htmlFor="photos-upload"
                  className="inline-flex items-center px-3 py-2 bg-desert-gold/20 text-desert-gold rounded-lg hover:bg-desert-gold/30 transition-colors duration-200 cursor-pointer text-sm"
                >
                  {language === 'ar' ? 'اختر الصور' : 'Choose Photos'}
                </label>
              </div>
            </div>

            <div className="flex justify-end space-x-4 rtl:space-x-reverse pt-6">
              <motion.button
                type="button"
                onClick={() => setShowRequestModal(false)}
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
                {language === 'ar' ? 'إنشاء الطلب' : 'Create Request'}
              </motion.button>
            </div>
          </form>
        </Modal>

        {/* Service Report Modal */}
        <Modal
          isOpen={showReportModal}
          onClose={() => setShowReportModal(false)}
          title={language === 'ar' ? 'تقرير خدمة جديد' : 'New Service Report'}
          size="lg"
        >
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField label={language === 'ar' ? 'رقم التذكرة' : 'Ticket Number'} required>
                <select className="w-full bg-stone-gray/10 border border-desert-gold/20 rounded-lg px-4 py-3 text-elegant-white focus:outline-none focus:border-desert-gold transition-colors duration-300">
                  <option value="" className="bg-obsidian">
                    {language === 'ar' ? 'اختر التذكرة' : 'Select Ticket'}
                  </option>
                  {maintenanceRequests.map((request) => (
                    <option key={request.id} value={request.ticketNumber} className="bg-obsidian">
                      {request.ticketNumber} - {request.client}
                    </option>
                  ))}
                </select>
              </FormField>

              <FormField label={language === 'ar' ? 'الفني المنفذ' : 'Technician'} required>
                <select className="w-full bg-stone-gray/10 border border-desert-gold/20 rounded-lg px-4 py-3 text-elegant-white focus:outline-none focus:border-desert-gold transition-colors duration-300">
                  <option value="" className="bg-obsidian">
                    {language === 'ar' ? 'اختر الفني' : 'Select Technician'}
                  </option>
                  <option value="mohammed" className="bg-obsidian">
                    {language === 'ar' ? 'محمد الفني' : 'Mohammed Tech'}
                  </option>
                  <option value="ali" className="bg-obsidian">
                    {language === 'ar' ? 'علي الكهربائي' : 'Ali Electrician'}
                  </option>
                  <option value="saad" className="bg-obsidian">
                    {language === 'ar' ? 'سعد التكييف' : 'Saad AC Tech'}
                  </option>
                </select>
              </FormField>

              <FormField label={language === 'ar' ? 'تاريخ الخدمة' : 'Service Date'} required>
                <input
                  type="date"
                  className="w-full bg-stone-gray/10 border border-desert-gold/20 rounded-lg px-4 py-3 text-elegant-white focus:outline-none focus:border-desert-gold transition-colors duration-300"
                />
              </FormField>

              <FormField label={language === 'ar' ? 'وقت الخدمة' : 'Service Time'} required>
                <input
                  type="time"
                  className="w-full bg-stone-gray/10 border border-desert-gold/20 rounded-lg px-4 py-3 text-elegant-white focus:outline-none focus:border-desert-gold transition-colors duration-300"
                />
              </FormField>
            </div>

            <FormField label={language === 'ar' ? 'الأعمال المنجزة' : 'Work Completed'} required>
              <textarea
                rows={4}
                className="w-full bg-stone-gray/10 border border-desert-gold/20 rounded-lg px-4 py-3 text-elegant-white placeholder-stone-gray focus:outline-none focus:border-desert-gold transition-colors duration-300 resize-none"
                placeholder={language === 'ar' ? 'اشرح الأعمال التي تم إنجازها...' : 'Describe the work completed...'}
              />
            </FormField>

            <FormField label={language === 'ar' ? 'ملاحظات إضافية' : 'Additional Notes'}>
              <textarea
                rows={3}
                className="w-full bg-stone-gray/10 border border-desert-gold/20 rounded-lg px-4 py-3 text-elegant-white placeholder-stone-gray focus:outline-none focus:border-desert-gold transition-colors duration-300 resize-none"
                placeholder={language === 'ar' ? 'أضف ملاحظات إضافية...' : 'Add additional notes...'}
              />
            </FormField>

            {/* Photo Upload */}
            <div>
              <label className="block text-sm font-medium text-elegant-white mb-2">
                {language === 'ar' ? 'صور الأعمال المنجزة' : 'Work Completion Photos'}
              </label>
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
                <Camera className="h-8 w-8 text-desert-gold mx-auto mb-3" />
                <p className="text-stone-gray mb-2">
                  {language === 'ar' ? 'اسحب وأفلت الصور هنا' : 'Drag and drop photos here'}
                </p>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  id="work-photos-upload"
                />
                <label
                  htmlFor="work-photos-upload"
                  className="inline-flex items-center px-3 py-2 bg-desert-gold/20 text-desert-gold rounded-lg hover:bg-desert-gold/30 transition-colors duration-200 cursor-pointer text-sm"
                >
                  {language === 'ar' ? 'اختر الصور' : 'Choose Photos'}
                </label>
              </div>
            </div>

            <div className="flex justify-end space-x-4 rtl:space-x-reverse pt-6">
              <motion.button
                type="button"
                onClick={() => setShowReportModal(false)}
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
                {language === 'ar' ? 'حفظ التقرير' : 'Save Report'}
              </motion.button>
            </div>
          </form>
        </Modal>
      </div>
    </PageWrapper>
  );
}