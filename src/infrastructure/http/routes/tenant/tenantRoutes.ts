import Router from 'koa-router';
import { AuthService } from '../../../../application/services/authService';
import { TenantService } from '../../../../application/services/tenantService';

const router = new Router();
const tenantService = new TenantService();

router.get('/tokens', async (ctx) => {
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

  const tokens = tenantService.getTokens(userId);
  ctx.body = { tokens };
});

router.post('/consume', async (ctx) => {
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

  const success = tenantService.consumeToken(userId);
  if (success) {
    ctx.body = { message: 'Token consumed successfully' };
  } else {
    ctx.status = 429;
    ctx.body = { error: 'No tokens available' };
  }
});

router.post('/query', async (ctx) => {
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

  // Verifica se há tokens disponíveis antes de prosseguir com a consulta
  const tokensAvailable = tenantService.getTokens(userId);
  if (tokensAvailable <= 0) {
    ctx.status = 429;
    ctx.body = { error: 'No tokens available' };
    return;
  }

  const querySuccess = Math.random() > 0.5; // Simular sucesso e falha
  if (querySuccess) {
    tenantService.consumeToken(userId); // Consome um token apenas se a consulta for bem-sucedida
    ctx.body = { message: 'Query successful', data: 'Your data' };
  } else {
    tenantService.failRequest(userId); // Marca a consulta como falha
    ctx.status = 500;
    ctx.body = { error: 'Query failed' };
  }
});

export default router;
