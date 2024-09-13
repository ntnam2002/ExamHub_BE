import { Admin, Class, Department, User } from '@/interfaces/users.interface';
import { Document, model } from 'mongoose';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  role: { type: String, enum: ['student', 'teacher'], required: true },
  class_names: [{ type: String }],
  department_name: { type: String },
  created_at: { type: Date, default: Date.now },
});
const adminSchema = new Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, required: true, default: 'admin' },
  created_at: { type: Date, default: Date.now },
});
const classSchema = new Schema({
  class_name: { type: String, required: true },
  teacherId: { type: String },
  student_ids: [{ type: String, ref: 'User' }],
  specialization: { type: String },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

const departmentSchema = new Schema({
  department_name: { type: String, required: true },
  teacher_ids: [{ type: String, ref: 'User' }],
  class_ids: [{ type: String, ref: 'Class' }],
  name: { type: String },
});

const loginLogsSchema = new Schema({
  user_id: { type: String, required: true },
  login_time: { type: Date, default: Date.now },
});

const academicYearSchema = new Schema({
  year: { type: String, required: true },
  name: { type: String, required: true },
  start_date: { type: Date },
  end_date: { type: Date },
  created_at: { type: Date, default: Date.now },
});

export const AcademicYearModel = model('AcademicYear', academicYearSchema);
export const LoginLogsModel = model('LoginLogs', loginLogsSchema);

export const DepartmentModel = model<Department & Document>('Department', departmentSchema);
export const UserModel = model<User & Document>('User', userSchema);
export const AdminModel = model<Admin & Document>('Admin', adminSchema);
export const ClassModel = model<Class & Document>('Class', classSchema);
