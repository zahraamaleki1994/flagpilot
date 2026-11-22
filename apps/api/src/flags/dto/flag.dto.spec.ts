import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { CreateFlagDto } from './create-flag.dto';
import { FlagKeyParamDto } from './flag-key-param.dto';
import { UpdateFlagDto } from './update-flag.dto';

async function getErrorMessages(
  dtoClass: new () => object,
  body: object,
): Promise<string[]> {
  const dto = plainToInstance(dtoClass, body);
  const errors = await validate(dto);
  return errors.flatMap((error) => Object.values(error.constraints ?? {}));
}

const KEY_FORMAT_MESSAGE =
  'key may only contain lowercase letters, numbers and dashes';

describe('CreateFlagDto', () => {
  it('accepts a valid key and description', async () => {
    const messages = await getErrorMessages(CreateFlagDto, {
      key: 'dark-mode',
      description: 'Enables the dark theme',
    });

    expect(messages).toEqual([]);
  });

  it('accepts a flag without a description', async () => {
    const messages = await getErrorMessages(CreateFlagDto, {
      key: 'new-checkout-2',
    });

    expect(messages).toEqual([]);
  });

  it('rejects a key with spaces and capital letters', async () => {
    const messages = await getErrorMessages(CreateFlagDto, {
      key: 'Dark Mode!',
    });

    expect(messages).toContain(KEY_FORMAT_MESSAGE);
  });

  it('rejects a missing key', async () => {
    const messages = await getErrorMessages(CreateFlagDto, {});

    expect(messages).toContain(KEY_FORMAT_MESSAGE);
  });
});

describe('UpdateFlagDto', () => {
  it('accepts an empty body because every field is optional', async () => {
    const messages = await getErrorMessages(UpdateFlagDto, {});

    expect(messages).toEqual([]);
  });

  it('accepts enabled set to true', async () => {
    const messages = await getErrorMessages(UpdateFlagDto, { enabled: true });

    expect(messages).toEqual([]);
  });

  it('rejects enabled when it is not a boolean', async () => {
    const messages = await getErrorMessages(UpdateFlagDto, { enabled: 'yes' });

    expect(messages).toContain('enabled must be true or false');
  });
});

describe('FlagKeyParamDto', () => {
  it('accepts a valid key', async () => {
    const messages = await getErrorMessages(FlagKeyParamDto, {
      key: 'dark-mode',
    });

    expect(messages).toEqual([]);
  });

  it('rejects a key with an underscore and capital letters', async () => {
    const messages = await getErrorMessages(FlagKeyParamDto, {
      key: 'Bad_Key',
    });

    expect(messages).toContain(KEY_FORMAT_MESSAGE);
  });
});
