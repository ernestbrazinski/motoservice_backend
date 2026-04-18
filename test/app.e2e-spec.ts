import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('GraphQL (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(() => {
    process.env.JWT_SECRET ??=
      'e2e-jwt-secret-must-be-long-enough-for-signing-tokens!!';
  });

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
  });

  it('POST /graphql categories', () => {
    return request(app.getHttpServer())
      .post('/graphql')
      .send({ query: '{ categories { id slug name } }' })
      .expect(200)
      .expect((res) => {
        const body = res.body as {
          errors?: unknown;
          data?: { categories: unknown[] };
        };
        expect(body.errors).toBeUndefined();
        expect(body.data?.categories).toEqual([]);
      });
  });

  afterEach(async () => {
    await app.close();
  });
});
