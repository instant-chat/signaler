import fs from 'fs';
import https from 'https';

import koa from 'koa.io';
import gzip from 'koa-gzip';
import logger from 'koa-logger';
import onerror from 'koa-onerror';
import body from 'koa-parse-json';

import signaler from './signaler';

import rooms from './rooms';
import stats from './stats';

require('./traceur-runtime');

(function (options) {
  const app = koa();

  app.io.set('origins', '*:*');

  onerror(app);

  app.use(logger());
  app.use(gzip());

  const signal = signaler(app);

  stats(app, signal.stats);
  rooms(app, signal.sockets, signal.identities, signal.events);

  const httpsServer = createServer(options, app);

  function createServer(options, app) {
    const {ca, key, cert, port} = options;

    const httpsServer = https.createServer({ca, key, cert}, app.callback());

    app.io.attach(httpsServer);

    httpsServer.listen(port);

    console.log(`Listening on port ${port}`);

    return httpsServer;
  }
})({
  ca: [],
  key: (function() {
          const key = process.env.key || `${process.env.PWD}/../debug/debug-localhost.key`;

          try {
            return fs.readFileSync(key);
          }
          catch (e) {
            return [
              '-----BEGIN RSA PRIVATE KEY-----',
              'MIIEogIBAAKCAQEArcUs8uVY6HPLB+nGIcqrcWthuj4ThWD9PLCt7+FNkEf5OaRt',
              'E42DQdWtfwlxUmMOgzWxOdeH+eMl7npkin/Uhu3RljWlH2qerORTwdVPlUfUnAdR',
              'OJUSmMFgjRfV9vmCQ8xJ2C8FETEYdBZPzoUeoV/Q/B2o91fG5bSIaHD69IIikKF1',
              '9o1IO6oDD7C5jqpeaq9Blj2A7G5XzXT3AuVLuBED6sXwhv3A1g5gTO+OXlycIWuR',
              'jceVH2G50NmmT7sDdSmzzMlxyDQkaTu99tLKDohEPB5jFN+xSyJGQEwrWoWL2yA3',
              'jEh1RPa/P6lwrdlnZ2T0LT/4SN/XdWscwsAnuwIDAQABAoIBAB2K9jddcp4igZQY',
              '1IyOLlOcFANb5mm4sZUN3KR5w3wSIHcCU2ENoBEjSNneOxvsp1z7VeQlloKPcbV3',
              'rXw2e2VtLULCYA5VTCDMuMitgVg53BWi0NYz0fOSfN2//ap9hP4Nz0gnxk7D8Apc',
              'eLj9vNVmutsCF+XlUHVhGgfXnXLQHVsiitrIPmOLJiqa7jfVufH7SeiaTLbutWlY',
              'IVhRHLH+ncjSoCdJhbaa2nltfOJSJh5mvsJ8m+NRar7NykFcX77mBAFkCxFlbS8E',
              '3xy14X8irctF/Z6e4U1Zf0MtWaUv0gQkPSftmUAasgIlUKirgO7UVPh8Fo+yqyqi',
              'C9ZtQ1ECgYEA2dxHnGP6oyN0gGskC+C9JR4hKFFrQI6st78InR/ertoqfxRpr//O',
              'QLtUT3Ije0amZKSv9OXGImEa2DS6ZyLlUFDLa8+Ko8hnxrXxUyuNnsgTaJYOhOTw',
              'g7Anx/owmuv77DlGPdSI/dBZuGtN7LmF6M7YSgUUZ7CjdqH6wMcvIl8CgYEAzDDu',
              'C9Badt8Z2o4ZgM/6glLqAXfS0YwLJBNxTFIU+PnDapyLAk+LeUzwiliRwQa7Tq40',
              'HjacKSzmYU5byZpTE/rswiTa5NmxSWzYOQmPAnI+tHPXU31CrNeGcyNOyDSapOro',
              '4VAzPT2n3msM6ynbVqfeU5BpWLi95dPqoJ/d0CUCgYAVgf+32s71qBxqSSmH2qoR',
              'rgXL+y3Bc9RtV3i8Olc7n+IuJY/BhlmQXm4WYchK9VCcAv40CTMkVb3Wtm3onLNS',
              '2Iccn6KqRLCqF3A5q8URdeMkohvQ1uE/vvZOcc62nLGEQqtCk2bq19TjtgQ9aJtl',
              'vnXv6Mx46CFbJuagfYmTtQKBgCW9cXILi3znFW84zmvphOKrkoa87+E9Ih4D3e/+',
              'R9QQzdaZonPF4gCEgP0BC8eCiAIt3oIrE8fkfZxEkGB9vpc1zKbBixe7SLJKhNhd',
              '9Om91esicg0DXNx3ZWlIgFouptqOdIaYfS/3glxwqs2YSesFUeleCqqUUrz04yvX',
              'AHdlAoGAXw5+xmEN+14ybhxdOUVySSulI55fj/G9xnP/qrXgQaQLYQBJk50eZObC',
              'xNwymY1WxKhiyQzr8Ym57dpmEsZUHwg8pGnfocue0cVpNANldHiz8PM0cwahq9vV',
              'JfKHtnrfhIY2QLgZ01lR5pGlZUzpEebMndOKE1aTQkW1i5TjZNQ=',
              '-----END RSA PRIVATE KEY-----'
            ].join('\n');
          }
        })(),

  cert: (function() {
          const key = process.env.cert || `${process.env.PWD}/../debug/debug-localhost.cert`;

          try {
            return fs.readFileSync(key);
          }
          catch (e) {
            return [
              '-----BEGIN CERTIFICATE-----',
              'MIICpDCCAYwCCQCFcd+JJc4mTzANBgkqhkiG9w0BAQUFADAUMRIwEAYDVQQDDAls',
              'b2NhbGhvc3QwHhcNMTQwNTIxMTEwMjM1WhcNNDExMDA1MTEwMjM1WjAUMRIwEAYD',
              'VQQDDAlsb2NhbGhvc3QwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQCt',
              'xSzy5Vjoc8sH6cYhyqtxa2G6PhOFYP08sK3v4U2QR/k5pG0TjYNB1a1/CXFSYw6D',
              'NbE514f54yXuemSKf9SG7dGWNaUfap6s5FPB1U+VR9ScB1E4lRKYwWCNF9X2+YJD',
              'zEnYLwURMRh0Fk/OhR6hX9D8Haj3V8bltIhocPr0giKQoXX2jUg7qgMPsLmOql5q',
              'r0GWPYDsblfNdPcC5Uu4EQPqxfCG/cDWDmBM745eXJwha5GNx5UfYbnQ2aZPuwN1',
              'KbPMyXHINCRpO7320soOiEQ8HmMU37FLIkZATCtahYvbIDeMSHVE9r8/qXCt2Wdn',
              'ZPQtP/hI39d1axzCwCe7AgMBAAEwDQYJKoZIhvcNAQEFBQADggEBAHT0LZDeCneK',
              'cVpK8utgi5fCqI2Uk/TAcmIih6q3oSLFwZxvOK+k2jY3X2UKxOUNXn0MvLMyspIN',
              'UfFUPgWbvHZpxTVTINuIx2P0aYj/4u8IYeyIwLVyV2JKjuNKqbt3iUQh/kixqhxY',
              'BfA5Os9bozKnxGZxXzThyj2el3pyeIyJoQAxjkkVu5+6YJ4QduqjVKl+Mw/ghnRX',
              'LL3bT6BOQL0x2XmnxqzHDje/0WVqGYTZ7Ot7/Rl5Tra8d/virV3/VutdqCLoOdhz',
              'FmKiv3NhDPpGwrUuhNL3/LQNJQTunCgVDWpwXURCTGPZBEhKbOKxgijd4uiNEJIz',
              'PIvu7BkvcwU=',
                '-----END CERTIFICATE-----'
            ].join('\n');
          }
        })(),

  port: process.env.port || 2999
});
