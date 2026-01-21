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
import { MapPin, Plus, Trash2, Edit3, Upload } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const StepLandPieces: React.FC<StepProps> = ({
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
        name: "landPieces",
    });

    const addLandPiece = () => {
        append({
            id: `land-${Date.now()}`,
            pieceNumber: "",
            deedNumber: "",
            type: "residential",
            area: 0,
            buildingCount: 0,
            attachments: {},
        });
        setEditingIndex(fields.length);
    };

    const removeLandPiece = (index: number) => {
        remove(index);
        if (editingIndex === index) {
            setEditingIndex(null);
        } else if (editingIndex && editingIndex > index) {
            setEditingIndex(editingIndex - 1);
        }
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <MapPin className="h-5 w-5" />
                        {language === "ar" ? "قطع الأراضي" : "Land Pieces"}
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
                                                    ? `قطعة أرض ${index + 1}`
                                                    : `Land Piece ${index + 1}`}
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
                                                        removeLandPiece(index);
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
                                                        name={`landPieces.${index}.pieceNumber`}
                                                        label={language === "ar" ? "رقم القطعة" : "Piece Number"}
                                                        render={({ field }) => (
                                                            <Input {...field} placeholder={language === "ar" ? "مثال: 123" : "e.g. 123"} />
                                                        )}
                                                    />
                                                    <WizardFormField
                                                        control={form.control}
                                                        name={`landPieces.${index}.deedNumber`}
                                                        label={language === "ar" ? "رقم الصك" : "Deed Number"}
                                                        render={({ field }) => (
                                                            <Input {...field} placeholder={language === "ar" ? "مثال: 456789" : "e.g. 456789"} />
                                                        )}
                                                    />
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                    <WizardFormField
                                                        control={form.control}
                                                        name={`landPieces.${index}.type`}
                                                        label={language === "ar" ? "النوع" : "Type"}
                                                        render={({ field }) => (
                                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                                <SelectTrigger>
                                                                    <SelectValue />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectItem value="residential">{language === "ar" ? "سكني" : "Residential"}</SelectItem>
                                                                    <SelectItem value="commercial">{language === "ar" ? "تجاري" : "Commercial"}</SelectItem>
                                                                    <SelectItem value="mixed">{language === "ar" ? "مختلط" : "Mixed"}</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                        )}
                                                    />
                                                    <WizardFormField
                                                        control={form.control}
                                                        name={`landPieces.${index}.area`}
                                                        label={language === "ar" ? "المساحة (م²)" : "Area (m²)"}
                                                        render={({ field }) => (
                                                            <Input
                                                                {...field}
                                                                type="number"
                                                                onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                                            />
                                                        )}
                                                    />
                                                    <WizardFormField
                                                        control={form.control}
                                                        name={`landPieces.${index}.buildingCount`}
                                                        label={language === "ar" ? "عدد المباني" : "Building Count"}
                                                        render={({ field }) => (
                                                            <Input
                                                                {...field}
                                                                type="number"
                                                                onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                                            />
                                                        )}
                                                    />
                                                </div>

                                                {/* Attachments Placeholder */}
                                                <div className="p-4 border border-dashed rounded-lg bg-stone-gray/5">
                                                    <p className="text-sm font-medium mb-2 text-elegant-white/70">
                                                        {language === "ar" ? "المرفقات (الصك، الرخص، الخ)" : "Attachments (Deed, Licenses, etc.)"}
                                                    </p>
                                                    <Button variant="outline" size="sm" type="button" className="gap-2">
                                                        <Upload className="w-4 h-4" />
                                                        {language === "ar" ? "رفع ملفات" : "Upload Files"}
                                                    </Button>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                <div>
                                                    <span className="text-xs text-elegant-white/50 block">{language === "ar" ? "رقم القطعة" : "Piece No."}</span>
                                                    <span className="text-sm font-medium text-elegant-white">{form.watch(`landPieces.${index}.pieceNumber`)}</span>
                                                </div>
                                                <div>
                                                    <span className="text-xs text-elegant-white/50 block">{language === "ar" ? "رقم الصك" : "Deed No."}</span>
                                                    <span className="text-sm font-medium text-elegant-white">{form.watch(`landPieces.${index}.deedNumber`)}</span>
                                                </div>
                                                <div>
                                                    <span className="text-xs text-elegant-white/50 block">{language === "ar" ? "النوع" : "Type"}</span>
                                                    <Badge variant="outline" className="mt-1">
                                                        {form.watch(`landPieces.${index}.type`)}
                                                    </Badge>
                                                </div>
                                                <div>
                                                    <span className="text-xs text-elegant-white/50 block">{language === "ar" ? "المساحة" : "Area"}</span>
                                                    <span className="text-sm font-medium text-elegant-white">{form.watch(`landPieces.${index}.area`)} m²</span>
                                                </div>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            ))}

                            <Button
                                type="button"
                                variant="outline"
                                onClick={addLandPiece}
                                className="w-full border-dashed p-6 h-auto"
                            >
                                <Plus className="h-5 w-5 mr-2" />
                                {language === "ar" ? "إضافة قطعة أرض جديدة" : "Add New Land Piece"}
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default StepLandPieces;
