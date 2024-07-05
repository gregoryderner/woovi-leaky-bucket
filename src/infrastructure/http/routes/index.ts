import Router from 'koa-router';
import authRoutes from './auth/authRoutes';
import tenantRoutes from './tenant/tenantRoutes';

const router = new Router();

router.use('/auth', authRoutes.routes(), authRoutes.allowedMethods());
router.use('/tenant', tenantRoutes.routes(), tenantRoutes.allowedMethods());

router.get('/', async (ctx) => {
  ctx.body = 'Hello World!';
});

export default router;
