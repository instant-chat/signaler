import _ from 'lodash';

import server from './server';

import {injector} from '../injector';

module.exports = ['registration', 'signaler', 'rooms', 'status', server];

module.exports = {
  dependencies: ['registration', 'signaler', 'rooms', 'status'],
  definitions: {
    server: server.server
  }
};

module.exports = {
  'allInOneServer': define(['registration', 'signaler', 'rooms', 'status'])
                      (server)
};

function define(dependencies) {
  return obj => {
    const inject = injector(dependencies);

    return _.memoize(name => () => inject(obj));
  };
}

function memoize(fn) {

}