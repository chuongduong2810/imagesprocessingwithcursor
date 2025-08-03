import React, { useState, useEffect } from 'react';
import {
  ChartBarIcon,
  ClockIcon,
  FireIcon,
  TrophyIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { User, UserStats, WorkoutSession, ProgressEntry } from '../types';
import { loadUser, loadWorkoutSessions, loadProgressEntries, calculateUserStats } from '../utils/storage';

const Progress: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [sessions, setSessions] = useState<WorkoutSession[]>([]);
  const [progressEntries, setProgressEntries] = useState<ProgressEntry[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'workouts' | 'measurements'>('overview');

  useEffect(() => {
    const userData = loadUser();
    if (userData) {
      setUser(userData);
      
      const workoutSessions = loadWorkoutSessions();
      setSessions(workoutSessions);
      
      const userStats = calculateUserStats(workoutSessions, userData);
      setStats(userStats);
      
      const entries = loadProgressEntries();
      setProgressEntries(entries);
    }
  }, []);

  const formatDate = (date: Date) => {
    return date ? new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
    }).format() : '';
  };

  const formatDuration = (minutes: number) => {

    if(!minutes || minutes <= 0) return '0m';

    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  // Prepare chart data for workouts over time
  const getWorkoutChartData = () => {
    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (29 - i));
      return date;
    });

    return last30Days.map(date => {
      const dayWorkouts = sessions.filter(session => {
        const sessionDate = new Date(session.completedAt);
        return sessionDate.toDateString() === date.toDateString();
      });

      return {
        date: formatDate(date),
        workouts: dayWorkouts.length,
        duration: dayWorkouts.reduce((sum, session) => sum + session.duration, 0),
      };
    });
  };

  // Prepare chart data for weight progress
  const getWeightChartData = () => {
    if (!user) return [];

    console.log('Progress entries:', progressEntries);
    
    const weightData = progressEntries
      .filter(entry => entry.weight)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(-10); // Last 10 entries

    // Include initial weight from user profile
    const initialEntry = {
      date: formatDate(user.createdAt),
      weight: user.weight,
    };

    return [initialEntry, ...weightData.map(entry => ({
      date: formatDate(entry.date),
      weight: entry.weight,
    }))];
  };

  const chartData = getWorkoutChartData();
  const weightData = getWeightChartData();

  if (!user) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
          <ChartBarIcon className="h-12 w-12 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          Chưa có dữ liệu tiến độ
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Vui lòng tạo hồ sơ cá nhân để theo dõi tiến độ
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Tiến độ luyện tập
          </h1>
          <p className="mt-1 text-gray-600 dark:text-gray-400">
            Theo dõi kết quả và phát triển của bạn
          </p>
        </div>
        <button className="btn btn-primary inline-flex items-center mt-4 sm:mt-0">
          <PlusIcon className="w-4 h-4 mr-2" />
          Ghi nhận tiến độ
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'overview'
                ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300'
            }`}
          >
            Tổng quan
          </button>
          <button
            onClick={() => setActiveTab('workouts')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'workouts'
                ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300'
            }`}
          >
            Lịch sử tập luyện
          </button>
          <button
            onClick={() => setActiveTab('measurements')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'measurements'
                ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300'
            }`}
          >
            Chỉ số cơ thể
          </button>
        </nav>
      </div>

      {/* Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="card p-6">
              <div className="flex items-center">
                <div className="p-3 bg-primary-100 dark:bg-primary-900 rounded-lg">
                  <FireIcon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Tổng buổi tập
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stats?.totalWorkouts || 0}
                  </p>
                </div>
              </div>
            </div>

            <div className="card p-6">
              <div className="flex items-center">
                <div className="p-3 bg-secondary-100 dark:bg-secondary-900 rounded-lg">
                  <ClockIcon className="h-6 w-6 text-secondary-600 dark:text-secondary-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Tổng thời gian
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stats ? formatDuration(stats.totalDuration) : '0m'}
                  </p>
                </div>
              </div>
            </div>

            <div className="card p-6">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                  <TrophyIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Streak hiện tại
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stats?.currentStreak || 0} ngày
                  </p>
                </div>
              </div>
            </div>

            <div className="card p-6">
              <div className="flex items-center">
                <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-lg">
                  <ChartBarIcon className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    TB buổi/tuần
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stats?.averageWorkoutsPerWeek || 0}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Workout Activity Chart */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Hoạt động 30 ngày qua
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="workouts" 
                      stroke="#3b82f6" 
                      strokeWidth={2}
                      name="Số buổi tập"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Weight Progress Chart */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Biến động cân nặng
              </h3>
              <div className="h-64">
                {weightData.length > 1 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={weightData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="weight" 
                        stroke="#10b981" 
                        strokeWidth={2}
                        name="Cân nặng (kg)"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
                    <div className="text-center">
                      <ChartBarIcon className="h-12 w-12 mx-auto mb-2" />
                      <p>Chưa có dữ liệu cân nặng</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'workouts' && (
        <div className="space-y-6">
          {sessions.length > 0 ? (
            <div className="space-y-4">
              {sessions
                .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())
                .slice(0, 20)
                .map((session) => (
                  <div key={session.id} className="card p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          Buổi tập ngày {formatDate(session.completedAt)}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {session.exercises.length} bài tập • {formatDuration(session.duration)}
                          {session.calories && ` • ${session.calories} calories`}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-gray-900 dark:text-white">
                          {formatDuration(session.duration)}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {new Date(session.completedAt).toLocaleTimeString('vi-VN', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </div>
                    </div>
                    
                    {session.notes && (
                      <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          {session.notes}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <FireIcon className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Chưa có buổi tập nào
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Bắt đầu ghi nhận buổi tập đầu tiên của bạn
              </p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'measurements' && (
        <div className="space-y-6">
          {/* Current measurements */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Chỉ số hiện tại
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">Cân nặng</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">
                  {user.weight} kg
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">Chiều cao</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">
                  {user.height} cm
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">BMI</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">
                  {((user.weight / ((user.height / 100) ** 2))).toFixed(1)}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">Tuổi</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">
                  {user.age}
                </p>
              </div>
            </div>
          </div>

          {/* Progress entries */}
          {progressEntries.length > 0 ? (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Lịch sử đo đạc
              </h3>
              {progressEntries
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .map((entry) => (
                  <div key={entry.id} className="card p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {formatDate(entry.date)}
                      </h4>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {entry.weight && (
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Cân nặng</p>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {entry.weight} kg
                          </p>
                        </div>
                      )}
                      {entry.bodyFat && (
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">% Mỡ cơ thể</p>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {entry.bodyFat}%
                          </p>
                        </div>
                      )}
                      {entry.measurements?.chest && (
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Vòng ngực</p>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {entry.measurements.chest} cm
                          </p>
                        </div>
                      )}
                      {entry.measurements?.waist && (
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Vòng eo</p>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {entry.measurements.waist} cm
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <ChartBarIcon className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Chưa có dữ liệu đo đạc
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Bắt đầu ghi nhận các chỉ số cơ thể của bạn
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Progress;