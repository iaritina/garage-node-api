const Appointment = require("./appointmentModel");
const prestationService = require("../service/service");
const userService = require("../users/userService");
const vehicleService = require("../vehicle/vehicle-service");

async function createAppointment(data) {
  try {
    const mechanic = await userService.getUserById(data.mechanic);
    const prestationsWithDetails = await Promise.all(
      data.prestations.map(async (prestation) => {
        const service = await prestationService.getById(prestation.service);
        return { ...prestation, duration: service?.duration || 0 };
      })
    );

    const totalDuration = prestationsWithDetails.reduce(
      (sum, prestation) => sum + prestation.duration,
      0
    );
    mechanic.maxWorkinghours -= totalDuration;
    await mechanic.save(); //maj de l'heure de travail

    const appointment = new Appointment(data);
    await appointment.save();
    return appointment;
  } catch (error) {
    console.error("Erreur lors de la création du rendez-vous :", error);
    throw new Error("Impossible de créer le rendez-vous.");
  }
}

async function getAvailableMechanics(date, prestations) {
  try {
    // Récupérer tous les mécaniciens
    const mechanics = await userService.getAllMechanics();

    // Calculer le nombre total de minutes nécessaires pour les prestations
    const services = await prestationService.findServicesByPrestations(
      prestations
    );

    const totalDuration = services.reduce(
      (acc, service) => acc + service.duration,
      0
    );

    // Récupérer la charge de travail actuelle des mécaniciens
    const workload = await Appointment.aggregate([
      {
        $match: {
          date: {
            $gte: new Date(`${date}T00:00:00.000Z`),
            $lt: new Date(`${date}T23:59:59.999Z`),
          },
        },
      },
      { $unwind: "$prestations" },
      {
        $lookup: {
          from: "services",
          localField: "prestations.service",
          foreignField: "_id",
          as: "serviceDetails",
        },
      },
      { $unwind: "$serviceDetails" },
      {
        $group: {
          _id: "$mechanic",
          totalHours: { $sum: "$serviceDetails.duration" },
        },
      },
    ]);

    const workloadMap = {};
    workload.forEach((w) => (workloadMap[w._id] = w.totalHours));

    const availableMechanics = mechanics.filter((m) => {
      const workedHours = workloadMap[m._id] || 0;
      const remainingHours = m.maxWorkinghours - workedHours;

      return remainingHours >= totalDuration;
    });

    return availableMechanics;
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des mécaniciens disponibles:",
      error
    );
    throw error;
  }
}

async function getAllAppointment() {
  try {
    const appointments = await Appointment.find({})
      .populate({
        path: "vehicle",
        populate: {
          path: "model",
          populate: {
            path: "brand",
          },
        },
      })
      .populate("prestations.service")
      .populate("mechanic");

    const result = appointments.flatMap((appointment) => {
      const brand = appointment.vehicle?.model?.brand?.name || "Inconnu";
      const model = appointment.vehicle?.model?.name || "Inconnu";
      const mechanic = appointment.mechanic
        ? `${appointment.mechanic.firstname} ${appointment.mechanic.lastname}`
        : "Inconnu";

      return appointment.prestations.map((prestation) => ({
        brand: brand,
        model: model,
        serviceName: prestation.service?.name || "Inconnu",
        mechanic: mechanic,
        status: appointment.status || false,
      }));
    });

    console.log(result);
    return result;
  } catch (error) {
    console.error("Erreur:", error);
  }
}

module.exports = {
  getAvailableMechanics,
  createAppointment,
  getAllAppointment,
};
