const fetch = require('node-fetch');

const link = 'https://api.bandori.ga/v1';

const servers = ['jp', 'en'];

module.exports = {
  async getCurrentEvent(server = 1) {
    return fetch(`${link}/${servers[server]}/event`).then(res => res.json());
  }
}