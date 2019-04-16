const schedule = require('node-schedule');
const moment = require('moment');

const bandoridb = require('./bandoridb');

module.exports = {
  async createSchedule(anna, startChannel, endChannel, logChannel) {
    const event = await bandoridb.getCurrentEvent();
    let startDate = new Date(parseInt(event.startAt));
    let endDate = new Date(parseInt(event.endAt));
    endDate.setHours(endDate.getHours() - 1);
    const startSchedule = schedule.scheduleJob(startDate, () => {
      startChannel.send(
        `@everyone: mọi người ơi, event ${event.eventName} đã bắt đầu rồi đấy!`
      );
    });
    const endSchedule = schedule.scheduleJob(endDate, () => {
      endChannel.send(
        `Mọi người ơi! Chỉ còn 1 giờ nữa là event ${
          event.eventName
        } sẽ kết thúc đấy!`
      );
      setTimeout(
        createSchedule(anna, startChannel, endChannel, logChannel),
        10000
      );
    });
    return logChannel.send(
      `Anna sẽ thông báo event ${event.eventName} vào ${moment(startDate)
        .add(7, 'hours')
        .format('H:mm - D/M/YYYY')} và ${moment(endDate)
        .add(7, 'hours')
        .format('H:mm - D/M/YYYY')}.`
    );
  }
};
