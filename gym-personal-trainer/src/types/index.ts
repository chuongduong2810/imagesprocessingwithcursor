// User types
export interface User {
  id: string;
  name: string;
  age: number;
  height: number; // cm
  weight: number; // kg
  goal: 'muscle_gain' | 'weight_loss' | 'strength' | 'endurance' | 'general_fitness';
  activityLevel: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | 'extremely_active';
  createdAt: Date;
  updatedAt: Date;
}

// Media types for exercises
export interface ExerciseMedia {
  id: string;
  type: 'image' | 'video' | 'gif';
  url: string;
  title?: string;
  description?: string;
  thumbnail?: string; // For videos
  isPrimary?: boolean; // Main media to display
}

// Exercise types
export interface Exercise {
  id: string;
  name: string;
  bodyPart: string;
  equipment: string;
  gifUrl: string; // Keep for backward compatibility
  target: string;
  secondaryMuscles: string[];
  instructions: string[];
  media?: ExerciseMedia[]; // New field for multiple media
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  tips?: string[]; // Additional tips for the exercise
}

export interface ExerciseSet {
  reps: number;
  weight?: number;
  duration?: number; // seconds
  restTime?: number; // seconds
}

export interface WorkoutExercise {
  exerciseId: string;
  exercise: Exercise;
  sets: ExerciseSet[];
  notes?: string;
}

// Workout types
export interface Workout {
  id: string;
  name: string;
  description?: string;
  exercises: WorkoutExercise[];
  estimatedDuration: number; // minutes
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkoutPlan {
  id: string;
  name: string;
  description?: string;
  workouts: Workout[];
  daysPerWeek: number;
  duration: number; // weeks
  goal: User['goal'];
  createdAt: Date;
  updatedAt: Date;
}

// Progress tracking types
export interface WorkoutSession {
  id: string;
  workoutId: string;
  userId: string;
  completedAt: Date;
  duration: number; // minutes
  exercises: {
    exerciseId: string;
    sets: ExerciseSet[];
    completed: boolean;
  }[];
  calories?: number;
  notes?: string;
}

export interface ProgressEntry {
  id: string;
  userId: string;
  date: Date;
  weight?: number;
  bodyFat?: number;
  measurements?: {
    chest?: number;
    waist?: number;
    arms?: number;
    thighs?: number;
  };
  photos?: string[];
}

// Stats types
export interface UserStats {
  totalWorkouts: number;
  totalDuration: number; // minutes
  averageWorkoutsPerWeek: number;
  averageDuration: number; // minutes
  totalCaloriesBurned: number;
  favoriteExercises: string[];
  currentStreak: number; // days
  longestStreak: number; // days
}

// API types
export interface ExerciseAPIResponse {
  id: string;
  name: string;
  bodyPart: string;
  equipment: string;
  gifUrl: string;
  target: string;
  secondaryMuscles: string[];
  instructions: string[];
}

// App state types
export interface AppState {
  user: User | null;
  darkMode: boolean;
  isLoading: boolean;
  error: string | null;
}

// Context types
export interface ThemeContextType {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

export interface UserContextType {
  user: User | null;
  updateUser: (user: Partial<User>) => void;
  stats: UserStats | null;
  refreshStats: () => void;
}

export interface WorkoutContextType {
  workouts: Workout[];
  workoutPlans: WorkoutPlan[];
  currentWorkout: Workout | null;
  addWorkout: (workout: Omit<Workout, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateWorkout: (id: string, workout: Partial<Workout>) => void;
  deleteWorkout: (id: string) => void;
  setCurrentWorkout: (workout: Workout | null) => void;
}