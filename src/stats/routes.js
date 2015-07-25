import route from 'koa-route';

module.exports = (app, log, signalStats) => {
  app.use(route.get('/stats', getStats));

  function* getStats() {
    this.body = JSON.stringify(signalStats);
  }
};