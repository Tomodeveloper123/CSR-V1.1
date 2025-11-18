import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";
import UploadIcon from '../icons/UploadIcon';
import MovieIcon from '../icons/MovieIcon';

// Helper to convert data URL to a base64 string
const dataUrlToBase64 = (dataUrl: string): string => {
    return dataUrl.split(',')[1];
};

const loadingMessages = [
    "Memulai mesin generasi video...",
    "Menganalisis gambar awal...",
    "Merender frame demi frame...",
    "Menambahkan sentuhan sinematik...",
    "Hampir selesai, menyusun video akhir...",
    "Proses ini mungkin memakan waktu beberapa menit...",
];

const VideoGenerator: React.FC = () => {
    const [sourceImage, setSourceImage] = useState<string | null>(null);
    const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [loadingMessage, setLoadingMessage] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('16:9');
    const [apiKeySelected, setApiKeySelected] = useState<boolean>(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Check for API key on component mount
    useEffect(() => {
        const checkApiKey = async () => {
            if (window.aistudio && typeof window.aistudio.hasSelectedApiKey === 'function') {
                const hasKey = await window.aistudio.hasSelectedApiKey();
                setApiKeySelected(hasKey);
            }
        };
        checkApiKey();
    }, []);

    // Update loading message periodically
    useEffect(() => {
        let interval: number;
        if (isLoading) {
            let messageIndex = 0;
            setLoadingMessage(loadingMessages[messageIndex]);
            interval = window.setInterval(() => {
                messageIndex = (messageIndex + 1) % loadingMessages.length;
                setLoadingMessage(loadingMessages[messageIndex]);
            }, 5000);
        }
        return () => clearInterval(interval);
    }, [isLoading]);

    const handleSelectKey = async () => {
        if (window.aistudio && typeof window.aistudio.openSelectKey === 'function') {
            await window.aistudio.openSelectKey();
            // Optimistically assume the user selected a key
            setApiKeySelected(true);
        }
    };
    
    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setGeneratedVideoUrl(null);
            setError(null);
            const reader = new FileReader();
            reader.onloadend = () => {
                setSourceImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleGenerate = async () => {
        if (!sourceImage) {
            setError('Silakan unggah gambar terlebih dahulu.');
            return;
        }

        setIsLoading(true);
        setError(null);
        setGeneratedVideoUrl(null);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const base64Data = dataUrlToBase64(sourceImage);

            let operation = await ai.models.generateVideos({
                model: 'veo-3.1-fast-generate-preview',
                image: {
                    imageBytes: base64Data,
                    mimeType: sourceImage.substring(sourceImage.indexOf(':') + 1, sourceImage.indexOf(';')),
                },
                config: {
                    numberOfVideos: 1,
                    resolution: '720p',
                    aspectRatio: aspectRatio,
                }
            });

            while (!operation.done) {
                await new Promise(resolve => setTimeout(resolve, 10000));
                operation = await ai.operations.getVideosOperation({ operation: operation });
            }

            if (operation.error) {
                 throw new Error(operation.error.message || 'Operasi gagal tanpa pesan spesifik.');
            }

            const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
            if (!downloadLink) {
                throw new Error("Tidak ada tautan unduhan video yang dihasilkan.");
            }
            
            const videoResponse = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
            if (!videoResponse.ok) {
                throw new Error(`Gagal mengunduh video: ${videoResponse.statusText}`);
            }
            const videoBlob = await videoResponse.blob();
            const videoUrl = URL.createObjectURL(videoBlob);
            setGeneratedVideoUrl(videoUrl);

        } catch (err) {
            console.error(err);
            const errorMessage = err instanceof Error ? err.message : 'Terjadi kesalahan yang tidak diketahui.';
             if (errorMessage.includes("Requested entity was not found.")) {
                setError("Kunci API tidak valid atau tidak ditemukan. Silakan pilih kunci API yang valid.");
                setApiKeySelected(false); // Reset key state
            } else {
                setError(`Gagal menghasilkan video: ${errorMessage}`);
            }
        } finally {
            setIsLoading(false);
        }
    };
    
    if (!apiKeySelected) {
        return (
             <div className="bg-white p-8 rounded-lg shadow-md text-center">
                 <h1 className="text-2xl font-bold text-gray-800">Kunci API Diperlukan</h1>
                 <p className="mt-4 text-gray-600">
                    Untuk menggunakan fitur pembuatan video Veo, Anda harus memilih kunci API dari project Google Cloud Anda.
                 </p>
                 <p className="mt-2 text-sm text-gray-500">
                    Pastikan penagihan diaktifkan untuk project Anda. Pelajari lebih lanjut di{' '}
                    <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        Dokumentasi Penagihan
                    </a>.
                 </p>
                 <button
                    onClick={handleSelectKey}
                    className="mt-6 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    Pilih Kunci API
                </button>
             </div>
        )
    }

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800">Generator Video AI dengan Veo</h1>
            <p className="mt-2 text-gray-600 mb-8">
                Unggah gambar untuk menganimasikannya menjadi video pendek menggunakan Veo.
            </p>

            {isLoading && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex flex-col items-center justify-center z-50 text-white">
                    <svg className="animate-spin h-12 w-12 text-white mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p className="text-xl font-semibold">Video Anda sedang dibuat...</p>
                    <p className="mt-2 text-gray-300">{loadingMessage}</p>
                </div>
            )}

            <div className="bg-white p-8 rounded-lg shadow-md">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Input Side */}
                     <div className="space-y-6">
                         <div>
                            <h3 className="text-lg font-semibold text-gray-700 mb-2">1. Unggah Gambar Awal</h3>
                             <div
                                className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 hover:bg-gray-50 transition-colors"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <input type="file" accept="image/png, image/jpeg, image/webp" ref={fileInputRef} onChange={handleImageUpload} className="hidden" />
                                {sourceImage ? (
                                    <img src={sourceImage} alt="Source" className="max-h-60 mx-auto rounded-md shadow-sm" />
                                ) : (
                                    <div className="flex flex-col items-center justify-center text-gray-500">
                                        <UploadIcon className="w-12 h-12 mb-2" />
                                        <span>Klik untuk memilih gambar</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div>
                             <h3 className="text-lg font-semibold text-gray-700 mb-2">2. Pilih Rasio Aspek</h3>
                             <div className="flex space-x-4">
                                 <button onClick={() => setAspectRatio('16:9')} className={`px-4 py-2 rounded-md border-2 ${aspectRatio === '16:9' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}>16:9 (Landscape)</button>
                                 <button onClick={() => setAspectRatio('9:16')} className={`px-4 py-2 rounded-md border-2 ${aspectRatio === '9:16' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}>9:16 (Portrait)</button>
                             </div>
                        </div>

                        <button
                            onClick={handleGenerate}
                            disabled={isLoading || !sourceImage}
                            className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            <MovieIcon/>
                            <span className="ml-2">Generate Video</span>
                        </button>
                    </div>
                     {/* Output Side */}
                    <div className="flex flex-col">
                         <h3 className="text-lg font-semibold text-gray-700 mb-2">Hasil Video</h3>
                         <div className="flex-grow border-2 border-gray-200 bg-gray-50 rounded-lg flex items-center justify-center p-4">
                            {error && (
                                <div className="text-center text-red-600 bg-red-50 p-4 rounded-md">
                                    <p className="font-semibold">Oops! Terjadi kesalahan.</p>
                                    <p className="text-sm mt-1">{error}</p>
                                </div>
                            )}
                            {generatedVideoUrl && !isLoading && (
                                <video src={generatedVideoUrl} controls autoPlay loop className="max-w-full max-h-96 rounded-md shadow-sm" />
                            )}
                            {!isLoading && !generatedVideoUrl && !error && (
                                <div className="text-center text-gray-400">
                                    <p>Video yang dihasilkan akan muncul di sini.</p>
                                </div>
                            )}
                         </div>
                    </div>
                 </div>
            </div>
        </div>
    );
};

export default VideoGenerator;
