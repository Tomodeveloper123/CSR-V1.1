import React, { useState, useRef } from 'react';
import { GoogleGenAI, Modality } from "@google/genai";
import UploadIcon from '../icons/UploadIcon';
import SparklesIcon from '../icons/SparklesIcon';

// Helper to convert data URL to base64
const dataUrlToBase64 = (dataUrl: string): { data: string, mimeType: string } => {
    const parts = dataUrl.split(',');
    const mimeType = parts[0].match(/:(.*?);/)?.[1] || 'application/octet-stream';
    return { data: parts[1], mimeType };
};

const ImageEditor: React.FC = () => {
    const [originalImage, setOriginalImage] = useState<string | null>(null);
    const [editedImage, setEditedImage] = useState<string | null>(null);
    const [prompt, setPrompt] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setEditedImage(null);
            setError(null);
            const reader = new FileReader();
            reader.onloadend = () => {
                setOriginalImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleGenerate = async () => {
        if (!originalImage || !prompt) {
            setError('Silakan unggah gambar dan masukkan prompt teks.');
            return;
        }

        setIsLoading(true);
        setError(null);
        setEditedImage(null);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const { data, mimeType } = dataUrlToBase64(originalImage);

            const imagePart = {
                inlineData: {
                    mimeType: mimeType,
                    data: data,
                },
            };
            const textPart = { text: prompt };

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash-image',
                contents: { parts: [imagePart, textPart] },
                config: {
                    responseModalities: [Modality.IMAGE],
                },
            });

            const generatedPart = response.candidates?.[0]?.content?.parts?.[0];
            if (generatedPart?.inlineData) {
                const base64ImageBytes = generatedPart.inlineData.data;
                const imageUrl = `data:${generatedPart.inlineData.mimeType};base64,${base64ImageBytes}`;
                setEditedImage(imageUrl);
            } else {
                throw new Error("Tidak ada gambar yang dihasilkan dalam respons.");
            }

        } catch (err) {
            console.error(err);
            const errorMessage = err instanceof Error ? err.message : 'Terjadi kesalahan yang tidak diketahui.';
            setError(`Gagal menghasilkan gambar: ${errorMessage}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800">Editor Gambar AI</h1>
            <p className="mt-2 text-gray-600 mb-8">
                Unggah gambar dan gunakan prompt teks untuk mengeditnya dengan Gemini.
            </p>

            <div className="bg-white p-8 rounded-lg shadow-md">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Input Side */}
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-700 mb-2">1. Unggah Gambar Anda</h3>
                            <div
                                className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 hover:bg-gray-50 transition-colors"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <input
                                    type="file"
                                    accept="image/png, image/jpeg, image/webp"
                                    ref={fileInputRef}
                                    onChange={handleImageUpload}
                                    className="hidden"
                                    aria-label="Upload an image"
                                />
                                {originalImage ? (
                                    <img src={originalImage} alt="Original" className="max-h-60 mx-auto rounded-md shadow-sm" />
                                ) : (
                                    <div className="flex flex-col items-center justify-center text-gray-500">
                                        <UploadIcon className="w-12 h-12 mb-2" />
                                        <span>Klik untuk memilih gambar</span>
                                        <span className="text-xs mt-1">(PNG, JPG, WEBP)</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold text-gray-700 mb-2">2. Masukkan Prompt Edit</h3>
                            <textarea
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                placeholder="Contoh: Tambahkan filter retro, hapus orang di latar belakang, ubah warna langit menjadi oranye..."
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                                rows={4}
                                disabled={isLoading}
                            />
                        </div>

                        <button
                            onClick={handleGenerate}
                            disabled={isLoading || !originalImage || !prompt}
                            className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Memproses...
                                </>
                            ) : (
                                <>
                                    <SparklesIcon />
                                    <span className="ml-2">Generate Gambar</span>
                                </>
                            )}
                        </button>
                    </div>

                    {/* Output Side */}
                    <div className="flex flex-col">
                         <h3 className="text-lg font-semibold text-gray-700 mb-2">Hasil Editan</h3>
                         <div className="flex-grow border-2 border-gray-200 bg-gray-50 rounded-lg flex items-center justify-center p-4">
                            {isLoading && (
                                <div className="text-center text-gray-500">
                                    <p>AI sedang bekerja...</p>
                                    <p className="text-sm mt-1">Ini mungkin memakan waktu beberapa saat.</p>
                                </div>
                            )}
                            {error && (
                                <div className="text-center text-red-600 bg-red-50 p-4 rounded-md">
                                    <p className="font-semibold">Oops! Terjadi kesalahan.</p>
                                    <p className="text-sm mt-1">{error}</p>
                                </div>
                            )}
                            {editedImage && !isLoading && (
                                <img src={editedImage} alt="Edited" className="max-h-96 mx-auto rounded-md shadow-sm" />
                            )}
                            {!isLoading && !editedImage && !error && (
                                <div className="text-center text-gray-400">
                                    <p>Gambar yang telah diedit akan muncul di sini.</p>
                                </div>
                            )}
                         </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ImageEditor;
