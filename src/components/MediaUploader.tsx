"use client";

import { useState } from 'react';

interface MediaUploaderProps {
    onMediaSelected: (file: File | string) => void;
    contentType: 'image' | 'video';
}

export default function MediaUploader({ onMediaSelected, contentType }: MediaUploaderProps) {
    const [mediaUrl, setMediaUrl] = useState('');
    const [preview, setPreview] = useState('');
    const [fileName, setFileName] = useState('');
    const [fileSize, setFileSize] = useState('');

    const isImage = contentType === 'image';
    const acceptTypes = isImage ? 'image/*' : 'video/*';
    const fileTypeLabel = isImage ? 'Imagem' : 'Vídeo';
    const maxSizeMB = isImage ? 12 : 100; // Limite maior para vídeos
    const maxSizeBytes = maxSizeMB * 1024 * 1024;

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const url = e.target.value;
        setMediaUrl(url);
        if (url) {
            setPreview(url);
            setFileName(isImage ? 'Imagem URL' : 'Vídeo URL');
            onMediaSelected(url);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];

            // Check file size
            if (file.size > maxSizeBytes) {
                alert(`Arquivo muito grande! Máximo: ${maxSizeMB}MB. Seu arquivo: ${formatFileSize(file.size)}`);
                return;
            }

            setFileName(file.name);
            setFileSize(formatFileSize(file.size));

            // Create preview URL
            const reader = new FileReader();
            reader.onload = (ev) => {
                if (ev.target?.result) {
                    setPreview(ev.target.result as string);
                }
            };
            reader.readAsDataURL(file);

            // Pass file object to parent
            onMediaSelected(file);
        }
    };

    return (
        <div className="w-full p-8 border-2 border-dashed border-white/30 rounded-2xl text-center hover:border-purple-400 transition-all bg-white/10 backdrop-blur-sm">
            <div className="space-y-6">
                <div className="flex items-center justify-center gap-2 text-white font-semibold text-lg">
                    {isImage ? (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    ) : (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    )}
                    Escolha uma {fileTypeLabel}
                </div>

                {preview ? (
                    <div className="relative w-full max-w-2xl mx-auto overflow-hidden rounded-2xl shadow-2xl border-2 border-white/30 bg-black">
                        {isImage ? (
                            <img src={preview} alt="Preview" className="object-contain w-full max-h-96" />
                        ) : (
                            <video src={preview} className="object-contain w-full max-h-96" controls />
                        )}
                        <div className="absolute top-3 right-3 flex gap-2">
                            {fileName && (
                                <div className="bg-blue-500/80 text-white px-3 py-2 rounded-lg text-xs font-medium backdrop-blur-sm">
                                    {fileName}
                                </div>
                            )}
                            <button
                                onClick={() => { setPreview(''); setMediaUrl(''); setFileName(''); setFileSize(''); onMediaSelected(''); }}
                                className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-all shadow-lg hover:scale-110"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        {fileSize && (
                            <div className="absolute bottom-3 left-3 bg-gray-900/80 text-white px-3 py-2 rounded-lg text-xs font-medium backdrop-blur-sm">
                                {fileSize}
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="py-12 flex flex-col gap-6 items-center">
                        <label className="cursor-pointer bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl hover:shadow-2xl hover:scale-105 transition-all font-medium flex items-center gap-3">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                            Fazer Upload
                            <input
                                type="file"
                                accept={acceptTypes}
                                className="hidden"
                                onChange={handleFileChange}
                            />
                        </label>

                        <div className="text-white/70 text-sm">
                            <p className="font-medium">Tamanho máximo: {maxSizeMB}MB</p>
                        </div>

                        <span className="text-white/70 text-sm font-medium">OU</span>

                        <div className="w-full max-w-md">
                            <input
                                type="text"
                                placeholder={`Cole a URL da ${fileTypeLabel.toLowerCase()}...`}
                                className="w-full p-4 border-2 border-white/30 rounded-xl bg-white/10 backdrop-blur-sm text-white placeholder-white/50 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50 transition"
                                value={mediaUrl}
                                onChange={handleUrlChange}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
