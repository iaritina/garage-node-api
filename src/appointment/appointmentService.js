const Appointment = require("./appointmentModel");
const prestationService = require("../service/service");
const userService = require("../users/userService");
const interventionService = require("../intervention/interventionService");
const sendEmail = require("../mail/mailer");
const Product = require("../product/productService");
const Brand = require("../vehiculeBrands/brandModel");
const mechanicService = require("../mechanic/mechanicService");

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

    const appointmentDate = new Date(appointmentData.date);
    const dayOfWeek = appointmentDate.toLocaleString("en-US", {
      weekday: "long",
    });

    const maxHoursForDay = mechanic.workingHours.get(dayOfWeek) || 0;
    if (maxHoursForDay < totalDuration) {
      throw new Error(
        `Le mécanicien n'a pas suffisamment d'heures disponibles pour le ${dayOfWeek}.`
      );
    }

    mechanic.workingHours.set(dayOfWeek, maxHoursForDay - totalDuration);
    await mechanic.save();

    const appointment = new Appointment(appointmentData);
    await appointment.save();

    await interventionService.createIntervention({
      appointment: appointment._id,
      products: interventionData,
    });

    const user = await userService.getUserById(appointmentData.client);

    const totalLaborCost = appointmentData.prestations.reduce(
      (sum, prestation) => sum + prestation.price,
      0
    );

    const interventionDataWithProductDetails = await Promise.all(
      interventionData.map(async (item) => {
        const populatedProduct = await Product.getProductById(item.product);
        return {
          product: populatedProduct.name,
          price: item.price,
          quantity: item.quantity,
          total: item.price * item.quantity,
        };
      })
    );

    const totalAmount =
      interventionDataWithProductDetails.reduce(
        (sum, item) => sum + item.total,
        0
      ) + totalLaborCost;

    sendEmail(user.email, "Facture", "invoice", {
      invoiceDate: new Date().toLocaleDateString(),
      intervention: interventionDataWithProductDetails,
      totalAmount: totalAmount,
      totalLaborCost: totalLaborCost,
    });

    return appointment;
  } catch (error) {
    console.error("Erreur lors de la création du rendez-vous :", error);
    throw new Error("Impossible de créer le rendez-vous.");
  }
}

async function getAvailableMechanics(date, prestations) {
  try {
    const mechanics = await mechanicService.getAllMechanics();

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

const getClientAppointments = async (
  clientId,
  vehicleId = null,
  mechanicId = null,
  serviceId = null,
  startDate = null,
  endDate = null
) => {
  try {
    const filters = { client: clientId }; //objet littéral base

    if (vehicleId) {
      filters.vehicle = vehicleId;
    }
    if (mechanicId) {
      filters.mechanic = mechanicId;
    }
    if (serviceId) {
      filters["prestations.service"] = serviceId;
    }
    if (startDate || endDate) {
      filters.date = {};
      if (startDate) {
        filters.date.$gte = new Date(startDate); // Date de début
      }
      if (endDate) {
        const endOfDay = new Date(endDate);
        endOfDay.setHours(23, 59, 59, 999);
        filters.date.$lte = endOfDay;
      }
    }

    return await Appointment.find(filters)
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

//stat - nombre de visite de chaque marque
const getAppointmentStatsByBrand = async (year = null) => {
  try {
    const stats = await Brand.aggregate([
      {
        $lookup: {
          from: "models",
          localField: "_id",
          foreignField: "brand",
          as: "models",
        },
      },
      { $unwind: { path: "$models", preserveNullAndEmptyArrays: true } },

      {
        $lookup: {
          from: "vehicles",
          localField: "models._id",
          foreignField: "model",
          as: "vehicles",
        },
      },
      { $unwind: { path: "$vehicles", preserveNullAndEmptyArrays: true } },

      {
        $lookup: {
          from: "appointments",
          let: { vehicleId: "$vehicles._id" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$vehicle", "$$vehicleId"] },
                ...(year
                  ? {
                      date: {
                        $gte: new Date(`${year}-01-01T00:00:00.000Z`),
                        $lte: new Date(`${year}-12-31T23:59:59.999Z`),
                      },
                    }
                  : {}),
              },
            },
          ],
          as: "appointments",
        },
      },
      {
        $addFields: {
          appointmentCount: { $size: "$appointments" },
        },
      },

      {
        $group: {
          _id: "$name",
          appointmentCount: { $sum: "$appointmentCount" },
        },
      },

      {
        $project: {
          _id: 0,
          name: "$_id",
          appointmentCount: 1,
        },
      },

      {
        $sort: { appointmentCount: -1 },
      },
    ]);

    return stats;
  } catch (error) {
    console.error("Erreur lors de la récupération des statistiques :", error);
    throw new Error("Impossible de récupérer les statistiques.");
  }
};

module.exports = {
  getAvailableMechanics,
  createAppointment,
  getAllAppointment,
  getListAppointmentByMechanic,
  completeTask,
  getClientAppointments,
  getAppointmentStatsByBrand,
};
