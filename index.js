const nconf = require('nconf');
const path = require('path');
const async = require('async');

nconf
  .use('memory')
  .file(path.join(__dirname, 'config.json'))
  .defaults({
    device: {
      output: [],
    },
    xbee: {
      baudrate: 57600,
    },
  });

const initXbee = require('./lib/xbee/init');
const initHaar = require('./lib/haar/init');

const xbeeHandlers = require('./lib/xbee/handlers');
const haarHandlers = require('./lib/haar/handlers');

async.parallel({
  xbee: initXbee,
  haar: initHaar,
}, (err, results) => {
  if (err) {
    return console.error(`Error: ${err}`);
  }

  const xbeeAPI = results.xbee.xbeeAPI;
  const serialPort = results.xbee.serialPort;
  const haar = results.haar;

  xbeeAPI.on('frame_object', frame => {
    console.log('received sensor data');
    xbeeHandlers.handle(frame, haar);
  });

  async.each(nconf.get('devices:output'), (device, cb) => {
    haar.writeAndWait({
      room: `output:stream:${device}`,
      action: 'subscribe',
    }, () => {
      cb(null);
      console.log(`subscribed to ${device}`);
    });
  });

  return haar.on('data', data => {
    haarHandlers.handle(data, xbeeAPI, serialPort);
  });
});
