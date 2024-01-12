const status = require("../../../status.json");

module.exports = (client) => {

  if(status.length > 1){
    console.log('more than 1')
    setInterval(() => {
      let random = Math.floor(Math.random() * status.length);
      client.user.setActivity(status[random])
    }, 15 * 1000);
  }else{
    console.log('1 activity only')
    client.user.setActivity(status[0]);
  }
 
}