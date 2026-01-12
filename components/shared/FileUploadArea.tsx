"use client";

import React, { useState, useCallback } from "react";
import { useDirection } from "@/context/DirectionContext";
import { Button } from "@/components/ui/button";
import { Image, Video, FileText, Upload, X } from "lucide-react";

interface FileUploadAreaProps {
    files: File[];
    onFilesSelected: (files: File[]) => void;
    onFileRemove: (index: number) => void;
    accept: string;
    multiple?: boolean;
    label?: string;
    maxSizeMB?: number;
}

const FileUploadArea: React.FC<FileUploadAreaProps> = ({
    files = [],
    onFilesSelected,
    onFileRemove,
    accept,
    multiple = true,
    label,
    maxSizeMB = 10,
}) => {
    const { language } = useDirection();
    const [dragActive, setDragActive] = useState(false);

    const handleDrag = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    }, []);

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            e.stopPropagation();
            setDragActive(false);

            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                const droppedFiles = Array.from(e.dataTransfer.files);
                onFilesSelected(droppedFiles);
            }
        },
        [onFilesSelected]
    );

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const selectedFiles = Array.from(e.target.files);
            onFilesSelected(selectedFiles);
        }
    };

    return (
        <div className="space-y-4">
            {label && <label className="text-sm font-medium">{label}</label>}
            <div
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${dragActive
                        ? "border-desert-gold bg-desert-gold/5 shadow-lg shadow-desert-gold/10"
                        : "border-stone-gray/30 hover:border-desert-gold/50 hover:bg-desert-gold/5"
                    }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
            >
                <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-desert-gold/20 flex items-center justify-center">
                        <Upload className="h-8 w-8 text-desert-gold" />
                    </div>
                    <div className="text-center">
                        <p className="text-sm font-medium text-elegant-white mb-1">
                            {language === "ar"
                                ? "اسحب الملفات هنا أو انقر للرفع"
                                : "Drag files here or click to upload"}
                        </p>
                        <p className="text-xs text-elegant-white/60">
                            {accept === "image/*"
                                ? language === "ar"
                                    ? `PNG, JPG, JPEG حتى ${maxSizeMB}MB`
                                    : `PNG, JPG, JPEG up to ${maxSizeMB}MB`
                                : accept === "video/*"
                                    ? language === "ar"
                                        ? `MP4, MOV, AVI حتى ${maxSizeMB}MB`
                                        : `MP4, MOV, AVI up to ${maxSizeMB}MB`
                                    : accept === ".pdf"
                                        ? language === "ar"
                                            ? `ملفات PDF حتى ${maxSizeMB}MB`
                                            : `PDF files up to ${maxSizeMB}MB`
                                        : language === "ar"
                                            ? "جميع أنواع الملفات المدعومة"
                                            : "All supported file types"}
                        </p>
                    </div>
                </div>

                <input
                    type="file"
                    accept={accept}
                    multiple={multiple}
                    onChange={handleFileChange}
                    className="hidden"
                    id={`file-upload-${label?.replace(/\s/g, "-") || Math.random()}`}
                />
                <label
                    htmlFor={`file-upload-${label?.replace(/\s/g, "-") || Math.random()}`}
                    className="mt-4 inline-flex items-center gap-2 px-6 py-3 bg-desert-gold/20 hover:bg-desert-gold/30 text-desert-gold rounded-xl font-medium cursor-pointer transition-all duration-200 hover:scale-105"
                >
                    <Upload className="w-4 h-4" />
                    {language === "ar" ? "اختر الملفات" : "Choose Files"}
                </label>
            </div>

            {files.length > 0 && (
                <div className="space-y-3">
                    <div className="flex items-center gap-2 mb-3">
                        <div className="w-1 h-4 bg-desert-gold rounded-full"></div>
                        <span className="text-sm font-medium text-elegant-white">
                            {language === "ar" ? "الملفات المرفوعة" : "Uploaded Files"} (
                            {files.length})
                        </span>
                    </div>
                    {files.map((file: File, index: number) => (
                        <div
                            key={index}
                            className="group flex items-center justify-between p-4 bg-stone-gray/10 hover:bg-stone-gray/20 rounded-xl border border-stone-gray/20 hover:border-desert-gold/30 transition-all duration-200"
                        >
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                                <div className="flex-shrink-0">
                                    {file.type.startsWith("image/") ? (
                                        <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                                            <Image className="h-5 w-5 text-blue-400" />
                                        </div>
                                    ) : file.type.startsWith("video/") ? (
                                        <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
                                            <Video className="h-5 w-5 text-red-400" />
                                        </div>
                                    ) : (
                                        <div className="w-10 h-10 rounded-lg bg-stone-gray/20 flex items-center justify-center">
                                            <FileText className="h-5 w-5 text-stone-gray" />
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-elegant-white truncate">
                                        {file.name}
                                    </p>
                                    <p className="text-xs text-elegant-white/60">
                                        {(file.size / 1024 / 1024).toFixed(2)} MB
                                    </p>
                                </div>
                            </div>
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => onFileRemove(index)}
                                className="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/20 hover:text-red-400"
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default FileUploadArea;
