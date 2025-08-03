import React, { useState } from 'react';
import { ExerciseMedia } from '../types';
import MediaViewer from './MediaViewer';
import MediaUpload from './MediaUpload';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  EyeIcon,
  StarIcon,
  XMarkIcon,
  CheckIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

interface MediaManagerProps {
  media: ExerciseMedia[];
  onMediaUpdate: (media: ExerciseMedia[]) => void;
  className?: string;
}

export const MediaManager: React.FC<MediaManagerProps> = ({
  media,
  onMediaUpdate,
  className = ''
}) => {
  const [showUpload, setShowUpload] = useState(false);
  const [editingMedia, setEditingMedia] = useState<ExerciseMedia | null>(null);
  const [previewMedia, setPreviewMedia] = useState<ExerciseMedia | null>(null);
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    isPrimary: false
  });

  const handleAddMedia = (newMedia: Omit<ExerciseMedia, 'id'>) => {
    const mediaWithId: ExerciseMedia = {
      ...newMedia,
      id: `media_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };
    
    const updatedMedia = [...media, mediaWithId];
    onMediaUpdate(updatedMedia);
    setShowUpload(false);
  };

  const handleDeleteMedia = (mediaId: string) => {
    const updatedMedia = media.filter(item => item.id !== mediaId);
    onMediaUpdate(updatedMedia);
  };

  const handleMoveMedia = (mediaId: string, direction: 'up' | 'down') => {
    const currentIndex = media.findIndex(item => item.id === mediaId);
    if (currentIndex === -1) return;

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= media.length) return;

    const updatedMedia = [...media];
    [updatedMedia[currentIndex], updatedMedia[newIndex]] = [updatedMedia[newIndex], updatedMedia[currentIndex]];
    onMediaUpdate(updatedMedia);
  };

  const handleSetPrimary = (mediaId: string) => {
    const updatedMedia = media.map(item => ({
      ...item,
      isPrimary: item.id === mediaId
    }));
    onMediaUpdate(updatedMedia);
  };

  const startEditing = (mediaItem: ExerciseMedia) => {
    setEditingMedia(mediaItem);
    setEditForm({
      title: mediaItem.title || '',
      description: mediaItem.description || '',
      isPrimary: mediaItem.isPrimary || false
    });
  };

  const saveEdit = () => {
    if (!editingMedia) return;

    const updatedMedia = media.map(item => 
      item.id === editingMedia.id 
        ? {
            ...item,
            title: editForm.title,
            description: editForm.description,
            isPrimary: editForm.isPrimary
          }
        : {
            ...item,
            isPrimary: editForm.isPrimary ? false : item.isPrimary
          }
    );
    
    onMediaUpdate(updatedMedia);
    setEditingMedia(null);
  };

  const cancelEdit = () => {
    setEditingMedia(null);
    setEditForm({ title: '', description: '', isPrimary: false });
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          Quản lý Media ({media.length})
        </h3>
        <button
          onClick={() => setShowUpload(!showUpload)}
          className="btn btn-primary inline-flex items-center"
        >
          <PlusIcon className="w-4 h-4 mr-2" />
          Thêm Media
        </button>
      </div>

      {/* Upload Section */}
      {showUpload && (
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium text-gray-900 dark:text-white">
              Thêm Media Mới
            </h4>
            <button
              onClick={() => setShowUpload(false)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
          <MediaUpload onMediaAdded={handleAddMedia} />
        </div>
      )}

      {/* Media List */}
      {media.length > 0 ? (
        <div className="space-y-4">
          {media.map((mediaItem, index) => (
            <div
              key={mediaItem.id}
              className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
            >
              <div className="flex items-start space-x-4">
                {/* Media Thumbnail */}
                <div className="flex-shrink-0 w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                  <img
                    src={mediaItem.thumbnail || mediaItem.url}
                    alt={mediaItem.title || 'Media'}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://via.placeholder.com/96x96?text=${mediaItem.type.toUpperCase()}`;
                    }}
                  />
                </div>

                {/* Media Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className={`px-2 py-1 text-xs rounded ${
                          mediaItem.type === 'video' 
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
                            : mediaItem.type === 'gif'
                            ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400'
                            : 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                        }`}>
                          {mediaItem.type.toUpperCase()}
                        </span>
                        
                        {mediaItem.isPrimary && (
                          <span className="inline-flex items-center px-2 py-1 bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400 text-xs rounded">
                            <StarIconSolid className="w-3 h-3 mr-1" />
                            Chính
                          </span>
                        )}
                      </div>

                      <h4 className="font-medium text-gray-900 dark:text-white truncate">
                        {mediaItem.title || 'Không có tiêu đề'}
                      </h4>
                      
                      {mediaItem.description && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                          {mediaItem.description}
                        </p>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={() => setPreviewMedia(mediaItem)}
                        className="p-1 text-gray-400 hover:text-blue-500 transition-colors"
                        title="Xem trước"
                      >
                        <EyeIcon className="w-4 h-4" />
                      </button>
                      
                      <button
                        onClick={() => startEditing(mediaItem)}
                        className="p-1 text-gray-400 hover:text-yellow-500 transition-colors"
                        title="Chỉnh sửa"
                      >
                        <PencilIcon className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleSetPrimary(mediaItem.id)}
                        className={`p-1 transition-colors ${
                          mediaItem.isPrimary 
                            ? 'text-yellow-500' 
                            : 'text-gray-400 hover:text-yellow-500'
                        }`}
                        title="Đặt làm media chính"
                      >
                        <StarIcon className="w-4 h-4" />
                      </button>

                      <div className="flex flex-col space-y-1">
                        <button
                          onClick={() => handleMoveMedia(mediaItem.id, 'up')}
                          disabled={index === 0}
                          className="p-1 text-gray-400 hover:text-green-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Di chuyển lên"
                        >
                          <ArrowUpIcon className="w-3 h-3" />
                        </button>
                        
                        <button
                          onClick={() => handleMoveMedia(mediaItem.id, 'down')}
                          disabled={index === media.length - 1}
                          className="p-1 text-gray-400 hover:text-green-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Di chuyển xuống"
                        >
                          <ArrowDownIcon className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => handleDeleteMedia(mediaItem.id)}
                        className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                        title="Xóa"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
          <p className="text-gray-500 dark:text-gray-400">
            Chưa có media nào. Nhấn "Thêm Media" để bắt đầu.
          </p>
        </div>
      )}

      {/* Edit Modal */}
      {editingMedia && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Chỉnh sửa Media
              </h3>
              <button
                onClick={cancelEdit}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Tiêu đề
                </label>
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Nhập tiêu đề..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Mô tả
                </label>
                <textarea
                  value={editForm.description}
                  onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Nhập mô tả..."
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isPrimary"
                  checked={editForm.isPrimary}
                  onChange={(e) => setEditForm(prev => ({ ...prev, isPrimary: e.target.checked }))}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="isPrimary" className="ml-2 block text-sm text-gray-900 dark:text-white">
                  Đặt làm media chính
                </label>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={cancelEdit}
                className="btn btn-secondary"
              >
                Hủy
              </button>
              <button
                onClick={saveEdit}
                className="btn btn-primary inline-flex items-center"
              >
                <CheckIcon className="w-4 h-4 mr-2" />
                Lưu
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {previewMedia && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Xem trước Media
                </h3>
                <button
                  onClick={() => setPreviewMedia(null)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>

              <div className="aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden mb-4">
                <MediaViewer 
                  media={[previewMedia]} 
                  className="w-full h-full"
                  showControls={true}
                />
              </div>

              <button
                onClick={() => setPreviewMedia(null)}
                className="w-full btn btn-secondary"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaManager;