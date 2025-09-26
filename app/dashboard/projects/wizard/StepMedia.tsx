"use client";

import React, { useState, useCallback } from "react";
import { useFormContext } from "react-hook-form";
import { useDirection } from "@/context/DirectionContext";
import { StepProps } from "./types";
import WizardFormField from "@/components/shared/WizardFormField";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import UploadLabel from "@/components/ui/UploadLabel";
import { Image, Video, FileText, Upload, X } from "lucide-react";

const StepMedia: React.FC<StepProps> = ({
  data,
  onUpdate,
  onNext,
  onPrevious,
  isFirstStep,
  isLastStep,
  isSubmitting,
}) => {
  const { language, isRTL } = useDirection();
  const [dragActive, setDragActive] = useState(false);
  const form = useFormContext();

  const handleFileUpload = useCallback(
    (files: FileList, fieldName: keyof typeof data.media) => {
      const fileArray = Array.from(files);
      const currentFiles =
        (form.getValues(`media.${fieldName}`) as File[]) || [];
      const newFiles = [...currentFiles, ...fileArray];
      form.setValue(`media.${fieldName}`, newFiles);
    },
    [form]
  );

  const removeFile = useCallback(
    (index: number, fieldName: keyof typeof data.media) => {
      const currentFiles =
        (form.getValues(`media.${fieldName}`) as File[]) || [];
      const newFiles = currentFiles.filter((_: any, i: number) => i !== index);
      form.setValue(`media.${fieldName}`, newFiles);
    },
    [form]
  );

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent, fieldName: keyof typeof data.media) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleFileUpload(e.dataTransfer.files, fieldName);
      }
    },
    [handleFileUpload]
  );

  const FileUploadArea = ({
    fieldName,
    accept,
    multiple = true,
    label,
  }: {
    fieldName: keyof typeof data.media;
    accept: string;
    multiple?: boolean;
    label: string;
  }) => {
    const files = (form.watch(fieldName) as File[]) || [];

    return (
      <div className="space-y-4">
        {label && <label className="text-sm font-medium">{label}</label>}
        <div
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
            dragActive
              ? "border-desert-gold bg-desert-gold/5 shadow-lg shadow-desert-gold/10"
              : "border-stone-gray/30 hover:border-desert-gold/50 hover:bg-desert-gold/5"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={(e) => handleDrop(e, fieldName)}
        >
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-desert-gold/20 flex items-center justify-center">
              <Upload className="h-8 w-8 text-desert-gold" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-elegant-white mb-1">
                {language === "ar"
                  ? "اسحب الملفات هنا أو انقر للرفع"
                  : "Drag files here or click to upload"}
              </p>
              <p className="text-xs text-elegant-white/60">
                {accept === "image/*"
                  ? language === "ar"
                    ? "PNG, JPG, JPEG حتى 10MB"
                    : "PNG, JPG, JPEG up to 10MB"
                  : accept === "video/*"
                  ? language === "ar"
                    ? "MP4, MOV, AVI حتى 100MB"
                    : "MP4, MOV, AVI up to 100MB"
                  : accept === ".pdf"
                  ? language === "ar"
                    ? "ملفات PDF حتى 5MB"
                    : "PDF files up to 5MB"
                  : language === "ar"
                  ? "جميع أنواع الملفات المدعومة"
                  : "All supported file types"}
              </p>
            </div>
          </div>

          <input
            type="file"
            accept={accept}
            multiple={multiple}
            onChange={(e) =>
              e.target.files && handleFileUpload(e.target.files, fieldName)
            }
            className="hidden"
            id={`file-upload-${fieldName}`}
          />
          <label
            htmlFor={`file-upload-${fieldName}`}
            className="mt-4 inline-flex items-center gap-2 px-6 py-3 bg-desert-gold/20 hover:bg-desert-gold/30 text-desert-gold rounded-xl font-medium cursor-pointer transition-all duration-200 hover:scale-105"
          >
            <Upload className="w-4 h-4" />
            {language === "ar" ? "اختر الملفات" : "Choose Files"}
          </label>
        </div>

        {files.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1 h-4 bg-desert-gold rounded-full"></div>
              <span className="text-sm font-medium text-elegant-white">
                {language === "ar" ? "الملفات المرفوعة" : "Uploaded Files"} (
                {files.length})
              </span>
            </div>
            {files.map((file: File, index: number) => (
              <div
                key={index}
                className="group flex items-center justify-between p-4 bg-stone-gray/10 hover:bg-stone-gray/20 rounded-xl border border-stone-gray/20 hover:border-desert-gold/30 transition-all duration-200"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="flex-shrink-0">
                    {file.type.startsWith("image/") ? (
                      <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                        <Image className="h-5 w-5 text-blue-400" />
                      </div>
                    ) : file.type.startsWith("video/") ? (
                      <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
                        <Video className="h-5 w-5 text-red-400" />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-stone-gray/20 flex items-center justify-center">
                        <FileText className="h-5 w-5 text-stone-gray" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-elegant-white truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-elegant-white/60">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(index, fieldName)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/20 hover:text-red-400"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-desert-gold/10 to-warm-sand/5 rounded-2xl p-6 border border-desert-gold/20">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-desert-gold/20 flex items-center justify-center">
            <Image className="h-6 w-6 text-desert-gold" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-elegant-white">
              {language === "ar" ? "الوسائط والصور" : "Media & Visual Content"}
            </h3>
            <p className="text-sm text-elegant-white/70">
              {language === "ar"
                ? "أضف الصور والفيديوهات والملفات المرتبطة بالمشروع"
                : "Add images, videos, and files related to your project"}
            </p>
          </div>
        </div>

        <div className="grid gap-8">
          {/* Project Images */}
          <WizardFormField
            control={form.control}
            name="media.images"
            label={language === "ar" ? "صور المشروع *" : "Project Images *"}
            render={() => (
              <FileUploadArea fieldName="images" accept="image/*" label="" />
            )}
          />

          {/* Videos */}
          <WizardFormField
            control={form.control}
            name="media.videos"
            label={language === "ar" ? "فيديوهات المشروع" : "Project Videos"}
            render={() => (
              <FileUploadArea fieldName="videos" accept="video/*" label="" />
            )}
          />

          {/* Virtual Tour */}
          <WizardFormField
            control={form.control}
            name="media.virtualTour"
            label={
              language === "ar" ? "جولة افتراضية (رابط)" : "Virtual Tour (URL)"
            }
            render={({ field }) => (
              <Input
                {...field}
                type="url"
                placeholder={
                  language === "ar"
                    ? "أدخل رابط الجولة الافتراضية"
                    : "Enter virtual tour URL"
                }
              />
            )}
          />

          {/* Floor Plans */}
          <WizardFormField
            control={form.control}
            name="media.floorPlans"
            label={language === "ar" ? "المخططات المعمارية" : "Floor Plans"}
            render={() => (
              <FileUploadArea
                fieldName="floorPlans"
                accept=".pdf,.jpg,.jpeg,.png"
                label=""
              />
            )}
          />

          {/* Brochures */}
          <WizardFormField
            control={form.control}
            name="media.brochures"
            label={
              language === "ar"
                ? "الكتيبات والبروشورات"
                : "Brochures & Catalogs"
            }
            render={() => (
              <FileUploadArea fieldName="brochures" accept=".pdf" label="" />
            )}
          />
        </div>
      </div>
    </div>
  );
};

export default StepMedia;
