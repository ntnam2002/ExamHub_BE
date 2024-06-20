import { App } from '@/app';

import { UserRoute } from '@/api/routes/users.route';
import { ValidateEnv } from '@utils/validateEnv';
import { AdminRoute } from './api/routes/admin.route';

ValidateEnv();

const app = new App([new UserRoute(), new AdminRoute()]);

app.listen();
