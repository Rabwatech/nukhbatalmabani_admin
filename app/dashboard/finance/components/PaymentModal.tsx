'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, DollarSign, CreditCard, Landmark, Upload, CheckCircle, FileText, AlertCircle } from 'lucide-react';
import { useDirection } from '@/context/DirectionContext';
import { Button } from '@/components/ui/button';
import FormField from '@/components/shared/FormField';
import Modal from '@/components/shared/Modal';

interface PaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: any) => void;
    initialAmount?: number;
    initialCustomer?: string;
}

export default function PaymentModal({ isOpen, onClose, onSubmit, initialAmount = 0, initialCustomer = '' }: PaymentModalProps) {
    const { language } = useDirection();
    const [method, setMethod] = useState<'cash' | 'mada' | 'bank_transfer'>('bank_transfer');
    const [amount, setAmount] = useState<number>(initialAmount);
    const [receiptFile, setReceiptFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setReceiptFile(e.target.files[0]);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({
            method,
            amount,
            receipt: receiptFile,
            date: new Date().toISOString()
        });
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={language === 'ar' ? 'تسجيل دفعة جديدة' : 'Record New Payment'}
            size="lg"
        >
            <form onSubmit={handleSubmit} className="space-y-6">

                {/* Amount & Customer Info - Read Only for now or pre-filled */}
                <div className="flex gap-4 p-4 bg-stone-gray/5 rounded-xl border border-desert-gold/10">
                    <div className="flex-1">
                        <label className="text-xs text-stone-gray">{language === 'ar' ? 'العميل' : 'Customer'}</label>
                        <div className="text-elegant-white font-medium">{initialCustomer || (language === 'ar' ? 'أحمد العتيبي' : 'Ahmed Al-Otaibi')}</div>
                    </div>
                    <div className="w-px bg-desert-gold/20" />
                    <div className="flex-1">
                        <label className="text-xs text-stone-gray">{language === 'ar' ? 'المبلغ المستحق' : 'Due Amount'}</label>
                        <div className="text-desert-gold font-bold">{initialAmount > 0 ? initialAmount.toLocaleString() : '50,000'} {language === 'ar' ? 'ريال' : 'SAR'}</div>
                    </div>
                </div>

                {/* Methods */}
                <FormField label={language === 'ar' ? 'طريقة الدفع' : 'Payment Method'}>
                    <div className="grid grid-cols-3 gap-3">
                        <MethodCard
                            id="cash"
                            label={{ ar: 'نقداً', en: 'Cash' }}
                            icon={DollarSign}
                            selected={method === 'cash'}
                            onClick={() => setMethod('cash')}
                        />
                        <MethodCard
                            id="mada"
                            label={{ ar: 'مدى / بطاقة', en: 'Mada / Card' }}
                            icon={CreditCard}
                            selected={method === 'mada'}
                            onClick={() => setMethod('mada')}
                        />
                        <MethodCard
                            id="bank_transfer"
                            label={{ ar: 'تحويل بنكي', en: 'Bank Transfer' }}
                            icon={Landmark}
                            selected={method === 'bank_transfer'}
                            onClick={() => setMethod('bank_transfer')}
                        />
                    </div>
                </FormField>

                {/* Dynamic Fields based on Method */}
                <AnimatePresence mode="wait">
                    {method === 'bank_transfer' && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="space-y-4"
                        >
                            <div className="p-4 bg-obsidian border border-desert-gold/20 rounded-xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-2 opacity-10">
                                    <Landmark className="w-24 h-24 text-desert-gold" />
                                </div>
                                <h4 className="text-sm text-stone-gray mb-1">{language === 'ar' ? 'حساب الشركة (الراجحي)' : 'Company Account (Al Rajhi)'}</h4>
                                <p className="text-xl font-mono text-elegant-white tracking-wider">SA55 8000 0000 6080 1010 1234</p>
                                <p className="text-xs text-stone-gray mt-2">{language === 'ar' ? 'شركة نخبة المباني العقارية' : 'Nukhbat Almabani Real Estate Co.'}</p>
                            </div>

                            <div
                                className="border-2 border-dashed border-stone-gray/30 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:border-desert-gold/50 hover:bg-stone-gray/5 transition-all"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <input
                                    type="file"
                                    className="hidden"
                                    ref={fileInputRef}
                                    accept="image/*,.pdf"
                                    onChange={handleFileChange}
                                />
                                {receiptFile ? (
                                    <div className="flex flex-col items-center text-green-400">
                                        <CheckCircle className="w-8 h-8 mb-2" />
                                        <span className="text-sm font-medium">{receiptFile.name}</span>
                                        <span className="text-xs text-stone-gray mt-1">Click to change</span>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center text-stone-gray">
                                        <Upload className="w-8 h-8 mb-2" />
                                        <span className="text-sm font-medium">{language === 'ar' ? 'إرفاق إيصال التحويل' : 'Upload Transfer Receipt'}</span>
                                        <span className="text-xs mt-1">PDF, PNG, JPG (Max 5MB)</span>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}

                    {method === 'cash' && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="bg-yellow-500/10 border border-yellow-500/30 p-4 rounded-xl flex gap-3"
                        >
                            <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0" />
                            <p className="text-sm text-yellow-500">
                                {language === 'ar'
                                    ? 'يجب تسليم المبلغ للمحاسب المالي في مقر الشركة لإصدار السند.'
                                    : 'Amount must be handed to the financial accountant at company HQ to issue receipt.'}
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="flex justify-end pt-4">
                    <Button
                        type="submit"
                        disabled={method === 'bank_transfer' && !receiptFile}
                        className="bg-desert-gold text-deep-black px-8 py-2 rounded-lg hover:bg-warm-sand disabled:opacity-50 disabled:cursor-not-allowed font-bold"
                    >
                        {language === 'ar' ? 'تأكيد وإرسال للمراجعة' : 'Confirm & Submit for Review'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}

function MethodCard({ id, label, icon: Icon, selected, onClick }: any) {
    return (
        <div
            onClick={onClick}
            className={`
                cursor-pointer p-4 rounded-xl border-2 flex flex-col items-center justify-center gap-2 transition-all
                ${selected ? 'border-desert-gold bg-desert-gold/10 text-elegant-white' : 'border-stone-gray/20 text-stone-gray hover:border-desert-gold/50'}
            `}
        >
            <Icon className={`w-6 h-6 ${selected ? 'text-desert-gold' : 'text-stone-gray'}`} />
            <span className="text-xs font-bold text-center">{label.ar}</span>
        </div>
    );
}
