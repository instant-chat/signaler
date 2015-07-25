module.exports = {
  'signaling': ['log', log => {
    return ['sockets', 'identities', (sockets, identities) => {
      return {
        'peer': {
               'offer': forward('offer'),
              'answer': forward('answer'),
          'candidates': forward('candidates')
        }
      };

      function forward(type) {
        const name = `peer ${type}`;

        return (socket, data) => {
          const {to, from, identity} = process(socket, data);

          log(name, 'to', to);

          if (identity) {
            const remote = sockets[identity];

            if (remote) {
              const transformed = {from};

              transformed[type] = data[type]; // we can't (I think) destructure this because the value is dynamic

              remote.emit(name, transformed);
            }
            else notifyNotFound(socket, name, to);
          }
          else notifyNotFound(socket, name, to);

        };

        function process(socket, data) {
          const {to} = data,
                {identity: from} = socket,
                identity = identities[to];

          return {to, from, identity};
        }
      }

      function notifyNotFound(socket, name, to) {
        socket.emit(`error ${name}`, {error: `Could not find ${to}`});
      }
    }];
  }]
};