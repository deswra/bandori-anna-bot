const Discord = require('discord.js');
const moment = require('moment');

const {
  getCurrentEvent
} = require('../functions/bandoridb');
const {
  getEvents,
  getEvent,
  getCutOff,
  getArchive
} = require('../functions/bestdori');
const {
  eventDuration,
  capitalizeFirstLetter
} = require('../functions/helpers');
const types = require('../resources/types');
const chars = require('../resources/chars');

const tier = ['1', '10', '100', '1000'];

async function searchEvent(searchString) {
  const events = await getEvents(1);
  const eventArray = Object.values(events);
  let eventId = 0;
  const foundEvent = eventArray.find(event => {
    eventId++;
    if (event.eventName[1] !== null) {
      return event.eventName[1].toLowerCase().includes(searchString);
    }
    return false;
  })
  if (foundEvent === undefined) return 0;
  return eventId;
}

async function createCurrentEventResponse() {
  const currentEvent = await getCurrentEvent();
  const [t100Cutoff, t1000Cutoff] = await Promise.all([getCutOff(currentEvent.eventId, 1, 0), getCutOff(currentEvent.eventId, 1, 1)]);
  // Create description for event time
  const now = moment();
  let description = '';
  let timeLeft;
  let startDate = moment(parseInt(currentEvent.startAt));
  let endDate = moment(parseInt(currentEvent.endAt));
  if (now < startDate) {
    timeLeft = eventDuration(startDate, now);
    description += `*Bắt đầu:* ${startDate.add(7,'hours').format('YYYY-M-D H:mm')} (còn ${timeLeft})\n`;
  } else {
    description += `*Bắt đầu:* ${startDate.add(7,'hours').format('YYYY-M-D H:mm')}\n`;
  }
  timeLeft = eventDuration(endDate, now);
  description += `*Kết thúc:* ${endDate.add(7,'hours').format('YYYY-M-D H:mm')} (còn ${timeLeft})`;
  // Create char bonuses string
  let charBonuses = '';
  currentEvent.detail.characters.forEach(char => {
    charBonuses += `${chars[char.characterId].emoji} `;
  })
  const response = new Discord.RichEmbed()
    .setColor(types[currentEvent.detail.attributes[0].attribute].color)
    .setAuthor(currentEvent.eventName, types[currentEvent.detail.attributes[0].attribute].icon)
    .setDescription(description)
    .addField('Loại', capitalizeFirstLetter(currentEvent.eventType), true)
    .addField('Nhân vật', charBonuses, true)
    .setImage(`https://res.bandori.ga/assets-en/homebanner_rip/banner_event${currentEvent.eventId}.png`)
    .setFooter('Dữ liệu được lấy từ bandori.ga và bestdori.com.');
  if (t100Cutoff.length > 0) {
    const lastT100Cutoff = t100Cutoff.pop();
    response.addField('Top 100', `${lastT100Cutoff.ep} (cập nhật lúc ${moment(parseInt(lastT100Cutoff.time)*1000).add(7, 'hours').format('YYYY-M-D H:mm')})`);
  }
  if (t1000Cutoff.length > 0) {
    const lastT1000Cutoff = t1000Cutoff.pop();
    response.addField('Top 1000', `${lastT1000Cutoff.ep} (cập nhật lúc ${moment(parseInt(lastT1000Cutoff.time)*1000).add(7, 'hours').format('YYYY-M-D H:mm')})`);
  }
  return response;
}

async function createFutureEventResponse(eventId) {
  const event = await getEvent(eventId);
  // Create description for event time
  const now = moment();
  let description = '';
  let startDate = moment(parseInt(event.startAt[1]));
  let endDate = moment(parseInt(event.endAt[1]));
  let timeLeft = eventDuration(startDate, now);
  description += `*Bắt đầu:* ${startDate.add(7,'hours').format('YYYY-M-D H:mm')} (còn ${timeLeft})\n`;
  description += `*Kết thúc:* ${endDate.add(7,'hours').format('YYYY-M-D H:mm')}`;
  // Create char bonuses string
  let charBonuses = '';
  event.characters.forEach(char => {
    charBonuses += `${chars[char.characterId].emoji} `;
  });
  const response = new Discord.RichEmbed()
    .setColor(types[event.attributes[0].attribute].color)
    .setAuthor(event.eventName[1], types[event.attributes[0].attribute].icon)
    .setDescription(description)
    .addField('Loại', capitalizeFirstLetter(event.eventType), true)
    .addField('Nhân vật', charBonuses, true)
    .setImage(`https://res.bandori.ga/assets-en/homebanner_rip/banner_event${eventId}.png`)
    .setFooter('Dữ liệu được lấy từ bandori.ga và bestdori.com.');
  return response;
}

async function createPastEventResponse(eventId) {
  const event = await getEvent(eventId);
  const archive = await getArchive();
  // Create description for event time
  let description = '';
  let startDate = moment(parseInt(event.startAt[1]));
  let endDate = moment(parseInt(event.endAt[1]));
  description += `*Bắt đầu:* ${startDate.add(7,'hours').format('YYYY-M-D H:mm')}\n`;
  description += `*Kết thúc:* ${endDate.add(7,'hours').format('YYYY-M-D H:mm')}`;
  let duration = moment.duration(endDate - startDate).asHours();
  let charBonuses = '';
  event.characters.forEach(char => {
    charBonuses += `${chars[char.characterId].emoji} `;
  });
  const response = new Discord.RichEmbed()
    .setColor(types[event.attributes[0].attribute].color)
    .setAuthor(event.eventName[1], types[event.attributes[0].attribute].icon)
    .setDescription(description)
    .addField('Loại', capitalizeFirstLetter(event.eventType), true)
    .addField('Nhân vật', charBonuses, true)
    .setImage(`https://res.bandori.ga/assets-en/homebanner_rip/banner_event${eventId}.png`)
    .setFooter('Dữ liệu được lấy từ bandori.ga và bestdori.com.');
  tier.forEach(rank => {
    if (archive[eventId].cutoff[1][rank]){
      response.addField(`Rank ${rank}`, archive[eventId].cutoff[1][rank], true);
      response.addField(`Rank ${rank}/h`, Math.floor(archive[eventId].cutoff[1][rank]/duration), true);
    }
  })
  return response;
}

module.exports.run = async (anna, message, args) => {
  let response = '';
  if (args.length == 0) {
    response = await createCurrentEventResponse();
  } else {
    const currentEvent = await getCurrentEvent();
    let eventId = parseInt(args[0]);
    if (isNaN(eventId)) {
      const searchString = args.join(' ');
      eventId = await searchEvent(searchString);
      if (eventId == 0) {
        return message.channel.send("Anna không tìm thấy event đó...");
      }
    }
    if (eventId > currentEvent.eventId) {
      response = await createFutureEventResponse(eventId);
    } else if (eventId == currentEvent.eventId) {
      response = await createCurrentEventResponse();
    } else {
      response = await createPastEventResponse(eventId);
    }
  }
  return message.channel.send(response);
};

module.exports.help = {
  name: 'event'
};