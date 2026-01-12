"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDirection } from "@/context/DirectionContext";
import { ChevronLeft, ChevronRight, Save, Eye, EyeOff } from "lucide-react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

// Import step components
import StepBasicInfo from "./wizard/StepBasicInfo";
import StepLandPieces from "./wizard/StepLandPieces";
import StepUnitModels from "./wizard/StepUnitModels";
import StepMedia from "./wizard/StepMedia";
import StepBuildings from "./wizard/StepBuildings";
import StepUnits from "./wizard/StepUnits";
import StepAssociations from "./wizard/StepAssociations";
import StepReview from "./wizard/StepReview";

// Import types
import { ProjectWizardData, WizardStep } from "./wizard/types";

// Import store
import { useProjectWizardStore } from "./wizard/store";

// Import validation schemas
import { projectWizardSchema, validateStep } from "./wizard/validation";

const STEPS: WizardStep[] = [
  {
    id: 1,
    title: { ar: "المعلومات الأساسية", en: "Basic Information" },
    description: {
      ar: "معلومات المشروع الأساسية والمميزات",
      en: "Project basic information and features",
    },
    component: StepBasicInfo,
    isCompleted: false,
    isRequired: true,
  },
  {
    id: 2,
    title: { ar: "قطع الأراضي", en: "Land Pieces" },
    description: {
      ar: "إدارة قطع الأراضي والصكوك",
      en: "Manage land pieces and deeds",
    },
    component: StepLandPieces,
    isCompleted: false,
    isRequired: true,
  },
  {
    id: 3,
    title: { ar: "نماذج الوحدات", en: "Unit Models" },
    description: {
      ar: "تعريف نماذج الوحدات وتفاصيلها",
      en: "Define unit models and details",
    },
    component: StepUnitModels,
    isCompleted: false,
    isRequired: true,
  },
  {
    id: 4,
    title: { ar: "الوسائط والصور", en: "Media & Visual Content" },
    description: {
      ar: "رفع الصور والفيديوهات",
      en: "Upload images and videos",
    },
    component: StepMedia,
    isCompleted: false,
    isRequired: false,
  },
  {
    id: 5,
    title: { ar: "تكوين المباني", en: "Buildings Configuration" },
    description: {
      ar: "إعداد المباني وربطها بالأراضي",
      en: "Setup buildings and link to lands",
    },
    component: StepBuildings,
    isCompleted: false,
    isRequired: true,
  },
  {
    id: 6,
    title: { ar: "إدارة الوحدات", en: "Unit Inventory" },
    description: {
      ar: "إدارة مخزون الوحدات السكنية",
      en: "Manage residential units inventory",
    },
    component: StepUnits,
    isCompleted: false,
    isRequired: true,
  },
  {
    id: 7,
    title: { ar: "جمعيات الملاك", en: "Owners Associations" },
    description: {
      ar: "إدارة جمعية الملاك",
      en: "Manage owners association",
    },
    component: StepAssociations,
    isCompleted: false,
    isRequired: false,
  },
  {
    id: 8,
    title: { ar: "المراجعة والنشر", en: "Review & Publish" },
    description: {
      ar: "مراجعة المشروع ونشره",
      en: "Review and publish project",
    },
    component: StepReview,
    isCompleted: false,
    isRequired: true,
  },
];

