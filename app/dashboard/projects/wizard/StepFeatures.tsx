"use client";

import React, { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDirection } from "@/context/DirectionContext";
import { StepProps } from "./types";
import { featuresSchema } from "./validation";
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
import { Switch } from "@/components/ui/switch";
import { Star, Plus, Trash2, Edit3, DollarSign } from "lucide-react";

const StepFeatures: React.FC<StepProps> = ({
  data,
  onUpdate,
  onNext,
  onPrevious,
  isFirstStep,
  isLastStep,
  isSubmitting,
}) => {
  const { language, isRTL } = useDirection();
  const [editingAmenityIndex, setEditingAmenityIndex] = useState<number | null>(
    null
  );
  const [editingServiceIndex, setEditingServiceIndex] = useState<number | null>(
    null
  );

  const form = useForm({
    resolver: zodResolver(featuresSchema),
    defaultValues: data.features,
    mode: "onChange",
  });

  const {
    fields: amenityFields,
    append: appendAmenity,
    remove: removeAmenityField,
    update: updateAmenity,
  } = useFieldArray({
    control: form.control,
    name: "amenities",
  });

  const {
    fields: serviceFields,
    append: appendService,
    remove: removeServiceField,
    update: updateService,
  } = useFieldArray({
    control: form.control,
    name: "services",
  });

  const onSubmit = (formData: any) => {
    onUpdate({ features: formData });
    onNext();
  };

  const addAmenity = () => {
    const newAmenity = {
      id: `amenity-${Date.now()}`,
      name: { ar: "", en: "" },
      description: { ar: "", en: "" },
      category: "recreation" as const,
      icon: "star",
      isAvailable: true,
    };
    appendAmenity(newAmenity);
    setEditingAmenityIndex(amenityFields.length);
  };

  const addService = () => {
    const newService = {
      id: `service-${Date.now()}`,
      name: { ar: "", en: "" },
      description: { ar: "", en: "" },
      price: 0,
      currency: "SAR" as const,
      billingCycle: "monthly" as const,
      isIncluded: false,
    };
    appendService(newService);
    setEditingServiceIndex(serviceFields.length);
  };

  const removeAmenity = (index: number) => {
    removeAmenityField(index);
    if (editingAmenityIndex === index) {
      setEditingAmenityIndex(null);
    } else if (editingAmenityIndex && editingAmenityIndex > index) {
      setEditingAmenityIndex(editingAmenityIndex - 1);
    }
  };

  const removeService = (index: number) => {
    removeServiceField(index);
    if (editingServiceIndex === index) {
      setEditingServiceIndex(null);
    } else if (editingServiceIndex && editingServiceIndex > index) {
      setEditingServiceIndex(editingServiceIndex - 1);
    }
  };

  const startEditingAmenity = (index: number) => {
    setEditingAmenityIndex(index);
  };

  const startEditingService = (index: number) => {
    setEditingServiceIndex(index);
  };

  const finishEditing = () => {
    setEditingAmenityIndex(null);
    setEditingServiceIndex(null);
  };

  const amenityCategories = [
    { id: "security", name: { ar: "أمن", en: "Security" } },
    { id: "recreation", name: { ar: "ترفيه", en: "Recreation" } },
    { id: "commercial", name: { ar: "تجاري", en: "Commercial" } },
    { id: "transportation", name: { ar: "مواصلات", en: "Transportation" } },
    { id: "other", name: { ar: "أخرى", en: "Other" } },
  ];

  const billingCycles = [
    { id: "monthly", name: { ar: "شهري", en: "Monthly" } },
    { id: "yearly", name: { ar: "سنوي", en: "Yearly" } },
    { id: "one_time", name: { ar: "مرة واحدة", en: "One Time" } },
  ];

  return (
    <div className="space-y-6">
      {/* Amenities Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5" />
            {language === "ar" ? "المميزات والمرافق" : "Amenities & Facilities"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {amenityFields.map((amenity, index) => (
              <Card key={amenity.id} className="border-2">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">
                      {language === "ar"
                        ? `مرفق ${index + 1}`
                        : `Amenity ${index + 1}`}
                    </CardTitle>
                    <div className="flex gap-2">
                      {editingAmenityIndex === index ? (
                        <Button type="button" size="sm" onClick={finishEditing}>
                          {language === "ar" ? "حفظ" : "Save"}
                        </Button>
                      ) : (
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => startEditingAmenity(index)}
                        >
                          <Edit3 className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        type="button"
                        size="sm"
                        variant="destructive"
                        onClick={() => removeAmenity(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {editingAmenityIndex === index ? (
                    <>
                      {/* Amenity Name */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <WizardFormField
                          control={form.control}
                          name={`amenities.${index}.name.ar`}
                          label={
                            language === "ar"
                              ? "اسم المرفق (عربي)"
                              : "Amenity Name (Arabic)"
                          }
                          render={({ field }) => (
                            <Input
                              {...field}
                              placeholder={
                                language === "ar"
                                  ? "أدخل اسم المرفق بالعربية"
                                  : "Enter amenity name in Arabic"
                              }
                              dir="rtl"
                            />
                          )}
                        />
                        <WizardFormField
                          control={form.control}
                          name={`amenities.${index}.name.en`}
                          label={
                            language === "ar"
                              ? "اسم المرفق (إنجليزي)"
                              : "Amenity Name (English)"
                          }
                          render={({ field }) => (
                            <Input
                              {...field}
                              placeholder={
                                language === "ar"
                                  ? "أدخل اسم المرفق بالإنجليزية"
                                  : "Enter amenity name in English"
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
                          name={`amenities.${index}.description.ar`}
                          label={
                            language === "ar"
                              ? "وصف المرفق (عربي)"
                              : "Description (Arabic)"
                          }
                          render={({ field }) => (
                            <Textarea
                              {...field}
                              placeholder={
                                language === "ar"
                                  ? "أدخل وصف المرفق بالعربية"
                                  : "Enter description in Arabic"
                              }
                              dir="rtl"
                              rows={3}
                            />
                          )}
                        />
                        <WizardFormField
                          control={form.control}
                          name={`amenities.${index}.description.en`}
                          label={
                            language === "ar"
                              ? "وصف المرفق (إنجليزي)"
                              : "Description (English)"
                          }
                          render={({ field }) => (
                            <Textarea
                              {...field}
                              placeholder={
                                language === "ar"
                                  ? "أدخل وصف المرفق بالإنجليزية"
                                  : "Enter description in English"
                              }
                              dir="ltr"
                              rows={3}
                            />
                          )}
                        />
                      </div>

                      {/* Category and Availability */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <WizardFormField
                          control={form.control}
                          name={`amenities.${index}.category`}
                          label={language === "ar" ? "الفئة" : "Category"}
                          render={({ field }) => (
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <SelectTrigger>
                                <SelectValue
                                  placeholder={
                                    language === "ar"
                                      ? "اختر الفئة"
                                      : "Select category"
                                  }
                                />
                              </SelectTrigger>
                              <SelectContent>
                                {amenityCategories.map((category) => (
                                  <SelectItem
                                    key={category.id}
                                    value={category.id}
                                  >
                                    {language === "ar"
                                      ? category.name.ar
                                      : category.name.en}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                        />
                        <div className="flex items-center space-x-2">
                          <WizardFormField
                            control={form.control}
                            name={`amenities.${index}.isAvailable`}
                            label=""
                            render={({ field }) => (
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            )}
                          />
                          <label className="text-sm font-medium">
                            {language === "ar" ? "متاح" : "Available"}
                          </label>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">
                          {language === "ar"
                            ? amenity.name.ar
                            : amenity.name.en}
                        </span>
                        <Badge
                          variant={
                            amenity.isAvailable ? "default" : "secondary"
                          }
                        >
                          {amenity.isAvailable
                            ? language === "ar"
                              ? "متاح"
                              : "Available"
                            : language === "ar"
                            ? "غير متاح"
                            : "Unavailable"}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">
                        {language === "ar"
                          ? amenity.description.ar
                          : amenity.description.en}
                      </p>
                      <Badge variant="outline" className="text-xs">
                        {language === "ar"
                          ? amenityCategories.find(
                              (c) => c.id === amenity.category
                            )?.name.ar
                          : amenityCategories.find(
                              (c) => c.id === amenity.category
                            )?.name.en}
                      </Badge>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}

            <Button
              type="button"
              variant="outline"
              onClick={addAmenity}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              {language === "ar" ? "إضافة مرفق جديد" : "Add New Amenity"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Services Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            {language === "ar" ? "الخدمات" : "Services"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {serviceFields.map((service, index) => (
              <Card key={service.id} className="border-2">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">
                      {language === "ar"
                        ? `خدمة ${index + 1}`
                        : `Service ${index + 1}`}
                    </CardTitle>
                    <div className="flex gap-2">
                      {editingServiceIndex === index ? (
                        <Button type="button" size="sm" onClick={finishEditing}>
                          {language === "ar" ? "حفظ" : "Save"}
                        </Button>
                      ) : (
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => startEditingService(index)}
                        >
                          <Edit3 className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        type="button"
                        size="sm"
                        variant="destructive"
                        onClick={() => removeService(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {editingServiceIndex === index ? (
                    <>
                      {/* Service Name */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <WizardFormField
                          control={form.control}
                          name={`services.${index}.name.ar`}
                          label={
                            language === "ar"
                              ? "اسم الخدمة (عربي)"
                              : "Service Name (Arabic)"
                          }
                          render={({ field }) => (
                            <Input
                              {...field}
                              placeholder={
                                language === "ar"
                                  ? "أدخل اسم الخدمة بالعربية"
                                  : "Enter service name in Arabic"
                              }
                              dir="rtl"
                            />
                          )}
                        />
                        <WizardFormField
                          control={form.control}
                          name={`services.${index}.name.en`}
                          label={
                            language === "ar"
                              ? "اسم الخدمة (إنجليزي)"
                              : "Service Name (English)"
                          }
                          render={({ field }) => (
                            <Input
                              {...field}
                              placeholder={
                                language === "ar"
                                  ? "أدخل اسم الخدمة بالإنجليزية"
                                  : "Enter service name in English"
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
                          name={`services.${index}.description.ar`}
                          label={
                            language === "ar"
                              ? "وصف الخدمة (عربي)"
                              : "Description (Arabic)"
                          }
                          render={({ field }) => (
                            <Textarea
                              {...field}
                              placeholder={
                                language === "ar"
                                  ? "أدخل وصف الخدمة بالعربية"
                                  : "Enter description in Arabic"
                              }
                              dir="rtl"
                              rows={3}
                            />
                          )}
                        />
                        <WizardFormField
                          control={form.control}
                          name={`services.${index}.description.en`}
                          label={
                            language === "ar"
                              ? "وصف الخدمة (إنجليزي)"
                              : "Description (English)"
                          }
                          render={({ field }) => (
                            <Textarea
                              {...field}
                              placeholder={
                                language === "ar"
                                  ? "أدخل وصف الخدمة بالإنجليزية"
                                  : "Enter description in English"
                              }
                              dir="ltr"
                              rows={3}
                            />
                          )}
                        />
                      </div>

                      {/* Price and Currency */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <WizardFormField
                          control={form.control}
                          name={`services.${index}.price`}
                          label={language === "ar" ? "السعر" : "Price"}
                          render={({ field }) => (
                            <Input
                              {...field}
                              type="number"
                              min="0"
                              placeholder={
                                language === "ar"
                                  ? "سعر الخدمة"
                                  : "Service price"
                              }
                              onChange={(e) =>
                                field.onChange(parseFloat(e.target.value) || 0)
                              }
                            />
                          )}
                        />
                        <WizardFormField
                          control={form.control}
                          name={`services.${index}.currency`}
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
                        <WizardFormField
                          control={form.control}
                          name={`services.${index}.billingCycle`}
                          label={
                            language === "ar" ? "دورة الفوترة" : "Billing Cycle"
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
                                      ? "اختر دورة الفوترة"
                                      : "Select billing cycle"
                                  }
                                />
                              </SelectTrigger>
                              <SelectContent>
                                {billingCycles.map((cycle) => (
                                  <SelectItem key={cycle.id} value={cycle.id}>
                                    {language === "ar"
                                      ? cycle.name.ar
                                      : cycle.name.en}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                        />
                      </div>

                      {/* Included Service */}
                      <div className="flex items-center space-x-2">
                        <WizardFormField
                          control={form.control}
                          name={`services.${index}.isIncluded`}
                          label=""
                          render={({ field }) => (
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          )}
                        />
                        <label className="text-sm font-medium">
                          {language === "ar"
                            ? "مشمول في السعر"
                            : "Included in Price"}
                        </label>
                      </div>
                    </>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">
                          {language === "ar"
                            ? service.name.ar
                            : service.name.en}
                        </span>
                        <Badge
                          variant={service.isIncluded ? "default" : "secondary"}
                        >
                          {service.isIncluded
                            ? language === "ar"
                              ? "مشمول"
                              : "Included"
                            : language === "ar"
                            ? "إضافي"
                            : "Additional"}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">
                        {language === "ar"
                          ? service.description.ar
                          : service.description.en}
                      </p>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="font-medium">
                          {service.price.toLocaleString()} {service.currency}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {language === "ar"
                            ? billingCycles.find(
                                (c) => c.id === service.billingCycle
                              )?.name.ar
                            : billingCycles.find(
                                (c) => c.id === service.billingCycle
                              )?.name.en}
                        </Badge>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}

            <Button
              type="button"
              variant="outline"
              onClick={addService}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              {language === "ar" ? "إضافة خدمة جديدة" : "Add New Service"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StepFeatures;
