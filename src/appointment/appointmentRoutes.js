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
    const appointment = await appointmentService.createAppointment(
      req.body.appointment,req.body.intervention
    );
    res.status(201).json(appointment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/monitoring", async (req, res) => {
  try {
    const appointments = await appointmentService.getAllAppointment();
    res.status(200).json(appointments);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get("/mechanic-task/:id", async (req, res) => {
  try {
    const task = await appointmentService.getListAppointmentByMechanic(
      req.params.id
    );
    console.log("task", task);
    res.status(200).json(task);
  } catch (error) {
    res.status(400).json({ error: error });
  }
});

router.put("/complete-task/:id", async (req, res) => {
  try {
    const task = await appointmentService.completeTask(req.params.id);
    res.status(200).json(task);
  } catch (error) {
    res.status(400).json({ error: error });
  }
});

router.get("/client/:clientId", async (req, res) => {
  try {
    const clientId = req.params.clientId;
    const clientAppt = await appointmentService.getClientAppointments(clientId);
    res.status(200).json(clientAppt);
  } catch (error) {
    res.status(400).json({ error: error });
  }
});

module.exports = router;
