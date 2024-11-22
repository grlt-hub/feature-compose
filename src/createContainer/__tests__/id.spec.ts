import { randomUUID } from 'node:crypto';
import { createContainer } from '../index';

const start = () => ({ api: {} });

describe('container.id not empty string', () => {
  test('happy', () => {
    expect(() => createContainer({ id: randomUUID(), domain: randomUUID(), start })).not.toThrowError();
  });

  test('unhappy', () => {
    expect(() =>
      createContainer({
        // @ts-expect-error container.id cannot be an empty string
        id: '',

        domain: randomUUID(),
        start: () => ({ api: {} }),
      }),
    ).toThrowError('Container ID cannot be an empty string.');
  });
});
