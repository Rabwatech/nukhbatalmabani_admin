'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X, ChevronRight, ChevronLeft, Building2, Home,
    MapPin, DollarSign, Tag, AlertCircle, CheckCircle
} from 'lucide-react';
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
import { Project, Building, UnitModel, DiscountCode } from '@/lib/types';

interface BookingWizardProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: any) => void;
    projects?: Project[]; // Mock data passed in
}

// Mock Data for Hierarchy (Ideally passed via props or context)
const MOCK_BUILDINGS = [
    { id: 'b1', nameAr: 'مبنى 101', number: '101', projectId: 'p1' },
    { id: 'b2', nameAr: 'مبنى 102', number: '102', projectId: 'p1' },
];

const MOCK_MODELS = [
    { id: 'm1', name: 'نموذج A (شقة)', type: 'retail', basePrice: 850000, buildingId: 'b1' },
    { id: 'm2', name: 'نموذج B (دوبلكس)', type: 'repetitive', basePrice: 1200000, buildingId: 'b1' },
];

const MOCK_UNITS = [
    { id: 'u1', code: 'A-101', modelId: 'm1', floor: '1' },
    { id: 'u2', code: 'A-102', modelId: 'm1', floor: '1' },
    { id: 'u3', code: 'B-201', modelId: 'm2', floor: '2' },
];

const MOCK_DISCOUNTS: DiscountCode[] = [
    { id: 'd1', code: 'SUMMER24', type: 'percentage', value: 5, category: 'seasonal', validUntil: '2024-06-30', isActive: true, usedCount: 0 },
    { id: 'd2', code: 'VIPCLIENT', type: 'fixed_amount', value: 20000, category: 'marketing', validUntil: '2024-12-31', isActive: true, usedCount: 0 },
];

const steps = [
    { id: 'unit', label: { ar: 'اختيار الوحدة', en: 'Select Unit' } },
    { id: 'pricing', label: { ar: 'السعر والخصم', en: 'Pricing & Discount' } },
    { id: 'customer', label: { ar: 'بيانات العميل', en: 'Customer Info' } },
    { id: 'review', label: { ar: 'مراجعة وتأكيد', en: 'Review & Confirm' } },
];

