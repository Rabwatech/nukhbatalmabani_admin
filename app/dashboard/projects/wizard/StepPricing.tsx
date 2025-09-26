"use client";

import React, { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDirection } from "@/context/DirectionContext";
import { StepProps } from "./types";
import { pricingSchema } from "./validation";
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
import { DollarSign, Plus, Trash2, Edit3, Calculator } from "lucide-react";

const StepPricing: React.FC<StepProps> = ({
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
    resolver: zodResolver(pricingSchema),
    defaultValues: data.pricing,
    mode: "onChange",
  });

  const { fields, append, remove, update } = useFieldArray({
    control: form.control,
    name: "paymentPlans",
  });

  const onSubmit = (formData: any) => {
    onUpdate({ pricing: formData });
    onNext();
  };

  const addPaymentPlan = () => {
    const newPlan = {
      id: `plan-${Date.now()}`,
      name: { ar: "", en: "" },
      description: { ar: "", en: "" },
      downPayment: 0,
      installments: 1,
      installmentAmount: 0,
      totalAmount: 0,
      currency: "SAR" as const,
      isActive: true,
    };
    append(newPlan);
    setEditingIndex(fields.length);
  };

  const removePaymentPlan = (index: number) => {
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

  const calculateTotalAmount = (
    downPayment: number,
    installments: number,
    installmentAmount: number
  ) => {
    return downPayment + installments * installmentAmount;
  };

  const handlePlanChange = (index: number, field: string, value: any) => {
    const plan = fields[index];
    const updatedPlan = { ...plan, [field]: value };

    if (
      field === "downPayment" ||
      field === "installments" ||
      field === "installmentAmount"
    ) {
      const downPayment = field === "downPayment" ? value : plan.downPayment;
      const installments = field === "installments" ? value : plan.installments;
      const installmentAmount =
        field === "installmentAmount" ? value : plan.installmentAmount;

      updatedPlan.totalAmount = calculateTotalAmount(
        downPayment,
        installments,
        installmentAmount
      );
    }

    update(index, updatedPlan);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            {language === "ar" ? "الاستثمار والأسعار" : "Investment & Pricing"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Price Per Square Meter */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <WizardFormField
                control={form.control}
                name="pricePerSqm"
                label={
                  language === "ar"
                    ? "السعر لكل متر مربع"
                    : "Price per Square Meter"
                }
                render={({ field }) => (
                  <Input
                    {...field}
                    type="number"
                    min="0"
                    placeholder={
                      language === "ar"
                        ? "السعر لكل متر مربع"
                        : "Price per square meter"
                    }
                    onChange={(e) =>
                      field.onChange(parseFloat(e.target.value) || 0)
                    }
                  />
                )}
              />
              <WizardFormField
                control={form.control}
                name="currency"
                label={language === "ar" ? "العملة" : "Currency"}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          language === "ar" ? "اختر العملة" : "Select currency"
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

            {/* Price Range */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <WizardFormField
                control={form.control}
                name="priceRange.min"
                label={language === "ar" ? "أقل سعر" : "Minimum Price"}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="number"
                    min="0"
                    placeholder={
                      language === "ar" ? "أقل سعر" : "Minimum price"
                    }
                    onChange={(e) =>
                      field.onChange(parseFloat(e.target.value) || 0)
                    }
                  />
                )}
              />
              <WizardFormField
                control={form.control}
                name="priceRange.max"
                label={language === "ar" ? "أعلى سعر" : "Maximum Price"}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="number"
                    min="0"
                    placeholder={
                      language === "ar" ? "أعلى سعر" : "Maximum price"
                    }
                    onChange={(e) =>
                      field.onChange(parseFloat(e.target.value) || 0)
                    }
                  />
                )}
              />
            </div>

            {/* Payment Plans */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">
                  {language === "ar" ? "خطط الدفع" : "Payment Plans"}
                </h3>
                <Button
                  type="button"
                  variant="outline"
                  onClick={addPaymentPlan}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {language === "ar" ? "إضافة خطة دفع" : "Add Payment Plan"}
                </Button>
              </div>

              {fields.map((plan, index) => (
                <Card key={plan.id} className="border-2">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">
                        {language === "ar"
                          ? `خطة الدفع ${index + 1}`
                          : `Payment Plan ${index + 1}`}
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
                          onClick={() => removePaymentPlan(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {editingIndex === index ? (
                      <>
                        {/* Plan Name */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <WizardFormField
                            control={form.control}
                            name={`paymentPlans.${index}.name.ar`}
                            label={
                              language === "ar"
                                ? "اسم الخطة (عربي)"
                                : "Plan Name (Arabic)"
                            }
                            render={({ field }) => (
                              <Input
                                {...field}
                                placeholder={
                                  language === "ar"
                                    ? "أدخل اسم الخطة بالعربية"
                                    : "Enter plan name in Arabic"
                                }
                                dir="rtl"
                              />
                            )}
                          />
                          <WizardFormField
                            control={form.control}
                            name={`paymentPlans.${index}.name.en`}
                            label={
                              language === "ar"
                                ? "اسم الخطة (إنجليزي)"
                                : "Plan Name (English)"
                            }
                            render={({ field }) => (
                              <Input
                                {...field}
                                placeholder={
                                  language === "ar"
                                    ? "أدخل اسم الخطة بالإنجليزية"
                                    : "Enter plan name in English"
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
                            name={`paymentPlans.${index}.description.ar`}
                            label={
                              language === "ar"
                                ? "وصف الخطة (عربي)"
                                : "Description (Arabic)"
                            }
                            render={({ field }) => (
                              <Textarea
                                {...field}
                                placeholder={
                                  language === "ar"
                                    ? "أدخل وصف الخطة بالعربية"
                                    : "Enter description in Arabic"
                                }
                                dir="rtl"
                                rows={3}
                              />
                            )}
                          />
                          <WizardFormField
                            control={form.control}
                            name={`paymentPlans.${index}.description.en`}
                            label={
                              language === "ar"
                                ? "وصف الخطة (إنجليزي)"
                                : "Description (English)"
                            }
                            render={({ field }) => (
                              <Textarea
                                {...field}
                                placeholder={
                                  language === "ar"
                                    ? "أدخل وصف الخطة بالإنجليزية"
                                    : "Enter description in English"
                                }
                                dir="ltr"
                                rows={3}
                              />
                            )}
                          />
                        </div>

                        {/* Payment Details */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <WizardFormField
                            control={form.control}
                            name={`paymentPlans.${index}.downPayment`}
                            label={
                              language === "ar"
                                ? "الدفعة المقدمة"
                                : "Down Payment"
                            }
                            render={({ field }) => (
                              <Input
                                {...field}
                                type="number"
                                min="0"
                                placeholder={
                                  language === "ar"
                                    ? "الدفعة المقدمة"
                                    : "Down payment"
                                }
                                onChange={(e) => {
                                  const value = parseFloat(e.target.value) || 0;
                                  field.onChange(value);
                                  handlePlanChange(index, "downPayment", value);
                                }}
                              />
                            )}
                          />
                          <WizardFormField
                            control={form.control}
                            name={`paymentPlans.${index}.installments`}
                            label={
                              language === "ar" ? "عدد الأقساط" : "Installments"
                            }
                            render={({ field }) => (
                              <Input
                                {...field}
                                type="number"
                                min="1"
                                placeholder={
                                  language === "ar"
                                    ? "عدد الأقساط"
                                    : "Number of installments"
                                }
                                onChange={(e) => {
                                  const value = parseInt(e.target.value) || 1;
                                  field.onChange(value);
                                  handlePlanChange(
                                    index,
                                    "installments",
                                    value
                                  );
                                }}
                              />
                            )}
                          />
                          <WizardFormField
                            control={form.control}
                            name={`paymentPlans.${index}.installmentAmount`}
                            label={
                              language === "ar"
                                ? "مبلغ القسط"
                                : "Installment Amount"
                            }
                            render={({ field }) => (
                              <Input
                                {...field}
                                type="number"
                                min="0"
                                placeholder={
                                  language === "ar"
                                    ? "مبلغ القسط"
                                    : "Installment amount"
                                }
                                onChange={(e) => {
                                  const value = parseFloat(e.target.value) || 0;
                                  field.onChange(value);
                                  handlePlanChange(
                                    index,
                                    "installmentAmount",
                                    value
                                  );
                                }}
                              />
                            )}
                          />
                        </div>

                        {/* Total Amount Display */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <div className="flex items-center gap-2">
                            <Calculator className="h-4 w-4" />
                            <span className="font-medium">
                              {language === "ar"
                                ? "المبلغ الإجمالي"
                                : "Total Amount"}
                            </span>
                            <Badge variant="outline">
                              {plan.totalAmount?.toLocaleString()}{" "}
                              {plan.currency}
                            </Badge>
                          </div>
                        </div>

                        {/* Currency and Active Status */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <WizardFormField
                            control={form.control}
                            name={`paymentPlans.${index}.currency`}
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
                          <div className="flex items-center space-x-2">
                            <WizardFormField
                              control={form.control}
                              name={`paymentPlans.${index}.isActive`}
                              render={({ field }) => (
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              )}
                            />
                            <label className="text-sm font-medium">
                              {language === "ar" ? "نشط" : "Active"}
                            </label>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">
                            {language === "ar" ? plan.name.ar : plan.name.en}
                          </span>
                          <Badge
                            variant={plan.isActive ? "default" : "secondary"}
                          >
                            {plan.isActive
                              ? language === "ar"
                                ? "نشط"
                                : "Active"
                              : language === "ar"
                              ? "غير نشط"
                              : "Inactive"}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">
                          {language === "ar"
                            ? plan.description.ar
                            : plan.description.en}
                        </p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">
                              {language === "ar"
                                ? "الدفعة المقدمة:"
                                : "Down Payment:"}
                            </span>
                            <div className="font-medium">
                              {plan.downPayment?.toLocaleString()}{" "}
                              {plan.currency}
                            </div>
                          </div>
                          <div>
                            <span className="text-gray-500">
                              {language === "ar" ? "الأقساط:" : "Installments:"}
                            </span>
                            <div className="font-medium">
                              {plan.installments}
                            </div>
                          </div>
                          <div>
                            <span className="text-gray-500">
                              {language === "ar"
                                ? "مبلغ القسط:"
                                : "Installment:"}
                            </span>
                            <div className="font-medium">
                              {plan.installmentAmount?.toLocaleString()}{" "}
                              {plan.currency}
                            </div>
                          </div>
                          <div>
                            <span className="text-gray-500">
                              {language === "ar" ? "الإجمالي:" : "Total:"}
                            </span>
                            <div className="font-medium text-green-600">
                              {plan.totalAmount?.toLocaleString()}{" "}
                              {plan.currency}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default StepPricing;
