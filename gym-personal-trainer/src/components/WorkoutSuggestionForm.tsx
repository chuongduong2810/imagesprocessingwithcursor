import React, { useState } from 'react';
import { 
  UserIcon, 
  ScaleIcon, 
  ChartBarIcon, 
  CalendarDaysIcon,
  CogIcon,
  DocumentTextIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import { WorkoutSuggestionRequest } from '../types';
import { GeminiService } from '../services/geminiService';

interface WorkoutSuggestionFormProps {
  onSuggestionGenerated: (suggestion: any) => void;
}

const WorkoutSuggestionForm: React.FC<WorkoutSuggestionFormProps> = ({ onSuggestionGenerated }) => {
  const [formData, setFormData] = useState<WorkoutSuggestionRequest>({
    gender: 'Male',
    age: 25,
    weight: 70,
    height: 175,
    goal: 'Gain Muscle',
    workoutDaysPerWeek: 3,
    equipment: '',
    additionalNotes: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const equipmentOptions = [
    'No Equipment (Bodyweight)',
    'Dumbbells',
    'Resistance Bands',
    'Full Gym Access',
    'Home Gym Setup',
    'Dumbbells + Resistance Bands',
    'Kettlebells',
    'Pull-up Bar',
    'Yoga Mat Only'
  ];

  const handleInputChange = (
    field: keyof WorkoutSuggestionRequest, 
    value: string | number
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear errors when user starts typing
    if (errors.length > 0) {
      setErrors([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate the form
    const validationErrors = GeminiService.validateRequest(formData);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    setErrors([]);

    try {
      const suggestion = await GeminiService.generateWorkoutSuggestion(formData);
      onSuggestionGenerated(suggestion);
    } catch (error) {
      setErrors([error instanceof Error ? error.message : 'Failed to generate suggestions']);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="flex items-center mb-6">
        <SparklesIcon className="w-6 h-6 text-primary-500 mr-3" />
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          AI Workout Suggestion
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <UserIcon className="w-4 h-4 inline mr-1" />
              Gender
            </label>
            <select
              value={formData.gender}
              onChange={(e) => handleInputChange('gender', e.target.value as 'Male' | 'Female')}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Age (years)
            </label>
            <input
              type="number"
              min="10"
              max="100"
              value={formData.age}
              onChange={(e) => handleInputChange('age', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <ScaleIcon className="w-4 h-4 inline mr-1" />
              Weight (kg)
            </label>
            <input
              type="number"
              min="30"
              max="300"
              value={formData.weight}
              onChange={(e) => handleInputChange('weight', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Height (cm)
            </label>
            <input
              type="number"
              min="100"
              max="250"
              value={formData.height}
              onChange={(e) => handleInputChange('height', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>

        {/* Fitness Goals and Preferences */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <ChartBarIcon className="w-4 h-4 inline mr-1" />
              Fitness Goal
            </label>
            <select
              value={formData.goal}
              onChange={(e) => handleInputChange('goal', e.target.value as WorkoutSuggestionRequest['goal'])}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="Gain Muscle">Gain Muscle</option>
              <option value="Lose Fat">Lose Fat</option>
              <option value="Maintain">Maintain Fitness</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <CalendarDaysIcon className="w-4 h-4 inline mr-1" />
              Workout Days per Week
            </label>
            <select
              value={formData.workoutDaysPerWeek}
              onChange={(e) => handleInputChange('workoutDaysPerWeek', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
            >
              {[1, 2, 3, 4, 5, 6, 7].map(days => (
                <option key={days} value={days}>
                  {days} {days === 1 ? 'day' : 'days'} per week
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Equipment */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <CogIcon className="w-4 h-4 inline mr-1" />
            Available Equipment
          </label>
          <select
            value={formData.equipment}
            onChange={(e) => handleInputChange('equipment', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="">Select your available equipment</option>
            {equipmentOptions.map(option => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        {/* Additional Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <DocumentTextIcon className="w-4 h-4 inline mr-1" />
            Additional Notes (Optional)
          </label>
          <textarea
            rows={3}
            value={formData.additionalNotes}
            onChange={(e) => handleInputChange('additionalNotes', e.target.value)}
            placeholder="Any specific preferences, injuries, or focus areas..."
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
          />
        </div>

        {/* Error Messages */}
        {errors.length > 0 && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4">
            <h4 className="text-red-800 dark:text-red-400 font-medium mb-2">
              Please fix the following errors:
            </h4>
            <ul className="list-disc list-inside text-red-700 dark:text-red-400 text-sm space-y-1">
              {errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full btn btn-primary flex items-center justify-center"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Generating AI Suggestions...
            </>
          ) : (
            <>
              <SparklesIcon className="w-4 h-4 mr-2" />
              Generate AI Workout Plan
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default WorkoutSuggestionForm;