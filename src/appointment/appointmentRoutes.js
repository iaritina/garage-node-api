const router = require("express").Router();
const appointmentService = require("./appointmentService");

router.get("/", async (req, res) => {
  try {
    let { serviceId, date, time } = req.query;

    // S'assurer que serviceId est un tableau, même s'il y a un seul élément
    if (!Array.isArray(serviceId)) {
      serviceId = [serviceId]; // Convertir en tableau si un seul élément
    }
    const localDate = new Date(`${date}T${time}:00`); // Date en heure locale
    const utcDate = new Date(
      localDate.getTime() - localDate.getTimezoneOffset() * 60000
    );

    console.log("Date locale reçue :", localDate);
    console.log("Date convertie en UTC :", utcDate);

    const mechanics = await appointmentService.getAvailableMechanics(
      serviceId, // Maintenant un tableau
      utcDate.toISOString().split("T")[0], // Garder uniquement la partie date
      utcDate.toISOString().split("T")[1].slice(0, 5) // Garder HH:mm
    );

    res.json(mechanics);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route pour créer un rendez-vous
router.post("/", async (req, res) => {
  try {
    const appointmentData = req.body;
    const appointment = await appointmentService.createAppointment(
      appointmentData
    );
    res.status(201).json(appointment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
