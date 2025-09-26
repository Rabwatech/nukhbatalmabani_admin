"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDirection } from "@/context/DirectionContext";
import { StepProps } from "./types";
import { reviewSchema } from "./validation";
import WizardFormField from "@/components/shared/WizardFormField";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  Star,
  DollarSign,
  Users,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const StepReview: React.FC<StepProps> = ({
  data,
  onUpdate,
  onNext,
  onPrevious,
  isFirstStep,
  isLastStep,
  isSubmitting,
}) => {
  const { language, isRTL } = useDirection();
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

  const onSubmit = (formData: any) => {
    onUpdate({ review: formData });
    onNext();
  };

  const handlePublish = () => {
    const formData = form.getValues();
    onUpdate({
      review: {
        ...formData,
        isPublished: true,
        publishDate: new Date(),
      },
    });
    onNext();
  };

  const getCompletionStatus = () => {
    const status = {
      basicInfo: !!data.basicInfo?.name?.ar && !!data.basicInfo?.name?.en,
      media: data.media?.images && data.media.images.length > 0,
      buildings:
        data.buildings?.buildings && data.buildings.buildings.length > 0,
      units: data.units?.unitTypes && data.units.unitTypes.length > 0,
      features: true, // Optional step
      associations: true, // Optional step
    };

    const completedSteps = Object.values(status).filter(Boolean).length;
    const totalSteps = Object.keys(status).length;

    return {
      ...status,
      completed: completedSteps,
      total: totalSteps,
      percentage: Math.round((completedSteps / totalSteps) * 100),
      isReady: completedSteps === totalSteps,
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
      className={`bg-stone-gray/10 backdrop-blur-sm rounded-xl p-6 border transition-all duration-300 ${
        isCompleted
          ? "border-green-600/30 bg-green-600/5"
          : "border-red-500/30 bg-red-500/5"
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              isCompleted
                ? "bg-green-600/20 text-green-400"
                : "bg-red-500/20 text-red-400"
            }`}
          >
            <Icon className="h-5 w-5" />
          </div>
          <h4 className="text-lg font-semibold text-elegant-white">{title}</h4>
        </div>
        <Badge
          className={`px-3 py-1 font-medium ${
            isCompleted
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
      {/* Enhanced Header */}
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

        {/* Enhanced Progress Display */}
        <div className="bg-obsidian/30 rounded-xl p-6 border border-stone-gray/20">
          <div className="flex items-center justify-between mb-4">
            <span className="text-lg font-semibold text-elegant-white">
              {language === "ar" ? "التقدم الإجمالي" : "Overall Progress"}
            </span>
            <div className="flex items-center gap-2">
              <Badge
                variant={
                  completionStatus.percentage === 100 ? "default" : "secondary"
                }
                className={`text-lg px-4 py-2 font-bold ${
                  completionStatus.percentage === 100
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
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-medium text-elegant-white drop-shadow-sm">
                {completionStatus.completed} / {completionStatus.total}
              </span>
            </div>
          </div>

          <p className="text-sm text-elegant-white/70 mt-3 text-center">
            {language === "ar"
              ? `${completionStatus.completed} من ${completionStatus.total} خطوات مكتملة`
              : `${completionStatus.completed} of ${completionStatus.total} steps completed`}
          </p>
        </div>
      </div>

      {/* Step Summaries */}
      <div className="space-y-4">
        <StepSummary
          title={language === "ar" ? "المعلومات الأساسية" : "Basic Information"}
          icon={Building2}
          isCompleted={completionStatus.basicInfo}
        >
          {completionStatus.basicInfo ? (
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-medium text-desert-gold">
                  {language === "ar" ? "الاسم:" : "Name:"}
                </span>
                <span className="text-sm text-elegant-white">
                  {data.basicInfo?.name?.ar} / {data.basicInfo?.name?.en}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-medium text-desert-gold">
                  {language === "ar" ? "المدينة:" : "City:"}
                </span>
                <span className="text-sm text-elegant-white">
                  {data.basicInfo?.city}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-medium text-desert-gold">
                  {language === "ar" ? "نوع المشروع:" : "Project Type:"}
                </span>
                <span className="text-sm text-elegant-white">
                  {data.basicInfo?.projectType}
                </span>
              </div>
            </div>
          ) : (
            <p className="text-red-400">
              {language === "ar"
                ? "يرجى إكمال المعلومات الأساسية"
                : "Please complete basic information"}
            </p>
          )}
        </StepSummary>

        <StepSummary
          title={language === "ar" ? "الوسائط" : "Media"}
          icon={Image}
          isCompleted={completionStatus.media}
        >
          {completionStatus.media ? (
            <p className="text-sm text-elegant-white">
              <span className="text-desert-gold font-medium">
                {language === "ar" ? "تم رفع" : "Uploaded"}
              </span>{" "}
              {data.media?.images?.length || 0}{" "}
              {language === "ar" ? "صورة" : "images"}
            </p>
          ) : (
            <p className="text-red-400 text-sm">
              {language === "ar"
                ? "يرجى رفع صور المشروع"
                : "Please upload project images"}
            </p>
          )}
        </StepSummary>

        <StepSummary
          title={language === "ar" ? "المباني" : "Buildings"}
          icon={Building2}
          isCompleted={completionStatus.buildings}
        >
          {completionStatus.buildings ? (
            <p className="text-sm text-elegant-white">
              <span className="text-desert-gold font-medium">
                {language === "ar" ? "تم إضافة" : "Added"}
              </span>{" "}
              {data.buildings?.buildings?.length || 0}{" "}
              {language === "ar" ? "مبنى" : "buildings"}
            </p>
          ) : (
            <p className="text-red-400 text-sm">
              {language === "ar"
                ? "يرجى إضافة المباني"
                : "Please add buildings"}
            </p>
          )}
        </StepSummary>

        <StepSummary
          title={language === "ar" ? "الوحدات" : "Units"}
          icon={Home}
          isCompleted={completionStatus.units}
        >
          {completionStatus.units ? (
            <p className="text-sm text-elegant-white">
              <span className="text-desert-gold font-medium">
                {language === "ar" ? "تم إضافة" : "Added"}
              </span>{" "}
              {data.units?.unitTypes?.length || 0}{" "}
              {language === "ar" ? "نوع وحدة" : "unit types"}
            </p>
          ) : (
            <p className="text-red-400 text-sm">
              {language === "ar"
                ? "يرجى إضافة أنواع الوحدات"
                : "Please add unit types"}
            </p>
          )}
        </StepSummary>

        <StepSummary
          title={
            language === "ar" ? "المميزات والخدمات" : "Features & Services"
          }
          icon={Star}
          isCompleted={completionStatus.features}
        >
          <p className="text-sm text-elegant-white">
            <span className="text-desert-gold font-medium">
              {language === "ar" ? "تم إضافة" : "Added"}
            </span>{" "}
            {data.features?.amenities?.length || 0}{" "}
            {language === "ar" ? "مرفق" : "amenities"}{" "}
            {language === "ar" ? "و" : "and"}{" "}
            {data.features?.services?.length || 0}{" "}
            {language === "ar" ? "خدمة" : "services"}
          </p>
        </StepSummary>

        <StepSummary
          title={language === "ar" ? "جمعيات الملاك" : "Associations"}
          icon={Users}
          isCompleted={completionStatus.associations}
        >
          <p className="text-sm text-elegant-white">
            <span className="text-desert-gold font-medium">
              {language === "ar" ? "تم إعداد" : "Configured"}
            </span>{" "}
            {data.associations?.ownersAssociation?.isRequired
              ? language === "ar"
                ? "جمعية الملاك"
                : "Owners Association"
              : language === "ar"
              ? "لا توجد جمعية ملاك"
              : "No Owners Association"}
          </p>
        </StepSummary>
      </div>

      {/* Enhanced Review Form */}
      <div className="bg-stone-gray/10 backdrop-blur-sm rounded-2xl p-6 border border-desert-gold/20">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-desert-gold/20 flex items-center justify-center">
            <CheckCircle2 className="h-6 w-6 text-desert-gold" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-elegant-white">
              {language === "ar" ? "المراجعة النهائية" : "Final Review"}
            </h3>
            <p className="text-sm text-elegant-white/70">
              {language === "ar"
                ? "أكمل المراجعة النهائية واختر موعد النشر"
                : "Complete final review and choose publish date"}
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Ready to Publish */}
          <div className="flex items-center space-x-2">
            <WizardFormField
              control={form.control}
              name="isReady"
              label=""
              render={({ field }) => (
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />
            <label className="text-sm font-medium text-elegant-white">
              {language === "ar" ? "جاهز للنشر" : "Ready to Publish"}
            </label>
          </div>

          {/* Notes */}
          <WizardFormField
            control={form.control}
            name="notes"
            label={language === "ar" ? "ملاحظات" : "Notes"}
            render={({ field }) => (
              <Textarea
                {...field}
                placeholder={
                  language === "ar"
                    ? "أدخل أي ملاحظات إضافية..."
                    : "Enter any additional notes..."
                }
                rows={4}
              />
            )}
          />

          {/* Publish Date */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-elegant-white">
              {language === "ar" ? "تاريخ النشر" : "Publish Date"}
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !publishDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {publishDate ? (
                    format(publishDate, "PPP")
                  ) : (
                    <span>
                      {language === "ar" ? "اختر التاريخ" : "Pick a date"}
                    </span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={publishDate}
                  onSelect={(date) => {
                    setPublishDate(date);
                    form.setValue("publishDate", date);
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Preview Toggle */}
          <div className="flex items-center space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowPreview(!showPreview)}
            >
              {showPreview ? (
                <EyeOff className="h-4 w-4 mr-2" />
              ) : (
                <Eye className="h-4 w-4 mr-2" />
              )}
              {showPreview
                ? language === "ar"
                  ? "إخفاء المعاينة"
                  : "Hide Preview"
                : language === "ar"
                ? "معاينة المشروع"
                : "Preview Project"}
            </Button>
          </div>
        </div>
      </div>

      {/* Enhanced Completion Warning */}
      {completionStatus.percentage < 100 && (
        <div className="bg-yellow-500/10 backdrop-blur-sm rounded-2xl p-6 border border-yellow-500/30">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-yellow-500/20 flex items-center justify-center">
              <AlertCircle className="h-5 w-5 text-yellow-400" />
            </div>
            <div>
              <p className="font-semibold text-yellow-400">
                {language === "ar"
                  ? "يرجى إكمال جميع الخطوات المطلوبة قبل النشر"
                  : "Please complete all required steps before publishing"}
              </p>
              <p className="text-sm text-yellow-400/80 mt-1">
                {language === "ar"
                  ? "تأكد من إكمال جميع الخطوات المطلوبة لضمان نشر المشروع بنجاح"
                  : "Make sure to complete all required steps to ensure successful project publication"}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StepReview;
