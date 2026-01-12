"use client";

import { motion } from "framer-motion";
import { useDirection } from "@/context/DirectionContext";
import PageWrapper from "@/components/PageWrapper";
import {
  Users,
  Building2,
  CreditCard,
  TrendingUp,
  Calendar,
  FileText,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

export default function DashboardPage() {
  const { language } = useDirection();

  const stats = [
    {
      id: "ifragh",
      icon: FileText,
      label: language === "ar" ? "الإفراغات الشهرية" : "Monthly Conveyances",
      value: "45",
      change: "+12%",
      changeType: "positive",
      subValue: language === "ar" ? "عملية هذا الشهر" : "transactions this month"
    },
    {
      id: "maintenance",
      icon: AlertCircle,
      label: language === "ar" ? "طلبات الصيانة" : "Maintenance Requests",
      value: "12 / 85",
      change: language === "ar" ? "أسبوعي / شهري" : "Weekly / Monthly",
      changeType: "neutral",
    },
    {
      id: "satisfaction",
      icon: CheckCircle,
      label: language === "ar" ? "رضا العملاء" : "Customer Satisfaction",
      value: "94%",
      change: "+2.1%",
      changeType: "positive",
      subValue: language === "ar" ? "المبيعات والصيانة" : "Sales & Maintenance"
    },
    {
      id: "closed-maintenance",
      icon: CheckCircle,
      label: language === "ar" ? "صيانة مغلقة (أ / ش)" : "Closed Maintenance (W/M)",
      value: "10 / 78",
      change: "+5%",
      changeType: "positive",
    },
    {
      id: "reservations",
      icon: Calendar,
      label: language === "ar" ? "إجمالي الحجوزات" : "Total Reservations",
      value: "1,247",
      change: "+18%",
      changeType: "positive",
    },
    {
      id: "revenue",
      icon: CreditCard,
      label: language === "ar" ? "الإيرادات" : "Revenue",
      value: "2.4M",
      change: "+8%",
      changeType: "positive",
      subValue: language === "ar" ? "شهرية (24M سنوية)" : "Monthly (24M Yearly)"
    },
    {
      id: "inventory",
      icon: Building2,
      label: language === "ar" ? "الوحدات المتوفرة" : "Available Units",
      value: "85",
      change: "-12",
      changeType: "negative", // Negative change in inventory (sales) is good? Context depends. Usually stats show growth. Low inventory might be bad or good. Let's keep it neutral or negative (units went down).
      subValue: language === "ar" ? "شقة جاهزة" : "Ready apartments"
    },
    {
      id: "owners",
      icon: Users,
      label: language === "ar" ? "إجمالي الملاك" : "Total Owners",
      value: "342",
      change: "+15",
      changeType: "positive",
    },
  ];

  const recentActivities = [
    {
      id: 1,
      type: "sale",
      icon: CheckCircle,
      title:
        language === "ar"
          ? "تم إتمام بيع وحدة في مجمع الأناقة"
          : "Unit sale completed in Elegance Complex",
      time: language === "ar" ? "منذ ساعتين" : "2 hours ago",
      status: "success",
    },
    {
      id: 2,
      type: "meeting",
      icon: Calendar,
      title:
        language === "ar"
          ? "اجتماع مع عميل جديد مجدول"
          : "New client meeting scheduled",
      time: language === "ar" ? "منذ 4 ساعات" : "4 hours ago",
      status: "info",
    },
    {
      id: 3,
      type: "contract",
      icon: FileText,
      title:
        language === "ar"
          ? "عقد جديد يحتاج للمراجعة"
          : "New contract needs review",
      time: language === "ar" ? "منذ 6 ساعات" : "6 hours ago",
      status: "warning",
    },
    {
      id: 4,
      type: "payment",
      icon: AlertCircle,
      title:
        language === "ar"
          ? "دفعة متأخرة تحتاج متابعة"
          : "Overdue payment needs follow-up",
      time: language === "ar" ? "منذ يوم" : "1 day ago",
      status: "error",
    },
  ];

  const quickActions = [
    {
      id: "add-customer",
      label: language === "ar" ? "إضافة عميل جديد" : "Add New Customer",
      href: "/dashboard/customers",
      icon: Users,
      color: "bg-blue-500",
    },
    {
      id: "create-contract",
      label: language === "ar" ? "إنشاء عقد" : "Create Contract",
      href: "/dashboard/contracts?tab=create",
      icon: FileText,
      color: "bg-green-500",
    },
    {
      id: "schedule-meeting",
      label: language === "ar" ? "جدولة اجتماع" : "Schedule Meeting",
      href: "/dashboard/calendar/new",
      icon: Calendar,
      color: "bg-purple-500",
    },
    {
      id: "view-reports",
      label: language === "ar" ? "عرض التقارير" : "View Reports",
      href: "/dashboard/reports",
      icon: TrendingUp,
      color: "bg-orange-500",
    },
  ];

  return (
    <PageWrapper>
      <div className="space-y-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-r from-obsidian to-stone-gray/20 rounded-xl p-8 border border-desert-gold/20"
        >
          <h1 className="text-3xl font-bold text-elegant-white mb-2">
            {language === "ar" ? "مرحباً بك، أحمد" : "Welcome back, Ahmed"}
          </h1>
          <p className="text-stone-gray text-lg">
            {language === "ar"
              ? "إليك نظرة سريعة على أداء شركتك اليوم"
              : "Here's a quick overview of your company's performance today"}
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              className="bg-obsidian/50 backdrop-blur-sm rounded-xl p-6 border border-desert-gold/20 hover:border-desert-gold/40 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-stone-gray text-sm font-medium">
                    {stat.label}
                  </p>
                  <p className="text-2xl font-bold text-elegant-white mt-1">
                    {stat.value}
                  </p>

                  {/* Sub-value or Change display */}
                  <div className="flex flex-col mt-1">
                    {/* Primary Change Indicator */}
                    <span
                      className={`text-xs font-medium ${stat.changeType === "positive"
                          ? "text-green-400"
                          : stat.changeType === "negative"
                            ? "text-red-400"
                            : "text-stone-gray"
                        }`}
                    >
                      {stat.change}
                    </span>

                    {/* Secondary Description */}
                    {stat.subValue && (
                      <span className="text-xs text-stone-gray/60 mt-0.5">
                        {stat.subValue}
                      </span>
                    )}
                  </div>
                </div>
                <div className="p-3 bg-desert-gold/20 rounded-lg">
                  <stat.icon className="h-6 w-6 text-desert-gold" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Activities */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-obsidian/50 backdrop-blur-sm rounded-xl p-6 border border-desert-gold/20"
          >
            <h2 className="text-xl font-bold text-elegant-white mb-6">
              {language === "ar" ? "الأنشطة الأخيرة" : "Recent Activities"}
            </h2>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  className="flex items-start space-x-3 rtl:space-x-reverse p-3 rounded-lg hover:bg-stone-gray/10 transition-colors duration-200"
                >
                  <div
                    className={`p-2 rounded-full ${activity.status === "success"
                      ? "bg-green-500/20 text-green-400"
                      : activity.status === "info"
                        ? "bg-blue-500/20 text-blue-400"
                        : activity.status === "warning"
                          ? "bg-yellow-500/20 text-yellow-400"
                          : "bg-red-500/20 text-red-400"
                      }`}
                  >
                    <activity.icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-elegant-white text-sm font-medium">
                      {activity.title}
                    </p>
                    <p className="text-stone-gray text-xs mt-1">
                      {activity.time}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-obsidian/50 backdrop-blur-sm rounded-xl p-6 border border-desert-gold/20"
          >
            <h2 className="text-xl font-bold text-elegant-white mb-6">
              {language === "ar" ? "إجراءات سريعة" : "Quick Actions"}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {quickActions.map((action, index) => (
                <motion.a
                  key={action.id}
                  href={action.href}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  className="flex items-center space-x-3 rtl:space-x-reverse p-4 rounded-lg border border-desert-gold/20 hover:border-desert-gold/40 hover:bg-stone-gray/10 transition-all duration-200 group"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div
                    className={`p-2 rounded-lg ${action.color}/20 group-hover:${action.color}/30 transition-colors duration-200`}
                  >
                    <action.icon
                      className={`h-5 w-5 text-${action.color.split("-")[1]
                        }-400`}
                    />
                  </div>
                  <span className="text-elegant-white text-sm font-medium group-hover:text-desert-gold transition-colors duration-200">
                    {action.label}
                  </span>
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </PageWrapper>
  );
}
