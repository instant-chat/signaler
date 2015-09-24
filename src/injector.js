import _ from 'lodash';

export function injector(repository) {
  const {augment} = repository;

  return _.extend(inject, {augment});

  function inject(definition) {
    console.log({definition});

    const {length} = definition,
          target = definition[length - 1],
          dependencies = [],
          cache = {};

    for (var i = 0; i < length - 1; i++) {
      const value = definition[i];
      if (typeof value === 'string') dependencies.push(getDependency(value));
      else throw new Error('Expected String!');
    }

    return target(...dependencies);

    function getDependency(name) {
      console.log('getDependency', name);
      const cached = cache[name] = cache[name] || create(name);

      return cached;
    }

    function create(name) {
      console.log('create', name);
      return inject(repository(name));
    }
  }
}

export function makeRepository(contents) {
  const repository = {},
        externalRepositories = [];

  _.each(contents, content => _.extend(repository, content));

  return _.extend(lookup, {augment});

  function lookup(name) {
    const fn = repository[name];

console.log('lookup', name, fn);

    if (fn) return fn;

console.log({externalRepositories});
    const dependency = _.reduce(externalRepositories, (instance, repository) => instance ? instance : repository(name), undefined);

    if (dependency) return dependency;

    throw new Error(`Could not find '${name} in ${JSON.stringify(repository)}'`);
    // return repository[name];
  }

  function augment(externalRepository) {
    externalRepositories.unshift(externalRepository);
  }
}