import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import request from 'supertest';
import router from '../src/infrastructure/http/routes';

let app: Koa;

beforeAll(() => { 
  app = new Koa();
  app.use(bodyParser());
  app.use(router.routes()).use(router.allowedMethods());
});

describe('Authentication Service', () => {
  it('should return a token when login is successful', async () => {
    const response = await request(app.callback()).post('/auth/login').send({
      userId: 'test-user',
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
  });

  it('should return 400 if userId is not provided', async () => {
    const response = await request(app.callback()).post('/auth/login').send({});

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'User ID is required');
  });

  it('should return 401 if no authorization header is provided', async () => {
    const response = await request(app.callback()).get('/auth/protected');

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('error', 'Authorization header is required');
  });

  it('should return 401 if token is invalid', async () => {
    const response = await request(app.callback())
      .get('/auth/protected')
      .set('Authorization', 'Bearer invalid-token');

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('error', 'Invalid token');
  });

  it('should return 200 if token is valid', async () => {
    const loginResponse = await request(app.callback()).post('/auth/login').send({
      userId: 'test-user',
    });

    const token = loginResponse.body.token;

    const response = await request(app.callback())
      .get('/auth/protected')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Hello user test-user');
  });
});
