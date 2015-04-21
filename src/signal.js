import _ from 'lodash';

import signalRoutes from './signalRoutes';

module.exports = app => {
  const sockets = {},
        identities = {},
        stats = {connected: 0},
        signal = {stats};

  app.io.of('/signal').use(handleSocket);

  _.each(signalRoutes(app, sockets, identities, stats), (handler, name) => app.io.route(name, handler));

  app.io.route('register', register);

  return signal;

  function* handleSocket(next) {
    const {socket} = this;

    connect(socket);
    yield* next;
    disconnect(socket);
  }

  function connect(socket) {
    const {id} = socket;

    sockets[id] = socket;

    stats.connected++;

    log('connect', id);
  }

  function disconnect(socket) {
    const {id, identity} = socket;

    delete sockets[id];
    delete identities[identity];

    stats.connected--;

    log('disconnect', id);
  }

  function* register(next, id) {
    const {socket} = this;

    socket.identity = id;
    identities[id] = socket.id;

    log('registered', id);
  }
};

function log(...args) {
  console.log(...args);
}