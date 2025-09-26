"use client";

import React, { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDirection } from "@/context/DirectionContext";
import { StepProps } from "./types";
import { buildingsSchema } from "./validation";
import WizardFormField from "@/components/shared/WizardFormField";
import { Button } from "@/components/ui/button";
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
import { Badge } from "@/components/ui/badge";
import { Building2, Plus, Trash2, Edit3 } from "lucide-react";

const StepBuildings: React.FC<StepProps> = ({
  data,
  onUpdate,
  onNext,
  onPrevious,
  isFirstStep,
  isLastStep,
  isSubmitting,
}) => {
  const { language, isRTL } = useDirection();
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const form = useForm({
    resolver: zodResolver(buildingsSchema),
    defaultValues: data.buildings,
    mode: "onChange",
  });

  const { fields, append, remove, update } = useFieldArray({
    control: form.control,
    name: "buildings",
  });

  const onSubmit = (formData: any) => {
    onUpdate({ buildings: formData });
    onNext();
  };

  const addBuilding = () => {
    const newBuilding = {
      id: `building-${Date.now()}`,
      name: { ar: "", en: "" },
      floors: 1,
      unitsPerFloor: 1,
      totalUnits: 1,
      buildingType: "residential" as const,
      features: [],
    };
    append(newBuilding);
    setEditingIndex(fields.length);
  };

  const removeBuilding = (index: number) => {
    remove(index);
    if (editingIndex === index) {
      setEditingIndex(null);
    } else if (editingIndex && editingIndex > index) {
      setEditingIndex(editingIndex - 1);
    }
  };

  const startEditing = (index: number) => {
    setEditingIndex(index);
  };

  const finishEditing = () => {
    setEditingIndex(null);
  };

  const availableFeatures = [
    { id: "elevator", name: { ar: "مصعد", en: "Elevator" } },
    { id: "parking", name: { ar: "موقف سيارات", en: "Parking" } },
    { id: "garden", name: { ar: "حديقة", en: "Garden" } },
    { id: "gym", name: { ar: "صالة رياضية", en: "Gym" } },
    { id: "pool", name: { ar: "مسبح", en: "Swimming Pool" } },
    { id: "security", name: { ar: "أمن", en: "Security" } },
    { id: "concierge", name: { ar: "خدمة الاستقبال", en: "Concierge" } },
    { id: "maintenance", name: { ar: "صيانة", en: "Maintenance" } },
  ];

  const toggleFeature = (buildingIndex: number, featureId: string) => {
    const building = fields[buildingIndex];
    const currentFeatures = building.features || [];
    const newFeatures = currentFeatures.includes(featureId)
      ? currentFeatures.filter((f) => f !== featureId)
      : [...currentFeatures, featureId];

    update(buildingIndex, { ...building, features: newFeatures });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            {language === "ar" ? "تكوين المباني" : "Buildings Configuration"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Buildings List */}
            <div className="space-y-4">
              {fields.map((building, index) => (
                <Card key={building.id} className="border-2">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">
                        {language === "ar"
                          ? `المبنى ${index + 1}`
                          : `Building ${index + 1}`}
                      </CardTitle>
                      <div className="flex gap-2">
                        {editingIndex === index ? (
                          <Button
                            type="button"
                            size="sm"
                            onClick={finishEditing}
                          >
                            {language === "ar" ? "حفظ" : "Save"}
                          </Button>
                        ) : (
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => startEditing(index)}
                          >
                            <Edit3 className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          type="button"
                          size="sm"
                          variant="destructive"
                          onClick={() => removeBuilding(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {editingIndex === index ? (
                      <>
                        {/* Building Name */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <WizardFormField
                            control={form.control}
                            name={`buildings.${index}.name.ar`}
                            label={
                              language === "ar"
                                ? "اسم المبنى (عربي)"
                                : "Building Name (Arabic)"
                            }
                            render={({ field }) => (
                              <Input
                                {...field}
                                placeholder={
                                  language === "ar"
                                    ? "أدخل اسم المبنى بالعربية"
                                    : "Enter building name in Arabic"
                                }
                                dir="rtl"
                              />
                            )}
                          />
                          <WizardFormField
                            control={form.control}
                            name={`buildings.${index}.name.en`}
                            label={
                              language === "ar"
                                ? "اسم المبنى (إنجليزي)"
                                : "Building Name (English)"
                            }
                            render={({ field }) => (
                              <Input
                                {...field}
                                placeholder={
                                  language === "ar"
                                    ? "أدخل اسم المبنى بالإنجليزية"
                                    : "Enter building name in English"
                                }
                                dir="ltr"
                              />
                            )}
                          />
                        </div>

                        {/* Building Details */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <WizardFormField
                            control={form.control}
                            name={`buildings.${index}.floors`}
                            label={
                              language === "ar"
                                ? "عدد الطوابق"
                                : "Number of Floors"
                            }
                            render={({ field }) => (
                              <Input
                                {...field}
                                type="number"
                                min="1"
                                placeholder={
                                  language === "ar"
                                    ? "عدد الطوابق"
                                    : "Number of floors"
                                }
                                onChange={(e) =>
                                  field.onChange(parseInt(e.target.value) || 1)
                                }
                              />
                            )}
                          />
                          <WizardFormField
                            control={form.control}
                            name={`buildings.${index}.unitsPerFloor`}
                            label={
                              language === "ar"
                                ? "الوحدات لكل طابق"
                                : "Units per Floor"
                            }
                            render={({ field }) => (
                              <Input
                                {...field}
                                type="number"
                                min="1"
                                placeholder={
                                  language === "ar"
                                    ? "الوحدات لكل طابق"
                                    : "Units per floor"
                                }
                                onChange={(e) =>
                                  field.onChange(parseInt(e.target.value) || 1)
                                }
                              />
                            )}
                          />
                          <WizardFormField
                            control={form.control}
                            name={`buildings.${index}.totalUnits`}
                            label={
                              language === "ar"
                                ? "إجمالي الوحدات"
                                : "Total Units"
                            }
                            render={({ field }) => (
                              <Input
                                {...field}
                                type="number"
                                min="1"
                                placeholder={
                                  language === "ar"
                                    ? "إجمالي الوحدات"
                                    : "Total units"
                                }
                                onChange={(e) =>
                                  field.onChange(parseInt(e.target.value) || 1)
                                }
                              />
                            )}
                          />
                        </div>

                        {/* Building Type */}
                        <WizardFormField
                          control={form.control}
                          name={`buildings.${index}.buildingType`}
                          label={
                            language === "ar" ? "نوع المبنى" : "Building Type"
                          }
                          render={({ field }) => (
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <SelectTrigger>
                                <SelectValue
                                  placeholder={
                                    language === "ar"
                                      ? "اختر نوع المبنى"
                                      : "Select building type"
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

                        {/* Features */}
                        <div>
                          <label className="text-sm font-medium mb-2 block">
                            {language === "ar" ? "المميزات" : "Features"}
                          </label>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                            {availableFeatures.map((feature) => (
                              <Button
                                key={feature.id}
                                type="button"
                                variant={
                                  building.features?.includes(feature.id)
                                    ? "default"
                                    : "outline"
                                }
                                size="sm"
                                onClick={() => toggleFeature(index, feature.id)}
                                className="justify-start"
                              >
                                {language === "ar"
                                  ? feature.name.ar
                                  : feature.name.en}
                              </Button>
                            ))}
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">
                            {language === "ar"
                              ? building.name.ar
                              : building.name.en}
                          </span>
                          <Badge variant="secondary">
                            {language === "ar"
                              ? building.buildingType
                              : building.buildingType}
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-600">
                          {language === "ar"
                            ? `${building.floors} طوابق • ${building.totalUnits} وحدة`
                            : `${building.floors} floors • ${building.totalUnits} units`}
                        </div>
                        {building.features && building.features.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {building.features.map((featureId) => {
                              const feature = availableFeatures.find(
                                (f) => f.id === featureId
                              );
                              return feature ? (
                                <Badge
                                  key={featureId}
                                  variant="outline"
                                  className="text-xs"
                                >
                                  {language === "ar"
                                    ? feature.name.ar
                                    : feature.name.en}
                                </Badge>
                              ) : null;
                            })}
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Add Building Button */}
            <Button
              type="button"
              variant="outline"
              onClick={addBuilding}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              {language === "ar" ? "إضافة مبنى جديد" : "Add New Building"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default StepBuildings;
