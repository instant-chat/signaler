module.exports = {
  'signaler': ['log', log => {
    return ['sockets', 'identities', (sockets, identities) => {
      return {
        routes: {
          'peer': {
                 'offer': forward('offer'),
                'answer': forward('answer'),
            'candidates': forward('candidates')
          }
        }
      };

      function forward(type) {
        const name = `peer ${type}`;

        return (socket, data) => {
          const {to} = data,
                identity = identities[to];

          log(name, 'to', to);

          if (identity) {
            const remote = sockets[identity];

            if (remote) {
              const transformed = {from: socket.identity};
              transformed[type] = data[type];
              remote.emit(name, transformed);
            }
            else notifyNotFound(socket, name, to);
          }
          else notifyNotFound(socket, name, to);
        };
      }

      function notifyNotFound(socket, name, to) {
        socket.emit(`error ${name}`, {error: `Could not find ${to}`});
      }
    }];
  }]
};