const axios = require('axios');
const nconf = require('nconf');
const Primus = require('primus');
const rooms = require('primus-rooms');
const responder = require('primus-responder');

function initHaar(cb) {
  const { url, username, password } = nconf.get('api');

  if (!(url && username && password)) {
    return cb('API config values were not found.');
  }

  return axios({
    method: 'post',
    baseURL: url,
    url: '/authenticate',
    data: {
      username,
      password,
    },
  })
  .then(response => {
    const { status, meta, data } = response.data;

    if (status !== 'success') {
      return cb(`API authentication error: ${meta.message}`);
    }

    const Socket = Primus.createSocket({
      transformer: 'engine.io',
      plugin: {
        rooms,
        responder,
      },
    });

    const io = new Socket(`${url}?token=${data.token}`);

    return io.on('open', () => {
      console.log('Connected to Haar API');
      cb(null, io);
    });
  });
}

module.exports = initHaar;
