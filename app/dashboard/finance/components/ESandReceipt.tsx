'use client';

import { motion } from 'framer-motion';
import { X, CheckCircle, Download, Share2, FileText, BadgeCheck } from 'lucide-react';
import { useDirection } from '@/context/DirectionContext';
import { Button } from '@/components/ui/button';

interface ESandReceiptProps {
    isOpen: boolean;
    onClose: () => void;
    paymentData: any;
}

export default function ESandReceipt({ isOpen, onClose, paymentData }: ESandReceiptProps) {
    const { language, direction } = useDirection();

    if (!isOpen || !paymentData) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-deep-black/90 backdrop-blur-md">
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative bg-white text-black w-full max-w-2xl rounded-sm shadow-2xl overflow-hidden"
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 p-2 bg-black/5 hover:bg-black/10 rounded-full transition-colors"
                >
                    <X className="w-5 h-5 text-black" />
                </button>

                {/* A4 Paper Simulation */}
                <div className="aspect-[1/1.414] w-full bg-white p-12 flex flex-col relative overflow-y-auto max-h-[85vh] custom-scrollbar">

                    {/* Watermark */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none">
                        <BadgeCheck className="w-96 h-96" />
                    </div>

                    {/* Header */}
                    <div className="border-b-2 border-black pb-6 mb-8 flex justify-between items-start">
                        <div>
                            <h1 className="text-3xl font-bold mb-2">{language === 'ar' ? 'سند قبض إلكتروني' : 'Electronic Receipt'}</h1>
                            <p className="text-sm font-mono text-gray-500">REF: {paymentData.id?.toUpperCase() || 'PAY-001'}</p>
                            <div className="mt-2 inline-flex items-center px-2 py-0.5 rounded border border-green-600 bg-green-50 text-green-700 text-xs font-bold">
                                <CheckCircle className="w-3 h-3 mr-1" /> {language === 'ar' ? 'معتمد' : 'VERIFIED'}
                            </div>
                        </div>
                        <div className="text-right">
                            <h2 className="text-xl font-bold text-gray-800">{language === 'ar' ? 'نخبة المباني' : 'Nukhbat Almabani'}</h2>
                            <p className="text-xs text-gray-500 max-w-[150px] leading-relaxed mt-1">
                                {language === 'ar' ? 'الرياض، المملكة العربية السعودية' : 'Riyadh, Kingdom of Saudi Arabia'} <br />
                                {language === 'ar' ? 'سجل تجاري: 1010123456' : 'CR: 1010123456'}
                            </p>
                        </div>
                    </div>

                    {/* Body */}
                    <div className="flex-1 space-y-8">

                        <div className="grid grid-cols-2 gap-8">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">{language === 'ar' ? 'استلمنا من' : 'Received From'}</label>
                                <p className="text-lg font-bold border-b border-gray-100 pb-1">{paymentData.customer}</p>
                            </div>
                            <div className="space-y-1 text-right rtl:text-left">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">{language === 'ar' ? 'التاريخ' : 'Date'}</label>
                                <p className="text-lg font-medium border-b border-gray-100 pb-1">{paymentData.date}</p>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">{language === 'ar' ? 'مبلـغ وقدره' : 'Amount'}</label>
                            <div className="flex items-baseline gap-2 bg-gray-50 p-4 rounded-lg border border-gray-100">
                                <span className="text-4xl font-bold text-black">{paymentData.amount?.toLocaleString()}</span>
                                <span className="text-sm font-medium text-gray-500">{language === 'ar' ? 'ريال سعودي' : 'SAR'}</span>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">{language === 'ar' ? 'وذلك عن' : 'For'}</label>
                            <p className="text-base text-gray-800 leading-relaxed border-b border-gray-100 pb-2">
                                {language === 'ar' ? `دفعة ${getTypeLabelAR(paymentData.type)} - وحدة رقم ${paymentData.unit}` : `${getTypeLabelEN(paymentData.type)} Payment - Unit ${paymentData.unit}`}
                            </p>
                        </div>

                        <div className="flex justify-between items-center py-4 border-t border-b border-gray-100">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">{language === 'ar' ? 'طريقة الدفع' : 'Payment Method'}</label>
                                <div className="flex items-center gap-2">
                                    <span className="font-medium text-black uppercase">{paymentData.method?.replace('_', ' ')}</span>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">{language === 'ar' ? 'المستلم' : 'Receiver'}</label>
                                <div className="font-medium text-black">{language === 'ar' ? 'الإدارة المالية' : 'Finance Dept.'}</div>
                            </div>
                        </div>

                    </div>

                    {/* Footer / Seal */}
                    <div className="mt-12 flex justify-between items-end">
                        <div className="text-xs text-gray-400 max-w-[200px]">
                            {language === 'ar' ? 'هذا السند إلكتروني ومعتمد ولا يحتاج إلى توقيع يدوي.' : 'This receipt is electronically generated and does not require a manual signature.'}
                            <div className="mt-1 font-mono">{new Date().toISOString()}</div>
                        </div>

                        <div className="relative">
                            <div className="w-24 h-24 rounded-full border-4 border-desert-gold/30 flex items-center justify-center p-1 rotate-[-15deg] opacity-80 mix-blend-multiply">
                                <div className="w-full h-full rounded-full border-2 border-desert-gold flex items-center justify-center flex-col text-[10px] font-bold text-desert-gold text-center leading-tight">
                                    <span>NUKHBAT</span>
                                    <span>ALMABANI</span>
                                    <span className="text-[8px] font-normal mt-0.5">Finance Dept.</span>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Actions */}
                <div className="bg-gray-50 p-4 border-t flex justify-end gap-3">
                    <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-white">
                        <Share2 className="w-4 h-4 mr-2" />
                        {language === 'ar' ? 'مشاركة (واتساب)' : 'Share'}
                    </Button>
                    <Button className="bg-desert-gold text-deep-black hover:bg-warm-sand">
                        <Download className="w-4 h-4 mr-2" />
                        {language === 'ar' ? 'تحميل PDF' : 'Download PDF'}
                    </Button>
                </div>
            </motion.div>
        </div>
    );
}

function getTypeLabelAR(type: string) {
    const map: any = {
        booking_deposit: 'حجز',
        installment: 'قسط',
        full_payment: 'كامل',
        maintenance: 'صيانة'
    };
    return map[type] || type;
}

function getTypeLabelEN(type: string) {
    const map: any = {
        booking_deposit: 'Booking',
        installment: 'Installment',
        full_payment: 'Full',
        maintenance: 'Maintenance'
    };
    return map[type] || type;
}
