import { WorkoutSuggestionRequest, WorkoutSuggestionResponse } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://localhost:7266/api';

export class GeminiService {
  /**
   * Generate AI-powered workout suggestions based on user profile
   */
  static async generateWorkoutSuggestion(request: WorkoutSuggestionRequest): Promise<WorkoutSuggestionResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/schedule/suggest`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || 
          errorData.errorMessage || 
          `Failed to generate workout suggestion: ${response.statusText}`
        );
      }

      const data: WorkoutSuggestionResponse = await response.json();
      
      // Validate the response structure
      if (!data.weeklyPlan || typeof data.weeklyPlan !== 'object') {
        throw new Error('Invalid response format from AI service');
      }

      return data;
    } catch (error) {
      console.error('Error generating workout suggestion:', error);
      
      // Return a fallback response structure
      return {
        weeklyPlan: {
          Monday: ['Unable to generate AI suggestions at this time'],
          Tuesday: ['Please try again later'],
          Wednesday: ['Check your internet connection'],
          Thursday: ['Rest'],
          Friday: ['Contact support if problem persists'],
          Saturday: ['Rest'],
          Sunday: ['Rest']
        },
        additionalTips: 'AI suggestion service is currently unavailable. Please try again later or contact support.',
        isSuccess: false,
        errorMessage: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  /**
   * Validate workout suggestion request data
   */
  static validateRequest(request: WorkoutSuggestionRequest): string[] {
    const errors: string[] = [];

    if (!request.gender || !['Male', 'Female'].includes(request.gender)) {
      errors.push('Gender must be either "Male" or "Female"');
    }

    if (!request.age || request.age < 10 || request.age > 100) {
      errors.push('Age must be between 10 and 100');
    }

    if (!request.weight || request.weight < 30 || request.weight > 300) {
      errors.push('Weight must be between 30kg and 300kg');
    }

    if (!request.height || request.height < 100 || request.height > 250) {
      errors.push('Height must be between 100cm and 250cm');
    }

    if (!request.goal || !['Gain Muscle', 'Lose Fat', 'Maintain'].includes(request.goal)) {
      errors.push('Goal must be "Gain Muscle", "Lose Fat", or "Maintain"');
    }

    if (!request.workoutDaysPerWeek || request.workoutDaysPerWeek < 1 || request.workoutDaysPerWeek > 7) {
      errors.push('Workout days per week must be between 1 and 7');
    }

    if (!request.equipment || request.equipment.trim().length === 0) {
      errors.push('Equipment information is required');
    }

    return errors;
  }
}