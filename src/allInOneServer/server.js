import _ from 'lodash';

module.exports = {
  'server': [
    'registration', 'signaler', 'rooms', 'status',
    (registration, signaler, rooms, status) => {
      return io => {
        return attach([
          registration,
          signaler,
          rooms,
          status
        ], io);

        function attach(plugins, io) {

          const coplugins = updateableRepository(),
                inject = injector(coplugins);

          _.each(plugins, plugin => {
            const {routes, signals} = inject(plugin)(io);

            _.each(signals, addPlugin);

            _.each(routes, attachRoutes);
          });

          function addPlugin(value, name) {
            coplugins.add(name, value);
          }

          function attachRoutes(handler, name) {
            if (typeof handler === 'function') {
              io.route(name, function* (next, ...args) {
                console.log(`-> ${name} ${args}`);

                try {
                  return handler(...args);
                }
                catch (e) {
                  console.log(e.stack);
                  return e;
                }
              });
            }
            else _.each(handler, (subHandler, subName) => attachRoutes(subHandler, `${name} ${subName}`));
          }
        }
      };
    }
  ]
};

function updateableRepository() {
  const contents = {};

  function repository(name) {
    return contents[name];
  }

  function add(name, value) {
    if (contents[name]) throw new Error(`Already have ${name}!`);

    contents[name] = value;
  }

  repository.add = add;

  return repository;
}