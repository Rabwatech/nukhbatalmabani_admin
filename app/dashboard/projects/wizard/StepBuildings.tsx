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
import { Building2, Plus, Trash2, Edit3, Check } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

const StepBuildings: React.FC<StepProps> = ({
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
    name: "buildings.buildings",
  });

  const addBuilding = () => {
    append({
      id: `building-${Date.now()}`,
      number: "",
      nameAr: "",
      floors: 1,
      totalUnits: 1,
      landPieceId: "",
      models: [],
    });
    setEditingIndex(fields.length);
  };

  const removeBuilding = (index: number) => {
    remove(index);
    if (editingIndex === index) {
      setEditingIndex(null);
    }
  };

  const landPieces = data.landPieces || [];
  const unitModels = data.unitModels || [];

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
          <div className="space-y-6">
            <div className="space-y-4">
              {fields.map((building, index) => (
                <Card key={building.id} className="border-2 border-stone-gray/10">
                  <CardHeader className="pb-3 bg-stone-gray/5">
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
                            onClick={() => setEditingIndex(null)}
                          >
                            {language === "ar" ? "حفظ" : "Save"}
                          </Button>
                        ) : (
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => setEditingIndex(index)}
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
                  <CardContent className="space-y-4 pt-4">
                    {editingIndex === index ? (
                      <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <WizardFormField
                            control={form.control}
                            name={`buildings.buildings.${index}.number`}
                            label={language === "ar" ? "رقم المبنى" : "Building Number"}
                            render={({ field }) => (
                              <Input {...field} placeholder={language === "ar" ? "مثال: 1" : "e.g. 1"} />
                            )}
                          />
                          <WizardFormField
                            control={form.control}
                            name={`buildings.buildings.${index}.nameAr`}
                            label={language === "ar" ? "اسم المبنى (اختياري)" : "Building Name (Optional)"}
                            render={({ field }) => (
                              <Input {...field} placeholder={language === "ar" ? "أدخل اسم المبنى" : "Enter building name"} />
                            )}
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <WizardFormField
                            control={form.control}
                            name={`buildings.buildings.${index}.landPieceId`}
                            label={language === "ar" ? "قطعة الأرض" : "Land Piece"}
                            render={({ field }) => (
                              <Select onValueChange={field.onChange} value={field.value || ""}>
                                <SelectTrigger>
                                  <SelectValue placeholder={language === "ar" ? "اختر قطعة الأرض" : "Select Land Piece"} />
                                </SelectTrigger>
                                <SelectContent>
                                  {landPieces.map((lp: any) => (
                                    <SelectItem key={lp.id} value={lp.id}>
                                      {lp.pieceNumber} {lp.deedNumber ? `(${lp.deedNumber})` : ''}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            )}
                          />
                          <div className="grid grid-cols-2 gap-4">
                            <WizardFormField
                              control={form.control}
                              name={`buildings.buildings.${index}.floors`}
                              label={language === "ar" ? "عدد الطوابق" : "Floors"}
                              render={({ field }) => (
                                <Input
                                  {...field}
                                  type="number"
                                  onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                                />
                              )}
                            />
                            <WizardFormField
                              control={form.control}
                              name={`buildings.buildings.${index}.totalUnits`}
                              label={language === "ar" ? "إجمالي الوحدات" : "Total Units"}
                              render={({ field }) => (
                                <Input
                                  {...field}
                                  type="number"
                                  onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                                />
                              )}
                            />
                          </div>
                        </div>

                        <div>
                          <Label className="mb-2 block">{language === "ar" ? "نماذج الوحدات في هذا المبنى" : "Unit Models in This Building"}</Label>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 border p-4 rounded-md">
                            {unitModels.length === 0 && (
                              <p className="text-sm text-muted-foreground col-span-3">
                                {language === "ar" ? "لا توجد نماذج مضافة، الرجاء إضافة نماذج أولاً." : "No models added, please add models first."}
                              </p>
                            )}
                            {unitModels.map((model: any) => {
                              const currentModels = form.watch(`buildings.buildings.${index}.models`) || [];
                              const isChecked = currentModels.includes(model.id);
                              return (
                                <div key={model.id} className="flex items-center space-x-2 space-x-reverse">
                                  <Checkbox
                                    id={`model-${index}-${model.id}`}
                                    checked={isChecked}
                                    onCheckedChange={(checked) => {
                                      if (checked) {
                                        form.setValue(`buildings.buildings.${index}.models`, [...currentModels, model.id]);
                                      } else {
                                        form.setValue(`buildings.buildings.${index}.models`, currentModels.filter((id: string) => id !== model.id));
                                      }
                                    }}
                                  />
                                  <Label htmlFor={`model-${index}-${model.id}`} className="text-sm font-normal cursor-pointer">
                                    {model.name}
                                  </Label>
                                </div>
                              )
                            })}
                          </div>
                        </div>

                      </>
                    ) : (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <span className="text-xs text-elegant-white/50 block">{language === "ar" ? "رقم المبني" : "Building No."}</span>
                          <span className="text-sm font-medium text-elegant-white">{form.watch(`buildings.buildings.${index}.number`)}</span>
                        </div>
                        <div>
                          <span className="text-xs text-elegant-white/50 block">{language === "ar" ? "قطعة الأرض" : "Land Piece"}</span>
                          <span className="text-sm font-medium text-elegant-white">
                            {landPieces.find((p: any) => p.id === form.watch(`buildings.buildings.${index}.landPieceId`))?.pieceNumber || '-'}
                          </span>
                        </div>
                        <div>
                          <span className="text-xs text-elegant-white/50 block">{language === "ar" ? "عدد الوحدات" : "Total Units"}</span>
                          <span className="text-sm font-medium text-elegant-white">{form.watch(`buildings.buildings.${index}.totalUnits`)}</span>
                        </div>
                        <div>
                          <span className="text-xs text-elegant-white/50 block">{language === "ar" ? "النماذج" : "Models"}</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {(form.watch(`buildings.buildings.${index}.models`) || []).map((mId: string) => {
                              const m = unitModels.find((mod: any) => mod.id === mId);
                              return m ? <Badge key={mId} variant="secondary" className="text-[10px]">{m.name}</Badge> : null;
                            })}
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}

              <Button
                type="button"
                variant="outline"
                onClick={addBuilding}
                className="w-full border-dashed p-6 h-auto"
              >
                <Plus className="h-5 w-5 mr-2" />
                {language === "ar" ? "إضافة مبنى جديد" : "Add New Building"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StepBuildings;
