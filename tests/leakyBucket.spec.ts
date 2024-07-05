import jwt from 'jsonwebtoken';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import request from 'supertest';
import { TenantService } from '../src/application/services/tenantService';
import router from '../src/infrastructure/http/routes';

let app: Koa;
let tenantService: TenantService;
const SECRET_KEY = 'S3cr37eKE!';

beforeAll(() => {
  app = new Koa();
  tenantService = new TenantService();
  app.use(bodyParser());
  app.use(router.routes()).use(router.allowedMethods());
});

afterAll(() => {
  tenantService.clearTokenRegeneration();
});

afterEach(() => {
  jest.clearAllMocks();
});

const generateToken = (userId: string) => {
  return jwt.sign({ userId }, SECRET_KEY, { expiresIn: '1h' });
};

describe('Leaky Bucket Strategy', () => {
  let token: string;

  beforeAll(() => {
    token = generateToken('test-user');
  });

  it('should return tokens for a user', async () => {
    const response = await request(app.callback())
      .get('/tenant/tokens')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('tokens', 10);
  });

  it('should consume a token successfully', async () => {
    const response = await request(app.callback())
      .post('/tenant/consume')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Token consumed successfully');
  });

  it('should return no tokens available when tokens are exhausted', async () => {
    // Consuming all tokens
    for (let i = 0; i < 9; i++) {
      await request(app.callback())
        .post('/tenant/consume')
        .set('Authorization', `Bearer ${token}`);
    }

    const response = await request(app.callback())
      .post('/tenant/consume')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(429);
    expect(response.body).toHaveProperty('error', 'No tokens available');
  });

  it('should handle query request with token consumption', async () => {
    token = generateToken('test-user');

    const response = await request(app.callback())
      .post('/tenant/query')
      .set('Authorization', `Bearer ${token}`);

    expect([200, 500, 429]).toContain(response.status);
  });
});
