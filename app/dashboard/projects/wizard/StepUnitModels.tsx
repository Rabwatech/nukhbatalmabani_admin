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
import { LayoutDashboard, Plus, Trash2, Edit3, DollarSign } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";

const StepUnitModels: React.FC<StepProps> = ({
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
        name: "unitModels",
    });

    const addUnitModel = () => {
        append({
            id: `model-${Date.now()}`,
            name: "",
            type: "repetitive",
            unitType: "apartment",
            rooms: 0,
            area: 0,
            basePrice: 0,
            features: [], // Simple array of strings
            floorPricing: [],
            attachments: {},
            directions: [],
        });
        setEditingIndex(fields.length);
    };

    const removeUnitModel = (index: number) => {
        remove(index);
        if (editingIndex === index) {
            setEditingIndex(null);
        }
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <LayoutDashboard className="h-5 w-5" />
                        {language === "ar" ? "نماذج الوحدات" : "Unit Models"}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-6">
                        <div className="space-y-4">
                            {fields.map((field, index) => (
                                <Card key={field.id} className="border-2 border-stone-gray/10">
                                    <CardHeader className="pb-3 bg-stone-gray/5">
                                        <div className="flex items-center justify-between">
                                            <CardTitle className="text-lg">
                                                {language === "ar"
                                                    ? `نموذج ${index + 1}`
                                                    : `Model ${index + 1}`}
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
                                                        removeUnitModel(index);
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
                                                        name={`unitModels.${index}.name`}
                                                        label={language === "ar" ? "اسم النموذج" : "Model Name"}
                                                        render={({ field }) => (
                                                            <Input {...field} placeholder={language === "ar" ? "مثال: نموذج A" : "e.g. Model A"} />
                                                        )}
                                                    />
                                                    <WizardFormField
                                                        control={form.control}
                                                        name={`unitModels.${index}.type`}
                                                        label={language === "ar" ? "التصنيف" : "Classification"}
                                                        render={({ field }) => (
                                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                                <SelectTrigger>
                                                                    <SelectValue />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectItem value="retail">{language === "ar" ? "تجاري (Retail)" : "Retail"}</SelectItem>
                                                                    <SelectItem value="mezzanine">{language === "ar" ? "ميزانين" : "Mezzanine"}</SelectItem>
                                                                    <SelectItem value="repetitive">{language === "ar" ? "متكرر" : "Repetitive"}</SelectItem>
                                                                    <SelectItem value="annex">{language === "ar" ? "ملحق" : "Annex"}</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                        )}
                                                    />
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                    <WizardFormField
                                                        control={form.control}
                                                        name={`unitModels.${index}.unitType`}
                                                        label={language === "ar" ? "نوع الوحدة" : "Unit Type"}
                                                        render={({ field }) => (
                                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                                <SelectTrigger>
                                                                    <SelectValue />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectItem value="apartment">{language === "ar" ? "شقة" : "Apartment"}</SelectItem>
                                                                    <SelectItem value="office">{language === "ar" ? "مكتب" : "Office"}</SelectItem>
                                                                    <SelectItem value="twin">{language === "ar" ? "توين" : "Twin"}</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                        )}
                                                    />
                                                    <WizardFormField
                                                        control={form.control}
                                                        name={`unitModels.${index}.rooms`}
                                                        label={language === "ar" ? "عدد الغرف" : "Rooms"}
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
                                                        name={`unitModels.${index}.area`}
                                                        label={language === "ar" ? "المساحة (م²)" : "Area (m²)"}
                                                        render={({ field }) => (
                                                            <Input
                                                                {...field}
                                                                type="number"
                                                                onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                                            />
                                                        )}
                                                    />
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <WizardFormField
                                                        control={form.control}
                                                        name={`unitModels.${index}.basePrice`}
                                                        label={language === "ar" ? "السعر الأساسي" : "Base Price"}
                                                        render={({ field }) => (
                                                            <div className="relative">
                                                                <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                                                <Input
                                                                    {...field}
                                                                    type="number"
                                                                    className="pl-9"
                                                                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                                                />
                                                            </div>
                                                        )}
                                                    />
                                                    {/* Features textarea similar to basic info */}
                                                    <WizardFormField
                                                        control={form.control}
                                                        name={`unitModels.${index}.features`}
                                                        label={language === "ar" ? "مميزات النموذج" : "Model Features"}
                                                        render={({ field }) => (
                                                            <Input
                                                                {...field}
                                                                value={Array.isArray(field.value) ? field.value.join(', ') : field.value}
                                                                onChange={(e) => field.onChange(e.target.value.split(',').map((s: string) => s.trim()))}
                                                                placeholder={language === "ar" ? "أدخل المميزات مفصولة بفاصلة" : "Enter features separated by comma"}
                                                            />
                                                        )}
                                                    />
                                                </div>

                                            </>
                                        ) : (
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                <div>
                                                    <span className="text-xs text-elegant-white/50 block">{language === "ar" ? "اسم النموذج" : "Model Name"}</span>
                                                    <span className="text-sm font-medium text-elegant-white">{form.watch(`unitModels.${index}.name`)}</span>
                                                </div>
                                                <div>
                                                    <span className="text-xs text-elegant-white/50 block">{language === "ar" ? "النوع" : "Type"}</span>
                                                    <Badge variant="outline" className="mt-1">
                                                        {form.watch(`unitModels.${index}.type`)}
                                                    </Badge>
                                                </div>
                                                <div>
                                                    <span className="text-xs text-elegant-white/50 block">{language === "ar" ? "السعر الأساسي" : "Base Price"}</span>
                                                    <span className="text-sm font-bold text-desert-gold">{form.watch(`unitModels.${index}.basePrice`)}</span>
                                                </div>
                                                <div>
                                                    <span className="text-xs text-elegant-white/50 block">{language === "ar" ? "المساحة" : "Area"}</span>
                                                    <span className="text-sm font-medium text-elegant-white">{form.watch(`unitModels.${index}.area`)} m²</span>
                                                </div>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            ))}

                            <Button
                                type="button"
                                variant="outline"
                                onClick={addUnitModel}
                                className="w-full border-dashed p-6 h-auto"
                            >
                                <Plus className="h-5 w-5 mr-2" />
                                {language === "ar" ? "إضافة نموذج وحدة جديد" : "Add New Unit Model"}
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default StepUnitModels;
