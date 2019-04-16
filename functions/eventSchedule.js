const schedule = require('node-schedule');
const moment = require('moment');

const bandoridb = require('./bandoridb');

module.exports = {
  async createSchedule(anna, startChannel, endChannel, logChannel) {
    const event = await bandoridb.getCurrentEvent();
    let startDate = new Date(parseInt(event.startAt));
    let endDate = new Date(parseInt(event.endAt));
    let lastHourFromEndDate = new Date(endDate);
    lastHourFromEndDate.setHours(lastHourFromEndDate.getHours() - 1);
    let getNewEventDate = new Date(endDate);
    getNewEventDate.setHours(getNewEventDate.getHours() + 1);
    const startSchedule = schedule.scheduleJob(startDate, () => {
      return startChannel.send(`@everyone: mọi người ơi, event ${event.eventName} đã bắt đầu rồi đấy!`);
    });
    const endSchedule = schedule.scheduleJob(lastHourFromEndDate, () => {
      return endChannel.send(`Mọi người ơi! Chỉ còn 1 giờ nữa là event ${event.eventName} sẽ kết thúc đấy!`);
    });
    const getNewEventSchedule = schedule.scheduleJob(getNewEventDate, () => {
      return this.createSchedule(anna, startChannel, endChannel, logChannel);
    });
    return logChannel.send(
      `Anna sẽ thông báo event ${event.eventName} vào ${moment(startDate)
        .add(7, 'hours')
        .format('H:mm - D/M/YYYY')} và ${moment(lastHourFromEndDate)
        .add(7, 'hours')
        .format('H:mm - D/M/YYYY')}.`
    );
  }
};
