const C = require('xbee-api').constants;

const handlers = {
  handle: (data, xbeeAPI, serialPort) => {
    if (data.room && data.payload && data.payload.address && data.payload.output) {
      const packet = {
        type: C.FRAME_TYPE.ZIGBEE_TRANSMIT_REQUEST,
        destination64: data.payload.address,
        data: JSON.stringify(data.payload.output),
      };

      serialPort.write(xbeeAPI.buildFrame(packet));
    }
  },
};

module.exports = Object.create(handlers);
