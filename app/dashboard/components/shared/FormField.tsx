'use client';

import { motion } from 'framer-motion';
import { useDirection } from '@/context/DirectionContext';
import { ReactNode } from 'react';

interface FormFieldProps {
  label: string;
  children: ReactNode;
  error?: string;
  required?: boolean;
  className?: string;
}

const FormField = ({ label, children, error, required, className = '' }: FormFieldProps) => {
  const { isRTL } = useDirection();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`space-y-2 ${className}`}
    >
      <label className={`block text-sm font-medium text-elegant-white ${isRTL ? 'text-right' : 'text-left'}`}>
        {label}
        {required && <span className="text-red-400 ml-1">*</span>}
      </label>
      {children}
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-red-400"
        >
          {error}
        </motion.p>
      )}
    </motion.div>
  );
};

export default FormField;