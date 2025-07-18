'use client';

import { motion } from 'framer-motion';
import { useDirection } from '@/context/DirectionContext';
import { useState } from 'react';
import { Plus, Shield, User, Clock, Activity, Eye, Edit, Trash2, UserPlus, Settings, Monitor } from 'lucide-react';
import PageWrapper from '../components/PageWrapper';
import DataTable from '../components/shared/DataTable';
import StatusBadge from '../components/shared/StatusBadge';
import Modal from '../components/shared/Modal';
import FormField from '../components/shared/FormField';
import SelectContext from '@/components/ui/select-context';

export default function TeamPage() {
  const { language } = useDirection();
  const [activeTab, setActiveTab] = useState('members');
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [showPermissionsModal, setShowPermissionsModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState<any>(null);

  // Mock data
  const teamMembers = [
    {
      id: 1,
      name: language === 'ar' ? 'أحمد العتيبي' : 'Ahmed Al-Otaibi',
      email: 'ahmed@nokhbat.sa',
      role: 'admin',
      department: language === 'ar' ? 'الإدارة' : 'Management',
      status: 'active',
      lastLogin: '2024-01-22 10:30',
      joinDate: '2023-01-15',
      avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
    },
    {
      id: 2,
      name: language === 'ar' ? 'فاطمة الحربي' : 'Fatima Al-Harbi',
      email: 'fatima@nokhbat.sa',
      role: 'sales',
      department: language === 'ar' ? 'المبيعات' : 'Sales',
      status: 'active',
      lastLogin: '2024-01-22 09:15',
      joinDate: '2023-03-20',
      avatar: 'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
    },
    {
      id: 3,
      name: language === 'ar' ? 'خالد المطيري' : 'Khalid Al-Mutairi',
      email: 'khalid@nokhbat.sa',
      role: 'support',
      department: language === 'ar' ? 'الدعم الفني' : 'Technical Support',
      status: 'active',
      lastLogin: '2024-01-21 16:45',
      joinDate: '2023-06-10',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
    },
    {
      id: 4,
      name: language === 'ar' ? 'نورا السالم' : 'Nora Al-Salem',
      email: 'nora@nokhbat.sa',
      role: 'viewer',
      department: language === 'ar' ? 'المحاسبة' : 'Accounting',
      status: 'inactive',
      lastLogin: '2024-01-20 14:20',
      joinDate: '2023-09-05',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
    }
  ];

  const activityLog = [
    {
      id: 1,
      user: language === 'ar' ? 'أحمد العتيبي' : 'Ahmed Al-Otaibi',
      action: language === 'ar' ? 'تسجيل دخول' : 'Login',
      details: language === 'ar' ? 'تسجيل دخول من Chrome على Windows' : 'Logged in from Chrome on Windows',
      timestamp: '2024-01-22 10:30:15',
      ip: '192.168.1.100',
      device: 'Desktop'
    },
    {
      id: 2,
      user: language === 'ar' ? 'فاطمة الحربي' : 'Fatima Al-Harbi',
      action: language === 'ar' ? 'إضافة عميل جديد' : 'Added new customer',
      details: language === 'ar' ? 'أضافت عميل جديد: سعد الدوسري' : 'Added new customer: Saad Al-Dosari',
      timestamp: '2024-01-22 09:45:30',
      ip: '192.168.1.101',
      device: 'Mobile'
    },
    {
      id: 3,
      user: language === 'ar' ? 'خالد المطيري' : 'Khalid Al-Mutairi',
      action: language === 'ar' ? 'تحديث طلب صيانة' : 'Updated maintenance request',
      details: language === 'ar' ? 'حدث حالة الطلب MT-2024-001 إلى مكتمل' : 'Updated request MT-2024-001 status to completed',
      timestamp: '2024-01-22 08:20:45',
      ip: '192.168.1.102',
      device: 'Tablet'
    }
  ];

  const loginAudit = [
    {
      id: 1,
      user: language === 'ar' ? 'أحمد العتيبي' : 'Ahmed Al-Otaibi',
      loginTime: '2024-01-22 10:30:15',
      logoutTime: null,
      ip: '192.168.1.100',
      device: 'Chrome on Windows 11',
      location: language === 'ar' ? 'الرياض، السعودية' : 'Riyadh, Saudi Arabia',
      status: 'active'
    },
    {
      id: 2,
      user: language === 'ar' ? 'فاطمة الحربي' : 'Fatima Al-Harbi',
      loginTime: '2024-01-22 09:15:30',
      logoutTime: '2024-01-22 17:30:00',
      ip: '192.168.1.101',
      device: 'Safari on iPhone 15',
      location: language === 'ar' ? 'جدة، السعودية' : 'Jeddah, Saudi Arabia',
      status: 'completed'
    },
    {
      id: 3,
      user: language === 'ar' ? 'خالد المطيري' : 'Khalid Al-Mutairi',
      loginTime: '2024-01-21 16:45:20',
      logoutTime: '2024-01-21 23:15:10',
      ip: '192.168.1.102',
      device: 'Edge on Windows 10',
      location: language === 'ar' ? 'الدمام، السعودية' : 'Dammam, Saudi Arabia',
      status: 'completed'
    }
  ];

  const permissions = {
    dashboard: { ar: 'لوحة التحكم', en: 'Dashboard' },
    customers: { ar: 'إدارة العملاء', en: 'Customer Management' },
    sales: { ar: 'المبيعات والحجوزات', en: 'Sales & Booking' },
    contracts: { ar: 'العقود والملكية', en: 'Contracts & Ownership' },
    projects: { ar: 'المشاريع والوحدات', en: 'Projects & Units' },
    payments: { ar: 'المدفوعات', en: 'Payments' },
    support: { ar: 'خدمة ما بعد البيع', en: 'After-Sales Support' },
    team: { ar: 'الفريق والأدوار', en: 'Team & Roles' },
    reports: { ar: 'التقارير والتحليلات', en: 'Reports & Analytics' },
    notifications: { ar: 'الإشعارات', en: 'Notifications' }
  };

  const rolePermissions = {
    admin: Object.keys(permissions),
    sales: ['dashboard', 'customers', 'sales', 'contracts', 'projects', 'reports'],
    support: ['dashboard', 'customers', 'support', 'reports'],
    viewer: ['dashboard', 'reports']
  };

  const getRoleVariant = (role: string) => {
    switch (role) {
      case 'admin':
        return 'error';
      case 'sales':
        return 'warning';
      case 'support':
        return 'info';
      case 'viewer':
        return 'default';
      default:
        return 'default';
    }
  };

  const getRoleLabel = (role: string) => {
    const labels: Record<string, { ar: string; en: string }> = {
      admin: { ar: 'مدير', en: 'Admin' },
      sales: { ar: 'مبيعات', en: 'Sales' },
      support: { ar: 'دعم فني', en: 'Support' },
      viewer: { ar: 'مشاهد', en: 'Viewer' }
    };
    return labels[role]?.[language] || role;
  };

  const getStatusVariant = (status: string) => {
    return status === 'active' ? 'success' : 'error';
  };

  const getStatusLabel = (status: string) => {
    return status === 'active' ? 
      (language === 'ar' ? 'نشط' : 'Active') : 
      (language === 'ar' ? 'غير نشط' : 'Inactive');
  };

  const tabs = [
    { id: 'members', label: language === 'ar' ? 'أعضاء الفريق' : 'Team Members' },
    { id: 'permissions', label: language === 'ar' ? 'الصلاحيات' : 'Role Permissions' },
    { id: 'activity', label: language === 'ar' ? 'سجل النشاطات' : 'Activity Log' },
    { id: 'audit', label: language === 'ar' ? 'سجل تسجيل الدخول' : 'Login Audit' }
  ];

  const memberColumns = [
    {
      key: 'name',
      label: language === 'ar' ? 'الاسم' : 'Name',
      sortable: true,
      render: (value: string, row: any) => (
        <div className="flex items-center space-x-3 rtl:space-x-reverse">
          <img
            src={row.avatar}
            alt={value}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <div className="text-elegant-white font-medium">{value}</div>
            <div className="text-stone-gray text-sm">{row.email}</div>
          </div>
        </div>
      )
    },
    {
      key: 'role',
      label: language === 'ar' ? 'الدور' : 'Role',
      render: (value: string) => (
        <StatusBadge 
          status={getRoleLabel(value)} 
          variant={getRoleVariant(value)} 
        />
      )
    },
    {
      key: 'department',
      label: language === 'ar' ? 'القسم' : 'Department',
      render: (value: string) => (
        <span className="text-stone-gray">{value}</span>
      )
    },
    {
      key: 'status',
      label: language === 'ar' ? 'الحالة' : 'Status',
      render: (value: string) => (
        <StatusBadge 
          status={getStatusLabel(value)} 
          variant={getStatusVariant(value)} 
        />
      )
    },
    {
      key: 'lastLogin',
      label: language === 'ar' ? 'آخر دخول' : 'Last Login',
      render: (value: string) => (
        <span className="text-stone-gray">{value}</span>
      )
    },
    {
      key: 'joinDate',
      label: language === 'ar' ? 'تاريخ الانضمام' : 'Join Date',
      render: (value: string) => (
        <span className="text-stone-gray">{value}</span>
      )
    }
  ];

  const activityColumns = [
    {
      key: 'user',
      label: language === 'ar' ? 'المستخدم' : 'User',
      sortable: true
    },
    {
      key: 'action',
      label: language === 'ar' ? 'الإجراء' : 'Action',
      render: (value: string) => (
        <span className="text-desert-gold font-medium">{value}</span>
      )
    },
    {
      key: 'details',
      label: language === 'ar' ? 'التفاصيل' : 'Details',
      render: (value: string) => (
        <span className="text-stone-gray">{value}</span>
      )
    },
    {
      key: 'timestamp',
      label: language === 'ar' ? 'الوقت' : 'Timestamp',
      render: (value: string) => (
        <span className="text-stone-gray">{value}</span>
      )
    },
    {
      key: 'device',
      label: language === 'ar' ? 'الجهاز' : 'Device',
      render: (value: string) => (
        <span className="text-stone-gray">{value}</span>
      )
    }
  ];

  const auditColumns = [
    {
      key: 'user',
      label: language === 'ar' ? 'المستخدم' : 'User',
      sortable: true
    },
    {
      key: 'loginTime',
      label: language === 'ar' ? 'وقت الدخول' : 'Login Time',
      render: (value: string) => (
        <span className="text-elegant-white">{value}</span>
      )
    },
    {
      key: 'logoutTime',
      label: language === 'ar' ? 'وقت الخروج' : 'Logout Time',
      render: (value: string | null) => (
        <span className="text-stone-gray">{value || (language === 'ar' ? 'لا يزال متصل' : 'Still active')}</span>
      )
    },
    {
      key: 'device',
      label: language === 'ar' ? 'الجهاز' : 'Device',
      render: (value: string) => (
        <span className="text-stone-gray">{value}</span>
      )
    },
    {
      key: 'location',
      label: language === 'ar' ? 'الموقع' : 'Location',
      render: (value: string) => (
        <span className="text-stone-gray">{value}</span>
      )
    },
    {
      key: 'status',
      label: language === 'ar' ? 'الحالة' : 'Status',
      render: (value: string) => (
        <StatusBadge 
          status={value === 'active' ? (language === 'ar' ? 'نشط' : 'Active') : (language === 'ar' ? 'مكتمل' : 'Completed')} 
          variant={value === 'active' ? 'success' : 'default'} 
          size="sm"
        />
      )
    }
  ];

  const handleView = (member: any) => {
    setSelectedMember(member);
  };

  const handleEdit = (member: any) => {
    setSelectedMember(member);
    setShowAddMemberModal(true);
  };

  const handleDelete = (member: any) => {
    if (confirm(language === 'ar' ? 'هل أنت متأكد من حذف هذا العضو؟' : 'Are you sure you want to delete this member?')) {
      console.log('Delete member:', member);
    }
  };

  return (
    <PageWrapper>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-elegant-white">
              {language === 'ar' ? 'الفريق والأدوار' : 'Team & Roles Management'}
            </h1>
            <p className="text-stone-gray mt-1">
              {language === 'ar' ? 'إدارة أعضاء الفريق والصلاحيات' : 'Manage team members and permissions'}
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
              <span>{language === 'ar' ? 'إدارة الصلاحيات' : 'Manage Permissions'}</span>
            </motion.button>
            <motion.button
              onClick={() => setShowAddMemberModal(true)}
              className="bg-desert-gold text-deep-black px-6 py-3 rounded-lg font-medium hover:bg-warm-sand transition-all duration-300 flex items-center space-x-2 rtl:space-x-reverse"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <UserPlus className="h-5 w-5" />
              <span>{language === 'ar' ? 'إضافة عضو' : 'Add Member'}</span>
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
                    ? 'border-desert-gold text-desert-gold'
                    : 'border-transparent text-stone-gray hover:text-elegant-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="mt-6">
          {activeTab === 'members' && (
            <DataTable
              columns={memberColumns}
              data={teamMembers}
              searchPlaceholder={language === 'ar' ? 'البحث في أعضاء الفريق...' : 'Search team members...'}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}

          {activeTab === 'permissions' && (
            <div className="bg-obsidian/50 backdrop-blur-sm rounded-xl p-8 border border-desert-gold/20">
              <h2 className="text-2xl font-bold text-elegant-white mb-6">
                {language === 'ar' ? 'صلاحيات الأدوار' : 'Role Permissions'}
              </h2>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-desert-gold/20">
                      <th className="text-left py-4 px-4 text-elegant-white font-medium">
                        {language === 'ar' ? 'الوحدة' : 'Module'}
                      </th>
                      <th className="text-center py-4 px-4 text-elegant-white font-medium">
                        {language === 'ar' ? 'مدير' : 'Admin'}
                      </th>
                      <th className="text-center py-4 px-4 text-elegant-white font-medium">
                        {language === 'ar' ? 'مبيعات' : 'Sales'}
                      </th>
                      <th className="text-center py-4 px-4 text-elegant-white font-medium">
                        {language === 'ar' ? 'دعم فني' : 'Support'}
                      </th>
                      <th className="text-center py-4 px-4 text-elegant-white font-medium">
                        {language === 'ar' ? 'مشاهد' : 'Viewer'}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(permissions).map(([key, value]) => (
                      <tr key={key} className="border-b border-desert-gold/10 hover:bg-stone-gray/5">
                        <td className="py-4 px-4 text-stone-gray">
                          {value[language]}
                        </td>
                        {['admin', 'sales', 'support', 'viewer'].map((role) => (
                          <td key={role} className="py-4 px-4 text-center">
                            <div className="flex justify-center">
                              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                                rolePermissions[role as keyof typeof rolePermissions]?.includes(key)
                                  ? 'bg-green-500 text-white'
                                  : 'bg-stone-gray/20 text-stone-gray'
                              }`}>
                                {rolePermissions[role as keyof typeof rolePermissions]?.includes(key) ? '✓' : '✗'}
                              </div>
                            </div>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'activity' && (
            <DataTable
              columns={activityColumns}
              data={activityLog}
              searchPlaceholder={language === 'ar' ? 'البحث في سجل النشاطات...' : 'Search activity log...'}
            />
          )}

          {activeTab === 'audit' && (
            <DataTable
              columns={auditColumns}
              data={loginAudit}
              searchPlaceholder={language === 'ar' ? 'البحث في سجل تسجيل الدخول...' : 'Search login audit...'}
            />
          )}
        </div>

        {/* Add Member Modal */}
        <Modal
          isOpen={showAddMemberModal}
          onClose={() => {
            setShowAddMemberModal(false);
            setSelectedMember(null);
          }}
          title={selectedMember ? 
            (language === 'ar' ? 'تعديل عضو الفريق' : 'Edit Team Member') : 
            (language === 'ar' ? 'إضافة عضو جديد' : 'Add New Team Member')
          }
          size="lg"
        >
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField label={language === 'ar' ? 'الاسم الكامل' : 'Full Name'} required>
                <input
                  type="text"
                  defaultValue={selectedMember?.name || ''}
                  className="w-full bg-stone-gray/10 border border-desert-gold/20 rounded-lg px-4 py-3 text-elegant-white placeholder-stone-gray focus:outline-none focus:border-desert-gold transition-colors duration-300"
                  placeholder={language === 'ar' ? 'أدخل الاسم الكامل' : 'Enter full name'}
                />
              </FormField>

              <FormField label={language === 'ar' ? 'البريد الإلكتروني' : 'Email'} required>
                <input
                  type="email"
                  defaultValue={selectedMember?.email || ''}
                  className="w-full bg-stone-gray/10 border border-desert-gold/20 rounded-lg px-4 py-3 text-elegant-white placeholder-stone-gray focus:outline-none focus:border-desert-gold transition-colors duration-300"
                  placeholder="example@nokhbat.sa"
                />
              </FormField>

              <FormField label={language === 'ar' ? 'الدور' : 'Role'} required>
                <SelectContext
                  options={[
                    { value: 'admin', label: { ar: 'مدير', en: 'Admin' } },
                    { value: 'sales', label: { ar: 'مبيعات', en: 'Sales' } },
                    { value: 'support', label: { ar: 'دعم فني', en: 'Support' } },
                    { value: 'viewer', label: { ar: 'مشاهد', en: 'Viewer' } }
                  ]}
                  value={selectedMember?.role || 'viewer'}
                  onChange={() => {}}
                  placeholder={language === 'ar' ? 'اختر الدور' : 'Select Role'}
                  language={language}
                />
              </FormField>

              <FormField label={language === 'ar' ? 'القسم' : 'Department'} required>
                <SelectContext
                  options={[
                    { value: 'unassigned', label: { ar: 'اختر القسم', en: 'Select Department' } },
                    { value: 'management', label: { ar: 'الإدارة', en: 'Management' } },
                    { value: 'sales', label: { ar: 'المبيعات', en: 'Sales' } },
                    { value: 'support', label: { ar: 'الدعم الفني', en: 'Technical Support' } },
                    { value: 'accounting', label: { ar: 'المحاسبة', en: 'Accounting' } }
                  ]}
                  value=""
                  onChange={() => {}}
                  placeholder={language === 'ar' ? 'اختر القسم' : 'Select Department'}
                  language={language}
                />
              </FormField>

              {!selectedMember && (
                <FormField label={language === 'ar' ? 'كلمة المرور' : 'Password'} required>
                  <input
                    type="password"
                    className="w-full bg-stone-gray/10 border border-desert-gold/20 rounded-lg px-4 py-3 text-elegant-white placeholder-stone-gray focus:outline-none focus:border-desert-gold transition-colors duration-300"
                    placeholder={language === 'ar' ? 'أدخل كلمة المرور' : 'Enter password'}
                  />
                </FormField>
              )}

              <FormField label={language === 'ar' ? 'الحالة' : 'Status'} required>
                <SelectContext
                  options={[
                    { value: 'active', label: { ar: 'نشط', en: 'Active' } },
                    { value: 'inactive', label: { ar: 'غير نشط', en: 'Inactive' } }
                  ]}
                  value={selectedMember?.status || 'active'}
                  onChange={() => {}}
                  placeholder={language === 'ar' ? 'اختر الحالة' : 'Select Status'}
                  language={language}
                />
              </FormField>
            </div>

            <div className="flex justify-end space-x-4 rtl:space-x-reverse pt-6">
              <motion.button
                type="button"
                onClick={() => {
                  setShowAddMemberModal(false);
                  setSelectedMember(null);
                }}
                className="px-6 py-3 border border-desert-gold/20 text-stone-gray rounded-lg hover:bg-stone-gray/10 transition-all duration-300"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {language === 'ar' ? 'إلغاء' : 'Cancel'}
              </motion.button>
              <motion.button
                type="submit"
                className="px-6 py-3 bg-desert-gold text-deep-black rounded-lg font-medium hover:bg-warm-sand transition-all duration-300"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {selectedMember ? 
                  (language === 'ar' ? 'تحديث' : 'Update') : 
                  (language === 'ar' ? 'إضافة' : 'Add')
                }
              </motion.button>
            </div>
          </form>
        </Modal>

        {/* Permissions Management Modal */}
        <Modal
          isOpen={showPermissionsModal}
          onClose={() => setShowPermissionsModal(false)}
          title={language === 'ar' ? 'إدارة الصلاحيات' : 'Manage Permissions'}
          size="xl"
        >
          <div className="space-y-6">
            <p className="text-stone-gray">
              {language === 'ar' 
                ? 'يمكنك تخصيص الصلاحيات لكل دور حسب احتياجات المؤسسة'
                : 'You can customize permissions for each role based on organizational needs'
              }
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {['admin', 'sales', 'support', 'viewer'].map((role) => (
                <div key={role} className="bg-stone-gray/10 rounded-lg p-4">
                  <h3 className="text-lg font-bold text-elegant-white mb-4 text-center">
                    {getRoleLabel(role)}
                  </h3>
                  <div className="space-y-2">
                    {Object.entries(permissions).map(([key, value]) => (
                      <label key={key} className="flex items-center space-x-2 rtl:space-x-reverse">
                        <input
                          type="checkbox"
                          defaultChecked={rolePermissions[role as keyof typeof rolePermissions]?.includes(key)}
                          className="text-desert-gold focus:ring-desert-gold"
                        />
                        <span className="text-stone-gray text-sm">{value[language]}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end space-x-4 rtl:space-x-reverse pt-6">
              <motion.button
                type="button"
                onClick={() => setShowPermissionsModal(false)}
                className="px-6 py-3 border border-desert-gold/20 text-stone-gray rounded-lg hover:bg-stone-gray/10 transition-all duration-300"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {language === 'ar' ? 'إلغاء' : 'Cancel'}
              </motion.button>
              <motion.button
                type="submit"
                className="px-6 py-3 bg-desert-gold text-deep-black rounded-lg font-medium hover:bg-warm-sand transition-all duration-300"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {language === 'ar' ? 'حفظ التغييرات' : 'Save Changes'}
              </motion.button>
            </div>
          </div>
        </Modal>
      </div>
    </PageWrapper>
  );
}