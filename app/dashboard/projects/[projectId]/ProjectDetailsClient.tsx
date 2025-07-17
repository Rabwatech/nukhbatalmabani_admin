"use client";
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import PageWrapper from '../../components/PageWrapper';
import StatusBadge from '../../components/shared/StatusBadge';
import Modal from '../../components/shared/Modal';
import FormField from '../../components/shared/FormField';
import { ArrowLeft, Loader2, Edit, Trash2, Plus, FileSpreadsheet, FlaskConical, FileText, RefreshCw, Eye, Pencil, Trash, ShoppingCart, FileSignature } from 'lucide-react';

interface Project {
  id: number;
  name_ar: string;
  name_en: string;
  project_code: string;
  status: string;
  city: string;
  district: string;
  contractor_company: string;
  building_count: number;
  floors_per_building: number;
  total_units: number;
  description: string;
  map_link: string;
  logo_url?: string;
  internal_notes?: string;
}

interface Unit {
  id: number;
  code: string;
  design: string;
  area: number;
  rooms: number;
  floor: number;
  price: number;
  status: string;
  orientation: string;
  type: string;
}

const mockProject: Project = {
  id: 1,
  name_ar: 'مجمع الأناقة السكني',
  name_en: 'Elegance Residential Complex',
  project_code: 'PRJ-001',
  status: 'ready',
  city: 'جدة',
  district: 'حي الياقوت',
  contractor_company: 'شركة إعمار الخليج',
  building_count: 4,
  floors_per_building: 5,
  total_units: 20,
  description: 'مشروع سكني فاخر في جدة يضم وحدات متنوعة...',
  map_link: 'https://maps.google.com',
  logo_url: '',
  internal_notes: 'ملاحظات للإدارة فقط...'
};

const mockUnits: Unit[] = [
  { id: 1, code: 'A1-01', design: 'A', area: 120, rooms: 3, floor: 2, price: 450000, status: 'available', orientation: 'north', type: 'residential' },
  { id: 2, code: 'A1-02', design: 'A', area: 120, rooms: 3, floor: 2, price: 450000, status: 'sold', orientation: 'north', type: 'residential' },
  { id: 3, code: 'B2-01', design: 'B', area: 150, rooms: 4, floor: 3, price: 600000, status: 'reserved', orientation: 'east', type: 'commercial' },
];

const unitTypes = [
  { value: 'residential', label: 'سكني' },
  { value: 'commercial', label: 'تجاري' },
];
const bedroomOptions = [2, 3, 4, 5];
const statusOptions = [
  { value: 'available', label: 'متاح' },
  { value: 'reserved', label: 'محجوز' },
  { value: 'sold', label: 'مباع' },
];
const orientationOptions = [
  { value: 'north', label: 'شمال' },
  { value: 'south', label: 'جنوب' },
  { value: 'east', label: 'شرق' },
  { value: 'west', label: 'غرب' },
];

