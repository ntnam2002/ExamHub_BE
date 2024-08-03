export interface Result {
  exam_id: string;
  student_id: string;
  score: number;
  submitted_at: Date;
}

export interface Question {
  text: string;
  points: number;
  options: Option[];
  created_at: Date;
  updated_at: Date;
}

export interface IQuestion {
  text: string;
  options: Option[];
}

export interface Option {
  _id: string;
  text: string;
  is_correct: boolean;
}
export interface Exam {
  exam_name: string;
  description: string;
  questions: Question[];
  created_by: string;
  class_ids: string[];
  scheduled_date: Date;
  duration_minutes: number;
  created_at: Date;
  updated_at: Date;
}

export interface IExam {
  exam_name: string;
  description: string;
  questions: string[];
  created_by: string;
  class_ids: string[];
  scheduled_date: Date;
  duration_minutes: number;
}

export interface Examination {
  exam_id: string;
  question_id: string[];
  class_id: string[];
  student_id: string[];
  access_keys: string;
  started_at: Date;
  total_score: number;
  created_by: string;
  created_at: Date;
  updated_at: Date;
}
export interface IExamination {
  exam_id: string;
  question_id: string[];
  class_id: string[];
  student_id: string[];
  access_keys?: string;
  started_at?: Date;
  created_by: string;
}
export interface studentAddToExamination {
  student_ids: string[];
  class_ids: string[];
}
