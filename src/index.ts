import { createStore, type Store } from 'effector';

type AnyObject = Record<string, unknown>;
type NonEmptyTuple<T = unknown> = [T, ...T[]];
type Status = 'idle' | 'pending' | 'done' | 'fail' | 'off';
type StartResult<T> = Promise<T> | T;
type EnableResult = Promise<boolean> | boolean;

type Container<Id extends string, API extends AnyObject> = {
  id: Id;
  $status: Store<Status>;
  api: API;
};
type AnyContainer = Container<any, any>;

type ExtractDeps<D extends Container<string, AnyObject>[]> = {
  [K in D[number] as K['id']]: K['api'];
};

const ERROR_EMPTY_STRING_FEATURE_ID = 'Container ID cannot be an empty string.';

// todo: id's of deps and optDeps must be uniq
// todo: resolve features graph
// todo: compose fn to wrap em all | like basic compose fn + passing api (no need to save em all. just reverse pipe)
// todo: use nanoid for ids inside unit tests (not for types tests)
// todo: think about dynamic feature stop
type Params<
  Id extends string,
  API extends AnyObject,
  Deps extends NonEmptyTuple<AnyContainer> | void = void,
  OptionalDeps extends NonEmptyTuple<AnyContainer> | void = void,
> = '' extends Id
  ? typeof ERROR_EMPTY_STRING_FEATURE_ID
  : Deps extends void
    ? OptionalDeps extends void
      ? {
          id: Id;
          onStart: () => StartResult<Pick<Container<Id, API>, 'api'>>;
          enable?: () => EnableResult;
        }
      : {
          id: Id;
          optionalDependsOn: Exclude<OptionalDeps, void>;
          onStart: (
            _: void,
            optionalDeps: Partial<ExtractDeps<Exclude<OptionalDeps, void>>>,
          ) => StartResult<Pick<Container<Id, API>, 'api'>>;
          enable?: (_: void, optionalDeps: Partial<ExtractDeps<Exclude<OptionalDeps, void>>>) => EnableResult;
        }
    : OptionalDeps extends void
      ? {
          id: Id;
          dependsOn: Exclude<Deps, void>;
          onStart: (deps: ExtractDeps<Exclude<Deps, void>>) => StartResult<Pick<Container<Id, API>, 'api'>>;
          enable?: (deps: ExtractDeps<Exclude<Deps, void>>) => EnableResult;
        }
      : {
          id: Id;
          dependsOn: Exclude<Deps, void>;
          optionalDependsOn: Exclude<OptionalDeps, void>;
          onStart: (
            deps: ExtractDeps<Exclude<Deps, void>>,
            optionalDeps: Partial<ExtractDeps<Exclude<OptionalDeps, void>>>,
          ) => StartResult<Pick<Container<Id, API>, 'api'>>;
          enable?: (
            deps: ExtractDeps<Exclude<Deps, void>>,
            optionalDeps: Partial<ExtractDeps<Exclude<OptionalDeps, void>>>,
          ) => EnableResult;
        };

const createContainer = <
  Id extends string,
  API extends AnyObject,
  Deps extends NonEmptyTuple<AnyContainer> | void = void,
  OptionalDeps extends NonEmptyTuple<AnyContainer> | void = void,
>(
  params: Params<Id, API, Deps, OptionalDeps>,
): Container<Id, API> => {
  const $status = createStore<Status>('idle');

  if (params === ERROR_EMPTY_STRING_FEATURE_ID) {
    throw new Error(ERROR_EMPTY_STRING_FEATURE_ID);
  }

  return {
    id: params.id,
    $status,
    api: {} as API,
  };
};

export { createContainer };
