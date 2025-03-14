const userService = require("../users/userService");
const rdvModel = require("./appointmentModel");

const saveAppointmentManually = async (value) => {
  try {
    const givenDate = value.date;
    const servicesIds = value.repairs.map((repair) => repair.service);
    const mechanicIds = value.repairs.map((repair) => repair.mechanic);
    const services = value.repairs;
    const { allAvailable, unaivalable } =
      await userService.checkMechanicsAvailability(
        mechanicIds,
        services.length,
        givenDate,
        servicesIds
      );
    if (allAvailable) {
      return await rdvModel.create(value);
    } else throw new Error("Unavailable mechanic: " + unaivalable.join(", "));
  } catch (error) {
    throw new Error("Error: " + error.message);
  }
};

module.exports = {
  saveAppointmentManually,
};
