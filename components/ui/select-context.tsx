// SelectContext: Reusable styled select dropdown for filters/forms
// Usage:
// <SelectContext
//   options={[{ value: 'all', label: { ar: 'الكل', en: 'All' } }, ...]}
//   value={value}
//   onChange={setValue}
//   placeholder={options[0].label[language]}
//   language={language}
// />

import React from 'react';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from './select';

interface Option {
  value: string;
  label: { ar: string; en: string };
}

interface SelectContextProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  language: 'ar' | 'en';
  className?: string;
}

const SelectContext: React.FC<SelectContextProps> = ({
  options,
  value,
  onChange,
  placeholder,
  language,
  className = ''
}) => {
  // Filter out options with empty string values to prevent runtime errors
  const validOptions = options.filter(opt => opt.value !== '');
  
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className={`w-full bg-[#232323]/80 border border-[#C6A15B]/30 rounded-xl shadow-lg text-[#fff] font-bold px-4 py-2 focus:ring-2 focus:ring-[#C6A15B]/40 transition h-12 ${className}`}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className="z-[9999] bg-[#232323]/95 border border-[#C6A15B]/20 rounded-xl shadow-xl text-[#fff]">
        {validOptions.map(opt => (
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
  );
};

export default SelectContext; 