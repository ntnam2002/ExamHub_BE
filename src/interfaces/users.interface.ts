export interface User {
  username: string;
  password: string;
  email: string;
  role: string;
  class_ids: string;
  department_id: string;
}

export interface UpdateUser {
  username: string;
  password: string;
  email: string;
  role: string;
  class_ids: string;
  department_id: string;
}
export interface Admin {
  username: string;
  password: string;
  role: string;
  created_at: Date;
}
export interface IAdmin {
  username: string;
  password: string;
}
export interface IUser {
  username: string;
  password: string;
}
export interface IUser {
  username: string;
  password: string;
  email: string;
  role: string;
  class_ids: string;
  department_id: string;
}
export interface Class {
  class_name: string;
  student_ids: string[];
  created_at: Date;
  updated_at: Date;
}

export interface Department {
  department_name: string;
  teacher_ids: string[];
}
