import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ProjectWizardData } from './types';

interface ProjectWizardStore {
  projectData: ProjectWizardData;
  currentStep: number;
  completedSteps: number[];

  // Actions
  updateProjectData: (data: Partial<ProjectWizardData>) => void;
  updateStepData: (stepKey: keyof ProjectWizardData, data: any) => void;
  setCurrentStep: (step: number) => void;
  markStepComplete: (step: number) => void;
  markStepIncomplete: (step: number) => void;
  isStepCompleted: (step: number) => boolean;
  getStepCompletionStatus: () => Record<number, boolean>;

  // Draft management
  saveDraft: (data: ProjectWizardData) => void;
  loadDraft: () => ProjectWizardData | null;
  clearDraft: () => void;

  // Reset
  resetWizard: () => void;
}

const initialProjectData: ProjectWizardData = {
  basicInfo: {
    name: { ar: '', en: '' },
    description: { ar: '', en: '' },
    locationLink: '',
    city: '',
    district: '',
    ownerName: '',
    contractorName: '',
    developer: '',
    licenseNumber: '',
    totalArea: 0,
    projectType: 'residential',
    status: 'planned',
    features: [],
  },
  landPieces: [],
  media: {
    images: [],
    videos: [],
    floorPlans: [],
    brochures: [],
  },
  unitModels: [],
  buildings: {
    buildings: [],
  },
  units: {
    units: [],
  },
  associations: {
    companyName: '',
    crNumber: '',
    headquarters: '',
    ownerName: '',
    ownerMobile: '',
    ownerIdNumber: '',
    attachments: {},
  },
  review: {
    isReady: false,
    notes: '',
    isPublished: false,
  },
};

export const useProjectWizardStore = create<ProjectWizardStore>()(
  persist(
    (set, get) => ({
      projectData: initialProjectData,
      currentStep: 1,
      completedSteps: [],

      updateProjectData: (data) =>
        set((state) => ({
          projectData: { ...state.projectData, ...data },
        })),

      updateStepData: (stepKey, data) =>
        set((state) => ({
          projectData: {
            ...state.projectData,
            [stepKey]: { ...state.projectData[stepKey], ...data },
          },
        })),

      setCurrentStep: (step) => set({ currentStep: step }),

      markStepComplete: (step) =>
        set((state) => {
          const newSteps = [...state.completedSteps, step];
          return {
            completedSteps: Array.from(new Set(newSteps)),
          };
        }),

      markStepIncomplete: (step) =>
        set((state) => ({
          completedSteps: state.completedSteps.filter((s) => s !== step),
        })),

      isStepCompleted: (step) => {
        const { completedSteps } = get();
        return completedSteps.includes(step);
      },

      getStepCompletionStatus: () => {
        const { completedSteps } = get();
        const status: Record<number, boolean> = {};
        for (let i = 1; i <= 8; i++) {
          status[i] = completedSteps.includes(i);
        }
        return status;
      },

      saveDraft: (data) => {
        try {
          localStorage.setItem('project-wizard-draft', JSON.stringify(data));
        } catch (error) {
          console.error('Failed to save draft:', error);
        }
      },

      loadDraft: () => {
        try {
          const draft = localStorage.getItem('project-wizard-draft');
          return draft ? JSON.parse(draft) : null;
        } catch (error) {
          console.error('Failed to load draft:', error);
          return null;
        }
      },

      clearDraft: () => {
        try {
          localStorage.removeItem('project-wizard-draft');
        } catch (error) {
          console.error('Failed to clear draft:', error);
        }
      },

      resetWizard: () =>
        set({
          projectData: initialProjectData,
          currentStep: 1,
          completedSteps: [],
        }),
    }),
    {
      name: 'project-wizard-store',
      partialize: (state) => ({
        projectData: state.projectData,
        currentStep: state.currentStep,
        completedSteps: state.completedSteps,
      }),
    }
  )
);
