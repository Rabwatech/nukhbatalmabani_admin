"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { useDirection } from "@/context/DirectionContext";
import { StepProps } from "./types";
import WizardFormField from "@/components/shared/WizardFormField";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Building2, MapPin, FileText, Hash } from "lucide-react";

const StepBasicInfo: React.FC<StepProps> = ({
  data,
  onUpdate,
  onNext,
  onPrevious,
  isFirstStep,
  isLastStep,
  isSubmitting,
}) => {
  const { language, isRTL } = useDirection();
  const form = useFormContext();

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-desert-gold/10 to-warm-sand/5 rounded-2xl p-6 border border-desert-gold/20">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-desert-gold/20 flex items-center justify-center">
            <Building2 className="h-6 w-6 text-desert-gold" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-elegant-white">
              {language === "ar" ? "المعلومات الأساسية" : "Basic Information"}
            </h3>
            <p className="text-sm text-elegant-white/70">
              {language === "ar"
                ? "أدخل المعلومات الأساسية للمشروع"
                : "Enter the basic information for your project"}
            </p>
          </div>
        </div>

        <div className="grid gap-8">
          {/* Project Name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <WizardFormField
              control={form.control}
              name="basicInfo.name.ar"
              label={
                language === "ar"
                  ? "اسم المشروع (عربي)"
                  : "Project Name (Arabic)"
              }
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder={
                    language === "ar"
                      ? "أدخل اسم المشروع بالعربية"
                      : "Enter project name in Arabic"
                  }
                  dir="rtl"
                />
              )}
            />
            <WizardFormField
              control={form.control}
              name="basicInfo.name.en"
              label={
                language === "ar"
                  ? "اسم المشروع (إنجليزي)"
                  : "Project Name (English)"
              }
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder={
                    language === "ar"
                      ? "أدخل اسم المشروع بالإنجليزية"
                      : "Enter project name in English"
                  }
                  dir="ltr"
                />
              )}
            />
          </div>

          {/* Description */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <WizardFormField
              control={form.control}
              name="basicInfo.description.ar"
              label={
                language === "ar"
                  ? "وصف المشروع (عربي)"
                  : "Project Description (Arabic)"
              }
              render={({ field }) => (
                <Textarea
                  {...field}
                  placeholder={
                    language === "ar"
                      ? "أدخل وصف المشروع بالعربية"
                      : "Enter project description in Arabic"
                  }
                  dir="rtl"
                  rows={4}
                />
              )}
            />
            <WizardFormField
              control={form.control}
              name="basicInfo.description.en"
              label={
                language === "ar"
                  ? "وصف المشروع (إنجليزي)"
                  : "Project Description (English)"
              }
              render={({ field }) => (
                <Textarea
                  {...field}
                  placeholder={
                    language === "ar"
                      ? "أدخل وصف المشروع بالإنجليزية"
                      : "Enter project description in English"
                  }
                  dir="ltr"
                  rows={4}
                />
              )}
            />
          </div>

          {/* Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <WizardFormField
              control={form.control}
              name="basicInfo.location.ar"
              label={language === "ar" ? "الموقع (عربي)" : "Location (Arabic)"}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder={
                    language === "ar"
                      ? "أدخل الموقع بالعربية"
                      : "Enter location in Arabic"
                  }
                  dir="rtl"
                />
              )}
            />
            <WizardFormField
              control={form.control}
              name="basicInfo.location.en"
              label={
                language === "ar" ? "الموقع (إنجليزي)" : "Location (English)"
              }
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder={
                    language === "ar"
                      ? "أدخل الموقع بالإنجليزية"
                      : "Enter location in English"
                  }
                  dir="ltr"
                />
              )}
            />
          </div>

          {/* City and District */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <WizardFormField
              control={form.control}
              name="basicInfo.city"
              label={language === "ar" ? "المدينة" : "City"}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder={
                    language === "ar" ? "أدخل اسم المدينة" : "Enter city name"
                  }
                />
              )}
            />
            <WizardFormField
              control={form.control}
              name="basicInfo.district"
              label={language === "ar" ? "الحي" : "District"}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder={
                    language === "ar" ? "أدخل اسم الحي" : "Enter district name"
                  }
                />
              )}
            />
          </div>

          {/* Address */}
          <WizardFormField
            control={form.control}
            name="basicInfo.address"
            label={language === "ar" ? "العنوان التفصيلي" : "Detailed Address"}
            render={({ field }) => (
              <Input
                {...field}
                placeholder={
                  language === "ar"
                    ? "أدخل العنوان التفصيلي"
                    : "Enter detailed address"
                }
              />
            )}
          />

          {/* Developer and License */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <WizardFormField
              control={form.control}
              name="basicInfo.developer"
              label={language === "ar" ? "المطور" : "Developer"}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder={
                    language === "ar"
                      ? "أدخل اسم المطور"
                      : "Enter developer name"
                  }
                />
              )}
            />
            <WizardFormField
              control={form.control}
              name="basicInfo.licenseNumber"
              label={language === "ar" ? "رقم الترخيص" : "License Number"}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder={
                    language === "ar"
                      ? "أدخل رقم الترخيص"
                      : "Enter license number"
                  }
                />
              )}
            />
          </div>

          {/* Areas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <WizardFormField
              control={form.control}
              name="basicInfo.totalArea"
              label={
                language === "ar" ? "المساحة الإجمالية (م²)" : "Total Area (m²)"
              }
              render={({ field }) => (
                <Input
                  {...field}
                  type="number"
                  placeholder={
                    language === "ar"
                      ? "أدخل المساحة الإجمالية"
                      : "Enter total area"
                  }
                  onChange={(e) =>
                    field.onChange(parseFloat(e.target.value) || 0)
                  }
                />
              )}
            />
            <WizardFormField
              control={form.control}
              name="basicInfo.landArea"
              label={language === "ar" ? "مساحة الأرض (م²)" : "Land Area (m²)"}
              render={({ field }) => (
                <Input
                  {...field}
                  type="number"
                  placeholder={
                    language === "ar" ? "أدخل مساحة الأرض" : "Enter land area"
                  }
                  onChange={(e) =>
                    field.onChange(parseFloat(e.target.value) || 0)
                  }
                />
              )}
            />
          </div>

          {/* Project Type and Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <WizardFormField
              control={form.control}
              name="basicInfo.projectType"
              label={language === "ar" ? "نوع المشروع" : "Project Type"}
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        language === "ar"
                          ? "اختر نوع المشروع"
                          : "Select project type"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="residential">
                      {language === "ar" ? "سكني" : "Residential"}
                    </SelectItem>
                    <SelectItem value="commercial">
                      {language === "ar" ? "تجاري" : "Commercial"}
                    </SelectItem>
                    <SelectItem value="mixed">
                      {language === "ar" ? "مختلط" : "Mixed"}
                    </SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            <WizardFormField
              control={form.control}
              name="basicInfo.status"
              label={language === "ar" ? "حالة المشروع" : "Project Status"}
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        language === "ar"
                          ? "اختر حالة المشروع"
                          : "Select project status"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="planning">
                      {language === "ar" ? "قيد التخطيط" : "Planning"}
                    </SelectItem>
                    <SelectItem value="under_construction">
                      {language === "ar" ? "قيد الإنشاء" : "Under Construction"}
                    </SelectItem>
                    <SelectItem value="completed">
                      {language === "ar" ? "مكتمل" : "Completed"}
                    </SelectItem>
                    <SelectItem value="sold_out">
                      {language === "ar" ? "مباع بالكامل" : "Sold Out"}
                    </SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepBasicInfo;
