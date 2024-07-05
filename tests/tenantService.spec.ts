import jwt from 'jsonwebtoken';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import request from 'supertest';
import router from '../src/infrastructure/http/routes';

let app: Koa;
const SECRET_KEY = 'S3cr37eKE!';

beforeAll(() => {
  app = new Koa();
  app.use(bodyParser());
  app.use(router.routes()).use(router.allowedMethods());
});

const generateToken = (userId: string) => {
  return jwt.sign({ userId }, SECRET_KEY, { expiresIn: '1h' });
};

describe('Tenant Service', () => {
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
});
