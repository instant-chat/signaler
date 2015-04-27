import _ from 'lodash';

import routes from './routes';

module.exports = (app, sockets, identities, signalEvents) => {
  const r = routes(log, sockets, identities, signalEvents);
  _.each(r, (handler, name) => app.io.route(name, handler));

  console.log(r);

  return {};
};

function log(...args) {
  // console.log(...args);
}