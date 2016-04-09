const C = require('xbee-api').constants;

const handlers = {
  handle: (frame, haar) => {
    if (frame.type === C.FRAME_TYPE.ZIGBEE_RECEIVE_PACKET) {
      const json = JSON.parse(frame.data.toString());
      const dataArray = Object.keys(json).map(dataPoint => (
        {
          name: dataPoint,
          value: json[dataPoint],
        }
      ));

      haar.write({
        room: 'input:add',
        action: 'publish',
        payload: {
          address: frame.remote64.toUpperCase(),
          data: dataArray,
        },
      });
    }
  },
};

module.exports = Object.create(handlers);
