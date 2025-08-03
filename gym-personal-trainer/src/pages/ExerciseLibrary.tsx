import React, { useState, useEffect } from 'react';
import {
  MagnifyingGlassIcon,
  HeartIcon,
  FunnelIcon,
  InformationCircleIcon,
  StarIcon,
  ClockIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid, StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import { Exercise } from '../types';
import { getExercises, getExercisesByBodyPart, searchExercises } from '../services/exerciseApi';
import { loadFavoriteExercises, saveFavoriteExercises } from '../utils/storage';
import MediaViewer from '../components/MediaViewer';

const ExerciseLibrary: React.FC = () => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [filteredExercises, setFilteredExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBodyPart, setSelectedBodyPart] = useState('all');
  const [selectedEquipment, setSelectedEquipment] = useState('all');
  const [favoriteExercises, setFavoriteExercises] = useState<string[]>([]);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const bodyParts = [
    { value: 'all', label: 'Tất cả' },
    { value: 'chest', label: 'Ngực' },
    { value: 'back', label: 'Lưng' },
    { value: 'legs', label: 'Chân' },
    { value: 'shoulders', label: 'Vai' },
    { value: 'arms', label: 'Tay' },
    { value: 'core', label: 'Bụng' },
  ];

  const equipmentTypes = [
    { value: 'all', label: 'Tất cả thiết bị' },
    { value: 'body weight', label: 'Tự do' },
    { value: 'dumbbell', label: 'Tạ đơn' },
    { value: 'barbell', label: 'Tạ kép' },
    { value: 'kettlebell', label: 'Kettlebell' },
    { value: 'cable', label: 'Cáp' },
    { value: 'machine', label: 'Máy tập' },
  ];

  useEffect(() => {
    loadExercises();
    setFavoriteExercises(loadFavoriteExercises());
  }, []);

  useEffect(() => {
    filterExercises();
  }, [exercises, searchQuery, selectedBodyPart, selectedEquipment]);

  const loadExercises = async () => {
    setLoading(true);
    try {
      const data = await getExercises(100);
      setExercises(data);
    } catch (error) {
      console.error('Error loading exercises:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterExercises = () => {
    let filtered = [...exercises];

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(exercise =>
        exercise.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exercise.target.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exercise.bodyPart.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by body part
    if (selectedBodyPart !== 'all') {
      filtered = filtered.filter(exercise => exercise.bodyPart === selectedBodyPart);
    }

    // Filter by equipment
    if (selectedEquipment !== 'all') {
      filtered = filtered.filter(exercise => exercise.equipment === selectedEquipment);
    }

    setFilteredExercises(filtered);
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.trim() && selectedBodyPart === 'all' && selectedEquipment === 'all') {
      setLoading(true);
      try {
        const searchResults = await searchExercises(query);
        setExercises(searchResults);
      } catch (error) {
        console.error('Error searching exercises:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const toggleFavorite = (exerciseId: string) => {
    const newFavorites = favoriteExercises.includes(exerciseId)
      ? favoriteExercises.filter(id => id !== exerciseId)
      : [...favoriteExercises, exerciseId];
    
    setFavoriteExercises(newFavorites);
    saveFavoriteExercises(newFavorites);
  };

  const formatExerciseName = (name: string) => {
    return name.split(' ').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' ');
  };

  const getBodyPartLabel = (bodyPart: string) => {
    const part = bodyParts.find(bp => bp.value === bodyPart);
    return part ? part.label : bodyPart;
  };

  const getEquipmentLabel = (equipment: string) => {
    const eq = equipmentTypes.find(et => et.value === equipment);
    return eq ? eq.label : equipment;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Thư viện bài tập
          </h1>
          <p className="mt-1 text-gray-600 dark:text-gray-400">
            Khám phá {filteredExercises.length} bài tập cho mọi nhóm cơ
          </p>
        </div>
        <div className="flex space-x-3 mt-4 sm:mt-0">
          <button
            onClick={() => window.location.href = '/exercises/new'}
            className="btn btn-primary inline-flex items-center"
          >
            <PlusIcon className="w-4 h-4 mr-2" />
            Tạo bài tập
          </button>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="btn btn-secondary inline-flex items-center"
          >
            <FunnelIcon className="w-4 h-4 mr-2" />
            Bộ lọc
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="card p-6">
        {/* Search Bar */}
        <div className="relative mb-4">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm bài tập..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
          />
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nhóm cơ
              </label>
              <select
                value={selectedBodyPart}
                onChange={(e) => setSelectedBodyPart(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
              >
                {bodyParts.map(part => (
                  <option key={part.value} value={part.value}>
                    {part.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Thiết bị
              </label>
              <select
                value={selectedEquipment}
                onChange={(e) => setSelectedEquipment(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
              >
                {equipmentTypes.map(equipment => (
                  <option key={equipment.value} value={equipment.value}>
                    {equipment.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Exercise Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Đang tải bài tập...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExercises.map((exercise) => (
            <div key={exercise.id} className="card overflow-hidden">
              {/* Exercise Media */}
              <div className="aspect-video bg-gray-200 dark:bg-gray-700 relative">
                {exercise.media && exercise.media.length > 0 ? (
                  <MediaViewer 
                    media={exercise.media} 
                    className="w-full h-full"
                    showControls={false}
                    autoPlay={false}
                  />
                ) : (
                  <img
                    src={exercise.gifUrl}
                    alt={exercise.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=Exercise';
                    }}
                  />
                )}
                
                {/* Action Buttons */}
                <div className="absolute top-2 right-2 flex space-x-2">
                  {exercise.difficulty && (
                    <div className="p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg">
                      {exercise.difficulty === 'beginner' ? (
                        <StarIcon className="h-4 w-4 text-green-500" />
                      ) : exercise.difficulty === 'intermediate' ? (
                        <div className="flex space-x-1">
                          <StarIconSolid className="h-4 w-4 text-yellow-500" />
                          <StarIcon className="h-4 w-4 text-yellow-500" />
                        </div>
                      ) : (
                        <div className="flex space-x-1">
                          <StarIconSolid className="h-4 w-4 text-red-500" />
                          <StarIconSolid className="h-4 w-4 text-red-500" />
                          <StarIconSolid className="h-4 w-4 text-red-500" />
                        </div>
                      )}
                    </div>
                  )}
                  <button
                    onClick={() => toggleFavorite(exercise.id)}
                    className="p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:shadow-xl transition-shadow duration-200"
                  >
                    {favoriteExercises.includes(exercise.id) ? (
                      <HeartIconSolid className="h-5 w-5 text-red-500" />
                    ) : (
                      <HeartIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                    )}
                  </button>
                </div>
                
                {/* Media Count Badge */}
                {exercise.media && exercise.media.length > 1 && (
                  <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                    {exercise.media.length} media
                  </div>
                )}
              </div>

              {/* Exercise Info */}
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  {formatExerciseName(exercise.name)}
                </h3>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Nhóm cơ:</span>
                    <span className="text-gray-900 dark:text-white font-medium">
                      {getBodyPartLabel(exercise.bodyPart)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Thiết bị:</span>
                    <span className="text-gray-900 dark:text-white font-medium">
                      {getEquipmentLabel(exercise.equipment)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Cơ chính:</span>
                    <span className="text-gray-900 dark:text-white font-medium">
                      {exercise.target}
                    </span>
                  </div>
                  {exercise.difficulty && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Độ khó:</span>
                      <span className={`font-medium px-2 py-1 rounded text-xs ${
                        exercise.difficulty === 'beginner' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                          : exercise.difficulty === 'intermediate'
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                          : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                      }`}>
                        {exercise.difficulty === 'beginner' ? 'Cơ bản' : 
                         exercise.difficulty === 'intermediate' ? 'Trung bình' : 'Nâng cao'}
                      </span>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => setSelectedExercise(exercise)}
                  className="w-full btn btn-primary inline-flex items-center justify-center"
                >
                  <InformationCircleIcon className="w-4 h-4 mr-2" />
                  Xem chi tiết
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* No results */}
      {!loading && filteredExercises.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <MagnifyingGlassIcon className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Không tìm thấy bài tập
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc
          </p>
        </div>
      )}

      {/* Exercise Detail Modal */}
      {selectedExercise && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatExerciseName(selectedExercise.name)}
                </h2>
                <button
                  onClick={() => setSelectedExercise(null)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="aspect-video bg-gray-200 dark:bg-gray-700 rounded-lg mb-6 overflow-hidden">
                {selectedExercise.media && selectedExercise.media.length > 0 ? (
                  <MediaViewer 
                    media={selectedExercise.media} 
                    className="w-full h-full"
                    showControls={true}
                    autoPlay={false}
                  />
                ) : (
                  <img
                    src={selectedExercise.gifUrl}
                    alt={selectedExercise.name}
                    className="w-full h-full object-cover rounded-lg"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=Exercise';
                    }}
                  />
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white mb-2">Thông tin</h3>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Nhóm cơ: </span>
                      <span className="text-gray-900 dark:text-white">
                        {getBodyPartLabel(selectedExercise.bodyPart)}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Thiết bị: </span>
                      <span className="text-gray-900 dark:text-white">
                        {getEquipmentLabel(selectedExercise.equipment)}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Cơ chính: </span>
                      <span className="text-gray-900 dark:text-white">
                        {selectedExercise.target}
                      </span>
                    </div>
                    {selectedExercise.difficulty && (
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">Độ khó: </span>
                        <span className={`font-medium px-2 py-1 rounded text-xs ${
                          selectedExercise.difficulty === 'beginner' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                            : selectedExercise.difficulty === 'intermediate'
                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                            : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                        }`}>
                          {selectedExercise.difficulty === 'beginner' ? 'Cơ bản' : 
                           selectedExercise.difficulty === 'intermediate' ? 'Trung bình' : 'Nâng cao'}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {selectedExercise.secondaryMuscles.length > 0 && (
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white mb-2">Cơ phụ</h3>
                    <div className="flex flex-wrap gap-1">
                      {selectedExercise.secondaryMuscles.map((muscle, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded"
                        >
                          {muscle}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {selectedExercise.instructions.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-medium text-gray-900 dark:text-white mb-3">Hướng dẫn</h3>
                  <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    {selectedExercise.instructions.map((instruction, index) => (
                      <li key={index}>{instruction}</li>
                    ))}
                  </ol>
                </div>
              )}

              {selectedExercise.tips && selectedExercise.tips.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-medium text-gray-900 dark:text-white mb-3">Mẹo thực hiện</h3>
                  <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    {selectedExercise.tips.map((tip, index) => (
                      <li key={index} className="flex items-start">
                        <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="mt-6 flex justify-end space-x-4">
                <button
                  onClick={() => toggleFavorite(selectedExercise.id)}
                  className={`btn ${favoriteExercises.includes(selectedExercise.id) 
                    ? 'btn-secondary' : 'btn-primary'} inline-flex items-center`}
                >
                  {favoriteExercises.includes(selectedExercise.id) ? (
                    <HeartIconSolid className="w-4 h-4 mr-2 text-red-500" />
                  ) : (
                    <HeartIcon className="w-4 h-4 mr-2" />
                  )}
                  {favoriteExercises.includes(selectedExercise.id) ? 'Đã yêu thích' : 'Yêu thích'}
                </button>
                <button
                  onClick={() => setSelectedExercise(null)}
                  className="btn btn-secondary"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExerciseLibrary;