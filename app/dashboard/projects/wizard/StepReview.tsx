"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDirection } from "@/context/DirectionContext";
import { StepProps } from "./types";
import { reviewSchema } from "./validation";
import WizardFormField from "@/components/shared/WizardFormField";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  CheckCircle,
  Eye,
  EyeOff,
  Calendar as CalendarIcon,
  Building2,
  Image,
  Home,
  AlertCircle,
  CheckCircle2,
  Map,
  Layers,
  Users,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const StepReview: React.FC<StepProps> = ({
  data,
  onUpdate,
  onNext,
  onPrevious,
}) => {
  const { language } = useDirection();
  const [showPreview, setShowPreview] = useState(false);
  const [publishDate, setPublishDate] = useState<Date | undefined>();

  const form = useForm({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      ...data.review,
      publishDate: publishDate,
    },
    mode: "onChange",
  });

  const getCompletionStatus = () => {
    const status = {
      basicInfo: !!data.basicInfo?.name?.ar && !!data.basicInfo?.name?.en,
      landPieces: data.landPieces && data.landPieces.length > 0,
      unitModels: data.unitModels && data.unitModels.length > 0,
      media: true, // Optional
      buildings: data.buildings?.buildings && data.buildings.buildings.length > 0,
      units: data.units?.units && data.units.units.length > 0,
      associations: true, // Optional
    };

    const requiredKeys = ['basicInfo', 'landPieces', 'unitModels', 'buildings', 'units'];
    const completedRequiredSteps = requiredKeys.filter(k => status[k as keyof typeof status]).length;
    const totalRequiredSteps = requiredKeys.length;

    return {
      ...status,
      completed: completedRequiredSteps,
      total: totalRequiredSteps,
      percentage: Math.round((completedRequiredSteps / totalRequiredSteps) * 100),
      isReady: completedRequiredSteps === totalRequiredSteps,
    };
  };

  const completionStatus = getCompletionStatus();

  const StepSummary = ({
    title,
    icon: Icon,
    isCompleted,
    children,
  }: {
    title: string;
    icon: any;
    isCompleted: boolean;
    children: React.ReactNode;
  }) => (
    <div
      className={`bg-stone-gray/10 backdrop-blur-sm rounded-xl p-6 border transition-all duration-300 ${isCompleted
        ? "border-green-600/30 bg-green-600/5"
        : "border-red-500/30 bg-red-500/5"
        }`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center ${isCompleted
              ? "bg-green-600/20 text-green-400"
              : "bg-red-500/20 text-red-400"
              }`}
          >
            <Icon className="h-5 w-5" />
          </div>
          <h4 className="text-lg font-semibold text-elegant-white">{title}</h4>
        </div>
        <Badge
          className={`px-3 py-1 font-medium ${isCompleted
            ? "bg-green-600/20 text-green-400 border-green-600/30"
            : "bg-red-500/20 text-red-400 border-red-500/30"
            }`}
        >
          {isCompleted
            ? language === "ar"
              ? "مكتمل"
              : "Complete"
            : language === "ar"
              ? "غير مكتمل"
              : "Incomplete"}
        </Badge>
      </div>
      <div className="text-elegant-white/80">{children}</div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-desert-gold/10 to-warm-sand/5 rounded-2xl p-6 border border-desert-gold/20">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-desert-gold/20 flex items-center justify-center">
            <CheckCircle className="h-6 w-6 text-desert-gold" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-elegant-white">
              {language === "ar" ? "المراجعة والنشر" : "Review & Publish"}
            </h3>
            <p className="text-sm text-elegant-white/70">
              {language === "ar"
                ? "راجع جميع معلومات المشروع قبل النشر"
                : "Review all project information before publishing"}
            </p>
          </div>
        </div>

        {/* Progress Display */}
        <div className="bg-obsidian/30 rounded-xl p-6 border border-stone-gray/20">
          <div className="flex items-center justify-between mb-4">
            <span className="text-lg font-semibold text-elegant-white">
              {language === "ar" ? "اكتمال المتطلبات" : "Requirements Completion"}
            </span>
            <div className="flex items-center gap-2">
              <Badge
                variant={
                  completionStatus.percentage === 100 ? "default" : "secondary"
                }
                className={`text-lg px-4 py-2 font-bold ${completionStatus.percentage === 100
                  ? "bg-green-600/20 text-green-400 border-green-600/30"
                  : "bg-desert-gold/20 text-desert-gold border-desert-gold/30"
                  }`}
              >
                {completionStatus.percentage}%
              </Badge>
            </div>
          </div>

          <div className="relative">
            <div className="w-full bg-stone-gray/20 rounded-full h-4 overflow-hidden">
              <div
                className="bg-gradient-to-r from-desert-gold to-warm-sand h-full rounded-full transition-all duration-500 shadow-sm"
                style={{ width: `${completionStatus.percentage}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Step Summaries */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <StepSummary
          title={language === "ar" ? "المعلومات الأساسية" : "Basic Information"}
          icon={Building2}
          isCompleted={completionStatus.basicInfo}
        >
          {completionStatus.basicInfo ? (
            <div className="space-y-1 text-sm">
              <p>{data.basicInfo?.name?.ar} / {data.basicInfo?.name?.en}</p>
              <p className="text-xs text-muted-foreground">{data.basicInfo?.city} - {data.basicInfo?.district}</p>
            </div>
          ) : (
            <p className="text-red-400 text-sm">{language === "ar" ? "مطلوب" : "Required"}</p>
          )}
        </StepSummary>

        <StepSummary
          title={language === "ar" ? "قطع الأراضي" : "Land Pieces"}
          icon={Map}
          isCompleted={completionStatus.landPieces}
        >
          {completionStatus.landPieces ? (
            <div className="space-y-1 text-sm">
              <p>{data.landPieces?.length} {language === "ar" ? "قطعة" : "Pieces"}</p>
            </div>
          ) : (
            <p className="text-red-400 text-sm">{language === "ar" ? "مطلوب" : "Required"}</p>
          )}
        </StepSummary>

        <StepSummary
          title={language === "ar" ? "نماذج الوحدات" : "Unit Models"}
          icon={Layers}
          isCompleted={completionStatus.unitModels}
        >
          {completionStatus.unitModels ? (
            <div className="space-y-1 text-sm">
              <p>{data.unitModels?.length} {language === "ar" ? "نموذج" : "Models"}</p>
            </div>
          ) : (
            <p className="text-red-400 text-sm">{language === "ar" ? "مطلوب" : "Required"}</p>
          )}
        </StepSummary>

        <StepSummary
          title={language === "ar" ? "الوسائط" : "Media"}
          icon={Image}
          isCompleted={completionStatus.media}
        >
          <p className="text-sm">
            {data.media?.images?.length || 0} {language === "ar" ? "صورة" : "images"}
          </p>
        </StepSummary>

        <StepSummary
          title={language === "ar" ? "المباني" : "Buildings"}
          icon={Building2}
          isCompleted={completionStatus.buildings}
        >
          {completionStatus.buildings ? (
            <p className="text-sm">{data.buildings?.buildings?.length || 0} {language === "ar" ? "مبنى" : "buildings"}</p>
          ) : (
            <p className="text-red-400 text-sm">{language === "ar" ? "مطلوب" : "Required"}</p>
          )}
        </StepSummary>

        <StepSummary
          title={language === "ar" ? "الوحدات" : "Units"}
          icon={Home}
          isCompleted={completionStatus.units}
        >
          {completionStatus.units ? (
            <p className="text-sm">{data.units?.units?.length || 0} {language === "ar" ? "وحدة" : "units"}</p>
          ) : (
            <p className="text-red-400 text-sm">{language === "ar" ? "مطلوب" : "Required"}</p>
          )}
        </StepSummary>

        <StepSummary
          title={language === "ar" ? "جمعية الملاك" : "Associations"}
          icon={Users}
          isCompleted={true}
        >
          <p className="text-sm">{data.associations?.companyName ? data.associations.companyName : (language === "ar" ? "غير محدد" : "Not specified")}</p>
        </StepSummary>
      </div>

      {/* Final Review Form */}
      <div className="bg-stone-gray/10 backdrop-blur-sm rounded-2xl p-6 border border-desert-gold/20">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-desert-gold/20 flex items-center justify-center">
            <CheckCircle2 className="h-6 w-6 text-desert-gold" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-elegant-white">
              {language === "ar" ? "بيانات النشر" : "Publishing Data"}
            </h3>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center space-x-2">
            <Switch
              checked={form.watch("isReady")}
              onCheckedChange={(checked) => form.setValue("isReady", checked)}
            />
            <label className="text-sm font-medium text-elegant-white">
              {language === "ar" ? "جاهز للنشر" : "Ready to Publish"}
            </label>
          </div>

          <WizardFormField
            control={form.control}
            name="notes"
            label={language === "ar" ? "ملاحظات إضافية" : "Additional Notes"}
            render={({ field }) => (
              <Textarea {...field} rows={3} />
            )}
          />
        </div>
      </div>
    </div>
  );
};

export default StepReview;
