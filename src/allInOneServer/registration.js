const name = 'registration';

module.exports = {
  'registration': [
    'log',
    log => {
      log('lev1', name);

      return [() => {
        const identities = {};

        log('lev2', name);

        return {
          routes: {
            'register': register
          },
          signals: {
            identities
          },
          disconnect
        };

        function register(socket, identity) {
          socket.identity = identity;
          identities[identity] = socket.id;

          socket.emit('registered');

          // emit('register', identity);

          log('registered', identity);
        }

        function disconnect(socket) {
          const {id} = socket;

          if (id) delete identities[id];

          log('disconnected', socket, id);
        }

        // function* register(next, identity) {
        //   console.log('register', {arguments});
        //   // Need to figure out how to generalize this function so that it can be applied to all routes
        //   try {
        //     const {socket} = this;


        //     // We should verify that this socket actually owns this identity:
        //     // Require a signed message containing the identity
        //     socket.identity = identity;
        //     identities[identity] = socket.id;

        //     socket.emit('registered');

        //     emit('register', identity);

        //     log('registered', identity);
        //   }
        //   catch (e) {
        //     console.log(e.stack);
        //     return e;
        //   }
        // }
      }];
    }
  ]
};
