import { createContainer } from '@createContainer';
import { randomUUID } from 'node:crypto';
import { createGraphFn } from '../../';

const start = () => ({ api: null });

const a = createContainer({ id: randomUUID(), domain: randomUUID(), start });
const b = createContainer({ id: randomUUID(), domain: a.domain, dependsOn: [a], start });
const c = createContainer({ id: randomUUID(), domain: randomUUID(), dependsOn: [b], start });
const d = createContainer({ id: randomUUID(), domain: randomUUID(), optionalDependsOn: [c], start });

test('requiredBy | containers', () => {
  const { requiredBy } = createGraphFn([a, b, c, d], {})({ view: 'containers' });

  expect(Object.keys(requiredBy([a, b]))).toStrictEqual([b.id, c.id, d.id]);
});

test('requiredBy | domains', () => {
  const { requiredBy } = createGraphFn([a, b, c, d], {})({ view: 'domains' });

  expect(Object.keys(requiredBy([a.domain, b.domain]))).toStrictEqual([c.domain, d.domain]);
});
