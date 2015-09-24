module.exports = log => {
  return (sockets, identities) => {
    const peer = namespace('peer');
    return {
      'peer offer': peer.forward('offer'),
      'peer answer': peer.forward('answer'),
      'peer candidates': peer.forward('candidates')
    };

    function namespace(name) {
      return {forward};

      function forward(fnName) {
        const messageName = `${name} ${fnName}`;

        return function* (next, data) {
          try {
            console.log(this);
            const {socket} = this;

            const {to} = data,
                  identity = identities[to];

            log(messageName, 'to', to);

            if (identity) {
              const remoteSocket = sockets[identity];

              if (remoteSocket) {
                const forwardMessage = {from: socket.identity};
                forwardMessage[fnName] = data[fnName];
                remoteSocket.emit(messageName, forwardMessage);
              }
              else {
                socket.emit('error ' + messageName, {error: `Could not find ${to}`});
              }
            }
            else {
              // need to check remote signalers
              socket.emit('error ' + messageName, {error: `Could not find ${to}`});
            }
          }
          catch (e) {
            console.log(e.stack);
            return e;
          }
        };
      }
    }
  };
};