export default function ProjectDetailsClient({ projectId }: { projectId: string }) {
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [units, setUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSellModal, setShowSellModal] = useState<Unit | null>(null);
  const [filters, setFilters] = useState({
    type: '',
    bedrooms: '',
    floor: '',
    status: '',
    orientation: '',
  });
  const [showAddUnitModal, setShowAddUnitModal] = useState(false);
  const [showEditUnitModal, setShowEditUnitModal] = useState<Unit | null>(null);
  const [showViewUnitModal, setShowViewUnitModal] = useState<Unit | null>(null);
  const [showExcelModal, setShowExcelModal] = useState(false);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [showCampaignModal, setShowCampaignModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showBulkStatusModal, setShowBulkStatusModal] = useState(false);
  const [selectedUnits, setSelectedUnits] = useState<number[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Add/Edit Unit Modal state
  const [addUnitForm, setAddUnitForm] = useState({
    code: '',
    design: '',
    area: '',
    rooms: '',
    floor: '',
    price: '',
    status: '',
    orientation: '',
    type: '',
  });
  const [addUnitErrors, setAddUnitErrors] = useState<any>({});

  const validateAddUnit = () => {
    const errors: any = {};
    if (!addUnitForm.code) errors.code = 'مطلوب';
    if (!addUnitForm.design) errors.design = 'مطلوب';
    if (!addUnitForm.area) errors.area = 'مطلوب';
    if (!addUnitForm.rooms) errors.rooms = 'مطلوب';
    if (!addUnitForm.floor) errors.floor = 'مطلوب';
    if (!addUnitForm.price) errors.price = 'مطلوب';
    if (!addUnitForm.status) errors.status = 'مطلوب';
    if (!addUnitForm.orientation) errors.orientation = 'مطلوب';
    if (!addUnitForm.type) errors.type = 'مطلوب';
    setAddUnitErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddUnitSubmit = () => {
    if (!validateAddUnit()) return;
    handleAddUnit({
      id: Date.now(),
      code: addUnitForm.code,
      design: addUnitForm.design,
      area: Number(addUnitForm.area),
      rooms: Number(addUnitForm.rooms),
      floor: Number(addUnitForm.floor),
      price: Number(addUnitForm.price),
      status: addUnitForm.status,
      orientation: addUnitForm.orientation,
      type: addUnitForm.type,
    });
    setAddUnitForm({ code: '', design: '', area: '', rooms: '', floor: '', price: '', status: '', orientation: '', type: '' });
    setAddUnitErrors({});
  };

  // Edit Unit handler
  const handleEditUnit = (updated: Unit) => {
    setUnits(prev => prev.map(u => u.id === updated.id ? updated : u));
    setShowEditUnitModal(null);
  };

  // Delete Unit handler
  const handleDeleteUnit = (id: number) => {
    setUnits(prev => prev.filter(u => u.id !== id));
    setShowDeleteModal(false);
  };

  // Sell handler
  const handleSellUnit = (unit: Unit, buyer: string, notes: string) => {
    setUnits(prev => prev.map(u => u.id === unit.id ? { ...u, status: 'sold' } : u));
    setShowSellModal(null);
  };

  // Bulk status update
  const handleBulkStatus = (status: string) => {
    setUnits(prev => prev.map(u => selectedUnits.includes(u.id) ? { ...u, status } : u));
    setShowBulkStatusModal(false);
  };

  // Export handler (mock CSV)
  const handleExport = () => {
    const csv = [
      ['رمز', 'تصميم', 'مساحة', 'غرف', 'دور', 'سعر', 'حالة', 'اتجاه', 'نوع'],
      ...filteredUnits.map(u => [u.code, u.design, u.area, u.rooms, u.floor, u.price, u.status, u.orientation, u.type])
    ].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'units.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Excel upload handler (mock)
  const handleExcelUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Mock: just add a sample unit
    setUnits(prev => [...prev, { id: Date.now(), code: 'XLS-01', design: 'A', area: 100, rooms: 2, floor: 1, price: 100000, status: 'available', orientation: 'north', type: 'residential' }]);
    setShowExcelModal(false);
  };

  // Generate units handler (mock)
  const handleGenerateUnits = (unitsToAdd: Unit[]) => {
    setUnits(prev => [...prev, ...unitsToAdd]);
    setShowGenerateModal(false);
  };

  // Table row selection
  const toggleSelectUnit = (id: number) => {
    setSelectedUnits(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  useEffect(() => {
    // Simulate API fetch
    setLoading(true);
    setTimeout(() => {
      setProject(mockProject);
      setUnits(mockUnits);
      setLoading(false);
    }, 600);
  }, [projectId]);

  const filteredUnits = units.filter((unit) => {
    return (
      (!filters.type || unit.type === filters.type) &&
      (!filters.bedrooms || unit.rooms === Number(filters.bedrooms)) &&
      (!filters.floor || unit.floor === Number(filters.floor)) &&
      (!filters.status || unit.status === filters.status) &&
      (!filters.orientation || unit.orientation === filters.orientation)
    );
  });

  if (loading || !project) {
    return (
      <PageWrapper>
        <div className="flex justify-center items-center h-96">
          <Loader2 className="animate-spin h-8 w-8 text-desert-gold" />
        </div>
      </PageWrapper>
    );
  }

  // Add Unit handler
  const handleAddUnit = (unit: Unit) => {
    setUnits(prev => [...prev, { ...unit, id: Date.now() }]);
    setShowAddUnitModal(false);
  };

  return (
    <PageWrapper>
      <div className="max-w-7xl mx-auto p-4 space-y-8">
        {/* Back Navigation */}
        <button
          className="flex items-center text-stone-gray hover:text-desert-gold mb-2"
          onClick={() => router.push('/dashboard/projects')}
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          العودة إلى قائمة المشاريع
        </button>

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-obsidian/70 rounded-xl p-6 border border-desert-gold/20">
          <div>
            <h1 className="text-2xl font-bold text-elegant-white">{project.name_ar} / {project.name_en}</h1>
            <div className="flex items-center gap-3 mt-2">
              <span className="text-stone-gray">{project.project_code}</span>
              <StatusBadge status={project.status === 'ready' ? 'جاهز للبيع' : 'تم البيع بالكامل'} variant={project.status === 'ready' ? 'success' : 'warning'} />
            </div>
          </div>
          <div className="flex gap-2">
            <button className="btn-icon" title="تعديل المشروع"><Edit className="h-5 w-5" /></button>
            <button className="btn-icon text-red-500" title="حذف المشروع" onClick={() => setShowDeleteModal(true)}><Trash2 className="h-5 w-5" /></button>
          </div>
        </div>

        {/* General Info Section */}
        <div className="bg-obsidian/70 rounded-xl p-6 border border-desert-gold/20 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <div className="mb-2"><span className="font-semibold text-desert-gold">المدينة:</span> {project.city}</div>
            <div className="mb-2"><span className="font-semibold text-desert-gold">الحي:</span> {project.district}</div>
            <div className="mb-2"><span className="font-semibold text-desert-gold">شركة الإنشاء:</span> {project.contractor_company}</div>
            <div className="mb-2"><span className="font-semibold text-desert-gold">عدد المباني:</span> {project.building_count}</div>
            <div className="mb-2"><span className="font-semibold text-desert-gold">عدد الأدوار:</span> {project.floors_per_building}</div>
            <div className="mb-2"><span className="font-semibold text-desert-gold">إجمالي الوحدات:</span> {project.total_units}</div>
            <div className="mb-2"><span className="font-semibold text-desert-gold">الوصف:</span> <span className="block text-stone-gray">{project.description}</span></div>
            <div className="mb-2"><span className="font-semibold text-desert-gold">رابط الخريطة:</span> <a href={project.map_link} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">Google Maps</a></div>
          </div>
          <div>
            {/* Project logo (image + upload) */}
            <div className="mb-2">
              <span className="font-semibold text-desert-gold">شعار المشروع:</span>
              <div className="flex items-center gap-2 mt-2">
                {project.logo_url ? (
                  <img src={project.logo_url} alt="شعار المشروع" className="h-16 w-16 rounded bg-white object-contain border" />
                ) : (
                  <span className="text-stone-gray">لا يوجد شعار</span>
                )}
                <input type="file" className="ml-2" />
              </div>
            </div>
            <div className="mb-2"><span className="font-semibold text-desert-gold">ملاحظات داخلية:</span> <span className="block text-stone-gray">{project.internal_notes}</span></div>
          </div>
        </div>

        {/* Units Management Section */}
        <div className="bg-obsidian/70 rounded-xl p-6 border border-desert-gold/20">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            <h2 className="text-xl font-bold text-desert-gold">إدارة الوحدات</h2>
            <div className="flex gap-2 flex-wrap">
              <button className="bg-desert-gold text-deep-black px-6 py-3 rounded-lg font-medium hover:bg-warm-sand transition-all duration-300 flex items-center space-x-2 rtl:space-x-reverse" onClick={() => setShowAddUnitModal(true)} title="إضافة وحدة"><Plus className="h-5 w-5" /><span>إضافة وحدة</span></button>
              <button className="bg-desert-gold text-deep-black px-6 py-3 rounded-lg font-medium hover:bg-warm-sand transition-all duration-300 flex items-center space-x-2 rtl:space-x-reverse" onClick={() => setShowExcelModal(true)} title="رفع وحدات من ملف Excel"><FileSpreadsheet className="h-5 w-5" /><span>رفع Excel</span></button>
              <button className="bg-desert-gold text-deep-black px-6 py-3 rounded-lg font-medium hover:bg-warm-sand transition-all duration-300 flex items-center space-x-2 rtl:space-x-reverse" onClick={() => setShowGenerateModal(true)} title="توليد وحدات"><FlaskConical className="h-5 w-5" /><span>توليد وحدات</span></button>
            </div>
          </div>
          {/* Filters - unified style */}
          <div className="bg-obsidian/50 border border-desert-gold/20 rounded-xl p-6 mb-4">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <div>
                <label className="block text-sm font-medium text-stone-gray mb-2">النوع</label>
                <select className="w-full bg-stone-gray/10 border border-desert-gold/20 rounded-lg px-4 py-2 text-elegant-white focus:outline-none focus:border-desert-gold transition-colors duration-300" value={filters.type} onChange={e => setFilters(f => ({ ...f, type: e.target.value }))}>
                  <option value="">جميع الأنواع</option>
                  {unitTypes.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-gray mb-2">عدد الغرف</label>
                <select className="w-full bg-stone-gray/10 border border-desert-gold/20 rounded-lg px-4 py-2 text-elegant-white focus:outline-none focus:border-desert-gold transition-colors duration-300" value={filters.bedrooms} onChange={e => setFilters(f => ({ ...f, bedrooms: e.target.value }))}>
                  <option value="">جميع الغرف</option>
                  {bedroomOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-gray mb-2">الدور</label>
                <input className="w-full bg-stone-gray/10 border border-desert-gold/20 rounded-lg px-4 py-2 text-elegant-white placeholder-stone-gray focus:outline-none focus:border-desert-gold transition-colors duration-300" type="number" placeholder="جميع الأدوار" value={filters.floor} onChange={e => setFilters(f => ({ ...f, floor: e.target.value }))} />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-gray mb-2">الحالة</label>
                <select className="w-full bg-stone-gray/10 border border-desert-gold/20 rounded-lg px-4 py-2 text-elegant-white focus:outline-none focus:border-desert-gold transition-colors duration-300" value={filters.status} onChange={e => setFilters(f => ({ ...f, status: e.target.value }))}>
                  <option value="">جميع الحالات</option>
                  {statusOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-gray mb-2">الاتجاه</label>
                <select className="w-full bg-stone-gray/10 border border-desert-gold/20 rounded-lg px-4 py-2 text-elegant-white focus:outline-none focus:border-desert-gold transition-colors duration-300" value={filters.orientation} onChange={e => setFilters(f => ({ ...f, orientation: e.target.value }))}>
                  <option value="">جميع الاتجاهات</option>
                  {orientationOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
              </div>
            </div>
          </div>
          {/* Units Table - unified actions */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th></th>
                  <th className="px-4 py-2">الرمز</th>
                  <th className="px-4 py-2">التصميم</th>
                  <th className="px-4 py-2">المساحة</th>
                  <th className="px-4 py-2">الغرف</th>
                  <th className="px-4 py-2">الدور</th>
                  <th className="px-4 py-2">السعر</th>
                  <th className="px-4 py-2">الحالة</th>
                  <th className="px-4 py-2">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {filteredUnits.map((unit) => (
                  <tr key={unit.id} className="border-t border-desert-gold/10">
                    <td><input type="checkbox" checked={selectedUnits.includes(unit.id)} onChange={() => toggleSelectUnit(unit.id)} /></td>
                    <td className="px-4 py-2">{unit.code}</td>
                    <td className="px-4 py-2">{unit.design}</td>
                    <td className="px-4 py-2">{unit.area} م²</td>
                    <td className="px-4 py-2">{unit.rooms}</td>
                    <td className="px-4 py-2">{unit.floor}</td>
                    <td className="px-4 py-2">{unit.price.toLocaleString()} ر.س</td>
                    <td className="px-4 py-2">
                      <StatusBadge status={unit.status === 'available' ? 'متاح' : unit.status === 'sold' ? 'مباع' : 'محجوز'} variant={unit.status === 'available' ? 'success' : unit.status === 'sold' ? 'error' : 'warning'} size="sm" />
                    </td>
                    <td className="px-4 py-2">
                      <div className="flex items-center space-x-2 rtl:space-x-reverse">
                        <button className="p-2 text-stone-gray hover:text-blue-400 hover:bg-blue-400/10 rounded-lg transition-all duration-200" title="عرض" onClick={() => setShowViewUnitModal(unit)}><Eye className="h-4 w-4" /></button>
                        <button className="p-2 text-stone-gray hover:text-desert-gold hover:bg-desert-gold/10 rounded-lg transition-all duration-200" title="تعديل" onClick={() => setShowEditUnitModal(unit)}><Pencil className="h-4 w-4" /></button>
                        <button className="p-2 text-stone-gray hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all duration-200" title="حذف" onClick={() => { setShowDeleteModal(true); setShowEditUnitModal(unit); }}><Trash2 className="h-4 w-4" /></button>
                        <button className="p-2 text-green-600 hover:text-green-700 hover:bg-green-600/10 rounded-lg transition-all duration-200" title="بيع" onClick={() => setShowSellModal(unit)}><ShoppingCart className="h-4 w-4" /></button>
                        <button className="p-2 text-stone-gray hover:text-desert-gold hover:bg-desert-gold/10 rounded-lg transition-all duration-200" title="عقد" onClick={() => alert('عرض العقد (تجريبي)')}><FileSignature className="h-4 w-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Smart Actions Section */}
          <div className="bg-obsidian/70 rounded-xl p-6 border border-desert-gold/20 flex flex-wrap gap-4 mt-4">
            <button className="btn-icon" title="تبديل حالة المشروع" onClick={() => setShowBulkStatusModal(true)}><RefreshCw className="h-5 w-5" /></button>
            <button className="btn-icon" title="تصدير الوحدات" onClick={handleExport}><FileSpreadsheet className="h-5 w-5" /></button>
            <button className="btn-icon" title="حملات تسويق" onClick={() => setShowCampaignModal(true)}><FlaskConical className="h-5 w-5" /></button>
            <button className="btn-icon" title="تقارير" onClick={() => setShowReportModal(true)}><FileText className="h-5 w-5" /></button>
            <span className="text-stone-gray">إجراءات ذكية (تبديل الحالة، تصدير، حملات، تقارير)</span>
          </div>
        </div>
        {/* Add/Edit/View/Sell/Excel/Generate/Campaign/Report/BulkStatus Modals */}
        {/* Add Unit Modal */}
        <Modal isOpen={showAddUnitModal} onClose={() => setShowAddUnitModal(false)} title="إضافة وحدة جديدة">
          <form className="space-y-6" onSubmit={e => { e.preventDefault(); handleAddUnitSubmit(); }}>
            <div className="text-lg font-bold text-desert-gold mb-2">معلومات الوحدة</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              <FormField label="رمز الوحدة" required error={addUnitErrors.code}>
                <input className="input w-full" value={addUnitForm.code} onChange={e => setAddUnitForm(f => ({ ...f, code: e.target.value }))} />
              </FormField>
              <FormField label="التصميم" required error={addUnitErrors.design}>
                <input className="input w-full" value={addUnitForm.design} onChange={e => setAddUnitForm(f => ({ ...f, design: e.target.value }))} />
              </FormField>
              <FormField label="المساحة (م²)" required error={addUnitErrors.area}>
                <input className="input w-full" type="number" value={addUnitForm.area} onChange={e => setAddUnitForm(f => ({ ...f, area: e.target.value }))} />
              </FormField>
              <FormField label="عدد الغرف" required error={addUnitErrors.rooms}>
                <select className="input w-full" value={addUnitForm.rooms} onChange={e => setAddUnitForm(f => ({ ...f, rooms: e.target.value }))}>
                  <option value="">اختر</option>
                  {bedroomOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </FormField>
              <FormField label="الدور" required error={addUnitErrors.floor}>
                <input className="input w-full" type="number" value={addUnitForm.floor} onChange={e => setAddUnitForm(f => ({ ...f, floor: e.target.value }))} />
              </FormField>
              <FormField label="السعر (ر.س)" required error={addUnitErrors.price}>
                <input className="input w-full" type="number" value={addUnitForm.price} onChange={e => setAddUnitForm(f => ({ ...f, price: e.target.value }))} />
              </FormField>
              <FormField label="الحالة" required error={addUnitErrors.status}>
                <select className="input w-full" value={addUnitForm.status} onChange={e => setAddUnitForm(f => ({ ...f, status: e.target.value }))}>
                  <option value="">اختر</option>
                  {statusOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
              </FormField>
              <FormField label="الاتجاه" required error={addUnitErrors.orientation}>
                <select className="input w-full" value={addUnitForm.orientation} onChange={e => setAddUnitForm(f => ({ ...f, orientation: e.target.value }))}>
                  <option value="">اختر</option>
                  {orientationOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
              </FormField>
              <FormField label="النوع" required error={addUnitErrors.type}>
                <select className="input w-full" value={addUnitForm.type} onChange={e => setAddUnitForm(f => ({ ...f, type: e.target.value }))}>
                  <option value="">اختر</option>
                  {unitTypes.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
              </FormField>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button type="button" className="btn" onClick={() => setShowAddUnitModal(false)}>إلغاء</button>
              <button type="submit" className="btn btn-success">إضافة</button>
            </div>
          </form>
        </Modal>
        {/* Edit Unit Modal */}
        <Modal isOpen={!!showEditUnitModal && !showDeleteModal} onClose={() => setShowEditUnitModal(null)} title="تعديل الوحدة">
          <form className="space-y-6" onSubmit={e => { e.preventDefault(); handleEditUnit({ ...showEditUnitModal!, code: 'EDITED-01', design: 'B', area: 120, rooms: 3, floor: 2, price: 450000, status: 'sold', orientation: 'north', type: 'residential' }); setShowEditUnitModal(null); }}>
            <div className="text-lg font-bold text-desert-gold mb-2">معلومات الوحدة</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              <FormField label="رمز الوحدة" required error={addUnitErrors.code}>
                <input className="input w-full" value={showEditUnitModal?.code} onChange={e => setShowEditUnitModal(prev => prev ? { ...prev, code: e.target.value } : null)} />
              </FormField>
              <FormField label="التصميم" required error={addUnitErrors.design}>
                <input className="input w-full" value={showEditUnitModal?.design} onChange={e => setShowEditUnitModal(prev => prev ? { ...prev, design: e.target.value } : null)} />
              </FormField>
              <FormField label="المساحة (م²)" required error={addUnitErrors.area}>
                <input className="input w-full" type="number" value={showEditUnitModal?.area} onChange={e => setShowEditUnitModal(prev => prev ? { ...prev, area: Number(e.target.value) } : null)} />
              </FormField>
              <FormField label="عدد الغرف" required error={addUnitErrors.rooms}>
                <select className="input w-full" value={showEditUnitModal?.rooms} onChange={e => setShowEditUnitModal(prev => prev ? { ...prev, rooms: Number(e.target.value) } : null)}>
                  <option value="">اختر</option>
                  {bedroomOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </FormField>
              <FormField label="الدور" required error={addUnitErrors.floor}>
                <input className="input w-full" type="number" value={showEditUnitModal?.floor} onChange={e => setShowEditUnitModal(prev => prev ? { ...prev, floor: Number(e.target.value) } : null)} />
              </FormField>
              <FormField label="السعر (ر.س)" required error={addUnitErrors.price}>
                <input className="input w-full" type="number" value={showEditUnitModal?.price} onChange={e => setShowEditUnitModal(prev => prev ? { ...prev, price: Number(e.target.value) } : null)} />
              </FormField>
              <FormField label="الحالة" required error={addUnitErrors.status}>
                <select className="input w-full" value={showEditUnitModal?.status} onChange={e => setShowEditUnitModal(prev => prev ? { ...prev, status: e.target.value } : null)}>
                  <option value="">اختر</option>
                  {statusOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
              </FormField>
              <FormField label="الاتجاه" required error={addUnitErrors.orientation}>
                <select className="input w-full" value={showEditUnitModal?.orientation} onChange={e => setShowEditUnitModal(prev => prev ? { ...prev, orientation: e.target.value } : null)}>
                  <option value="">اختر</option>
                  {orientationOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
              </FormField>
              <FormField label="النوع" required error={addUnitErrors.type}>
                <select className="input w-full" value={showEditUnitModal?.type} onChange={e => setShowEditUnitModal(prev => prev ? { ...prev, type: e.target.value } : null)}>
                  <option value="">اختر</option>
                  {unitTypes.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
              </FormField>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button type="button" className="btn" onClick={() => setShowEditUnitModal(null)}>إلغاء</button>
              <button type="submit" className="btn btn-success">تحديث</button>
            </div>
          </form>
        </Modal>
        {/* View Unit Modal */}
        <Modal isOpen={!!showViewUnitModal} onClose={() => setShowViewUnitModal(null)} title="تفاصيل الوحدة">
          <div className="p-4 space-y-4">
            <div><span className="font-semibold text-desert-gold">رمز الوحدة:</span> {showViewUnitModal?.code}</div>
            <div><span className="font-semibold text-desert-gold">التصميم:</span> {showViewUnitModal?.design}</div>
            <div><span className="font-semibold text-desert-gold">المساحة:</span> {showViewUnitModal?.area} م²</div>
            <div><span className="font-semibold text-desert-gold">عدد الغرف:</span> {showViewUnitModal?.rooms}</div>
            <div><span className="font-semibold text-desert-gold">الدور:</span> {showViewUnitModal?.floor}</div>
            <div><span className="font-semibold text-desert-gold">السعر:</span> {showViewUnitModal?.price.toLocaleString()} ر.س</div>
            <div><span className="font-semibold text-desert-gold">الحالة:</span> {showViewUnitModal?.status}</div>
            <div><span className="font-semibold text-desert-gold">الاتجاه:</span> {showViewUnitModal?.orientation}</div>
            <div><span className="font-semibold text-desert-gold">النوع:</span> {showViewUnitModal?.type}</div>
          </div>
        </Modal>
        {/* Delete Unit Modal */}
        <Modal isOpen={showDeleteModal && !!showEditUnitModal} onClose={() => setShowDeleteModal(false)} title="تأكيد حذف الوحدة">
          <div className="p-4">
            <p className="mb-4 text-red-500">هل أنت متأكد أنك تريد حذف هذه الوحدة؟ لا يمكن التراجع عن هذا الإجراء.</p>
            <div className="flex gap-2 justify-end">
              <button className="btn" onClick={() => setShowDeleteModal(false)}>إلغاء</button>
              <button className="btn btn-danger" onClick={() => handleDeleteUnit(showEditUnitModal!.id)}>حذف</button>
            </div>
          </div>
        </Modal>
        {/* Sell Modal */}
        <Modal isOpen={!!showSellModal} onClose={() => setShowSellModal(null)} title="بيع الوحدة">
          {showSellModal && (
            <div className="p-4 space-y-4">
              <div><span className="font-semibold text-desert-gold">رمز الوحدة:</span> {showSellModal.code}</div>
              <div><span className="font-semibold text-desert-gold">السعر النهائي:</span> {showSellModal.price.toLocaleString()} ر.س</div>
              {/* Customer Info, Contract, Status, Sales Notes (placeholders) */}
              <div>
                <label className="block mb-1">معلومات العميل</label>
                <input className="input w-full" placeholder="اسم العميل / رقم الجوال" />
              </div>
              <div>
                <label className="block mb-1">ملاحظات البيع</label>
                <textarea className="input w-full" rows={2} placeholder="ملاحظات..." />
              </div>
              <div className="flex gap-2 justify-end">
                <button className="btn" onClick={() => setShowSellModal(null)}>إلغاء</button>
                <button className="btn btn-success" onClick={() => handleSellUnit(showSellModal, 'Mock Buyer', 'Mock Notes')}>إنشاء عقد وبيع</button>
              </div>
            </div>
          )}
        </Modal>
        {/* Excel Modal */}
        <Modal isOpen={showExcelModal} onClose={() => setShowExcelModal(false)} title="رفع ملف Excel">
          <div className="p-4">
            <input type="file" ref={fileInputRef} accept=".xlsx,.xls,.csv" onChange={handleExcelUpload} />
            <p className="text-stone-gray mt-2">يرجى التأكد من وجود عمود project_name في الملف أو اختيار المشروع قبل الرفع.</p>
          </div>
        </Modal>
        {/* Generate Units Modal */}
        <Modal isOpen={showGenerateModal} onClose={() => setShowGenerateModal(false)} title="توليد وحدات">
          <form className="space-y-6" onSubmit={e => { e.preventDefault(); handleGenerateUnits([{ id: Date.now(), code: 'GEN-01', design: 'A', area: 100, rooms: 2, floor: 1, price: 100000, status: 'available', orientation: 'north', type: 'residential' }]); setShowGenerateModal(false); }}>
            <div className="text-lg font-bold text-desert-gold mb-2">معلومات الوحدات المراد إنشاؤها</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              <FormField label="عدد الوحدات المراد إنشاؤها" required error={addUnitErrors.code}>
                <input className="input w-full" type="number" value={addUnitForm.code} onChange={e => setAddUnitForm(f => ({ ...f, code: e.target.value }))} />
              </FormField>
              <FormField label="نوع الوحدات" required error={addUnitErrors.design}>
                <select className="input w-full" value={addUnitForm.design} onChange={e => setAddUnitForm(f => ({ ...f, design: e.target.value }))}>
                  <option value="">اختر</option>
                  {unitTypes.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
              </FormField>
              <FormField label="عدد الغرف" required error={addUnitErrors.area}>
                <select className="input w-full" value={addUnitForm.area} onChange={e => setAddUnitForm(f => ({ ...f, area: e.target.value }))}>
                  <option value="">اختر</option>
                  {bedroomOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </FormField>
              <FormField label="السعر (ر.س)" required error={addUnitErrors.price}>
                <input className="input w-full" type="number" value={addUnitForm.price} onChange={e => setAddUnitForm(f => ({ ...f, price: e.target.value }))} />
              </FormField>
              <FormField label="الحالة" required error={addUnitErrors.status}>
                <select className="input w-full" value={addUnitForm.status} onChange={e => setAddUnitForm(f => ({ ...f, status: e.target.value }))}>
                  <option value="">اختر</option>
                  {statusOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
              </FormField>
              <FormField label="الاتجاه" required error={addUnitErrors.orientation}>
                <select className="input w-full" value={addUnitForm.orientation} onChange={e => setAddUnitForm(f => ({ ...f, orientation: e.target.value }))}>
                  <option value="">اختر</option>
                  {orientationOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
              </FormField>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button type="button" className="btn" onClick={() => setShowGenerateModal(false)}>إلغاء</button>
              <button type="submit" className="btn btn-success">توليد</button>
            </div>
          </form>
        </Modal>
        {/* Campaign Modal */}
        <Modal isOpen={showCampaignModal} onClose={() => setShowCampaignModal(false)} title="حملات تسويق">
          <form className="space-y-6" onSubmit={e => { e.preventDefault(); setShowCampaignModal(false); }}>
            <div className="text-lg font-bold text-desert-gold mb-2">معلومات الحملة</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              <FormField label="اسم الحملة" required error={addUnitErrors.code}>
                <input className="input w-full" value={addUnitForm.code} onChange={e => setAddUnitForm(f => ({ ...f, code: e.target.value }))} />
              </FormField>
              <FormField label="تفاصيل الحملة" required error={addUnitErrors.design}>
                <textarea className="input w-full" rows={3} value={addUnitForm.design} onChange={e => setAddUnitForm(f => ({ ...f, design: e.target.value }))} />
              </FormField>
              <FormField label="تاريخ بدء الحملة" required error={addUnitErrors.area}>
                <input className="input w-full" type="date" value={addUnitForm.area} onChange={e => setAddUnitForm(f => ({ ...f, area: e.target.value }))} />
              </FormField>
              <FormField label="تاريخ انتهاء الحملة" required error={addUnitErrors.price}>
                <input className="input w-full" type="date" value={addUnitForm.price} onChange={e => setAddUnitForm(f => ({ ...f, price: e.target.value }))} />
              </FormField>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button type="button" className="btn" onClick={() => setShowCampaignModal(false)}>إلغاء</button>
              <button type="submit" className="btn btn-success">إنشاء حملة</button>
            </div>
          </form>
        </Modal>
        {/* Report Modal */}
        <Modal isOpen={showReportModal} onClose={() => setShowReportModal(false)} title="تقارير المشروع">
          <div className="p-4 space-y-4">
            <h3 className="text-lg font-bold text-desert-gold">تقرير الوحدات</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="px-4 py-2">رمز الوحدة</th>
                    <th className="px-4 py-2">التصميم</th>
                    <th className="px-4 py-2">المساحة</th>
                    <th className="px-4 py-2">الغرف</th>
                    <th className="px-4 py-2">الدور</th>
                    <th className="px-4 py-2">السعر</th>
                    <th className="px-4 py-2">الحالة</th>
                    <th className="px-4 py-2">الاتجاه</th>
                    <th className="px-4 py-2">النوع</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUnits.map(unit => (
                    <tr key={unit.id} className="border-t border-desert-gold/10">
                      <td className="px-4 py-2">{unit.code}</td>
                      <td className="px-4 py-2">{unit.design}</td>
                      <td className="px-4 py-2">{unit.area} م²</td>
                      <td className="px-4 py-2">{unit.rooms}</td>
                      <td className="px-4 py-2">{unit.floor}</td>
                      <td className="px-4 py-2">{unit.price.toLocaleString()} ر.س</td>
                      <td className="px-4 py-2">{unit.status}</td>
                      <td className="px-4 py-2">{unit.orientation}</td>
                      <td className="px-4 py-2">{unit.type}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <h3 className="text-lg font-bold text-desert-gold mt-4">تقرير المبيعات</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="px-4 py-2">رمز الوحدة</th>
                    <th className="px-4 py-2">السعر الأصلي</th>
                    <th className="px-4 py-2">السعر النهائي</th>
                    <th className="px-4 py-2">تاريخ البيع</th>
                    <th className="px-4 py-2">معلومات العميل</th>
                    <th className="px-4 py-2">ملاحظات البيع</th>
                  </tr>
                </thead>
                <tbody>
                  {units.map(unit => (
                    <tr key={unit.id} className="border-t border-desert-gold/10">
                      <td className="px-4 py-2">{unit.code}</td>
                      <td className="px-4 py-2">{unit.price.toLocaleString()} ر.س</td>
                      <td className="px-4 py-2">{unit.price.toLocaleString()} ر.س</td>
                      <td className="px-4 py-2">Mock Date</td>
                      <td className="px-4 py-2">Mock Buyer</td>
                      <td className="px-4 py-2">Mock Notes</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <h3 className="text-lg font-bold text-desert-gold mt-4">تقرير الحملات</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="px-4 py-2">اسم الحملة</th>
                    <th className="px-4 py-2">تفاصيل الحملة</th>
                    <th className="px-4 py-2">تاريخ البدء</th>
                    <th className="px-4 py-2">تاريخ الانتهاء</th>
                    <th className="px-4 py-2">الوحدات المتأثرة</th>
                  </tr>
                </thead>
                <tbody>
                  {units.map(unit => (
                    <tr key={unit.id} className="border-t border-desert-gold/10">
                      <td className="px-4 py-2">Mock Campaign</td>
                      <td className="px-4 py-2">Mock Details</td>
                      <td className="px-4 py-2">Mock Start Date</td>
                      <td className="px-4 py-2">Mock End Date</td>
                      <td className="px-4 py-2">{unit.code}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Modal>
        {/* Bulk Status Modal */}
        <Modal isOpen={showBulkStatusModal} onClose={() => setShowBulkStatusModal(false)} title="تبديل حالة الوحدات">
          <div className="p-4">
            <p className="mb-4">اختر الحالة الجديدة لجميع الوحدات المحددة:</p>
            <div className="flex gap-2 mb-4">
              <button className="btn" onClick={() => handleBulkStatus('available')}>متاح</button>
              <button className="btn" onClick={() => handleBulkStatus('sold')}>مباع</button>
              <button className="btn" onClick={() => handleBulkStatus('reserved')}>محجوز</button>
            </div>
            <button className="btn" onClick={() => setShowBulkStatusModal(false)}>إغلاق</button>
          </div>
        </Modal>
      </div>
    </PageWrapper>
  );
} 