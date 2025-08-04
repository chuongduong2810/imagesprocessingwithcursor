import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeftIcon,
  SaveIcon,
  PlusIcon,
  XMarkIcon,
  PhotoIcon,
  DocumentIcon,
  VideoCameraIcon,
  SpeakerWaveIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';
import { CreateAssignmentData, AssignmentType } from '../types';
import { AssignmentService } from '../services/assignmentService';

interface UploadedFile {
  file: File;
  preview?: string;
  type: 'image' | 'video' | 'gif' | 'document' | 'audio';
  description: string;
}

const AssignmentCreate: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<CreateAssignmentData>({
    title: '',
    description: '',
    trainerId: '1', // This should come from user context
    memberId: undefined,
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Default to 1 week from now
    type: 'Exercise',
    instructions: '',
    points: 10,
    isPublic: true
  });

  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const assignmentTypes: { value: AssignmentType; label: string; description: string }[] = [
    { value: 'Exercise', label: 'Tập luyện', description: 'Bài tập thể dục, luyện tập' },
    { value: 'Diet', label: 'Dinh dưỡng', description: 'Kế hoạch ăn uống, chế độ dinh dưỡng' },
    { value: 'Reading', label: 'Đọc hiểu', description: 'Tài liệu học tập, bài đọc' },
    { value: 'Video', label: 'Video', description: 'Video học tập, hướng dẫn' },
    { value: 'General', label: 'Tổng quát', description: 'Bài tập tổng quát khác' }
  ];

  const handleInputChange = (field: keyof CreateAssignmentData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      const fileType = getFileType(file.type);
      const newFile: UploadedFile = {
        file,
        type: fileType,
        description: ''
      };

      // Create preview for images
      if (fileType === 'image') {
        const reader = new FileReader();
        reader.onload = (e) => {
          newFile.preview = e.target?.result as string;
          setUploadedFiles(prev => [...prev, newFile]);
        };
        reader.readAsDataURL(file);
      } else {
        setUploadedFiles(prev => [...prev, newFile]);
      }
    });

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getFileType = (mimeType: string): UploadedFile['type'] => {
    if (mimeType.startsWith('image/gif')) return 'gif';
    if (mimeType.startsWith('image/')) return 'image';
    if (mimeType.startsWith('video/')) return 'video';
    if (mimeType.startsWith('audio/')) return 'audio';
    return 'document';
  };

  const getFileIcon = (type: UploadedFile['type']) => {
    switch (type) {
      case 'image':
      case 'gif':
        return <PhotoIcon className="h-8 w-8 text-green-500" />;
      case 'video':
        return <VideoCameraIcon className="h-8 w-8 text-red-500" />;
      case 'audio':
        return <SpeakerWaveIcon className="h-8 w-8 text-purple-500" />;
      default:
        return <DocumentIcon className="h-8 w-8 text-blue-500" />;
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const updateFileDescription = (index: number, description: string) => {
    setUploadedFiles(prev =>
      prev.map((file, i) => i === index ? { ...file, description } : file)
    );
  };

  const validateForm = (): boolean => {
    const newErrors: string[] = [];

    if (!formData.title.trim()) {
      newErrors.push('Tiêu đề bài tập là bắt buộc');
    }

    if (!formData.description.trim()) {
      newErrors.push('Mô tả bài tập là bắt buộc');
    }

    if (!formData.instructions.trim()) {
      newErrors.push('Hướng dẫn thực hiện là bắt buộc');
    }

    if (formData.points < 0) {
      newErrors.push('Điểm số phải lớn hơn hoặc bằng 0');
    }

    if (formData.dueDate <= new Date()) {
      newErrors.push('Hạn nộp phải trong tương lai');
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSaving(true);
    try {
      // Create assignment
      const assignment = await AssignmentService.createAssignment(formData);

      // Upload files if any
      if (uploadedFiles.length > 0) {
        const uploadPromises = uploadedFiles.map(uploadedFile =>
          AssignmentService.uploadAssignmentMedia(
            assignment.id,
            uploadedFile.file,
            uploadedFile.description
          )
        );

        await Promise.all(uploadPromises);
      }

      navigate(`/assignments/${assignment.id}`);
    } catch (error) {
      console.error('Error creating assignment:', error);
      setErrors(['Có lỗi xảy ra khi tạo bài tập. Vui lòng thử lại.']);
    } finally {
      setIsSaving(false);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-center mb-8">
        <button
          onClick={() => navigate('/assignments')}
          className="mr-4 p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
        >
          <ArrowLeftIcon className="h-6 w-6" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Tạo bài tập mới
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Tạo bài tập cho học viên với tài liệu đính kèm
          </p>
        </div>
      </div>

      {/* Error Messages */}
      {errors.length > 0 && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
          <div className="flex">
            <XMarkIcon className="h-5 w-5 text-red-400 mr-2 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                Có lỗi trong quá trình tạo bài tập:
              </h3>
              <ul className="mt-2 text-sm text-red-700 dark:text-red-300">
                {errors.map((error, index) => (
                  <li key={index}>• {error}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Thông tin cơ bản
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tiêu đề bài tập *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="Nhập tiêu đề bài tập..."
              />
            </div>

            {/* Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Loại bài tập *
              </label>
              <select
                value={formData.type}
                onChange={(e) => handleInputChange('type', e.target.value as AssignmentType)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                {assignmentTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Due Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Hạn nộp *
              </label>
              <input
                type="datetime-local"
                value={formData.dueDate.toISOString().slice(0, 16)}
                onChange={(e) => handleInputChange('dueDate', new Date(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>

            {/* Points */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Điểm số
              </label>
              <input
                type="number"
                min="0"
                value={formData.points}
                onChange={(e) => handleInputChange('points', parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>

            {/* Public */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isPublic"
                checked={formData.isPublic}
                onChange={(e) => handleInputChange('isPublic', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="isPublic" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                Công khai cho tất cả học viên
              </label>
            </div>
          </div>

          {/* Description */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Mô tả bài tập *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="Mô tả chi tiết về bài tập..."
            />
          </div>

          {/* Instructions */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Hướng dẫn thực hiện *
            </label>
            <textarea
              value={formData.instructions}
              onChange={(e) => handleInputChange('instructions', e.target.value)}
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="Hướng dẫn chi tiết cách thực hiện bài tập..."
            />
          </div>
        </div>

        {/* Media Upload */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Tài liệu đính kèm
          </h2>

          {/* Upload Button */}
          <div className="mb-6">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Thêm tệp
            </button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt"
              onChange={handleFileSelect}
              className="hidden"
            />
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Hỗ trợ: Hình ảnh, Video, GIF, Audio, PDF, DOC, TXT (tối đa 50MB/tệp)
            </p>
          </div>

          {/* Uploaded Files */}
          {uploadedFiles.length > 0 && (
            <div className="space-y-4">
              {uploadedFiles.map((uploadedFile, index) => (
                <div key={index} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                  <div className="flex items-start space-x-4">
                    {/* File Icon/Preview */}
                    <div className="flex-shrink-0">
                      {uploadedFile.preview ? (
                        <img
                          src={uploadedFile.preview}
                          alt={uploadedFile.file.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                          {getFileIcon(uploadedFile.type)}
                        </div>
                      )}
                    </div>

                    {/* File Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {uploadedFile.file.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {formatFileSize(uploadedFile.file.size)} • {uploadedFile.type}
                      </p>
                      
                      {/* Description Input */}
                      <div className="mt-2">
                        <input
                          type="text"
                          placeholder="Mô tả tệp (tùy chọn)"
                          value={uploadedFile.description}
                          onChange={(e) => updateFileDescription(index, e.target.value)}
                          className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                    </div>

                    {/* Remove Button */}
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <XMarkIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/assignments')}
            className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Hủy
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors inline-flex items-center"
          >
            {isSaving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Đang tạo...
              </>
            ) : (
              <>
                <SaveIcon className="h-5 w-5 mr-2" />
                Tạo bài tập
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AssignmentCreate;