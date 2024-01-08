const { createClient } = require("redis");
const pino = require('../logger')


const client = createClient();
client.on("error", (err) => pino.error("Redis.js -> Redis Client Error", err));

client.on("connect", () => {
  pino.info("Redis.js -> Redis Client Connected")
});
client.connect();

const getClient = () => {
  return client;
};

async function addListCache(key, value = [], expire = 600, exp_option = "NX") {
  client.expire(key, expire, exp_option);
  for(word of value){
    await client.sAdd(key, word);
  }
  return true;
}

async function removeListCache(key, value = [], expire = 600, exp_option = "NX") {
  client.expire(key, expire, exp_option);
  for(word of value){
    await client.sRem(key, value);
  }
  return true
}

async function hasListCached(key, value = []) {
  for(i of value){
    const isMember = await client.sIsMember(key, value);
    if(isMember){
      return true
    }
  }
  return false;
}

async function itemsListCached(key) {
  const members = await client.sMembers(key);
  return members;
}

module.exports = {
  redis: getClient(),
  removeListCache,
  addListCache,
  hasListCached,
  itemsListCached,
};
