import { validate } from './env.validation';

const validEnv = {
  PORT: '4000',
  MONGODB_URI: 'mongodb://localhost:27017/flagpilot',
  REDIS_URL: 'redis://localhost:6379',
  JWT_SECRET: 'a-long-random-test-secret',
};

describe('validate (environment variables)', () => {
  it('accepts a complete and valid environment', () => {
    const config = validate(validEnv);

    expect(config.MONGODB_URI).toBe(validEnv.MONGODB_URI);
    expect(config.PORT).toBe(4000);
  });

  it('throws when JWT_SECRET is missing', () => {
    const env = { ...validEnv, JWT_SECRET: undefined };

    expect(() => validate(env)).toThrow('JWT_SECRET');
  });

  it('throws when JWT_SECRET is too short', () => {
    const env = { ...validEnv, JWT_SECRET: 'short' };

    expect(() => validate(env)).toThrow(
      'JWT_SECRET must be longer than or equal to 16 characters',
    );
  });

  it('throws when MONGODB_URI is empty', () => {
    const env = { ...validEnv, MONGODB_URI: '' };

    expect(() => validate(env)).toThrow('MONGODB_URI should not be empty');
  });

  it('throws when PORT is not a number', () => {
    const env = { ...validEnv, PORT: 'abc' };

    expect(() => validate(env)).toThrow('PORT');
  });
});
