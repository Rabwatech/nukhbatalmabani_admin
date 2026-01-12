"use client";

import { motion } from "framer-motion";
import { useDirection } from "@/context/DirectionContext";
import { useState } from "react";
import {
  Download,
  Filter,
  Calendar,
  TrendingUp,
  DollarSign,
  Users,
  Building2,
  AlertTriangle,
  BarChart3,
  PieChart,
  FileText,
  Eye,
  Brain,
} from "lucide-react";
import PageWrapper from "@/components/PageWrapper";
import StatusBadge from "@/components/shared/StatusBadge";
import Modal from "@/components/shared/Modal";
import FormField from "@/components/shared/FormField";
import SelectContext from "@/components/ui/select-context";

export default function ReportsPage() {
  const { language } = useDirection();
  const [activeTab, setActiveTab] = useState("sales");
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedDateRange, setSelectedDateRange] = useState("this-month");

  // Mock data
  const salesReports = [
    {
      id: 1,
      period: language === "ar" ? "يناير 2024" : "January 2024",
      totalSales: "5,200,000",
      unitsBooked: 12,
      unitsSold: 8,
      averagePrice: "650,000",
      topProject: language === "ar" ? "مجمع الأناقة" : "Elegance Complex",
      topSalesRep: language === "ar" ? "فاطمة الحربي" : "Fatima Al-Harbi",
    },
    {
      id: 2,
      period: language === "ar" ? "ديسمبر 2023" : "December 2023",
      totalSales: "4,800,000",
      unitsBooked: 10,
      unitsSold: 7,
      averagePrice: "685,000",
      topProject: language === "ar" ? "برج التجارة" : "Trade Tower",
      topSalesRep: language === "ar" ? "أحمد العتيبي" : "Ahmed Al-Otaibi",
    },
  ];

  const paymentReports = [
    {
      id: 1,
      period: language === "ar" ? "يناير 2024" : "January 2024",
      totalCollected: "3,200,000",
      totalPending: "850,000",
      totalOverdue: "150,000",
      collectionRate: "88%",
      avgPaymentTime: "12",
      latePayments: 3,
    },
    {
      id: 2,
      period: language === "ar" ? "ديسمبر 2023" : "December 2023",
      totalCollected: "2,900,000",
      totalPending: "920,000",
      totalOverdue: "180,000",
      collectionRate: "85%",
      avgPaymentTime: "14",
      latePayments: 5,
    },
  ];

  const customerSatisfaction = [
    {
      id: 1,
      period: language === "ar" ? "يناير 2024" : "January 2024",
      averageRating: 4.6,
      totalReviews: 45,
      satisfied: 42,
      neutral: 2,
      unsatisfied: 1,
      topComplaint: language === "ar" ? "تأخير في التسليم" : "Delivery delays",
      topPraise: language === "ar" ? "جودة البناء" : "Build quality",
    },
  ];

  const projectPerformance = [
    {
      id: 1,
      project: language === "ar" ? "مجمع الأناقة" : "Elegance Complex",
      totalUnits: 150,
      soldUnits: 120,
      reservedUnits: 20,
      availableUnits: 10,
      salesRate: "80%",
      avgPrice: "850,000",
      revenue: "102,000,000",
    },
    {
      id: 2,
      project: language === "ar" ? "برج التجارة" : "Trade Tower",
      totalUnits: 80,
      soldUnits: 45,
      reservedUnits: 15,
      availableUnits: 20,
      salesRate: "56%",
      avgPrice: "1,200,000",
      revenue: "54,000,000",
    },
    {
      id: 3,
      project: language === "ar" ? "قرية الهدوء" : "Tranquil Village",
      totalUnits: 60,
      soldUnits: 55,
      reservedUnits: 3,
      availableUnits: 2,
      salesRate: "92%",
      avgPrice: "2,500,000",
      revenue: "137,500,000",
    },
  ];

  const lateTasks = [
    {
      id: 1,
      type: language === "ar" ? "عقد" : "Contract",
      description:
        language === "ar"
          ? "عقد أحمد العتيبي - A101"
          : "Ahmed Al-Otaibi Contract - A101",
      dueDate: "2024-01-20",
      daysOverdue: 2,
      assignedTo: language === "ar" ? "فاطمة الحربي" : "Fatima Al-Harbi",
      priority: "high",
    },
    {
      id: 2,
      type: language === "ar" ? "دفعة" : "Payment",
      description:
        language === "ar"
          ? "دفعة خالد المطيري - V15"
          : "Khalid Al-Mutairi Payment - V15",
      dueDate: "2024-01-18",
      daysOverdue: 4,
      assignedTo: language === "ar" ? "قسم المحاسبة" : "Accounting Dept",
      priority: "medium",
    },
    {
      id: 3,
      type: language === "ar" ? "صيانة" : "Maintenance",
      description:
        language === "ar"
          ? "طلب صيانة نورا السالم - C302"
          : "Nora Al-Salem Maintenance - C302",
      dueDate: "2024-01-19",
      daysOverdue: 3,
      assignedTo: language === "ar" ? "خالد المطيري" : "Khalid Al-Mutairi",
      priority: "high",
    },
  ];

  const aiInsights = [
    {
      id: 1,
      type: "opportunity",
      text: language === "ar"
        ? "تشير البيانات إلى ارتفاع الطلب على وحدات 'الميزانين' في حي الملقا بنسبة 20% هذا الشهر."
        : "Data indicates a 20% increase in demand for 'Mezzanine' units in Al-Malqa this month.",
      score: 95
    },
    {
      id: 2,
      type: "risk",
      text: language === "ar"
        ? "معدل الإغلاق في مشروع 'الرابية' انخفض قليلاً. يُنصح بتقديم عروض ترويجية."
        : "Closing rate in 'Al-Rabia' project dipped slightly. Promotional offers are recommended.",
      score: 80
    },
    {
      id: 3,
      type: "performance",
      text: language === "ar"
        ? "فريق المبيعات حقق 110% من المستهدف الربعي قبل أسبوعين من الإغلاق."
        : "Sales team achieved 110% of quarterly target two weeks before closing.",
      score: 98
    }
  ];

  const tabs = [
    {
      id: "sales",
      label: language === "ar" ? "تقارير المبيعات" : "Sales Reports",
    },
    {
      id: "ai",
      label: language === "ar" ? "التحليل الذكي (AI)" : "AI Insights",
    },
    {
      id: "payments",
      label: language === "ar" ? "تقارير المدفوعات" : "Payment Reports",
    },
    {
      id: "satisfaction",
      label: language === "ar" ? "رضا العملاء" : "Customer Satisfaction",
    },
    {
      id: "projects",
      label: language === "ar" ? "أداء المشاريع" : "Project Performance",
    },
    {
      id: "tasks",
      label: language === "ar" ? "المهام المتأخرة" : "Late Tasks",
    },
  ];

  const getPriorityVariant = (priority: string) => {
    switch (priority) {
      case "high":
        return "error";
      case "medium":
        return "warning";
      case "low":
        return "success";
      default:
        return "default";
    }
  };

  const getPriorityLabel = (priority: string) => {
    const labels: Record<string, { ar: string; en: string }> = {
      high: { ar: "عالية", en: "High" },
      medium: { ar: "متوسطة", en: "Medium" },
      low: { ar: "منخفضة", en: "Low" },
    };
    return labels[priority]?.[language] || priority;
  };

  const handleDownloadReport = (type: string) => {
    console.log(`Downloading ${type} report`);
  };

  const handleViewDetails = (item: any) => {
    console.log("View details:", item);
  };

  return (
    <PageWrapper>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-elegant-white">
              {language === "ar"
                ? "التقارير والتحليلات"
                : "Reports & Analytics"}
            </h1>
            <p className="text-stone-gray mt-1">
              {language === "ar"
                ? "تقارير شاملة وتحليلات الأداء"
                : "Comprehensive reports and performance analytics"}
            </p>
          </div>
          <div className="flex space-x-3 rtl:space-x-reverse">
            <motion.button
              onClick={() => setShowFilterModal(true)}
              className="bg-stone-gray/20 text-elegant-white px-6 py-3 rounded-lg font-medium hover:bg-stone-gray/30 transition-all duration-300 flex items-center space-x-2 rtl:space-x-reverse"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Filter className="h-5 w-5" />
              <span>{language === "ar" ? "فلترة" : "Filter"}</span>
            </motion.button>
            <motion.button
              onClick={() => handleDownloadReport("all")}
              className="bg-desert-gold text-deep-black px-6 py-3 rounded-lg font-medium hover:bg-warm-sand transition-all duration-300 flex items-center space-x-2 rtl:space-x-reverse"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Download className="h-5 w-5" />
              <span>
                {language === "ar" ? "تحميل التقارير" : "Download Reports"}
              </span>
            </motion.button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-obsidian/50 backdrop-blur-sm rounded-lg p-6 border border-desert-gold/20"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-stone-gray text-sm">
                  {language === "ar" ? "إجمالي المبيعات" : "Total Sales"}
                </p>
                <p className="text-2xl font-bold text-elegant-white">5.2M</p>
                <p className="text-green-400 text-sm">
                  +12%{" "}
                  {language === "ar" ? "من الشهر الماضي" : "from last month"}
                </p>
              </div>
              <div className="p-3 bg-green-500/20 rounded-lg">
                <TrendingUp className="h-6 w-6 text-green-500" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-obsidian/50 backdrop-blur-sm rounded-lg p-6 border border-desert-gold/20"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-stone-gray text-sm">
                  {language === "ar" ? "العملاء النشطون" : "Active Customers"}
                </p>
                <p className="text-2xl font-bold text-elegant-white">247</p>
                <p className="text-blue-400 text-sm">
                  +8%{" "}
                  {language === "ar" ? "من الشهر الماضي" : "from last month"}
                </p>
              </div>
              <div className="p-3 bg-blue-500/20 rounded-lg">
                <Users className="h-6 w-6 text-blue-500" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-obsidian/50 backdrop-blur-sm rounded-lg p-6 border border-desert-gold/20"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-stone-gray text-sm">
                  {language === "ar" ? "الوحدات المباعة" : "Units Sold"}
                </p>
                <p className="text-2xl font-bold text-elegant-white">28</p>
                <p className="text-yellow-400 text-sm">
                  +5%{" "}
                  {language === "ar" ? "من الشهر الماضي" : "from last month"}
                </p>
              </div>
              <div className="p-3 bg-yellow-500/20 rounded-lg">
                <Building2 className="h-6 w-6 text-yellow-500" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-obsidian/50 backdrop-blur-sm rounded-lg p-6 border border-desert-gold/20"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-stone-gray text-sm">
                  {language === "ar" ? "المهام المتأخرة" : "Overdue Tasks"}
                </p>
                <p className="text-2xl font-bold text-elegant-white">3</p>
                <p className="text-red-400 text-sm">
                  -2{" "}
                  {language === "ar" ? "من الأسبوع الماضي" : "from last week"}
                </p>
              </div>
              <div className="p-3 bg-red-500/20 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-red-500" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Tabs */}
        <div className="border-b border-desert-gold/20">
          <nav className="flex space-x-8 rtl:space-x-reverse overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-3 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors duration-200 ${activeTab === tab.id
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
          {activeTab === "sales" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-elegant-white">
                  {language === "ar" ? "تقارير المبيعات" : "Sales Reports"}
                </h2>
                <motion.button
                  onClick={() => handleDownloadReport("sales")}
                  className="bg-desert-gold text-deep-black px-4 py-2 rounded-lg font-medium hover:bg-warm-sand transition-all duration-300 flex items-center space-x-2 rtl:space-x-reverse"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Download className="h-4 w-4" />
                  <span>{language === "ar" ? "تحميل" : "Download"}</span>
                </motion.button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {salesReports.map((report, index) => (
                  <motion.div
                    key={report.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-obsidian/50 backdrop-blur-sm rounded-lg p-6 border border-desert-gold/20"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg font-bold text-elegant-white">
                        {report.period}
                      </h3>
                      <BarChart3 className="h-6 w-6 text-desert-gold" />
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-stone-gray text-sm">
                          {language === "ar"
                            ? "إجمالي المبيعات"
                            : "Total Sales"}
                        </p>
                        <p className="text-xl font-bold text-desert-gold">
                          {report.totalSales}{" "}
                          {language === "ar" ? "ريال" : "SAR"}
                        </p>
                      </div>
                      <div>
                        <p className="text-stone-gray text-sm">
                          {language === "ar" ? "الوحدات المباعة" : "Units Sold"}
                        </p>
                        <p className="text-xl font-bold text-elegant-white">
                          {report.unitsSold}
                        </p>
                      </div>
                      <div>
                        <p className="text-stone-gray text-sm">
                          {language === "ar" ? "متوسط السعر" : "Average Price"}
                        </p>
                        <p className="text-lg font-medium text-elegant-white">
                          {report.averagePrice}{" "}
                          {language === "ar" ? "ريال" : "SAR"}
                        </p>
                      </div>
                      <div>
                        <p className="text-stone-gray text-sm">
                          {language === "ar" ? "الحجوزات" : "Bookings"}
                        </p>
                        <p className="text-lg font-medium text-elegant-white">
                          {report.unitsBooked}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-stone-gray text-sm">
                          {language === "ar" ? "أفضل مشروع:" : "Top Project:"}
                        </span>
                        <span className="text-elegant-white text-sm">
                          {report.topProject}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-stone-gray text-sm">
                          {language === "ar" ? "أفضل مندوب:" : "Top Sales Rep:"}
                        </span>
                        <span className="text-elegant-white text-sm">
                          {report.topSalesRep}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "payments" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-elegant-white">
                  {language === "ar" ? "تقارير المدفوعات" : "Payment Reports"}
                </h2>
                <motion.button
                  onClick={() => handleDownloadReport("payments")}
                  className="bg-desert-gold text-deep-black px-4 py-2 rounded-lg font-medium hover:bg-warm-sand transition-all duration-300 flex items-center space-x-2 rtl:space-x-reverse"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Download className="h-4 w-4" />
                  <span>{language === "ar" ? "تحميل" : "Download"}</span>
                </motion.button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {paymentReports.map((report, index) => (
                  <motion.div
                    key={report.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-obsidian/50 backdrop-blur-sm rounded-lg p-6 border border-desert-gold/20"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg font-bold text-elegant-white">
                        {report.period}
                      </h3>
                      <DollarSign className="h-6 w-6 text-desert-gold" />
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-stone-gray text-sm">
                          {language === "ar" ? "المحصل" : "Collected"}
                        </p>
                        <p className="text-xl font-bold text-green-400">
                          {report.totalCollected}{" "}
                          {language === "ar" ? "ريال" : "SAR"}
                        </p>
                      </div>
                      <div>
                        <p className="text-stone-gray text-sm">
                          {language === "ar" ? "المعلق" : "Pending"}
                        </p>
                        <p className="text-xl font-bold text-yellow-400">
                          {report.totalPending}{" "}
                          {language === "ar" ? "ريال" : "SAR"}
                        </p>
                      </div>
                      <div>
                        <p className="text-stone-gray text-sm">
                          {language === "ar" ? "المتأخر" : "Overdue"}
                        </p>
                        <p className="text-lg font-medium text-red-400">
                          {report.totalOverdue}{" "}
                          {language === "ar" ? "ريال" : "SAR"}
                        </p>
                      </div>
                      <div>
                        <p className="text-stone-gray text-sm">
                          {language === "ar"
                            ? "معدل التحصيل"
                            : "Collection Rate"}
                        </p>
                        <p className="text-lg font-medium text-elegant-white">
                          {report.collectionRate}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-stone-gray text-sm">
                          {language === "ar"
                            ? "متوسط وقت الدفع:"
                            : "Avg Payment Time:"}
                        </span>
                        <span className="text-elegant-white text-sm">
                          {report.avgPaymentTime}{" "}
                          {language === "ar" ? "يوم" : "days"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-stone-gray text-sm">
                          {language === "ar"
                            ? "المدفوعات المتأخرة:"
                            : "Late Payments:"}
                        </span>
                        <span className="text-red-400 text-sm">
                          {report.latePayments}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "satisfaction" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-elegant-white">
                  {language === "ar"
                    ? "تقارير رضا العملاء"
                    : "Customer Satisfaction Reports"}
                </h2>
                <motion.button
                  onClick={() => handleDownloadReport("satisfaction")}
                  className="bg-desert-gold text-deep-black px-4 py-2 rounded-lg font-medium hover:bg-warm-sand transition-all duration-300 flex items-center space-x-2 rtl:space-x-reverse"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Download className="h-4 w-4" />
                  <span>{language === "ar" ? "تحميل" : "Download"}</span>
                </motion.button>
              </div>

              {customerSatisfaction.map((report, index) => (
                <motion.div
                  key={report.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-obsidian/50 backdrop-blur-sm rounded-lg p-6 border border-desert-gold/20"
                >
                  <div className="flex justify-between items-start mb-6">
                    <h3 className="text-lg font-bold text-elegant-white">
                      {report.period}
                    </h3>
                    <PieChart className="h-6 w-6 text-desert-gold" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-yellow-400">
                        {report.averageRating}
                      </p>
                      <p className="text-stone-gray text-sm">
                        {language === "ar" ? "متوسط التقييم" : "Average Rating"}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-400">
                        {report.satisfied}
                      </p>
                      <p className="text-stone-gray text-sm">
                        {language === "ar" ? "راضون" : "Satisfied"}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-yellow-400">
                        {report.neutral}
                      </p>
                      <p className="text-stone-gray text-sm">
                        {language === "ar" ? "محايدون" : "Neutral"}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-red-400">
                        {report.unsatisfied}
                      </p>
                      <p className="text-stone-gray text-sm">
                        {language === "ar" ? "غير راضون" : "Unsatisfied"}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-stone-gray/10 rounded-lg p-4">
                      <h4 className="text-elegant-white font-medium mb-2">
                        {language === "ar" ? "أكثر الشكاوى" : "Top Complaint"}
                      </h4>
                      <p className="text-red-400">{report.topComplaint}</p>
                    </div>
                    <div className="bg-stone-gray/10 rounded-lg p-4">
                      <h4 className="text-elegant-white font-medium mb-2">
                        {language === "ar" ? "أكثر المدح" : "Top Praise"}
                      </h4>
                      <p className="text-green-400">{report.topPraise}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {activeTab === "projects" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-elegant-white">
                  {language === "ar" ? "أداء المشاريع" : "Project Performance"}
                </h2>
                <motion.button
                  onClick={() => handleDownloadReport("projects")}
                  className="bg-desert-gold text-deep-black px-4 py-2 rounded-lg font-medium hover:bg-warm-sand transition-all duration-300 flex items-center space-x-2 rtl:space-x-reverse"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Download className="h-4 w-4" />
                  <span>{language === "ar" ? "تحميل" : "Download"}</span>
                </motion.button>
              </div>

              <div className="grid grid-cols-1 gap-6">
                {projectPerformance.map((project, index) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-obsidian/50 backdrop-blur-sm rounded-lg p-6 border border-desert-gold/20"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg font-bold text-elegant-white">
                        {project.project}
                      </h3>
                      <Building2 className="h-6 w-6 text-desert-gold" />
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                      <div>
                        <p className="text-stone-gray text-sm">
                          {language === "ar" ? "إجمالي الوحدات" : "Total Units"}
                        </p>
                        <p className="text-xl font-bold text-elegant-white">
                          {project.totalUnits}
                        </p>
                      </div>
                      <div>
                        <p className="text-stone-gray text-sm">
                          {language === "ar" ? "مباع" : "Sold"}
                        </p>
                        <p className="text-xl font-bold text-green-400">
                          {project.soldUnits}
                        </p>
                      </div>
                      <div>
                        <p className="text-stone-gray text-sm">
                          {language === "ar" ? "محجوز" : "Reserved"}
                        </p>
                        <p className="text-xl font-bold text-yellow-400">
                          {project.reservedUnits}
                        </p>
                      </div>
                      <div>
                        <p className="text-stone-gray text-sm">
                          {language === "ar" ? "متاح" : "Available"}
                        </p>
                        <p className="text-xl font-bold text-blue-400">
                          {project.availableUnits}
                        </p>
                      </div>
                      <div>
                        <p className="text-stone-gray text-sm">
                          {language === "ar" ? "معدل البيع" : "Sales Rate"}
                        </p>
                        <p className="text-lg font-medium text-desert-gold">
                          {project.salesRate}
                        </p>
                      </div>
                      <div>
                        <p className="text-stone-gray text-sm">
                          {language === "ar" ? "متوسط السعر" : "Avg Price"}
                        </p>
                        <p className="text-lg font-medium text-elegant-white">
                          {project.avgPrice}
                        </p>
                      </div>
                      <div>
                        <p className="text-stone-gray text-sm">
                          {language === "ar" ? "الإيرادات" : "Revenue"}
                        </p>
                        <p className="text-lg font-medium text-desert-gold">
                          {project.revenue}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}



          {activeTab === "ai" && (
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-obsidian to-deep-black border border-desert-gold/30 rounded-2xl p-6 min-h-[400px]">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-desert-gold/20 flex items-center justify-center animate-pulse">
                    <Brain className="w-6 h-6 text-desert-gold" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">
                      {language === "ar" ? "تحليلات الذكاء الاصطناعي" : "AI Smart Insights"}
                    </h2>
                    <p className="text-stone-gray text-sm">
                      {language === "ar" ? "توصيات وفرص بناءً على البيانات الحية" : "Recommendations based on live data"}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {aiInsights.map((insight) => (
                    <motion.div
                      key={insight.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-stone-gray/10 border border-white/5 rounded-xl p-4 hover:border-desert-gold/30 transition-all cursor-pointer group"
                    >
                      <div className="flex items-start gap-4">
                        <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${insight.type === 'opportunity' ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' :
                          insight.type === 'risk' ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]' : 'bg-blue-500'
                          }`} />
                        <div>
                          <p className="text-elegant-white text-lg leading-relaxed">{insight.text}</p>
                          <div className="flex items-center gap-2 mt-3">
                            <span className="text-xs text-stone-gray font-mono px-2 py-1 rounded bg-black/30 border border-white/10">
                              {language === "ar" ? "درجة الثقة:" : "Confidence:"} {insight.score}%
                            </span>
                            {insight.type === 'opportunity' && (
                              <span className="text-xs text-green-400 flex items-center gap-1">
                                <TrendingUp className="w-3 h-3" /> {language === "ar" ? "فرصة عالية" : "High Opportunity"}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "tasks" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-elegant-white">
                  {language === "ar" ? "المهام المتأخرة" : "Late Tasks Alert"}
                </h2>
                <motion.button
                  onClick={() => handleDownloadReport("tasks")}
                  className="bg-desert-gold text-deep-black px-4 py-2 rounded-lg font-medium hover:bg-warm-sand transition-all duration-300 flex items-center space-x-2 rtl:space-x-reverse"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Download className="h-4 w-4" />
                  <span>{language === "ar" ? "تحميل" : "Download"}</span>
                </motion.button>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {lateTasks.map((task, index) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-obsidian/50 backdrop-blur-sm rounded-lg p-6 border border-red-500/20 hover:border-red-500/40 transition-all duration-300"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 rtl:space-x-reverse mb-2">
                          <StatusBadge
                            status={task.type}
                            variant="info"
                            size="sm"
                          />
                          <StatusBadge
                            status={getPriorityLabel(task.priority)}
                            variant={getPriorityVariant(task.priority)}
                            size="sm"
                          />
                        </div>
                        <h3 className="text-lg font-medium text-elegant-white mb-2">
                          {task.description}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-stone-gray">
                              {language === "ar"
                                ? "تاريخ الاستحقاق:"
                                : "Due Date:"}
                            </span>
                            <span className="text-elegant-white ml-2">
                              {task.dueDate}
                            </span>
                          </div>
                          <div>
                            <span className="text-stone-gray">
                              {language === "ar"
                                ? "أيام التأخير:"
                                : "Days Overdue:"}
                            </span>
                            <span className="text-red-400 ml-2 font-medium">
                              {task.daysOverdue}
                            </span>
                          </div>
                          <div>
                            <span className="text-stone-gray">
                              {language === "ar" ? "المكلف:" : "Assigned To:"}
                            </span>
                            <span className="text-elegant-white ml-2">
                              {task.assignedTo}
                            </span>
                          </div>
                        </div>
                      </div>
                      <motion.button
                        onClick={() => handleViewDetails(task)}
                        className="p-2 text-stone-gray hover:text-desert-gold hover:bg-desert-gold/10 rounded-lg transition-all duration-200"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Eye className="h-5 w-5" />
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Filter Modal */}
        <Modal
          isOpen={showFilterModal}
          onClose={() => setShowFilterModal(false)}
          title={language === "ar" ? "فلترة التقارير" : "Filter Reports"}
        >
          <form className="space-y-6">
            <FormField
              label={language === "ar" ? "الفترة الزمنية" : "Time Period"}
              required
            >
              <SelectContext
                options={[
                  {
                    value: "this-month",
                    label: { ar: "هذا الشهر", en: "This Month" },
                  },
                  {
                    value: "last-month",
                    label: { ar: "الشهر الماضي", en: "Last Month" },
                  },
                  {
                    value: "this-quarter",
                    label: { ar: "هذا الربع", en: "This Quarter" },
                  },
                  {
                    value: "this-year",
                    label: { ar: "هذا العام", en: "This Year" },
                  },
                  {
                    value: "custom",
                    label: { ar: "فترة مخصصة", en: "Custom Range" },
                  },
                ]}
                value={selectedDateRange}
                onChange={setSelectedDateRange}
                placeholder={
                  language === "ar" ? "اختر الفترة" : "Select Period"
                }
                language={language}
              />
            </FormField>

            {selectedDateRange === "custom" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  label={language === "ar" ? "من تاريخ" : "From Date"}
                  required
                >
                  <input
                    type="date"
                    className="w-full bg-stone-gray/10 border border-desert-gold/20 rounded-lg px-4 py-3 text-elegant-white focus:outline-none focus:border-desert-gold transition-colors duration-300"
                  />
                </FormField>

                <FormField
                  label={language === "ar" ? "إلى تاريخ" : "To Date"}
                  required
                >
                  <input
                    type="date"
                    className="w-full bg-stone-gray/10 border border-desert-gold/20 rounded-lg px-4 py-3 text-elegant-white focus:outline-none focus:border-desert-gold transition-colors duration-300"
                  />
                </FormField>
              </div>
            )}

            <FormField label={language === "ar" ? "المشروع" : "Project"}>
              <SelectContext
                options={[
                  {
                    value: "all",
                    label: { ar: "جميع المشاريع", en: "All Projects" },
                  },
                  {
                    value: "elegance",
                    label: { ar: "مجمع الأناقة", en: "Elegance Complex" },
                  },
                  {
                    value: "trade",
                    label: { ar: "برج التجارة", en: "Trade Tower" },
                  },
                  {
                    value: "tranquil",
                    label: { ar: "قرية الهدوء", en: "Tranquil Village" },
                  },
                ]}
                value={""}
                onChange={() => { }}
                placeholder={
                  language === "ar" ? "اختر المشروع" : "Select Project"
                }
                language={language}
              />
            </FormField>

            <FormField
              label={
                language === "ar" ? "مندوب المبيعات" : "Sales Representative"
              }
            >
              <SelectContext
                options={[
                  {
                    value: "all",
                    label: { ar: "جميع المندوبين", en: "All Representatives" },
                  },
                  {
                    value: "fatima",
                    label: { ar: "فاطمة الحربي", en: "Fatima Al-Harbi" },
                  },
                  {
                    value: "ahmed",
                    label: { ar: "أحمد العتيبي", en: "Ahmed Al-Otaibi" },
                  },
                ]}
                value={""}
                onChange={() => { }}
                placeholder={
                  language === "ar" ? "اختر المندوب" : "Select Representative"
                }
                language={language}
              />
            </FormField>

            <div className="flex justify-end space-x-4 rtl:space-x-reverse pt-6">
              <motion.button
                type="button"
                onClick={() => setShowFilterModal(false)}
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
                {language === "ar" ? "تطبيق الفلتر" : "Apply Filter"}
              </motion.button>
            </div>
          </form>
        </Modal>
      </div>
    </PageWrapper >
  );
}
