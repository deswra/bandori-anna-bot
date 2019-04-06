const schedule = require('node-schedule');
const Discord = require('discord.js');

const bandoridb = require('./bandoridb');

module.exports = {
  async createSchedule(anna, startChannel, endChannel, logChannel) {
    const event = await bandoridb.getCurrentEvent();
    const startDate = new Date(parseInt(event.startAt));
    const endDate = new Date(parseInt(event.endAt));
    endDate.setHours(endDate.getHours()-1);
    const startSchedule = schedule.scheduleJob(startDate, () => {
      startChannel.send('@everyone: mọi người ơi, event đã bắt đầu rồi đấy!');
    });
    const endSchedule = schedule.scheduleJob(endDate, () => {
      endChannel.send('Mọi người ơi! Còn 1 giờ nữa là event sẽ kết thúc đấy!');
      setTimeout(createSchedule(anna, startChannel, endChannel, logChannel), 10000);
    })
    return logChannel.send(`@everyone Anna will post the announcements on ${startDate} and ${endDate}`);
  }
}