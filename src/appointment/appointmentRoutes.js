const router = require("express").Router();
const appointmentService = require("./appointmentService");

router.post("/available-mechanics", async (req, res) => {
  try {
    const { date, prestations } = req.body;

    if (
      !date ||
      !prestations ||
      !Array.isArray(prestations) ||
      prestations.length === 0
    ) {
      return res
        .status(400)
        .json({ error: "Date et prestations sont requis." });
    }

    const availableMechanics = await appointmentService.getAvailableMechanics(
      date,
      prestations
    );

    if (availableMechanics.length === 0) {
      return res
        .status(200)
        .json({ message: "Aucun mécanicien disponible pour cette date." });
    }

    res.json(availableMechanics);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

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


router.get("/monitoring", async(req, res) => {
  try {
      const appointments = await appointmentService.getAllAppointment();
      res.status(200).json(appointments)
  } catch (error) {
    res.status(400).json({error: error.message});
  }
})

module.exports = router;
