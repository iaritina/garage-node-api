const appointmentModel = require("./appointmentModel");
const userService = require("../users/userService");

const saveAppointment = async (value) => {
  const requestServices = value.service;
  const specialist = userService.console.log("service dmd", requestServices);

  console.log(value);
};

module.exports = {
  saveAppointment,
};
