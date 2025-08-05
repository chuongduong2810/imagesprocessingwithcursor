import React, { useState } from 'react';
import {
  PlusIcon,
  CalendarDaysIcon,
  ClockIcon,
  FireIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';
import WorkoutSuggestionForm from '../components/WorkoutSuggestionForm';
import WorkoutSuggestionDisplay from '../components/WorkoutSuggestionDisplay';
import { WorkoutSuggestionResponse } from '../types';

const WorkoutPlanner: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'plans' | 'create' | 'ai-suggestions'>('plans');
  const [aiSuggestion, setAiSuggestion] = useState<WorkoutSuggestionResponse | null>(null);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Lên lịch tập luyện
          </h1>
          <p className="mt-1 text-gray-600 dark:text-gray-400">
            Tạo và quản lý kế hoạch tập luyện của bạn
          </p>
        </div>
        <div className="flex space-x-3 mt-4 sm:mt-0">
          <button
            onClick={() => setActiveTab('ai-suggestions')}
            className="btn btn-primary inline-flex items-center"
          >
            <SparklesIcon className="w-4 h-4 mr-2" />
            AI Suggestions
          </button>
          <button
            onClick={() => setActiveTab('create')}
            className="btn btn-secondary inline-flex items-center"
          >
            <PlusIcon className="w-4 h-4 mr-2" />
            Tạo lịch tập mới
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('plans')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'plans'
                ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300'
            }`}
          >
            Kế hoạch của tôi
          </button>
          <button
            onClick={() => setActiveTab('ai-suggestions')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'ai-suggestions'
                ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300'
            }`}
          >
            <SparklesIcon className="w-4 h-4 inline mr-1" />
            AI Suggestions
          </button>
          <button
            onClick={() => setActiveTab('create')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'create'
                ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300'
            }`}
          >
            Tạo mới
          </button>
        </nav>
      </div>

      {/* Content */}
      {activeTab === 'plans' ? (
        <div className="space-y-6">
          {/* Empty state */}
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <CalendarDaysIcon className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Chưa có kế hoạch tập luyện
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Bắt đầu tạo kế hoạch tập luyện đầu tiên của bạn hoặc thử tính năng AI Suggestions
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setActiveTab('ai-suggestions')}
                className="btn btn-primary inline-flex items-center"
              >
                <SparklesIcon className="w-4 h-4 mr-2" />
                Thử AI Suggestions
              </button>
              <button
                onClick={() => setActiveTab('create')}
                className="btn btn-secondary inline-flex items-center"
              >
                <PlusIcon className="w-4 h-4 mr-2" />
                Tạo kế hoạch mới
              </button>
            </div>
          </div>
        </div>
      ) : activeTab === 'ai-suggestions' ? (
        <div className="space-y-6">
          {!aiSuggestion ? (
            <WorkoutSuggestionForm 
              onSuggestionGenerated={(suggestion) => setAiSuggestion(suggestion)}
            />
          ) : (
            <WorkoutSuggestionDisplay
              suggestion={aiSuggestion}
              onGenerateNew={() => setAiSuggestion(null)}
            />
          )}
        </div>
      ) : (
        <div className="max-w-2xl mx-auto">
          <div className="card p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
              Tạo kế hoạch tập luyện mới
            </h2>
            
            <form className="space-y-6">
              {/* Plan Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tên kế hoạch
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: Tập Upper Body 3 ngày/tuần"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Mô tả (tùy chọn)
                </label>
                <textarea
                  rows={3}
                  placeholder="Mô tả ngắn về kế hoạch tập luyện..."
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              {/* Goal */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Mục tiêu
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white">
                  <option value="muscle_gain">Tăng cơ</option>
                  <option value="weight_loss">Giảm cân</option>
                  <option value="strength">Tăng sức mạnh</option>
                  <option value="endurance">Tăng sức bền</option>
                  <option value="general_fitness">Thể lực tổng quát</option>
                </select>
              </div>

              {/* Days per week */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Số ngày/tuần
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white">
                    <option value="3">3 ngày/tuần</option>
                    <option value="4">4 ngày/tuần</option>
                    <option value="5">5 ngày/tuần</option>
                    <option value="6">6 ngày/tuần</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Thời gian (tuần)
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white">
                    <option value="4">4 tuần</option>
                    <option value="6">6 tuần</option>
                    <option value="8">8 tuần</option>
                    <option value="12">12 tuần</option>
                  </select>
                </div>
              </div>

              {/* Coming soon notice */}
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <div className="flex items-center">
                  <FireIcon className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
                  <div>
                    <h3 className="text-sm font-medium text-blue-900 dark:text-blue-100">
                      Tính năng đang phát triển
                    </h3>
                    <p className="text-sm text-blue-700 dark:text-blue-200 mt-1">
                      Tính năng tạo kế hoạch tập luyện chi tiết sẽ được bổ sung trong phiên bản tiếp theo. 
                      Hiện tại bạn có thể khám phá thư viện bài tập và theo dõi tiến độ cá nhân.
                    </p>
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setActiveTab('plans')}
                  className="btn btn-secondary"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled
                  className="btn btn-primary opacity-50 cursor-not-allowed"
                >
                  Tạo kế hoạch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkoutPlanner;