'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useDirection } from '@/context/DirectionContext';
import PageWrapper from '@/components/PageWrapper';
import StatusBadge from '@/components/shared/StatusBadge';
import { Plus, DollarSign, FileText, CheckCircle, Clock, AlertCircle, TrendingUp, Download } from 'lucide-react';
import PaymentModal from './components/PaymentModal';
import ESandReceipt from './components/ESandReceipt';

interface Payment {
    id: string;
    customer: string;
    unit: string;
    amount: number;
    date: string;
    method: 'bank_transfer' | 'cash' | 'mada';
    status: 'pending' | 'approved' | 'rejected';
    receiptUrl?: string;
    type: 'booking_deposit' | 'installment' | 'full_payment' | 'maintenance';
}

export default function FinancePage() {
    const { language } = useDirection();
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [showReceipt, setShowReceipt] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);

    // Mock Data
    const [payments, setPayments] = useState<Payment[]>([
        { id: 'pay1', customer: language === 'ar' ? 'أحمد العتيبي' : 'Ahmed Al-Otaibi', unit: 'A-101', amount: 50000, date: '2024-01-20', method: 'bank_transfer', status: 'pending', type: 'booking_deposit' },
        { id: 'pay2', customer: language === 'ar' ? 'فاطمة الحربي' : 'Fatima Al-Harbi', unit: 'B-205', amount: 15000, date: '2024-01-19', method: 'mada', status: 'approved', type: 'installment' },
        { id: 'pay3', customer: language === 'ar' ? 'خالد المطيري' : 'Khalid Al-Mutairi', unit: 'V-15', amount: 2500, date: '2024-01-18', method: 'cash', status: 'pending', type: 'maintenance' },
    ]);

    const handleCreatePayment = (data: any) => {
        const newPayment: Payment = {
            id: `pay${Date.now()}`,
            customer: language === 'ar' ? 'عميل جديد' : 'New Customer', // This would come from context/prop in real app
            unit: 'N/A',
            amount: data.amount,
            date: new Date().toISOString().split('T')[0],
            method: data.method,
            status: 'pending',
            type: 'booking_deposit'
        };
        setPayments([newPayment, ...payments]);
        // Trigger Toast here
    };

    const handleApprove = (id: string) => {
        if (confirm(language === 'ar' ? 'هل أنت متأكد من اعتماد الدفعة وإصدار السند؟' : 'Are you sure you want to approve and issue receipt?')) {
            setPayments(prev => prev.map(p => p.id === id ? { ...p, status: 'approved' } : p));
            // Automatically show receipt 
            const payment = payments.find(p => p.id === id);
            if (payment) {
                setSelectedPayment({ ...payment, status: 'approved' });
                setShowReceipt(true);
            }
        }
    };

    const handleViewReceipt = (payment: Payment) => {
        setSelectedPayment(payment);
        setShowReceipt(true);
    };

    const getStatusLabel = (status: string) => {
        const labels: Record<string, { ar: string; en: string }> = {
            pending: { ar: 'بانتظار المراجعة', en: 'Pending Review' },
            approved: { ar: 'معتمد', en: 'Approved' },
            rejected: { ar: 'مرفوض', en: 'Rejected' },
        };
        return labels[status]?.[language] || status;
    };

    const getTypeLabel = (type: string) => {
        const labels: Record<string, { ar: string; en: string }> = {
            booking_deposit: { ar: 'دفعة حجز', en: 'Booking Deposit' },
            installment: { ar: 'قسط', en: 'Installment' },
            full_payment: { ar: 'دفع كامل', en: 'Full Payment' },
            maintenance: { ar: 'صيانة', en: 'Maintenance' },
        };
        return labels[type]?.[language] || type;
    };


    return (
        <PageWrapper>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-elegant-white">
                            {language === 'ar' ? 'الإدارة المالية' : 'Financial Management'}
                        </h1>
                        <p className="text-stone-gray mt-1">
                            {language === 'ar' ? 'متابعة المدفوعات وإصدار السندات الإلكترونية' : 'Track payments and issue electronic receipts'}
                        </p>
                    </div>
                    <motion.button
                        onClick={() => setShowPaymentModal(true)}
                        className="bg-desert-gold text-deep-black px-6 py-3 rounded-lg font-medium hover:bg-warm-sand transition-all duration-300 flex items-center space-x-2 rtl:space-x-reverse"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Plus className="h-5 w-5" />
                        <span>{language === 'ar' ? 'تسجيل دفعة' : 'Record Payment'}</span>
                    </motion.button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <StatCard
                        title={language === 'ar' ? 'إجمالي التحصيلات (يناير)' : 'Total Collections (Jan)'}
                        value="1,250,000 SAR"
                        change="+15%"
                        icon={DollarSign}
                    />
                    <StatCard
                        title={language === 'ar' ? 'مدفوعات بانتظار الاعتماد' : 'Pending Approvals'}
                        value="3"
                        change="Requires Action"
                        icon={Clock}
                        isWarning
                    />
                    <StatCard
                        title={language === 'ar' ? 'السندات المصدرة' : 'Issued Receipts'}
                        value="145"
                        change="+12"
                        icon={FileText}
                    />
                </div>

                {/* Payments Table */}
                <div className="bg-obsidian/50 backdrop-blur-sm rounded-lg border border-desert-gold/20 overflow-hidden">
                    <div className="p-4 border-b border-desert-gold/10">
                        <h3 className="font-bold text-elegant-white">{language === 'ar' ? 'سجل المدفوعات الأخيرة' : 'Recent Payments Log'}</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-stone-gray/10">
                                <tr>
                                    <th className="px-6 py-3 text-left rtl:text-right text-xs font-medium text-stone-gray uppercase tracking-wider">{language === 'ar' ? 'الرقم' : 'ID'}</th>
                                    <th className="px-6 py-3 text-left rtl:text-right text-xs font-medium text-stone-gray uppercase tracking-wider">{language === 'ar' ? 'العميل' : 'Customer'}</th>
                                    <th className="px-6 py-3 text-left rtl:text-right text-xs font-medium text-stone-gray uppercase tracking-wider">{language === 'ar' ? 'النوع' : 'Type'}</th>
                                    <th className="px-6 py-3 text-left rtl:text-right text-xs font-medium text-stone-gray uppercase tracking-wider">{language === 'ar' ? 'المبلغ' : 'Amount'}</th>
                                    <th className="px-6 py-3 text-left rtl:text-right text-xs font-medium text-stone-gray uppercase tracking-wider">{language === 'ar' ? 'الطريقة' : 'Method'}</th>
                                    <th className="px-6 py-3 text-left rtl:text-right text-xs font-medium text-stone-gray uppercase tracking-wider">{language === 'ar' ? 'الحالة' : 'Status'}</th>
                                    <th className="px-6 py-3 text-left rtl:text-right text-xs font-medium text-stone-gray uppercase tracking-wider">{language === 'ar' ? 'الإجراءات' : 'Actions'}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-desert-gold/10">
                                {payments.map((payment) => (
                                    <tr key={payment.id} className="hover:bg-stone-gray/5 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-stone-gray text-xs">{payment.id}</td>
                                        <td className="px-6 py-4 whitespace-nowrap font-medium text-elegant-white">
                                            <div>{payment.customer}</div>
                                            <div className="text-xs text-stone-gray">{payment.unit}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-stone-gray">{getTypeLabel(payment.type)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap font-bold text-desert-gold">{payment.amount.toLocaleString()}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-stone-gray text-sm uppercase">{payment.method.replace('_', ' ')}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <StatusBadge status={getStatusLabel(payment.status)} variant={payment.status === 'approved' ? 'success' : payment.status === 'rejected' ? 'error' : 'warning'} />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {payment.status === 'pending' ? (
                                                <div className="flex gap-2">
                                                    <button onClick={() => handleApprove(payment.id)} className="text-green-400 hover:text-green-300 transition-colors bg-green-400/10 px-3 py-1 rounded-md text-xs font-bold">
                                                        {language === 'ar' ? 'اعتماد' : 'Approve'}
                                                    </button>
                                                    {payment.method === 'bank_transfer' && (
                                                        <button className="text-blue-400 hover:text-blue-300 transition-colors">
                                                            <FileText className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => handleViewReceipt(payment)}
                                                    className="text-stone-gray hover:text-desert-gold transition-colors flex items-center gap-1 text-xs"
                                                >
                                                    <Download className="w-3 h-3" />
                                                    {language === 'ar' ? 'السند' : 'Receipt'}
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <PaymentModal
                isOpen={showPaymentModal}
                onClose={() => setShowPaymentModal(false)}
                onSubmit={handleCreatePayment}
            />

            <ESandReceipt
                isOpen={showReceipt}
                onClose={() => setShowReceipt(false)}
                paymentData={selectedPayment}
            />
        </PageWrapper>
    );
}

function StatCard({ title, value, change, icon: Icon, isWarning }: any) {
    return (
        <div className={`bg-obsidian/50 backdrop-blur-sm rounded-xl p-6 border ${isWarning ? 'border-yellow-500/30 bg-yellow-500/5' : 'border-desert-gold/20'}`}>
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h4 className="text-stone-gray text-sm font-medium">{title}</h4>
                    <div className="text-2xl font-bold text-elegant-white mt-2">{value}</div>
                </div>
                <div className={`p-3 rounded-lg ${isWarning ? 'bg-yellow-500/20 text-yellow-500' : 'bg-desert-gold/20 text-desert-gold'}`}>
                    <Icon className="w-6 h-6" />
                </div>
            </div>
            <div className={`text-sm ${isWarning ? 'text-yellow-400' : 'text-green-400'}`}>
                {change}
            </div>
        </div>
    );
}
