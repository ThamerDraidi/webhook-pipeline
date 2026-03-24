import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { app } from '../main';
import { pipelines, pipelineActions, subscriptions, users } from '../db/schema';
import { db } from "../db/DBConnection";
import dotenv from 'dotenv';

dotenv.config({ path: '.env.test' });

describe('Pipeline Creation', () => {
  let token: string;

  beforeAll(async () => {
    await request(app)
      .post('/api/auth/register')
      .send({ email: 'test@ci.com', password: '123456' });
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@ci.com', password: '123456' });

    token = loginRes.body.token;
  });

  afterAll(async () => {
    await db.delete(subscriptions).execute();
    await db.delete(pipelineActions).execute();
    await db.delete(pipelines).execute();
    await db.delete(users).execute();
  });

  it('should create a new pipeline successfully', async () => {
    const pipelineData = {
      name: 'chapter_completed',
      event_type: 'chapter_completed',
      actions: [
        { action_type: 'score', config: { points: 10 }, order_index: 1 },
        { action_type: 'level', config: {}, order_index: 2 },
      ],
      subscriber_urls: ['http://localhost:4000/webhook'],
    };

    const res = await request(app)
      .post('/api/pipelines')
      .set('Authorization', `Bearer ${token}`)
      .send(pipelineData);
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.name).toBe(pipelineData.name);
  });
});