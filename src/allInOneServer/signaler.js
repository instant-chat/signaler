module.exports = {
  'signaler': ['log', log => {
    return ['sockets', 'identities', (sockets, identities) => {

      // return routes({
      //   'peer': ['forward', forward => ({
      //     'offer': forward('offer'),
      //     'answer': forward('answer'),
      //     'candidates': forward('candidates')
      //   })]
      // });


      const peer = namespace('peer');
      return {
        routes: {
          'peer': {
                 'offer': peer.forward('offer'),
                'answer': peer.forward('answer'),
            'candidates': peer.forward('candidates')
          }
        }
      };

      function namespace(name) {
        return {forward};

        function forward(type) {
          const name = `${name} ${type}`;

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
            else {
              // first need to check external signalers
              notifyNotFound(socket, name, to);
            }
          };

          function notifyNotFound(socket, name, to) {
            socket.emit(`error ${name}`, {error: `Could not find ${to}`});
          }
        }
      }
    }];
  }]
};