export default function BookingWizard({ isOpen, onClose, onSubmit }: BookingWizardProps) {
    const { language, direction } = useDirection();
    const [currentStep, setCurrentStep] = useState(0);

    // Selection State
    const [selectedProject, setSelectedProject] = useState<string>('');
    const [selectedBuilding, setSelectedBuilding] = useState<string>('');
    const [selectedModel, setSelectedModel] = useState<string>('');
    const [selectedUnit, setSelectedUnit] = useState<string>('');

    // Pricing State
    const [basePrice, setBasePrice] = useState<number>(0);
    const [finalPrice, setFinalPrice] = useState<number>(0);
    const [discountCode, setDiscountCode] = useState<string>('');
    const [appliedDiscount, setAppliedDiscount] = useState<DiscountCode | null>(null);
    const [priceError, setPriceError] = useState<string>('');
    const [discountError, setDiscountError] = useState<string>('');

    // Customer State
    const [selectedCustomer, setSelectedCustomer] = useState<string>('');
    const [paymentPlan, setPaymentPlan] = useState<string>('cash');

    // Reset when closed
    useEffect(() => {
        if (!isOpen) {
            setCurrentStep(0);
            setSelectedProject('');
            setSelectedBuilding('');
            setSelectedModel('');
            setSelectedUnit('');
            setDiscountCode('');
            setAppliedDiscount(null);
        }
    }, [isOpen]);

    // Update logic when model is selected
    useEffect(() => {
        if (selectedModel) {
            const model = MOCK_MODELS.find(m => m.id === selectedModel);
            if (model) {
                setBasePrice(model.basePrice);
                setFinalPrice(model.basePrice);
            }
        }
    }, [selectedModel]);

    // Pricing Validation & Calculation
    const validatePrice = (price: number) => {
        if (price < basePrice && !appliedDiscount) { // Allow lower if discount applied? Usually base is fixed.
            // Actually usually manual override needs permission. For now just warn.
            return true;
        }
        return true;
    };

    const handleApplyDiscount = () => {
        setDiscountError('');
        const code = MOCK_DISCOUNTS.find(d => d.code === discountCode && d.isActive);

        if (!code) {
            setDiscountError(language === 'ar' ? 'كود غير صالح' : 'Invalid Code');
            setAppliedDiscount(null);
            setFinalPrice(basePrice);
            return;
        }

        let newPrice = basePrice;
        if (code.type === 'percentage') {
            newPrice = basePrice - (basePrice * (code.value / 100));
        } else {
            newPrice = basePrice - code.value;
        }

        // Ensure price doesn't go below a certain threshold logic if needed
        setAppliedDiscount(code);
        setFinalPrice(newPrice);
    };

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(prev => prev + 1);
        } else {
            // Submit
            onSubmit({
                unitId: selectedUnit,
                customerId: selectedCustomer,
                finalPrice,
                discountCode: appliedDiscount?.code,
                paymentPlan
            });
            onClose();
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-deep-black/80 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-obsidian border border-desert-gold/20 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl"
            >
                {/* Header */}
                <div className="p-6 border-b border-desert-gold/10 flex justify-between items-center bg-stone-gray/5">
                    <div>
                        <h2 className="text-2xl font-bold text-elegant-white">
                            {language === 'ar' ? 'حجز وحدة جديدة' : 'New Unit Booking'}
                        </h2>
                        <p className="text-stone-gray text-sm mt-1">
                            {language === 'ar' ? 'اتبع الخطوات لإتمام عملية الحجز' : 'Follow steps to complete booking'}
                        </p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-stone-gray transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Progress Bar */}
                <div className="px-6 pt-6 pb-2">
                    <div className="flex justify-between relative">
                        <div className="absolute top-1/2 left-0 right-0 h-1 bg-stone-gray/20 -z-0" />
                        <div
                            className="absolute top-1/2 left-0 h-1 bg-desert-gold transition-all duration-300 -z-0"
                            style={{ width: `${(currentStep / (steps.length - 1)) * 100}%`, right: direction === 'rtl' ? 0 : 'auto', left: direction === 'rtl' ? 'auto' : 0 }}
                        />

                        {steps.map((step, index) => (
                            <div key={step.id} className="relative z-10 flex flex-col items-center">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${index <= currentStep
                                    ? 'bg-desert-gold border-desert-gold text-deep-black font-bold shadow-[0_0_15px_rgba(196,157,47,0.3)]'
                                    : 'bg-obsidian border-stone-gray/50 text-stone-gray'
                                    }`}>
                                    {index + 1}
                                </div>
                                <span className={`text-xs mt-2 font-medium ${index <= currentStep ? 'text-desert-gold' : 'text-stone-gray'
                                    }`}>
                                    {language === 'ar' ? step.label.ar : step.label.en}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Content Body */}
                <div className="p-8 flex-1 overflow-y-auto custom-scrollbar">
                    <AnimatePresence mode="wait">
                        {currentStep === 0 && (
                            <motion.div
                                key="step0"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FormField label={language === 'ar' ? 'المشروع' : 'Project'} required>
                                        <Select onValueChange={setSelectedProject} value={selectedProject}>
                                            <SelectTrigger className="bg-stone-gray/10 border-desert-gold/20 text-elegant-white h-12">
                                                <SelectValue placeholder={language === 'ar' ? 'اختر المشروع' : 'Select Project'} />
                                            </SelectTrigger>
                                            <SelectContent className="bg-obsidian border-desert-gold/20 text-elegant-white">
                                                <SelectItem value="p1">{language === 'ar' ? 'قرية الهدوء' : 'Tranquil Village'}</SelectItem>
                                                <SelectItem value="p2">{language === 'ar' ? 'برج التجارة' : 'Trade Tower'}</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormField>

                                    <FormField label={language === 'ar' ? 'المبنى / البلوك' : 'Building / Block'} required>
                                        <Select onValueChange={setSelectedBuilding} value={selectedBuilding} disabled={!selectedProject}>
                                            <SelectTrigger className="bg-stone-gray/10 border-desert-gold/20 text-elegant-white h-12">
                                                <SelectValue placeholder={language === 'ar' ? 'اختر المبنى' : 'Select Building'} />
                                            </SelectTrigger>
                                            <SelectContent className="bg-obsidian border-desert-gold/20 text-elegant-white">
                                                {MOCK_BUILDINGS.filter(b => b.projectId === selectedProject).map(b => (
                                                    <SelectItem key={b.id} value={b.id}>{language === 'ar' ? b.nameAr : b.number}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FormField>

                                    <FormField label={language === 'ar' ? 'النموذج' : 'Model'} required>
                                        <Select onValueChange={setSelectedModel} value={selectedModel} disabled={!selectedBuilding}>
                                            <SelectTrigger className="bg-stone-gray/10 border-desert-gold/20 text-elegant-white h-12">
                                                <SelectValue placeholder={language === 'ar' ? 'اختر النموذج' : 'Select Model'} />
                                            </SelectTrigger>
                                            <SelectContent className="bg-obsidian border-desert-gold/20 text-elegant-white">
                                                {MOCK_MODELS.filter(m => m.buildingId === selectedBuilding).map(m => (
                                                    <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FormField>

                                    <FormField label={language === 'ar' ? 'رقم الوحدة' : 'Unit Number'} required>
                                        <Select onValueChange={setSelectedUnit} value={selectedUnit} disabled={!selectedModel}>
                                            <SelectTrigger className="bg-stone-gray/10 border-desert-gold/20 text-elegant-white h-12">
                                                <SelectValue placeholder={language === 'ar' ? 'اختر الوحدة' : 'Select Unit'} />
                                            </SelectTrigger>
                                            <SelectContent className="bg-obsidian border-desert-gold/20 text-elegant-white">
                                                {MOCK_UNITS.filter(u => u.modelId === selectedModel).map(u => (
                                                    <SelectItem key={u.id} value={u.id}>{u.code}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FormField>
                                </div>

                                {selectedUnit && (
                                    <div className="p-4 bg-desert-gold/10 border border-desert-gold/30 rounded-xl flex items-center gap-4">
                                        <div className="p-3 bg-desert-gold/20 rounded-full text-desert-gold">
                                            <CheckCircle className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-desert-gold">{language === 'ar' ? 'الوحدة متاحة' : 'Unit Available'}</h4>
                                            <p className="text-sm text-stone-gray">{language === 'ar' ? 'يمكنك المتابعة لخطوة التسعير' : 'You can proceed to pricing'}</p>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        )}

                        {currentStep === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-8"
                            >
                                {/* Price Display */}
                                <div className="bg-stone-gray/5 rounded-2xl p-6 border border-desert-gold/10">
                                    <div className="flex justify-between items-center mb-6">
                                        <span className="text-stone-gray font-medium">{language === 'ar' ? 'السعر الأساسي' : 'Base Price'}</span>
                                        <span className="text-2xl font-bold text-elegant-white">{basePrice.toLocaleString()} {language === 'ar' ? 'ريال' : 'SAR'}</span>
                                    </div>

                                    <div className="flex gap-4 items-end mb-4">
                                        <div className="flex-1">
                                            <FormField label={language === 'ar' ? 'كود الخصم / القسيمة' : 'Discount Code / Voucher'}>
                                                <div className="relative">
                                                    <Tag className="absolute top-1/2 -translate-y-1/2 left-3 rtl:right-3 rtl:left-auto w-4 h-4 text-stone-gray" />
                                                    <input
                                                        type="text"
                                                        value={discountCode}
                                                        onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
                                                        className="w-full bg-stone-gray/10 border border-desert-gold/20 rounded-lg pl-10 rtl:pr-10 rtl:pl-4 py-3 text-elegant-white focus:outline-none focus:border-desert-gold transition-colors text-left rtl:text-right uppercase"
                                                        placeholder="CODE"
                                                    />
                                                </div>
                                            </FormField>
                                            {discountError && <p className="text-red-400 text-xs mt-1">{discountError}</p>}
                                        </div>
                                        <Button
                                            onClick={handleApplyDiscount}
                                            className="bg-desert-gold text-deep-black px-6 py-3 h-[50px] rounded-lg hover:bg-warm-sand"
                                        >
                                            {language === 'ar' ? 'تطبيق' : 'Apply'}
                                        </Button>
                                    </div>

                                    {appliedDiscount && (
                                        <div className="bg-green-500/10 border border-green-500/30 p-3 rounded-lg flex justify-between items-center mb-4">
                                            <span className="text-green-400 text-sm">
                                                {language === 'ar' ? `تم تطبيق كود خصم: ${appliedDiscount.code}` : `Discount applied: ${appliedDiscount.code}`}
                                            </span>
                                            <span className="text-green-400 font-bold">
                                                -{appliedDiscount.type === 'percentage' ? `${appliedDiscount.value}%` : appliedDiscount.value.toLocaleString()}
                                            </span>
                                        </div>
                                    )}

                                    <div className="h-px bg-desert-gold/20 my-4" />

                                    <div className="flex justify-between items-center">
                                        <span className="text-lg text-elegant-white font-bold">{language === 'ar' ? 'السعر النهائي' : 'Final Price'}</span>
                                        <span className="text-3xl font-bold text-desert-gold">{finalPrice.toLocaleString()} <span className="text-sm font-normal text-stone-gray">SAR</span></span>
                                    </div>
                                </div>

                                {finalPrice < basePrice && !appliedDiscount && (
                                    <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl flex items-center gap-4">
                                        <AlertCircle className="w-6 h-6 text-yellow-500" />
                                        <p className="text-sm text-yellow-500">
                                            {language === 'ar'
                                                ? 'تنبيه: السعر أقل من السعر الأساسي. سيتطلب هذا الحجز موافقة إدارية.'
                                                : 'Warning: Price is below base price. This booking will require admin approval.'}
                                        </p>
                                    </div>
                                )}
                            </motion.div>
                        )}

                        {currentStep === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <FormField label={language === 'ar' ? 'العميل' : 'Customer'} required>
                                    <Select onValueChange={setSelectedCustomer} value={selectedCustomer}>
                                        <SelectTrigger className="bg-stone-gray/10 border-desert-gold/20 text-elegant-white h-12">
                                            <SelectValue placeholder={language === 'ar' ? 'اختر العميل' : 'Select Customer'} />
                                        </SelectTrigger>
                                        <SelectContent className="bg-obsidian border-desert-gold/20 text-elegant-white">
                                            <SelectItem value="c1">{language === 'ar' ? 'أحمد العتيبي' : 'Ahmed Al-Otaibi'}</SelectItem>
                                            <SelectItem value="c2">{language === 'ar' ? 'فاطمة الحربي' : 'Fatima Al-Harbi'}</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </FormField>

                                <FormField label={language === 'ar' ? 'خطة الدفع' : 'Payment Plan'} required>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div
                                            onClick={() => setPaymentPlan('cash')}
                                            className={`cursor-pointer rounded-xl p-4 border-2 transition-all ${paymentPlan === 'cash' ? 'border-desert-gold bg-desert-gold/10' : 'border-stone-gray/20 hover:border-desert-gold/50'}`}
                                        >
                                            <div className="font-bold text-elegant-white mb-1">{language === 'ar' ? 'دفع كامل (كاش)' : 'Full Payment (Cash)'}</div>
                                            <div className="text-xs text-stone-gray">{language === 'ar' ? 'دفعة واحدة' : 'One-time payment'}</div>
                                        </div>
                                        <div
                                            onClick={() => setPaymentPlan('installments')}
                                            className={`cursor-pointer rounded-xl p-4 border-2 transition-all ${paymentPlan === 'installments' ? 'border-desert-gold bg-desert-gold/10' : 'border-stone-gray/20 hover:border-desert-gold/50'}`}
                                        >
                                            <div className="font-bold text-elegant-white mb-1">{language === 'ar' ? 'أقساط' : 'Installments'}</div>
                                            <div className="text-xs text-stone-gray">{language === 'ar' ? 'دفعات مجدولة' : 'Scheduled payments'}</div>
                                        </div>
                                    </div>
                                </FormField>
                            </motion.div>
                        )}

                        {currentStep === 3 && (
                            <motion.div
                                key="step3"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6 text-center"
                            >
                                <div className="bg-stone-gray/5 rounded-2xl p-8 border border-desert-gold/20 inline-block w-full max-w-sm mx-auto">
                                    <CheckCircle className="w-16 h-16 text-desert-gold mx-auto mb-4" />
                                    <h3 className="text-xl font-bold text-elegant-white mb-2">
                                        {language === 'ar' ? 'جاهز للإرسال' : 'Ready to Submit'}
                                    </h3>
                                    <p className="text-stone-gray mb-6">
                                        {language === 'ar' ? 'سيتم إنشاء الحجز وإرسال العرض للعميل' : 'Booking will be created and quote sent to customer'}
                                    </p>

                                    <div className="text-right rtl:text-left space-y-2 text-sm bg-black/20 p-4 rounded-lg">
                                        <div className="flex justify-between">
                                            <span className="text-stone-gray">{language === 'ar' ? 'الوحدة:' : 'Unit:'}</span>
                                            <span className="text-elegant-white">A-101</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-stone-gray">{language === 'ar' ? 'العميل:' : 'Customer:'}</span>
                                            <span className="text-elegant-white">Ahmed Al-Otaibi</span>
                                        </div>
                                        <div className="flex justify-between font-bold text-desert-gold pt-2 border-t border-white/10">
                                            <span>{language === 'ar' ? 'الإجمالي:' : 'Total:'}</span>
                                            <span>{finalPrice.toLocaleString()} SAR</span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Footer Navigation */}
                <div className="p-6 border-t border-desert-gold/10 bg-stone-gray/5 flex justify-between">
                    <Button
                        onClick={handleBack}
                        className={`bg-transparent text-stone-gray border border-stone-gray/30 hover:bg-stone-gray/10 hover:text-elegant-white ${currentStep === 0 ? 'invisible' : ''}`}
                    >
                        {language === 'ar' ? 'السابق' : 'Back'}
                    </Button>

                    <Button
                        onClick={handleNext}
                        className="bg-desert-gold text-deep-black hover:bg-warm-sand"
                    >
                        {currentStep === steps.length - 1 ? (language === 'ar' ? 'تأكيد الحجز' : 'Confirm Booking') : (language === 'ar' ? 'التالي' : 'Next')}
                    </Button>
                </div>
            </motion.div>
        </div>
    );
}
