const moment = require('moment');

const {
  getSongs
} = require('../functions/bestdori');

async function createUnreleasedSongResponse() {
  const songs = await getSongs(5);
  let songArray = Object.values(songs);
  const now = moment();
  let response = '**Những bài hát đã có trong game nhưng chưa được ra mắt:**\n';
  songArray.forEach(song => {
    if (song.publishedAt[1] != null) {
      const publishedTime = moment(parseInt(song.publishedAt[1]));
      if (publishedTime > now) {
        response += `:musical_keyboard: ${song.musicTitle[1]} - ${publishedTime.add(7, 'hours').format('H:mm D/M/YYYY')}\n`;
      }
    }
  })
  return response;
}

module.exports.run = async (anna, message, args) => {
  const response = await createUnreleasedSongResponse();
  return message.channel.send(response);
}

module.exports.help = {
  name: 'song'
};