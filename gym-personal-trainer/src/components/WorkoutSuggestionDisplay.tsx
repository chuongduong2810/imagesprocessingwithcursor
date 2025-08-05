import React from 'react';
import { 
  CalendarDaysIcon, 
  ClockIcon, 
  CheckCircleIcon,
  ExclamationTriangleIcon,
  LightBulbIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { WorkoutSuggestionResponse } from '../types';

interface WorkoutSuggestionDisplayProps {
  suggestion: WorkoutSuggestionResponse;
  onGenerateNew: () => void;
}

const WorkoutSuggestionDisplay: React.FC<WorkoutSuggestionDisplayProps> = ({ 
  suggestion, 
  onGenerateNew 
}) => {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  
  const getDayExercises = (day: string) => {
    return suggestion.weeklyPlan[day as keyof typeof suggestion.weeklyPlan] || [];
  };

  const isRestDay = (day: string) => {
    const exercises = getDayExercises(day);
    return exercises.length === 1 && exercises[0].toLowerCase().includes('rest');
  };

  const getTotalWorkoutDays = () => {
    return days.filter(day => !isRestDay(day)).length;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            {suggestion.isSuccess ? (
              <CheckCircleIcon className="w-6 h-6 text-green-500 mr-3" />
            ) : (
              <ExclamationTriangleIcon className="w-6 h-6 text-red-500 mr-3" />
            )}
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {suggestion.isSuccess ? 'AI-Generated Workout Plan' : 'Suggestion Failed'}
            </h2>
          </div>
          <button
            onClick={onGenerateNew}
            className="btn btn-secondary flex items-center"
          >
            <ArrowPathIcon className="w-4 h-4 mr-2" />
            Generate New Plan
          </button>
        </div>

        {suggestion.isSuccess && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="text-center">
              <CalendarDaysIcon className="w-6 h-6 text-primary-500 mx-auto mb-2" />
              <div className="text-lg font-semibold text-gray-900 dark:text-white">
                {getTotalWorkoutDays()}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Workout Days
              </div>
            </div>
            <div className="text-center">
              <ClockIcon className="w-6 h-6 text-primary-500 mx-auto mb-2" />
              <div className="text-lg font-semibold text-gray-900 dark:text-white">
                7 Days
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Weekly Plan
              </div>
            </div>
            <div className="text-center">
              <LightBulbIcon className="w-6 h-6 text-primary-500 mx-auto mb-2" />
              <div className="text-lg font-semibold text-gray-900 dark:text-white">
                AI Powered
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Personalized
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Error Display */}
      {!suggestion.isSuccess && suggestion.errorMessage && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
          <div className="flex items-center mb-2">
            <ExclamationTriangleIcon className="w-5 h-5 text-red-500 mr-2" />
            <h3 className="text-red-800 dark:text-red-400 font-medium">
              Unable to Generate Suggestions
            </h3>
          </div>
          <p className="text-red-700 dark:text-red-400 text-sm">
            {suggestion.errorMessage}
          </p>
        </div>
      )}

      {/* Weekly Plan */}
      {suggestion.weeklyPlan && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {days.map((day, index) => {
            const exercises = getDayExercises(day);
            const isRest = isRestDay(day);
            
            return (
              <div 
                key={day} 
                className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 ${
                  isRest ? 'border-l-4 border-gray-300 dark:border-gray-600' : 'border-l-4 border-primary-500'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {day}
                  </h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    isRest 
                      ? 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                      : 'bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200'
                  }`}>
                    {isRest ? 'Rest Day' : `${exercises.length} Exercises`}
                  </span>
                </div>

                <div className="space-y-3">
                  {exercises.map((exercise, exerciseIndex) => (
                    <div 
                      key={exerciseIndex}
                      className={`p-3 rounded-lg ${
                        isRest 
                          ? 'bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                          : 'bg-gray-50 dark:bg-gray-700'
                      }`}
                    >
                      <div className="flex items-start">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5 ${
                          isRest 
                            ? 'bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-400'
                            : 'bg-primary-500 text-white'
                        }`}>
                          {exerciseIndex + 1}
                        </div>
                        <div className="flex-1">
                          <p className="text-gray-900 dark:text-white text-sm font-medium">
                            {exercise}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Additional Tips */}
      {suggestion.additionalTips && suggestion.isSuccess && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
          <div className="flex items-center mb-3">
            <LightBulbIcon className="w-5 h-5 text-blue-500 mr-2" />
            <h3 className="text-blue-800 dark:text-blue-400 font-medium">
              AI Tips & Recommendations
            </h3>
          </div>
          <p className="text-blue-700 dark:text-blue-300 text-sm leading-relaxed">
            {suggestion.additionalTips}
          </p>
        </div>
      )}

      {/* Action Buttons */}
      {suggestion.isSuccess && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            What's Next?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button className="btn btn-primary">
              Save This Plan
            </button>
            <button className="btn btn-secondary">
              Customize Exercises
            </button>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
            Remember to warm up before each workout and cool down afterwards. Listen to your body and adjust intensity as needed.
          </p>
        </div>
      )}
    </div>
  );
};

export default WorkoutSuggestionDisplay;