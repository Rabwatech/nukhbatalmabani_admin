'use client';

import { motion, AnimatePresence, Variants } from 'framer-motion';
import { useDirection } from '@/context/DirectionContext';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  Home, 
  Users, 
  ShoppingCart, 
  FileText, 
  Building2, 
  CreditCard, 
  Headphones, 
  UserCheck, 
  BarChart3, 
  Bell,
  X,
  ChevronRight
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const { isRTL, language } = useDirection();
  const pathname = usePathname();

  const menuItems = [
    {
      id: 'dashboard',
      icon: Home,
      label: language === 'ar' ? 'لوحة التحكم' : 'Dashboard',
      href: '/dashboard'
    },
    {
      id: 'customers',
      icon: Users,
      label: language === 'ar' ? 'إدارة العملاء' : 'Customer Management',
      href: '/dashboard/customers'
    },
    {
      id: 'sales',
      icon: ShoppingCart,
      label: language === 'ar' ? 'المبيعات والحجوزات' : 'Sales & Booking',
      href: '/dashboard/sales'
    },
    {
      id: 'contracts',
      icon: FileText,
      label: language === 'ar' ? 'العقود والملكية' : 'Contracts & Ownership',
      href: '/dashboard/contracts'
    },
    {
      id: 'projects',
      icon: Building2,
      label: language === 'ar' ? 'المشاريع والوحدات' : 'Projects & Units',
      href: '/dashboard/projects'
    },
    {
      id: 'payments',
      icon: CreditCard,
      label: language === 'ar' ? 'المدفوعات' : 'Payments',
      href: '/dashboard/payments'
    },
    {
      id: 'support',
      icon: Headphones,
      label: language === 'ar' ? 'خدمة ما بعد البيع' : 'After-Sales Support',
      href: '/dashboard/support'
    },
    {
      id: 'team',
      icon: UserCheck,
      label: language === 'ar' ? 'الفريق والأدوار' : 'Team & Roles',
      href: '/dashboard/team'
    },
    {
      id: 'reports',
      icon: BarChart3,
      label: language === 'ar' ? 'التقارير والتحليلات' : 'Reports & Analytics',
      href: '/dashboard/reports'
    },
    {
      id: 'notifications',
      icon: Bell,
      label: language === 'ar' ? 'الإشعارات' : 'Notifications',
      href: '/dashboard/notifications'
    }
  ];

  const sidebarVariants: Variants = {
    open: {
      x: "0%",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    },
    closed: {
      x: isRTL ? '100%' : '-100%',
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    }
  };

  const overlayVariants: Variants = {
    open: { opacity: 1 },
    closed: { opacity: 0 }
  };

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={overlayVariants}
            className="fixed inset-0 z-40 bg-deep-black/50 backdrop-blur-sm lg:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <div className={`hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col ${isRTL ? 'lg:right-0' : 'lg:left-0'}`}>
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-obsidian/90 backdrop-blur-xl border-r border-desert-gold/20 px-6 pb-4">
          {/* Logo */}
          <div className="flex h-16 shrink-0 items-center">
            <motion.div
              className="flex items-center space-x-3 rtl:space-x-reverse"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <Building2 className="h-8 w-8 text-desert-gold" />
              <span className="text-xl font-bold text-elegant-white">
                {language === 'ar' ? 'نخبة المباني' : 'Nokhbat Almabani'}
              </span>
            </motion.div>
          </div>

          {/* Navigation */}
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {menuItems.map((item, index) => {
                    const isActive = pathname === item.href;
                    return (
                      <motion.li
                        key={item.id}
                        initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Link
                          href={item.href}
                          className={`group flex gap-x-3 rounded-md p-3 text-sm leading-6 font-medium transition-all duration-200 ${
                            isActive
                              ? 'bg-desert-gold text-deep-black shadow-lg'
                              : 'text-stone-gray hover:text-elegant-white hover:bg-stone-gray/10'
                          }`}
                        >
                          <item.icon
                            className={`h-5 w-5 shrink-0 transition-colors duration-200 ${
                              isActive ? 'text-deep-black' : 'text-stone-gray group-hover:text-elegant-white'
                            }`}
                          />
                          {item.label}
                          {isActive && (
                            <motion.div
                              layoutId="activeIndicator"
                              className={`ml-auto ${isRTL ? 'mr-auto ml-0' : ''}`}
                            >
                              <ChevronRight className={`h-4 w-4 text-deep-black ${isRTL ? 'rotate-180' : ''}`} />
                            </motion.div>
                          )}
                        </Link>
                      </motion.li>
                    );
                  })}
                </ul>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={sidebarVariants}
            className={`fixed inset-y-0 z-50 flex w-72 flex-col lg:hidden ${isRTL ? 'right-0' : 'left-0'}`}
          >
            <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-obsidian/95 backdrop-blur-xl border-r border-desert-gold/20 px-6 pb-4">
              {/* Mobile Header */}
              <div className="flex h-16 shrink-0 items-center justify-between">
                <motion.div
                  className="flex items-center space-x-3 rtl:space-x-reverse"
                  whileHover={{ scale: 1.05 }}
                >
                  <Building2 className="h-8 w-8 text-desert-gold" />
                  <span className="text-xl font-bold text-elegant-white">
                    {language === 'ar' ? 'نخبة المباني' : 'Nokhbat Almabani'}
                  </span>
                </motion.div>
                <motion.button
                  onClick={onClose}
                  className="text-stone-gray hover:text-elegant-white transition-colors duration-200"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="h-6 w-6" />
                </motion.button>
              </div>

              {/* Mobile Navigation */}
              <nav className="flex flex-1 flex-col">
                <ul role="list" className="flex flex-1 flex-col gap-y-7">
                  <li>
                    <ul role="list" className="-mx-2 space-y-1">
                      {menuItems.map((item, index) => {
                        const isActive = pathname === item.href;
                        return (
                          <motion.li
                            key={item.id}
                            initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                          >
                            <Link
                              href={item.href}
                              onClick={onClose}
                              className={`group flex gap-x-3 rounded-md p-3 text-sm leading-6 font-medium transition-all duration-200 ${
                                isActive
                                  ? 'bg-desert-gold text-deep-black shadow-lg'
                                  : 'text-stone-gray hover:text-elegant-white hover:bg-stone-gray/10'
                              }`}
                            >
                              <item.icon
                                className={`h-5 w-5 shrink-0 transition-colors duration-200 ${
                                  isActive ? 'text-deep-black' : 'text-stone-gray group-hover:text-elegant-white'
                                }`}
                              />
                              {item.label}
                            </Link>
                          </motion.li>
                        );
                      })}
                    </ul>
                  </li>
                </ul>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;