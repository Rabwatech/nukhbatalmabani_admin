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
import FileUploadArea from "@/components/shared/FileUploadArea";

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

  const handleFileChange = useCallback(
    (newFiles: File[], fieldName: keyof typeof data.media) => {
      const currentFiles = (form.getValues(`media.${fieldName}`) as File[]) || [];
      const updatedFiles = [...currentFiles, ...newFiles];
      form.setValue(`media.${fieldName}`, updatedFiles, { shouldValidate: true });
    },
    [form]
  );

  const handleFileRemove = useCallback(
    (index: number, fieldName: keyof typeof data.media) => {
      const currentFiles = (form.getValues(`media.${fieldName}`) as File[]) || [];
      const updatedFiles = currentFiles.filter((_, i) => i !== index);
      form.setValue(`media.${fieldName}`, updatedFiles, { shouldValidate: true });
    },
    [form]
  );

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
              <FileUploadArea
                files={(form.watch("media.images") as File[]) || []}
                onFilesSelected={(files) => handleFileChange(files, "images")}
                onFileRemove={(index) => handleFileRemove(index, "images")}
                accept="image/*"
                label=""
              />
            )}
          />

          {/* Videos */}
          <WizardFormField
            control={form.control}
            name="media.videos"
            label={language === "ar" ? "فيديوهات المشروع" : "Project Videos"}
            render={() => (
              <FileUploadArea
                files={(form.watch("media.videos") as File[]) || []}
                onFilesSelected={(files) => handleFileChange(files, "videos")}
                onFileRemove={(index) => handleFileRemove(index, "videos")}
                accept="video/*"
                maxSizeMB={100}
                label=""
              />
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
                files={(form.watch("media.floorPlans") as File[]) || []}
                onFilesSelected={(files) => handleFileChange(files, "floorPlans")}
                onFileRemove={(index) => handleFileRemove(index, "floorPlans")}
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
              <FileUploadArea
                files={(form.watch("media.brochures") as File[]) || []}
                onFilesSelected={(files) => handleFileChange(files, "brochures")}
                onFileRemove={(index) => handleFileRemove(index, "brochures")}
                accept=".pdf"
                label=""
              />
            )}
          />
        </div>
      </div>
    </div>
  );
};

export default StepMedia;
