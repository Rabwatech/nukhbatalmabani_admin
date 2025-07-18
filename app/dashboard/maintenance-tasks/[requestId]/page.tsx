"use client";
import { useParams, useRouter } from 'next/navigation';
import { useDirection } from '@/context/DirectionContext';
import PageWrapper from '../../components/PageWrapper';
import { Button } from '@/components/ui/button';
import StatusBadge from '../../components/shared/StatusBadge';
import FormField from '../../components/shared/FormField';
import { useState } from 'react';
import SelectContext from '@/components/ui/select-context';

// Mock data for demonstration
const mockRequests = [
  {
    id: 'REQ-1001',
    project: 'مشروع 1 / Project 1',
    unit: 'A101',
    issueType: 'تسرب / Leak',
    status: 'new',
    date: '2024-06-01',
    assigned: 'فاطمة الحربي / Fatima Al-Harbi',
    client: 'أحمد العتيبي / Ahmed Al-Otaibi',
    description: 'يوجد تسرب مياه في الحمام الرئيسي. / Water leak in main bathroom.',
    files: [],
    preferredTime: '2024-06-02 10:00',
    notes: '',
    report: '',
    cost: '',
    materials: '',
  },
  {
    id: 'REQ-1002',
    project: 'مشروع 2 / Project 2',
    unit: 'B202',
    issueType: 'كهرباء / Electricity',
    status: 'in-progress',
    date: '2024-06-02',
    assigned: 'أحمد العتيبي / Ahmed Al-Otaibi',
    client: 'فاطمة الحربي / Fatima Al-Harbi',
    description: 'انقطاع كهرباء متكرر. / Frequent power outage.',
    files: [],
    preferredTime: '',
    notes: '',
    report: '',
    cost: '',
    materials: '',
  },
];

const statusOptions = [
  { value: 'new', label: { ar: 'جديد', en: 'New' } },
  { value: 'in-progress', label: { ar: 'جاري التنفيذ', en: 'In Progress' } },
  { value: 'completed', label: { ar: 'تم الإنجاز', en: 'Completed' } },
  { value: 'rejected', label: { ar: 'مرفوض', en: 'Rejected' } },
];

const assignedOptions = [
  { value: 'unassigned', label: { ar: 'غير محدد', en: 'Unassigned' } },
  { value: 'فاطمة الحربي / Fatima Al-Harbi', label: { ar: 'فاطمة الحربي', en: 'Fatima Al-Harbi' } },
  { value: 'أحمد العتيبي / Ahmed Al-Otaibi', label: { ar: 'أحمد العتيبي', en: 'Ahmed Al-Otaibi' } },
];

