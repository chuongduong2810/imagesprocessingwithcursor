import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserIcon, SaveIcon } from '@heroicons/react/24/outline';
import { User } from '../types';
import { loadUser, saveUser, generateId } from '../utils/storage';

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    height: '',
    weight: '',
    goal: 'general_fitness' as User['goal'],
    activityLevel: 'moderately_active' as User['activityLevel'],
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  useEffect(() => {
    const userData = loadUser();
    if (userData) {
      setFormData({
        name: userData.name,
        age: userData.age.toString(),
        height: userData.height.toString(),
        weight: userData.weight.toString(),
        goal: userData.goal,
        activityLevel: userData.activityLevel,
      });
    } else {
      setIsEditing(true);
    }
  }, []);

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Tên không được để trống';
    }

    if (!formData.age || parseInt(formData.age) < 13 || parseInt(formData.age) > 100) {
      newErrors.age = 'Tuổi phải từ 13-100';
    }

    if (!formData.height || parseInt(formData.height) < 100 || parseInt(formData.height) > 250) {
      newErrors.height = 'Chiều cao phải từ 100-250cm';
    }

    if (!formData.weight || parseInt(formData.weight) < 30 || parseInt(formData.weight) > 300) {
      newErrors.weight = 'Cân nặng phải từ 30-300kg';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const existingUser = loadUser();
    const now = new Date();
    
    const userData: User = {
      id: existingUser?.id || generateId(),
      name: formData.name.trim(),
      age: parseInt(formData.age),
      height: parseInt(formData.height),
      weight: parseInt(formData.weight),
      goal: formData.goal,
      activityLevel: formData.activityLevel,
      createdAt: existingUser?.createdAt || now,
      updatedAt: now,
    };

    saveUser(userData);
    setIsEditing(false);
    
    if (!existingUser) {
      navigate('/dashboard');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const goalOptions = [
    { value: 'muscle_gain', label: 'Tăng cơ' },
    { value: 'weight_loss', label: 'Giảm cân' },
    { value: 'strength', label: 'Tăng sức mạnh' },
    { value: 'endurance', label: 'Tăng sức bền' },
    { value: 'general_fitness', label: 'Thể lực tổng quát' },
  ];

  const activityLevelOptions = [
    { value: 'sedentary', label: 'Ít vận động (công việc văn phòng)' },
    { value: 'lightly_active', label: 'Vận động nhẹ (1-3 ngày/tuần)' },
    { value: 'moderately_active', label: 'Vận động vừa (3-5 ngày/tuần)' },
    { value: 'very_active', label: 'Vận động nhiều (6-7 ngày/tuần)' },
    { value: 'extremely_active', label: 'Vận động cực nhiều (2 lần/ngày)' },
  ];

  const bmi = formData.height && formData.weight ? 
    (parseInt(formData.weight) / ((parseInt(formData.height) / 100) ** 2)).toFixed(1) : null;

  const getBMIStatus = (bmi: number) => {
    if (bmi < 18.5) return { text: 'Thiếu cân', color: 'text-blue-600' };
    if (bmi < 25) return { text: 'Bình thường', color: 'text-green-600' };
    if (bmi < 30) return { text: 'Thừa cân', color: 'text-yellow-600' };
    return { text: 'Béo phì', color: 'text-red-600' };
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center">
              <UserIcon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
            </div>
            <div className="ml-4">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Hồ sơ cá nhân
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Quản lý thông tin của bạn
              </p>
            </div>
          </div>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="btn btn-primary"
            >
              Chỉnh sửa
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tên của bạn
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed"
              placeholder="Nhập tên của bạn"
            />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
          </div>

          {/* Age */}
          <div>
            <label htmlFor="age" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tuổi
            </label>
            <input
              type="number"
              id="age"
              name="age"
              value={formData.age}
              onChange={handleInputChange}
              disabled={!isEditing}
              min="13"
              max="100"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed"
              placeholder="Nhập tuổi của bạn"
            />
            {errors.age && <p className="mt-1 text-sm text-red-600">{errors.age}</p>}
          </div>

          {/* Height and Weight */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="height" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Chiều cao (cm)
              </label>
              <input
                type="number"
                id="height"
                name="height"
                value={formData.height}
                onChange={handleInputChange}
                disabled={!isEditing}
                min="100"
                max="250"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed"
                placeholder="170"
              />
              {errors.height && <p className="mt-1 text-sm text-red-600">{errors.height}</p>}
            </div>

            <div>
              <label htmlFor="weight" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Cân nặng (kg)
              </label>
              <input
                type="number"
                id="weight"
                name="weight"
                value={formData.weight}
                onChange={handleInputChange}
                disabled={!isEditing}
                min="30"
                max="300"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed"
                placeholder="70"
              />
              {errors.weight && <p className="mt-1 text-sm text-red-600">{errors.weight}</p>}
            </div>
          </div>

          {/* BMI Display */}
          {bmi && (
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Chỉ số BMI
                </span>
                <div className="text-right">
                  <span className="text-lg font-bold text-gray-900 dark:text-white">
                    {bmi}
                  </span>
                  <span className={`ml-2 text-sm font-medium ${getBMIStatus(parseFloat(bmi)).color}`}>
                    {getBMIStatus(parseFloat(bmi)).text}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Goal */}
          <div>
            <label htmlFor="goal" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Mục tiêu luyện tập
            </label>
            <select
              id="goal"
              name="goal"
              value={formData.goal}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed"
            >
              {goalOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Activity Level */}
          <div>
            <label htmlFor="activityLevel" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Mức độ hoạt động
            </label>
            <select
              id="activityLevel"
              name="activityLevel"
              value={formData.activityLevel}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed"
            >
              {activityLevelOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Submit Button */}
          {isEditing && (
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="btn btn-secondary"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="btn btn-primary inline-flex items-center"
              >
                <SaveIcon className="w-4 h-4 mr-2" />
                Lưu thông tin
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Profile;