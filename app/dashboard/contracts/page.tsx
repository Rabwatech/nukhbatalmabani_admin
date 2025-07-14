'use client';

import { motion } from 'framer-motion';
import { useDirection } from '@/context/DirectionContext';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Plus, FileText, Upload, Download, Eye, User, Calendar, Building2, ArrowRightLeft } from 'lucide-react';
import PageWrapper from '../components/PageWrapper';
import DataTable from '../components/shared/DataTable';
import StatusBadge from '../components/shared/StatusBadge';
import Modal from '../components/shared/Modal';
import FormField from '../components/shared/FormField';

export default function ContractsPage() {
  const { language } = useDirection();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState('list');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedContract, setSelectedContract] = useState<any>(null);
  const [dragActive, setDragActive] = useState(false);

  // Handle URL query parameters for tab navigation
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && ['list', 'create', 'transfer'].includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  // Mock data
  const contracts = [
    {
      id: 1,
      contractNumber: 'CNT-2024-001',
      client: language === 'ar' ? 'أحمد العتيبي' : 'Ahmed Al-Otaibi',
      unit: 'A101',
      project: language === 'ar' ? 'مجمع الأناقة' : 'Elegance Complex',
      status: 'active',
      startDate: '2024-01-15',
      endDate: '2024-12-15',
      value: '850,000',
      signed: true
    },
    {
      id: 2,
      contractNumber: 'CNT-2024-002',
      client: language === 'ar' ? 'فاطمة الحربي' : 'Fatima Al-Harbi',
      unit: 'B205',
      project: language === 'ar' ? 'برج التجارة' : 'Trade Tower',
      status: 'pending',
      startDate: '2024-01-20',
      endDate: '2024-12-20',
      value: '1,200,000',
      signed: false
    },
    {
      id: 3,
      contractNumber: 'CNT-2024-003',
      client: language === 'ar' ? 'خالد المطيري' : 'Khalid Al-Mutairi',
      unit: 'V15',
      project: language === 'ar' ? 'قرية الهدوء' : 'Tranquil Village',
      status: 'completed',
      startDate: '2023-06-01',
      endDate: '2024-01-01',
      value: '2,500,000',
      signed: true
    }
  ];

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'pending':
        return 'warning';
      case 'completed':
        return 'info';
      case 'canceled':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, { ar: string; en: string }> = {
      active: { ar: 'نشط', en: 'Active' },
      pending: { ar: 'معلق', en: 'Pending' },
      completed: { ar: 'مكتمل', en: 'Completed' },
      canceled: { ar: 'ملغي', en: 'Canceled' }
    };
    return labels[status]?.[language] || status;
  };

  const columns = [
    {
      key: 'contractNumber',
      label: language === 'ar' ? 'رقم العقد' : 'Contract Number',
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
      key: 'startDate',
      label: language === 'ar' ? 'تاريخ البداية' : 'Start Date',
      render: (value: string) => (
        <span className="text-stone-gray">{value}</span>
      )
    },
    {
      key: 'value',
      label: language === 'ar' ? 'القيمة' : 'Value',
      render: (value: string) => (
        <span className="text-elegant-white font-medium">
          {value} {language === 'ar' ? 'ريال' : 'SAR'}
        </span>
      )
    },
    {
      key: 'signed',
      label: language === 'ar' ? 'موقع' : 'Signed',
      render: (value: boolean) => (
        <StatusBadge 
          status={value ? (language === 'ar' ? 'موقع' : 'Signed') : (language === 'ar' ? 'غير موقع' : 'Not Signed')} 
          variant={value ? 'success' : 'warning'} 
          size="sm"
        />
      )
    }
  ];

  const filterOptions = [
    { value: 'active', label: language === 'ar' ? 'نشط' : 'Active' },
    { value: 'pending', label: language === 'ar' ? 'معلق' : 'Pending' },
    { value: 'completed', label: language === 'ar' ? 'مكتمل' : 'Completed' },
    { value: 'canceled', label: language === 'ar' ? 'ملغي' : 'Canceled' }
  ];

  const tabs = [
    { id: 'list', label: language === 'ar' ? 'قائمة العقود' : 'Contracts List' },
    { id: 'create', label: language === 'ar' ? 'إنشاء عقد جديد' : 'Create New Contract' },
    { id: 'transfer', label: language === 'ar' ? 'نقل الملكية' : 'Transfer Ownership' }
  ];

  const handleView = (contract: any) => {
    setSelectedContract(contract);
    // Open contract details view
  };

  const handleEdit = (contract: any) => {
    setSelectedContract(contract);
    setShowCreateModal(true);
  };

  const handleDelete = (contract: any) => {
    if (confirm(language === 'ar' ? 'هل أنت متأكد من حذف هذا العقد؟' : 'Are you sure you want to delete this contract?')) {
      console.log('Delete contract:', contract);
    }
  };

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
      // Handle file upload
      console.log('File dropped:', e.dataTransfer.files[0]);
    }
  };

  return (
    <PageWrapper>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-elegant-white">
              {language === 'ar' ? 'العقود والملكية' : 'Contracts & Ownership'}
            </h1>
            <p className="text-stone-gray mt-1">
              {language === 'ar' ? 'إدارة العقود وسندات الملكية' : 'Manage contracts and ownership documents'}
            </p>
          </div>
          <div className="flex space-x-3 rtl:space-x-reverse">
            <motion.button
              onClick={() => setShowUploadModal(true)}
              className="bg-stone-gray/20 text-elegant-white px-6 py-3 rounded-lg font-medium hover:bg-stone-gray/30 transition-all duration-300 flex items-center space-x-2 rtl:space-x-reverse"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Upload className="h-5 w-5" />
              <span>{language === 'ar' ? 'رفع عقد' : 'Upload Contract'}</span>
            </motion.button>
            <motion.button
              onClick={() => setShowCreateModal(true)}
              className="bg-desert-gold text-deep-black px-6 py-3 rounded-lg font-medium hover:bg-warm-sand transition-all duration-300 flex items-center space-x-2 rtl:space-x-reverse"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Plus className="h-5 w-5" />
              <span>{language === 'ar' ? 'عقد جديد' : 'New Contract'}</span>
            </motion.button>
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

        {/* Tab Content */}
        <div className="mt-6">
          {activeTab === 'list' && (
            <DataTable
              columns={columns}
              data={contracts}
              searchPlaceholder={language === 'ar' ? 'البحث في العقود...' : 'Search contracts...'}
              filterOptions={filterOptions}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}

          {activeTab === 'create' && (
            <div className="bg-obsidian/50 backdrop-blur-sm rounded-xl p-8 border border-desert-gold/20">
              <h2 className="text-2xl font-bold text-elegant-white mb-6">
                {language === 'ar' ? 'إنشاء عقد جديد' : 'Create New Contract'}
              </h2>
              
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField label={language === 'ar' ? 'الحجز المرتبط' : 'Related Booking'} required>
                    <select className="w-full bg-stone-gray/10 border border-desert-gold/20 rounded-lg px-4 py-3 text-elegant-white focus:outline-none focus:border-desert-gold transition-colors duration-300">
                      <option value="" className="bg-obsidian">
                        {language === 'ar' ? 'اختر الحجز' : 'Select Booking'}
                      </option>
                      <option value="1" className="bg-obsidian">
                        {language === 'ar' ? 'أحمد العتيبي - A101' : 'Ahmed Al-Otaibi - A101'}
                      </option>
                      <option value="2" className="bg-obsidian">
                        {language === 'ar' ? 'فاطمة الحربي - B205' : 'Fatima Al-Harbi - B205'}
                      </option>
                    </select>
                  </FormField>

                  <FormField label={language === 'ar' ? 'رقم العقد القانوني' : 'Legal Contract Number'} required>
                    <input
                      type="text"
                      className="w-full bg-stone-gray/10 border border-desert-gold/20 rounded-lg px-4 py-3 text-elegant-white placeholder-stone-gray focus:outline-none focus:border-desert-gold transition-colors duration-300"
                      placeholder="CNT-2024-XXX"
                    />
                  </FormField>

                  <FormField label={language === 'ar' ? 'تاريخ البداية' : 'Start Date'} required>
                    <input
                      type="date"
                      className="w-full bg-stone-gray/10 border border-desert-gold/20 rounded-lg px-4 py-3 text-elegant-white focus:outline-none focus:border-desert-gold transition-colors duration-300"
                    />
                  </FormField>

                  <FormField label={language === 'ar' ? 'تاريخ النهاية' : 'End Date'} required>
                    <input
                      type="date"
                      className="w-full bg-stone-gray/10 border border-desert-gold/20 rounded-lg px-4 py-3 text-elegant-white focus:outline-none focus:border-desert-gold transition-colors duration-300"
                    />
                  </FormField>

                  <FormField label={language === 'ar' ? 'حالة العقد' : 'Contract Status'} required>
                    <select className="w-full bg-stone-gray/10 border border-desert-gold/20 rounded-lg px-4 py-3 text-elegant-white focus:outline-none focus:border-desert-gold transition-colors duration-300">
                      <option value="pending" className="bg-obsidian">
                        {language === 'ar' ? 'معلق' : 'Pending'}
                      </option>
                      <option value="active" className="bg-obsidian">
                        {language === 'ar' ? 'نشط' : 'Active'}
                      </option>
                      <option value="completed" className="bg-obsidian">
                        {language === 'ar' ? 'مكتمل' : 'Completed'}
                      </option>
                    </select>
                  </FormField>

                  <FormField label={language === 'ar' ? 'قيمة العقد' : 'Contract Value'} required>
                    <input
                      type="number"
                      className="w-full bg-stone-gray/10 border border-desert-gold/20 rounded-lg px-4 py-3 text-elegant-white placeholder-stone-gray focus:outline-none focus:border-desert-gold transition-colors duration-300"
                      placeholder="0"
                    />
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
            </div>
          )}

          {activeTab === 'transfer' && (
            <div className="bg-obsidian/50 backdrop-blur-sm rounded-xl p-8 border border-desert-gold/20">
              <div className="text-center mb-8">
                <ArrowRightLeft className="h-16 w-16 text-desert-gold mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-elegant-white mb-2">
                  {language === 'ar' ? 'نقل الملكية' : 'Transfer Ownership'}
                </h2>
                <p className="text-stone-gray">
                  {language === 'ar' ? 'نقل ملكية الوحدة من مالك إلى آخر' : 'Transfer unit ownership from one owner to another'}
                </p>
              </div>

              <form className="space-y-6 max-w-2xl mx-auto">
                <FormField label={language === 'ar' ? 'العقد الحالي' : 'Current Contract'} required>
                  <select className="w-full bg-stone-gray/10 border border-desert-gold/20 rounded-lg px-4 py-3 text-elegant-white focus:outline-none focus:border-desert-gold transition-colors duration-300">
                    <option value="" className="bg-obsidian">
                      {language === 'ar' ? 'اختر العقد' : 'Select Contract'}
                    </option>
                    {contracts.filter(c => c.status === 'active').map((contract) => (
                      <option key={contract.id} value={contract.id} className="bg-obsidian">
                        {contract.contractNumber} - {contract.client} - {contract.unit}
                      </option>
                    ))}
                  </select>
                </FormField>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField label={language === 'ar' ? 'المالك الحالي' : 'Current Owner'}>
                    <input
                      type="text"
                      value={language === 'ar' ? 'أحمد العتيبي' : 'Ahmed Al-Otaibi'}
                      disabled
                      className="w-full bg-stone-gray/5 border border-desert-gold/20 rounded-lg px-4 py-3 text-stone-gray"
                    />
                  </FormField>

                  <FormField label={language === 'ar' ? 'المالك الجديد' : 'New Owner'} required>
                    <select className="w-full bg-stone-gray/10 border border-desert-gold/20 rounded-lg px-4 py-3 text-elegant-white focus:outline-none focus:border-desert-gold transition-colors duration-300">
                      <option value="" className="bg-obsidian">
                        {language === 'ar' ? 'اختر المالك الجديد' : 'Select New Owner'}
                      </option>
                      <option value="2" className="bg-obsidian">
                        {language === 'ar' ? 'فاطمة الحربي' : 'Fatima Al-Harbi'}
                      </option>
                      <option value="3" className="bg-obsidian">
                        {language === 'ar' ? 'خالد المطيري' : 'Khalid Al-Mutairi'}
                      </option>
                    </select>
                  </FormField>
                </div>

                <FormField label={language === 'ar' ? 'سبب النقل' : 'Transfer Reason'} required>
                  <select className="w-full bg-stone-gray/10 border border-desert-gold/20 rounded-lg px-4 py-3 text-elegant-white focus:outline-none focus:border-desert-gold transition-colors duration-300">
                    <option value="" className="bg-obsidian">
                      {language === 'ar' ? 'اختر السبب' : 'Select Reason'}
                    </option>
                    <option value="sale" className="bg-obsidian">
                      {language === 'ar' ? 'بيع' : 'Sale'}
                    </option>
                    <option value="inheritance" className="bg-obsidian">
                      {language === 'ar' ? 'وراثة' : 'Inheritance'}
                    </option>
                    <option value="gift" className="bg-obsidian">
                      {language === 'ar' ? 'هبة' : 'Gift'}
                    </option>
                  </select>
                </FormField>

                <FormField label={language === 'ar' ? 'ملاحظات النقل' : 'Transfer Notes'}>
                  <textarea
                    rows={4}
                    className="w-full bg-stone-gray/10 border border-desert-gold/20 rounded-lg px-4 py-3 text-elegant-white placeholder-stone-gray focus:outline-none focus:border-desert-gold transition-colors duration-300 resize-none"
                    placeholder={language === 'ar' ? 'أضف تفاصيل إضافية حول عملية النقل...' : 'Add additional details about the transfer...'}
                  />
                </FormField>

                <div className="flex justify-center space-x-4 rtl:space-x-reverse pt-6">
                  <motion.button
                    type="button"
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
                    {language === 'ar' ? 'تأكيد النقل' : 'Confirm Transfer'}
                  </motion.button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Upload Contract Modal */}
        <Modal
          isOpen={showUploadModal}
          onClose={() => setShowUploadModal(false)}
          title={language === 'ar' ? 'رفع عقد موقع' : 'Upload Signed Contract'}
          size="lg"
        >
          <div className="space-y-6">
            <FormField label={language === 'ar' ? 'العقد المرتبط' : 'Related Contract'} required>
              <select className="w-full bg-stone-gray/10 border border-desert-gold/20 rounded-lg px-4 py-3 text-elegant-white focus:outline-none focus:border-desert-gold transition-colors duration-300">
                <option value="" className="bg-obsidian">
                  {language === 'ar' ? 'اختر العقد' : 'Select Contract'}
                </option>
                {contracts.map((contract) => (
                  <option key={contract.id} value={contract.id} className="bg-obsidian">
                    {contract.contractNumber} - {contract.client}
                  </option>
                ))}
              </select>
            </FormField>

            {/* File Upload Area */}
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 ${
                dragActive 
                  ? 'border-desert-gold bg-desert-gold/10' 
                  : 'border-desert-gold/30 hover:border-desert-gold/50'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <Upload className="h-12 w-12 text-desert-gold mx-auto mb-4" />
              <h3 className="text-lg font-medium text-elegant-white mb-2">
                {language === 'ar' ? 'اسحب وأفلت الملف هنا' : 'Drag and drop file here'}
              </h3>
              <p className="text-stone-gray mb-4">
                {language === 'ar' ? 'أو انقر لاختيار الملف' : 'or click to select file'}
              </p>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="inline-flex items-center px-4 py-2 bg-desert-gold/20 text-desert-gold rounded-lg hover:bg-desert-gold/30 transition-colors duration-200 cursor-pointer"
              >
                {language === 'ar' ? 'اختر الملف' : 'Choose File'}
              </label>
              <p className="text-xs text-stone-gray mt-2">
                {language === 'ar' ? 'PDF, DOC, DOCX حتى 10MB' : 'PDF, DOC, DOCX up to 10MB'}
              </p>
            </div>

            <div className="flex justify-end space-x-4 rtl:space-x-reverse pt-6">
              <motion.button
                type="button"
                onClick={() => setShowUploadModal(false)}
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
                {language === 'ar' ? 'رفع الملف' : 'Upload File'}
              </motion.button>
            </div>
          </div>
        </Modal>
      </div>
    </PageWrapper>
  );
}