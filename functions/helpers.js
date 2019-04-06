const moment = require('moment');

module.exports = {
  eventDuration(a, b) {
    let duration = moment.duration(a - b);
    let months = Math.floor(duration.asMonths());
    let days = duration.days();
    let hours = duration.hours();
    let minutes = duration.minutes();
    let seconds = duration.seconds();
    let response = '';
    if (months > 0) {
      response += `${months} tháng `;
    }
    if (days > 0) {
      response += `${days} ngày `;
    }
    if (months == 0) {
      if (hours > 0) {
        response += `${hours} giờ `;
      }
    }
    if (months == 0 && days == 0) {
      if (minutes > 0) {
        response += `${minutes} phút `;
      }
    }
    if (months == 0 && days == 0 && hours == 0) {
      if (seconds > 0) {
        response += `${seconds} giây `;
      }
    }
    return response.slice(0, -1);
  },
  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
}