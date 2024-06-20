export interface Result {
  exam_id: string;
  student_id: string;
  score: number;
  submitted_at: Date;
}

export interface Question {
  text: string;
  options: Option[];
  created_at: Date;
  updated_at: Date;
}

export interface Option {
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
