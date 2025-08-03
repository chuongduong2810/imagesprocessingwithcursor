import { User, Workout, WorkoutPlan, WorkoutSession, ProgressEntry, UserStats } from '../types';

// Storage keys
const STORAGE_KEYS = {
  USER: 'gym-app-user',
  WORKOUTS: 'gym-app-workouts',
  WORKOUT_PLANS: 'gym-app-workout-plans',
  WORKOUT_SESSIONS: 'gym-app-workout-sessions',
  PROGRESS_ENTRIES: 'gym-app-progress-entries',
  FAVORITE_EXERCISES: 'gym-app-favorite-exercises',
} as const;

// Generic storage functions
export const saveToStorage = <T>(key: string, data: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

export const loadFromStorage = <T>(key: string): T | null => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error('Error loading from localStorage:', error);
    return null;
  }
};

export const removeFromStorage = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing from localStorage:', error);
  }
};

// User storage functions
export const saveUser = (user: User): void => {
  saveToStorage(STORAGE_KEYS.USER, user);
};

export const loadUser = (): User | null => {
  return loadFromStorage<User>(STORAGE_KEYS.USER);
};

export const removeUser = (): void => {
  removeFromStorage(STORAGE_KEYS.USER);
};

// Workouts storage functions
export const saveWorkouts = (workouts: Workout[]): void => {
  saveToStorage(STORAGE_KEYS.WORKOUTS, workouts);
};

export const loadWorkouts = (): Workout[] => {
  return loadFromStorage<Workout[]>(STORAGE_KEYS.WORKOUTS) || [];
};

// Workout plans storage functions
export const saveWorkoutPlans = (plans: WorkoutPlan[]): void => {
  saveToStorage(STORAGE_KEYS.WORKOUT_PLANS, plans);
};

export const loadWorkoutPlans = (): WorkoutPlan[] => {
  return loadFromStorage<WorkoutPlan[]>(STORAGE_KEYS.WORKOUT_PLANS) || [];
};

// Workout sessions storage functions
export const saveWorkoutSessions = (sessions: WorkoutSession[]): void => {
  saveToStorage(STORAGE_KEYS.WORKOUT_SESSIONS, sessions);
};

export const loadWorkoutSessions = (): WorkoutSession[] => {
  const sessions = loadFromStorage<WorkoutSession[]>(STORAGE_KEYS.WORKOUT_SESSIONS) || [];
  // Convert date strings back to Date objects
  return sessions.map(session => ({
    ...session,
    completedAt: new Date(session.completedAt),
  }));
};

// Progress entries storage functions
export const saveProgressEntries = (entries: ProgressEntry[]): void => {
  saveToStorage(STORAGE_KEYS.PROGRESS_ENTRIES, entries);
};

export const loadProgressEntries = (): ProgressEntry[] => {
  const entries = loadFromStorage<ProgressEntry[]>(STORAGE_KEYS.PROGRESS_ENTRIES) || [];
  // Convert date strings back to Date objects
  return entries.map(entry => ({
    ...entry,
    date: new Date(entry.date),
  }));
};

// Favorite exercises storage functions
export const saveFavoriteExercises = (exerciseIds: string[]): void => {
  saveToStorage(STORAGE_KEYS.FAVORITE_EXERCISES, exerciseIds);
};

export const loadFavoriteExercises = (): string[] => {
  return loadFromStorage<string[]>(STORAGE_KEYS.FAVORITE_EXERCISES) || [];
};

// Utility functions
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const calculateUserStats = (
  sessions: WorkoutSession[],
  user: User
): UserStats => {
  const now = new Date();
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  
  const recentSessions = sessions.filter(
    session => new Date(session.completedAt) >= oneWeekAgo
  );
  
  const totalDuration = sessions.reduce((sum, session) => sum + session.duration, 0);
  const totalCalories = sessions.reduce((sum, session) => sum + (session.calories || 0), 0);
  
  // Calculate streaks
  const sortedSessions = [...sessions].sort(
    (a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
  );
  
  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;
  
  for (let i = 0; i < sortedSessions.length; i++) {
    const sessionDate = new Date(sortedSessions[i].completedAt);
    const daysDiff = Math.floor(
      (now.getTime() - sessionDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    
    if (daysDiff <= 1 && i === 0) {
      currentStreak = 1;
      tempStreak = 1;
    } else if (daysDiff === i + 1) {
      currentStreak++;
      tempStreak++;
    } else {
      if (tempStreak > longestStreak) {
        longestStreak = tempStreak;
      }
      tempStreak = 0;
    }
  }
  
  if (tempStreak > longestStreak) {
    longestStreak = tempStreak;
  }
  
  // Get favorite exercises (most frequently used)
  const exerciseFrequency: { [key: string]: number } = {};
  sessions.forEach(session => {
    session.exercises.forEach(exercise => {
      exerciseFrequency[exercise.exerciseId] = 
        (exerciseFrequency[exercise.exerciseId] || 0) + 1;
    });
  });
  
  const favoriteExercises = Object.entries(exerciseFrequency)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([exerciseId]) => exerciseId);
  
  return {
    totalWorkouts: sessions.length,
    totalDuration,
    averageWorkoutsPerWeek: recentSessions.length,
    averageDuration: sessions.length > 0 ? totalDuration / sessions.length : 0,
    totalCaloriesBurned: totalCalories,
    favoriteExercises,
    currentStreak,
    longestStreak,
  };
};