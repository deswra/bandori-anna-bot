const fetch = require('node-fetch');

const link = 'https://bestdori.com/api';

module.exports = {
  async getEvents(detail) {
    return fetch(`${link}/events/all.${detail}.json`).then(res => res.json());
  },
  async getEvent(id) {
    return fetch(`${link}/events/${id}.json`).then(res => res.json());
  },
  async getCards(detail) {
    return fetch(`${link}/cards/all.${detail}.json`).then(res => res.json());
  },
  async getCard(id) {
    return fetch(`${link}/cards/${id}.json`).then(res => res.json());
  },
  async getGachas(detail) {
    return fetch(`${link}/gacha/all.${detail}.json`).then(res => res.json());
  },
  async getGacha(id) {
    return fetch(`${link}/gacha/${id}.json`).then(res => res.json());
  },
  async getArchive() {
    return fetch(`${link}/archives/all.5.json`).then(res => res.json());
  },
  async getSongs(detail) {
    return fetch(`${link}/songs/all.${detail}.json`).then(res => res.json());
  },
  async getSong(id) {
    return fetch(`${link}/songs/${id}.json`).then(res => res.json());
  },
  async getComics() {
    return fetch(`${link}/comics/all.5.json`).then(res => res.json());
  },
  async getCutOff(eventId, server = 1, tier = 1) {
    return fetch(`${link}/tracker/data.php?event=${eventId}&server=${server}&tier=${tier}`).then(res => res.json()).then(json => json.data);
  },
  async getBands() {
    return fetch(`${link}/bands/all.1.json`).then(res=>res.json());
  }
};