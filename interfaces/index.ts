export * from './response.interface';

export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  profile_picture: string;
  is_male: boolean;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
}

export interface Class {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface Student {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  profile_picture: string;
  is_male: boolean;
  class_id: string;
  class_: Class;
  created_at: string;
  updated_at: string;
}

export interface Subject {
  id: string;
  name: string;
  credit: number;
  created_at: string;
  updated_at: string;
}

export interface Course {
  id: number;
  description: string;
  semester: number;
  year: number;
  start_time: string;
  end_time: string;
  subject_id: string;
  created_at: string;
  updated_at: string;
  user_id: number;
  subject: Subject;
  enrollments: Enrollment[];
}

export interface CourseDetail extends Course {
  course_notes: CourseNote[];
  class_sessions: ClassSession[];
  grades: Grade[];
  user: User;
}

export enum EnrollmentStatus {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  DROPPED = 'DROPPED',
}

export interface Enrollment {
  course_id: number;
  student_id: string;
  created_at: string;
  updated_at: string;
  status: any;
  student: Student;
}

export interface ClassSession {
  id: number;
  start_time: string;
  end_time: string;
  course_id: number;
  course: Course;
}

export interface CourseNote {
  id: number;
  title: string;
  content: string;
  attachment: string;
  course_id: number;
  course: Course;
}

export enum AttendanceStatus {
  PRESENT = 'PRESENT',
  ABSENT = 'ABSENT',
}

export interface AttendanceRecord {
  student_id: string;
  class_session_id: number;
  status: any;
  photo_evidence: string;
  student: Student;
  class_session: ClassSession;
}

export interface Grade {
  student_id: string;
  course_id: number;
  final_grade: number;
  midterm_grade: number;
  attendance_grade: number;
  lab_grade: number;
}
