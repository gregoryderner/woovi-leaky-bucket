import Router from 'koa-router';
import { AuthService } from '../../../../application/services/authService';

const router = new Router();

interface LoginRequestBody {
  userId: string;
}

router.post('/login', async (ctx) => {
  const body = ctx.request.body as LoginRequestBody;
  const { userId } = body;
  if (!userId) {
    ctx.status = 400;
    ctx.body = { error: 'User ID is required' };
    return;
  }

  const token = AuthService.login(userId);
  ctx.body = { token };
});

router.get('/protected', async (ctx) => {
  const authorizationHeader = ctx.headers['authorization'];
  if (!authorizationHeader) {
    ctx.status = 401;
    ctx.body = { error: 'Authorization header is required' };
    return;
  }

  const token = authorizationHeader.split(' ')[1];
  const userId = AuthService.authenticate(token);
  if (!userId) {
    ctx.status = 401;
    ctx.body = { error: 'Invalid token' };
    return;
  }

  ctx.body = { message: `Hello user ${userId}` };
});

export default router;
