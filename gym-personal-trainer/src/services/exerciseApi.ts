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
    ],
    difficulty: 'beginner',
    tips: [
      'Keep your body in a straight line from head to toe',
      'Breathe out as you push up, breathe in as you lower down',
      'Start with knee push-ups if regular push-ups are too difficult'
    ],
    media: [
      {
        id: 'push-up-gif-1',
        type: 'gif',
        url: 'https://i.imgur.com/9FKqH8L.gif',
        title: 'Push-up Form Demo',
        description: 'Proper push-up form demonstration',
        isPrimary: true
      },
      {
        id: 'push-up-img-1',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800',
        title: 'Starting Position',
        description: 'Proper starting position for push-ups'
      },
      {
        id: 'push-up-video-1',
        type: 'video',
        url: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
        title: 'Push-up Tutorial',
        description: 'Complete tutorial on how to perform push-ups',
        thumbnail: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400'
      }
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
    ],
    difficulty: 'intermediate',
    tips: [
      'Engage your core throughout the movement',
      'Use a full range of motion',
      'Consider using resistance bands for assistance if needed'
    ],
    media: [
      {
        id: 'pullup-gif-1',
        type: 'gif',
        url: 'https://i.imgur.com/example-pullup.gif',
        title: 'Pull-up Technique',
        description: 'Proper pull-up form and technique',
        isPrimary: true
      },
      {
        id: 'pullup-img-1',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1594736797933-d0f02d11c2d3?w=800',
        title: 'Grip Position',
        description: 'Correct hand position for pull-ups'
      }
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
    ],
    difficulty: 'beginner',
    tips: [
      'Keep your chest up and core engaged',
      'Descend until thighs are parallel to the floor',
      'Weight should be on your heels, not toes'
    ],
    media: [
      {
        id: 'squat-gif-1',
        type: 'gif',
        url: 'https://i.imgur.com/example-squat.gif',
        title: 'Squat Movement',
        description: 'Complete squat movement pattern',
        isPrimary: true
      },
      {
        id: 'squat-img-1',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1566241440091-ec10de8db2e1?w=800',
        title: 'Bottom Position',
        description: 'Proper bottom position of the squat'
      },
      {
        id: 'squat-img-2',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800',
        title: 'Starting Stance',
        description: 'Correct starting stance for squats'
      }
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
    ],
    difficulty: 'beginner',
    tips: [
      'Don\'t let your hips sag or pike up',
      'Breathe normally while holding the position',
      'Start with 30 seconds and gradually increase time'
    ],
    media: [
      {
        id: 'plank-img-1',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800',
        title: 'Plank Position',
        description: 'Proper plank form and alignment',
        isPrimary: true
      },
      {
        id: 'plank-video-1',
        type: 'video',
        url: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
        title: 'Plank Tutorial',
        description: 'Complete guide to planking',
        thumbnail: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400'
      }
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
    ],
    difficulty: 'intermediate',
    tips: [
      'Keep your core tight throughout the movement',
      'Don\'t press the weights together at the top',
      'Control the descent for maximum benefit'
    ],
    media: [
      {
        id: 'shoulder-press-gif-1',
        type: 'gif',
        url: 'https://i.imgur.com/example-shoulder-press.gif',
        title: 'Shoulder Press Motion',
        description: 'Complete shoulder press movement',
        isPrimary: true
      },
      {
        id: 'shoulder-press-img-1',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800',
        title: 'Starting Position',
        description: 'Correct starting position with dumbbells'
      }
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
    ],
    difficulty: 'beginner',
    tips: [
      'Don\'t swing the weights - use controlled movement',
      'Keep elbows close to your body',
      'Squeeze at the top of the movement'
    ],
    media: [
      {
        id: 'bicep-curl-gif-1',
        type: 'gif',
        url: 'https://i.imgur.com/example-bicep-curl.gif',
        title: 'Bicep Curl Form',
        description: 'Proper bicep curl technique',
        isPrimary: true
      },
      {
        id: 'bicep-curl-img-1',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800',
        title: 'Peak Contraction',
        description: 'Peak contraction position'
      },
      {
        id: 'bicep-curl-video-1',
        type: 'video',
        url: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
        title: 'Bicep Curl Variations',
        description: 'Different types of bicep curls',
        thumbnail: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400'
      }
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