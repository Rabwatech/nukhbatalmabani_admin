"use client";
import { useState, useMemo } from "react";
import { useDirection } from "@/context/DirectionContext";
import PageWrapper from "@/components/PageWrapper";
import DataTable from "@/components/shared/DataTable";
import Modal from "@/components/shared/Modal";
import FormField from "@/components/shared/FormField";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import StatusBadge from "@/components/shared/StatusBadge";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import SelectContext from "@/components/ui/select-context";
import * as XLSX from "xlsx";
import { Download } from "lucide-react";
import UploadLabel from "@/components/ui/UploadLabel";

// Mock data for demonstration
const mockProjects = [
  {
    id: "p1",
    name: "Al Raha Compound",
    type: { ar: "فيلا", en: "Villa" },
    units: [
      { id: "u1", number: "05B" },
      { id: "u2", number: "06A" },
    ],
  },
  {
    id: "p2",
    name: "Palm Residences",
    type: { ar: "شقة", en: "Apartment" },
    units: [
      { id: "u3", number: "12C" },
      { id: "u4", number: "14D" },
    ],
  },
];
const mockStaff = [
  { value: "all", label: { ar: "غير محدد", en: "Unassigned" } },
  {
    value: "فاطمة الحربي / Fatima Al-Harbi",
    label: { ar: "فاطمة الحربي", en: "Fatima Al-Harbi" },
  },
  {
    value: "أحمد العتيبي / Ahmed Al-Otaibi",
    label: { ar: "أحمد العتيبي", en: "Ahmed Al-Otaibi" },
  },
];
const issueTypes = [
  { value: "all", label: { ar: "جميع الأنواع", en: "All Types" } },
  { value: "leak", label: { ar: "تسرب", en: "Leak" } },
  { value: "ac", label: { ar: "تكييف", en: "AC" } },
  { value: "electricity", label: { ar: "كهرباء", en: "Electricity" } },
  { value: "painting", label: { ar: "دهان", en: "Painting" } },
];
const statusOptions = [
  { value: "all", label: { ar: "جميع الحالات", en: "All Statuses" } },
  { value: "new", label: { ar: "جديد", en: "New" } },
  { value: "in-progress", label: { ar: "جاري التنفيذ", en: "In Progress" } },
  { value: "completed", label: { ar: "تم الإنجاز", en: "Completed" } },
  { value: "rejected", label: { ar: "مرفوض", en: "Rejected" } },
];
const projectOptions = [
  { value: "all", label: { ar: "جميع المشاريع", en: "All Projects" } },
  { value: "مشروع 1 / Project 1", label: { ar: "مشروع 1", en: "Project 1" } },
  { value: "مشروع 2 / Project 2", label: { ar: "مشروع 2", en: "Project 2" } },
];
const assignedOptions = [
  { value: "all", label: { ar: "جميع الموظفين", en: "All Employees" } },
  { value: "unassigned", label: { ar: "غير محدد", en: "Unassigned" } },
  {
    value: "فاطمة الحربي / Fatima Al-Harbi",
    label: { ar: "فاطمة الحربي", en: "Fatima Al-Harbi" },
  },
  {
    value: "أحمد العتيبي / Ahmed Al-Otaibi",
    label: { ar: "أحمد العتيبي", en: "Ahmed Al-Otaibi" },
  },
];
const dateOptions = [
  { value: "all", label: { ar: "جميع التواريخ", en: "All Dates" } },
  { value: "today", label: { ar: "اليوم", en: "Today" } },
  { value: "this-week", label: { ar: "هذا الأسبوع", en: "This Week" } },
  { value: "this-month", label: { ar: "هذا الشهر", en: "This Month" } },
];

type Request = {
  id: string;
  project: string;
  unit: string;
  issueType: string;
  status: string;
  date: string;
  assigned: string;
  description: string;
  attachment: string;
  preferredTime: string;
  reportedBy: string;
  notes?: string;
  report?: string;
  history: { date: string; action: string; by: string }[];
};

