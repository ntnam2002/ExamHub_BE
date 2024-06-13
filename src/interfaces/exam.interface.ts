export interface Exam {
  _id?: string;
  examName: string;
  examType: string;
  examDate: Date;
  examDuration: number;
  examApproved: string;
  examQuestions: Question[];
  CreatedAt: Date;
}
export interface Question {
  _id?: string;
  questionContent: string;
  questionType: string;
  questionAnswers: string[];
  questionCorrectAnswer: string;
  CreatedAt: Date;
}

export interface QuestionAnswer {
  _id?: string;
  questionAnswerContent: string;
  CreatedAt: Date;
}

export interface Result {
  _id?: string;
  examId: string;
  studentId: string;
  score: number;
  submittedAt: Date;
}
