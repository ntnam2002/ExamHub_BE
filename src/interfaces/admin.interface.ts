export interface DataResponseAdmin {
  username: string;
  role: string;
  created_at: Date;
}

export interface IClass {
  class_name: string;
  teacherId: string;
  student_ids: string[];
}

export interface IDepartment {
  department_name: string;
  teacher_ids: string[];
  class_ids: string[];
}
