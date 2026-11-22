import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { RegisterDto } from './register.dto';

async function getErrorMessages(body: object): Promise<string[]> {
  const dto = plainToInstance(RegisterDto, body);
  const errors = await validate(dto);
  return errors.flatMap((error) => Object.values(error.constraints ?? {}));
}

describe('RegisterDto', () => {
  it('accepts a valid email and password', async () => {
    const messages = await getErrorMessages({
      email: 'zahra@test.com',
      password: 'Demo1234',
    });

    expect(messages).toEqual([]);
  });

  it('rejects an invalid email', async () => {
    const messages = await getErrorMessages({
      email: 'hello',
      password: 'Demo1234',
    });

    expect(messages).toContain('email must be a valid email address');
  });

  it('rejects a password shorter than 8 characters', async () => {
    const messages = await getErrorMessages({
      email: 'zahra@test.com',
      password: '1234',
    });

    expect(messages).toContain('password must be at least 8 characters long');
  });

  it('rejects a missing password', async () => {
    const messages = await getErrorMessages({ email: 'zahra@test.com' });

    expect(messages).toContain('password must be at least 8 characters long');
  });
});