export default function MaintenanceRequestDetailPage() {
  const { language } = useDirection();
  const params = useParams();
  const router = useRouter();
  const request = mockRequests.find(r => r.id === params.requestId) || mockRequests[0];

  const [status, setStatus] = useState(request.status);
  const [assigned, setAssigned] = useState(request.assigned);
  const [notes, setNotes] = useState(request.notes);
  const [report, setReport] = useState(request.report);
  const [cost, setCost] = useState(request.cost);
  const [materials, setMaterials] = useState(request.materials);

  return (
    <PageWrapper>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-elegant-white">
          {language === 'ar' ? 'تفاصيل طلب الصيانة' : 'Maintenance Request Details'}
        </h1>
        <Button variant="outline" onClick={() => router.push('/dashboard/maintenance-tasks')}>
          {language === 'ar' ? 'العودة' : 'Back'}
        </Button>
      </div>
      <div className="bg-obsidian/50 backdrop-blur-sm rounded-xl p-6 border border-desert-gold/20 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="mb-2 text-stone-gray text-sm font-medium">
              {language === 'ar' ? 'رقم الطلب' : 'Request ID'}
            </div>
            <div className="text-elegant-white font-bold mb-4">{request.id}</div>
            <div className="mb-2 text-stone-gray text-sm font-medium">
              {language === 'ar' ? 'العميل' : 'Client'}
            </div>
            <div className="text-elegant-white mb-4">{request.client}</div>
            <div className="mb-2 text-stone-gray text-sm font-medium">
              {language === 'ar' ? 'المشروع' : 'Project'}
            </div>
            <div className="text-elegant-white mb-4">{request.project}</div>
            <div className="mb-2 text-stone-gray text-sm font-medium">
              {language === 'ar' ? 'الوحدة' : 'Unit'}
            </div>
            <div className="text-elegant-white mb-4">{request.unit}</div>
            <div className="mb-2 text-stone-gray text-sm font-medium">
              {language === 'ar' ? 'نوع المشكلة' : 'Issue Type'}
            </div>
            <div className="text-elegant-white mb-4">{request.issueType}</div>
            <div className="mb-2 text-stone-gray text-sm font-medium">
              {language === 'ar' ? 'الوصف' : 'Description'}
            </div>
            <div className="text-elegant-white mb-4">{request.description}</div>
            <div className="mb-2 text-stone-gray text-sm font-medium">
              {language === 'ar' ? 'الملفات المرفقة' : 'Uploaded Files'}
            </div>
            <div className="text-elegant-white mb-4">{request.files.length ? '[ملفات]' : language === 'ar' ? 'لا يوجد' : 'None'}</div>
            <div className="mb-2 text-stone-gray text-sm font-medium">
              {language === 'ar' ? 'الوقت المفضل للزيارة' : 'Preferred Visit Time'}
            </div>
            <div className="text-elegant-white mb-4">{request.preferredTime || (language === 'ar' ? 'غير محدد' : 'Not specified')}</div>
          </div>
          <div>
            <div className="mb-2 text-stone-gray text-sm font-medium">
              {language === 'ar' ? 'الحالة الحالية' : 'Current Status'}
            </div>
            <SelectContext
              options={statusOptions}
              value={status}
              onChange={setStatus}
              placeholder={language === 'ar' ? 'اختر الحالة' : 'Select Status'}
              language={language}
            />
            <div className="mb-2 text-stone-gray text-sm font-medium">
              {language === 'ar' ? 'الموظف المسؤول' : 'Assigned Employee'}
            </div>
            <SelectContext
              options={assignedOptions}
              value={assigned}
              onChange={setAssigned}
              placeholder={language === 'ar' ? 'اختر الموظف' : 'Select Employee'}
              language={language}
            />
            <FormField label={language === 'ar' ? 'ملاحظات داخلية' : 'Internal Notes'}>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                className="w-full bg-stone-gray/10 border border-desert-gold/20 rounded-lg px-4 py-2 text-elegant-white mb-4 focus:outline-none focus:border-desert-gold transition-colors duration-300"
                rows={3}
              />
            </FormField>
            <FormField label={language === 'ar' ? 'تقرير التنفيذ' : 'Execution Report'}>
              <textarea
                value={report}
                onChange={e => setReport(e.target.value)}
                className="w-full bg-stone-gray/10 border border-desert-gold/20 rounded-lg px-4 py-2 text-elegant-white mb-4 focus:outline-none focus:border-desert-gold transition-colors duration-300"
                rows={3}
              />
            </FormField>
            <FormField label={language === 'ar' ? 'التكلفة (اختياري)' : 'Cost (Optional)'}>
              <input
                type="text"
                value={cost}
                onChange={e => setCost(e.target.value)}
                className="w-full bg-stone-gray/10 border border-desert-gold/20 rounded-lg px-4 py-2 text-elegant-white mb-4 focus:outline-none focus:border-desert-gold transition-colors duration-300"
              />
            </FormField>
            <FormField label={language === 'ar' ? 'المواد المستخدمة (اختياري)' : 'Materials Used (Optional)'}>
              <input
                type="text"
                value={materials}
                onChange={e => setMaterials(e.target.value)}
                className="w-full bg-stone-gray/10 border border-desert-gold/20 rounded-lg px-4 py-2 text-elegant-white mb-4 focus:outline-none focus:border-desert-gold transition-colors duration-300"
              />
            </FormField>
            <div className="flex gap-4 mt-4">
              <Button variant="default">
                {language === 'ar' ? 'حفظ التغييرات' : 'Save Changes'}
              </Button>
              <Button variant="outline">
                {language === 'ar' ? 'تصدير PDF' : 'Export PDF'}
              </Button>
              <Button variant="outline">
                {language === 'ar' ? 'تصدير Excel' : 'Export Excel'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
} 