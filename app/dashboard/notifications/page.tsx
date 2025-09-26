"use client";

import { motion } from "framer-motion";
import { useDirection } from "@/context/DirectionContext";
import { useState } from "react";
import {
  Plus,
  Send,
  MessageSquare,
  Bell,
  Users,
  Calendar,
  CheckCircle,
  Clock,
  User,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
} from "lucide-react";
import PageWrapper from "@/components/PageWrapper";
import DataTable from "@/components/shared/DataTable";
import StatusBadge from "@/components/shared/StatusBadge";
import Modal from "@/components/shared/Modal";
import FormField from "@/components/shared/FormField";
import SelectContext from "@/components/ui/select-context";

export default function NotificationsPage() {
  const { language } = useDirection();
  const [activeTab, setActiveTab] = useState("communications");
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [showCommunicationModal, setShowCommunicationModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  // Mock data
  const communications = [
    {
      id: 1,
      client: language === "ar" ? "أحمد العتيبي" : "Ahmed Al-Otaibi",
      type: language === "ar" ? "مكالمة هاتفية" : "Phone Call",
      subject:
        language === "ar" ? "استفسار عن التشطيبات" : "Inquiry about finishes",
      date: "2024-01-22",
      time: "10:30",
      duration: "15 دقيقة",
      notes:
        language === "ar"
          ? "العميل راضي عن التقدم ويريد تحديث في التشطيبات"
          : "Client satisfied with progress, wants update on finishes",
      followUp: "2024-01-25",
      staff: language === "ar" ? "فاطمة الحربي" : "Fatima Al-Harbi",
    },
    {
      id: 2,
      client: language === "ar" ? "خالد المطيري" : "Khalid Al-Mutairi",
      type: language === "ar" ? "واتساب" : "WhatsApp",
      subject: language === "ar" ? "طلب معاينة الوحدة" : "Unit viewing request",
      date: "2024-01-22",
      time: "14:15",
      duration: null,
      notes:
        language === "ar"
          ? "طلب معاينة الوحدة V15 يوم الخميس"
          : "Requested viewing of unit V15 on Thursday",
      followUp: "2024-01-24",
      staff: language === "ar" ? "أحمد العتيبي" : "Ahmed Al-Otaibi",
    },
    {
      id: 3,
      client: language === "ar" ? "نورا السالم" : "Nora Al-Salem",
      type: language === "ar" ? "اجتماع" : "Meeting",
      subject:
        language === "ar" ? "مناقشة خطة الدفع" : "Payment plan discussion",
      date: "2024-01-21",
      time: "16:00",
      duration: "45 دقيقة",
      notes:
        language === "ar"
          ? "تم الاتفاق على خطة دفع جديدة بأقساط شهرية"
          : "Agreed on new payment plan with monthly installments",
      followUp: null,
      staff: language === "ar" ? "فاطمة الحربي" : "Fatima Al-Harbi",
    },
  ];

  const reminders = [
    {
      id: 1,
      title:
        language === "ar"
          ? "متابعة دفعة أحمد العتيبي"
          : "Follow up Ahmed Al-Otaibi payment",
      description:
        language === "ar"
          ? "تذكير بالدفعة المستحقة للوحدة A101"
          : "Reminder for due payment for unit A101",
      dueDate: "2024-01-25",
      assignedTo: language === "ar" ? "فاطمة الحربي" : "Fatima Al-Harbi",
      priority: "high",
      status: "pending",
      type: "payment",
    },
    {
      id: 2,
      title:
        language === "ar"
          ? "اجتماع مع خالد المطيري"
          : "Meeting with Khalid Al-Mutairi",
      description:
        language === "ar"
          ? "مناقشة تفاصيل العقد النهائي"
          : "Discuss final contract details",
      dueDate: "2024-01-24",
      assignedTo: language === "ar" ? "أحمد العتيبي" : "Ahmed Al-Otaibi",
      priority: "medium",
      status: "pending",
      type: "meeting",
    },
    {
      id: 3,
      title:
        language === "ar"
          ? "تسليم مفاتيح الوحدة C302"
          : "Unit C302 key handover",
      description:
        language === "ar"
          ? "تسليم المفاتيح لنورا السالم"
          : "Key handover to Nora Al-Salem",
      dueDate: "2024-01-26",
      assignedTo: language === "ar" ? "خالد المطيري" : "Khalid Al-Mutairi",
      priority: "high",
      status: "pending",
      type: "handover",
    },
  ];

  const internalMessages = [
    {
      id: 1,
      from: language === "ar" ? "أحمد العتيبي" : "Ahmed Al-Otaibi",
      to: language === "ar" ? "فاطمة الحربي" : "Fatima Al-Harbi",
      subject: language === "ar" ? "تحديث حالة العميل" : "Client status update",
      message:
        language === "ar"
          ? 'يرجى تحديث حالة العميل خالد المطيري إلى "عقد موقع"'
          : 'Please update Khalid Al-Mutairi status to "Contract Signed"',
      timestamp: "2024-01-22 11:30",
      status: "unread",
      priority: "normal",
    },
    {
      id: 2,
      from: language === "ar" ? "خالد المطيري" : "Khalid Al-Mutairi",
      to: language === "ar" ? "الجميع" : "All Team",
      subject:
        language === "ar" ? "تحديث نظام الصيانة" : "Maintenance system update",
      message:
        language === "ar"
          ? "تم تحديث نظام إدارة طلبات الصيانة، يرجى مراجعة الدليل الجديد"
          : "Maintenance management system updated, please review new guide",
      timestamp: "2024-01-22 09:15",
      status: "read",
      priority: "high",
    },
  ];

  const notifications = [
    {
      id: 1,
      type: "booking",
      title: language === "ar" ? "حجز جديد" : "New Booking",
      message:
        language === "ar"
          ? "تم إنشاء حجز جديد للعميل سعد الدوسري"
          : "New booking created for client Saad Al-Dosari",
      timestamp: "2024-01-22 15:30",
      read: false,
      priority: "high",
    },
    {
      id: 2,
      type: "payment",
      title: language === "ar" ? "دفعة مستلمة" : "Payment Received",
      message:
        language === "ar"
          ? "تم استلام دفعة من أحمد العتيبي بقيمة 250,000 ريال"
          : "Payment received from Ahmed Al-Otaibi for 250,000 SAR",
      timestamp: "2024-01-22 14:20",
      read: false,
      priority: "medium",
    },
    {
      id: 3,
      type: "maintenance",
      title: language === "ar" ? "طلب صيانة جديد" : "New Maintenance Request",
      message:
        language === "ar"
          ? "طلب صيانة جديد من فاطمة الحربي للوحدة B205"
          : "New maintenance request from Fatima Al-Harbi for unit B205",
      timestamp: "2024-01-22 13:45",
      read: true,
      priority: "low",
    },
  ];

  const tabs = [
    {
      id: "communications",
      label: language === "ar" ? "سجل التواصل" : "Communication Log",
    },
    {
      id: "reminders",
      label: language === "ar" ? "التذكيرات" : "Task Reminders",
    },
    {
      id: "messages",
      label: language === "ar" ? "الرسائل الداخلية" : "Internal Messages",
    },
    {
      id: "notifications",
      label: language === "ar" ? "مركز الإشعارات" : "Notification Center",
    },
  ];

  const getTypeVariant = (type: string) => {
    switch (type) {
      case "phone":
      case "مكالمة هاتفية":
        return "info";
      case "whatsapp":
      case "واتساب":
        return "success";
      case "meeting":
      case "اجتماع":
        return "warning";
      case "email":
      case "بريد إلكتروني":
        return "default";
      default:
        return "default";
    }
  };

  const getPriorityVariant = (priority: string) => {
    switch (priority) {
      case "high":
        return "error";
      case "medium":
        return "warning";
      case "low":
      case "normal":
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
      normal: { ar: "عادية", en: "Normal" },
    };
    return labels[priority]?.[language] || priority;
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, { ar: string; en: string }> = {
      pending: { ar: "معلق", en: "Pending" },
      completed: { ar: "مكتمل", en: "Completed" },
      read: { ar: "مقروء", en: "Read" },
      unread: { ar: "غير مقروء", en: "Unread" },
    };
    return labels[status]?.[language] || status;
  };

  const communicationColumns = [
    {
      key: "client",
      label: language === "ar" ? "العميل" : "Client",
      sortable: true,
    },
    {
      key: "type",
      label: language === "ar" ? "النوع" : "Type",
      render: (value: string) => (
        <StatusBadge status={value} variant={getTypeVariant(value)} size="sm" />
      ),
    },
    {
      key: "subject",
      label: language === "ar" ? "الموضوع" : "Subject",
      render: (value: string) => (
        <span className="text-elegant-white">{value}</span>
      ),
    },
    {
      key: "date",
      label: language === "ar" ? "التاريخ" : "Date",
      render: (value: string, row: any) => (
        <div>
          <div className="text-elegant-white">{value}</div>
          <div className="text-stone-gray text-sm">{row.time}</div>
        </div>
      ),
    },
    {
      key: "staff",
      label: language === "ar" ? "الموظف" : "Staff",
      render: (value: string) => (
        <span className="text-stone-gray">{value}</span>
      ),
    },
    {
      key: "followUp",
      label: language === "ar" ? "المتابعة" : "Follow Up",
      render: (value: string | null) => (
        <span className={value ? "text-yellow-400" : "text-stone-gray"}>
          {value || (language === "ar" ? "لا توجد" : "None")}
        </span>
      ),
    },
  ];

  const reminderColumns = [
    {
      key: "title",
      label: language === "ar" ? "العنوان" : "Title",
      sortable: true,
      render: (value: string) => (
        <span className="text-elegant-white font-medium">{value}</span>
      ),
    },
    {
      key: "type",
      label: language === "ar" ? "النوع" : "Type",
      render: (value: string) => (
        <StatusBadge status={value} variant="info" size="sm" />
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
      key: "assignedTo",
      label: language === "ar" ? "المكلف" : "Assigned To",
      render: (value: string) => (
        <span className="text-stone-gray">{value}</span>
      ),
    },
    {
      key: "priority",
      label: language === "ar" ? "الأولوية" : "Priority",
      render: (value: string) => (
        <StatusBadge
          status={getPriorityLabel(value)}
          variant={getPriorityVariant(value)}
          size="sm"
        />
      ),
    },
    {
      key: "status",
      label: language === "ar" ? "الحالة" : "Status",
      render: (value: string) => (
        <StatusBadge
          status={getStatusLabel(value)}
          variant={value === "completed" ? "success" : "warning"}
          size="sm"
        />
      ),
    },
  ];

  const messageColumns = [
    {
      key: "from",
      label: language === "ar" ? "من" : "From",
      sortable: true,
    },
    {
      key: "to",
      label: language === "ar" ? "إلى" : "To",
      render: (value: string) => (
        <span className="text-stone-gray">{value}</span>
      ),
    },
    {
      key: "subject",
      label: language === "ar" ? "الموضوع" : "Subject",
      render: (value: string) => (
        <span className="text-elegant-white">{value}</span>
      ),
    },
    {
      key: "timestamp",
      label: language === "ar" ? "الوقت" : "Timestamp",
      render: (value: string) => (
        <span className="text-stone-gray">{value}</span>
      ),
    },
    {
      key: "status",
      label: language === "ar" ? "الحالة" : "Status",
      render: (value: string) => (
        <StatusBadge
          status={getStatusLabel(value)}
          variant={value === "read" ? "success" : "warning"}
          size="sm"
        />
      ),
    },
    {
      key: "priority",
      label: language === "ar" ? "الأولوية" : "Priority",
      render: (value: string) => (
        <StatusBadge
          status={getPriorityLabel(value)}
          variant={getPriorityVariant(value)}
          size="sm"
        />
      ),
    },
  ];

  const handleView = (item: any) => {
    setSelectedItem(item);
  };

  const handleEdit = (item: any) => {
    setSelectedItem(item);
    if (activeTab === "communications") {
      setShowCommunicationModal(true);
    } else if (activeTab === "reminders") {
      setShowReminderModal(true);
    }
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

  return (
    <PageWrapper>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-elegant-white">
              {language === "ar"
                ? "الإشعارات والتواصل"
                : "Notifications & Communication"}
            </h1>
            <p className="text-stone-gray mt-1">
              {language === "ar"
                ? "إدارة التواصل والإشعارات والتذكيرات"
                : "Manage communications, notifications, and reminders"}
            </p>
          </div>
          <div className="flex space-x-3 rtl:space-x-reverse">
            <motion.button
              onClick={() => setShowReminderModal(true)}
              className="bg-stone-gray/20 text-elegant-white px-6 py-3 rounded-lg font-medium hover:bg-stone-gray/30 transition-all duration-300 flex items-center space-x-2 rtl:space-x-reverse"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Bell className="h-5 w-5" />
              <span>{language === "ar" ? "تذكير جديد" : "New Reminder"}</span>
            </motion.button>
            <motion.button
              onClick={() => setShowMessageModal(true)}
              className="bg-desert-gold text-deep-black px-6 py-3 rounded-lg font-medium hover:bg-warm-sand transition-all duration-300 flex items-center space-x-2 rtl:space-x-reverse"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <MessageSquare className="h-5 w-5" />
              <span>{language === "ar" ? "رسالة جديدة" : "New Message"}</span>
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
          {activeTab === "communications" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-elegant-white">
                  {language === "ar"
                    ? "سجل التواصل مع العملاء"
                    : "Client Communication Log"}
                </h2>
                <motion.button
                  onClick={() => setShowCommunicationModal(true)}
                  className="bg-desert-gold text-deep-black px-4 py-2 rounded-lg font-medium hover:bg-warm-sand transition-all duration-300 flex items-center space-x-2 rtl:space-x-reverse"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Plus className="h-4 w-4" />
                  <span>
                    {language === "ar" ? "إضافة تواصل" : "Add Communication"}
                  </span>
                </motion.button>
              </div>

              <DataTable
                columns={communicationColumns}
                data={communications}
                searchPlaceholder={
                  language === "ar"
                    ? "البحث في سجل التواصل..."
                    : "Search communication log..."
                }
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </div>
          )}

          {activeTab === "reminders" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-elegant-white">
                  {language === "ar" ? "التذكيرات والمهام" : "Task Reminders"}
                </h2>
                <motion.button
                  onClick={() => setShowReminderModal(true)}
                  className="bg-desert-gold text-deep-black px-4 py-2 rounded-lg font-medium hover:bg-warm-sand transition-all duration-300 flex items-center space-x-2 rtl:space-x-reverse"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Plus className="h-4 w-4" />
                  <span>
                    {language === "ar" ? "تذكير جديد" : "New Reminder"}
                  </span>
                </motion.button>
              </div>

              <DataTable
                columns={reminderColumns}
                data={reminders}
                searchPlaceholder={
                  language === "ar"
                    ? "البحث في التذكيرات..."
                    : "Search reminders..."
                }
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </div>
          )}

          {activeTab === "messages" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-elegant-white">
                  {language === "ar" ? "الرسائل الداخلية" : "Internal Messages"}
                </h2>
                <motion.button
                  onClick={() => setShowMessageModal(true)}
                  className="bg-desert-gold text-deep-black px-4 py-2 rounded-lg font-medium hover:bg-warm-sand transition-all duration-300 flex items-center space-x-2 rtl:space-x-reverse"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Plus className="h-4 w-4" />
                  <span>
                    {language === "ar" ? "رسالة جديدة" : "New Message"}
                  </span>
                </motion.button>
              </div>

              <DataTable
                columns={messageColumns}
                data={internalMessages}
                searchPlaceholder={
                  language === "ar"
                    ? "البحث في الرسائل..."
                    : "Search messages..."
                }
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-elegant-white">
                  {language === "ar" ? "مركز الإشعارات" : "Notification Center"}
                </h2>
                <div className="flex space-x-2 rtl:space-x-reverse">
                  <motion.button
                    className="bg-stone-gray/20 text-elegant-white px-4 py-2 rounded-lg font-medium hover:bg-stone-gray/30 transition-all duration-300 text-sm"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {language === "ar"
                      ? "تحديد الكل كمقروء"
                      : "Mark All as Read"}
                  </motion.button>
                  <motion.button
                    className="bg-stone-gray/20 text-elegant-white px-4 py-2 rounded-lg font-medium hover:bg-stone-gray/30 transition-all duration-300 text-sm"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {language === "ar" ? "حذف المقروءة" : "Clear Read"}
                  </motion.button>
                </div>
              </div>

              <div className="space-y-4">
                {notifications.map((notification, index) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`bg-obsidian/50 backdrop-blur-sm rounded-lg p-6 border transition-all duration-300 hover:border-desert-gold/40 ${
                      notification.read
                        ? "border-desert-gold/20"
                        : "border-desert-gold/40 bg-desert-gold/5"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4 rtl:space-x-reverse flex-1">
                        <div
                          className={`p-2 rounded-lg ${
                            notification.type === "booking"
                              ? "bg-blue-500/20 text-blue-400"
                              : notification.type === "payment"
                              ? "bg-green-500/20 text-green-400"
                              : "bg-yellow-500/20 text-yellow-400"
                          }`}
                        >
                          {notification.type === "booking" ? (
                            <Calendar className="h-5 w-5" />
                          ) : notification.type === "payment" ? (
                            <CheckCircle className="h-5 w-5" />
                          ) : (
                            <Bell className="h-5 w-5" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 rtl:space-x-reverse mb-1">
                            <h3 className="text-lg font-medium text-elegant-white">
                              {notification.title}
                            </h3>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-desert-gold rounded-full" />
                            )}
                            <StatusBadge
                              status={getPriorityLabel(notification.priority)}
                              variant={getPriorityVariant(
                                notification.priority
                              )}
                              size="sm"
                            />
                          </div>
                          <p className="text-stone-gray mb-2">
                            {notification.message}
                          </p>
                          <div className="flex items-center space-x-2 rtl:space-x-reverse text-sm text-stone-gray">
                            <Clock className="h-4 w-4" />
                            <span>{notification.timestamp}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2 rtl:space-x-reverse">
                        <motion.button
                          className="p-2 text-stone-gray hover:text-desert-gold hover:bg-desert-gold/10 rounded-lg transition-all duration-200"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Eye className="h-4 w-4" />
                        </motion.button>
                        {!notification.read && (
                          <motion.button
                            className="p-2 text-stone-gray hover:text-green-400 hover:bg-green-400/10 rounded-lg transition-all duration-200"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <CheckCircle className="h-4 w-4" />
                          </motion.button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* New Message Modal */}
        <Modal
          isOpen={showMessageModal}
          onClose={() => setShowMessageModal(false)}
          title={
            language === "ar" ? "رسالة داخلية جديدة" : "New Internal Message"
          }
          size="lg"
        >
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField label={language === "ar" ? "إلى" : "To"} required>
                <SelectContext
                  options={[
                    {
                      value: "unassigned",
                      label: { ar: "اختر المستلم", en: "Select Recipient" },
                    },
                    {
                      value: "all",
                      label: { ar: "جميع الفريق", en: "All Team" },
                    },
                    {
                      value: "fatima",
                      label: { ar: "فاطمة الحربي", en: "Fatima Al-Harbi" },
                    },
                    {
                      value: "ahmed",
                      label: { ar: "أحمد العتيبي", en: "Ahmed Al-Otaibi" },
                    },
                    {
                      value: "khalid",
                      label: { ar: "خالد المطيري", en: "Khalid Al-Mutairi" },
                    },
                  ]}
                  value=""
                  onChange={() => {}}
                  placeholder={
                    language === "ar" ? "اختر المستلم" : "Select Recipient"
                  }
                  language={language}
                />
              </FormField>

              <FormField
                label={language === "ar" ? "الأولوية" : "Priority"}
                required
              >
                <SelectContext
                  options={[
                    { value: "normal", label: { ar: "عادية", en: "Normal" } },
                    { value: "high", label: { ar: "عالية", en: "High" } },
                    { value: "low", label: { ar: "منخفضة", en: "Low" } },
                  ]}
                  value="normal"
                  onChange={() => {}}
                  placeholder={
                    language === "ar" ? "اختر الأولوية" : "Select Priority"
                  }
                  language={language}
                />
              </FormField>
            </div>

            <FormField
              label={language === "ar" ? "الموضوع" : "Subject"}
              required
            >
              <input
                type="text"
                className="w-full bg-stone-gray/10 border border-desert-gold/20 rounded-lg px-4 py-3 text-elegant-white placeholder-stone-gray focus:outline-none focus:border-desert-gold transition-colors duration-300"
                placeholder={
                  language === "ar"
                    ? "أدخل موضوع الرسالة"
                    : "Enter message subject"
                }
              />
            </FormField>

            <FormField
              label={language === "ar" ? "الرسالة" : "Message"}
              required
            >
              <textarea
                rows={6}
                className="w-full bg-stone-gray/10 border border-desert-gold/20 rounded-lg px-4 py-3 text-elegant-white placeholder-stone-gray focus:outline-none focus:border-desert-gold transition-colors duration-300 resize-none"
                placeholder={
                  language === "ar"
                    ? "اكتب رسالتك هنا..."
                    : "Write your message here..."
                }
              />
            </FormField>

            <div className="flex justify-end space-x-4 rtl:space-x-reverse pt-6">
              <motion.button
                type="button"
                onClick={() => setShowMessageModal(false)}
                className="px-6 py-3 border border-desert-gold/20 text-stone-gray rounded-lg hover:bg-stone-gray/10 transition-all duration-300"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {language === "ar" ? "إلغاء" : "Cancel"}
              </motion.button>
              <motion.button
                type="submit"
                className="px-6 py-3 bg-desert-gold text-deep-black rounded-lg font-medium hover:bg-warm-sand transition-all duration-300 flex items-center space-x-2 rtl:space-x-reverse"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Send className="h-4 w-4" />
                <span>{language === "ar" ? "إرسال" : "Send"}</span>
              </motion.button>
            </div>
          </form>
        </Modal>

        {/* New Reminder Modal */}
        <Modal
          isOpen={showReminderModal}
          onClose={() => {
            setShowReminderModal(false);
            setSelectedItem(null);
          }}
          title={
            selectedItem
              ? language === "ar"
                ? "تعديل التذكير"
                : "Edit Reminder"
              : language === "ar"
              ? "تذكير جديد"
              : "New Reminder"
          }
          size="lg"
        >
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                label={language === "ar" ? "العنوان" : "Title"}
                required
              >
                <input
                  type="text"
                  defaultValue={selectedItem?.title || ""}
                  className="w-full bg-stone-gray/10 border border-desert-gold/20 rounded-lg px-4 py-3 text-elegant-white placeholder-stone-gray focus:outline-none focus:border-desert-gold transition-colors duration-300"
                  placeholder={
                    language === "ar"
                      ? "أدخل عنوان التذكير"
                      : "Enter reminder title"
                  }
                />
              </FormField>

              <FormField label={language === "ar" ? "النوع" : "Type"} required>
                <SelectContext
                  options={[
                    { value: "payment", label: { ar: "دفعة", en: "Payment" } },
                    {
                      value: "meeting",
                      label: { ar: "اجتماع", en: "Meeting" },
                    },
                    {
                      value: "handover",
                      label: { ar: "تسليم", en: "Handover" },
                    },
                    { value: "task", label: { ar: "مهمة", en: "Task" } },
                  ]}
                  value={selectedItem?.type || "task"}
                  onChange={() => {}}
                  placeholder={language === "ar" ? "اختر النوع" : "Select Type"}
                  language={language}
                />
              </FormField>

              <FormField
                label={language === "ar" ? "تاريخ الاستحقاق" : "Due Date"}
                required
              >
                <input
                  type="date"
                  defaultValue={selectedItem?.dueDate || ""}
                  className="w-full bg-stone-gray/10 border border-desert-gold/20 rounded-lg px-4 py-3 text-elegant-white focus:outline-none focus:border-desert-gold transition-colors duration-300"
                />
              </FormField>

              <FormField
                label={language === "ar" ? "المكلف" : "Assign To"}
                required
              >
                <SelectContext
                  options={[
                    {
                      value: "unassigned",
                      label: { ar: "اختر الموظف", en: "Select Staff" },
                    },
                    {
                      value: "fatima",
                      label: { ar: "فاطمة الحربي", en: "Fatima Al-Harbi" },
                    },
                    {
                      value: "ahmed",
                      label: { ar: "أحمد العتيبي", en: "Ahmed Al-Otaibi" },
                    },
                    {
                      value: "khalid",
                      label: { ar: "خالد المطيري", en: "Khalid Al-Mutairi" },
                    },
                  ]}
                  value=""
                  onChange={() => {}}
                  placeholder={
                    language === "ar" ? "اختر الموظف" : "Select Staff"
                  }
                  language={language}
                />
              </FormField>

              <FormField
                label={language === "ar" ? "الأولوية" : "Priority"}
                required
              >
                <SelectContext
                  options={[
                    { value: "low", label: { ar: "منخفضة", en: "Low" } },
                    { value: "medium", label: { ar: "متوسطة", en: "Medium" } },
                    { value: "high", label: { ar: "عالية", en: "High" } },
                  ]}
                  value={selectedItem?.priority || "medium"}
                  onChange={() => {}}
                  placeholder={
                    language === "ar" ? "اختر الأولوية" : "Select Priority"
                  }
                  language={language}
                />
              </FormField>
            </div>

            <FormField
              label={language === "ar" ? "الوصف" : "Description"}
              required
            >
              <textarea
                rows={4}
                defaultValue={selectedItem?.description || ""}
                className="w-full bg-stone-gray/10 border border-desert-gold/20 rounded-lg px-4 py-3 text-elegant-white placeholder-stone-gray focus:outline-none focus:border-desert-gold transition-colors duration-300 resize-none"
                placeholder={
                  language === "ar"
                    ? "أدخل وصف التذكير..."
                    : "Enter reminder description..."
                }
              />
            </FormField>

            <div className="flex justify-end space-x-4 rtl:space-x-reverse pt-6">
              <motion.button
                type="button"
                onClick={() => {
                  setShowReminderModal(false);
                  setSelectedItem(null);
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
                {selectedItem
                  ? language === "ar"
                    ? "تحديث"
                    : "Update"
                  : language === "ar"
                  ? "إنشاء التذكير"
                  : "Create Reminder"}
              </motion.button>
            </div>
          </form>
        </Modal>

        {/* Add Communication Modal */}
        <Modal
          isOpen={showCommunicationModal}
          onClose={() => {
            setShowCommunicationModal(false);
            setSelectedItem(null);
          }}
          title={
            selectedItem
              ? language === "ar"
                ? "تعديل التواصل"
                : "Edit Communication"
              : language === "ar"
              ? "إضافة تواصل جديد"
              : "Add New Communication"
          }
          size="lg"
        >
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                label={language === "ar" ? "العميل" : "Client"}
                required
              >
                <select
                  defaultValue=""
                  className="w-full bg-stone-gray/10 border border-desert-gold/20 rounded-lg px-4 py-3 text-elegant-white focus:outline-none focus:border-desert-gold transition-colors duration-300"
                >
                  <option value="" className="bg-obsidian">
                    {language === "ar" ? "اختر العميل" : "Select Client"}
                  </option>
                  <option value="ahmed" className="bg-obsidian">
                    {language === "ar" ? "أحمد العتيبي" : "Ahmed Al-Otaibi"}
                  </option>
                  <option value="fatima" className="bg-obsidian">
                    {language === "ar" ? "فاطمة الحربي" : "Fatima Al-Harbi"}
                  </option>
                  <option value="khalid" className="bg-obsidian">
                    {language === "ar" ? "خالد المطيري" : "Khalid Al-Mutairi"}
                  </option>
                </select>
              </FormField>

              <FormField
                label={language === "ar" ? "نوع التواصل" : "Communication Type"}
                required
              >
                <select
                  defaultValue={selectedItem?.type || "phone"}
                  className="w-full bg-stone-gray/10 border border-desert-gold/20 rounded-lg px-4 py-3 text-elegant-white focus:outline-none focus:border-desert-gold transition-colors duration-300"
                >
                  <option value="phone" className="bg-obsidian">
                    {language === "ar" ? "مكالمة هاتفية" : "Phone Call"}
                  </option>
                  <option value="whatsapp" className="bg-obsidian">
                    {language === "ar" ? "واتساب" : "WhatsApp"}
                  </option>
                  <option value="email" className="bg-obsidian">
                    {language === "ar" ? "بريد إلكتروني" : "Email"}
                  </option>
                  <option value="meeting" className="bg-obsidian">
                    {language === "ar" ? "اجتماع" : "Meeting"}
                  </option>
                </select>
              </FormField>

              <FormField
                label={language === "ar" ? "التاريخ" : "Date"}
                required
              >
                <input
                  type="date"
                  defaultValue={selectedItem?.date || ""}
                  className="w-full bg-stone-gray/10 border border-desert-gold/20 rounded-lg px-4 py-3 text-elegant-white focus:outline-none focus:border-desert-gold transition-colors duration-300"
                />
              </FormField>

              <FormField label={language === "ar" ? "الوقت" : "Time"} required>
                <input
                  type="time"
                  defaultValue={selectedItem?.time || ""}
                  className="w-full bg-stone-gray/10 border border-desert-gold/20 rounded-lg px-4 py-3 text-elegant-white focus:outline-none focus:border-desert-gold transition-colors duration-300"
                />
              </FormField>
            </div>

            <FormField
              label={language === "ar" ? "الموضوع" : "Subject"}
              required
            >
              <input
                type="text"
                defaultValue={selectedItem?.subject || ""}
                className="w-full bg-stone-gray/10 border border-desert-gold/20 rounded-lg px-4 py-3 text-elegant-white placeholder-stone-gray focus:outline-none focus:border-desert-gold transition-colors duration-300"
                placeholder={
                  language === "ar"
                    ? "أدخل موضوع التواصل"
                    : "Enter communication subject"
                }
              />
            </FormField>

            <FormField
              label={language === "ar" ? "الملاحظات" : "Notes"}
              required
            >
              <textarea
                rows={4}
                defaultValue={selectedItem?.notes || ""}
                className="w-full bg-stone-gray/10 border border-desert-gold/20 rounded-lg px-4 py-3 text-elegant-white placeholder-stone-gray focus:outline-none focus:border-desert-gold transition-colors duration-300 resize-none"
                placeholder={
                  language === "ar"
                    ? "أدخل ملاحظات التواصل..."
                    : "Enter communication notes..."
                }
              />
            </FormField>

            <FormField
              label={language === "ar" ? "تاريخ المتابعة" : "Follow Up Date"}
            >
              <input
                type="date"
                defaultValue={selectedItem?.followUp || ""}
                className="w-full bg-stone-gray/10 border border-desert-gold/20 rounded-lg px-4 py-3 text-elegant-white focus:outline-none focus:border-desert-gold transition-colors duration-300"
              />
            </FormField>

            <div className="flex justify-end space-x-4 rtl:space-x-reverse pt-6">
              <motion.button
                type="button"
                onClick={() => {
                  setShowCommunicationModal(false);
                  setSelectedItem(null);
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
                {selectedItem
                  ? language === "ar"
                    ? "تحديث"
                    : "Update"
                  : language === "ar"
                  ? "إضافة التواصل"
                  : "Add Communication"}
              </motion.button>
            </div>
          </form>
        </Modal>
      </div>
    </PageWrapper>
  );
}
