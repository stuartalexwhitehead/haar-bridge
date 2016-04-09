const nconf = require('nconf');
const xbee_api = require('xbee-api'); // eslint-disable-line camelcase
const xbeeAPI = new xbee_api.XBeeAPI({
  api_mode: 2,
});

function initXbee(cb) {
  const serialport = require('serialport');
  const SerialPort = serialport.SerialPort;

  const serialPort = new SerialPort('/dev/ttyAMA0', {
    baudrate: nconf.get('xbee:baudrate'),
    parser: xbeeAPI.rawParser(),
  });

  serialPort.on('open', err => {
    cb(err, {
      serialPort,
      xbeeAPI,
    });
  });
}

module.exports = initXbee;
