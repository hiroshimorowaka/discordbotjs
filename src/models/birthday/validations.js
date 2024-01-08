const { parse } = require("date-fns");

module.exports.validateDate = (dateString) => {
  const date = parse(dateString, "dd/MM/yyyy", new Date());
  const isDate = !isNaN(date);

  return isDate ? date : undefined;
};
