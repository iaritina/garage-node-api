const cron = require("node-cron");
const User = require("./userModel"); // Adapter le chemin selon ton projet

// Planifier le cron job chaque jour à minuit (00:00)
cron.schedule("0 0 * * *", async () => {
  try {
    console.log("🔄 Réinitialisation des heures de travail des mécaniciens...");

    // Mettre maxWorkinghours à 480 pour tous les mécaniciens
    const result = await User.updateMany(
      { role: "mecanicien" }, // Filtrer uniquement les mécaniciens
      { $set: { maxWorkinghours: 480 } }
    );

    console.log(`✅ ${result.modifiedCount} mécanicien(s) réinitialisé(s).`);
  } catch (error) {
    console.error("❌ Erreur lors de la réinitialisation :", error);
  }
});
