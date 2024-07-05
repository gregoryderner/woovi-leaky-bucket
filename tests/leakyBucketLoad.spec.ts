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

const generateToken = (userId: string) => {
  return jwt.sign({ userId }, SECRET_KEY, { expiresIn: '1h' });
};

describe('Leaky Bucket Load Test', () => {
  let token: string;

  beforeAll(() => {
    token = generateToken('test-user');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should handle multiple requests and enforce the leaky bucket strategy', async () => {
    const requests = [];
    for (let i = 0; i < 20; i++) {
      requests.push(
        request(app.callback())
          .post('/tenant/query')
          .set('Authorization', `Bearer ${token}`)
      );
    }

    const responses = await Promise.all(requests);

    const successResponses = responses.filter(res => res.status === 200).length;
    const failResponses = responses.filter(res => res.status === 500).length;
    const tooManyRequestsResponses = responses.filter(res => res.status === 429).length;

    // Verify that we have the correct number of responses
    expect(successResponses + failResponses + tooManyRequestsResponses).toBe(20);

    // There should be at least 10 429 responses as tokens are limited to 10 per user
    expect(tooManyRequestsResponses).toBeGreaterThanOrEqual(10);
  });
});
