const Appointment = require("./appointmentModel");
const prestationService = require("../service/service");
const User = require("../users/userModel");

async function createAppointment(data) {
  try {
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
    const mechanics = await User.find({ role: "mecanicien" });

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

module.exports = { getAvailableMechanics, createAppointment };
