const Appointment = require("./appointmentModel");
const Service = require("../service/serviceModel");
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

async function getAvailableMechanics(serviceIds, date, time) {
  const finalMechanicsAvailable = new Set();

  // Récupérer les services associés aux IDs donnés
  const services = await Service.find({ _id: { $in: serviceIds } });

  if (services.length !== serviceIds.length) {
    throw new Error(
      "Certains services sont introuvables ou ont une durée non définie."
    );
  }

  // Convertir la date et l'heure en UTC proprement
  const [hours, minutes] = time.split(":").map(Number);
  const startTime = new Date(date);
  startTime.setUTCHours(hours, minutes, 0, 0); // ⚠️ Met en UTC directement

  console.log("Start Time (UTC):", startTime.toISOString());

  let busyMechanics = new Set();

  for (let service of services) {
    const [serviceHours, serviceMinutes] = service.duration
      .split(":")
      .map(Number);

    // Calcul de l'heure de fin (toujours en UTC)
    const endTime = new Date(startTime);
    endTime.setUTCHours(
      startTime.getUTCHours() + serviceHours,
      startTime.getUTCMinutes() + serviceMinutes
    );

    console.log("End Time (UTC):", endTime.toISOString());

    // Définir le début et la fin de la journée en UTC
    const startOfDay = new Date(date);
    startOfDay.setUTCHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setUTCHours(23, 59, 59, 999);

    // Récupérer tous les rendez-vous sur la journée donnée
    const sameDayAppointments = await Appointment.find({
      date: { $gte: startOfDay, $lte: endOfDay },
    });

    // Vérifier les conflits d'horaires pour les mécaniciens
    for (let appointment of sameDayAppointments) {
      const appointmentStartTime = new Date(appointment.date); // ⚠️ Directement UTC depuis MongoDB

      for (let repair of appointment.repairs) {
        const repairService = await Service.findById(repair.service);
        if (!repairService || !repairService.duration) {
          console.log("Service introuvable ou durée absente:", repair.service);
          continue;
        }

        const [repairHours, repairMinutes] = repairService.duration
          .split(":")
          .map(Number);
        const appointmentEndTime = new Date(appointmentStartTime);
        appointmentEndTime.setUTCHours(
          appointmentStartTime.getUTCHours() + repairHours,
          appointmentStartTime.getUTCMinutes() + repairMinutes
        );

        console.log(`🔍 Vérification chevauchement :`);
        console.log(`   📌 startTime: ${startTime.toISOString()}`);
        console.log(`   📌 endTime: ${endTime.toISOString()}`);
        console.log(
          `   📌 appointmentStartTime: ${appointmentStartTime.toISOString()}`
        );
        console.log(
          `   📌 appointmentEndTime: ${appointmentEndTime.toISOString()}`
        );

        // Vérifier s'il y a un chevauchement
        if (startTime < appointmentEndTime && endTime > appointmentStartTime) {
          console.log(
            "🚨 Chevauchement détecté pour le mécanicien :",
            repair.user
          );
          busyMechanics.add(repair.user.toString());
        }
      }
    }
  }

  console.log("🚧 Mécaniciens occupés :", [...busyMechanics]);

  // Chercher les mécaniciens disponibles
  const availableMechanics = await User.find({
    specialities: { $in: serviceIds },
    _id: { $nin: [...busyMechanics] }, // Exclure les mécaniciens occupés
  }).select("_id firstname");

  return availableMechanics; // Retourner sous forme de tableau
}

module.exports = { getAvailableMechanics, createAppointment };
