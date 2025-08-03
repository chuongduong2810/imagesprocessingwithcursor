import { Exercise, ExerciseAPIResponse } from '../types';

const API_BASE_URL = 'https://exercisedb.p.rapidapi.com';
const API_KEY = process.env.REACT_APP_RAPIDAPI_KEY || '';

// Mock data cho trường hợp không có API key
const MOCK_EXERCISES: Exercise[] = [
  {
    id: '1',
    name: 'Push-up',
    bodyPart: 'chest',
    equipment: 'body weight',
    gifUrl: '/api/placeholder/400/300',
    target: 'pectorals',
    secondaryMuscles: ['triceps', 'anterior deltoid'],
    instructions: [
      'Start in a plank position with arms extended.',
      'Lower your body until your chest nearly touches the floor.',
      'Push back up to the starting position.',
      'Repeat for desired number of repetitions.'
    ]
  },
  {
    id: '2',
    name: 'Pull-up',
    bodyPart: 'back',
    equipment: 'body weight',
    gifUrl: '/api/placeholder/400/300',
    target: 'lats',
    secondaryMuscles: ['biceps', 'rhomboids'],
    instructions: [
      'Hang from a pull-up bar with palms facing away.',
      'Pull yourself up until your chin clears the bar.',
      'Lower yourself back down with control.',
      'Repeat for desired number of repetitions.'
    ]
  },
  {
    id: '3',
    name: 'Squat',
    bodyPart: 'legs',
    equipment: 'body weight',
    gifUrl: '/api/placeholder/400/300',
    target: 'quadriceps',
    secondaryMuscles: ['glutes', 'hamstrings'],
    instructions: [
      'Stand with feet shoulder-width apart.',
      'Lower your body as if sitting back into a chair.',
      'Keep your knees behind your toes.',
      'Push through your heels to return to starting position.'
    ]
  },
  {
    id: '4',
    name: 'Plank',
    bodyPart: 'core',
    equipment: 'body weight',
    gifUrl: '/api/placeholder/400/300',
    target: 'abs',
    secondaryMuscles: ['shoulders', 'glutes'],
    instructions: [
      'Start in a push-up position.',
      'Hold your body in a straight line from head to heels.',
      'Keep your core engaged.',
      'Hold for desired duration.'
    ]
  },
  {
    id: '5',
    name: 'Shoulder Press',
    bodyPart: 'shoulders',
    equipment: 'dumbbell',
    gifUrl: '/api/placeholder/400/300',
    target: 'delts',
    secondaryMuscles: ['triceps', 'upper chest'],
    instructions: [
      'Hold dumbbells at shoulder height.',
      'Press weights overhead until arms are fully extended.',
      'Lower back to shoulder height with control.',
      'Repeat for desired number of repetitions.'
    ]
  },
  {
    id: '6',
    name: 'Bicep Curl',
    bodyPart: 'arms',
    equipment: 'dumbbell',
    gifUrl: '/api/placeholder/400/300',
    target: 'biceps',
    secondaryMuscles: ['forearms'],
    instructions: [
      'Hold dumbbells with arms at your sides.',
      'Curl weights up toward your shoulders.',
      'Keep your elbows stationary.',
      'Lower back down with control.'
    ]
  }
];

// API functions
const makeApiRequest = async (endpoint: string): Promise<any> => {
  if (!API_KEY) {
    console.warn('No API key provided, using mock data');
    return null;
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': API_KEY,
        'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com'
      }
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    return null;
  }
};

export const getExercises = async (limit = 50): Promise<Exercise[]> => {
  try {
    const data = await makeApiRequest(`/exercises?limit=${limit}`);
    
    if (!data) {
      return MOCK_EXERCISES;
    }

    return data.map((exercise: ExerciseAPIResponse) => ({
      id: exercise.id,
      name: exercise.name,
      bodyPart: exercise.bodyPart,
      equipment: exercise.equipment,
      gifUrl: exercise.gifUrl,
      target: exercise.target,
      secondaryMuscles: exercise.secondaryMuscles || [],
      instructions: exercise.instructions || []
    }));
  } catch (error) {
    console.error('Error fetching exercises:', error);
    return MOCK_EXERCISES;
  }
};

export const getExercisesByBodyPart = async (bodyPart: string): Promise<Exercise[]> => {
  try {
    const data = await makeApiRequest(`/exercises/bodyPart/${bodyPart}`);
    
    if (!data) {
      return MOCK_EXERCISES.filter(exercise => exercise.bodyPart === bodyPart);
    }

    return data.map((exercise: ExerciseAPIResponse) => ({
      id: exercise.id,
      name: exercise.name,
      bodyPart: exercise.bodyPart,
      equipment: exercise.equipment,
      gifUrl: exercise.gifUrl,
      target: exercise.target,
      secondaryMuscles: exercise.secondaryMuscles || [],
      instructions: exercise.instructions || []
    }));
  } catch (error) {
    console.error('Error fetching exercises by body part:', error);
    return MOCK_EXERCISES.filter(exercise => exercise.bodyPart === bodyPart);
  }
};

export const getExercisesByEquipment = async (equipment: string): Promise<Exercise[]> => {
  try {
    const data = await makeApiRequest(`/exercises/equipment/${equipment}`);
    
    if (!data) {
      return MOCK_EXERCISES.filter(exercise => exercise.equipment === equipment);
    }

    return data.map((exercise: ExerciseAPIResponse) => ({
      id: exercise.id,
      name: exercise.name,
      bodyPart: exercise.bodyPart,
      equipment: exercise.equipment,
      gifUrl: exercise.gifUrl,
      target: exercise.target,
      secondaryMuscles: exercise.secondaryMuscles || [],
      instructions: exercise.instructions || []
    }));
  } catch (error) {
    console.error('Error fetching exercises by equipment:', error);
    return MOCK_EXERCISES.filter(exercise => exercise.equipment === equipment);
  }
};

export const searchExercises = async (query: string): Promise<Exercise[]> => {
  try {
    const allExercises = await getExercises(1000);
    
    const filteredExercises = allExercises.filter(exercise =>
      exercise.name.toLowerCase().includes(query.toLowerCase()) ||
      exercise.target.toLowerCase().includes(query.toLowerCase()) ||
      exercise.bodyPart.toLowerCase().includes(query.toLowerCase()) ||
      exercise.equipment.toLowerCase().includes(query.toLowerCase())
    );
    
    return filteredExercises;
  } catch (error) {
    console.error('Error searching exercises:', error);
    return [];
  }
};

export const getBodyParts = async (): Promise<string[]> => {
  try {
    const data = await makeApiRequest('/exercises/bodyPartList');
    
    if (!data) {
      return ['chest', 'back', 'legs', 'core', 'shoulders', 'arms'];
    }

    return data;
  } catch (error) {
    console.error('Error fetching body parts:', error);
    return ['chest', 'back', 'legs', 'core', 'shoulders', 'arms'];
  }
};

export const getEquipmentList = async (): Promise<string[]> => {
  try {
    const data = await makeApiRequest('/exercises/equipmentList');
    
    if (!data) {
      return ['body weight', 'dumbbell', 'barbell', 'kettlebell', 'resistance band', 'cable'];
    }

    return data;
  } catch (error) {
    console.error('Error fetching equipment list:', error);
    return ['body weight', 'dumbbell', 'barbell', 'kettlebell', 'resistance band', 'cable'];
  }
};