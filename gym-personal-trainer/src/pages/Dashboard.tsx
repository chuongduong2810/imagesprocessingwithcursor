import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FireIcon,
  ClockIcon,
  CalendarIcon,
  TrophyIcon,
  ChartBarIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';
import { User, UserStats, WorkoutSession } from '../types';
import { loadUser, loadWorkoutSessions, calculateUserStats } from '../utils/storage';

const Dashboard: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [recentWorkouts, setRecentWorkouts] = useState<WorkoutSession[]>([]);

  useEffect(() => {
    // Load user data
    const userData = loadUser();
    if (userData) {
      setUser(userData);
      
      // Load workout sessions and calculate stats
      const sessions = loadWorkoutSessions();
      const userStats = calculateUserStats(sessions, userData);
      setStats(userStats);
      
      // Get recent workouts (last 5)
      const sortedSessions = sessions
        .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())
        .slice(0, 5);
      setRecentWorkouts(sortedSessions);
    }
  }, []);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(date);
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const getGoalText = (goal: string) => {
    const goalMap = {
      'muscle_gain': 'Tăng cơ',
      'weight_loss': 'Giảm cân',
      'strength': 'Tăng sức mạnh',
      'endurance': 'Tăng sức bền',
      'general_fitness': 'Thể lực tổng quát'
    };
    return goalMap[goal as keyof typeof goalMap] || goal;
  };

  if (!user) {
    return (
      <div className="text-center py-12">
        <div className="max-w-md mx-auto">
          <div className="w-24 h-24 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">👋</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Chào mừng đến với Gym Trainer!
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Hãy tạo hồ sơ cá nhân để bắt đầu hành trình luyện tập của bạn.
          </p>
          <Link
            to="/profile"
            className="btn btn-primary inline-flex items-center"
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            Tạo hồ sơ
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">
              Chào {user.name}! 👋
            </h1>
            <p className="text-primary-100">
              Sẵn sàng cho buổi tập hôm nay chưa?
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-primary-100 mb-1">Mục tiêu</p>
            <p className="font-semibold">{getGoalText(user.goal)}</p>
          </div>
        </div>
      </div>

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
                Thời gian TB
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats ? formatDuration(Math.round(stats.averageDuration)) : '0m'}
              </p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
              <CalendarIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Tuần này
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats?.averageWorkoutsPerWeek || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-lg">
              <TrophyIcon className="h-6 w-6 text-orange-600 dark:text-orange-400" />
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
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Workouts */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Buổi tập gần đây
            </h3>
            <Link
              to="/progress"
              className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 text-sm font-medium"
            >
              Xem tất cả
            </Link>
          </div>
          {recentWorkouts.length > 0 ? (
            <div className="space-y-3">
              {recentWorkouts.map((workout) => (
                <div
                  key={workout.id}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      Buổi tập
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {formatDate(workout.completedAt)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900 dark:text-white">
                      {formatDuration(workout.duration)}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {workout.exercises.length} bài tập
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <ChartBarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">
                Chưa có buổi tập nào được ghi nhận
              </p>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Thao tác nhanh
          </h3>
          <div className="space-y-3">
            <Link
              to="/workouts"
              className="flex items-center p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors duration-200"
            >
              <div className="p-2 bg-primary-600 rounded-lg">
                <CalendarIcon className="h-5 w-5 text-white" />
              </div>
              <div className="ml-4">
                <p className="font-medium text-gray-900 dark:text-white">
                  Tạo lịch tập mới
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Lên kế hoạch cho buổi tập tiếp theo
                </p>
              </div>
            </Link>

            <Link
              to="/exercises"
              className="flex items-center p-4 bg-secondary-50 dark:bg-secondary-900/20 rounded-lg hover:bg-secondary-100 dark:hover:bg-secondary-900/30 transition-colors duration-200"
            >
              <div className="p-2 bg-secondary-600 rounded-lg">
                <FireIcon className="h-5 w-5 text-white" />
              </div>
              <div className="ml-4">
                <p className="font-medium text-gray-900 dark:text-white">
                  Khám phá bài tập
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Tìm bài tập phù hợp với mục tiêu
                </p>
              </div>
            </Link>

            <Link
              to="/progress"
              className="flex items-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors duration-200"
            >
              <div className="p-2 bg-green-600 rounded-lg">
                <ChartBarIcon className="h-5 w-5 text-white" />
              </div>
              <div className="ml-4">
                <p className="font-medium text-gray-900 dark:text-white">
                  Xem tiến độ
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Theo dõi kết quả luyện tập
                </p>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* User Info Summary */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Thông tin cá nhân
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">Tuổi</p>
            <p className="text-xl font-bold text-gray-900 dark:text-white">
              {user.age}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">Chiều cao</p>
            <p className="text-xl font-bold text-gray-900 dark:text-white">
              {user.height} cm
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">Cân nặng</p>
            <p className="text-xl font-bold text-gray-900 dark:text-white">
              {user.weight} kg
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">BMI</p>
            <p className="text-xl font-bold text-gray-900 dark:text-white">
              {((user.weight / ((user.height / 100) ** 2))).toFixed(1)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;