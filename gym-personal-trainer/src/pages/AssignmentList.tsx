import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  CalendarIcon,
  UserIcon,
  DocumentTextIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';
import { Assignment } from '../types';
import { AssignmentService } from '../services/assignmentService';

const AssignmentList: React.FC = () => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    loadAssignments();
  }, [currentPage]);

  const loadAssignments = async () => {
    try {
      setLoading(true);
      const data = await AssignmentService.getAssignments({
        page: currentPage,
        pageSize: itemsPerPage
      });
      setAssignments(data);
    } catch (error) {
      console.error('Error loading assignments:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredAssignments = assignments.filter(assignment => {
    const matchesSearch = assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         assignment.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         assignment.trainerName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === 'all' || assignment.type === filterType;
    const matchesStatus = filterStatus === 'all' || assignment.status === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Active':
        return <ClockIcon className="h-5 w-5 text-blue-500" />;
      case 'Completed':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'Expired':
        return <ExclamationCircleIcon className="h-5 w-5 text-orange-500" />;
      case 'Cancelled':
        return <XCircleIcon className="h-5 w-5 text-red-500" />;
      default:
        return <ClockIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'Completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Expired':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'Cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Exercise':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'Diet':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Reading':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'Video':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'General':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('vi-VN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const isOverdue = (dueDate: Date, status: string) => {
    return status === 'Active' && new Date() > dueDate;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Quản lý bài tập
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Tạo và quản lý bài tập cho học viên
          </p>
        </div>
        <Link
          to="/assignments/create"
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Tạo bài tập mới
        </Link>
      </div>

      {/* Filters and Search */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm bài tập..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* Type Filter */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          >
            <option value="all">Tất cả loại</option>
            <option value="Exercise">Tập luyện</option>
            <option value="Diet">Dinh dưỡng</option>
            <option value="Reading">Đọc hiểu</option>
            <option value="Video">Video</option>
            <option value="General">Tổng quát</option>
          </select>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="Active">Đang hoạt động</option>
            <option value="Completed">Hoàn thành</option>
            <option value="Expired">Quá hạn</option>
            <option value="Cancelled">Đã hủy</option>
          </select>

          {/* Refresh Button */}
          <button
            onClick={loadAssignments}
            className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            Làm mới
          </button>
        </div>
      </div>

      {/* Assignment Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAssignments.map((assignment) => (
          <div
            key={assignment.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                    {assignment.title}
                  </h3>
                  <div className="flex items-center space-x-2 mb-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(assignment.type)}`}>
                      {assignment.type}
                    </span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(assignment.status)}`}>
                      {getStatusIcon(assignment.status)}
                      <span className="ml-1">{assignment.status}</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
                {assignment.description}
              </p>

              {/* Meta Info */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <UserIcon className="h-4 w-4 mr-2" />
                  <span>HLV: {assignment.trainerName}</span>
                </div>
                
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  <span className={isOverdue(assignment.dueDate, assignment.status) ? 'text-red-500' : ''}>
                    Hạn: {formatDate(assignment.dueDate)}
                  </span>
                </div>

                {assignment.memberName && (
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <UserIcon className="h-4 w-4 mr-2" />
                    <span>Học viên: {assignment.memberName}</span>
                  </div>
                )}

                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <DocumentTextIcon className="h-4 w-4 mr-2" />
                  <span>{assignment.points} điểm</span>
                </div>
              </div>

              {/* Media Count */}
              {assignment.media.length > 0 && (
                <div className="flex items-center text-sm text-blue-600 dark:text-blue-400 mb-4">
                  <DocumentTextIcon className="h-4 w-4 mr-2" />
                  <span>{assignment.media.length} tệp đính kèm</span>
                </div>
              )}

              {/* Submissions Count */}
              {assignment.submissions.length > 0 && (
                <div className="flex items-center text-sm text-green-600 dark:text-green-400 mb-4">
                  <CheckCircleIcon className="h-4 w-4 mr-2" />
                  <span>{assignment.submissions.length} bài nộp</span>
                </div>
              )}

              {/* Actions */}
              <div className="flex space-x-2">
                <Link
                  to={`/assignments/${assignment.id}`}
                  className="flex-1 bg-blue-600 text-white text-center py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  Xem chi tiết
                </Link>
                <Link
                  to={`/assignments/${assignment.id}/edit`}
                  className="flex-1 bg-gray-600 text-white text-center py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors text-sm"
                >
                  Chỉnh sửa
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredAssignments.length === 0 && !loading && (
        <div className="text-center py-12">
          <DocumentTextIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Không tìm thấy bài tập
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            {searchTerm || filterType !== 'all' || filterStatus !== 'all'
              ? 'Thử thay đổi bộ lọc để xem thêm bài tập.'
              : 'Bắt đầu tạo bài tập đầu tiên cho học viên.'}
          </p>
          <Link
            to="/assignments/create"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Tạo bài tập mới
          </Link>
        </div>
      )}

      {/* Pagination would go here */}
    </div>
  );
};

export default AssignmentList;