const initialRequests: Request[] = [
  {
    id: "REQ-1001",
    project: "مشروع 1 / Project 1",
    unit: "A101",
    issueType: "تسرب",
    status: "new",
    date: "2024-06-01",
    assigned: "فاطمة الحربي / Fatima Al-Harbi",
    description: "يوجد تسرب مياه في الحمام الرئيسي.",
    attachment: "",
    preferredTime: "10:00",
    reportedBy: "مالك",
    history: [{ date: "2024-06-01", action: "تم إنشاء الطلب", by: "العميل" }],
  },
  {
    id: "REQ-1002",
    project: "مشروع 2 / Project 2",
    unit: "B202",
    issueType: "كهرباء",
    status: "in-progress",
    date: "2024-06-02",
    assigned: "أحمد العتيبي / Ahmed Al-Otaibi",
    description: "انقطاع كهرباء متكرر.",
    attachment: "",
    preferredTime: "",
    reportedBy: "مفوض",
    history: [
      { date: "2024-06-02", action: "تم تعيين موظف", by: "الإدارة" },
      { date: "2024-06-02", action: "تم إنشاء الطلب", by: "العميل" },
    ],
  },
];

export default function MaintenanceTasksPage() {
  const { language } = useDirection();
  const [requests, setRequests] = useState<Request[]>(initialRequests);
  const [showForm, setShowForm] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  // Filter state
  const [statusFilter, setStatusFilter] = useState("all");
  const [projectFilter, setProjectFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [assignedFilter, setAssignedFilter] = useState("all");
  const [issueTypeFilter, setIssueTypeFilter] = useState("all");

  const statusSummary = [
    {
      key: "new",
      label: { ar: "طلبات جديدة", en: "New Requests" },
      color: "bg-blue-500/20 text-blue-400 border-blue-500/30",
      badge: "info",
      icon: null, // Optionally add icon if you have one in your system
    },
    {
      key: "in-progress",
      label: { ar: "جاري التنفيذ", en: "In Progress" },
      color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
      badge: "warning",
      icon: null,
    },
    {
      key: "completed",
      label: { ar: "مكتملة", en: "Completed" },
      color: "bg-green-500/20 text-green-400 border-green-500/30",
      badge: "success",
      icon: null,
    },
    {
      key: "rejected",
      label: { ar: "مرفوضة", en: "Rejected" },
      color: "bg-red-500/20 text-red-400 border-red-500/30",
      badge: "error",
      icon: null,
    },
  ];

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = {
      new: 0,
      "in-progress": 0,
      completed: 0,
      rejected: 0,
    };
    requests.forEach((r) => {
      if (counts[r.status] !== undefined) counts[r.status]++;
    });
    return counts;
  }, [requests]);

  const [activeStatusCard, setActiveStatusCard] = useState<string | null>(null);

  // Filtering logic
  const filteredData = useMemo(() => {
    return requests.filter((req) => {
      if (activeStatusCard && req.status !== activeStatusCard) return false;
      if (statusFilter !== "all" && req.status !== statusFilter) return false;
      if (projectFilter !== "all" && req.project !== projectFilter)
        return false;
      if (
        assignedFilter !== "all" &&
        assignedFilter !== "unassigned" &&
        req.assigned !== assignedFilter
      )
        return false;
      if (assignedFilter === "unassigned" && req.assigned !== "unassigned")
        return false;
      if (
        issueTypeFilter !== "all" &&
        req.issueType !==
          issueTypes.find((i) => i.value === issueTypeFilter)?.label[language]
      )
        return false;
      // Date filter (simple demo)
      if (dateFilter !== "all") {
        const today = new Date();
        const reqDate = new Date(req.date);
        if (
          dateFilter === "today" &&
          !(
            reqDate.getDate() === today.getDate() &&
            reqDate.getMonth() === today.getMonth() &&
            reqDate.getFullYear() === today.getFullYear()
          )
        ) {
          return false;
        }
        if (dateFilter === "this-week") {
          const dayOfWeek = today.getDay();
          const startOfWeek = new Date(today);
          startOfWeek.setDate(today.getDate() - dayOfWeek);
          if (reqDate < startOfWeek) return false;
        }
        if (dateFilter === "this-month") {
          const startOfMonth = new Date(
            today.getFullYear(),
            today.getMonth(),
            1
          );
          if (reqDate < startOfMonth) return false;
        }
      }
      return true;
    });
  }, [
    requests,
    activeStatusCard,
    statusFilter,
    projectFilter,
    dateFilter,
    assignedFilter,
    issueTypeFilter,
    language,
  ]);

  // Table columns
  const getStatusVariant = (status: string) => {
    switch (status) {
      case "new":
        return "info";
      case "in-progress":
        return "warning";
      case "completed":
        return "success";
      case "rejected":
        return "error";
      default:
        return "default";
    }
  };
  const getIssueTypeVariant = (issueType: string) => {
    switch (issueType) {
      case "تسرب":
        return "error";
      case "كهرباء":
        return "info";
      case "دهان":
        return "warning";
      case "تكييف":
        return "success";
      default:
        return "default";
    }
  };
  const columns = [
    { key: "id", label: language === "ar" ? "رقم الطلب" : "Request ID" },
    { key: "project", label: language === "ar" ? "المشروع" : "Project" },
    { key: "unit", label: language === "ar" ? "الوحدة" : "Unit" },
    {
      key: "issueType",
      label: language === "ar" ? "نوع المشكلة" : "Issue Type",
      render: (value: string) => (
        <StatusBadge
          status={value}
          variant={getIssueTypeVariant(value)}
          size="md"
        />
      ),
    },
    {
      key: "status",
      label: language === "ar" ? "الحالة" : "Status",
      render: (value: string) => {
        const status = statusOptions.find(
          (opt) => opt.label[language] === value || opt.value === value
        );
        return (
          <StatusBadge
            status={status ? status.label[language] : value}
            variant={getStatusVariant(status ? status.value : value)}
            size="md"
          />
        );
      },
    },
    { key: "date", label: language === "ar" ? "التاريخ" : "Date" },
    {
      key: "assigned",
      label: language === "ar" ? "الموظف المسؤول" : "Assigned Employee",
    },
    {
      key: "actions",
      label: language === "ar" ? "الإجراءات" : "Actions",
      render: (_: any, row: any) => (
        <button
          onClick={() => {
            setSelectedRequest(row);
            setShowDetail(true);
          }}
          className="bg-desert-gold text-deep-black px-6 py-3 rounded-lg font-medium hover:bg-warm-sand transition-all duration-300 flex items-center space-x-2 rtl:space-x-reverse"
        >
          {language === "ar" ? "عرض" : "View"}
        </button>
      ),
    },
  ];

  // Form state
  const [form, setForm] = useState({
    projectId: "",
    unitId: "",
    issueType: "",
    description: "",
    attachment: "",
    preferredTime: "",
    reportedBy: "",
  });
  const [formError, setFormError] = useState("");

  function handleFormChange(field: string, value: any) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function handleFormSubmit(e: any) {
    e.preventDefault();
    if (
      !form.projectId ||
      !form.unitId ||
      !form.issueType ||
      !form.description ||
      !form.preferredTime ||
      !form.reportedBy
    ) {
      setFormError(
        language === "ar" ? "جميع الحقول مطلوبة" : "All fields are required"
      );
      return;
    }
    const project = mockProjects.find((p) => p.id === form.projectId);
    const unit = project?.units.find((u) => u.id === form.unitId);
    setRequests((prev) => [
      {
        id: `REQ-${1000 + prev.length + 1}`,
        project: project
          ? `${project.name} – ${project.type[language]} – ${unit?.number}`
          : "",
        unit: unit?.number || "",
        issueType:
          issueTypes.find((i) => i.value === form.issueType)?.label[language] ||
          "",
        status: "new",
        date: new Date().toISOString().slice(0, 10),
        assigned: "unassigned",
        description: form.description,
        attachment: form.attachment,
        preferredTime: form.preferredTime,
        reportedBy: form.reportedBy,
        notes: "",
        report: "",
        history: [
          {
            date: new Date().toISOString().slice(0, 10),
            action: language === "ar" ? "تم إنشاء الطلب" : "Request Created",
            by: language === "ar" ? "العميل" : "Client",
          },
        ],
      },
      ...prev,
    ]);
    setShowForm(false);
    setForm({
      projectId: "",
      unitId: "",
      issueType: "",
      description: "",
      attachment: "",
      preferredTime: "",
      reportedBy: "",
    });
    setFormError("");
  }

  // Excel export handler
  function handleExportExcel() {
    // Prepare data for export (remove actions column)
    const exportData = filteredData.map(({ history, ...row }) => row);
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Requests");
    XLSX.writeFile(wb, "maintenance-requests.xlsx");
  }

  return (
    <PageWrapper>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-elegant-white">
          {language === "ar" ? "طلبات الصيانة" : "Maintenance Requests"}
        </h1>
        <button
          className="bg-desert-gold text-deep-black px-6 py-3 rounded-lg font-medium hover:bg-warm-sand transition-all duration-300 flex items-center space-x-2 rtl:space-x-reverse"
          onClick={() => setShowForm(true)}
        >
          {language === "ar" ? "طلب صيانة جديد" : "New Maintenance Request"}
        </button>
      </div>
      <div className="flex gap-4 mb-6 overflow-x-auto pb-2 hide-scrollbar">
        {statusSummary.map((card) => {
          const isActive = activeStatusCard === card.key;
          return (
            <button
              key={card.key}
              onClick={() => setActiveStatusCard(isActive ? null : card.key)}
              className={`min-w-[140px] flex flex-col items-center justify-center px-6 py-4 rounded-xl shadow-md font-bold border-2 transition-all duration-200
                ${card.color}
                ${
                  isActive
                    ? "border-desert-gold shadow-lg"
                    : "border-transparent hover:border-desert-gold"
                }
              `}
              style={{ fontFamily: "inherit" }}
            >
              <span className="text-2xl mb-1">{statusCounts[card.key]}</span>
              <span className="text-sm font-medium">
                {card.label[language]}
              </span>
            </button>
          );
        })}
      </div>
      {/* Filter Bar */}
      <div className="bg-obsidian/50 backdrop-blur-sm rounded-xl p-6 border border-desert-gold/20 mb-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          {/* الفلاتر */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 flex-1 order-1 md:order-1">
            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-stone-gray mb-2">
                {language === "ar" ? "الحالة" : "Status"}
              </label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full bg-[#232323]/80 border border-[#C6A15B]/30 rounded-xl shadow-lg text-[#fff] font-bold px-4 py-2 focus:ring-2 focus:ring-[#C6A15B]/40 transition h-12">
                  <SelectValue placeholder={statusOptions[0].label[language]} />
                </SelectTrigger>
                <SelectContent className="bg-[#232323]/95 border border-[#C6A15B]/20 rounded-xl shadow-xl text-[#fff]">
                  {statusOptions.map((opt) => (
                    <SelectItem
                      key={opt.value}
                      value={opt.value}
                      className="hover:bg-[#C6A15B]/10 data-[state=checked]:bg-[#C6A15B]/20 data-[state=checked]:text-[#C6A15B]"
                    >
                      {opt.label[language]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {/* Project Filter */}
            <div>
              <label className="block text-sm font-medium text-stone-gray mb-2">
                {language === "ar" ? "المشروع" : "Project"}
              </label>
              <Select value={projectFilter} onValueChange={setProjectFilter}>
                <SelectTrigger className="w-full bg-[#232323]/80 border border-[#C6A15B]/30 rounded-xl shadow-lg text-[#fff] font-bold px-4 py-2 focus:ring-2 focus:ring-[#C6A15B]/40 transition h-12">
                  <SelectValue
                    placeholder={projectOptions[0].label[language]}
                  />
                </SelectTrigger>
                <SelectContent className="bg-[#232323]/95 border border-[#C6A15B]/20 rounded-xl shadow-xl text-[#fff]">
                  {projectOptions.map((opt) => (
                    <SelectItem
                      key={opt.value}
                      value={opt.value}
                      className="hover:bg-[#C6A15B]/10 data-[state=checked]:bg-[#C6A15B]/20 data-[state=checked]:text-[#C6A15B]"
                    >
                      {opt.label[language]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {/* Issue Type Filter */}
            <div>
              <label className="block text-sm font-medium text-stone-gray mb-2">
                {language === "ar" ? "نوع المشكلة" : "Issue Type"}
              </label>
              <Select
                value={issueTypeFilter}
                onValueChange={setIssueTypeFilter}
              >
                <SelectTrigger className="w-full bg-[#232323]/80 border border-[#C6A15B]/30 rounded-xl shadow-lg text-[#fff] font-bold px-4 py-2 focus:ring-2 focus:ring-[#C6A15B]/40 transition h-12">
                  <SelectValue placeholder={issueTypes[0].label[language]} />
                </SelectTrigger>
                <SelectContent className="bg-[#232323]/95 border border-[#C6A15B]/20 rounded-xl shadow-xl text-[#fff]">
                  {issueTypes.map((opt) => (
                    <SelectItem
                      key={opt.value}
                      value={opt.value}
                      className="hover:bg-[#C6A15B]/10 data-[state=checked]:bg-[#C6A15B]/20 data-[state=checked]:text-[#C6A15B]"
                    >
                      {opt.label[language]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {/* Assigned Employee Filter */}
            <div>
              <label className="block text-sm font-medium text-stone-gray mb-2">
                {language === "ar" ? "الموظف المسؤول" : "Assigned Employee"}
              </label>
              <Select value={assignedFilter} onValueChange={setAssignedFilter}>
                <SelectTrigger className="w-full bg-[#232323]/80 border border-[#C6A15B]/30 rounded-xl shadow-lg text-[#fff] font-bold px-4 py-2 focus:ring-2 focus:ring-[#C6A15B]/40 transition h-12">
                  <SelectValue
                    placeholder={assignedOptions[0].label[language]}
                  />
                </SelectTrigger>
                <SelectContent className="bg-[#232323]/95 border border-[#C6A15B]/20 rounded-xl shadow-xl text-[#fff]">
                  {assignedOptions.map((opt) => (
                    <SelectItem
                      key={opt.value}
                      value={opt.value}
                      className="hover:bg-[#C6A15B]/10 data-[state=checked]:bg-[#C6A15B]/20 data-[state=checked]:text-[#C6A15B]"
                    >
                      {opt.label[language]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {/* Date Filter */}
            <div>
              <label className="block text-sm font-medium text-stone-gray mb-2">
                {language === "ar" ? "التاريخ" : "Date"}
              </label>
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger className="w-full bg-[#232323]/80 border border-[#C6A15B]/30 rounded-xl shadow-lg text-[#fff] font-bold px-4 py-2 focus:ring-2 focus:ring-[#C6A15B]/40 transition h-12">
                  <SelectValue placeholder={dateOptions[0].label[language]} />
                </SelectTrigger>
                <SelectContent className="bg-[#232323]/95 border border-[#C6A15B]/20 rounded-xl shadow-xl text-[#fff]">
                  {dateOptions.map((opt) => (
                    <SelectItem
                      key={opt.value}
                      value={opt.value}
                      className="hover:bg-[#C6A15B]/10 data-[state=checked]:bg-[#C6A15B]/20 data-[state=checked]:text-[#C6A15B]"
                    >
                      {opt.label[language]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>
      <DataTable
        columns={columns}
        data={filteredData}
        exportButton={
          <button
            onClick={handleExportExcel}
            className="bg-green-600 text-white px-6 h-12 rounded-lg font-medium flex items-center space-x-2 rtl:space-x-reverse hover:bg-green-700 transition-all duration-300 whitespace-nowrap"
            style={{ minWidth: "150px" }}
          >
            <Download className="w-5 h-5 mr-2 rtl:ml-2 rtl:mr-0" />
            {language === "ar" ? "تصدير Excel" : "Export Excel"}
          </button>
        }
      />

      {/* New Maintenance Request Modal */}
      <Modal
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        title={language === "ar" ? "طلب صيانة جديد" : "New Maintenance Request"}
        size="lg"
      >
        <form onSubmit={handleFormSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField label={language === "ar" ? "الوحدة" : "Unit"} required>
              <SelectContext
                options={mockProjects.map((p) => ({
                  value: p.id,
                  label: {
                    ar: `${p.name} – ${p.type.ar}`,
                    en: `${p.name} – ${p.type.en}`,
                  },
                }))}
                value={form.projectId}
                onChange={(value) => handleFormChange("projectId", value)}
                placeholder={
                  language === "ar" ? "اختر المشروع" : "Select Project"
                }
                language={language}
              />
              {form.projectId && (
                <SelectContext
                  options={
                    mockProjects
                      .find((p) => p.id === form.projectId)
                      ?.units.map((u) => ({
                        value: u.id,
                        label: {
                          ar: `${
                            mockProjects.find((p) => p.id === form.projectId)
                              ?.name
                          } – ${
                            mockProjects.find((p) => p.id === form.projectId)
                              ?.type[language]
                          } – ${u.number}`,
                          en: `${
                            mockProjects.find((p) => p.id === form.projectId)
                              ?.name
                          } – ${
                            mockProjects.find((p) => p.id === form.projectId)
                              ?.type[language]
                          } – ${u.number}`,
                        },
                      })) || []
                  }
                  value={form.unitId}
                  onChange={(value) => handleFormChange("unitId", value)}
                  placeholder={
                    language === "ar" ? "اختر الوحدة" : "Select Unit"
                  }
                  language={language}
                />
              )}
            </FormField>
            <FormField
              label={language === "ar" ? "نوع المشكلة" : "Issue Type"}
              required
            >
              <SelectContext
                options={issueTypes}
                value={form.issueType}
                onChange={(value) => handleFormChange("issueType", value)}
                placeholder={language === "ar" ? "اختر النوع" : "Select Type"}
                language={language}
              />
            </FormField>
            <FormField
              label={
                language === "ar"
                  ? "الوقت المناسب للزيارة"
                  : "Preferred Visit Time"
              }
              required
            >
              <Input
                type="time"
                value={form.preferredTime}
                onChange={(e) =>
                  handleFormChange("preferredTime", e.target.value)
                }
                className="w-full bg-stone-gray/10 border border-desert-gold/20 rounded-lg px-4 py-3 text-elegant-white focus:outline-none focus:border-desert-gold transition-colors duration-300"
                required
              />
            </FormField>
            <FormField
              label={language === "ar" ? "جهة الإبلاغ" : "Reporting Party"}
              required
            >
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="reportedBy"
                    value="مالك"
                    checked={form.reportedBy === "مالك"}
                    onChange={(e) =>
                      handleFormChange("reportedBy", e.target.value)
                    }
                    required
                  />
                  <span>{language === "ar" ? "مالك" : "Owner"}</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="reportedBy"
                    value="مفوض"
                    checked={form.reportedBy === "مفوض"}
                    onChange={(e) =>
                      handleFormChange("reportedBy", e.target.value)
                    }
                    required
                  />
                  <span>{language === "ar" ? "مفوض" : "Delegate"}</span>
                </label>
              </div>
            </FormField>
          </div>
          <FormField
            label={language === "ar" ? "وصف المشكلة" : "Description"}
            required
          >
            <textarea
              value={form.description}
              onChange={(e) => handleFormChange("description", e.target.value)}
              className="w-full bg-stone-gray/10 border border-desert-gold/20 rounded-lg px-4 py-3 text-elegant-white focus:outline-none focus:border-desert-gold transition-colors duration-300"
              rows={3}
              required
            />
          </FormField>
          <FormField
            label={
              language === "ar" ? "رفع مرفق (اختياري)" : "Attachment (Optional)"
            }
          >
            <input
              type="file"
              id="attachment-upload"
              accept="image/*,video/*"
              onChange={(e) =>
                handleFormChange("attachment", e.target.files?.[0] || "")
              }
              className="hidden"
            />
            <UploadLabel
              htmlFor="attachment-upload"
              label={
                language === "ar"
                  ? "رفع مرفق (اختياري)"
                  : "Attachment (Optional)"
              }
              withBorder
            />
          </FormField>
          {formError && (
            <div className="text-red-500 text-sm mb-2">{formError}</div>
          )}
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              onClick={() => setShowForm(false)}
              className="bg-red-600 text-white px-6 py-3 rounded-lg font-medium flex items-center space-x-2 rtl:space-x-reverse h-12 hover:bg-red-700 transition-all duration-300"
            >
              {language === "ar" ? "إلغاء" : "Cancel"}
            </Button>
            <Button
              variant="default"
              type="submit"
              className="bg-desert-gold text-deep-black hover:bg-warm-sand px-6 py-3 rounded-lg font-medium flex items-center space-x-2 rtl:space-x-reverse h-12"
            >
              {language === "ar" ? "إرسال الطلب" : "Submit Request"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Maintenance Request Details Modal */}
      <Modal
        isOpen={showDetail}
        onClose={() => setShowDetail(false)}
        title={
          language === "ar"
            ? "تفاصيل طلب الصيانة"
            : "Maintenance Request Details"
        }
        size="xl"
      >
        {selectedRequest && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="mb-2 text-stone-gray text-sm font-medium">
                  {language === "ar" ? "الوحدة" : "Unit"}
                </div>
                <div className="text-elegant-white font-bold mb-4">
                  {selectedRequest.unit}
                </div>
                <div className="mb-2 text-stone-gray text-sm font-medium">
                  {language === "ar" ? "المشروع" : "Project"}
                </div>
                <div className="text-elegant-white mb-4">
                  {selectedRequest.project}
                </div>
                <div className="mb-2 text-stone-gray text-sm font-medium">
                  {language === "ar" ? "نوع المشكلة" : "Issue Type"}
                </div>
                <div className="text-elegant-white mb-4">
                  {selectedRequest.issueType}
                </div>
                <div className="mb-2 text-stone-gray text-sm font-medium">
                  {language === "ar" ? "الوصف" : "Description"}
                </div>
                <div className="text-elegant-white mb-4">
                  {selectedRequest.description}
                </div>
                <div className="mb-2 text-stone-gray text-sm font-medium">
                  {language === "ar"
                    ? "الوقت المناسب للزيارة"
                    : "Preferred Visit Time"}
                </div>
                <div className="text-elegant-white mb-4">
                  {selectedRequest.preferredTime ||
                    (language === "ar" ? "غير محدد" : "Not specified")}
                </div>
                <div className="mb-2 text-stone-gray text-sm font-medium">
                  {language === "ar" ? "جهة الإبلاغ" : "Reported By"}
                </div>
                <div className="text-elegant-white mb-4">
                  {selectedRequest.reportedBy}
                </div>
                <div className="mb-2 text-stone-gray text-sm font-medium">
                  {language === "ar" ? "المرفق" : "Attachment"}
                </div>
                <div className="text-elegant-white mb-4">
                  {selectedRequest.attachment
                    ? selectedRequest.attachment
                    : language === "ar"
                    ? "لا يوجد"
                    : "None"}
                </div>
              </div>
              {/* Admin Panel */}
              <div>
                <FormField label={language === "ar" ? "الحالة" : "Status"}>
                  <SelectContext
                    options={statusOptions.filter((opt) => opt.value)}
                    value={selectedRequest.status}
                    onChange={(value) =>
                      setSelectedRequest({ ...selectedRequest, status: value })
                    }
                    placeholder={
                      language === "ar" ? "اختر الحالة" : "Select Status"
                    }
                    language={language}
                  />
                </FormField>
                <FormField
                  label={
                    language === "ar" ? "الموظف المسؤول" : "Assigned Employee"
                  }
                >
                  <SelectContext
                    options={assignedOptions}
                    value={selectedRequest.assigned}
                    onChange={(value) =>
                      setSelectedRequest({
                        ...selectedRequest,
                        assigned: value,
                      })
                    }
                    placeholder={
                      language === "ar" ? "اختر الموظف" : "Select Employee"
                    }
                    language={language}
                  />
                </FormField>
                <FormField
                  label={
                    language === "ar" ? "ملاحظات داخلية" : "Internal Notes"
                  }
                >
                  <textarea
                    value={selectedRequest.notes || ""}
                    onChange={(e) =>
                      setSelectedRequest({
                        ...selectedRequest,
                        notes: e.target.value,
                      })
                    }
                    className="w-full bg-stone-gray/10 border border-desert-gold/20 rounded-lg px-4 py-2 text-elegant-white mb-4 focus:outline-none focus:border-desert-gold transition-colors duration-300"
                    rows={3}
                  />
                </FormField>
                <FormField
                  label={
                    language === "ar" ? "تقرير الفني" : "Technician Report"
                  }
                >
                  <input
                    type="file"
                    accept="image/*,video/*"
                    onChange={(e) =>
                      setSelectedRequest(
                        selectedRequest
                          ? {
                              ...selectedRequest,
                              report: e.target.files?.[0]?.name || "",
                            }
                          : selectedRequest
                      )
                    }
                    className="w-full bg-stone-gray/10 border border-desert-gold/20 rounded-lg px-4 py-2 text-elegant-white mb-4 focus:outline-none focus:border-desert-gold transition-colors duration-300"
                  />
                </FormField>
                <div className="flex gap-4 mt-4">
                  <button
                    onClick={() => {
                      setRequests((reqs) =>
                        reqs.map((r) =>
                          r.id === selectedRequest.id ? selectedRequest : r
                        )
                      );
                      setShowDetail(false);
                    }}
                    className="bg-desert-gold text-deep-black px-6 py-3 rounded-lg font-medium hover:bg-warm-sand transition-all duration-300 flex items-center space-x-2 rtl:space-x-reverse h-12"
                  >
                    {language === "ar" ? "حفظ التغييرات" : "Save Changes"}
                  </button>
                  <button
                    onClick={() => setShowDetail(false)}
                    className="bg-[#171717] text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 flex items-center space-x-2 rtl:space-x-reverse h-12"
                  >
                    {language === "ar" ? "إغلاق" : "Close"}
                  </button>
                </div>
              </div>
            </div>
            {/* History Log */}
            <div>
              <h3 className="text-lg font-bold text-elegant-white mb-2">
                {language === "ar" ? "سجل الطلب" : "Request History"}
              </h3>
              <div className="bg-stone-gray/10 rounded-lg p-4 border border-desert-gold/20">
                {selectedRequest.history &&
                selectedRequest.history.length > 0 ? (
                  <ul className="space-y-2">
                    {selectedRequest.history.map((h, i) => (
                      <li
                        key={i}
                        className="flex items-center justify-between text-sm text-stone-gray"
                      >
                        <span>{h.date}</span>
                        <span>{h.action}</span>
                        <span>{h.by}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-stone-gray text-sm">
                    {language === "ar" ? "لا يوجد سجل" : "No history"}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </PageWrapper>
  );
}
