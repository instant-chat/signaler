module.exports = log => {
  return (sockets, identities) => {
    return {
      'peer offer': buildForwardFn('offer'),
      'peer answer': buildForwardFn('answer'),
      'peer candidates': buildForwardFn('candidates')
    };

    function buildForwardFn(fnName) {
      const messageName = `peer ${fnName}`;

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
  };
};