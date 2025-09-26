"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDirection } from "@/context/DirectionContext";
import { StepProps } from "./types";
import { associationsSchema } from "./validation";
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
import { Users, Building, Plus, Trash2, Edit3, DollarSign } from "lucide-react";

const StepAssociations: React.FC<StepProps> = ({
  data,
  onUpdate,
  onNext,
  onPrevious,
  isFirstStep,
  isLastStep,
  isSubmitting,
}) => {
  const { language, isRTL } = useDirection();
  const [editingRuleIndex, setEditingRuleIndex] = useState<number | null>(null);
  const [editingServiceIndex, setEditingServiceIndex] = useState<number | null>(
    null
  );

  const form = useForm({
    resolver: zodResolver(associationsSchema),
    defaultValues: data.associations,
    mode: "onChange",
  });

  const onSubmit = (formData: any) => {
    onUpdate({ associations: formData });
    onNext();
  };

  const addRule = () => {
    const currentRules = form.getValues("ownersAssociation.rules") || [];
    form.setValue("ownersAssociation.rules", [...currentRules, ""]);
  };

  const removeRule = (index: number) => {
    const currentRules = form.getValues("ownersAssociation.rules") || [];
    const newRules = currentRules.filter((_: any, i: number) => i !== index);
    form.setValue("ownersAssociation.rules", newRules);
  };

  const addService = () => {
    const currentServices = form.getValues("ownersAssociation.services") || [];
    form.setValue("ownersAssociation.services", [...currentServices, ""]);
  };

  const removeService = (index: number) => {
    const currentServices = form.getValues("ownersAssociation.services") || [];
    const newServices = currentServices.filter(
      (_: any, i: number) => i !== index
    );
    form.setValue("ownersAssociation.services", newServices);
  };

  const addManagementService = () => {
    const currentServices = form.getValues("managementCompany.services") || [];
    form.setValue("managementCompany.services", [...currentServices, ""]);
  };

  const removeManagementService = (index: number) => {
    const currentServices = form.getValues("managementCompany.services") || [];
    const newServices = currentServices.filter(
      (_: any, i: number) => i !== index
    );
    form.setValue("managementCompany.services", newServices);
  };

  const rules = form.watch("ownersAssociation.rules") || [];
  const services = form.watch("ownersAssociation.services") || [];
  const managementServices = form.watch("managementCompany.services") || [];

  return (
    <div className="space-y-6">
      {/* Owners Association Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            {language === "ar" ? "جمعية الملاك" : "Owners Association"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Association Required */}
          <div className="flex items-center space-x-2">
            <WizardFormField
              control={form.control}
              name="ownersAssociation.isRequired"
              render={({ field }) => (
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />
            <label className="text-sm font-medium">
              {language === "ar" ? "مطلوبة" : "Required"}
            </label>
          </div>

          {/* Monthly Fee */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <WizardFormField
              control={form.control}
              name="ownersAssociation.monthlyFee"
              label={language === "ar" ? "الرسوم الشهرية" : "Monthly Fee"}
              render={({ field }) => (
                <Input
                  {...field}
                  type="number"
                  min="0"
                  placeholder={
                    language === "ar" ? "الرسوم الشهرية" : "Monthly fee"
                  }
                  onChange={(e) =>
                    field.onChange(parseFloat(e.target.value) || 0)
                  }
                />
              )}
            />
            <WizardFormField
              control={form.control}
              name="ownersAssociation.currency"
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

          {/* Services */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-md font-semibold">
                {language === "ar" ? "الخدمات" : "Services"}
              </h4>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addService}
              >
                <Plus className="h-4 w-4 mr-2" />
                {language === "ar" ? "إضافة خدمة" : "Add Service"}
              </Button>
            </div>
            <div className="space-y-2">
              {services.map((service: string, index: number) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    value={service}
                    onChange={(e) => {
                      const newServices = [...services];
                      newServices[index] = e.target.value;
                      form.setValue("ownersAssociation.services", newServices);
                    }}
                    placeholder={
                      language === "ar"
                        ? "أدخل اسم الخدمة"
                        : "Enter service name"
                    }
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => removeService(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Rules */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-md font-semibold">
                {language === "ar"
                  ? "القوانين واللوائح"
                  : "Rules & Regulations"}
              </h4>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addRule}
              >
                <Plus className="h-4 w-4 mr-2" />
                {language === "ar" ? "إضافة قاعدة" : "Add Rule"}
              </Button>
            </div>
            <div className="space-y-2">
              {rules.map((rule: string, index: number) => (
                <div key={index} className="flex items-center gap-2">
                  <Textarea
                    value={rule}
                    onChange={(e) => {
                      const newRules = [...rules];
                      newRules[index] = e.target.value;
                      form.setValue("ownersAssociation.rules", newRules);
                    }}
                    placeholder={
                      language === "ar"
                        ? "أدخل القاعدة أو اللائحة"
                        : "Enter rule or regulation"
                    }
                    rows={2}
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => removeRule(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Management Company Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            {language === "ar" ? "شركة الإدارة" : "Management Company"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Company Name */}
          <WizardFormField
            control={form.control}
            name="managementCompany.name"
            label={language === "ar" ? "اسم الشركة" : "Company Name"}
            render={({ field }) => (
              <Input
                {...field}
                placeholder={
                  language === "ar"
                    ? "أدخل اسم شركة الإدارة"
                    : "Enter management company name"
                }
              />
            )}
          />

          {/* Contact Information */}
          <div className="space-y-4">
            <h4 className="text-md font-semibold">
              {language === "ar" ? "معلومات الاتصال" : "Contact Information"}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <WizardFormField
                control={form.control}
                name="managementCompany.contactInfo.phone"
                label={language === "ar" ? "رقم الهاتف" : "Phone Number"}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="tel"
                    placeholder={
                      language === "ar" ? "رقم الهاتف" : "Phone number"
                    }
                  />
                )}
              />
              <WizardFormField
                control={form.control}
                name="managementCompany.contactInfo.email"
                label={language === "ar" ? "البريد الإلكتروني" : "Email"}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="email"
                    placeholder={
                      language === "ar" ? "البريد الإلكتروني" : "Email address"
                    }
                  />
                )}
              />
            </div>
            <WizardFormField
              control={form.control}
              name="managementCompany.contactInfo.address"
              label={language === "ar" ? "العنوان" : "Address"}
              render={({ field }) => (
                <Textarea
                  {...field}
                  placeholder={
                    language === "ar" ? "عنوان الشركة" : "Company address"
                  }
                  rows={3}
                />
              )}
            />
          </div>

          {/* Management Services */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-md font-semibold">
                {language === "ar" ? "خدمات الإدارة" : "Management Services"}
              </h4>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addManagementService}
              >
                <Plus className="h-4 w-4 mr-2" />
                {language === "ar" ? "إضافة خدمة" : "Add Service"}
              </Button>
            </div>
            <div className="space-y-2">
              {managementServices.map((service: string, index: number) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    value={service}
                    onChange={(e) => {
                      const newServices = [...managementServices];
                      newServices[index] = e.target.value;
                      form.setValue("managementCompany.services", newServices);
                    }}
                    placeholder={
                      language === "ar"
                        ? "أدخل اسم الخدمة"
                        : "Enter service name"
                    }
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => removeManagementService(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StepAssociations;
