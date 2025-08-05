import { Assignment, AssignmentSubmission, CreateAssignmentData, CreateSubmissionData } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://localhost:7266/api';

export class AssignmentService {
  // Get all assignments with optional filters
  static async getAssignments(params?: {
    trainerId?: string;
    memberId?: string;
    isPublic?: boolean;
    page?: number;
    pageSize?: number;
  }): Promise<Assignment[]> {
    const searchParams = new URLSearchParams();
    
    if (params?.trainerId) searchParams.append('trainerId', params.trainerId);
    if (params?.memberId) searchParams.append('memberId', params.memberId);
    if (params?.isPublic !== undefined) searchParams.append('isPublic', params.isPublic.toString());
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.pageSize) searchParams.append('pageSize', params.pageSize.toString());

    const url = `${API_BASE_URL}/assignments${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch assignments: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.map((assignment: any) => ({
      ...assignment,
      dueDate: new Date(assignment.dueDate),
      createdAt: new Date(assignment.createdAt),
      updatedAt: assignment.updatedAt ? new Date(assignment.updatedAt) : undefined,
      submissions: assignment.submissions?.map((submission: any) => ({
        ...submission,
        submittedAt: new Date(submission.submittedAt),
        reviewedAt: submission.reviewedAt ? new Date(submission.reviewedAt) : undefined,
      })) || []
    }));
  }

  // Get assignment by ID
  static async getAssignmentById(id: string): Promise<Assignment> {
    const response = await fetch(`${API_BASE_URL}/assignments/${id}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch assignment: ${response.statusText}`);
    }
    
    const assignment = await response.json();
    return {
      ...assignment,
      dueDate: new Date(assignment.dueDate),
      createdAt: new Date(assignment.createdAt),
      updatedAt: assignment.updatedAt ? new Date(assignment.updatedAt) : undefined,
      submissions: assignment.submissions?.map((submission: any) => ({
        ...submission,
        submittedAt: new Date(submission.submittedAt),
        reviewedAt: submission.reviewedAt ? new Date(submission.reviewedAt) : undefined,
      })) || []
    };
  }

  // Create new assignment
  static async createAssignment(data: CreateAssignmentData): Promise<Assignment> {
    const response = await fetch(`${API_BASE_URL}/assignments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Failed to create assignment: ${response.statusText}`);
    }

    const assignment = await response.json();
    return {
      ...assignment,
      dueDate: new Date(assignment.dueDate),
      createdAt: new Date(assignment.createdAt),
      updatedAt: assignment.updatedAt ? new Date(assignment.updatedAt) : undefined,
      submissions: []
    };
  }

  // Upload media for assignment
  static async uploadAssignmentMedia(
    assignmentId: string, 
    file: File, 
    description?: string
  ): Promise<{ message: string; fileName: string; filePath: string }> {
    const formData = new FormData();
    formData.append('file', file);
    if (description) {
      formData.append('description', description);
    }

    const response = await fetch(`${API_BASE_URL}/assignments/${assignmentId}/media`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Failed to upload media: ${response.statusText}`);
    }

    return response.json();
  }

  // Create submission for assignment
  static async createSubmission(data: CreateSubmissionData): Promise<AssignmentSubmission> {
    const response = await fetch(`${API_BASE_URL}/assignments/submissions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Failed to create submission: ${response.statusText}`);
    }

    const submission = await response.json();
    return {
      ...submission,
      submittedAt: new Date(submission.submittedAt),
      reviewedAt: submission.reviewedAt ? new Date(submission.reviewedAt) : undefined,
    };
  }

  // Upload media for submission
  static async uploadSubmissionMedia(
    submissionId: string,
    file: File,
    description?: string
  ): Promise<{ message: string; fileName: string; filePath: string }> {
    const formData = new FormData();
    formData.append('file', file);
    if (description) {
      formData.append('description', description);
    }

    const response = await fetch(`${API_BASE_URL}/assignments/submissions/${submissionId}/media`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Failed to upload submission media: ${response.statusText}`);
    }

    return response.json();
  }
}