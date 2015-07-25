import _ from 'lodash';

module.exports = (log, sockets, identities, signalEvents) => {
  const rooms = {};

  signalEvents.on({disconnect});

  return {
    'room join': join,
    'room leave': leave,
    'room admin': admin
  };

  function* join(next, name) {
    try {
      const {socket} = this,
            {identity} = socket;

      if (!identity) {
        log('not registered', socket);
        socket.emit('error', 'not registered!');
        return;
      }

      const room = rooms[name] = rooms[name] || {participants: {}, count: 0},
            {participants} = room;

      log(room);

      if (!participants[identity]) {
        const toNotify = _.keys(participants);

        participants[identity] = true;
        room.count++;

        const inRooms = socket.inRooms = socket.inRooms || {rooms: {}, count: 0};

        inRooms.rooms[name] = true;
        inRooms.count++;

        socket.emit('room', {name, participants});

        log('room', {name, participants});
        log(identity, 'is in rooms', inRooms);
        log('notifying', toNotify);
        _.each(participants, (x, receiverIdentity) => {
          const receiverSocketId = identities[receiverIdentity],
                receiverSocket = sockets[receiverSocketId];

          if (receiverSocket) {
            receiverSocket.emit('peer join', {identity});
            log('notifying socket', receiverSocketId);
          }
        });
      }

      log('join', arguments);
    }
    catch (e) {
      log(e.stack);
    }
  }

  function* leave(next, roomName) {
    const {socket} = this;

    leaveRoom(socket, roomName);

    log('leave', arguments);
  }

  function* admin(next, roomName) {
    log('admin', arguments);
  }

  function disconnect(socket) {
    const {inRooms, identity} = socket;

    if (inRooms) {
      _.each(_.keys(inRooms.rooms), roomName => leaveRoom(socket, roomName));
    }
  }

  function leaveRoom(socket, roomName) {
    const {inRooms, identity} = socket,
          room = rooms[roomName];

    if (inRooms) {
      if (inRooms.rooms[roomName]) {
        delete inRooms.rooms[roomName];

        inRooms.count--;

        if (inRooms.count === 0) {
          delete socket.inRooms;
        }
      }
    }

    if (room) {
      const {participants} = room;

      if (participants[identity]) {
        delete participants[identity];

        room.count--;

        const toNotify = _.keys(participants);

        _.each(toNotify, receiverIdentity => {
          const receiverSocketId = identities[receiverIdentity],
                receiverSocket = sockets[receiverSocketId];

          if (receiverSocket) {
            receiverSocket.emit('peer leave', {identity});
            log('notifying socket', receiverSocketId);
          }
        });

        log(identity, 'left room', roomName);

        if (room.count === 0) {
          delete rooms[roomName];

          log('room deleted', roomName);
        }
      }
    }
  }
};