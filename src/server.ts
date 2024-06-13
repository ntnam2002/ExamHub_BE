import { App } from '@/app';
import { AuthRoute } from '@/api/routes/auth.route';
import { UserRoute } from '@/api/routes/users.route';
import { ValidateEnv } from '@utils/validateEnv';

ValidateEnv();

const app = new App([new UserRoute(), new AuthRoute()]);

app.listen();
