const Appointment = require("./appointmentModel");
const Service = require("../service/serviceModel");
const User = require("../users/userModel");

async function getAvailableMechanics(serviceId, date, time) {
  const service = await Service.findById(serviceId);
  if (!service || !service.duration) {
    throw new Error("Service introuvable ou durée non définie.");
  }
  const [hours, minutes] = time.split(":").map(Number);
  const startTime = new Date(date);
  startTime.setHours(hours, minutes, 0, 0);

  const [serviceHours, serviceMinutes] = service.duration
    .split(":")
    .map(Number);
  const endTime = new Date(startTime);
  endTime.setHours(
    startTime.getHours() + serviceHours,
    startTime.getMinutes() + serviceMinutes
  );

  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  const sameDayAppointments = await Appointment.find({
    date: { $gte: startOfDay, $lte: endOfDay },
  });

  let busyMechanics = new Set();

  for (let appointment of sameDayAppointments) {
    const appointmentStartTime = new Date(appointment.date);

    for (let repair of appointment.repairs) {
      console.log("repair", repair);
      const repairService = await Service.findById(repair.service);
      if (!repairService || !repairService.duration) {
        console.log(
          "Service de réparation introuvable ou durée non définie :",
          repair.service
        );
        continue;
      }

      const [repairHours, repairMinutes] = repairService.duration
        .split(":")
        .map(Number);
      const appointmentEndTime = new Date(appointmentStartTime);
      appointmentEndTime.setHours(
        appointmentStartTime.getHours() + repairHours,
        appointmentStartTime.getMinutes() + repairMinutes
      );
      console.log("Heure de fin du rendez-vous existant :", appointmentEndTime);

      if (startTime < appointmentEndTime && endTime > appointmentStartTime) {
        console.log("Chevauchement détecté pour le mécanicien :", repair.user);
        busyMechanics.add(repair.user.toString());
      }
    }
  }

  console.log("Mécaniciens occupés :", [...busyMechanics]);

  const availableMechanics = await User.find({
    specialities: serviceId,
    _id: { $nin: [...busyMechanics] },
  });

  console.log("Mécaniciens disponibles :", availableMechanics);
  return availableMechanics;
}

module.exports = { getAvailableMechanics };
