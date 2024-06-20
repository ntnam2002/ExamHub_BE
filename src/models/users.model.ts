import { Admin, Class, User } from '@/interfaces/users.interface';
import { Document, model } from 'mongoose';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, enum: ['student', 'teacher'], required: true },
  class_ids: { type: Schema.Types.ObjectId, ref: 'Class' },
  department_id: { type: Schema.Types.ObjectId, ref: 'Department' },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});
const adminSchema = new Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, required: true, default: 'admin' },
  created_at: { type: Date, default: Date.now },
});
const classSchema = new Schema({
  class_name: { type: String, required: true },
  student_ids: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

const departmentSchema = new Schema({
  department_name: { type: String, required: true },
  teacher_ids: [{ type: Schema.Types.ObjectId, ref: 'User' }],
});
export const DepartmentModel = model<Department & Document>('Department', departmentSchema);
export const UserModel = model<User & Document>('User', userSchema);
export const AdminModel = model<Admin & Document>('Admin', adminSchema);
export const ClassModel = model<Class & Document>('Class', classSchema);
