"use client";

import { motion } from "framer-motion";
import { useDirection } from "@/context/DirectionContext";
import { ReactElement, JSXElementConstructor } from "react";
import { Controller, Control, FieldPath, FieldValues, ControllerRenderProps, ControllerFieldState, UseFormStateReturn } from "react-hook-form";

interface WizardFormFieldProps<T extends FieldValues = FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  render: ({
    field,
    fieldState,
    formState,
  }: {
    field: ControllerRenderProps<T, FieldPath<T>>;
    fieldState: ControllerFieldState;
    formState: UseFormStateReturn<T>;
  }) => ReactElement<any, string | JSXElementConstructor<any>>;
  error?: string;
  required?: boolean;
  className?: string;
}

const WizardFormField = <T extends FieldValues = FieldValues>({
  control,
  name,
  label,
  render,
  error,
  required,
  className = "",
}: WizardFormFieldProps<T>) => {
  const { isRTL } = useDirection();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`space-y-2 ${className}`}
    >
      <label
        className={`block text-sm font-medium text-elegant-white ${
          isRTL ? "text-right" : "text-left"
        }`}
      >
        {label}
        {required && <span className="text-desert-gold ml-1">*</span>}
      </label>
      <Controller control={control} name={name} render={render} />
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

export default WizardFormField;
