const Appointment = require("./appointmentModel");
const prestationService = require("../service/service");
const userService = require("../users/userService");
const interventionService = require("../intervention/interventionService");

async function createAppointment(appointmentData, interventionData) {
  try {
    const mechanic = await userService.getUserById(appointmentData.mechanic);
    const prestationsWithDetails = await Promise.all(
      appointmentData.prestations.map(async (prestation) => {
        const service = await prestationService.getById(prestation.service);
        return { ...prestation, duration: service?.duration || 0 };
      })
    );

    const totalDuration = prestationsWithDetails.reduce(
      (sum, prestation) => sum + prestation.duration,
      0
    );

    // Calculer le jour de la semaine pour la date du rendez-vous
    const appointmentDate = new Date(appointmentData.date);
    const dayOfWeek = appointmentDate.toLocaleString("en-US", {
      weekday: "long",
    });

    // Vérifier si le mécanicien a suffisamment d'heures disponibles pour ce jour
    const maxHoursForDay = mechanic.workingHours.get(dayOfWeek) || 0;
    if (maxHoursForDay < totalDuration) {
      throw new Error(
        `Le mécanicien n'a pas suffisamment d'heures disponibles pour le ${dayOfWeek}.`
      );
    }

    // Mettre à jour les heures restantes pour ce jour
    mechanic.workingHours.set(dayOfWeek, maxHoursForDay - totalDuration);
    await mechanic.save();

    const appointment = new Appointment(appointmentData);
    await appointment.save();

    await interventionService.createIntervention({
      appointment: appointment._id,
      products: interventionData,
    });

    return appointment;
  } catch (error) {
    console.error("Erreur lors de la création du rendez-vous :", error);
    throw new Error("Impossible de créer le rendez-vous.");
  }
}

async function getAvailableMechanics(date, prestations) {
  try {
    const mechanics = await userService.getAllMechanics();

    const services = await prestationService.findServicesByPrestations(
      prestations
    );

    const totalDuration = services.reduce(
      (acc, service) => acc + service.duration,
      0
    );

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

    // Filtrer les mécaniciens disponibles
    const availableMechanics = mechanics.filter((mechanic) => {
      const dayOfWeek = new Date(date).toLocaleString("en-US", {
        weekday: "long",
      });
      const maxHoursForDay = mechanic.workingHours.get(dayOfWeek) || 0; // Heures max pour ce jour
      const workedHours = workloadMap[mechanic._id] || 0; // Heures déjà travaillées
      const remainingHours = maxHoursForDay - workedHours; // Heures restantes

      // Vérifier si le mécanicien a suffisamment d'heures restantes pour la durée totale des prestations
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

async function getListAppointmentByMechanic(mechanic) {
  try {
    const tasks = await Appointment.find({ mechanic: mechanic, status: false })
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
    throw new Error("Error :", error);
  }
}

async function getListAppointmentByMechanic(mechanic) {
  try {
    const tasks = await Appointment.find({ mechanic: mechanic, status: false })
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
    return tasks;
  } catch (error) {
    throw new Error("Error :", error);
  }
}

const completeTask = async (id) => {
  try {
    return await Appointment.findByIdAndUpdate(
      id,
      { $set: { status: true } },
      { new: true }
    );
  } catch (error) {
    throw new Error("Error :", error);
  }
};

const getClientAppointments = async (clientId) => {
  try {
    return await Appointment.find({ client: clientId })
      .populate({
        path: "vehicle",
        populate: {
          path: "model",
          populate: {
            path: "brand",
            select: "name",
          },
        },
      })
      .populate({ path: "prestations.service", select: "name" })
      .populate({ path: "mechanic", select: "firstname lastname" });
  } catch (error) {
    throw new Error("Error: " + error);
  }
};

module.exports = {
  getAvailableMechanics,
  createAppointment,
  getAllAppointment,
  getListAppointmentByMechanic,
  completeTask,
  getClientAppointments,
};
