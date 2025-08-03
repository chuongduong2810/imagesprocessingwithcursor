import React, { useState, useRef } from 'react';
import { ExerciseMedia } from '../types';
import {
  CloudArrowUpIcon,
  PhotoIcon,
  VideoCameraIcon,
  XMarkIcon,
  CheckIcon
} from '@heroicons/react/24/outline';

interface MediaUploadProps {
  onMediaAdded: (media: Omit<ExerciseMedia, 'id'>) => void;
  maxFileSize?: number; // MB
  allowedTypes?: string[];
  className?: string;
}

export const MediaUpload: React.FC<MediaUploadProps> = ({
  onMediaAdded,
  maxFileSize = 50, // 50MB default
  allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'video/mp4', 'video/webm'],
  className = ''
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [previewType, setPreviewType] = useState<'image' | 'video' | 'gif' | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [mediaTitle, setMediaTitle] = useState('');
  const [mediaDescription, setMediaDescription] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    // Check file type
    if (!allowedTypes.includes(file.type)) {
      return `Loại file không được hỗ trợ. Chỉ chấp nhận: ${allowedTypes.join(', ')}`;
    }

    // Check file size
    if (file.size > maxFileSize * 1024 * 1024) {
      return `File quá lớn. Kích thước tối đa: ${maxFileSize}MB`;
    }

    return null;
  };

  const getMediaType = (file: File): ExerciseMedia['type'] => {
    if (file.type.startsWith('video/')) return 'video';
    if (file.type === 'image/gif') return 'gif';
    return 'image';
  };

  const handleFile = async (file: File) => {
    setError(null);
    
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setUploading(true);

    try {
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);
      setPreviewType(getMediaType(file));

      // In a real app, you would upload to a server/cloud storage here
      // For now, we'll simulate an upload and use the blob URL
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate upload

      const mediaType = getMediaType(file);
      const newMedia: Omit<ExerciseMedia, 'id'> = {
        type: mediaType,
        url: previewUrl, // In production, this would be the uploaded file URL
        title: mediaTitle || file.name,
        description: mediaDescription,
        isPrimary: false
      };

      // For video files, create a thumbnail
      if (mediaType === 'video') {
        const thumbnail = await createVideoThumbnail(file);
        newMedia.thumbnail = thumbnail;
      }

      onMediaAdded(newMedia);
      
      // Reset form
      setPreview(null);
      setPreviewType(null);
      setMediaTitle('');
      setMediaDescription('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
    } catch (err) {
      setError('Lỗi khi tải file lên. Vui lòng thử lại.');
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
    }
  };

  const createVideoThumbnail = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      video.onloadedmetadata = () => {
        video.currentTime = 1; // Capture frame at 1 second
      };

      video.onseeked = () => {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx?.drawImage(video, 0, 0);
        const thumbnail = canvas.toDataURL('image/jpeg', 0.8);
        resolve(thumbnail);
      };

      video.onerror = () => {
        reject(new Error('Could not create video thumbnail'));
      };

      video.src = URL.createObjectURL(file);
      video.muted = true;
      video.playsInline = true;
    });
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const clearPreview = () => {
    setPreview(null);
    setPreviewType(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 transition-colors ${
          dragActive
            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          accept={allowedTypes.join(',')}
          onChange={handleInputChange}
          disabled={uploading}
        />
        
        <div className="text-center">
          {uploading ? (
            <div className="space-y-2">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Đang tải lên...</p>
            </div>
          ) : (
            <div className="space-y-2">
              <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
              <div className="flex text-sm text-gray-600 dark:text-gray-400">
                <label className="relative cursor-pointer bg-white dark:bg-gray-800 rounded-md font-medium text-primary-600 hover:text-primary-500">
                  <span>Tải file lên</span>
                </label>
                <p className="pl-1">hoặc kéo thả vào đây</p>
              </div>
              <p className="text-xs text-gray-500">
                PNG, JPG, GIF, MP4, WEBM tối đa {maxFileSize}MB
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* Preview */}
      {preview && previewType && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Xem trước
            </h3>
            <button
              onClick={clearPreview}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>

          <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
            <div className="aspect-video bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
              {previewType === 'video' ? (
                <video
                  src={preview}
                  className="w-full h-full object-cover"
                  controls
                  muted
                />
              ) : (
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              )}
            </div>
          </div>

          {/* Media Details Form */}
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Tiêu đề
              </label>
              <input
                type="text"
                value={mediaTitle}
                onChange={(e) => setMediaTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                placeholder="Nhập tiêu đề cho media này..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Mô tả
              </label>
              <textarea
                value={mediaDescription}
                onChange={(e) => setMediaDescription(e.target.value)}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                placeholder="Mô tả về media này..."
              />
            </div>

            <button
              onClick={() => preview && handleFile(new File([], mediaTitle || 'media'))}
              disabled={uploading}
              className="w-full btn btn-primary inline-flex items-center justify-center"
            >
              <CheckIcon className="w-4 h-4 mr-2" />
              Thêm Media
            </button>
          </div>
        </div>
      )}

      {/* Supported Formats */}
      <div className="text-xs text-gray-500 space-y-1">
        <div className="flex items-center space-x-2">
          <PhotoIcon className="h-4 w-4" />
          <span>Hình ảnh: JPEG, PNG, GIF</span>
        </div>
        <div className="flex items-center space-x-2">
          <VideoCameraIcon className="h-4 w-4" />
          <span>Video: MP4, WebM</span>
        </div>
      </div>
    </div>
  );
};

export default MediaUpload;