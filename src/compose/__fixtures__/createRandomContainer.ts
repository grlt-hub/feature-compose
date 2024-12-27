import { createContainer, type AnyContainer } from '@createContainer';
import { randomUUID } from 'node:crypto';

type Overrides = Partial<Pick<AnyContainer, 'domain' | 'dependsOn' | 'optionalDependsOn' | 'id'>>;

export const createRandomContainer = (overrides: Overrides = {}): AnyContainer =>
  createContainer({
    // @ts-expect-error
    id: randomUUID(),
    domain: randomUUID(),
    start: () => ({ api: null }),
    ...overrides,
  });
