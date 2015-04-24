import _ from 'lodash';
import emitter from 'es-emitter';

import routes from './routes';

module.exports = app => {
  const {emit, on, off} = emitter()();

  console.log(emit, on, off);

  const sockets = {},
        identities = {},
        stats = {connected: 0};

  const signal = app.io.of('/signal');

  signal.use(handleError);
  signal.use(handleSocket);

  _.each(routes(log, sockets, identities, stats), (handler, name) => app.io.route(name, handler));

  app.io.route('register', register);

  return {stats, events: {on, off}, sockets, identities};

  function* handleError(next) {
    try {
      yield next;
    }
    catch (e) {
      log(e.stack);
    }
  }

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

    emit('connect', socket);

    log('connect', id);
  }

  function disconnect(socket) {
    const {id, identity} = socket;

    delete sockets[id];
    delete identities[identity];

    stats.connected--;

    emit('disconnect', socket);

    log('disconnect', id);
  }

  function* register(next, identity) {
    const {socket} = this;

    // We should verify that this socket actually owns this identity:
    // Require a signed message containing the identity

    socket.identity = identity;
    identities[identity] = socket.id;

    socket.emit('registered');

    emit('register', identity);

    log('registered', identity);
  }
};

function log(...args) {
  console.log(...args);
}