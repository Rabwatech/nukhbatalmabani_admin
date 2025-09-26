'use client';

import { motion } from 'framer-motion';
import { useDirection } from '@/context/DirectionContext';
import { useState } from 'react';
import { Plus, Building2, MapPin, DollarSign, Calendar, FileText, Send, Clock, Eye, Edit, Trash2, Download, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import PageWrapper from '@/components/PageWrapper';
import StatusBadge from '@/components/shared/StatusBadge';
import Modal from '@/components/shared/Modal';
import FormField from '@/components/shared/FormField';
import DataTable from '@/components/shared/DataTable';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from '@/components/ui/select';

export default function SalesPage() {
  const { language } = useDirection();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [showContractModal, setShowContractModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  // Mock data
  const units = [
    {
      id: 1,
      code: 'A101',
      type: language === 'ar' ? 'شقة 3 غرف' : '3BR Apartment',
      project: language === 'ar' ? 'مجمع الأناقة' : 'Elegance Complex',
      status: 'available',
      price: '850,000',
      area: '120'
    },
    {
      id: 2,
      code: 'B205',
      type: language === 'ar' ? 'مكتب تجاري' : 'Commercial Office',
      project: language === 'ar' ? 'برج التجارة' : 'Trade Tower',
      status: 'reserved',
      price: '1,200,000',
      area: '85'
    },
    {
      id: 3,
      code: 'V15',
      type: language === 'ar' ? 'فيلا مستقلة' : 'Independent Villa',
      project: language === 'ar' ? 'قرية الهدوء' : 'Tranquil Village',
      status: 'sold',
      price: '2,500,000',
      area: '350'
    },
    {
      id: 4,
      code: 'C302',
      type: language === 'ar' ? 'شقة 2 غرف' : '2BR Apartment',
      project: language === 'ar' ? 'مجمع الابتكار' : 'Innovation Complex',
      status: 'available',
      price: '650,000',
      area: '95'
    }
  ];

  const bookings = [
    {
      id: 1,
      bookingNumber: 'BK-2024-001',
      customer: language === 'ar' ? 'أحمد العتيبي' : 'Ahmed Al-Otaibi',
      unit: 'A101',
      project: language === 'ar' ? 'مجمع الأناقة' : 'Elegance Complex',
      status: 'quote_sent',
      amount: '850,000',
      date: '2024-01-15',
      paymentPlan: language === 'ar' ? 'أقساط' : 'Installments'
    },
    {
      id: 2,
      bookingNumber: 'BK-2024-002',
      customer: language === 'ar' ? 'فاطمة الحربي' : 'Fatima Al-Harbi',
      unit: 'B205',
      project: language === 'ar' ? 'برج التجارة' : 'Trade Tower',
      status: 'booking_confirmed',
      amount: '1,200,000',
      date: '2024-01-10',
      paymentPlan: language === 'ar' ? 'دفع كامل' : 'Full Payment'
    },
    {
      id: 3,
      bookingNumber: 'BK-2024-003',
      customer: language === 'ar' ? 'خالد المطيري' : 'Khalid Al-Mutairi',
      unit: 'V15',
      project: language === 'ar' ? 'قرية الهدوء' : 'Tranquil Village',
      status: 'contract_signed',
      amount: '2,500,000',
      date: '2024-01-05',
      paymentPlan: language === 'ar' ? 'أقساط' : 'Installments'
    }
  ];

  const quotes = [
    {
      id: 1,
      quoteNumber: 'QT-2024-001',
      customer: language === 'ar' ? 'أحمد العتيبي' : 'Ahmed Al-Otaibi',
      unit: 'A101',
      project: language === 'ar' ? 'مجمع الأناقة' : 'Elegance Complex',
      basePrice: '850,000',
      discount: '50,000',
      finalPrice: '800,000',
      status: 'sent',
      validUntil: '2024-02-15',
      createdDate: '2024-01-15'
    },
    {
      id: 2,
      quoteNumber: 'QT-2024-002',
      customer: language === 'ar' ? 'نورا السالم' : 'Nora Al-Salem',
      unit: 'C302',
      project: language === 'ar' ? 'مجمع الابتكار' : 'Innovation Complex',
      basePrice: '650,000',
      discount: '25,000',
      finalPrice: '625,000',
      status: 'accepted',
      validUntil: '2024-02-20',
      createdDate: '2024-01-20'
    }
  ];

  const contracts = [
    {
      id: 1,
      contractNumber: 'SC-2024-001',
      customer: language === 'ar' ? 'خالد المطيري' : 'Khalid Al-Mutairi',
      unit: 'V15',
      project: language === 'ar' ? 'قرية الهدوء' : 'Tranquil Village',
      amount: '2,500,000',
      status: 'signed',
      createdDate: '2024-01-05',
      signedDate: '2024-01-10'
    },
    {
      id: 2,
      contractNumber: 'SC-2024-002',
      customer: language === 'ar' ? 'فاطمة الحربي' : 'Fatima Al-Harbi',
      unit: 'B205',
      project: language === 'ar' ? 'برج التجارة' : 'Trade Tower',
      amount: '1,200,000',
      status: 'pending',
      createdDate: '2024-01-12',
      signedDate: null
    }
  ];

  const paymentReminders = [
    {
      id: 1,
      customer: language === 'ar' ? 'خالد المطيري' : 'Khalid Al-Mutairi',
      unit: 'V15',
      amount: '250,000',
      dueDate: '2024-01-20',
      status: 'pending'
    },
    {
      id: 2,
      customer: language === 'ar' ? 'نورا السالم' : 'Nora Al-Salem',
      unit: 'C302',
      amount: '65,000',
      dueDate: '2024-01-18',
      status: 'late'
    }
  ];

  const getUnitStatusVariant = (status: string) => {
    switch (status) {
      case 'available':
        return 'success';
      case 'reserved':
        return 'warning';
      case 'sold':
        return 'error';
      default:
        return 'default';
    }
  };

  const getUnitStatusLabel = (status: string) => {
    const labels: Record<string, { ar: string; en: string }> = {
      available: { ar: 'متاح', en: 'Available' },
      reserved: { ar: 'محجوز', en: 'Reserved' },
      sold: { ar: 'مباع', en: 'Sold' }
    };
    return labels[status]?.[language] || status;
  };

  const getBookingStatusVariant = (status: string) => {
    switch (status) {
      case 'quote_sent':
        return 'info';
      case 'booking_confirmed':
        return 'warning';
      case 'contract_signed':
        return 'success';
      default:
        return 'default';
    }
  };

  const getBookingStatusLabel = (status: string) => {
    const labels: Record<string, { ar: string; en: string }> = {
      quote_sent: { ar: 'تم إرسال العرض', en: 'Quote Sent' },
      booking_confirmed: { ar: 'تم تأكيد الحجز', en: 'Booking Confirmed' },
      contract_signed: { ar: 'تم توقيع العقد', en: 'Contract Signed' }
    };
    return labels[status]?.[language] || status;
  };

  const getQuoteStatusVariant = (status: string) => {
    switch (status) {
      case 'draft':
        return 'default';
      case 'sent':
        return 'info';
      case 'accepted':
        return 'success';
      case 'rejected':
        return 'error';
      case 'expired':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getQuoteStatusLabel = (status: string) => {
    const labels: Record<string, { ar: string; en: string }> = {
      draft: { ar: 'مسودة', en: 'Draft' },
      sent: { ar: 'مرسل', en: 'Sent' },
      accepted: { ar: 'مقبول', en: 'Accepted' },
      rejected: { ar: 'مرفوض', en: 'Rejected' },
      expired: { ar: 'منتهي الصلاحية', en: 'Expired' }
    };
    return labels[status]?.[language] || status;
  };

  const getContractStatusVariant = (status: string) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'signed':
        return 'success';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const getContractStatusLabel = (status: string) => {
    const labels: Record<string, { ar: string; en: string }> = {
      pending: { ar: 'معلق', en: 'Pending' },
      signed: { ar: 'موقع', en: 'Signed' },
      cancelled: { ar: 'ملغي', en: 'Cancelled' }
    };
    return labels[status]?.[language] || status;
  };

  const tabs = [
    { id: 'dashboard', label: language === 'ar' ? 'لوحة الحجوزات' : 'Booking Dashboard' },
    { id: 'bookings', label: language === 'ar' ? 'إدارة الحجوزات' : 'Booking Management' },
    { id: 'quotes', label: language === 'ar' ? 'العروض والأسعار' : 'Quotes & Pricing' },
    { id: 'contracts', label: language === 'ar' ? 'العقود' : 'Contracts' },
    { id: 'reminders', label: language === 'ar' ? 'تذكيرات الدفع' : 'Payment Reminders' }
  ];

  // Booking columns
  const bookingColumns = [
    {
      key: 'bookingNumber',
      label: language === 'ar' ? 'رقم الحجز' : 'Booking Number',
      sortable: true,
      render: (value: string) => (
        <span className="text-desert-gold font-medium">{value}</span>
      )
    },
    {
      key: 'customer',
      label: language === 'ar' ? 'العميل' : 'Customer',
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
      key: 'status',
      label: language === 'ar' ? 'الحالة' : 'Status',
      render: (value: string) => (
        <StatusBadge 
          status={getBookingStatusLabel(value)} 
          variant={getBookingStatusVariant(value)} 
        />
      )
    },
    {
      key: 'amount',
      label: language === 'ar' ? 'المبلغ' : 'Amount',
      render: (value: string) => (
        <span className="text-elegant-white font-medium">
          {value} {language === 'ar' ? 'ريال' : 'SAR'}
        </span>
      )
    },
    {
      key: 'date',
      label: language === 'ar' ? 'التاريخ' : 'Date',
      render: (value: string) => (
        <span className="text-stone-gray">{value}</span>
      )
    }
  ];

  // Quote columns
  const quoteColumns = [
    {
      key: 'quoteNumber',
      label: language === 'ar' ? 'رقم العرض' : 'Quote Number',
      sortable: true,
      render: (value: string) => (
        <span className="text-desert-gold font-medium">{value}</span>
      )
    },
    {
      key: 'customer',
      label: language === 'ar' ? 'العميل' : 'Customer',
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
      key: 'finalPrice',
      label: language === 'ar' ? 'السعر النهائي' : 'Final Price',
      render: (value: string) => (
        <span className="text-elegant-white font-medium">
          {value} {language === 'ar' ? 'ريال' : 'SAR'}
        </span>
      )
    },
    {
      key: 'status',
      label: language === 'ar' ? 'الحالة' : 'Status',
      render: (value: string) => (
        <StatusBadge 
          status={getQuoteStatusLabel(value)} 
          variant={getQuoteStatusVariant(value)} 
        />
      )
    },
    {
      key: 'validUntil',
      label: language === 'ar' ? 'صالح حتى' : 'Valid Until',
      render: (value: string) => (
        <span className="text-stone-gray">{value}</span>
      )
    }
  ];

  // Contract columns
  const contractColumns = [
    {
      key: 'contractNumber',
      label: language === 'ar' ? 'رقم العقد' : 'Contract Number',
      sortable: true,
      render: (value: string) => (
        <span className="text-desert-gold font-medium">{value}</span>
      )
    },
    {
      key: 'customer',
      label: language === 'ar' ? 'العميل' : 'Customer',
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
      key: 'amount',
      label: language === 'ar' ? 'المبلغ' : 'Amount',
      render: (value: string) => (
        <span className="text-elegant-white font-medium">
          {value} {language === 'ar' ? 'ريال' : 'SAR'}
        </span>
      )
    },
    {
      key: 'status',
      label: language === 'ar' ? 'الحالة' : 'Status',
      render: (value: string) => (
        <StatusBadge 
          status={getContractStatusLabel(value)} 
          variant={getContractStatusVariant(value)} 
        />
      )
    },
    {
      key: 'createdDate',
      label: language === 'ar' ? 'تاريخ الإنشاء' : 'Created Date',
      render: (value: string) => (
        <span className="text-stone-gray">{value}</span>
      )
    }
  ];

  const handleView = (item: any) => {
    setSelectedItem(item);
    // Handle view logic
  };

  const handleEdit = (item: any) => {
    setSelectedItem(item);
    // Handle edit logic
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
              {language === 'ar' ? 'المبيعات والحجوزات' : 'Sales & Booking Management'}
            </h1>
            <p className="text-stone-gray mt-1">
              {language === 'ar' ? 'إدارة عمليات البيع والحجز للوحدات العقارية' : 'Manage sales and booking operations for real estate units'}
            </p>
          </div>
          <motion.button
            onClick={() => setShowBookingModal(true)}
            className="bg-desert-gold text-deep-black px-6 py-3 rounded-lg font-medium hover:bg-warm-sand transition-all duration-300 flex items-center space-x-2 rtl:space-x-reverse"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Plus className="h-5 w-5" />
            <span>{language === 'ar' ? 'حجز جديد' : 'New Booking'}</span>
          </motion.button>
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
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Units Grid */}
              <div>
                <h2 className="text-xl font-bold text-elegant-white mb-4">
                  {language === 'ar' ? 'حالة الوحدات' : 'Unit Availability'}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {units.map((unit, index) => (
                    <motion.div
                      key={unit.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-obsidian/50 backdrop-blur-sm rounded-lg p-4 border border-desert-gold/20 hover:border-desert-gold/40 transition-all duration-300"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="text-lg font-bold text-elegant-white">{unit.code}</h3>
                          <p className="text-stone-gray text-sm">{unit.type}</p>
                        </div>
                        <StatusBadge 
                          status={getUnitStatusLabel(unit.status)} 
                          variant={getUnitStatusVariant(unit.status)} 
                          size="sm"
                        />
                      </div>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center space-x-2 rtl:space-x-reverse">
                          <Building2 className="h-4 w-4 text-desert-gold" />
                          <span className="text-stone-gray text-sm">{unit.project}</span>
                        </div>
                        <div className="flex items-center space-x-2 rtl:space-x-reverse">
                          <MapPin className="h-4 w-4 text-desert-gold" />
                          <span className="text-stone-gray text-sm">{unit.area} {language === 'ar' ? 'م²' : 'sqm'}</span>
                        </div>
                        <div className="flex items-center space-x-2 rtl:space-x-reverse">
                          <DollarSign className="h-4 w-4 text-desert-gold" />
                          <span className="text-elegant-white font-medium">{unit.price} {language === 'ar' ? 'ريال' : 'SAR'}</span>
                        </div>
                      </div>

                      {unit.status === 'available' && (
                        <motion.button
                          onClick={() => setShowBookingModal(true)}
                          className="w-full bg-desert-gold/20 text-desert-gold py-2 rounded-lg hover:bg-desert-gold/30 transition-colors duration-200"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          {language === 'ar' ? 'احجز الآن' : 'Book Now'}
                        </motion.button>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Recent Bookings */}
              <div>
                <h2 className="text-xl font-bold text-elegant-white mb-4">
                  {language === 'ar' ? 'الحجوزات الأخيرة' : 'Recent Bookings'}
                </h2>
                <div className="bg-obsidian/50 backdrop-blur-sm rounded-lg border border-desert-gold/20 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-stone-gray/10">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-stone-gray uppercase tracking-wider">
                            {language === 'ar' ? 'العميل' : 'Customer'}
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-stone-gray uppercase tracking-wider">
                            {language === 'ar' ? 'الوحدة' : 'Unit'}
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-stone-gray uppercase tracking-wider">
                            {language === 'ar' ? 'الحالة' : 'Status'}
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-stone-gray uppercase tracking-wider">
                            {language === 'ar' ? 'المبلغ' : 'Amount'}
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-stone-gray uppercase tracking-wider">
                            {language === 'ar' ? 'التاريخ' : 'Date'}
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-desert-gold/10">
                        {bookings.slice(0, 3).map((booking, index) => (
                          <motion.tr
                            key={booking.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="hover:bg-stone-gray/5"
                          >
                            <td className="px-6 py-4 whitespace-nowrap text-elegant-white">
                              {booking.customer}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div>
                                <div className="text-elegant-white font-medium">{booking.unit}</div>
                                <div className="text-stone-gray text-sm">{booking.project}</div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <StatusBadge 
                                status={getBookingStatusLabel(booking.status)} 
                                variant={getBookingStatusVariant(booking.status)} 
                                size="sm"
                              />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-elegant-white font-medium">
                              {booking.amount} {language === 'ar' ? 'ريال' : 'SAR'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-stone-gray">
                              {booking.date}
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'bookings' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-elegant-white">
                  {language === 'ar' ? 'إدارة الحجوزات' : 'Booking Management'}
                </h2>
                <motion.button
                  onClick={() => setShowBookingModal(true)}
                  className="bg-desert-gold text-deep-black px-4 py-2 rounded-lg font-medium hover:bg-warm-sand transition-all duration-300 flex items-center space-x-2 rtl:space-x-reverse"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Plus className="h-4 w-4" />
                  <span>{language === 'ar' ? 'حجز جديد' : 'New Booking'}</span>
                </motion.button>
              </div>
              
              <DataTable
                columns={bookingColumns}
                data={bookings}
                searchPlaceholder={language === 'ar' ? 'البحث في الحجوزات...' : 'Search bookings...'}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </div>
          )}

          {activeTab === 'quotes' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-elegant-white">
                  {language === 'ar' ? 'العروض والأسعار' : 'Quotes & Pricing'}
                </h2>
                <motion.button
                  onClick={() => setShowQuoteModal(true)}
                  className="bg-desert-gold text-deep-black px-4 py-2 rounded-lg font-medium hover:bg-warm-sand transition-all duration-300 flex items-center space-x-2 rtl:space-x-reverse"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Plus className="h-4 w-4" />
                  <span>{language === 'ar' ? 'عرض جديد' : 'New Quote'}</span>
                </motion.button>
              </div>
              
              <DataTable
                columns={quoteColumns}
                data={quotes}
                searchPlaceholder={language === 'ar' ? 'البحث في العروض...' : 'Search quotes...'}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </div>
          )}

          {activeTab === 'contracts' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-elegant-white">
                  {language === 'ar' ? 'العقود' : 'Contracts'}
                </h2>
                <motion.button
                  onClick={() => setShowContractModal(true)}
                  className="bg-desert-gold text-deep-black px-4 py-2 rounded-lg font-medium hover:bg-warm-sand transition-all duration-300 flex items-center space-x-2 rtl:space-x-reverse"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Plus className="h-4 w-4" />
                  <span>{language === 'ar' ? 'عقد جديد' : 'New Contract'}</span>
                </motion.button>
              </div>
              
              <DataTable
                columns={contractColumns}
                data={contracts}
                searchPlaceholder={language === 'ar' ? 'البحث في العقود...' : 'Search contracts...'}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </div>
          )}

          {activeTab === 'reminders' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-elegant-white">
                {language === 'ar' ? 'تذكيرات الدفع' : 'Payment Reminders'}
              </h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {paymentReminders.map((reminder, index) => (
                  <motion.div
                    key={reminder.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-obsidian/50 backdrop-blur-sm rounded-lg p-6 border border-desert-gold/20"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-elegant-white">{reminder.customer}</h3>
                        <p className="text-stone-gray">{language === 'ar' ? 'الوحدة:' : 'Unit:'} {reminder.unit}</p>
                      </div>
                      <StatusBadge 
                        status={reminder.status === 'pending' ? 
                          (language === 'ar' ? 'معلق' : 'Pending') : 
                          (language === 'ar' ? 'متأخر' : 'Late')
                        } 
                        variant={reminder.status === 'pending' ? 'warning' : 'error'} 
                      />
                    </div>
                    
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center space-x-2 rtl:space-x-reverse">
                        <DollarSign className="h-4 w-4 text-desert-gold" />
                        <span className="text-elegant-white font-medium">
                          {reminder.amount} {language === 'ar' ? 'ريال' : 'SAR'}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 rtl:space-x-reverse">
                        <Calendar className="h-4 w-4 text-desert-gold" />
                        <span className="text-stone-gray">
                          {language === 'ar' ? 'تاريخ الاستحقاق:' : 'Due Date:'} {reminder.dueDate}
                        </span>
                      </div>
                    </div>

                    <motion.button
                      className="w-full bg-desert-gold/20 text-desert-gold py-2 rounded-lg hover:bg-desert-gold/30 transition-colors duration-200 flex items-center justify-center space-x-2 rtl:space-x-reverse"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Send className="h-4 w-4" />
                      <span>{language === 'ar' ? 'إرسال تذكير' : 'Send Reminder'}</span>
                    </motion.button>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* New Booking Modal */}
        <Modal
          isOpen={showBookingModal}
          onClose={() => setShowBookingModal(false)}
          title={language === 'ar' ? 'حجز جديد' : 'New Booking'}
          size="lg"
        >
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField label={language === 'ar' ? 'العميل' : 'Customer'} required>
                <Select onValueChange={(value) => {}} defaultValue="all">
                  <SelectTrigger className="w-full bg-stone-gray/10 border border-desert-gold/20 rounded-lg px-4 py-3 text-elegant-white focus:outline-none focus:border-desert-gold transition-colors duration-300">
                    <SelectValue placeholder={language === 'ar' ? 'اختر العميل' : 'Select Customer'} />
                  </SelectTrigger>
                  <SelectContent className="bg-obsidian border border-desert-gold/20 rounded-lg">
                    <SelectItem value="all" className="text-stone-gray">{language === 'ar' ? 'الكل' : 'All'}</SelectItem>
                    <SelectItem value="1" className="bg-obsidian">{language === 'ar' ? 'أحمد العتيبي' : 'Ahmed Al-Otaibi'}</SelectItem>
                    <SelectItem value="2" className="bg-obsidian">{language === 'ar' ? 'فاطمة الحربي' : 'Fatima Al-Harbi'}</SelectItem>
                  </SelectContent>
                </Select>
              </FormField>

              <FormField label={language === 'ar' ? 'المشروع' : 'Project'} required>
                <Select onValueChange={(value) => {}} defaultValue="all">
                  <SelectTrigger className="w-full bg-stone-gray/10 border border-desert-gold/20 rounded-lg px-4 py-3 text-elegant-white focus:outline-none focus:border-desert-gold transition-colors duration-300">
                    <SelectValue placeholder={language === 'ar' ? 'اختر المشروع' : 'Select Project'} />
                  </SelectTrigger>
                  <SelectContent className="bg-obsidian border border-desert-gold/20 rounded-lg">
                    <SelectItem value="all" className="text-stone-gray">{language === 'ar' ? 'الكل' : 'All'}</SelectItem>
                    <SelectItem value="elegance" className="bg-obsidian">{language === 'ar' ? 'مجمع الأناقة' : 'Elegance Complex'}</SelectItem>
                    <SelectItem value="trade" className="bg-obsidian">{language === 'ar' ? 'برج التجارة' : 'Trade Tower'}</SelectItem>
                  </SelectContent>
                </Select>
              </FormField>

              <FormField label={language === 'ar' ? 'الوحدة' : 'Unit'} required>
                <Select onValueChange={(value) => {}} defaultValue="all">
                  <SelectTrigger className="w-full bg-stone-gray/10 border border-desert-gold/20 rounded-lg px-4 py-3 text-elegant-white focus:outline-none focus:border-desert-gold transition-colors duration-300">
                    <SelectValue placeholder={language === 'ar' ? 'اختر الوحدة' : 'Select Unit'} />
                  </SelectTrigger>
                  <SelectContent className="bg-obsidian border border-desert-gold/20 rounded-lg">
                    <SelectItem value="all" className="text-stone-gray">{language === 'ar' ? 'الكل' : 'All'}</SelectItem>
                    <SelectItem value="a101" className="bg-obsidian">A101 - {language === 'ar' ? 'شقة 3 غرف' : '3BR Apartment'}</SelectItem>
                    <SelectItem value="b205" className="bg-obsidian">B205 - {language === 'ar' ? 'مكتب تجاري' : 'Commercial Office'}</SelectItem>
                  </SelectContent>
                </Select>
              </FormField>

              <FormField label={language === 'ar' ? 'خطة الدفع' : 'Payment Plan'} required>
                <Select onValueChange={(value) => {}} defaultValue="all">
                  <SelectTrigger className="w-full bg-stone-gray/10 border border-desert-gold/20 rounded-lg px-4 py-3 text-elegant-white focus:outline-none focus:border-desert-gold transition-colors duration-300">
                    <SelectValue placeholder={language === 'ar' ? 'اختر خطة الدفع' : 'Select Payment Plan'} />
                  </SelectTrigger>
                  <SelectContent className="bg-obsidian border border-desert-gold/20 rounded-lg">
                    <SelectItem value="all" className="text-stone-gray">{language === 'ar' ? 'الكل' : 'All'}</SelectItem>
                    <SelectItem value="cash" className="bg-obsidian">
                      {language === 'ar' ? 'دفع كامل' : 'Full Payment'}
                    </SelectItem>
                    <SelectItem value="installments" className="bg-obsidian">
                      {language === 'ar' ? 'أقساط' : 'Installments'}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </FormField>
            </div>

            <FormField label={language === 'ar' ? 'ملاحظات' : 'Notes'}>
              <textarea
                rows={4}
                className="w-full bg-stone-gray/10 border border-desert-gold/20 rounded-lg px-4 py-3 text-elegant-white placeholder-stone-gray focus:outline-none focus:border-desert-gold transition-colors duration-300 resize-none"
                placeholder={language === 'ar' ? 'أضف ملاحظات إضافية...' : 'Add additional notes...'}
              />
            </FormField>

            <div className="flex justify-end space-x-4 rtl:space-x-reverse pt-6">
              <motion.button
                type="button"
                onClick={() => setShowBookingModal(false)}
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
                {language === 'ar' ? 'إنشاء الحجز' : 'Create Booking'}
              </motion.button>
            </div>
          </form>
        </Modal>

        {/* New Quote Modal */}
        <Modal
          isOpen={showQuoteModal}
          onClose={() => setShowQuoteModal(false)}
          title={language === 'ar' ? 'عرض سعر جديد' : 'New Quote'}
          size="lg"
        >
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField label={language === 'ar' ? 'العميل' : 'Customer'} required>
                <Select onValueChange={(value) => {}} defaultValue="all">
                  <SelectTrigger className="w-full bg-stone-gray/10 border border-desert-gold/20 rounded-lg px-4 py-3 text-elegant-white focus:outline-none focus:border-desert-gold transition-colors duration-300">
                    <SelectValue placeholder={language === 'ar' ? 'اختر العميل' : 'Select Customer'} />
                  </SelectTrigger>
                  <SelectContent className="bg-obsidian border border-desert-gold/20 rounded-lg">
                    <SelectItem value="all" className="text-stone-gray">{language === 'ar' ? 'الكل' : 'All'}</SelectItem>
                    <SelectItem value="1" className="bg-obsidian">
                      {language === 'ar' ? 'أحمد العتيبي' : 'Ahmed Al-Otaibi'}
                    </SelectItem>
                    <SelectItem value="2" className="bg-obsidian">
                      {language === 'ar' ? 'فاطمة الحربي' : 'Fatima Al-Harbi'}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </FormField>

              <FormField label={language === 'ar' ? 'الوحدة' : 'Unit'} required>
                <Select onValueChange={(value) => {}} defaultValue="all">
                  <SelectTrigger className="w-full bg-stone-gray/10 border border-desert-gold/20 rounded-lg px-4 py-3 text-elegant-white focus:outline-none focus:border-desert-gold transition-colors duration-300">
                    <SelectValue placeholder={language === 'ar' ? 'اختر الوحدة' : 'Select Unit'} />
                  </SelectTrigger>
                  <SelectContent className="bg-obsidian border border-desert-gold/20 rounded-lg">
                    <SelectItem value="all" className="text-stone-gray">{language === 'ar' ? 'الكل' : 'All'}</SelectItem>
                    <SelectItem value="a101" className="bg-obsidian">A101 - {language === 'ar' ? 'شقة 3 غرف' : '3BR Apartment'}</SelectItem>
                    <SelectItem value="c302" className="bg-obsidian">C302 - {language === 'ar' ? 'شقة 2 غرف' : '2BR Apartment'}</SelectItem>
                  </SelectContent>
                </Select>
              </FormField>

              <FormField label={language === 'ar' ? 'السعر الأساسي' : 'Base Price'} required>
                <input
                  type="number"
                  className="w-full bg-stone-gray/10 border border-desert-gold/20 rounded-lg px-4 py-3 text-elegant-white placeholder-stone-gray focus:outline-none focus:border-desert-gold transition-colors duration-300"
                  placeholder="850000"
                />
              </FormField>

              <FormField label={language === 'ar' ? 'الخصم' : 'Discount'}>
                <input
                  type="number"
                  className="w-full bg-stone-gray/10 border border-desert-gold/20 rounded-lg px-4 py-3 text-elegant-white placeholder-stone-gray focus:outline-none focus:border-desert-gold transition-colors duration-300"
                  placeholder="50000"
                />
              </FormField>

              <FormField label={language === 'ar' ? 'صالح حتى' : 'Valid Until'} required>
                <input
                  type="date"
                  className="w-full bg-stone-gray/10 border border-desert-gold/20 rounded-lg px-4 py-3 text-elegant-white focus:outline-none focus:border-desert-gold transition-colors duration-300"
                />
              </FormField>
            </div>

            <FormField label={language === 'ar' ? 'ملاحظات' : 'Notes'}>
              <textarea
                rows={4}
                className="w-full bg-stone-gray/10 border border-desert-gold/20 rounded-lg px-4 py-3 text-elegant-white placeholder-stone-gray focus:outline-none focus:border-desert-gold transition-colors duration-300 resize-none"
                placeholder={language === 'ar' ? 'أضف تفاصيل العرض...' : 'Add quote details...'}
              />
            </FormField>

            <div className="flex justify-end space-x-4 rtl:space-x-reverse pt-6">
              <motion.button
                type="button"
                onClick={() => setShowQuoteModal(false)}
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
                {language === 'ar' ? 'إنشاء العرض' : 'Create Quote'}
              </motion.button>
            </div>
          </form>
        </Modal>

        {/* New Contract Modal */}
        <Modal
          isOpen={showContractModal}
          onClose={() => setShowContractModal(false)}
          title={language === 'ar' ? 'عقد بيع جديد' : 'New Sales Contract'}
          size="lg"
        >
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField label={language === 'ar' ? 'الحجز المرتبط' : 'Related Booking'} required>
                <Select onValueChange={(value) => {}} defaultValue="all">
                  <SelectTrigger className="w-full bg-stone-gray/10 border border-desert-gold/20 rounded-lg px-4 py-3 text-elegant-white focus:outline-none focus:border-desert-gold transition-colors duration-300">
                    <SelectValue placeholder={language === 'ar' ? 'اختر الحجز' : 'Select Booking'} />
                  </SelectTrigger>
                  <SelectContent className="bg-obsidian border border-desert-gold/20 rounded-lg">
                    <SelectItem value="all" className="text-stone-gray">{language === 'ar' ? 'الكل' : 'All'}</SelectItem>
                    {bookings.map((booking) => (
                      <SelectItem key={String(booking.id)} value={String(booking.id)} className="bg-obsidian">
                        {booking.bookingNumber} - {booking.customer} - {booking.unit}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>

              <FormField label={language === 'ar' ? 'رقم العقد' : 'Contract Number'} required>
                <input
                  type="text"
                  className="w-full bg-stone-gray/10 border border-desert-gold/20 rounded-lg px-4 py-3 text-elegant-white placeholder-stone-gray focus:outline-none focus:border-desert-gold transition-colors duration-300"
                  placeholder="SC-2024-XXX"
                />
              </FormField>

              <FormField label={language === 'ar' ? 'قيمة العقد' : 'Contract Value'} required>
                <input
                  type="number"
                  className="w-full bg-stone-gray/10 border border-desert-gold/20 rounded-lg px-4 py-3 text-elegant-white placeholder-stone-gray focus:outline-none focus:border-desert-gold transition-colors duration-300"
                  placeholder="850000"
                />
              </FormField>

              <FormField label={language === 'ar' ? 'حالة العقد' : 'Contract Status'} required>
                <Select onValueChange={(value) => {}} defaultValue="all">
                  <SelectTrigger className="w-full bg-stone-gray/10 border border-desert-gold/20 rounded-lg px-4 py-3 text-elegant-white focus:outline-none focus:border-desert-gold transition-colors duration-300">
                    <SelectValue placeholder={language === 'ar' ? 'اختر حالة العقد' : 'Select Contract Status'} />
                  </SelectTrigger>
                  <SelectContent className="bg-obsidian border border-desert-gold/20 rounded-lg">
                    <SelectItem value="all" className="text-stone-gray">{language === 'ar' ? 'الكل' : 'All'}</SelectItem>
                    <SelectItem value="pending" className="bg-obsidian">
                      {language === 'ar' ? 'معلق' : 'Pending'}
                    </SelectItem>
                    <SelectItem value="signed" className="bg-obsidian">
                      {language === 'ar' ? 'موقع' : 'Signed'}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </FormField>
            </div>

            <FormField label={language === 'ar' ? 'شروط العقد' : 'Contract Terms'}>
              <textarea
                rows={4}
                className="w-full bg-stone-gray/10 border border-desert-gold/20 rounded-lg px-4 py-3 text-elegant-white placeholder-stone-gray focus:outline-none focus:border-desert-gold transition-colors duration-300 resize-none"
                placeholder={language === 'ar' ? 'أضف شروط العقد...' : 'Add contract terms...'}
              />
            </FormField>

            <div className="flex justify-end space-x-4 rtl:space-x-reverse pt-6">
              <motion.button
                type="button"
                onClick={() => setShowContractModal(false)}
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
                {language === 'ar' ? 'إنشاء العقد' : 'Create Contract'}
              </motion.button>
            </div>
          </form>
        </Modal>
      </div>
    </PageWrapper>
  );
}