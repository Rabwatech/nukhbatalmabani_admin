'use client';

import { motion } from 'framer-motion';
import { useDirection } from '@/context/DirectionContext';
import { usePathname } from 'next/navigation';
import { Menu, Bell, User, Globe, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import Modal from '../components/shared/Modal';

interface HeaderProps {
  onMenuClick: () => void;
}

const Header = ({ onMenuClick }: HeaderProps) => {
  const { language, setLanguage, isRTL } = useDirection();
  const pathname = usePathname();
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);

  const getPageTitle = () => {
    const routes: Record<string, { ar: string; en: string }> = {
      '/dashboard': { ar: 'لوحة التحكم', en: 'Dashboard' },
      '/dashboard/customers': { ar: 'إدارة العملاء', en: 'Customer Management' },
      '/dashboard/sales': { ar: 'المبيعات والحجوزات', en: 'Sales & Booking' },
      '/dashboard/contracts': { ar: 'العقود والملكية', en: 'Contracts & Ownership' },
      '/dashboard/projects': { ar: 'المشاريع والوحدات', en: 'Projects & Units' },
      '/dashboard/payments': { ar: 'المدفوعات', en: 'Payments' },
      '/dashboard/support': { ar: 'خدمة ما بعد البيع', en: 'After-Sales Support' },
      '/dashboard/team': { ar: 'الفريق والأدوار', en: 'Team & Roles' },
      '/dashboard/reports': { ar: 'التقارير والتحليلات', en: 'Reports & Analytics' },
      '/dashboard/notifications': { ar: 'الإشعارات', en: 'Notifications' }
    };

    return routes[pathname]?.[language] || (language === 'ar' ? 'صفحة غير معروفة' : 'Unknown Page');
  };

  const getBreadcrumbs = () => {
    const pathSegments = pathname.split('/').filter(Boolean);
    const breadcrumbs = [];

    if (language === 'ar') {
      breadcrumbs.push({ label: 'الرئيسية', href: '/dashboard' });
      if (pathSegments.length > 1) {
        breadcrumbs.push({ label: getPageTitle(), href: pathname });
      }
    } else {
      breadcrumbs.push({ label: 'Home', href: '/dashboard' });
      if (pathSegments.length > 1) {
        breadcrumbs.push({ label: getPageTitle(), href: pathname });
      }
    }

    return breadcrumbs;
  };

  return (
    <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-desert-gold/20 bg-obsidian/90 backdrop-blur-xl px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
      {/* Mobile menu button */}
      <motion.button
        type="button"
        className="-m-2.5 p-2.5 text-stone-gray hover:text-elegant-white lg:hidden"
        onClick={onMenuClick}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Menu className="h-6 w-6" />
      </motion.button>

      {/* Separator */}
      <div className="h-6 w-px bg-desert-gold/20 lg:hidden" />

      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        {/* Breadcrumbs and Page Title */}
        <div className="flex flex-1 items-center">
          <div>
            {/* Page Title */}
            <h1 className="text-2xl font-bold text-elegant-white mt-1">
              {getPageTitle()}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-x-4 lg:gap-x-6">
          {/* Language Switcher */}
          <div className="relative">
            <motion.button
              type="button"
              className="flex items-center gap-x-1 rounded-md bg-stone-gray/10 px-3 py-2 text-sm font-medium text-stone-gray hover:text-elegant-white hover:bg-stone-gray/20 transition-all duration-200"
              onClick={() => setShowLangDropdown(!showLangDropdown)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Globe className="h-4 w-4" />
              <span>{language === 'ar' ? 'العربية' : 'English'}</span>
              <ChevronDown className="h-4 w-4" />
            </motion.button>

            {showLangDropdown && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`absolute ${isRTL ? 'left-0' : 'right-0'} mt-2 w-32 rounded-md bg-obsidian border border-desert-gold/20 shadow-lg z-50`}
              >
                <div className="py-1">
                  <button
                    onClick={() => {
                      setLanguage('ar');
                      setShowLangDropdown(false);
                    }}
                    className={`block w-full px-4 py-2 text-sm text-right hover:bg-stone-gray/10 transition-colors duration-200 ${language === 'ar' ? 'text-desert-gold bg-stone-gray/5' : 'text-stone-gray'
                      }`}
                  >
                    العربية
                  </button>
                  <button
                    onClick={() => {
                      setLanguage('en');
                      setShowLangDropdown(false);
                    }}
                    className={`block w-full px-4 py-2 text-sm text-left hover:bg-stone-gray/10 transition-colors duration-200 ${language === 'en' ? 'text-desert-gold bg-stone-gray/5' : 'text-stone-gray'
                      }`}
                  >
                    English
                  </button>
                </div>
              </motion.div>
            )}
          </div>

          {/* Notifications */}
          <motion.button
            type="button"
            className="relative rounded-full bg-stone-gray/10 p-2 text-stone-gray hover:text-elegant-white hover:bg-stone-gray/20 transition-all duration-200"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowNotificationsModal(true)}
          >
            <Bell className="h-5 w-5" />
            {/* Notification badge */}
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-desert-gold text-xs font-bold text-deep-black flex items-center justify-center">
              3
            </span>
          </motion.button>

          <Modal
            isOpen={showNotificationsModal}
            onClose={() => setShowNotificationsModal(false)}
            title={language === 'ar' ? 'الإشعارات' : 'Notifications'}
            size="sm"
          >
            {/* أزرار التحكم */}
            <div className={`flex ${isRTL ? 'flex-row-reverse' : ''} gap-2 mb-4`}>
              <button
                onClick={() => console.log('Mark all as read')}
                className="px-3 py-1 rounded bg-stone-gray/20 text-stone-gray hover:bg-desert-gold/20 hover:text-desert-gold text-xs font-medium transition-colors duration-200"
              >
                {language === 'ar' ? 'تمييز الكل كمقروء' : 'Mark all as read'}
              </button>
              <button
                onClick={() => console.log('Delete all notifications')}
                className="px-3 py-1 rounded bg-stone-gray/20 text-stone-gray hover:bg-red-500/20 hover:text-red-400 text-xs font-medium transition-colors duration-200"
              >
                {language === 'ar' ? 'حذف الكل' : 'Delete all'}
              </button>
            </div>
            <div className="space-y-4">
              {/* إشعارات وهمية */}
              <div className="bg-stone-gray/10 rounded-lg p-4 flex items-start gap-3">
                <Bell className="h-5 w-5 text-desert-gold mt-1" />
                <div>
                  <div className="text-elegant-white font-medium">{language === 'ar' ? 'تم إضافة طلب جديد' : 'New request added'}</div>
                  <div className="text-stone-gray text-xs mt-1">{language === 'ar' ? 'منذ دقيقة واحدة' : '1 minute ago'}</div>
                </div>
              </div>
              <div className="bg-stone-gray/10 rounded-lg p-4 flex items-start gap-3">
                <Bell className="h-5 w-5 text-desert-gold mt-1" />
                <div>
                  <div className="text-elegant-white font-medium">{language === 'ar' ? 'تم تحديث حالة مشروع' : 'Project status updated'}</div>
                  <div className="text-stone-gray text-xs mt-1">{language === 'ar' ? 'منذ 5 دقائق' : '5 minutes ago'}</div>
                </div>
              </div>
              <div className="bg-stone-gray/10 rounded-lg p-4 flex items-start gap-3">
                <Bell className="h-5 w-5 text-desert-gold mt-1" />
                <div>
                  <div className="text-elegant-white font-medium">{language === 'ar' ? 'تمت إضافة مستخدم جديد' : 'New user added'}</div>
                  <div className="text-stone-gray text-xs mt-1">{language === 'ar' ? 'منذ 10 دقائق' : '10 minutes ago'}</div>
                </div>
              </div>
            </div>
          </Modal>

          {/* Separator */}
          <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-desert-gold/20" />

          {/* Profile dropdown */}
          <div className="relative">
            <motion.button
              type="button"
              className="flex items-center gap-x-2 rounded-full bg-stone-gray/10 p-2 text-sm hover:bg-stone-gray/20 transition-all duration-200"
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="h-8 w-8 rounded-full bg-desert-gold flex items-center justify-center">
                <User className="h-5 w-5 text-deep-black" />
              </div>
              <span className="hidden lg:flex lg:items-center">
                <span className="text-sm font-medium text-elegant-white">
                  {language === 'ar' ? 'أحمد العتيبي' : 'Ahmed Al-Otaibi'}
                </span>
                <ChevronDown className="ml-2 h-4 w-4 text-stone-gray" />
              </span>
            </motion.button>

            {showProfileDropdown && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`absolute ${isRTL ? 'left-0' : 'right-0'} mt-2 w-48 rounded-md bg-obsidian border border-desert-gold/20 shadow-lg z-50`}
              >
                <div className="py-1">
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-stone-gray hover:bg-stone-gray/10 hover:text-elegant-white transition-colors duration-200"
                  >
                    {language === 'ar' ? 'الملف الشخصي' : 'Your Profile'}
                  </a>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-stone-gray hover:bg-stone-gray/10 hover:text-elegant-white transition-colors duration-200"
                  >
                    {language === 'ar' ? 'الإعدادات' : 'Settings'}
                  </a>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-stone-gray hover:bg-stone-gray/10 hover:text-elegant-white transition-colors duration-200"
                  >
                    {language === 'ar' ? 'تسجيل الخروج' : 'Sign out'}
                  </a>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;