import { ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { RegisterDto } from '../auth/dto/register.dto';
import { createValidationPipe } from './validation-pipe';

const metadata: ArgumentMetadata = { type: 'body', metatype: RegisterDto };

async function getErrorMessages(body: object): Promise<string[]> {
  try {
    await createValidationPipe().transform(body, metadata);
  } catch (error) {
    if (error instanceof BadRequestException) {
      const response = error.getResponse() as { message: string[] };
      return response.message;
    }
    throw error;
  }
  return [];
}

describe('createValidationPipe', () => {
  it('turns a valid body into a RegisterDto instance', async () => {
    const result: unknown = await createValidationPipe().transform(
      { email: 'zahra@test.com', password: 'Demo1234' },
      metadata,
    );

    expect(result).toBeInstanceOf(RegisterDto);
  });

  it('rejects unknown fields with a clear message', async () => {
    const messages = await getErrorMessages({
      email: 'zahra@test.com',
      password: 'Demo1234',
      role: 'admin',
    });

    expect(messages).toEqual(['property role should not exist']);
  });

  it('returns every error message at once', async () => {
    const messages = await getErrorMessages({ email: 'hello', password: '1' });

    expect(messages).toEqual(
      expect.arrayContaining([
        'email must be a valid email address',
        'password must be at least 8 characters long',
      ]),
    );
  });
});
