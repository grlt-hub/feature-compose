import { genContainerId } from '../../../../__fixtures__';
import { createContainer as __createContainer } from '../../../../createContainer';
import { upFn } from '../../index';

const start = () => ({ api: {} });

const createContainer = (id: ReturnType<typeof genContainerId> = genContainerId()) => __createContainer({ id, start });

describe('container.id is uniq', () => {
  test('happy', () => {
    expect(() => upFn([createContainer(), createContainer()])).not.toThrowError();
  });

  test('unhappy', () => {
    const id = genContainerId();

    expect(() => upFn([createContainer(id), createContainer(id)])).rejects.toThrowError(
      `Duplicate container ID found: ${id}`,
    );
  });
});