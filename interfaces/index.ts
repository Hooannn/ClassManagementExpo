export * from './response.interface';

export interface Base {
  created_at: string;
  updated_at: string;
}
export interface User extends Base {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  profile_picture: string;
  is_male: boolean;
  is_admin: boolean;
}

export interface Class extends Base {
  id: string;
  name: string;
}

export interface Student extends Base {
  id: string;
  email: string;
  first_name: string;
  phone_number: string;
  last_name: string;
  profile_picture: string;
  is_male: boolean;
  class_id: string;
  class_: Class;
}

export interface Subject extends Base {
  id: string;
  name: string;
  credit: number;
}

export interface Course extends Base {
  id: number;
  description: string;
  semester: number;
  year: number;
  start_time: string;
  end_time: string;
  subject_id: string;
  user_id: number;
  subject: Subject;
  enrollments: Enrollment[];
}

export interface CourseDetail extends Course {
  class_sessions: ClassSession[];
  user: User;
}

export enum EnrollmentStatus {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  DROPPED = 'DROPPED',
}

export interface Enrollment extends Base {
  course_id: number;
  student_id: string;
  status: any;
  student: Student;
}

export interface ClassSession extends Base {
  id: number;
  start_time: string;
  end_time: string;
  course_id: number;
  course: Course;
}

export interface CourseNote extends Base {
  id: number;
  title: string;
  content: string;
  course_id: number;
  course: Course;
}

export enum AttendanceStatus {
  PRESENT = 'PRESENT',
  ABSENT = 'ABSENT',
}

export interface AttendanceRecord extends Base {
  student_id: string;
  class_session_id: number;
  status: any;
  photo_evidence: string;
  student: Student;
  class_session: ClassSession;
}

export interface Grade extends Base {
  student_id: string;
  course_id: number;
  final_grade: number;
  midterm_grade: number;
  attendance_grade: number;
  lab_grade: number;
  extra_grade: number;
}
