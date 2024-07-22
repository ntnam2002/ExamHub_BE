import { App } from '@/app';

import { UserRoute } from '@/api/routes/users.route';
import { ValidateEnv } from '@utils/validateEnv';
import { AdminRoute } from './api/routes/admin.route';
import { ExamRoute } from './api/routes/exam.route';

ValidateEnv();

const app = new App([new UserRoute(), new AdminRoute(), new ExamRoute()]);

app.listen();
