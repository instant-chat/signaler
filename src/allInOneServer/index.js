import _ from 'lodash';

import {injector, makeRepository} from '../injector';


import registration from './registration';
import rooms from './rooms';
import server from './server';
import signaler from './signaler';
import status from './status';

// these are *just* data stores
import identities from './identities';
import sockets from './sockets';

module.exports = {
  'allInOneServer': define({
    registration, signaler, rooms, status, sockets, identities
  })(server.server)
};

function define(dependencies) {
  return obj => {
    console.log({obj});
    const repository = makeRepository(dependencies);
    const inject = injector(repository);
    return externalDependencies => {
      console.log({externalDependencies, repository, obj});
      repository.augment(externalDependencies);

      return inject(obj);
    };
  };
}