export default function ProjectWizard() {
  const { language, isRTL } = useDirection();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const {
    projectData,
    updateProjectData,
    updateStepData,
    markStepComplete,
    saveDraft,
    loadDraft,
    clearDraft,
    getStepCompletionStatus,
  } = useProjectWizardStore();

  const methods = useForm<ProjectWizardData>({
    resolver: zodResolver(projectWizardSchema),
    defaultValues: projectData,
    mode: "onChange",
  });

  // Auto-save draft every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (Object.keys(methods.formState.dirtyFields).length > 0) {
        saveDraft(methods.getValues());
        console.log("Auto-saved draft");
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [methods, saveDraft]);

  // Load draft on mount with robust migration logic
  useEffect(() => {
    const savedDraft = loadDraft();
    if (savedDraft) {
      // Create a base structure to ensure all required fields exist
      const safeDraft = { ...savedDraft };

      // Migration: Check if buildings is an array (legacy) and convert to object
      if (Array.isArray(safeDraft.buildings)) {
        safeDraft.buildings = { buildings: safeDraft.buildings };
      } else if (!safeDraft.buildings) {
        safeDraft.buildings = { buildings: [] };
      } else if (!safeDraft.buildings.buildings) {
        // Handle case where object exists but internal array is missing
        safeDraft.buildings.buildings = [];
      }

      // Migration: Check if units is an array (legacy) and convert to object
      if (Array.isArray(safeDraft.units)) {
        safeDraft.units = { units: safeDraft.units };
      } else if (!safeDraft.units) {
        safeDraft.units = { units: [] };
      } else if (!safeDraft.units.units) {
        safeDraft.units.units = [];
      }

      // Ensure new arrays are initialized if undefined in draft
      if (!Array.isArray(safeDraft.landPieces)) {
        safeDraft.landPieces = [];
      }

      if (!Array.isArray(safeDraft.unitModels)) {
        safeDraft.unitModels = [];
      }

      // Ensure associations object exists
      if (!safeDraft.associations) {
        safeDraft.associations = {
          companyName: '',
          crNumber: '',
          headquarters: '',
          ownerName: '',
          ownerMobile: '',
          ownerIdNumber: '',
          attachments: {},
        };
      }

      // Apply the sanitized draft to the form
      methods.reset(safeDraft);

      toast.success(
        language === "ar"
          ? "تم استعادة بيانات المشروع المحفوظة"
          : "Saved project data restored"
      );
    }
  }, [loadDraft, methods, language]);

  // Temporarily enable Next button to allow clicking and showing validation errors
  const isCurrentStepValid = true;

  // Handle step navigation
  const goToStep = useCallback(
    async (stepNumber: number) => {
      if (stepNumber < currentStep) {
        // Going backwards is always allowed
        setCurrentStep(stepNumber);
        return;
      }

      // Validate current step before proceeding
      const currentData = methods.getValues();
      try {
        validateStep(currentStep, currentData);
      } catch (error) {
        console.error("Validation failed for step", currentStep, error);
        toast.error(
          language === "ar"
            ? "يرجى إكمال جميع الحقول المطلوبة"
            : "Please complete all required fields"
        );
        // Trigger visual validation errors for the current step
        await methods.trigger();
        return;
      }

      // Update step completion status
      const updatedData = methods.getValues();
      updateProjectData(updatedData);

      setCurrentStep(stepNumber);
    },
    [currentStep, methods, updateProjectData, language]
  );

  // Handle form submission
  const handleSubmit = async (data: ProjectWizardData) => {
    setIsSubmitting(true);
    try {
      // Here you would typically send the data to your API
      console.log("Submitting project data:", data);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Clear draft after successful submission
      clearDraft();

      toast.success(
        language === "ar"
          ? "تم إنشاء المشروع بنجاح!"
          : "Project created successfully!"
      );

      // Redirect to projects list or project details
      // router.push('/dashboard/projects');
    } catch (error) {
      console.error("Error submitting project:", error);
      toast.error(
        language === "ar"
          ? "حدث خطأ أثناء إنشاء المشروع"
          : "Error creating project"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get current step component
  const CurrentStepComponent = () => {
    const StepComponent =
      STEPS.find((step) => step.id === currentStep)?.component || StepBasicInfo;
    return (
      <StepComponent
        data={projectData}
        onUpdate={updateProjectData}
        onNext={() => goToStep(currentStep + 1)}
        onPrevious={() => goToStep(currentStep - 1)}
        isFirstStep={currentStep === 1}
        isLastStep={currentStep === STEPS.length}
        isSubmitting={isSubmitting}
      />
    );
  };

  // Calculate progress percentage
  const progressPercentage = (currentStep / STEPS.length) * 100;

  return (
    <div className="min-h-screen bg-obsidian p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-desert-gold mb-4">
            {language === "ar" ? "إنشاء مشروع جديد" : "Create New Project"}
          </h1>
          <p className="text-lg text-elegant-white/80">
            {language === "ar"
              ? "قم بإنشاء مشروع جديد خطوة بخطوة"
              : "Create a new project step by step"}
          </p>
        </div>

        {/* Enhanced Progress Bar */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-desert-gold/20 flex items-center justify-center">
                <span className="text-desert-gold font-semibold text-sm">
                  {currentStep}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-elegant-white/80">
                  {language === "ar" ? "الخطوة" : "Step"} {currentStep}{" "}
                  {language === "ar" ? "من" : "of"} {STEPS.length}
                </p>
                <p className="text-xs text-elegant-white/60">
                  {
                    STEPS.find((step) => step.id === currentStep)?.title[
                    language
                    ]
                  }
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-lg font-semibold text-desert-gold">
                {Math.round(progressPercentage)}%
              </span>
              <p className="text-xs text-elegant-white/60">
                {language === "ar" ? "مكتمل" : "Complete"}
              </p>
            </div>
          </div>

          {/* Enhanced Progress Track */}
          <div className="relative">
            <div className="w-full bg-stone-gray/20 rounded-full h-2 overflow-hidden">
              <motion.div
                className="bg-gradient-to-r from-desert-gold to-warm-sand h-full rounded-full shadow-sm"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              />
            </div>

            {/* Step Indicators */}
            <div className="absolute top-0 w-full flex justify-between items-center -mt-1">
              {STEPS.map((step, index) => (
                <div
                  key={step.id}
                  className={`w-4 h-4 rounded-full border-2 transition-all duration-300 ${step.id <= currentStep
                    ? "bg-desert-gold border-desert-gold shadow-md"
                    : "bg-obsidian border-stone-gray/40"
                    }`}
                  style={{ left: `${(index / (STEPS.length - 1)) * 100}%` }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Enhanced Step Navigation */}
        <div className="mb-10">
          <div className="bg-stone-gray/10 backdrop-blur-sm rounded-2xl p-6 border border-desert-gold/10">
            <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
              {STEPS.map((step) => (
                <motion.button
                  key={step.id}
                  onClick={() => goToStep(step.id)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`group relative flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 min-w-[120px] ${currentStep === step.id
                    ? "bg-desert-gold text-obsidian shadow-lg shadow-desert-gold/25"
                    : "text-elegant-white/70 hover:text-elegant-white hover:bg-stone-gray/20 border border-transparent hover:border-stone-gray/30"
                    }`}
                >
                  <div
                    className={`relative w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${currentStep === step.id
                      ? "bg-obsidian text-desert-gold shadow-md"
                      : "bg-stone-gray/30 text-elegant-white/60 group-hover:bg-stone-gray/40"
                      }`}
                  >
                    {step.id}
                    {currentStep === step.id && (
                      <motion.div
                        className="absolute inset-0 rounded-full border-2 border-desert-gold/30"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1.2 }}
                        transition={{ duration: 0.3 }}
                      />
                    )}
                  </div>
                  <div className="flex-1 text-left hidden md:block">
                    <span className="block text-sm font-medium">
                      {step.title[language]}
                    </span>
                  </div>
                  {step.isRequired && (
                    <div className="w-2 h-2 rounded-full bg-red-400 opacity-60 absolute top-2 right-2" />
                  )}
                </motion.button>
              ))}
            </div>

            {/* Enhanced Action Buttons */}
            <div className="flex items-center justify-center gap-3 pt-4 border-t border-desert-gold/10">
              <motion.button
                onClick={() => saveDraft(methods.getValues())}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="group flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-elegant-white/80 hover:text-elegant-white transition-all duration-200 bg-stone-gray/20 hover:bg-stone-gray/30 rounded-xl border border-stone-gray/30 hover:border-stone-gray/50"
              >
                <Save className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span>{language === "ar" ? "حفظ مسودة" : "Save Draft"}</span>
              </motion.button>

              <motion.button
                onClick={() => setShowPreview(!showPreview)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`group flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-all duration-200 rounded-xl border ${showPreview
                  ? "bg-desert-gold/20 text-desert-gold border-desert-gold/30 hover:bg-desert-gold/30"
                  : "text-elegant-white/80 hover:text-elegant-white bg-stone-gray/20 hover:bg-stone-gray/30 border-stone-gray/30 hover:border-stone-gray/50"
                  }`}
              >
                {showPreview ? (
                  <EyeOff className="w-4 h-4 group-hover:scale-110 transition-transform" />
                ) : (
                  <Eye className="w-4 h-4 group-hover:scale-110 transition-transform" />
                )}
                <span>
                  {showPreview
                    ? language === "ar"
                      ? "إخفاء المعاينة"
                      : "Hide Preview"
                    : language === "ar"
                      ? "معاينة"
                      : "Preview"}
                </span>
              </motion.button>
            </div>
          </div>
        </div>

        {/* Enhanced Main Content */}
        <div className="bg-gradient-to-br from-obsidian/80 to-obsidian/60 backdrop-blur-sm rounded-2xl border border-desert-gold/20 overflow-hidden shadow-2xl shadow-obsidian/50">
          {/* Step Content Header */}
          <div className="bg-gradient-to-r from-desert-gold/10 to-warm-sand/5 border-b border-desert-gold/20 px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-desert-gold/20 flex items-center justify-center">
                  <span className="text-desert-gold font-bold text-lg">
                    {currentStep}
                  </span>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-elegant-white">
                    {
                      STEPS.find((step) => step.id === currentStep)?.title[
                      language
                      ]
                    }
                  </h2>
                  <p className="text-sm text-elegant-white/70">
                    {
                      STEPS.find((step) => step.id === currentStep)
                        ?.description[language]
                    }
                  </p>
                </div>
              </div>
              <div className="hidden md:flex items-center gap-2">
                <div className="px-3 py-1.5 rounded-full bg-desert-gold/20 border border-desert-gold/30">
                  <span className="text-xs font-medium text-desert-gold">
                    {language === "ar" ? "خطوة" : "Step"} {currentStep}/
                    {STEPS.length}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Step Content */}
          <div className="p-8">
            <FormProvider {...methods}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, y: 20, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.98 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                >
                  <CurrentStepComponent />
                </motion.div>
              </AnimatePresence>
            </FormProvider>
          </div>

          {/* Enhanced Navigation Buttons */}
          <div className="px-8 py-6 bg-gradient-to-r from-stone-gray/5 to-desert-gold/5 border-t border-desert-gold/20">
            <div className="flex items-center justify-between">
              <motion.button
                onClick={() => goToStep(currentStep - 1)}
                disabled={currentStep === 1}
                whileHover={currentStep !== 1 ? { scale: 1.02 } : {}}
                whileTap={currentStep !== 1 ? { scale: 0.98 } : {}}
                className={`group flex items-center gap-3 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${currentStep === 1
                  ? "bg-stone-gray/10 text-elegant-white/30 cursor-not-allowed"
                  : "bg-stone-gray/20 text-elegant-white hover:bg-stone-gray/30 hover:text-elegant-white border border-stone-gray/30 hover:border-stone-gray/50"
                  }`}
              >
                <ChevronLeft
                  className={`w-5 h-5 transition-transform ${currentStep !== 1 ? "group-hover:-translate-x-1" : ""
                    }`}
                />
                <span className="font-semibold">
                  {language === "ar" ? "السابق" : "Previous"}
                </span>
              </motion.button>

              <div className="flex items-center gap-4">
                {currentStep < STEPS.length ? (
                  <motion.button
                    onClick={() => goToStep(currentStep + 1)}
                    disabled={!isCurrentStepValid}
                    whileHover={isCurrentStepValid ? { scale: 1.02 } : {}}
                    whileTap={isCurrentStepValid ? { scale: 0.98 } : {}}
                    className={`group flex items-center gap-3 px-8 py-3 rounded-xl font-semibold transition-all duration-300 ${isCurrentStepValid
                      ? "bg-gradient-to-r from-desert-gold to-warm-sand text-obsidian hover:shadow-lg hover:shadow-desert-gold/25 border border-desert-gold/30"
                      : "bg-stone-gray/10 text-elegant-white/30 cursor-not-allowed"
                      }`}
                  >
                    <span>{language === "ar" ? "التالي" : "Next"}</span>
                    <ChevronRight
                      className={`w-5 h-5 transition-transform ${isCurrentStepValid ? "group-hover:translate-x-1" : ""
                        }`}
                    />
                  </motion.button>
                ) : (
                  <motion.button
                    onClick={methods.handleSubmit(handleSubmit)}
                    disabled={isSubmitting || !isCurrentStepValid}
                    whileHover={
                      !isSubmitting && isCurrentStepValid ? { scale: 1.02 } : {}
                    }
                    whileTap={
                      !isSubmitting && isCurrentStepValid ? { scale: 0.98 } : {}
                    }
                    className={`group flex items-center gap-3 px-8 py-4 rounded-xl font-bold transition-all duration-300 ${isSubmitting || !isCurrentStepValid
                      ? "bg-stone-gray/10 text-elegant-white/30 cursor-not-allowed"
                      : "bg-gradient-to-r from-green-600 to-green-500 text-white hover:shadow-lg hover:shadow-green-600/25 border border-green-500/30"
                      }`}
                  >
                    {isSubmitting ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                          className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                        />
                        <span>
                          {language === "ar"
                            ? "جاري الإنشاء..."
                            : "Creating..."}
                        </span>
                      </>
                    ) : (
                      <>
                        <span>
                          {language === "ar"
                            ? "إنشاء المشروع"
                            : "Create Project"}
                        </span>
                        <motion.div
                          className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center"
                          whileHover={{ scale: 1.1 }}
                        >
                          <ChevronRight className="w-3 h-3" />
                        </motion.div>
                      </>
                    )}
                  </motion.button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Preview Modal */}
      <AnimatePresence>
        {showPreview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setShowPreview(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="bg-gradient-to-br from-obsidian to-obsidian/90 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden border border-desert-gold/30 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-gradient-to-r from-desert-gold/20 to-warm-sand/10 p-6 border-b border-desert-gold/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-desert-gold/20 flex items-center justify-center">
                      <Eye className="w-4 h-4 text-desert-gold" />
                    </div>
                    <h3 className="text-xl font-bold text-desert-gold">
                      {language === "ar" ? "معاينة المشروع" : "Project Preview"}
                    </h3>
                  </div>
                  <motion.button
                    onClick={() => setShowPreview(false)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-8 h-8 rounded-full bg-stone-gray/20 hover:bg-stone-gray/30 flex items-center justify-center transition-colors"
                  >
                    <EyeOff className="w-4 h-4 text-elegant-white" />
                  </motion.button>
                </div>
              </div>
              <div className="p-6 max-h-[70vh] overflow-y-auto">
                <div className="space-y-6">
                  {/* Project Preview Content */}
                  <ProjectPreviewContent
                    data={methods.getValues()}
                    language={language}
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Project Preview Component
const ProjectPreviewContent = ({
  data,
  language,
}: {
  data: ProjectWizardData;
  language: string;
}) => {
  const PreviewSection = ({
    title,
    children,
  }: {
    title: string;
    children: React.ReactNode;
  }) => (
    <div className="bg-stone-gray/10 rounded-xl p-4 border border-stone-gray/20">
      <h4 className="text-lg font-semibold text-desert-gold mb-3">{title}</h4>
      {children}
    </div>
  );

  const PreviewField = ({
    label,
    value,
  }: {
    label: string;
    value?: string | number | null;
  }) => (
    <div className="flex justify-between items-start py-2 border-b border-stone-gray/10 last:border-b-0">
      <span className="text-sm font-medium text-elegant-white/70">
        {label}:
      </span>
      <span className="text-sm text-elegant-white ml-4 text-right flex-1">
        {value || (language === "ar" ? "غير محدد" : "Not specified")}
      </span>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Basic Information */}
      {data.basicInfo && (
        <PreviewSection
          title={language === "ar" ? "المعلومات الأساسية" : "Basic Information"}
        >
          <div className="space-y-2">
            <PreviewField
              label={
                language === "ar"
                  ? "اسم المشروع (عربي)"
                  : "Project Name (Arabic)"
              }
              value={data.basicInfo.name?.ar}
            />
            <PreviewField
              label={
                language === "ar"
                  ? "اسم المشروع (إنجليزي)"
                  : "Project Name (English)"
              }
              value={data.basicInfo.name?.en}
            />
            <PreviewField
              label={language === "ar" ? "المدينة" : "City"}
              value={data.basicInfo.city}
            />
            <PreviewField
              label={language === "ar" ? "الحي" : "District"}
              value={data.basicInfo.district}
            />
          </div>
        </PreviewSection>
      )}

      {/* Land Pieces */}
      {data.landPieces && (
        <PreviewSection
          title={language === "ar" ? "قطع الأراضي" : "Land Pieces"}
        >
          <div className="space-y-2">
            <PreviewField
              label={language === "ar" ? "عدد القطع" : "Pieces Count"}
              value={data.landPieces.length}
            />
          </div>
        </PreviewSection>
      )}

      {/* Unit Models */}
      {data.unitModels && (
        <PreviewSection
          title={language === "ar" ? "نماذج الوحدات" : "Unit Models"}
        >
          <div className="space-y-2">
            <PreviewField
              label={language === "ar" ? "عدد النماذج" : "Models Count"}
              value={data.unitModels.length}
            />
          </div>
        </PreviewSection>
      )}

      {/* Media */}
      {data.media && (
        <PreviewSection
          title={
            language === "ar" ? "الوسائط والصور" : "Media & Visual Content"
          }
        >
          <div className="space-y-4">
            <div>
              <span className="text-sm font-medium text-elegant-white/70">
                {language === "ar" ? "الصور:" : "Images:"}
              </span>
              <span className="text-sm text-elegant-white ml-2">
                {data.media.images?.length || 0}{" "}
                {language === "ar" ? "صورة" : "images"}
              </span>
            </div>
          </div>
        </PreviewSection>
      )}

      {/* Buildings */}
      {data.buildings && (
        <PreviewSection
          title={
            language === "ar" ? "تكوين المباني" : "Buildings Configuration"
          }
        >
          <div className="space-y-2">
            <PreviewField
              label={language === "ar" ? "عدد المباني" : "Number of Buildings"}
              value={data.buildings.buildings?.length || 0}
            />
          </div>
        </PreviewSection>
      )}

      {/* Units */}
      {data.units && (
        <PreviewSection
          title={
            language === "ar" ? "الوحدات" : "Units"
          }
        >
          <div className="space-y-2">
            <PreviewField
              label={language === "ar" ? "عدد الوحدات" : "Number of Units"}
              value={data.units.units?.length || 0}
            />
          </div>
        </PreviewSection>
      )}

      {/* Associations */}
      {data.associations && (
        <PreviewSection
          title={language === "ar" ? "جمعية الملاك" : "Owners Association"}
        >
          <PreviewField
            label={language === "ar" ? "اسم الشركة" : "Company Name"}
            value={data.associations.companyName}
          />
        </PreviewSection>
      )}
    </div>
  );
}
