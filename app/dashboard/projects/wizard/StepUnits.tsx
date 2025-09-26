"use client";

import React, { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDirection } from "@/context/DirectionContext";
import { StepProps } from "./types";
import { unitsSchema } from "./validation";
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
import { Home, Plus, Trash2, Edit3, DollarSign } from "lucide-react";

const StepUnits: React.FC<StepProps> = ({
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
    resolver: zodResolver(unitsSchema),
    defaultValues: data.units,
    mode: "onChange",
  });

  const { fields, append, remove, update } = useFieldArray({
    control: form.control,
    name: "unitTypes",
  });

  const onSubmit = (formData: any) => {
    onUpdate({ units: formData });
    onNext();
  };

  const addUnitType = () => {
    const newUnitType = {
      id: `unit-${Date.now()}`,
      name: { ar: "", en: "" },
      size: 0,
      rooms: 0,
      bathrooms: 0,
      balconies: 0,
      floor: 0,
      buildingId: "",
      price: 0,
      currency: "SAR" as const,
      unitNumber: "",
      direction: "north" as const,
      view: "city" as const,
      features: [],
      status: "available" as const,
    };
    append(newUnitType);
    setEditingIndex(fields.length);
  };

  const removeUnitType = (index: number) => {
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
    { id: "balcony", name: { ar: "شرفة", en: "Balcony" } },
    { id: "terrace", name: { ar: "تراس", en: "Terrace" } },
    { id: "garden", name: { ar: "حديقة", en: "Garden" } },
    { id: "parking", name: { ar: "موقف سيارات", en: "Parking" } },
    { id: "storage", name: { ar: "مخزن", en: "Storage" } },
    { id: "maid", name: { ar: "غرفة خادمة", en: "Maid Room" } },
    { id: "study", name: { ar: "غرفة دراسة", en: "Study Room" } },
    { id: "walkin", name: { ar: "دولاب مفتوح", en: "Walk-in Closet" } },
  ];

  const toggleFeature = (unitIndex: number, featureId: string) => {
    const unit = fields[unitIndex];
    const currentFeatures = unit.features || [];
    const newFeatures = currentFeatures.includes(featureId)
      ? currentFeatures.filter((f) => f !== featureId)
      : [...currentFeatures, featureId];

    update(unitIndex, { ...unit, features: newFeatures });
  };

  // Get available buildings from the previous step
  const availableBuildings = data.buildings?.buildings || [];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Home className="h-5 w-5" />
            {language === "ar" ? "إدارة الوحدات" : "Unit Management"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Units List */}
            <div className="space-y-4">
              {fields.map((unit, index) => (
                <Card key={unit.id} className="border-2">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">
                        {language === "ar"
                          ? `نوع الوحدة ${index + 1}`
                          : `Unit Type ${index + 1}`}
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
                          onClick={() => removeUnitType(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {editingIndex === index ? (
                      <>
                        {/* Unit Name */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <WizardFormField
                            control={form.control}
                            name={`unitTypes.${index}.name.ar`}
                            label={
                              language === "ar"
                                ? "اسم نوع الوحدة (عربي)"
                                : "Unit Type Name (Arabic)"
                            }
                            render={({ field }) => (
                              <Input
                                {...field}
                                placeholder={
                                  language === "ar"
                                    ? "أدخل اسم نوع الوحدة بالعربية"
                                    : "Enter unit type name in Arabic"
                                }
                                dir="rtl"
                              />
                            )}
                          />
                          <WizardFormField
                            control={form.control}
                            name={`unitTypes.${index}.name.en`}
                            label={
                              language === "ar"
                                ? "اسم نوع الوحدة (إنجليزي)"
                                : "Unit Type Name (English)"
                            }
                            render={({ field }) => (
                              <Input
                                {...field}
                                placeholder={
                                  language === "ar"
                                    ? "أدخل اسم نوع الوحدة بالإنجليزية"
                                    : "Enter unit type name in English"
                                }
                                dir="ltr"
                              />
                            )}
                          />
                        </div>

                        {/* Unit Details */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <WizardFormField
                            control={form.control}
                            name={`unitTypes.${index}.size`}
                            label={
                              language === "ar" ? "المساحة (م²)" : "Size (m²)"
                            }
                            render={({ field }) => (
                              <Input
                                {...field}
                                type="number"
                                min="0"
                                placeholder={
                                  language === "ar"
                                    ? "مساحة الوحدة"
                                    : "Unit size"
                                }
                                onChange={(e) =>
                                  field.onChange(
                                    parseFloat(e.target.value) || 0
                                  )
                                }
                              />
                            )}
                          />
                          <WizardFormField
                            control={form.control}
                            name={`unitTypes.${index}.unitNumber`}
                            label={
                              language === "ar" ? "رقم الوحدة" : "Unit Number"
                            }
                            render={({ field }) => (
                              <Input
                                {...field}
                                placeholder={
                                  language === "ar"
                                    ? "رقم الوحدة"
                                    : "Unit number"
                                }
                              />
                            )}
                          />
                        </div>

                        {/* Rooms and Bathrooms */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <WizardFormField
                            control={form.control}
                            name={`unitTypes.${index}.rooms`}
                            label={
                              language === "ar"
                                ? "عدد الغرف"
                                : "Number of Rooms"
                            }
                            render={({ field }) => (
                              <Input
                                {...field}
                                type="number"
                                min="0"
                                placeholder={
                                  language === "ar"
                                    ? "عدد الغرف"
                                    : "Number of rooms"
                                }
                                onChange={(e) =>
                                  field.onChange(parseInt(e.target.value) || 0)
                                }
                              />
                            )}
                          />
                          <WizardFormField
                            control={form.control}
                            name={`unitTypes.${index}.bathrooms`}
                            label={
                              language === "ar"
                                ? "عدد الحمامات"
                                : "Number of Bathrooms"
                            }
                            render={({ field }) => (
                              <Input
                                {...field}
                                type="number"
                                min="0"
                                placeholder={
                                  language === "ar"
                                    ? "عدد الحمامات"
                                    : "Number of bathrooms"
                                }
                                onChange={(e) =>
                                  field.onChange(parseInt(e.target.value) || 0)
                                }
                              />
                            )}
                          />
                          <WizardFormField
                            control={form.control}
                            name={`unitTypes.${index}.balconies`}
                            label={
                              language === "ar"
                                ? "عدد الشرفات"
                                : "Number of Balconies"
                            }
                            render={({ field }) => (
                              <Input
                                {...field}
                                type="number"
                                min="0"
                                placeholder={
                                  language === "ar"
                                    ? "عدد الشرفات"
                                    : "Number of balconies"
                                }
                                onChange={(e) =>
                                  field.onChange(parseInt(e.target.value) || 0)
                                }
                              />
                            )}
                          />
                        </div>

                        {/* Floor and Building */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <WizardFormField
                            control={form.control}
                            name={`unitTypes.${index}.floor`}
                            label={language === "ar" ? "الطابق" : "Floor"}
                            render={({ field }) => (
                              <Input
                                {...field}
                                type="number"
                                min="0"
                                placeholder={
                                  language === "ar"
                                    ? "رقم الطابق"
                                    : "Floor number"
                                }
                                onChange={(e) =>
                                  field.onChange(parseInt(e.target.value) || 0)
                                }
                              />
                            )}
                          />
                          <WizardFormField
                            control={form.control}
                            name={`unitTypes.${index}.buildingId`}
                            label={language === "ar" ? "المبنى" : "Building"}
                            render={({ field }) => (
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <SelectTrigger>
                                  <SelectValue
                                    placeholder={
                                      language === "ar"
                                        ? "اختر المبنى"
                                        : "Select building"
                                    }
                                  />
                                </SelectTrigger>
                                <SelectContent>
                                  {availableBuildings.map((building: any) => (
                                    <SelectItem
                                      key={building.id}
                                      value={building.id}
                                    >
                                      {language === "ar"
                                        ? building.name.ar
                                        : building.name.en}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            )}
                          />
                        </div>

                        {/* Price and Currency */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <WizardFormField
                            control={form.control}
                            name={`unitTypes.${index}.price`}
                            label={language === "ar" ? "السعر" : "Price"}
                            render={({ field }) => (
                              <Input
                                {...field}
                                type="number"
                                min="0"
                                placeholder={
                                  language === "ar"
                                    ? "سعر الوحدة"
                                    : "Unit price"
                                }
                                onChange={(e) =>
                                  field.onChange(
                                    parseFloat(e.target.value) || 0
                                  )
                                }
                              />
                            )}
                          />
                          <WizardFormField
                            control={form.control}
                            name={`unitTypes.${index}.currency`}
                            label={language === "ar" ? "العملة" : "Currency"}
                            render={({ field }) => (
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <SelectTrigger>
                                  <SelectValue
                                    placeholder={
                                      language === "ar"
                                        ? "اختر العملة"
                                        : "Select currency"
                                    }
                                  />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="SAR">
                                    {language === "ar" ? "ريال سعودي" : "SAR"}
                                  </SelectItem>
                                  <SelectItem value="USD">
                                    {language === "ar" ? "دولار أمريكي" : "USD"}
                                  </SelectItem>
                                  <SelectItem value="EUR">
                                    {language === "ar" ? "يورو" : "EUR"}
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            )}
                          />
                        </div>

                        {/* Direction and View */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <WizardFormField
                            control={form.control}
                            name={`unitTypes.${index}.direction`}
                            label={language === "ar" ? "الاتجاه" : "Direction"}
                            render={({ field }) => (
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <SelectTrigger>
                                  <SelectValue
                                    placeholder={
                                      language === "ar"
                                        ? "اختر الاتجاه"
                                        : "Select direction"
                                    }
                                  />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="north">
                                    {language === "ar" ? "شمال" : "North"}
                                  </SelectItem>
                                  <SelectItem value="south">
                                    {language === "ar" ? "جنوب" : "South"}
                                  </SelectItem>
                                  <SelectItem value="east">
                                    {language === "ar" ? "شرق" : "East"}
                                  </SelectItem>
                                  <SelectItem value="west">
                                    {language === "ar" ? "غرب" : "West"}
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            )}
                          />
                          <WizardFormField
                            control={form.control}
                            name={`unitTypes.${index}.view`}
                            label={language === "ar" ? "المنظر" : "View"}
                            render={({ field }) => (
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <SelectTrigger>
                                  <SelectValue
                                    placeholder={
                                      language === "ar"
                                        ? "اختر المنظر"
                                        : "Select view"
                                    }
                                  />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="city">
                                    {language === "ar" ? "مدينة" : "City"}
                                  </SelectItem>
                                  <SelectItem value="sea">
                                    {language === "ar" ? "بحر" : "Sea"}
                                  </SelectItem>
                                  <SelectItem value="garden">
                                    {language === "ar" ? "حديقة" : "Garden"}
                                  </SelectItem>
                                  <SelectItem value="other">
                                    {language === "ar" ? "أخرى" : "Other"}
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            )}
                          />
                        </div>

                        {/* Status */}
                        <WizardFormField
                          control={form.control}
                          name={`unitTypes.${index}.status`}
                          label={language === "ar" ? "الحالة" : "Status"}
                          render={({ field }) => (
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <SelectTrigger>
                                <SelectValue
                                  placeholder={
                                    language === "ar"
                                      ? "اختر الحالة"
                                      : "Select status"
                                  }
                                />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="available">
                                  {language === "ar" ? "متاح" : "Available"}
                                </SelectItem>
                                <SelectItem value="reserved">
                                  {language === "ar" ? "محجوز" : "Reserved"}
                                </SelectItem>
                                <SelectItem value="sold">
                                  {language === "ar" ? "مباع" : "Sold"}
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
                                  unit.features?.includes(feature.id)
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
                            {language === "ar" ? unit.name.ar : unit.name.en}
                          </span>
                          <Badge variant="secondary">
                            {language === "ar" ? unit.status : unit.status}
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-600">
                          {language === "ar"
                            ? `${unit.size} م² • ${unit.rooms} غرف • ${unit.bathrooms} حمام`
                            : `${unit.size} m² • ${unit.rooms} rooms • ${unit.bathrooms} bathrooms`}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <DollarSign className="h-4 w-4" />
                          <span>
                            {unit.price.toLocaleString()} {unit.currency}
                          </span>
                        </div>
                        {unit.features && unit.features.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {unit.features.map((featureId) => {
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

            {/* Add Unit Type Button */}
            <Button
              type="button"
              variant="outline"
              onClick={addUnitType}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              {language === "ar" ? "إضافة نوع وحدة جديد" : "Add New Unit Type"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default StepUnits;
