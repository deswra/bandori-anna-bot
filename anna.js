if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const Discord = require('discord.js');
const fs = require('fs');
const anna = new Discord.Client();

const {createSchedule} = require('./functions/eventSchedule');

const Channels = {};
// Read commands files

anna.commands = new Discord.Collection();

fs.readdir('./commands/', (err, files) => {
  if (err) console.log(err);
  let jsfile = files.filter(f => f.split('.').pop() == 'js');
  if (jsfile.length <= 0) {
    console.log("I didn't see any commands...");
    return;
  }
  jsfile.forEach((f, i) => {
    let props = require(`./commands/${f}`);
    console.log(`${f} loaded!`);
    anna.commands.set(props.help.name, props);
  });
});

// Start up

anna.once('ready', async () => {
  anna.user.setActivity(process.env.GAME, {
    type: 'PLAYING'
  });
  Channels.startChannel = anna.channels.get(process.env.ANNOUNCEMENT_CHANNEL);
  Channels.endChannel = anna.channels.get(process.env.GENERAL_CHANNEL);
  Channels.logChannel = anna.channels.get(process.env.LOG_CHANNEL);
  createSchedule(anna, Channels.startChannel, Channels.endChannel, Channels.logChannel);
  Channels.logChannel.send('Anna is ready!');
});

// Message event

anna.on('message', async message => {
  if (message.author.bot) return;
  if (message.channel.type == 'dm') return;

  let prefix = process.env.PREFIX;
  if (!message.content.startsWith(prefix, 0)) return;
  let messageArray = message.content.slice(prefix.length).split(' ');
  let cmd = messageArray[0];
  let args = messageArray.slice(1);

  let commandFile = anna.commands.get(cmd);
  if (commandFile) commandFile.run(anna, message, args);
})

anna.login(process.env.TOKEN);