import { Upload } from 'lucide-react';
import React from 'react';

interface UploadLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  label: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
  withBorder?: boolean;
}

const UploadLabel: React.FC<UploadLabelProps> = ({
  label,
  icon,
  className = '',
  children,
  withBorder = false,
  ...props
}) => {
  const borderClass = withBorder
    ? 'border-2 border-dashed border-desert-gold/30 hover:border-desert-gold/50 transition-colors duration-300 p-4'
    : '';
  return (
    <label
      {...props}
      className={`cursor-pointer flex flex-col items-center justify-center ${borderClass} ${className}`}
    >
      {icon || <Upload className="h-6 w-6 text-desert-gold mx-auto mb-2" />}
      <p className="text-stone-gray text-sm">{label}</p>
      {children}
    </label>
  );
};

export default UploadLabel; 