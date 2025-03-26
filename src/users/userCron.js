const cron = require("node-cron");
const mechanicService = require("./userService");

async function resetWorkingHours() {
  try {
    console.log("🔄 Réinitialisation des heures de travail des mécaniciens...");

    const currentDay = new Date().toLocaleString("en-US", {
      weekday: "long",
    });

    const mechanics = await mechanicService.getAllMechanics();

    for (const mechanic of mechanics) {
      if (mechanic.workingHours.has(currentDay)) {
        mechanic.workingHours.set(currentDay, 480);
        await mechanic.save();
        console.log(`Mise à jour réussie pour ${mechanic.firstname}`);
      } else {
        console.log(
          `Jour non trouvé dans workingHours pour ${mechanic.firstname}`
        );
      }
    }
  } catch (error) {
    console.error("Erreur lors de la réinitialisation :", error);
  }
}

cron.schedule("0 0 * * *", resetWorkingHours, {
  timezone: "Indian/Antananarivo",
});

module.exports = { resetWorkingHours };
