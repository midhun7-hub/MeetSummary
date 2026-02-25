import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Image as ImageIcon, X, UploadCloud } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ImageUpload = ({ onImagesChange }) => {
    const [files, setFiles] = useState([]);

    const onDrop = useCallback((acceptedFiles) => {
        const newFiles = acceptedFiles.map(file => Object.assign(file, {
            preview: URL.createObjectURL(file)
        }));

        const updatedFiles = [...files, ...newFiles].slice(0, 5); // Limit to 5 images
        setFiles(updatedFiles);
        onImagesChange(updatedFiles);
    }, [files, onImagesChange]);

    const removeFile = (fileToRemove) => {
        const updatedFiles = files.filter(file => file !== fileToRemove);
        setFiles(updatedFiles);
        onImagesChange(updatedFiles);
        URL.revokeObjectURL(fileToRemove.preview);
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.jpeg', '.jpg', '.png', '.webp'],
            'application/pdf': ['.pdf']
        },
        maxFiles: 5
    });

    return (
        <div className="w-full space-y-4">
            <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-xl p-8 transition-all cursor-pointer flex flex-col items-center justify-center gap-3
                    ${isDragActive ? 'border-primary bg-primary/5' : 'border-white/10 hover:border-primary/50 bg-dark/30'}`}
            >
                <input {...getInputProps()} />
                <div className="p-3 rounded-full bg-primary/10 text-primary">
                    <UploadCloud className="w-6 h-6" />
                </div>
                <div className="text-center">
                    <p className="text-sm font-medium text-white">
                        {isDragActive ? "Drop files here" : "Drag & drop photos or PDFs"}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                        PNG, JPG, PDF up to 5 files
                    </p>
                </div>
            </div>

            {/* Preview Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <AnimatePresence>
                    {files.map((file, index) => (
                        <motion.div
                            key={file.name + index}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="relative group aspect-square rounded-lg overflow-hidden border border-white/10 flex items-center justify-center bg-dark/50"
                        >
                            {file.type === 'application/pdf' ? (
                                <div className="flex flex-col items-center gap-2 text-gray-400">
                                    <FileText className="w-10 h-10 text-red-400" />
                                    <span className="text-[10px] uppercase font-bold tracking-wider">PDF Document</span>
                                </div>
                            ) : (
                                <img
                                    src={file.preview}
                                    alt="preview"
                                    className="w-full h-full object-cover"
                                />
                            )}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    removeFile(file);
                                }}
                                className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
                            >
                                <X className="w-3 h-3" />
                            </button>
                            <div className="absolute inset-x-0 bottom-0 bg-black/60 p-2 text-[10px] text-white truncate">
                                {file.name}
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default ImageUpload;
