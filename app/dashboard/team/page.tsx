"use client";

import { motion } from "framer-motion";
import { useDirection } from "@/context/DirectionContext";
import { useState } from "react";
import {
  Plus,
  Shield,
  User as UserIcon,
  Clock,
  Activity,
  Eye,
  Edit,
  Trash2,
  UserPlus,
  Settings,
  Monitor,
  FileText,
  Camera,
  Check,
  X
} from "lucide-react";
import PageWrapper from "@/components/PageWrapper";
import DataTable from "@/components/shared/DataTable";
import StatusBadge from "@/components/shared/StatusBadge";
import Modal from "@/components/shared/Modal";
import FormField from "@/components/shared/FormField";
import SelectContext from "@/components/ui/select-context";
import UploadLabel from "@/components/ui/UploadLabel";
import { User, UserRole } from "@/lib/types";

export default function TeamPage() {
  const { language } = useDirection();
  const [activeTab, setActiveTab] = useState("members");
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [showPermissionsModal, setShowPermissionsModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState<User | null>(null);

  // Mock data aligned with User interface
  const teamMembers: User[] = [
    {
      id: "1",
      name: language === "ar" ? "أحمد العتيبي" : "Ahmed Al-Otaibi",
      email: "ahmed@nokhbat.sa",
      role: "admin",
      phone: "0500000001",
      jobTitle: language === "ar" ? "مدير النظام" : "System Admin",
      isActive: true,
      joinedDate: "2023-01-15",
      avatar: "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
    },
    {
      id: "2",
      name: language === "ar" ? "فاطمة الحربي" : "Fatima Al-Harbi",
      email: "fatima@nokhbat.sa",
      role: "sales_manager",
      phone: "0500000002",
      jobTitle: language === "ar" ? "مديرة المبيعات" : "Sales Manager",
      isActive: true,
      joinedDate: "2023-03-20",
      avatar: "https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
    },
    {
      id: "3",
      name: language === "ar" ? "خالد المطيري" : "Khalid Al-Mutairi",
      email: "khalid@nokhbat.sa",
      role: "editor",
      phone: "0500000003",
      jobTitle: language === "ar" ? "مدخل بيانات" : "Data Editor",
      isActive: true,
      joinedDate: "2023-06-10",
      avatar: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
    },
    {
      id: "4",
      name: language === "ar" ? "نورا السالم" : "Nora Al-Salem",
      email: "nora@nokhbat.sa",
      role: "accountant",
      phone: "0500000004",
      jobTitle: language === "ar" ? "محاسبة" : "Accountant",
      isActive: false,
      joinedDate: "2023-09-05",
      avatar: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
    },
  ];

  const activityLog = [
    {
      id: 1,
      user: language === "ar" ? "أحمد العتيبي" : "Ahmed Al-Otaibi",
      action: language === "ar" ? "تسجيل دخول" : "Login",
      details: language === "ar" ? "تسجيل دخول من Chrome على Windows" : "Logged in from Chrome on Windows",
      timestamp: "2024-01-22 10:30:15",
      device: "Desktop",
    },
    {
      id: 2,
      user: language === "ar" ? "فاطمة الحربي" : "Fatima Al-Harbi",
      action: language === "ar" ? "إضافة عميل جديد" : "Added new customer",
      details: language === "ar" ? "أضافت عميل جديد: سعد الدوسري" : "Added new customer: Saad Al-Dosari",
      timestamp: "2024-01-22 09:45:30",
      device: "Mobile",
    },
  ];

  const permissionsList = {
    dashboard: { ar: "لوحة التحكم", en: "Dashboard" },
    customers: { ar: "إدارة العملاء", en: "Customer Management" },
    sales: { ar: "المبيعات والحجوزات", en: "Sales & Booking" },
    contracts: { ar: "العقود والملكية", en: "Contracts & Ownership" },
    projects: { ar: "المشاريع والوحدات", en: "Projects & Units" },
    finance: { ar: "المدفوعات والمالية", en: "Payments & Finance" },
    maintenance: { ar: "الصيانة والتشغيل", en: "Maintenance & Ops" },
    team: { ar: "الفريق والأدوار", en: "Team & Roles" },
    reports: { ar: "التقارير", en: "Reports" },
  };

  const rolePermissions: Record<UserRole, string[]> = {
    admin: Object.keys(permissionsList),
    sales_manager: ["dashboard", "customers", "sales", "contracts", "projects", "reports", "maintenance"],
    accountant: ["dashboard", "finance", "reports", "contracts"],
    editor: ["dashboard", "customers", "projects", "maintenance"],
    reviewer: ["dashboard", "reports", "contracts"],
  };

  const getRoleVariant = (role: UserRole) => {
    switch (role) {
      case "admin": return "error";
      case "sales_manager": return "warning";
      case "accountant": return "success";
      case "reviewer": return "info";
      default: return "default";
    }
  };

  const getRoleLabel = (role: string) => {
    const labels: Record<string, { ar: string; en: string }> = {
      admin: { ar: "مدير النظام", en: "System Admin" },
      sales_manager: { ar: "مدير مبيعات", en: "Sales Manager" },
      accountant: { ar: "محاسب", en: "Accountant" },
      editor: { ar: "مدخل بيانات", en: "Editor" },
      reviewer: { ar: "مراجع", en: "Reviewer" },
    };
    return labels[role]?.[language] || role;
  };

  const tabs = [
    { id: "members", label: language === "ar" ? "أعضاء الفريق" : "Team Members" },
    { id: "permissions", label: language === "ar" ? "الصلاحيات" : "Role Permissions" },
    { id: "activity", label: language === "ar" ? "سجل النشاطات" : "Activity Log" },
  ];

  const memberColumns = [
    {
      key: "name",
      label: language === "ar" ? "الاسم" : "Name",
      sortable: true,
      render: (value: string, row: User) => (
        <div className="flex items-center space-x-3 rtl:space-x-reverse">
          <div className="w-10 h-10 rounded-full overflow-hidden border border-desert-gold/20">
            {row.avatar ? (
              <img src={row.avatar} alt={value} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-stone-gray/20 flex items-center justify-center">
                <UserIcon className="w-5 h-5 text-stone-gray" />
              </div>
            )}
          </div>
          <div>
            <div className="text-elegant-white font-medium">{value}</div>
            <div className="text-stone-gray text-xs">{row.email}</div>
          </div>
        </div>
      ),
    },
    {
      key: "role",
      label: language === "ar" ? "الدور" : "Role",
      render: (value: UserRole) => (
        <StatusBadge status={getRoleLabel(value)} variant={getRoleVariant(value)} />
      ),
    },
    {
      key: "jobTitle",
      label: language === "ar" ? "المسمى الوظيفي" : "Job Title",
      render: (value: string) => <span className="text-stone-gray">{value || "-"}</span>,
    },
    {
      key: "isActive",
      label: language === "ar" ? "الحالة" : "Status",
      render: (value: boolean) => (
        <StatusBadge
          status={value ? (language === "ar" ? "نشط" : "Active") : (language === "ar" ? "غير نشط" : "Inactive")}
          variant={value ? "success" : "error"}
        />
      ),
    },
    {
      key: "phone",
      label: language === "ar" ? "الجوال" : "Phone",
      render: (value: string) => <span className="text-stone-gray" dir="ltr">{value}</span>,
    },
    {
      key: "actions",
      label: "",
      render: (_: any, row: User) => (
        <div className="flex gap-2">
          <button onClick={() => handleEdit(row)} className="p-2 hover:bg-stone-gray/30 rounded-lg transition-colors text-stone-gray hover:text-white">
            <Edit className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  const handleEdit = (member: User) => {
    setSelectedMember(member);
    setShowAddMemberModal(true);
  };

  const handleDelete = (member: User) => {
    // Mock delete
    console.log("Delete", member);
  };

  // Form State
  const [formData, setFormData] = useState<Partial<User>>({
    role: "editor",
    isActive: true,
  });

  // Reset form when modal opens/closes or selection changes
  const [isClient, setIsClient] = useState(false);

  if (typeof window !== "undefined" && !isClient) {
    setIsClient(true);
  }

  const handleOpenModal = (member?: User) => {
    if (member) {
      setSelectedMember(member);
      setFormData(member);
    } else {
      setSelectedMember(null);
      setFormData({
        role: "editor",
        isActive: true,
      });
    }
    setShowAddMemberModal(true);
  };

  const handleSaveMember = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, validation and API call here
    if (selectedMember) {
      // Update
      const updatedList = teamMembers.map(m => m.id === selectedMember.id ? { ...m, ...formData } as User : m);
      // setTeamMembers(updatedList); // Note: teamMembers is currently const in this file, need to make it state defined above if we want to mutate it.
      console.log("Updated member:", { ...selectedMember, ...formData });
    } else {
      // Add
      const newMember = {
        id: Math.random().toString(),
        joinedDate: new Date().toISOString().split('T')[0],
        avatar: "", // Default avatar logic
        ...formData
      } as User;
      console.log("New member:", newMember);
    }
    setShowAddMemberModal(false);
  };

  // Convert teamMembers to state to allow mutation in this mock
  const [membersList, setMembersList] = useState<User[]>(teamMembers);

  return (
    <PageWrapper>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-elegant-white">
              {language === "ar" ? "الفريق والأدوار" : "Team & Roles Management"}
            </h1>
            <p className="text-stone-gray mt-1">
              {language === "ar" ? "إدارة أعضاء الفريق والصلاحيات" : "Manage team members and permissions"}
            </p>
          </div>
          <div className="flex space-x-3 rtl:space-x-reverse">
            <motion.button
              onClick={() => setShowPermissionsModal(true)}
              className="bg-stone-gray/20 text-elegant-white px-6 py-3 rounded-lg font-medium hover:bg-stone-gray/30 transition-all duration-300 flex items-center space-x-2 rtl:space-x-reverse"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Settings className="h-5 w-5" />
              <span>{language === "ar" ? "إدارة الصلاحيات" : "Manage Permissions"}</span>
            </motion.button>
            <motion.button
              onClick={() => handleOpenModal()}
              className="bg-desert-gold text-deep-black px-6 py-3 rounded-lg font-medium hover:bg-warm-sand transition-all duration-300 flex items-center space-x-2 rtl:space-x-reverse"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <UserPlus className="h-5 w-5" />
              <span>{language === "ar" ? "إضافة عضو" : "Add Member"}</span>
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

        {/* Content */}
        <div className="mt-6">
          {activeTab === "members" && (
            <DataTable
              columns={memberColumns}
              data={membersList}
              searchPlaceholder={language === "ar" ? "البحث في أعضاء الفريق..." : "Search team members..."}
              onEdit={handleOpenModal}
              onDelete={handleDelete}
            />
          )}

          {activeTab === "permissions" && (
            <div className="bg-obsidian/50 backdrop-blur-sm rounded-xl p-8 border border-desert-gold/20 overflow-x-auto">
              <table className="w-full min-w-[800px]">
                <thead>
                  <tr className="border-b border-desert-gold/20">
                    <th className="text-left py-4 px-4 text-elegant-white font-medium">{language === "ar" ? "الوحدة" : "Module"}</th>
                    {Object.keys(rolePermissions).map(role => (
                      <th key={role} className="text-center py-4 px-4 text-elegant-white font-medium">{getRoleLabel(role)}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(permissionsList).map(([key, value]) => (
                    <tr key={key} className="border-b border-desert-gold/10 hover:bg-stone-gray/5">
                      <td className="py-4 px-4 text-stone-gray font-medium">{value[language]}</td>
                      {Object.keys(rolePermissions).map((role) => (
                        <td key={role} className="py-4 px-4 text-center">
                          <div className="flex justify-center">
                            {(rolePermissions[role as UserRole].includes(key)) ? (
                              <div className="w-6 h-6 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center">
                                <Check className="w-4 h-4" />
                              </div>
                            ) : (
                              <div className="w-6 h-6 rounded-full bg-stone-gray/10 text-stone-gray/30 flex items-center justify-center">
                                <X className="w-4 h-4" />
                              </div>
                            )}
                          </div>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === "activity" && (
            <DataTable
              columns={[
                { key: "user", label: language === "ar" ? "المستخدم" : "User", sortable: true },
                { key: "action", label: language === "ar" ? "الإجراء" : "Action", render: (v: string) => <span className="text-desert-gold">{v}</span> },
                { key: "details", label: language === "ar" ? "التفاصيل" : "Details", render: (v: string) => <span className="text-stone-gray">{v}</span> },
                { key: "timestamp", label: language === "ar" ? "الوقت" : "Time", render: (v: string) => <span className="text-stone-gray text-xs">{v}</span> },
              ]}
              data={activityLog}
              searchPlaceholder={language === "ar" ? "البحث في السجل..." : "Search log..."}
            />
          )}
        </div>

        {/* Add/Edit Modal */}
        <Modal
          isOpen={showAddMemberModal}
          onClose={() => { setShowAddMemberModal(false); setSelectedMember(null); }}
          title={selectedMember
            ? (language === "ar" ? "تعديل عضو" : "Edit Member")
            : (language === "ar" ? "إضافة عضو جديد" : "Add New Member")}
          size="lg"
        >
          <form className="space-y-6" onSubmit={(e) => {
            e.preventDefault();

            if (selectedMember) {
              setMembersList(prev => prev.map(m => m.id === selectedMember.id ? { ...m, ...formData } as User : m));
            } else {
              const newMember = {
                id: Math.random().toString(),
                name: formData.name || "",
                email: formData.email || "",
                role: formData.role || "editor",
                phone: formData.phone || "",
                jobTitle: formData.jobTitle || "",
                isActive: formData.isActive ?? true,
                joinedDate: new Date().toISOString().split('T')[0],
                avatar: "",
              } as User;
              setMembersList(prev => [...prev, newMember]);
            }
            setShowAddMemberModal(false);
          }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField label={language === "ar" ? "الاسم الكامل" : "Full Name"} required>
                <input
                  type="text"
                  value={formData.name || ""}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-stone-gray/10 border border-desert-gold/20 rounded-lg px-4 py-3 text-elegant-white outline-none focus:border-desert-gold"
                />
              </FormField>

              <FormField label={language === "ar" ? "البريد الإلكتروني" : "Email"} required>
                <input
                  type="email"
                  value={formData.email || ""}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-stone-gray/10 border border-desert-gold/20 rounded-lg px-4 py-3 text-elegant-white outline-none focus:border-desert-gold"
                />
              </FormField>

              <FormField label={language === "ar" ? "الدور" : "Role"} required>
                <SelectContext
                  options={[
                    { value: "admin", label: { ar: "مدير النظام", en: "Admin" } },
                    { value: "sales_manager", label: { ar: "مدير مبيعات", en: "Sales Manager" } },
                    { value: "accountant", label: { ar: "محاسب", en: "Accountant" } },
                    { value: "editor", label: { ar: "مدخل بيانات", en: "Editor" } },
                    { value: "reviewer", label: { ar: "مراجع", en: "Reviewer" } },
                  ]}

                  value={selectedMember?.role || formData.role}
                  onChange={(val) => setFormData({ ...formData, role: val as UserRole })}
                  placeholder={language === "ar" ? "اختر الدور" : "Select Role"}
                  language={language}
                />
              </FormField>

              <FormField label={language === "ar" ? "رقم الجوال" : "Phone"} required>
                <input
                  type="tel"
                  value={formData.phone || ""}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-stone-gray/10 border border-desert-gold/20 rounded-lg px-4 py-3 text-elegant-white outline-none focus:border-desert-gold"
                />
              </FormField>

              <FormField label={language === "ar" ? "المسمى الوظيفي" : "Job Title"}>
                <input
                  type="text"
                  value={formData.jobTitle || ""}
                  onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                  className="w-full bg-stone-gray/10 border border-desert-gold/20 rounded-lg px-4 py-3 text-elegant-white outline-none focus:border-desert-gold"
                />
              </FormField>

              <FormField label={language === "ar" ? "الحالة" : "Status"}>
                <SelectContext
                  options={[
                    { value: "active", label: { ar: "نشط", en: "Active" } },
                    { value: "inactive", label: { ar: "غير نشط", en: "Inactive" } },
                  ]}
                  value={formData.isActive ? "active" : "inactive"}
                  onChange={(val) => setFormData({ ...formData, isActive: val === "active" })}
                  language={language}
                  placeholder={language === "ar" ? "اختر الحالة" : "Select Status"}
                />
              </FormField>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-1">
                <UploadLabel htmlFor="contract" label={language === "ar" ? "رفع العقد" : "Upload Contract"} withBorder />
                <input type="file" id="contract" className="hidden" />
              </div>
              <div className="col-span-1">
                <UploadLabel htmlFor="photo" icon={<Camera className="w-5 h-5 mx-auto mb-2 text-stone-gray" />} label={language === "ar" ? "صورة شخصية" : "Profile Photo"} withBorder />
                <input type="file" id="photo" className="hidden" accept="image/*" />
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-6 border-t border-desert-gold/10">
              <motion.button
                type="button"
                onClick={() => setShowAddMemberModal(false)}
                className="px-6 py-3 border border-desert-gold/20 text-stone-gray rounded-lg hover:bg-stone-gray/10"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {language === "ar" ? "إلغاء" : "Cancel"}
              </motion.button>
              <motion.button
                type="submit"
                className="px-6 py-3 bg-desert-gold text-deep-black rounded-lg font-medium hover:bg-warm-sand"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {language === "ar" ? "حفظ" : "Save"}
              </motion.button>
            </div>
          </form>
        </Modal>
      </div>
    </PageWrapper>
  );
}
