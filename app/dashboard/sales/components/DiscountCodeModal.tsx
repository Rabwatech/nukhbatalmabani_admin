'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Tag } from 'lucide-react';
import { useDirection } from '@/context/DirectionContext';
import { Button } from '@/components/ui/button';
import FormField from '@/components/shared/FormField';
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem
} from '@/components/ui/select';
import { DiscountCode, DiscountType, DiscountCategory } from '@/lib/types';

interface DiscountCodeModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (code: Partial<DiscountCode>) => void;
    initialData?: DiscountCode;
}

export default function DiscountCodeModal({ isOpen, onClose, onSubmit, initialData }: DiscountCodeModalProps) {
    const { language } = useDirection();

    const [code, setCode] = useState(initialData?.code || '');
    const [type, setType] = useState<DiscountType>(initialData?.type || 'percentage');
    const [value, setValue] = useState<string>(initialData?.value?.toString() || '');
    const [category, setCategory] = useState<DiscountCategory>(initialData?.category || 'marketing');
    const [validUntil, setValidUntil] = useState(initialData?.validUntil || '');
    const [usageLimit, setUsageLimit] = useState<string>(initialData?.usageLimit?.toString() || '');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({
            code: code.toUpperCase(),
            type,
            value: parseFloat(value),
            category,
            validUntil,
            usageLimit: usageLimit ? parseInt(usageLimit) : undefined,
            isActive: true,
            usedCount: initialData?.usedCount || 0
        });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-deep-black/80 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-obsidian border border-desert-gold/20 rounded-2xl w-full max-w-lg overflow-hidden flex flex-col shadow-2xl"
            >
                <div className="p-6 border-b border-desert-gold/10 flex justify-between items-center bg-stone-gray/5">
                    <h2 className="text-xl font-bold text-elegant-white">
                        {initialData
                            ? (language === 'ar' ? 'تعديل كود خصم' : 'Edit Discount Code')
                            : (language === 'ar' ? 'إضافة كود خصم جديد' : 'New Discount Code')
                        }
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-stone-gray transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <FormField label={language === 'ar' ? 'الكود' : 'Code'} required>
                        <div className="relative">
                            <Tag className="absolute top-1/2 -translate-y-1/2 left-3 rtl:right-3 rtl:left-auto w-4 h-4 text-stone-gray" />
                            <input
                                type="text"
                                value={code}
                                onChange={(e) => setCode(e.target.value.toUpperCase())}
                                className="w-full bg-stone-gray/10 border border-desert-gold/20 rounded-lg pl-10 rtl:pr-10 rtl:pl-4 py-3 text-elegant-white focus:outline-none focus:border-desert-gold transition-colors text-left rtl:text-right uppercase font-mono"
                                placeholder="SUMMER2024"
                                required
                            />
                        </div>
                    </FormField>

                    <div className="grid grid-cols-2 gap-4">
                        <FormField label={language === 'ar' ? 'النوع' : 'Type'} required>
                            <Select onValueChange={(v) => setType(v as DiscountType)} value={type}>
                                <SelectTrigger className="bg-stone-gray/10 border-desert-gold/20 text-elegant-white h-12">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-obsidian border-desert-gold/20 text-elegant-white">
                                    <SelectItem value="percentage">{language === 'ar' ? 'نسبة مئوية (%)' : 'Percentage (%)'}</SelectItem>
                                    <SelectItem value="fixed_amount">{language === 'ar' ? 'مبلغ ثابت' : 'Fixed Amount'}</SelectItem>
                                </SelectContent>
                            </Select>
                        </FormField>

                        <FormField label={language === 'ar' ? 'القيمة' : 'Value'} required>
                            <input
                                type="number"
                                value={value}
                                onChange={(e) => setValue(e.target.value)}
                                className="w-full bg-stone-gray/10 border border-desert-gold/20 rounded-lg px-4 py-3 text-elegant-white focus:outline-none focus:border-desert-gold transition-colors"
                                placeholder="10"
                                required
                                min="0"
                            />
                        </FormField>
                    </div>

                    <FormField label={language === 'ar' ? 'الفئة' : 'Category'} required>
                        <Select onValueChange={(v) => setCategory(v as DiscountCategory)} value={category}>
                            <SelectTrigger className="bg-stone-gray/10 border-desert-gold/20 text-elegant-white h-12">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-obsidian border-desert-gold/20 text-elegant-white">
                                <SelectItem value="marketing">{language === 'ar' ? 'تسويق' : 'Marketing'}</SelectItem>
                                <SelectItem value="employee">{language === 'ar' ? 'موظفين' : 'Employee'}</SelectItem>
                                <SelectItem value="admin">{language === 'ar' ? 'إداري' : 'Administrative'}</SelectItem>
                                <SelectItem value="seasonal">{language === 'ar' ? 'موسمي' : 'Seasonal'}</SelectItem>
                            </SelectContent>
                        </Select>
                    </FormField>

                    <div className="grid grid-cols-2 gap-4">
                        <FormField label={language === 'ar' ? 'صالح حتى' : 'Valid Until'} required>
                            <input
                                type="date"
                                value={validUntil}
                                onChange={(e) => setValidUntil(e.target.value)}
                                className="w-full bg-stone-gray/10 border border-desert-gold/20 rounded-lg px-4 py-3 text-elegant-white focus:outline-none focus:border-desert-gold transition-colors"
                                required
                            />
                        </FormField>

                        <FormField label={language === 'ar' ? 'حد الاستخدام (اختياري)' : 'Usage Limit (Optional)'}>
                            <input
                                type="number"
                                value={usageLimit}
                                onChange={(e) => setUsageLimit(e.target.value)}
                                className="w-full bg-stone-gray/10 border border-desert-gold/20 rounded-lg px-4 py-3 text-elegant-white focus:outline-none focus:border-desert-gold transition-colors"
                                placeholder="Unlimited"
                            />
                        </FormField>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <Button type="button" onClick={onClose} className="bg-transparent border border-stone-gray/30 text-stone-gray hover:bg-stone-gray/10">
                            {language === 'ar' ? 'إلغاء' : 'Cancel'}
                        </Button>
                        <Button type="submit" className="bg-desert-gold text-deep-black hover:bg-warm-sand flex items-center gap-2">
                            <Save className="w-4 h-4" />
                            {language === 'ar' ? 'حفظ' : 'Save'}
                        </Button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}
