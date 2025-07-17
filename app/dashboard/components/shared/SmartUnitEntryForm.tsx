import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader2, Check, X, Upload, FileText, Eye, RefreshCw } from 'lucide-react';
import FormField from './FormField';
import Modal from './Modal';

// Types
interface Project {
  id: string;
  name: string;
  code: string;
}
interface Floor {
  id: string;
  number: number;
}
interface Design {
  id: string;
  name: string;
}
interface UnitTemplate {
  id: string;
  name: string;
  config: any;
}
interface Unit {
  projectId: string;
  floorId: string;
  unitCode: string;
  designId: string;
  price: number;
  direction: string;
  view: string;
  size: number;
  roomCount: number;
  bathroomCount: number;
  description: string;
}

const directions = [
  { value: 'north', label: 'شمال / North' },
  { value: 'south', label: 'جنوب / South' },
  { value: 'east', label: 'شرق / East' },
  { value: 'west', label: 'غرب / West' },
];
const views = [
  { value: 'city', label: 'مدينة / City' },
  { value: 'sea', label: 'بحر / Sea' },
  { value: 'garden', label: 'حديقة / Garden' },
  { value: 'other', label: 'أخرى / Other' },
];

const SmartUnitEntryForm: React.FC = () => {
  // State
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [floors, setFloors] = useState<Floor[]>([]);
  const [designs, setDesigns] = useState<Design[]>([]);
  const [unitConfig, setUnitConfig] = useState({
    designId: '',
    numberOfUnits: 1,
    size: '',
    roomCount: '',
    bathroomCount: '',
    price: '',
    unitPrefix: '',
    description: '',
    direction: 'north',
    view: 'city',
    autoFill: false,
  });
  const [floorDistribution, setFloorDistribution] = useState<Record<string, number>>({});
  const [generatedUnits, setGeneratedUnits] = useState<Unit[]>([]);
  const [existingCodes, setExistingCodes] = useState<string[]>([]);
  const [duplicateCodes, setDuplicateCodes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [showPreview, setShowPreview] = useState(false);
  const [templates, setTemplates] = useState<UnitTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [excelFile, setExcelFile] = useState<File | null>(null);
  const [excelUnits, setExcelUnits] = useState<Unit[]>([]);

  // Fetch projects on mount
  useEffect(() => {
    setIsLoading(true);
    // Mock API call
    setTimeout(() => {
      setProjects([
        { id: '1', name: 'مشروع الأناقة', code: 'PRJ-001' },
        { id: '2', name: 'برج التجارة', code: 'PRJ-002' },
      ]);
      setIsLoading(false);
    }, 800);
  }, []);

  // Fetch floors and designs when project changes
  useEffect(() => {
    if (!selectedProject) return;
    setIsLoading(true);
    // Mock API call
    setTimeout(() => {
      setFloors([
        { id: 'f1', number: 1 },
        { id: 'f2', number: 2 },
        { id: 'f3', number: 3 },
      ]);
      setDesigns([
        { id: 'd1', name: 'شقة 3 غرف' },
        { id: 'd2', name: 'شقة 5 غرف' },
      ]);
      setIsLoading(false);
    }, 800);
  }, [selectedProject]);

  // Fetch templates
  useEffect(() => {
    // Mock API call
    setTimeout(() => {
      setTemplates([
        { id: 't1', name: 'قالب شقق 3 غرف', config: { ...unitConfig, designId: 'd1' } },
      ]);
    }, 500);
  }, []);

  // Generate units when config or distribution changes
  useEffect(() => {
    if (!selectedProject || !unitConfig.designId) return;
    let units: Unit[] = [];
    let total = 0;
    Object.entries(floorDistribution).forEach(([floorId, count]) => {
      const floor = floors.find(f => f.id === floorId);
      for (let i = 1; i <= count; i++) {
        const code = `${selectedProject.code}-${unitConfig.unitPrefix}${floor?.number || ''}${i}`;
        units.push({
          projectId: selectedProject.id,
          floorId,
          unitCode: code,
          designId: unitConfig.designId,
          price: Number(unitConfig.price),
          direction: unitConfig.direction,
          view: unitConfig.view,
          size: Number(unitConfig.size),
          roomCount: Number(unitConfig.roomCount),
          bathroomCount: Number(unitConfig.bathroomCount),
          description: unitConfig.description,
        });
        total++;
      }
    });
    setGeneratedUnits(units);
  }, [unitConfig, floorDistribution, selectedProject, floors]);

  // Handlers
  const handleProjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const proj = projects.find(p => p.id === e.target.value) || null;
    setSelectedProject(proj);
    setUnitConfig({ ...unitConfig, designId: '', unitPrefix: '', price: '', size: '', roomCount: '', bathroomCount: '', description: '' });
    setFloorDistribution({});
    setGeneratedUnits([]);
    setError('');
    setSuccess('');
  };
  const handleConfigChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setUnitConfig({ ...unitConfig, [e.target.name]: e.target.value });
    setError('');
    setSuccess('');
  };
  const handleFloorDistChange = (floorId: string, value: number) => {
    setFloorDistribution({ ...floorDistribution, [floorId]: value });
    setError('');
    setSuccess('');
  };
  const handleTemplateLoad = (id: string) => {
    const t = templates.find(t => t.id === id);
    if (t) {
      setUnitConfig(t.config);
      setSelectedTemplate(id);
    }
  };
  const handleTemplateSave = () => {
    setTemplates([...templates, { id: Date.now().toString(), name: `قالب ${unitConfig.designId}`, config: { ...unitConfig } }]);
    setSuccess('تم حفظ القالب بنجاح');
  };
  const handleExcelUpload = (file: File) => {
    // Mock parse
    setIsLoading(true);
    setTimeout(() => {
      setExcelUnits([
        {
          projectId: selectedProject?.id || '',
          floorId: floors[0]?.id || '',
          unitCode: 'PRJ-001-A11',
          designId: designs[0]?.id || '',
          price: 500000,
          direction: 'north',
          view: 'city',
          size: 180,
          roomCount: 5,
          bathroomCount: 4,
          description: 'وحدة مستوردة',
        },
      ]);
      setIsLoading(false);
    }, 1000);
  };
  const handleReset = () => {
    setSelectedProject(null);
    setUnitConfig({
      designId: '',
      numberOfUnits: 1,
      size: '',
      roomCount: '',
      bathroomCount: '',
      price: '',
      unitPrefix: '',
      description: '',
      direction: 'north',
      view: 'city',
      autoFill: false,
    });
    setFloorDistribution({});
    setGeneratedUnits([]);
    setExcelUnits([]);
    setExcelFile(null);
    setError('');
    setSuccess('');
    setShowPreview(false);
  };
  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError('');
    setSuccess('');
    // Mock uniqueness check
    const codes = generatedUnits.map(u => u.unitCode);
    // Simulate API check
    setTimeout(() => {
      const dups = codes.filter(code => existingCodes.includes(code));
      if (dups.length > 0) {
        setDuplicateCodes(dups);
        setError(`رمز الوحدة ${dups[0]} مستخدم بالفعل. يرجى تغيير البادئة أو التوزيع.`);
        setIsSubmitting(false);
        return;
      }
      // Mock POST /units
      setTimeout(() => {
        setSuccess('تمت إضافة الوحدات بنجاح!');
        setIsSubmitting(false);
        setShowPreview(false);
      }, 1000);
    }, 1000);
  };

  // Validation
  const totalUnits = Object.values(floorDistribution).reduce((a, b) => a + (b || 0), 0);
  const isValid = selectedProject && unitConfig.designId && unitConfig.unitPrefix && unitConfig.price && unitConfig.size && unitConfig.roomCount && unitConfig.bathroomCount && totalUnits === Number(unitConfig.numberOfUnits);

  // Render
  return (
    <div className="bg-obsidian/70 rounded-xl p-8 border border-desert-gold/20 max-w-4xl mx-auto mt-8 rtl">
      <h2 className="text-2xl font-bold text-desert-gold mb-6 flex items-center">
        <FileText className="h-6 w-6 mr-2" />
        نظام الإدخال الذكي للوحدات
      </h2>
      {/* Project Selection */}
      <FormField label="اختر المشروع" required>
        <select
          className="w-full bg-stone-gray/10 border border-desert-gold/20 rounded-lg px-4 py-3 text-elegant-white focus:outline-none focus:border-desert-gold"
          value={selectedProject?.id || ''}
          onChange={handleProjectChange}
          disabled={isLoading}
        >
          <option value="">اختر مشروعاً</option>
          {projects.map(p => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
      </FormField>
      {/* Template Load */}
      {templates.length > 0 && (
        <FormField label="تحميل قالب محفوظ">
          <select
            className="w-full bg-stone-gray/10 border border-desert-gold/20 rounded-lg px-4 py-3 text-elegant-white"
            value={selectedTemplate}
            onChange={e => handleTemplateLoad(e.target.value)}
          >
            <option value="">اختر قالباً</option>
            {templates.map(t => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
        </FormField>
      )}
      {/* Unit Config */}
      {selectedProject && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <FormField label="اسم التصميم" required>
            <select
              name="designId"
              value={unitConfig.designId}
              onChange={handleConfigChange}
              className="w-full bg-stone-gray/10 border border-desert-gold/20 rounded-lg px-4 py-3 text-elegant-white"
            >
              <option value="">اختر التصميم</option>
              {designs.map(d => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </FormField>
          <FormField label="عدد الوحدات" required>
            <input
              type="number"
              name="numberOfUnits"
              value={unitConfig.numberOfUnits}
              onChange={handleConfigChange}
              className="w-full bg-stone-gray/10 border border-desert-gold/20 rounded-lg px-4 py-3 text-elegant-white"
              min={1}
            />
          </FormField>
          <FormField label="المساحة (م²)" required>
            <input
              type="number"
              name="size"
              value={unitConfig.size}
              onChange={handleConfigChange}
              className="w-full bg-stone-gray/10 border border-desert-gold/20 rounded-lg px-4 py-3 text-elegant-white"
              min={1}
            />
          </FormField>
          <FormField label="عدد الغرف" required>
            <input
              type="number"
              name="roomCount"
              value={unitConfig.roomCount}
              onChange={handleConfigChange}
              className="w-full bg-stone-gray/10 border border-desert-gold/20 rounded-lg px-4 py-3 text-elegant-white"
              min={0}
            />
          </FormField>
          <FormField label="عدد الحمامات" required>
            <input
              type="number"
              name="bathroomCount"
              value={unitConfig.bathroomCount}
              onChange={handleConfigChange}
              className="w-full bg-stone-gray/10 border border-desert-gold/20 rounded-lg px-4 py-3 text-elegant-white"
              min={0}
            />
          </FormField>
          <FormField label="السعر الابتدائي" required>
            <input
              type="number"
              name="price"
              value={unitConfig.price}
              onChange={handleConfigChange}
              className="w-full bg-stone-gray/10 border border-desert-gold/20 rounded-lg px-4 py-3 text-elegant-white"
              min={0}
            />
          </FormField>
          <FormField label="بادئة رمز الوحدة" required>
            <input
              type="text"
              name="unitPrefix"
              value={unitConfig.unitPrefix}
              onChange={handleConfigChange}
              className="w-full bg-stone-gray/10 border border-desert-gold/20 rounded-lg px-4 py-3 text-elegant-white"
              maxLength={3}
            />
          </FormField>
          <FormField label="الوصف">
            <textarea
              name="description"
              value={unitConfig.description}
              onChange={handleConfigChange}
              className="w-full bg-stone-gray/10 border border-desert-gold/20 rounded-lg px-4 py-3 text-elegant-white"
              rows={2}
            />
          </FormField>
          <FormField label="الاتجاه" required>
            <select
              name="direction"
              value={unitConfig.direction}
              onChange={handleConfigChange}
              className="w-full bg-stone-gray/10 border border-desert-gold/20 rounded-lg px-4 py-3 text-elegant-white"
            >
              {directions.map(d => (
                <option key={d.value} value={d.value}>{d.label}</option>
              ))}
            </select>
          </FormField>
          <FormField label="الإطلالة" required>
            <select
              name="view"
              value={unitConfig.view}
              onChange={handleConfigChange}
              className="w-full bg-stone-gray/10 border border-desert-gold/20 rounded-lg px-4 py-3 text-elegant-white"
            >
              {views.map(v => (
                <option key={v.value} value={v.value}>{v.label}</option>
              ))}
            </select>
          </FormField>
        </div>
      )}
      {/* Floor Distribution */}
      {selectedProject && floors.length > 0 && (
        <div className="mt-8">
          <h4 className="text-lg font-bold text-elegant-white mb-2">توزيع الأدوار</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {floors.map(f => (
              <FormField key={f.id} label={`الدور ${f.number}`}>
                <input
                  type="number"
                  min={0}
                  value={floorDistribution[f.id] || ''}
                  onChange={e => handleFloorDistChange(f.id, Number(e.target.value))}
                  className="w-full bg-stone-gray/10 border border-desert-gold/20 rounded-lg px-4 py-3 text-elegant-white"
                />
              </FormField>
            ))}
          </div>
          <div className="text-stone-gray text-sm mt-2">المجموع: {totalUnits} / {unitConfig.numberOfUnits}</div>
          {totalUnits !== Number(unitConfig.numberOfUnits) && (
            <div className="text-red-400 text-xs mt-1">يجب أن يساوي مجموع التوزيع عدد الوحدات</div>
          )}
        </div>
      )}
      {/* Actions */}
      <div className="flex flex-wrap gap-4 mt-8 items-center">
        <motion.button
          onClick={() => setShowPreview(true)}
          disabled={!isValid || isLoading}
          className="px-6 py-3 bg-desert-gold text-deep-black rounded-lg font-medium hover:bg-warm-sand transition-all duration-300 disabled:opacity-50"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Eye className="h-4 w-4 inline mr-2" /> معاينة الوحدات
        </motion.button>
        <motion.button
          onClick={handleTemplateSave}
          disabled={!isValid}
          className="px-6 py-3 border border-desert-gold/20 text-stone-gray rounded-lg hover:bg-stone-gray/10 transition-all duration-300"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <FileText className="h-4 w-4 inline mr-2" /> حفظ كقالب
        </motion.button>
        <motion.button
          onClick={handleReset}
          className="px-6 py-3 border border-desert-gold/20 text-stone-gray rounded-lg hover:bg-stone-gray/10 transition-all duration-300"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <RefreshCw className="h-4 w-4 inline mr-2" /> إعادة تعيين
        </motion.button>
        {/* Excel Upload */}
        <label className="flex items-center cursor-pointer">
          <Upload className="h-4 w-4 mr-2 text-desert-gold" />
          <input
            type="file"
            accept=".csv,.xlsx,.xls"
            className="hidden"
            onChange={e => {
              const file = e.target.files?.[0];
              if (file) {
                setExcelFile(file);
                handleExcelUpload(file);
              }
            }}
          />
          <span className="text-desert-gold">استيراد من Excel</span>
        </label>
      </div>
      {/* Error/Success */}
      {error && <div className="text-red-400 mt-4">{error}</div>}
      {success && <div className="text-green-400 mt-4">{success}</div>}
      {isLoading && <div className="flex items-center mt-4"><Loader2 className="animate-spin mr-2" /> جاري التحميل...</div>}
      {/* Preview Modal */}
      <Modal isOpen={showPreview} onClose={() => setShowPreview(false)} title="معاينة الوحدات" size="xl">
        <div className="overflow-x-auto max-h-96">
          <table className="w-full">
            <thead>
              <tr>
                <th>رمز الوحدة</th>
                <th>الدور</th>
                <th>التصميم</th>
                <th>السعر</th>
                <th>الاتجاه</th>
                <th>الإطلالة</th>
                <th>المساحة</th>
              </tr>
            </thead>
            <tbody>
              {generatedUnits.map((u, i) => (
                <tr key={i}>
                  <td>{u.unitCode}</td>
                  <td>{floors.find(f => f.id === u.floorId)?.number}</td>
                  <td>{designs.find(d => d.id === u.designId)?.name}</td>
                  <td>{u.price}</td>
                  <td>{directions.find(d => d.value === u.direction)?.label}</td>
                  <td>{views.find(v => v.value === u.view)?.label}</td>
                  <td>{u.size}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex justify-end mt-6">
          <motion.button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-8 py-3 bg-desert-gold text-deep-black rounded-lg font-medium hover:bg-warm-sand transition-all duration-300 disabled:opacity-50"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isSubmitting ? <Loader2 className="animate-spin inline mr-2" /> : <Check className="h-4 w-4 inline mr-2" />}
            تأكيد الإدخال
          </motion.button>
        </div>
        {duplicateCodes.length > 0 && (
          <div className="text-red-400 mt-4">رموز مكررة: {duplicateCodes.join(', ')}</div>
        )}
      </Modal>
      {/* Excel Preview */}
      {excelUnits.length > 0 && (
        <div className="mt-8">
          <h4 className="text-lg font-bold text-elegant-white mb-2">معاينة وحدات Excel</h4>
          <div className="overflow-x-auto max-h-64">
            <table className="w-full">
              <thead>
                <tr>
                  <th>رمز الوحدة</th>
                  <th>الدور</th>
                  <th>التصميم</th>
                  <th>السعر</th>
                  <th>الاتجاه</th>
                  <th>الإطلالة</th>
                  <th>المساحة</th>
                </tr>
              </thead>
              <tbody>
                {excelUnits.map((u, i) => (
                  <tr key={i}>
                    <td>{u.unitCode}</td>
                    <td>{floors.find(f => f.id === u.floorId)?.number}</td>
                    <td>{designs.find(d => d.id === u.designId)?.name}</td>
                    <td>{u.price}</td>
                    <td>{directions.find(d => d.value === u.direction)?.label}</td>
                    <td>{views.find(v => v.value === u.view)?.label}</td>
                    <td>{u.size}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default SmartUnitEntryForm; 