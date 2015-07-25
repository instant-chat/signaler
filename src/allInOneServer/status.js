const name = 'status';

module.exports = {
  'status': [() => {
    console.log('lev1', name);
    return [() => {
      console.log('lev2', name);
      return {test:1};
    }];
  }]
};