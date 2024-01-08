const { query } = require("../../../infra/database.js");

async function SetBirthday(id, birth) {
  const result = await query(
    "INSERT INTO birthdays (user_id,birthday) VALUES ($1,$2) ON CONFLICT (user_id) DO UPDATE SET birthday = $2",
    [id, birth],
  );
  return result;
}

async function GetBirthdays() {
  const result = await query("SELECT * FROM birthdays");
  return result;
}

module.exports = {
  SetBirthday,
  GetBirthdays,
};
