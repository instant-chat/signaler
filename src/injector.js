import _ from 'lodash';

export function injector(repository) {
  return inject;

  function inject(definition) {
    console.log({definition});

    const {length} = definition,
          target = definition[length - 1],
          dependencies = [],
          cache = {};

    console.log('target', target);

    for (var i = 0; i < length - 1; i++) handle(definition[i]);

    return target(...dependencies);

    function handle(value) {
      if (typeof value === 'string') {
        dependencies.push(getDependency(value));
        // dependencies[value] = getDependency(value);
      }
      else throw new Error('Exepcted String!');
    }

    function getDependency(name) {
      const cached = cache[name] = cache[name] || create(name);

      return cached;
    }

    function create(name) {
      console.log(repository);
      return inject(repository(name));
      // return repository(name)(definition);
      // return repository(name)(definition);
    }
  }
}

export function makeRepository(contents) {
  const repository = {};

  _.each(contents, content => _.extend(repository, content));

  return name => {
    const fn = repository[name];
    console.log('fn', fn);
    if (fn) return fn;
    throw new Error(`Could not find '${name}'`);
    // return repository[name];
  };
}