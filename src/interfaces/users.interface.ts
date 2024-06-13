export interface Admin {
  _id?: string;
  UserName: string;
  Password: string;
  Role: string;
  CreatedAt: Date;
}
export interface Student {
  _id?: string;
  UserName: string;
  Password: string;
  Email: string;
  Phone: string;
  Class: string;
  Department: string;
  schoolYear: string;
  CreatedAt: Date;
}
export interface Teacher {
  _id?: string;
  UserName: string;
  Password: string;
  Email: string;
  Phone: string;
  Department: string;
  CreatedAt: Date;
}
