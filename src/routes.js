import route from 'koa-route';

module.exports = (app, signal) => {
  app.use(route.get('/stats', getStats));

  function* getStats() {
    this.body = JSON.stringify(signal);
  }
};