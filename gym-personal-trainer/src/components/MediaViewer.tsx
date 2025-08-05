import {
  ArrowLeftIcon,
  ArrowRightIcon,
  PauseIcon,
  PlayIcon,
  SpeakerWaveIcon,
  SpeakerXMarkIcon
} from '@heroicons/react/24/outline';
import React, { useState } from 'react';
import { ExerciseMedia } from '../types';

interface MediaViewerProps {
  media: ExerciseMedia[];
  className?: string;
  showControls?: boolean;
  autoPlay?: boolean;
}

export const MediaViewer: React.FC<MediaViewerProps> = ({ 
  media, 
  className = '', 
  showControls = true,
  autoPlay = false 
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isMuted, setIsMuted] = useState(false);

  if (!media || media.length === 0) {
    return (
      <div className={`bg-gray-200 dark:bg-gray-700 flex items-center justify-center ${className}`}>
        <p className="text-gray-500 dark:text-gray-400">Không có media</p>
      </div>
    );
  }

  const currentMedia = media[currentIndex];
  const hasMultipleMedia = media.length > 1;

  const nextMedia = () => {
    setCurrentIndex((prev) => (prev + 1) % media.length);
  };

  const prevMedia = () => {
    setCurrentIndex((prev) => (prev - 1 + media.length) % media.length);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const renderMedia = () => {
    switch (currentMedia.type) {
      case 'video':
        return (
          <video
            className="w-full h-full object-cover"
            controls={showControls}
            autoPlay={isPlaying}
            muted={isMuted}
            loop
            poster={currentMedia.thumbnail}
            onError={(e) => {
              console.error('Video loading error:', e);
            }}
          >
            <source src={currentMedia.url} type="video/mp4" />
            <source src={currentMedia.url} type="video/webm" />
            Trình duyệt của bạn không hỗ trợ video.
          </video>
        );
      
      case 'gif':
        return (
          <img
            src={currentMedia.url}
            alt={currentMedia.title || 'Exercise GIF'}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://placehold.co/600x400';
            }}
          />
        );
      
      case 'image':
      default:
        return (
          <img
            src={currentMedia.url}
            alt={currentMedia.title || 'Exercise Image'}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://placehold.co/600x400';
            }}
          />
        );
    }
  };

  return (
    <div className={`relative group ${className}`}>
      {/* Media Display */}
      <div className="relative w-full h-full">
        {renderMedia()}
        
        {/* Media Navigation Arrows */}
        {hasMultipleMedia && (
          <>
            <button
              onClick={prevMedia}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            >
              <ArrowLeftIcon className="h-4 w-4" />
            </button>
            <button
              onClick={nextMedia}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            >
              <ArrowRightIcon className="h-4 w-4" />
            </button>
          </>
        )}

        {/* Video Controls Overlay */}
        {currentMedia.type === 'video' && showControls && (
          <div className="absolute bottom-2 left-2 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button
              onClick={togglePlay}
              className="bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full p-2"
            >
              {isPlaying ? (
                <PauseIcon className="h-4 w-4" />
              ) : (
                <PlayIcon className="h-4 w-4" />
              )}
            </button>
            <button
              onClick={toggleMute}
              className="bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full p-2"
            >
              {isMuted ? (
                <SpeakerXMarkIcon className="h-4 w-4" />
              ) : (
                <SpeakerWaveIcon className="h-4 w-4" />
              )}
            </button>
          </div>
        )}

        {/* Media Type Badge */}
        <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
          {currentMedia.type.toUpperCase()}
        </div>

        {/* Media Counter */}
        {hasMultipleMedia && (
          <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
            {currentIndex + 1} / {media.length}
          </div>
        )}
      </div>

      {/* Media Thumbnails */}
      {hasMultipleMedia && (
        <div className="flex space-x-2 mt-2 overflow-x-auto">
          {media.map((item, index) => (
            <button
              key={item.id}
              onClick={() => setCurrentIndex(index)}
              className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-border ${
                index === currentIndex
                  ? 'border-primary-500'
                  : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
              }`}
            >
              <img
                src={item.thumbnail || item.url}
                alt={item.title || `Media ${index + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://placehold.co/600x400';
                }}
              />
            </button>
          ))}
        </div>
      )}

      {/* Media Title and Description */}
      {(currentMedia.title || currentMedia.description) && (
        <div className="mt-2">
          {currentMedia.title && (
            <h4 className="font-medium text-gray-900 dark:text-white">
              {currentMedia.title}
            </h4>
          )}
          {currentMedia.description && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {currentMedia.description}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default MediaViewer;