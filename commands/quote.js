const Discord = require('discord.js');
const mongoose = require('mongoose');

const Quote = require('../models/quote');

const chars = require('../resources/chars');

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true
});

function getCharId(charName) {
  let id = 0;
  charName = charName.toLowerCase();
  for (let [key, value] of Object.entries(chars)) {
    if (value.name.toLowerCase() === charName) {
      id = key;
      break;
    }
  }
  return id;
}

async function addQuote(channel, charName, content) {
  let char = getCharId(charName);
  if (char == 0) {
    return channel.send(`${charName} who?`);
  }
  const quote = new Quote({
    char,
    content
  }).save(err => {
    if (err) return channel.send(err);
    return channel.send('Quote của bạn đã được add.');
  });
}

async function getQuote(channel, charName = 'random') {
  const response = new Discord.RichEmbed();
  let char = 0;
  let quote;
  if (charName != 'random') {
    char = getCharId(charName);
  }
  if (char == 0) {
    Quote.find({}, (err, foundQuotes) => {
      let index = Math.floor(Math.random() * foundQuotes.length);
      quote = foundQuotes[index];
      response
        .setAuthor(chars[quote.char].name)
        .setThumbnail(chars[quote.char].thumbnail)
        .setDescription(quote.content);
      return channel.send(response);
    });
  } else {
    Quote.find(
      {
        char
      },
      (err, foundQuotes) => {
        if (foundQuotes.length == 0) {
          return channel.send('Nhân vật đó chưa có quote nào...');
        }
        let index = Math.floor(Math.random() * foundQuotes.length);
        quote = foundQuotes[index];
        response
          .setAuthor(chars[quote.char].name)
          .setThumbnail(chars[quote.char].thumbnail)
          .setDescription(quote.content);
        return channel.send(response);
      }
    );
  }
}

module.exports.run = async (anna, message, args) => {
  if (args.length != 0) {
    let charName = args.shift();
    if (args.length > 0) {
      const content = args.join(' ');
      return addQuote(message.channel, charName, content);
    } else {
      return getQuote(message.channel, charName);
    }
  } else {
    return getQuote(message.channel);
  }
};

module.exports.help = {
  name: 'quote'
};
