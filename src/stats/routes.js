import route from 'koa-route';

module.exports = (app, signalStats) => {
  app.use(route.get('/stats', getStats));

  function* getStats() {
    this.body = JSON.stringify(signalStats);
  }
};