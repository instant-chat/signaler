import routes from './routes';

module.exports = (app, log, signalStats) => {
  routes(app, log, signalStats);
};