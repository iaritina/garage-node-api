const router = require("express").Router();
const appointmentService = require("./appointmentService");

router.get("/", async (req, res) => {
  try {
    let { serviceId, date, time } = req.query;

    if (!Array.isArray(serviceId)) {
      serviceId = [serviceId];
    }
    const localDate = new Date(`${date}T${time}:00`);
    const utcDate = new Date(
      localDate.getTime() - localDate.getTimezoneOffset() * 60000
    );

    console.log("Date locale reçue :", localDate);
    console.log("Date convertie en UTC :", utcDate);

    const mechanics = await appointmentService.getAvailableMechanics(
      serviceId,
      utcDate.toISOString().split("T")[0],
      utcDate.toISOString().split("T")[1].slice(0, 5)
    );

    res.json(mechanics);
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

module.exports = router;
