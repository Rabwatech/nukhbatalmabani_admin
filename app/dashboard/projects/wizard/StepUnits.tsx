"use client";

import React, { useState } from "react";
import { useFormContext, useFieldArray } from "react-hook-form";
import { useDirection } from "@/context/DirectionContext";
import { StepProps } from "./types";
import WizardFormField from "@/components/shared/WizardFormField";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Home, Plus, Trash2, Edit3, DollarSign, Copy } from "lucide-react";

const StepUnits: React.FC<StepProps> = ({
  data,
  onUpdate,
  onNext,
  onPrevious,
}) => {
  const { language } = useDirection();
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const form = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "units.units",
  });

  const buildings = data.buildings?.buildings || [];
  const unitModels = data.unitModels || [];

  const addUnit = () => {
    append({
      id: `unit-${Date.now()}`,
      unitNumber: "",
      buildingId: "",
      modelId: "",
      floor: 1,
      status: "available",
      price: 0,
    });
    setEditingIndex(fields.length);
  };

  const removeUnit = (index: number) => {
    remove(index);
    if (editingIndex === index) {
      setEditingIndex(null);
    }
  };

  const getBuildingModels = (buildingId: string) => {
    const building = buildings.find((b: any) => b.id === buildingId);
    if (!building || !building.models) return [];
    return unitModels.filter((m: any) => building.models.includes(m.id));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Home className="h-5 w-5" />
            {language === "ar" ? "إدارة الوحدات" : "Units Inventory"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="space-y-4">
              {fields.map((unit, index) => {
                const currentBuildingId = form.watch(`units.units.${index}.buildingId`);
                const availableModels = getBuildingModels(currentBuildingId);

                return (
                  <Card key={unit.id} className="border-2 border-stone-gray/10">
                    <CardHeader className="pb-3 bg-stone-gray/5">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">
                          {language === "ar"
                            ? `الوحدة ${index + 1}`
                            : `Unit ${index + 1}`}
                        </CardTitle>
                        <div className="flex gap-2">
                          {editingIndex === index ? (
                            <Button
                              type="button"
                              size="sm"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setEditingIndex(null);
                              }}
                            >
                              {language === "ar" ? "حفظ" : "Save"}
                            </Button>
                          ) : (
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setEditingIndex(index);
                              }}
                            >
                              <Edit3 className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            type="button"
                            size="sm"
                            variant="destructive"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              removeUnit(index);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-4">
                      {editingIndex === index ? (
                        <>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <WizardFormField
                              control={form.control}
                              name={`units.units.${index}.unitNumber`}
                              label={language === "ar" ? "رقم الوحدة" : "Unit Number"}
                              render={({ field }) => (
                                <Input {...field} placeholder={language === "ar" ? "مثال: 101" : "e.g. 101"} />
                              )}
                            />
                            <WizardFormField
                              control={form.control}
                              name={`units.units.${index}.status`}
                              label={language === "ar" ? "الحالة" : "Status"}
                              render={({ field }) => (
                                <Select onValueChange={field.onChange} value={field.value}>
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="available">{language === "ar" ? "متاح" : "Available"}</SelectItem>
                                    <SelectItem value="sold">{language === "ar" ? "مباع" : "Sold"}</SelectItem>
                                    <SelectItem value="reserved">{language === "ar" ? "محجوز" : "Reserved"}</SelectItem>
                                  </SelectContent>
                                </Select>
                              )}
                            />
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <WizardFormField
                              control={form.control}
                              name={`units.units.${index}.buildingId`}
                              label={language === "ar" ? "المبنى" : "Building"}
                              render={({ field }) => (
                                <Select
                                  onValueChange={(val) => {
                                    field.onChange(val);
                                    form.setValue(`units.units.${index}.modelId`, ""); // Reset model when building changes
                                  }}
                                  value={field.value}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder={language === "ar" ? "اختر المبنى" : "Select Building"} />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {buildings.map((b: any) => (
                                      <SelectItem key={b.id} value={b.id}>
                                        {language === "ar" && b.nameAr ? b.nameAr : `Building ${b.number}`}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              )}
                            />
                            <WizardFormField
                              control={form.control}
                              name={`units.units.${index}.modelId`}
                              label={language === "ar" ? "نموذج الوحدة" : "Unit Model"}
                              render={({ field }) => (
                                <Select
                                  onValueChange={(val) => {
                                    field.onChange(val);
                                    // Auto-fill price from model base price if price is 0
                                    const model = unitModels.find((m: any) => m.id === val);
                                    const currentPrice = form.getValues(`units.units.${index}.price`);
                                    if (model && (!currentPrice || currentPrice === 0)) {
                                      form.setValue(`units.units.${index}.price`, model.basePrice);
                                    }
                                  }}
                                  value={field.value}
                                  disabled={!currentBuildingId}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder={language === "ar" ? "اختر النموذج" : "Select Model"} />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {availableModels.length === 0 ? (
                                      <SelectItem value="none" disabled>
                                        {language === "ar" ? "لا توجد نماذج لهذا المبنى" : "No models for this building"}
                                      </SelectItem>
                                    ) : (
                                      availableModels.map((m: any) => (
                                        <SelectItem key={m.id} value={m.id}>
                                          {m.name}
                                        </SelectItem>
                                      ))
                                    )}
                                  </SelectContent>
                                </Select>
                              )}
                            />
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <WizardFormField
                              control={form.control}
                              name={`units.units.${index}.floor`}
                              label={language === "ar" ? "الطابق" : "Floor"}
                              render={({ field }) => (
                                <Input
                                  {...field}
                                  type="number"
                                  onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                />
                              )}
                            />
                            <WizardFormField
                              control={form.control}
                              name={`units.units.${index}.price`}
                              label={language === "ar" ? "السعر" : "Price"}
                              render={({ field }) => (
                                <Input
                                  {...field}
                                  type="number"
                                  onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                />
                              )}
                            />
                          </div>
                        </>
                      ) : (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div>
                            <span className="text-xs text-elegant-white/50 block">{language === "ar" ? "رقم الوحدة" : "Unit No."}</span>
                            <span className="text-sm font-medium text-elegant-white">{form.watch(`units.units.${index}.unitNumber`)}</span>
                          </div>
                          <div>
                            <span className="text-xs text-elegant-white/50 block">{language === "ar" ? "المبنى" : "Building"}</span>
                            <span className="text-sm font-medium text-elegant-white">
                              {(() => {
                                const b = buildings.find((b: any) => b.id === form.watch(`units.units.${index}.buildingId`));
                                return b ? (language === "ar" && b.nameAr ? b.nameAr : `Building ${b.number}`) : '-';
                              })()}
                            </span>
                          </div>
                          <div>
                            <span className="text-xs text-elegant-white/50 block">{language === "ar" ? "النموذج" : "Model"}</span>
                            <span className="text-sm font-medium text-elegant-white">
                              {unitModels.find((m: any) => m.id === form.watch(`units.units.${index}.modelId`))?.name || '-'}
                            </span>
                          </div>
                          <div>
                            <span className="text-xs text-elegant-white/50 block">{language === "ar" ? "السعر" : "Price"}</span>
                            <span className="text-sm font-medium text-elegant-white">
                              {form.watch(`units.units.${index}.price`)?.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}

              <Button
                type="button"
                variant="outline"
                onClick={addUnit}
                className="w-full border-dashed p-6 h-auto"
              >
                <Plus className="h-5 w-5 mr-2" />
                {language === "ar" ? "إضافة وحدة جديدة" : "Add New Unit"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StepUnits;
