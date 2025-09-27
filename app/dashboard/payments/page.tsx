"use client";

import { motion } from "framer-motion";
import { useDirection } from "@/context/DirectionContext";
import { useState } from "react";
import {
  Plus,
  Upload,
  Download,
  Send,
  DollarSign,
  Calendar,
  FileText,
  TrendingUp,
  Filter,
  Eye,
  Edit,
  AlertCircle,
} from "lucide-react";
import PageWrapper from "@/components/PageWrapper";
import DataTable from "@/components/shared/DataTable";
import StatusBadge from "@/components/shared/StatusBadge";
import Modal from "@/components/shared/Modal";
import FormField from "@/components/shared/FormField";
import SelectContext from "@/components/ui/select-context";

export default function PaymentsPage() {
  const { language } = useDirection();
  const [activeTab, setActiveTab] = useState("invoices");
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  // Form states

  const [invoiceForm, setInvoiceForm] = useState({
    client: "",
    type: "",
    amount: "",
    dueDate: "",
    description: "",
  });

  const [reminderForm, setReminderForm] = useState({
    client: "",
    sendMethods: {
      whatsapp: false,
      email: false,
      sms: false,
    },
    customMessage: "",
  });

  // Mock data

  const invoices = [
    {
      id: 1,
      invoiceNumber: "INV-2024-001",
      client: language === "ar" ? "أحمد العتيبي" : "Ahmed Al-Otaibi",
      amount: "250,000",
      date: "2024-01-15",
      status: "sent",
      type: "payment",
    },
    {
      id: 2,
      invoiceNumber: "INV-2024-002",
      client: language === "ar" ? "فاطمة الحربي" : "Fatima Al-Harbi",
      amount: "300,000",
      date: "2024-01-10",
      status: "paid",
      type: "installment",
    },
  ];

  const getPaymentStatusVariant = (status: string) => {
    switch (status) {
      case "paid":
        return "success";
      case "pending":
        return "warning";
      case "late":
        return "error";
      default:
        return "default";
    }
  };

  const getPaymentStatusLabel = (status: string) => {
    const labels: Record<string, { ar: string; en: string }> = {
      paid: { ar: "مدفوع", en: "Paid" },
      pending: { ar: "معلق", en: "Pending" },
      late: { ar: "متأخر", en: "Late" },
    };
    return labels[status]?.[language] || status;
  };

  const getInvoiceStatusVariant = (status: string) => {
    switch (status) {
      case "paid":
        return "success";
      case "sent":
        return "info";
      case "draft":
        return "default";
      case "overdue":
        return "error";
      default:
        return "default";
    }
  };

  const getInvoiceStatusLabel = (status: string) => {
    const labels: Record<string, { ar: string; en: string }> = {
      paid: { ar: "مدفوع", en: "Paid" },
      sent: { ar: "مرسل", en: "Sent" },
      draft: { ar: "مسودة", en: "Draft" },
      overdue: { ar: "متأخر", en: "Overdue" },
    };
    return labels[status]?.[language] || status;
  };

  const tabs = [
    {
      id: "invoices",
      label: language === "ar" ? "الفواتير والإيصالات" : "Invoices & Receipts",
    },
    {
      id: "reports",
      label: language === "ar" ? "التقارير المالية" : "Financial Reports",
    },
  ];

  const invoiceColumns = [
    {
      key: "invoiceNumber",
      label: language === "ar" ? "رقم الفاتورة" : "Invoice Number",
      sortable: true,
      render: (value: string) => (
        <span className="text-desert-gold font-medium">{value}</span>
      ),
    },
    {
      key: "client",
      label: language === "ar" ? "العميل" : "Client",
      sortable: true,
    },
    {
      key: "amount",
      label: language === "ar" ? "المبلغ" : "Amount",
      render: (value: string) => (
        <span className="text-elegant-white font-medium">
          {value} {language === "ar" ? "ريال" : "SAR"}
        </span>
      ),
    },
    {
      key: "date",
      label: language === "ar" ? "التاريخ" : "Date",
      render: (value: string) => (
        <span className="text-stone-gray">{value}</span>
      ),
    },
    {
      key: "status",
      label: language === "ar" ? "الحالة" : "Status",
      render: (value: string) => (
        <StatusBadge
          status={getInvoiceStatusLabel(value)}
          variant={getInvoiceStatusVariant(value)}
        />
      ),
    },
  ];

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      console.log("File dropped:", e.dataTransfer.files[0]);
    }
  };

  const handleView = (item: any) => {
    console.log("View item:", item);
  };

  const handleEdit = (item: any) => {
    console.log("Edit item:", item);
  };

  const handleDelete = (item: any) => {
    if (
      confirm(
        language === "ar"
          ? "هل أنت متأكد من الحذف؟"
          : "Are you sure you want to delete?"
      )
    ) {
      console.log("Delete item:", item);
    }
  };

  const resetInvoiceForm = () => {
    setInvoiceForm({
      client: "",
      type: "",
      amount: "",
      dueDate: "",
      description: "",
    });
  };

  const resetReminderForm = () => {
    setReminderForm({
      client: "",
      sendMethods: {
        whatsapp: false,
        email: false,
        sms: false,
      },
      customMessage: "",
    });
  };

  const handleBookingConfirmationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Booking confirmation form submitted:", invoiceForm);
    // Here you would typically send the data to your API
    setShowInvoiceModal(false);
    resetInvoiceForm();
  };

  const handleReminderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Reminder form submitted:", reminderForm);
    // Here you would typically send the data to your API
    setShowReminderModal(false);
    resetReminderForm();
  };

  return (
    <PageWrapper>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-elegant-white">
              {language === "ar" ? "إدارة المدفوعات" : "Payments Management"}
            </h1>
            <p className="text-stone-gray mt-1">
              {language === "ar"
                ? "إدارة المدفوعات والفواتير والتحويلات البنكية"
                : "Manage payments, invoices, and bank transfers"}
            </p>
          </div>
          <div className="flex space-x-3 rtl:space-x-reverse">
            <motion.button
              onClick={() => setShowInvoiceModal(true)}
              className="bg-stone-gray/20 text-elegant-white px-6 py-3 rounded-lg font-medium hover:bg-stone-gray/30 transition-all duration-300 flex items-center space-x-2 rtl:space-x-reverse"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FileText className="h-5 w-5" />
              <span>
                {language === "ar" ? "تأمين الحجز" : "Booking Confirmation"}
              </span>
            </motion.button>
            <motion.button
              onClick={() => setShowTransferModal(true)}
              className="bg-desert-gold text-deep-black px-6 py-3 rounded-lg font-medium hover:bg-warm-sand transition-all duration-300 flex items-center space-x-2 rtl:space-x-reverse"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Upload className="h-5 w-5" />
              <span>
                {language === "ar" ? "تأكيد تحويل" : "Confirm Transfer"}
              </span>
            </motion.button>
          </div>
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
                    ? "border-desert-gold text-desert-gold"
                    : "border-transparent text-stone-gray hover:text-elegant-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="mt-6">
          {activeTab === "invoices" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-elegant-white">
                  {language === "ar"
                    ? "الفواتير والإيصالات"
                    : "Invoices & Receipts"}
                </h2>
                <motion.button
                  onClick={() => setShowInvoiceModal(true)}
                  className="bg-desert-gold text-deep-black px-4 py-2 rounded-lg font-medium hover:bg-warm-sand transition-all duration-300 flex items-center space-x-2 rtl:space-x-reverse"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Plus className="h-4 w-4" />
                  <span>
                    {language === "ar" ? "فاتورة جديدة" : "New Invoice"}
                  </span>
                </motion.button>
              </div>

              <DataTable
                columns={invoiceColumns}
                data={invoices}
                searchPlaceholder={
                  language === "ar"
                    ? "البحث في الفواتير..."
                    : "Search invoices..."
                }
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </div>
          )}

          {activeTab === "reports" && (
            <div className="bg-obsidian/50 backdrop-blur-sm rounded-xl p-8 border border-desert-gold/20">
              <h2 className="text-2xl font-bold text-elegant-white mb-6">
                {language === "ar" ? "التقارير المالية" : "Financial Reports"}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <div className="bg-stone-gray/10 rounded-lg p-6 text-center">
                  <TrendingUp className="h-8 w-8 text-desert-gold mx-auto mb-3" />
                  <h3 className="text-lg font-bold text-elegant-white mb-2">
                    {language === "ar" ? "إجمالي المدفوعات" : "Total Payments"}
                  </h3>
                  <p className="text-2xl font-bold text-desert-gold">
                    2.5M {language === "ar" ? "ريال" : "SAR"}
                  </p>
                </div>

                <div className="bg-stone-gray/10 rounded-lg p-6 text-center">
                  <AlertCircle className="h-8 w-8 text-yellow-500 mx-auto mb-3" />
                  <h3 className="text-lg font-bold text-elegant-white mb-2">
                    {language === "ar"
                      ? "المدفوعات المعلقة"
                      : "Pending Payments"}
                  </h3>
                  <p className="text-2xl font-bold text-yellow-500">
                    850K {language === "ar" ? "ريال" : "SAR"}
                  </p>
                </div>

                <div className="bg-stone-gray/10 rounded-lg p-6 text-center">
                  <Calendar className="h-8 w-8 text-red-500 mx-auto mb-3" />
                  <h3 className="text-lg font-bold text-elegant-white mb-2">
                    {language === "ar"
                      ? "المدفوعات المتأخرة"
                      : "Overdue Payments"}
                  </h3>
                  <p className="text-2xl font-bold text-red-500">
                    150K {language === "ar" ? "ريال" : "SAR"}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                <motion.button
                  className="bg-desert-gold text-deep-black px-6 py-3 rounded-lg font-medium hover:bg-warm-sand transition-all duration-300 flex items-center space-x-2 rtl:space-x-reverse"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Download className="h-4 w-4" />
                  <span>
                    {language === "ar"
                      ? "تحميل تقرير PDF"
                      : "Download PDF Report"}
                  </span>
                </motion.button>

                <motion.button
                  className="bg-stone-gray/20 text-elegant-white px-6 py-3 rounded-lg font-medium hover:bg-stone-gray/30 transition-all duration-300 flex items-center space-x-2 rtl:space-x-reverse"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Download className="h-4 w-4" />
                  <span>
                    {language === "ar" ? "تصدير Excel" : "Export Excel"}
                  </span>
                </motion.button>
              </div>
            </div>
          )}
        </div>

        {/* Confirm Transfer Modal */}
        <Modal
          isOpen={showTransferModal}
          onClose={() => {
            setShowTransferModal(false);
          }}
          title={
            language === "ar" ? "تأكيد التحويل البنكي" : "Confirm Bank Transfer"
          }
          size="lg"
        >
          <div className="text-center py-8">
            <Upload className="h-16 w-16 text-desert-gold mx-auto mb-4" />
            <p className="text-stone-gray">
              {language === "ar"
                ? "يرجى ملء النموذج أعلاه لتأكيد التحويل البنكي"
                : "Please fill the form above to confirm bank transfer"}
            </p>
          </div>
        </Modal>

        {/* Booking Confirmation Modal */}
        <Modal
          isOpen={showInvoiceModal}
          onClose={() => {
            setShowInvoiceModal(false);
            resetInvoiceForm();
          }}
          title={language === "ar" ? "تأمين الحجز" : "Booking Confirmation"}
          size="lg"
        >
          <form
            className="space-y-6"
            onSubmit={handleBookingConfirmationSubmit}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                label={language === "ar" ? "العميل" : "Client"}
                required
              >
                <SelectContext
                  options={[
                    {
                      value: "1",
                      label: { ar: "أحمد العتيبي", en: "Ahmed Al-Otaibi" },
                    },
                    {
                      value: "2",
                      label: { ar: "فاطمة الحربي", en: "Fatima Al-Harbi" },
                    },
                    {
                      value: "3",
                      label: { ar: "خالد المطيري", en: "Khalid Al-Mutairi" },
                    },
                  ]}
                  value={invoiceForm.client}
                  onChange={(value) =>
                    setInvoiceForm((prev) => ({ ...prev, client: value }))
                  }
                  placeholder={
                    language === "ar" ? "اختر العميل" : "Select Client"
                  }
                  language={language}
                />
              </FormField>

              <FormField
                label={language === "ar" ? "نوع التأمين" : "Confirmation Type"}
                required
              >
                <SelectContext
                  options={[
                    {
                      value: "booking",
                      label: { ar: "حجز وحدة", en: "Unit Booking" },
                    },
                    {
                      value: "reservation",
                      label: { ar: "حجز مؤقت", en: "Temporary Reservation" },
                    },
                    {
                      value: "pre-booking",
                      label: { ar: "حجز مسبق", en: "Pre-booking" },
                    },
                  ]}
                  value={invoiceForm.type}
                  onChange={(value) =>
                    setInvoiceForm((prev) => ({ ...prev, type: value }))
                  }
                  placeholder={
                    language === "ar"
                      ? "اختر نوع التأمين"
                      : "Select Confirmation Type"
                  }
                  language={language}
                />
              </FormField>

              <FormField
                label={
                  language === "ar" ? "مبلغ التأمين" : "Confirmation Amount"
                }
                required
              >
                <input
                  type="number"
                  value={invoiceForm.amount}
                  onChange={(e) =>
                    setInvoiceForm((prev) => ({
                      ...prev,
                      amount: e.target.value,
                    }))
                  }
                  className="w-full bg-stone-gray/10 border border-desert-gold/20 rounded-lg px-4 py-3 text-elegant-white placeholder-stone-gray focus:outline-none focus:border-desert-gold transition-colors duration-300"
                  placeholder="50000"
                />
              </FormField>

              <FormField
                label={
                  language === "ar" ? "تاريخ التأكيد" : "Confirmation Date"
                }
                required
              >
                <input
                  type="date"
                  value={invoiceForm.dueDate}
                  onChange={(e) =>
                    setInvoiceForm((prev) => ({
                      ...prev,
                      dueDate: e.target.value,
                    }))
                  }
                  className="w-full bg-stone-gray/10 border border-desert-gold/20 rounded-lg px-4 py-3 text-elegant-white focus:outline-none focus:border-desert-gold transition-colors duration-300"
                />
              </FormField>
            </div>

            <FormField
              label={
                language === "ar" ? "تفاصيل التأمين" : "Confirmation Details"
              }
            >
              <textarea
                rows={4}
                value={invoiceForm.description}
                onChange={(e) =>
                  setInvoiceForm((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                className="w-full bg-stone-gray/10 border border-desert-gold/20 rounded-lg px-4 py-3 text-elegant-white placeholder-stone-gray focus:outline-none focus:border-desert-gold transition-colors duration-300 resize-none"
                placeholder={
                  language === "ar"
                    ? "أضف تفاصيل تأمين الحجز..."
                    : "Add booking confirmation details..."
                }
              />
            </FormField>

            <div className="flex justify-end space-x-4 rtl:space-x-reverse pt-6">
              <motion.button
                type="button"
                onClick={() => {
                  setShowInvoiceModal(false);
                  resetInvoiceForm();
                }}
                className="px-6 py-3 border border-desert-gold/20 text-stone-gray rounded-lg hover:bg-stone-gray/10 transition-all duration-300"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {language === "ar" ? "إلغاء" : "Cancel"}
              </motion.button>
              <motion.button
                type="submit"
                className="px-6 py-3 bg-desert-gold text-deep-black rounded-lg font-medium hover:bg-warm-sand transition-all duration-300"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {language === "ar" ? "تأكيد الحجز" : "Confirm Booking"}
              </motion.button>
            </div>
          </form>
        </Modal>

        {/* Send Reminder Modal */}
        <Modal
          isOpen={showReminderModal}
          onClose={() => {
            setShowReminderModal(false);
            resetReminderForm();
          }}
          title={
            language === "ar" ? "إرسال تذكير دفع" : "Send Payment Reminder"
          }
        >
          <form className="space-y-6" onSubmit={handleReminderSubmit}>
            <FormField label={language === "ar" ? "العميل" : "Client"} required>
              <SelectContext
                options={[
                  {
                    value: "1",
                    label: {
                      ar: "أحمد العتيبي - A101",
                      en: "Ahmed Al-Otaibi - A101",
                    },
                  },
                  {
                    value: "2",
                    label: {
                      ar: "فاطمة الحربي - B205",
                      en: "Fatima Al-Harbi - B205",
                    },
                  },
                ]}
                value={reminderForm.client}
                onChange={(value) =>
                  setReminderForm((prev) => ({ ...prev, client: value }))
                }
                placeholder={
                  language === "ar" ? "اختر العميل" : "Select Client"
                }
                language={language}
              />
            </FormField>

            <FormField
              label={language === "ar" ? "طريقة الإرسال" : "Send Method"}
              required
            >
              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={reminderForm.sendMethods.whatsapp}
                    onChange={(e) =>
                      setReminderForm((prev) => ({
                        ...prev,
                        sendMethods: {
                          ...prev.sendMethods,
                          whatsapp: e.target.checked,
                        },
                      }))
                    }
                    className="mr-2 text-desert-gold"
                  />
                  <span className="text-elegant-white">
                    {language === "ar" ? "واتساب" : "WhatsApp"}
                  </span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={reminderForm.sendMethods.email}
                    onChange={(e) =>
                      setReminderForm((prev) => ({
                        ...prev,
                        sendMethods: {
                          ...prev.sendMethods,
                          email: e.target.checked,
                        },
                      }))
                    }
                    className="mr-2 text-desert-gold"
                  />
                  <span className="text-elegant-white">
                    {language === "ar" ? "بريد إلكتروني" : "Email"}
                  </span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={reminderForm.sendMethods.sms}
                    onChange={(e) =>
                      setReminderForm((prev) => ({
                        ...prev,
                        sendMethods: {
                          ...prev.sendMethods,
                          sms: e.target.checked,
                        },
                      }))
                    }
                    className="mr-2 text-desert-gold"
                  />
                  <span className="text-elegant-white">
                    {language === "ar" ? "رسالة نصية" : "SMS"}
                  </span>
                </label>
              </div>
            </FormField>

            <FormField
              label={language === "ar" ? "رسالة مخصصة" : "Custom Message"}
            >
              <textarea
                rows={4}
                value={reminderForm.customMessage}
                onChange={(e) =>
                  setReminderForm((prev) => ({
                    ...prev,
                    customMessage: e.target.value,
                  }))
                }
                className="w-full bg-stone-gray/10 border border-desert-gold/20 rounded-lg px-4 py-3 text-elegant-white placeholder-stone-gray focus:outline-none focus:border-desert-gold transition-colors duration-300 resize-none"
                placeholder={
                  language === "ar"
                    ? "أضف رسالة مخصصة (اختياري)..."
                    : "Add custom message (optional)..."
                }
              />
            </FormField>

            <div className="flex justify-end space-x-4 rtl:space-x-reverse pt-6">
              <motion.button
                type="button"
                onClick={() => {
                  setShowReminderModal(false);
                  resetReminderForm();
                }}
                className="px-6 py-3 border border-desert-gold/20 text-stone-gray rounded-lg hover:bg-stone-gray/10 transition-all duration-300"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {language === "ar" ? "إلغاء" : "Cancel"}
              </motion.button>
              <motion.button
                type="submit"
                className="px-6 py-3 bg-desert-gold text-deep-black rounded-lg font-medium hover:bg-warm-sand transition-all duration-300"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {language === "ar" ? "إرسال التذكير" : "Send Reminder"}
              </motion.button>
            </div>
          </form>
        </Modal>
      </div>
    </PageWrapper>
  );
}
