import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeftIcon, 
  SaveIcon, 
  EyeIcon,
  PlusIcon,
  MinusIcon
} from '@heroicons/react/24/outline';
import { Exercise, ExerciseMedia } from '../types';
import MediaManager from '../components/MediaManager';
import MediaViewer from '../components/MediaViewer';

interface ExerciseFormData {
  name: string;
  bodyPart: string;
  equipment: string;
  target: string;
  secondaryMuscles: string[];
  instructions: string[];
  tips: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  media: ExerciseMedia[];
}

const ExerciseEditor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [formData, setFormData] = useState<ExerciseFormData>({
    name: '',
    bodyPart: 'chest',
    equipment: 'body weight',
    target: '',
    secondaryMuscles: [],
    instructions: [''],
    tips: [''],
    difficulty: 'beginner',
    media: []
  });

  const [showPreview, setShowPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [newSecondaryMuscle, setNewSecondaryMuscle] = useState('');

  const bodyParts = [
    { value: 'chest', label: 'Ngực' },
    { value: 'back', label: 'Lưng' },
    { value: 'legs', label: 'Chân' },
    { value: 'shoulders', label: 'Vai' },
    { value: 'arms', label: 'Tay' },
    { value: 'core', label: 'Bụng' },
  ];

  const equipmentTypes = [
    { value: 'body weight', label: 'Tự do' },
    { value: 'dumbbell', label: 'Tạ đơn' },
    { value: 'barbell', label: 'Tạ kép' },
    { value: 'kettlebell', label: 'Kettlebell' },
    { value: 'cable', label: 'Cáp' },
    { value: 'machine', label: 'Máy tập' },
  ];

  const difficulties = [
    { value: 'beginner', label: 'Cơ bản', color: 'text-green-600' },
    { value: 'intermediate', label: 'Trung bình', color: 'text-yellow-600' },
    { value: 'advanced', label: 'Nâng cao', color: 'text-red-600' },
  ];

  useEffect(() => {
    if (isEditing) {
      // In a real app, load exercise data from API
      // For now, we'll simulate loading data
      loadExerciseData(id);
    }
  }, [id, isEditing]);

  const loadExerciseData = async (exerciseId: string) => {
    // Simulate API call
    try {
      // This would be replaced with actual API call
      // const exercise = await getExerciseById(exerciseId);
      // setFormData(exercise);
      console.log('Loading exercise:', exerciseId);
    } catch (error) {
      console.error('Error loading exercise:', error);
    }
  };

  const handleInputChange = (field: keyof ExerciseFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleInstructionChange = (index: number, value: string) => {
    const newInstructions = [...formData.instructions];
    newInstructions[index] = value;
    setFormData(prev => ({ ...prev, instructions: newInstructions }));
  };

  const addInstruction = () => {
    setFormData(prev => ({ 
      ...prev, 
      instructions: [...prev.instructions, ''] 
    }));
  };

  const removeInstruction = (index: number) => {
    if (formData.instructions.length > 1) {
      const newInstructions = formData.instructions.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, instructions: newInstructions }));
    }
  };

  const handleTipChange = (index: number, value: string) => {
    const newTips = [...formData.tips];
    newTips[index] = value;
    setFormData(prev => ({ ...prev, tips: newTips }));
  };

  const addTip = () => {
    setFormData(prev => ({ 
      ...prev, 
      tips: [...prev.tips, ''] 
    }));
  };

  const removeTip = (index: number) => {
    if (formData.tips.length > 1) {
      const newTips = formData.tips.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, tips: newTips }));
    }
  };

  const addSecondaryMuscle = () => {
    if (newSecondaryMuscle.trim() && !formData.secondaryMuscles.includes(newSecondaryMuscle.trim())) {
      setFormData(prev => ({
        ...prev,
        secondaryMuscles: [...prev.secondaryMuscles, newSecondaryMuscle.trim()]
      }));
      setNewSecondaryMuscle('');
    }
  };

  const removeSecondaryMuscle = (muscle: string) => {
    setFormData(prev => ({
      ...prev,
      secondaryMuscles: prev.secondaryMuscles.filter(m => m !== muscle)
    }));
  };

  const handleMediaUpdate = (media: ExerciseMedia[]) => {
    setFormData(prev => ({ ...prev, media }));
  };

  const validateForm = (): string[] => {
    const errors: string[] = [];
    
    if (!formData.name.trim()) errors.push('Tên bài tập là bắt buộc');
    if (!formData.target.trim()) errors.push('Cơ chính là bắt buộc');
    if (formData.instructions.some(inst => !inst.trim())) errors.push('Tất cả hướng dẫn phải có nội dung');
    
    return errors;
  };

  const handleSave = async () => {
    const errors = validateForm();
    if (errors.length > 0) {
      alert('Vui lòng sửa các lỗi sau:\n' + errors.join('\n'));
      return;
    }

    setIsSaving(true);
    try {
      // Filter out empty instructions and tips
      const cleanedData = {
        ...formData,
        instructions: formData.instructions.filter(inst => inst.trim()),
        tips: formData.tips.filter(tip => tip.trim())
      };

      if (isEditing) {
        // Update existing exercise
        console.log('Updating exercise:', cleanedData);
        // await updateExercise(id, cleanedData);
      } else {
        // Create new exercise
        console.log('Creating exercise:', cleanedData);
        // await createExercise(cleanedData);
      }

      // Navigate back to exercise library
      navigate('/exercises');
    } catch (error) {
      console.error('Error saving exercise:', error);
      alert('Có lỗi xảy ra khi lưu bài tập. Vui lòng thử lại.');
    } finally {
      setIsSaving(false);
    }
  };

  const previewExercise: Exercise = {
    id: 'preview',
    name: formData.name || 'Tên bài tập',
    bodyPart: formData.bodyPart,
    equipment: formData.equipment,
    gifUrl: '/api/placeholder/400/300',
    target: formData.target || 'Cơ chính',
    secondaryMuscles: formData.secondaryMuscles,
    instructions: formData.instructions.filter(inst => inst.trim()),
    difficulty: formData.difficulty,
    tips: formData.tips.filter(tip => tip.trim()),
    media: formData.media
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/exercises')}
            className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
          >
            <ArrowLeftIcon className="h-6 w-6" />
          </button>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {isEditing ? 'Chỉnh sửa bài tập' : 'Tạo bài tập mới'}
          </h1>
        </div>
        
        <div className="flex space-x-3">
          <button
            onClick={() => setShowPreview(true)}
            className="btn btn-secondary inline-flex items-center"
          >
            <EyeIcon className="w-4 h-4 mr-2" />
            Xem trước
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="btn btn-primary inline-flex items-center"
          >
            <SaveIcon className="w-4 h-4 mr-2" />
            {isSaving ? 'Đang lưu...' : 'Lưu bài tập'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Basic Info */}
        <div className="space-y-6">
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Thông tin cơ bản
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Tên bài tập *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Nhập tên bài tập..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Nhóm cơ
                  </label>
                  <select
                    value={formData.bodyPart}
                    onChange={(e) => handleInputChange('bodyPart', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                  >
                    {bodyParts.map(part => (
                      <option key={part.value} value={part.value}>
                        {part.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Thiết bị
                  </label>
                  <select
                    value={formData.equipment}
                    onChange={(e) => handleInputChange('equipment', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                  >
                    {equipmentTypes.map(equipment => (
                      <option key={equipment.value} value={equipment.value}>
                        {equipment.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Cơ chính *
                </label>
                <input
                  type="text"
                  value={formData.target}
                  onChange={(e) => handleInputChange('target', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Ví dụ: pectorals, quadriceps..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Độ khó
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {difficulties.map(diff => (
                    <button
                      key={diff.value}
                      onClick={() => handleInputChange('difficulty', diff.value)}
                      className={`p-3 text-sm font-medium rounded-md border-2 transition-colors ${
                        formData.difficulty === diff.value
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                      }`}
                    >
                      <span className={diff.color}>{diff.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Cơ phụ
                </label>
                <div className="flex space-x-2 mb-2">
                  <input
                    type="text"
                    value={newSecondaryMuscle}
                    onChange={(e) => setNewSecondaryMuscle(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addSecondaryMuscle()}
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Thêm cơ phụ..."
                  />
                  <button
                    onClick={addSecondaryMuscle}
                    className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                  >
                    <PlusIcon className="w-4 h-4" />
                  </button>
                </div>
                
                {formData.secondaryMuscles.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.secondaryMuscles.map((muscle, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded-md"
                      >
                        {muscle}
                        <button
                          onClick={() => removeSecondaryMuscle(muscle)}
                          className="ml-2 text-gray-500 hover:text-red-500"
                        >
                          <MinusIcon className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Hướng dẫn thực hiện
            </h2>
            
            <div className="space-y-3">
              {formData.instructions.map((instruction, index) => (
                <div key={index} className="flex space-x-2">
                  <span className="flex-shrink-0 w-6 h-6 bg-primary-100 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 rounded-full flex items-center justify-center text-sm font-medium mt-1">
                    {index + 1}
                  </span>
                  <textarea
                    value={instruction}
                    onChange={(e) => handleInstructionChange(index, e.target.value)}
                    rows={2}
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                    placeholder={`Bước ${index + 1}...`}
                  />
                  {formData.instructions.length > 1 && (
                    <button
                      onClick={() => removeInstruction(index)}
                      className="flex-shrink-0 p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md"
                    >
                      <MinusIcon className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
              
              <button
                onClick={addInstruction}
                className="w-full p-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-md text-gray-500 dark:text-gray-400 hover:border-primary-500 hover:text-primary-500 transition-colors"
              >
                <PlusIcon className="w-4 h-4 mx-auto" />
                <span className="block text-sm mt-1">Thêm bước</span>
              </button>
            </div>
          </div>

          {/* Tips */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Mẹo thực hiện
            </h2>
            
            <div className="space-y-3">
              {formData.tips.map((tip, index) => (
                <div key={index} className="flex space-x-2">
                  <div className="flex-shrink-0 w-2 h-2 bg-primary-500 rounded-full mt-3"></div>
                  <textarea
                    value={tip}
                    onChange={(e) => handleTipChange(index, e.target.value)}
                    rows={2}
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                    placeholder={`Mẹo ${index + 1}...`}
                  />
                  {formData.tips.length > 1 && (
                    <button
                      onClick={() => removeTip(index)}
                      className="flex-shrink-0 p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md"
                    >
                      <MinusIcon className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
              
              <button
                onClick={addTip}
                className="w-full p-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-md text-gray-500 dark:text-gray-400 hover:border-primary-500 hover:text-primary-500 transition-colors"
              >
                <PlusIcon className="w-4 h-4 mx-auto" />
                <span className="block text-sm mt-1">Thêm mẹo</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column - Media Management */}
        <div className="space-y-6">
          <div className="card">
            <MediaManager 
              media={formData.media}
              onMediaUpdate={handleMediaUpdate}
            />
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Xem trước bài tập
                </h2>
                <button
                  onClick={() => setShowPreview(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Preview Content */}
              <div className="space-y-6">
                {/* Media */}
                {previewExercise.media && previewExercise.media.length > 0 && (
                  <div className="aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                    <MediaViewer 
                      media={previewExercise.media} 
                      className="w-full h-full"
                      showControls={true}
                    />
                  </div>
                )}

                {/* Exercise Info */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {previewExercise.name}
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Nhóm cơ: </span>
                      <span className="text-gray-900 dark:text-white font-medium">
                        {bodyParts.find(bp => bp.value === previewExercise.bodyPart)?.label}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Thiết bị: </span>
                      <span className="text-gray-900 dark:text-white font-medium">
                        {equipmentTypes.find(eq => eq.value === previewExercise.equipment)?.label}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Cơ chính: </span>
                      <span className="text-gray-900 dark:text-white font-medium">
                        {previewExercise.target}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Độ khó: </span>
                      <span className={`font-medium px-2 py-1 rounded text-xs ${
                        previewExercise.difficulty === 'beginner' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                          : previewExercise.difficulty === 'intermediate'
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                          : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                      }`}>
                        {difficulties.find(d => d.value === previewExercise.difficulty)?.label}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Secondary Muscles */}
                {previewExercise.secondaryMuscles.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Cơ phụ</h4>
                    <div className="flex flex-wrap gap-1">
                      {previewExercise.secondaryMuscles.map((muscle, index) => (
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

                {/* Instructions */}
                {previewExercise.instructions.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-3">Hướng dẫn</h4>
                    <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600 dark:text-gray-400">
                      {previewExercise.instructions.map((instruction, index) => (
                        <li key={index}>{instruction}</li>
                      ))}
                    </ol>
                  </div>
                )}

                {/* Tips */}
                {previewExercise.tips && previewExercise.tips.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-3">Mẹo thực hiện</h4>
                    <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                      {previewExercise.tips.map((tip, index) => (
                        <li key={index} className="flex items-start">
                          <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="flex justify-end mt-6">
                <button
                  onClick={() => setShowPreview(false)}
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

export default ExerciseEditor;