import supertest from 'supertest';
import jwt from 'jsonwebtoken';
import { createApp } from '../app';
import { ENV } from '../config/env';
import { UserRole } from '@naagrik/shared-types';

let app: any;

beforeAll(() => {
  app = createApp();
});

describe('RBAC Route Security Test (Supabase)', () => {
  it('blocks regular USER from accessing CREATOR and ADMIN routes', async () => {
    const userToken = jwt.sign(
      { id: 'user_123', email: 'user@test.com', role: UserRole.USER },
      ENV.JWT_SECRET
    );

    // USER attempting Creator Dashboard
    const resCreator = await supertest(app)
      .get('/api/v1/creator/dashboard')
      .set('Authorization', `Bearer ${userToken}`);
    expect(resCreator.status).toBe(403);

    // USER attempting Admin Dashboard
    const resAdmin = await supertest(app)
      .get('/api/v1/admin/dashboard')
      .set('Authorization', `Bearer ${userToken}`);
    expect(resAdmin.status).toBe(403);
  });

  it('blocks CREATOR from accessing ADMIN routes', async () => {
    const creatorToken = jwt.sign(
      { id: 'creator_123', email: 'creator@test.com', role: UserRole.CREATOR, creatorId: 'c123' },
      ENV.JWT_SECRET
    );

    const resAdmin = await supertest(app)
      .get('/api/v1/admin/dashboard')
      .set('Authorization', `Bearer ${creatorToken}`);
    expect(resAdmin.status).toBe(403);
  });
});
