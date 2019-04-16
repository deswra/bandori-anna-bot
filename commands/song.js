const moment = require('moment');
const Discord = require('discord.js');

const { getSongs, getSong, getBands } = require('../functions/bestdori');

async function getSongId(songName) {
  songName = songName.toLowerCase();
  let id = 0;
  const songs = await getSongs(1);
  for (let [key, value] of Object.entries(songs)) {
    if (value.musicTitle[1] != null) {
      if (value.musicTitle[1].toLowerCase().includes(songName)) {
        id = key;
        break;
      }
    }
  }
  return id;
}

async function createSongResponse(anna, channel, songId) {
  const AinyaGasm = anna.emojis.find(emoji => emoji.name === 'AinyaGasm');
  const [song, bands] = await Promise.all([getSong(songId), getBands()]);
  let howToGet = AinyaGasm;
  let releaseDate = AinyaGasm;
  if (song.howToGet[1] != null) {
    howToGet = song.howToGet[1];
  }
  if (song.publishedAt[1] != null) {
    releaseDate = moment(parseInt(song.publishedAt[1]))
      .add(7, 'hours')
      .format('H:mm - D/M/YYYY');
  }
  const response = new Discord.RichEmbed()
    .setAuthor(`🎵  ${song.musicTitle[1]} - ${bands[song.bandId].bandName[1]}`)
    .setDescription(
      `Chart và simulator: https://bestdori.com/tool/chart/${songId}/expert`
    )
    .setThumbnail(
      `https://bestdori.com/assets/jp/musicjacket/${
        song.jacketImage
      }_rip/jacket.png`
    )
    .addField('Thời gian ra mắt', releaseDate, true)
    .addField('Độ dài', `${Math.floor(parseInt(song.length))}s`, true)
    .addField('Cách nhận', howToGet, false)
    .addField('Easy', `${song.difficulty[0].playLevel}`, true)
    .addField('Normal', `${song.difficulty[1].playLevel}`, true)
    .addField('Hard', `${song.difficulty[2].playLevel}`, true)
    .addField('Expert', `${song.difficulty[3].playLevel}`, true)
    .setFooter(`Dữ liệu được lấy từ bestdori.com`);
  if (song.difficulty[4]) {
    response.addField('Special', `${song.difficulty[4].playLevel}`, true);
  }
  return channel.send(response);
}

module.exports.run = async (anna, message, args) => {
  if (args.length == 0) {
    return message.channel.send('Bạn phải điền tên bài vào nữa...');
  }
  const searchString = args.join(' ');
  const songId = await getSongId(searchString);
  if (songId == 0) {
    return message.channel.send('Không tìm thấy bài đó...');
  }
  return createSongResponse(anna, message.channel, songId);
};

module.exports.help = {
  name: 'song'
};
