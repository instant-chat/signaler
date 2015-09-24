import _ from 'lodash';

import {injector} from '../injector';

import sockets from './sockets';
import identities from './identities';

module.exports = {
  'server': [
    'registration', 'signaler', 'rooms', 'status',
    (registration, signaler, rooms, status) => {
      return io => {
        const start = {io, sockets, identities};

        console.log({start});

        handler();

        return attach([
          registration,
          signaler,
          rooms,
          status
        ], io);

        function handler() {
          io.use(function*(next) {
            connect(this);
            yield* next;
            disconnect(this);
          });

          function connect(socket) {
            console.log('connect', socket.id);
          }

          function disconnect(socket) {
            console.log('disconnect', socket.id);
          }
        }

        function attach(plugins, io) {
          const coplugins = updateableRepository(start),
                inject = injector(coplugins);

          const injected = _.map(plugins, inject);

          _.each(injected, addPlugin);
          _.each(injected, attachRoutes);

          function addPlugin({signals}) {
            _.each(signals, (value, name) => coplugins.add(name, value));
          }

          function attachRoutes({routes}) {
            _.each(routes, (handler, name) => {
              if (typeof handler === 'function') {
                console.log(`Attaching route ${name}`);
                io.route(name, function* (next, ...args) {
                  console.log(`-> ${name} ${args}`);

                  try {
                    return handler(this, ...args);
                  }
                  catch (e) {
                    console.log(`error -> ${name} ${e.stack}`);
                  }
                });
              }
              else _.each(handler, (subHandler, subName) => attachRoutes(subHandler, `${name} ${subName}`));
            });
          }


          // _.each(plugins, insertPlugin);

          // function insertPlugin(plugin) {
          //   const {
          //     routes,
          //     signals
          //   } = inject(plugin);

          //   _.each(signals, addPlugin);
          //   _.each(routes, attachRoutes);

          //   function addPlugin(value, name) {
          //     coplugins.add(name, value);
          //   }

          //   function attachRoutes(handler, name) {
          //     if (typeof handler === 'function') {
          //       io.route(name, function* (next, ...args) {
          //         console.log(`-> ${name} ${args}`);

          //         try {
          //           return handler(...args);
          //         }
          //         catch (e) {
          //           console.log(`error -> ${name} ${e.stack}`);
          //         }
          //       });
          //     }
          //     else _.each(handler, (subHandler, subName) => attachRoutes(subHandler, `${name} ${subName}`));
          //   }
          // }
        }
      };
    }
  ]
};

function updateableRepository(start) {
  const contents = {};

  repository.add = add;

  return repository;

  function repository(name) {
    console.log({contents, start});
    return contents[name] || start[name];
  }

  function add(name, value) {
    console.log('adding', {name, value});
    if (contents[name]) throw new Error(`Already have ${name}!`);

    contents[name] = value;
  }
}