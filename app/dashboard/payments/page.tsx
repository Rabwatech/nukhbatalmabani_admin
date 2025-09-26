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
  const [activeTab, setActiveTab] = useState("schedule");
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  // Form states
  const [transferForm, setTransferForm] = useState({
    client: "",
    unit: "",
    amount: "",
    transferDate: "",
  });

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
  const paymentSchedule = [
    {
      id: 1,
      client: language === "ar" ? "أحمد العتيبي" : "Ahmed Al-Otaibi",
      unit: "A101",
      project: language === "ar" ? "مجمع الأناقة" : "Elegance Complex",
      amount: "250,000",
      dueDate: "2024-01-25",
      status: "pending",
      installment: "2/4",
    },
    {
      id: 2,
      client: language === "ar" ? "فاطمة الحربي" : "Fatima Al-Harbi",
      unit: "B205",
      project: language === "ar" ? "برج التجارة" : "Trade Tower",
      amount: "300,000",
      dueDate: "2024-01-20",
      status: "late",
      installment: "1/3",
    },
    {
      id: 3,
      client: language === "ar" ? "خالد المطيري" : "Khalid Al-Mutairi",
      unit: "V15",
      project: language === "ar" ? "قرية الهدوء" : "Tranquil Village",
      amount: "500,000",
      dueDate: "2024-01-15",
      status: "paid",
      installment: "3/4",
    },
  ];

  const upcomingPayments = [
    {
      id: 1,
      client: language === "ar" ? "نورا السالم" : "Nora Al-Salem",
      unit: "C302",
      amount: "150,000",
      dueDate: "2024-01-30",
      daysLeft: 5,
      type: "installment",
    },
    {
      id: 2,
      client: language === "ar" ? "سعد الدوسري" : "Saad Al-Dosari",
      unit: "A205",
      amount: "75,000",
      dueDate: "2024-02-01",
      daysLeft: 7,
      type: "maintenance",
    },
  ];

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
      id: "schedule",
      label: language === "ar" ? "جدول المدفوعات" : "Payment Schedule",
    },
    {
      id: "transfers",
      label: language === "ar" ? "تأكيد التحويلات" : "Bank Transfers",
    },
    {
      id: "upcoming",
      label: language === "ar" ? "المدفوعات القادمة" : "Upcoming Payments",
    },
    {
      id: "invoices",
      label: language === "ar" ? "الفواتير والإيصالات" : "Invoices & Receipts",
    },
    {
      id: "reports",
      label: language === "ar" ? "التقارير المالية" : "Financial Reports",
    },
  ];

  const scheduleColumns = [
    {
      key: "client",
      label: language === "ar" ? "العميل" : "Client",
      sortable: true,
    },
    {
      key: "unit",
      label: language === "ar" ? "الوحدة" : "Unit",
      render: (value: string, row: any) => (
        <div>
          <div className="text-elegant-white font-medium">{value}</div>
          <div className="text-stone-gray text-sm">{row.project}</div>
        </div>
      ),
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
      key: "installment",
      label: language === "ar" ? "القسط" : "Installment",
      render: (value: string) => (
        <span className="text-stone-gray">{value}</span>
      ),
    },
    {
      key: "dueDate",
      label: language === "ar" ? "تاريخ الاستحقاق" : "Due Date",
      render: (value: string) => (
        <span className="text-stone-gray">{value}</span>
      ),
    },
    {
      key: "status",
      label: language === "ar" ? "الحالة" : "Status",
      render: (value: string) => (
        <StatusBadge
          status={getPaymentStatusLabel(value)}
          variant={getPaymentStatusVariant(value)}
        />
      ),
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

  const resetTransferForm = () => {
    setTransferForm({
      client: "",
      unit: "",
      amount: "",
      transferDate: "",
    });
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

  const handleTransferSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Transfer form submitted:", transferForm);
    // Here you would typically send the data to your API
    setShowTransferModal(false);
    resetTransferForm();
  };

  const handleInvoiceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Invoice form submitted:", invoiceForm);
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
              <span>{language === "ar" ? "فاتورة جديدة" : "New Invoice"}</span>
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
          {activeTab === "schedule" && (
            <DataTable
              columns={scheduleColumns}
              data={paymentSchedule}
              searchPlaceholder={
                language === "ar"
                  ? "البحث في المدفوعات..."
                  : "Search payments..."
              }
              onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}

          {activeTab === "transfers" && (
            <div className="bg-obsidian/50 backdrop-blur-sm rounded-xl p-8 border border-desert-gold/20">
              <h2 className="text-2xl font-bold text-elegant-white mb-6">
                {language === "ar"
                  ? "تأكيد التحويل البنكي"
                  : "Confirm Bank Transfer"}
              </h2>

              <form className="space-y-6" onSubmit={handleTransferSubmit}>
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
                          label: {
                            ar: "خالد المطيري",
                            en: "Khalid Al-Mutairi",
                          },
                        },
                      ]}
                      value={transferForm.client}
                      onChange={(value) =>
                        setTransferForm((prev) => ({ ...prev, client: value }))
                      }
                      placeholder={
                        language === "ar" ? "اختر العميل" : "Select Client"
                      }
                      language={language}
                    />
                  </FormField>

                  <FormField
                    label={language === "ar" ? "الوحدة" : "Unit"}
                    required
                  >
                    <SelectContext
                      options={[
                        {
                          value: "a101",
                          label: {
                            ar: "A101 - مجمع الأناقة",
                            en: "A101 - Elegance Complex",
                          },
                        },
                        {
                          value: "b205",
                          label: {
                            ar: "B205 - برج التجارة",
                            en: "B205 - Trade Tower",
                          },
                        },
                        {
                          value: "v15",
                          label: {
                            ar: "V15 - قرية الهدوء",
                            en: "V15 - Tranquil Village",
                          },
                        },
                      ]}
                      value={transferForm.unit}
                      onChange={(value) =>
                        setTransferForm((prev) => ({ ...prev, unit: value }))
                      }
                      placeholder={
                        language === "ar" ? "اختر الوحدة" : "Select Unit"
                      }
                      language={language}
                    />
                  </FormField>

                  <FormField
                    label={language === "ar" ? "المبلغ" : "Amount"}
                    required
                  >
                    <input
                      type="number"
                      value={transferForm.amount}
                      onChange={(e) =>
                        setTransferForm((prev) => ({
                          ...prev,
                          amount: e.target.value,
                        }))
                      }
                      className="w-full bg-stone-gray/10 border border-desert-gold/20 rounded-lg px-4 py-3 text-elegant-white placeholder-stone-gray focus:outline-none focus:border-desert-gold transition-colors duration-300"
                      placeholder="250000"
                    />
                  </FormField>

                  <FormField
                    label={
                      language === "ar" ? "تاريخ التحويل" : "Transfer Date"
                    }
                    required
                  >
                    <input
                      type="date"
                      value={transferForm.transferDate}
                      onChange={(e) =>
                        setTransferForm((prev) => ({
                          ...prev,
                          transferDate: e.target.value,
                        }))
                      }
                      className="w-full bg-stone-gray/10 border border-desert-gold/20 rounded-lg px-4 py-3 text-elegant-white focus:outline-none focus:border-desert-gold transition-colors duration-300"
                    />
                  </FormField>
                </div>

                {/* File Upload Area */}
                <div>
                  <label className="block text-sm font-medium text-elegant-white mb-2">
                    {language === "ar" ? "إيصال التحويل" : "Transfer Receipt"} *
                  </label>
                  <div
                    className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 ${
                      dragActive
                        ? "border-desert-gold bg-desert-gold/10"
                        : "border-desert-gold/30 hover:border-desert-gold/50"
                    }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    <Upload className="h-12 w-12 text-desert-gold mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-elegant-white mb-2">
                      {language === "ar"
                        ? "اسحب وأفلت الملف هنا"
                        : "Drag and drop file here"}
                    </h3>
                    <p className="text-stone-gray mb-4">
                      {language === "ar"
                        ? "أو انقر لاختيار الملف"
                        : "or click to select file"}
                    </p>
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      className="hidden"
                      id="file-upload"
                    />
                    <label
                      htmlFor="file-upload"
                      className="inline-flex items-center px-4 py-2 bg-desert-gold/20 text-desert-gold rounded-lg hover:bg-desert-gold/30 transition-colors duration-200 cursor-pointer"
                    >
                      {language === "ar" ? "اختر الملف" : "Choose File"}
                    </label>
                  </div>
                </div>

                <div className="flex justify-end space-x-4 rtl:space-x-reverse pt-6">
                  <motion.button
                    type="button"
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
                    {language === "ar" ? "تأكيد التحويل" : "Confirm Transfer"}
                  </motion.button>
                </div>
              </form>
            </div>
          )}

          {activeTab === "upcoming" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-elegant-white">
                  {language === "ar"
                    ? "المدفوعات القادمة"
                    : "Upcoming Payments"}
                </h2>
                <motion.button
                  onClick={() => setShowReminderModal(true)}
                  className="bg-desert-gold text-deep-black px-4 py-2 rounded-lg font-medium hover:bg-warm-sand transition-all duration-300 flex items-center space-x-2 rtl:space-x-reverse"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Send className="h-4 w-4" />
                  <span>
                    {language === "ar" ? "إرسال تذكير" : "Send Reminder"}
                  </span>
                </motion.button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {upcomingPayments.map((payment, index) => (
                  <motion.div
                    key={payment.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-obsidian/50 backdrop-blur-sm rounded-lg p-6 border border-desert-gold/20"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-elegant-white">
                          {payment.client}
                        </h3>
                        <p className="text-stone-gray">
                          {language === "ar" ? "الوحدة:" : "Unit:"}{" "}
                          {payment.unit}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          payment.daysLeft <= 3
                            ? "bg-red-500 text-white"
                            : payment.daysLeft <= 7
                            ? "bg-yellow-500 text-deep-black"
                            : "bg-green-500 text-white"
                        }`}
                      >
                        {payment.daysLeft} {language === "ar" ? "أيام" : "days"}
                      </span>
                    </div>

                    <div className="space-y-3 mb-4">
                      <div className="flex items-center space-x-2 rtl:space-x-reverse">
                        <DollarSign className="h-4 w-4 text-desert-gold" />
                        <span className="text-elegant-white font-medium">
                          {payment.amount} {language === "ar" ? "ريال" : "SAR"}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 rtl:space-x-reverse">
                        <Calendar className="h-4 w-4 text-desert-gold" />
                        <span className="text-stone-gray">
                          {language === "ar" ? "تاريخ الاستحقاق:" : "Due Date:"}{" "}
                          {payment.dueDate}
                        </span>
                      </div>
                    </div>

                    <motion.button
                      className="w-full bg-desert-gold/20 text-desert-gold py-2 rounded-lg hover:bg-desert-gold/30 transition-colors duration-200 flex items-center justify-center space-x-2 rtl:space-x-reverse"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Send className="h-4 w-4" />
                      <span>
                        {language === "ar" ? "إرسال تذكير" : "Send Reminder"}
                      </span>
                    </motion.button>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

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
            resetTransferForm();
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

        {/* New Invoice Modal */}
        <Modal
          isOpen={showInvoiceModal}
          onClose={() => {
            setShowInvoiceModal(false);
            resetInvoiceForm();
          }}
          title={
            language === "ar" ? "إنشاء فاتورة جديدة" : "Create New Invoice"
          }
          size="lg"
        >
          <form className="space-y-6" onSubmit={handleInvoiceSubmit}>
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
                label={language === "ar" ? "نوع الفاتورة" : "Invoice Type"}
                required
              >
                <SelectContext
                  options={[
                    { value: "payment", label: { ar: "دفعة", en: "Payment" } },
                    {
                      value: "installment",
                      label: { ar: "قسط", en: "Installment" },
                    },
                    {
                      value: "maintenance",
                      label: { ar: "صيانة", en: "Maintenance" },
                    },
                  ]}
                  value={invoiceForm.type}
                  onChange={(value) =>
                    setInvoiceForm((prev) => ({ ...prev, type: value }))
                  }
                  placeholder={
                    language === "ar"
                      ? "اختر نوع الفاتورة"
                      : "Select Invoice Type"
                  }
                  language={language}
                />
              </FormField>

              <FormField
                label={language === "ar" ? "المبلغ" : "Amount"}
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
                  placeholder="250000"
                />
              </FormField>

              <FormField
                label={language === "ar" ? "تاريخ الاستحقاق" : "Due Date"}
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
              label={language === "ar" ? "وصف الفاتورة" : "Invoice Description"}
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
                    ? "أضف وصف للفاتورة..."
                    : "Add invoice description..."
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
                {language === "ar" ? "إنشاء الفاتورة" : "Create Invoice"}
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
                options={upcomingPayments.map((payment) => ({
                  value: payment.id.toString(),
                  label: {
                    ar: `${payment.client} - ${payment.unit}`,
                    en: `${payment.client} - ${payment.unit}`,
                  },
                }))}
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
