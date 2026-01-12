"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { useDirection } from "@/context/DirectionContext";
import { StepProps } from "./types";
import WizardFormField from "@/components/shared/WizardFormField";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Users, FileText } from "lucide-react";
import FileUploadArea from "@/components/shared/FileUploadArea";

const StepAssociations: React.FC<StepProps> = ({
  data,
  onUpdate,
  onNext,
  onPrevious,
}) => {
  const { language } = useDirection();
  const form = useFormContext();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            {language === "ar" ? "جمعية الملاك" : "Owner Association"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Company Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <WizardFormField
              control={form.control}
              name="associations.companyName"
              label={language === "ar" ? "اسم شركة الجمعية" : "Association Company Name"}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder={
                    language === "ar" ? "أدخل اسم الشركة" : "Enter company name"
                  }
                />
              )}
            />
            <WizardFormField
              control={form.control}
              name="associations.crNumber"
              label={language === "ar" ? "رقم السجل التجاري" : "CR Number"}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder={
                    language === "ar" ? "أدخل السجل التجاري" : "Enter CR number"
                  }
                />
              )}
            />
          </div>

          <WizardFormField
            control={form.control}
            name="associations.headquarters"
            label={language === "ar" ? "المقر الرئيسي" : "Headquarters"}
            render={({ field }) => (
              <Input
                {...field}
                placeholder={
                  language === "ar" ? "أدخل المقر الرئيسي" : "Enter headquarters"
                }
              />
            )}
          />

          {/* Owner Details */}
          <div className="border-t border-border pt-4 mt-2">
            <h4 className="text-sm font-semibold mb-4 text-muted-foreground">{language === "ar" ? "بيانات المالك" : "Owner Details"}</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <WizardFormField
                control={form.control}
                name="associations.ownerName"
                label={language === "ar" ? "اسم المالك" : "Owner Name"}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder={
                      language === "ar" ? "أدخل اسم المالك" : "Enter owner name"
                    }
                  />
                )}
              />
              <WizardFormField
                control={form.control}
                name="associations.ownerMobile"
                label={language === "ar" ? "رقم الجوال (أبشر)" : "Mobile Number (Absher)"}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder={
                      language === "ar" ? "أدخل رقم الجوال" : "Enter mobile number"
                    }
                  />
                )}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <WizardFormField
                control={form.control}
                name="associations.ownerIdNumber"
                label={language === "ar" ? "رقم الهوية" : "ID Number"}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder={
                      language === "ar" ? "أدخل رقم الهوية" : "Enter ID number"
                    }
                  />
                )}
              />
              <WizardFormField
                control={form.control}
                name="associations.proxyNumber"
                label={language === "ar" ? "رقم الوكالة (اختياري)" : "Proxy Number (Optional)"}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder={
                      language === "ar" ? "أدخل رقم الوكالة" : "Enter proxy number"
                    }
                  />
                )}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* File Attachments Placeholder - In a real app, this would use the generic File Upload component */}
      {/* Attachments */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {language === "ar" ? "المرفقات" : "Attachments"}
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <HelperFileUpload
            name="associations.attachments.cr"
            label={language === "ar" ? "السجل التجاري" : "Commercial Record"}
            form={form}
          />
          <HelperFileUpload
            name="associations.attachments.nationalAddress"
            label={language === "ar" ? "العنوان الوطني" : "National Address"}
            form={form}
          />
          <HelperFileUpload
            name="associations.attachments.ownerId"
            label={language === "ar" ? "هوية المالك" : "Owner ID"}
            form={form}
          />
          <HelperFileUpload
            name="associations.attachments.proxy"
            label={language === "ar" ? "الوكالة (إن وجدت)" : "Proxy (If any)"}
            form={form}
          />
          <HelperFileUpload
            name="associations.attachments.taxNumber"
            label={language === "ar" ? "الرقم الضريبي" : "Tax Number"}
            form={form}
          />
          <HelperFileUpload
            name="associations.attachments.contract"
            label={language === "ar" ? "العقد" : "Contract"}
            form={form}
          />
        </CardContent>
      </Card>
    </div>
  );
};

// Helper component to handle single file upload logic with FileUploadArea
const HelperFileUpload = ({ name, label, form }: { name: string; label: string; form: any }) => {
  const currentFile = form.watch(name);
  const files = currentFile ? [currentFile] : [];

  const handleFilesSelected = (selectedFiles: File[]) => {
    if (selectedFiles.length > 0) {
      form.setValue(name, selectedFiles[0], { shouldValidate: true });
    }
  };

  const handleFileRemove = () => {
    form.setValue(name, undefined, { shouldValidate: true });
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>
      <FileUploadArea
        files={files}
        onFilesSelected={handleFilesSelected}
        onFileRemove={handleFileRemove}
        accept=".pdf,.jpg,.jpeg,.png"
        multiple={false}
        label=""
      />
    </div>
  );
};

export default StepAssociations;
